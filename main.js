/* =========================================
    Gemini Vision AI Analysis
    ========================================= */

async function analyzeImage(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function (e) {
        const base64Data = e.target.result.split(',')[1]; // Remove data:image/...;base64, prefix
        const mimeType = file.type;

        try {
            const response = await fetch('/.netlify/functions/gemini-vision', {
                method: 'POST', // MUST be POST
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: { data: base64Data, mimeType }
                }),
            });

            const result = await response.json();

            console.log('AI Description:', result.description || result.error);

            // Optional: show result on page
            const resultContainer = document.getElementById('ai-result');
            if (resultContainer) resultContainer.innerText = result.description || result.error;

        } catch (err) {
            console.error('Error calling Gemini function:', err);
        }
    };

    reader.readAsDataURL(file);
}

// HTML elements
const fileInput = document.getElementById('imageInput');
const analyzeButton = document.getElementById('analyzeButton');

if (analyzeButton && fileInput) {
    analyzeButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        analyzeImage(file);
    });
}
