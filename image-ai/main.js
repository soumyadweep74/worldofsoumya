// Image AI Analysis
async function analyzeImage(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        const base64Data = e.target.result.split(',')[1];
        const mimeType = file.type;

        try {
            const response = await fetch('/.netlify/functions/gemini-vision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: { data: base64Data, mimeType } })
            });

            const result = await response.json();
            document.getElementById('ai-result').innerText = result.description || result.error;

        } catch (err) {
            console.error('Error:', err);
        }
    };
    reader.readAsDataURL(file);
}

document.getElementById('analyzeButton').addEventListener('click', () => {
    const file = document.getElementById('imageInput').files[0];
    analyzeImage(file);
});
