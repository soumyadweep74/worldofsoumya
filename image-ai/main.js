const UPLOAD_FORM = document.getElementById('upload-form');
const IMAGE_INPUT = document.getElementById('image-input');
const IMAGE_DISPLAY = document.getElementById('image-display');
const ANALYZE_BUTTON = document.getElementById('analyze-button');
const RESULTS_DIV = document.getElementById('analysis-results');

// URL for your Netlify Function
const FUNCTION_URL = '/.netlify/functions/gemini-vision';

// --- Utility Functions ---

/**
 * Converts a File object to a base64-encoded string and extracts mimeType
 * @param {File} file
 * @returns {Promise<{data: string, mimeType: string}>}
 */
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Data URL format: data:[<mime type>][;base64],<data>
            const [metadata, data] = reader.result.split(',');
            const mimeType = metadata.split(':')[1].split(';')[0];
            resolve({ data, mimeType }); // Returns the required {data, mimeType} object
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
};

/**
 * Sends the base64 image data to the Netlify Function for AI analysis
 * @param {{data: string, mimeType: string}} imageBase64Data
 * @returns {Promise<string>} The AI generated description
 */
const generateImageDescription = async (imageBase64Data) => {
    const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageBase64Data }), // Sends the correct {image: {data, mimeType}} structure
    });

    if (!response.ok) {
        // Attempt to parse error message from function
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorJson = JSON.parse(errorText);
            // This is the error message from the server function:
            errorMessage = errorJson.error || errorMessage; 
        } catch (e) {
            // If response is not JSON, use the HTTP status
        }
        throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.description;
};

// --- Event Handlers ---

IMAGE_INPUT.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        // Display image preview
        const reader = new FileReader();
        reader.onload = (e) => {
            IMAGE_DISPLAY.src = e.target.result;
            IMAGE_DISPLAY.style.display = 'block';
            ANALYZE_BUTTON.disabled = false;
        };
        reader.readAsDataURL(file);
    } else {
        IMAGE_DISPLAY.style.display = 'none';
        ANALYZE_BUTTON.disabled = true;
    }
    // Clear previous results
    RESULTS_DIV.innerHTML = '';
});

UPLOAD_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = IMAGE_INPUT.files[0];
    if (!file) {
        RESULTS_DIV.innerHTML = '<p class="error">Please select an image first.</p>';
        return;
    }

    RESULTS_DIV.innerHTML = '<p class="loading">Analyzing image... This may take a moment.</p>';
    ANALYZE_BUTTON.disabled = true;

    try {
        const imageBase64Data = await fileToBase64(file);
        const description = await generateImageDescription(imageBase64Data);

        // Display success results
        RESULTS_DIV.innerHTML = `
            <h3>Analysis Complete</h3>
            <p class="description">${description}</p>
        `;
    } catch (error) {
        // Display error message
        console.error("Analysis failed:", error);
        RESULTS_DIV.innerHTML = `
            <p class="error">Error during analysis. Please ensure Netlify Function is deployed and the API Key is set.</p>
            <p class="error-detail">Details: ${error.message}</p>
        `;
    } finally {
        ANALYZE_BUTTON.disabled = false;
    }
});
