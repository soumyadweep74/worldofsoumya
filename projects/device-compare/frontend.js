let deviceCount = 0;
let selectedDevices = [];

function setDeviceCount(count){
  deviceCount = count;
  document.getElementById('step1').style.display = 'none';
  showStep2();
}

function showStep2(){
  const container = document.getElementById('category-selection');
  container.innerHTML = '';
  selectedDevices = [];

  for(let i=0;i<deviceCount;i++){
    const div = document.createElement('div');
    div.innerHTML = `
      <label>Device ${i+1}:</label>
      <input type="text" id="device${i}" placeholder="Type device name..." autocomplete="off" />
      <div class="suggestions" id="suggestions${i}"></div>
    `;
    container.appendChild(div);

    const input = document.getElementById(`device${i}`);
    const sugg = document.getElementById(`suggestions${i}`);

    input.addEventListener('input', async ()=>{
      const query = input.value.trim();
      if(query.length < 2){
        sugg.innerHTML = '';
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:8000/suggest', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({query})
        });
        const data = await res.json();
        sugg.innerHTML = '';
        data.suggestions.forEach(name=>{
          const item = document.createElement('div');
          item.className = 'suggestion-item';
          item.innerText = name;
          item.onclick = ()=>{
            input.value = name;
            selectedDevices[i] = name;
            sugg.innerHTML = '';
          };
          sugg.appendChild(item);
        });
      } catch(err){
        console.error(err);
      }
    });
  }

  document.getElementById('step2').style.display='block';
}

async function goToStep3(){
  // Collect device names
  const devices = [];
  for(let i=0;i<deviceCount;i++){
    const val = document.getElementById(`device${i}`).value.trim();
    if(!val){ alert(`Enter name for Device ${i+1}`); return; }
    devices.push(val);
  }

  document.getElementById('step2').style.display='none';
  document.getElementById('step3').style.display='block';
  const container = document.getElementById('model-selection');
  container.innerHTML = '<p>Generating AI comparison... 🚀</p>';

  try {
    const res = await fetch('http://127.0.0.1:8000/compare', {
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

  container.innerHTML = data.comparison;
  document.getElementById('step3').style.display='none';
  document.getElementById('step4').style.display='block';
}

function restart(){
  document.getElementById('step4').style.display='none';
  document.getElementById('step1').style.display='block';
}
