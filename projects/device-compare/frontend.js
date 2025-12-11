let deviceCount = 0;
let categories = [];
let selectedDevices = [];
let devicesData = {};

// Load sample data
fetch('sample_data.json')
  .then(res => res.json())
  .then(data => devicesData = data);

function setDeviceCount(count){
  deviceCount = count;
  document.getElementById('step1').style.display = 'none';
  showStep2();
}

function showStep2(){
  const container = document.getElementById('category-selection');
  container.innerHTML = '';
  categories = [];
  for(let i=0;i<deviceCount;i++){
    const div = document.createElement('div');
    div.innerHTML = `
      <label>Device ${i+1} Category:</label>
      <select id="category${i}">
        ${Object.keys(devicesData).map(cat=>`<option value="${cat}">${cat}</option>`).join('')}
      </select>
    `;
    container.appendChild(div);
  }
  document.getElementById('step2').style.display='block';
}

function goToStep3(){
  categories = [];
  for(let i=0;i<deviceCount;i++){
    const cat = document.getElementById(`category${i}`).value;
    categories.push(cat);
  }
  document.getElementById('step2').style.display='none';
  showStep3();
}

function showStep3(){
  const container = document.getElementById('model-selection');
  container.innerHTML='';
  selectedDevices = [];
  for(let i=0;i<deviceCount;i++){
    const div = document.createElement('div');
    div.innerHTML = `
      <label>Device ${i+1} Model (${categories[i]}):</label>
      <input type="text" id="search${i}" placeholder="Type model name...">
      <div class="suggestions" id="suggestions${i}"></div>
    `;
    container.appendChild(div);

    const input = document.getElementById(`search${i}`);
    const sugg = document.getElementById(`suggestions${i}`);
    input.addEventListener('input', ()=>{
      const query = input.value.toLowerCase();
      sugg.innerHTML='';
      if(query.length<2) return;
      const matches = devicesData[categories[i]].filter(d=>d.name.toLowerCase().includes(query));
      matches.forEach(d=>{
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.innerText = d.name;
        item.onclick = ()=>{
          input.value=d.name;
          sugg.innerHTML='';
          selectedDevices[i]=d;
        };
        sugg.appendChild(item);
      });
    });
  }
  document.getElementById('step3').style.display='block';
}

function generateComparison(){
  // Collect selected devices if not already
  for(let i=0;i<deviceCount;i++){
    const val = document.getElementById(`search${i}`).value;
    if(!selectedDevices[i] || selectedDevices[i].name!==val){
      const found = devicesData[categories[i]].find(d=>d.name===val);
      selectedDevices[i]=found;
    }
  }

  const container = document.getElementById('comparison-results');
  container.innerHTML='';

  // Advantages & Disadvantages
  selectedDevices.forEach((d,i)=>{
    if(!d) return;
    const adv = `<h3>✅ Device ${i+1} — Advantages</h3><ul>${d.pros.map(p=>`<li>${p}</li>`).join('')}</ul>`;
    const disadv = `<h3>❌ Device ${i+1} — Disadvantages</h3><ul>${d.cons.map(c=>`<li>${c}</li>`).join('')}</ul>`;
    container.innerHTML+=adv+disadv+'<hr>';
  });

  // Simple side-by-side table for common keys
  const keys = new Set();
  selectedDevices.forEach(d=>Object.keys(d).forEach(k=>keys.add(k)));
  const commonKeys = Array.from(keys).filter(k=>!['pros','cons'].includes(k));

  let table = '<h3>⭐ Side-by-Side Comparison Table</h3><table><tr><th>Feature</th>';
  selectedDevices.forEach(d=>table+=`<th>${d.name}</th>`); table+='</tr>';
  commonKeys.forEach(k=>{
    table+='<tr><td>'+k+'</td>';
    selectedDevices.forEach(d=>table+=`<td>${d[k] || '-'}</td>`);
    table+='</tr>';
  });
  table+='</table>';

  container.innerHTML+=table;

  // Simple AI-style verdict
  container.innerHTML+=`<h3>🚀 AI-Style Verdict</h3><p>This is a sample AI verdict based on device specs. Recommendations can be dynamically generated later.</p>`;

  document.getElementById('step3').style.display='none';
  document.getElementById('step4').style.display='block';
}

function restart(){
  document.getElementById('step4').style.display='none';
  document.getElementById('step1').style.display='block';
}
