let deviceCount = 0;

// Step 1
function setDeviceCount(count){
  deviceCount = count;
  document.getElementById('step1').style.display = 'none';
  showStep2();
}

// Step 2
function showStep2(){
  const container = document.getElementById('category-selection');
  container.innerHTML = '';
  for(let i=0;i<deviceCount;i++){
    const div = document.createElement('div');
    div.innerHTML = `
      <label>Device ${i+1} Name:</label>
      <input type="text" id="device${i}" placeholder="Type device name..." />
    `;
    container.appendChild(div);
  }
  document.getElementById('step2').style.display='block';
}

// Step 3
async function goToStep3(){
  const devices = [];
  for(let i=0;i<deviceCount;i++){
    const name = document.getElementById(`device${i}`).value.trim();
    if(!name){ alert(`Enter name for Device ${i+1}`); return; }
    devices.push(name);
  }

  document.getElementById('step2').style.display='none';
  document.getElementById('step3').style.display='block';
  const container = document.getElementById('model-selection');
  container.innerHTML = '<p>Generating AI comparison... 🚀</p>';

  try {
    const res = await fetch('/compare', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({devices})
    });
    const data = await res.json();
    displayResults(data);
  } catch(err){
    container.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
}

function displayResults(data){
  const container = document.getElementById('comparison-results');
  container.innerHTML = '';

  if(data.error){
    container.innerHTML = `<p style="color:red;">${data.error}</p>`;
    return;
  }

  container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  document.getElementById('step3').style.display='none';
  document.getElementById('step4').style.display='block';
}

function restart(){
  document.getElementById('step4').style.display='none';
  document.getElementById('step1').style.display='block';
}
