const imageUpload = document.getElementById('imageUpload');
const webcamToggle = document.getElementById('webcamToggle');
const captureButton = document.getElementById('captureButton');
const webcamFeed = document.getElementById('webcamFeed');
const imagePreview = document.getElementById('imagePreview');
const webcamContainer = document.querySelector('.webcam-container');
const statusMessage = document.getElementById('statusMessage');
const labelList = document.getElementById('labelList');
const imageCanvas = document.getElementById('imageCanvas');
let stream = null; // To hold the camera stream

// --- Utility Functions ---

// Function to convert file to Base64 string
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        // Only need the Base64 part after the comma
        reader.onload = () => resolve(reader.result.split(',')[1]); 
        reader.onerror = (error) => reject(error);
    });
}

// Function to send the image to the AI service
async function sendImageToAI(imageFile) {
    // 1. Update UI Status
    statusMessage.textContent = 'Analyzing image... Please wait.';
    labelList.innerHTML = ''; // Clear previous results

    try {
        // 2. Convert File to Base64 
        const base64Image = await fileToBase64(imageFile);

        // 3. Define the API Payload
        const payload = {
            image: base64Image,
            prompt: "Describe the image and list all identifiable objects." 
        };

        // 4. Send Request to a (secure) backend endpoint.
        // NOTE: This URL '/.netlify/functions/gemini-vision' is the final URL 
        // we will use after setting up the Netlify function.
        
        // --- For now, we show a DUMMY result ---
        
        statusMessage.textContent = "Analysis Complete: (DUMMY Result)";
        const dummyLabels = ["Object identified: Toy Car", "Color detected: Red and Blue", "Environment: Desk"];
        dummyLabels.forEach(label => {
            const li = document.createElement('li');
            li.textContent = label + " (Placeholder)";
            labelList.appendChild(li);
        });

    } catch (error) {
        console.error('AI Analysis Failed:', error);
        statusMessage.textContent = 'Error during analysis. Check the console for details.';
    }
}


// --- A. Handle File Upload ---
imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = 'block';
        
        // Hide webcam elements if active
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            webcamContainer.style.display = 'none';
            webcamToggle.textContent = 'Start Camera';
            captureButton.disabled = true;
        }
        
        // Call the AI function
        sendImageToAI(file);
    }
});


// --- B. Handle Webcam Toggle ---
webcamToggle.addEventListener('click', async () => {
    if (stream) {
        // Stop the camera if it's running
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        webcamContainer.style.display = 'none';
        webcamToggle.textContent = 'Start Camera';
        captureButton.disabled = true;
    } else {
        // Start the camera
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            webcamFeed.srcObject = stream;
            webcamContainer.style.display = 'block';
            webcamToggle.textContent = 'Stop Camera';
            captureButton.disabled = false;
            imagePreview.style.display = 'none'; // Hide image preview
        } catch (error) {
            alert('Cannot access camera. Please check permissions.');
            console.error('Webcam Error:', error);
        }
    }
});


// --- C. Handle Capture Button (Snapshot) ---
captureButton.addEventListener('click', () => {
    const context = imageCanvas.getContext('2d');
    
    // Set canvas dimensions to match video feed
    imageCanvas.width = webcamFeed.videoWidth;
    imageCanvas.height = webcamFeed.videoHeight;
    
    // Draw the current frame of the video onto the canvas
    context.drawImage(webcamFeed, 0, 0, imageCanvas.width, imageCanvas.height);
    
    // Convert the canvas image to a file object
    imageCanvas.toBlob(function(blob) {
        const capturedFile = new File([blob], "capture.png", { type: "image/png" });
        
        // Display the captured image preview
        imagePreview.src = URL.createObjectURL(capturedFile);
        imagePreview.style.display = 'block';
        
        // Stop the camera after capture
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        webcamContainer.style.display = 'none';
        webcamToggle.textContent = 'Start Camera';
        captureButton.disabled = true;

        // Call the AI function
        sendImageToAI(capturedFile);

    }, 'image/png');
});
