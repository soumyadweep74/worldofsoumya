const imageUpload = document.getElementById('imageUpload');
const webcamToggle = document.getElementById('webcamToggle');
const captureButton = document.getElementById('captureButton');
const webcamFeed = document.getElementById('webcamFeed');
const imagePreview = document.getElementById('imagePreview');
const webcamContainer = document.querySelector('.webcam-container');
const statusMessage = document.getElementById('statusMessage');
const labelList = document.getElementById('labelList');
const imageCanvas = document.getElementById('imageCanvas');
let stream = null; 

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); 
        reader.onerror = (error) => reject(error);
    });
}

// THIS IS THE FINAL CODE BLOCK THAT CALLS THE NETLIFY FUNCTION
async function sendImageToAI(imageFile) {
    statusMessage.textContent = 'Analyzing image... Please wait.';
    labelList.innerHTML = ''; 

    try {
        const base64Image = await fileToBase64(imageFile);

        const payload = {
            image: base64Image,
            prompt: "Describe the image in one sentence. Then, list all identifiable objects or labels, each on a new line." 
        };

        // --- REAL API CALL ---
        const response = await fetch('/.netlify/functions/gemini-vision', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Serverless Function Error! Status: ${response.status}`);
        }

        const result = await response.json();
        
        // --- Display REAL Results ---
        if (result.description && result.labels) {
            statusMessage.textContent = `Analysis Complete: ${result.description}`;
            
            result.labels.forEach(label => {
                const li = document.createElement('li');
                li.textContent = label;
                labelList.appendChild(li);
            });
        } else {
            statusMessage.textContent = "Error: Could not parse AI response.";
            console.error("AI Response Structure Invalid:", result);
        }

    } catch (error) {
        console.error('AI Analysis Failed:', error);
        statusMessage.textContent = `Error during analysis. Please ensure Netlify Function is deployed and the API Key is set.`;
    }
}


// --- Event Listeners (Same as before) ---
imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = 'block';
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            webcamContainer.style.display = 'none';
            webcamToggle.textContent = 'Start Camera';
            captureButton.disabled = true;
        }
        sendImageToAI(file);
    }
});

webcamToggle.addEventListener('click', async () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        webcamContainer.style.display = 'none';
        webcamToggle.textContent = 'Start Camera';
        captureButton.disabled = true;
    } else {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            webcamFeed.srcObject = stream;
            webcamContainer.style.display = 'block';
            webcamToggle.textContent = 'Stop Camera';
            captureButton.disabled = false;
            imagePreview.style.display = 'none';
        } catch (error) {
            alert('Cannot access camera. Please check permissions.');
            console.error('Webcam Error:', error);
        }
    }
});

captureButton.addEventListener('click', () => {
    const context = imageCanvas.getContext('2d');
    
    imageCanvas.width = webcamFeed.videoWidth;
    imageCanvas.height = webcamFeed.videoHeight;
    context.drawImage(webcamFeed, 0, 0, imageCanvas.width, imageCanvas.height);
    
    imageCanvas.toBlob(function(blob) {
        const capturedFile = new File([blob], "capture.png", { type: "image/png" });
        
        imagePreview.src = URL.createObjectURL(capturedFile);
        imagePreview.style.display = 'block';
        
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        webcamContainer.style.display = 'none';
        webcamToggle.textContent = 'Start Camera';
        captureButton.disabled = true;

        sendImageToAI(capturedFile);

    }, 'image/png');
});
