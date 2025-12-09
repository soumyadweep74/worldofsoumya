const IMAGE_UPLOAD = document.getElementById('image-upload');
const WEBCAM_TOGGLE = document.getElementById('webcam-toggle');
const CAPTURE_BUTTON = document.getElementById('capture-button');
const WEBCAM_FEED = document.getElementById('webcam-feed');
const IMAGE_PREVIEW = document.getElementById('image-preview');
const WEBCAM_CONTAINER = document.querySelector('.webcam-container');
const STATUS_MESSAGE = document.getElementById('status-message');
const LABEL_LIST = document.getElementById('label-list');
const IMAGE_CANVAS = document.getElementById('image-canvas');
let stream = null; 

// URL for your Netlify Function
const FUNCTION_URL = '/.netlify/functions/gemini-vision';

// --- Utility Functions ---

/**
 * Converts a File object to a base64-encoded string and extracts mimeType
 * @param {File} file
 * @returns {Promise<{data: string, mimeType: string}>}
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Data URL format: data:[<mime type>][;base64],<data>
            const [metadata, data] = reader.result.split(',');
            const mimeType = metadata.split(':')[1].split(';')[0];
            resolve({ data, mimeType }); // Returns the required {data, mimeType} object
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

/**
 * Sends the image data to the Netlify Function for AI analysis
 */
async function sendImageToAI(file) {
    STATUS_MESSAGE.textContent = 'Analyzing image... Please wait.';
    LABEL_LIST.innerHTML = ''; 

    try {
        // Correctly prepare the image payload for the serverless function
        const imageBase64Data = await fileToBase64(file);

        const response = await fetch(FUNCTION_URL, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageBase64Data }), // Sends the correct {image: {data, mimeType}} structure
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Serverless Function Error! Status: ${response.status}`;
            try {
                const errorJson = JSON.parse(errorText);
                // This is the error message from the server function:
                errorMessage = errorJson.error || errorMessage; 
            } catch (e) {
                // Ignore parsing error
            }
            throw new Error(errorMessage);
        }

        const result = await response.json();
        
        // --- Display REAL Results ---
        if (result.description) {
            // The deployed function returns a description string
            STATUS_MESSAGE.textContent = `Analysis Complete:`;
            LABEL_LIST.innerHTML = `
                <li>${result.description}</li>
            `;
        } else {
            STATUS_MESSAGE.textContent = "Error: Could not parse AI response.";
            console.error("AI Response Structure Invalid:", result);
        }

    } catch (error) {
        console.error('AI Analysis Failed:', error);
        STATUS_MESSAGE.textContent = `Error during analysis. Please ensure Netlify Function is deployed and the API Key is set.`;
        LABEL_LIST.innerHTML = `<li class="error-detail">Details: ${error.message}</li>`;
    }
}


// --- Event Listeners ---
IMAGE_UPLOAD.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        IMAGE_PREVIEW.src = URL.createObjectURL(file);
        IMAGE_PREVIEW.style.display = 'block';
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            WEBCAM_CONTAINER.style.display = 'none';
            WEBCAM_TOGGLE.textContent = 'Start Camera';
            CAPTURE_BUTTON.disabled = true;
        }
        // CRITICAL: Automatically trigger analysis upon file selection
        sendImageToAI(file); 
    }
});

WEBCAM_TOGGLE.addEventListener('click', async () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        WEBCAM_CONTAINER.style.display = 'none';
        WEBCAM_TOGGLE.textContent = 'Start Camera';
        CAPTURE_BUTTON.disabled = true;
    } else {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            WEBCAM_FEED.srcObject = stream;
            WEBCAM_CONTAINER.style.display = 'block';
            WEBCAM_TOGGLE.textContent = 'Stop Camera';
            CAPTURE_BUTTON.disabled = false;
            IMAGE_PREVIEW.style.display = 'none';
        } catch (error) {
            alert('Cannot access camera. Please check permissions.');
            console.error('Webcam Error:', error);
        }
    }
});

CAPTURE_BUTTON.addEventListener('click', () => {
    const context = IMAGE_CANVAS.getContext('2d');
    
    IMAGE_CANVAS.width = WEBCAM_FEED.videoWidth;
    IMAGE_CANVAS.height = WEBCAM_FEED.videoHeight;
    context.drawImage(WEBCAM_FEED, 0, 0, IMAGE_CANVAS.width, IMAGE_CANVAS.height);
    
    IMAGE_CANVAS.toBlob(function(blob) {
        const capturedFile = new File([blob], "capture.png", { type: "image/png" });
        
        IMAGE_PREVIEW.src = URL.createObjectURL(capturedFile);
        IMAGE_PREVIEW.style.display = 'block';
        
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            WEBCAM_CONTAINER.style.display = 'none';
            WEBCAM_TOGGLE.textContent = 'Start Camera';
            CAPTURE_BUTTON.disabled = true;
        }
        // CRITICAL: Automatically trigger analysis upon capture
        sendImageToAI(capturedFile); 

    }, 'image/png');
});
