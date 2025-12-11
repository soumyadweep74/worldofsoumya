let deviceCount = 0;
let categories = [];
let selectedDevices = [];

// Static device data
const devicesData = {
  "Smartphone": [
    {name: "iPhone 15", pros:["Fast","Camera"], cons:["Expensive"], CPU:"A17", RAM:"8GB", Battery:"4000mAh"},
    {name: "Samsung Galaxy S25", pros:["Display","Battery"], cons:["Pricey"], CPU:"Snapdragon 8 Gen 3", RAM:"12GB", Battery:"4500mAh"},
    {name: "OnePlus 13", pros:["Speed","Value"], cons:["Limited Camera"], CPU:"Snapdragon 8 Gen 3", RAM:"12GB", Battery:"4500mAh"}
  ],
  "Smartwatch": [
    {name: "Apple Watch Series 9", pros:["Health Tracking"], cons:["Pricey"], CPU:"S9", RAM:"1GB", Battery:"18h"},
    {name: "Samsung Galaxy Watch 7", pros:["Battery Life"], cons:["Limited Apps"], CPU:"Exynos W930", RAM:"2GB", Battery:"2 days"}
  ],
  "Smart Speaker": [
    {name: "Amazon Echo 5", pros:["Smart Home"], cons:["Limited Apps"], CPU:"Quad-core 1.5GHz", RAM:"512MB", Battery:"Plug-in"},
    {name: "Google Nest Audio 2", pros:["Good Sound"], cons:["No Battery"], CPU:"Quad-core 1.8GHz", RAM:"1GB", Battery:"Plug-in"}
  ]
};

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
  categories = [];
  for(let i=0;i<deviceCount;i++){
    const div = document.createElement('div');
    div.innerHTML = `
      <label>Device ${i+1} Category:</label>
      <select id="category${i}">
        <option value="">Select</option>
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
    if(!cat){ alert(`Select category for Device ${i+1}`); return; }
    categories.push(cat);
  }
  document.getElementById('step2').style.display='none';
  showStep3();
}

// Step 3
function showStep3(){
  const container = document.getElementById('model-selection');
  container.innerHTML='';
  selectedDevices = [];
  for(let i=0;i<deviceCount;i++){
    const div = document.createElement('div');
    const options = devicesData[categories[i]];
    div.innerHTML = `
      <label>Device ${i+1} Model (${categories[i]}):</label>
      <select id="model${i}">
        <option value="">Select Model</option>
        ${options.map(d=>`<option value="${d.name}">${d.name}</option>`).join('')}
      </select>
    `;
    container.appendChild(div);

    const select = document.getElementById(`model${i}`);
    select.addEventListener('change', ()=>{
      selectedDevices[i] = options.find(d=>d.name===select.value);
    });
  }
  document.getElementById('step3').style.display='block';
}

// Step 4
function generateComparison(){
  for(let i=0;i<deviceCount;i++){
    if(!selectedDevices[i]){ alert(`Select model for Device ${i+1}`); return; }
  }

  const container = document.getElementById('comparison-results');
  container.innerHTML='';

  // Advantages & Disadvantages
  selectedDevices.forEach((d,i)=>{
    const adv = `<h3>✅ Device ${i+1} — Advantages</h3><ul>${d.pros.map(p=>`<li>${p}</li>`).join('')}</ul>`;
    const disadv = `<h3>❌ Device ${i+1} — Disadvantages</h3><ul>${d.cons.map(c=>`<li>${c}</li>`).join('')}</ul>`;
    container.innerHTML+=adv+disadv+'<hr>';
  });

  // Side-by-side table
  const keys = ["CPU","RAM","Battery"];
  let table = '<h3>⭐ Side-by-Side Comparison Table</h3><table><tr><th>Feature</th>';
  selectedDevices.forEach(d=>table+=`<th>${d.name}</th>`); table+='</tr>';
  keys.forEach(k=>{
    table+='<tr><td>'+k+'</td>';
    selectedDevices.forEach(d=>table+=`<td>${d[k] || '-'}</td>`); 
    table+='</tr>';
  });
  table+='</table>';
  container.innerHTML+=table;

  // AI Verdict
  container.innerHTML+=`<h3>🚀 AI-Style Verdict</h3><p>This is a sample AI verdict based on device specs. Recommendations can be dynamically generated later.</p>`;

  document.getElementById('step3').style.display='none';
  document.getElementById('step4').style.display='block';
}

// Restart
function restart(){
  document.getElementById('step4').style.display='none';
  document.getElementById('step1').style.display='block';
}
