const places=[
{name:'Истринское водохранилище',fish:['Щука','Окунь','Судак'],distance:55,lat:56.1,lon:36.8,desc:'Спиннинг, лодка, береговые точки.'},
{name:'Клязьминское водохранилище',fish:['Щука','Окунь','Карп'],distance:25,lat:56.03,lon:37.55,desc:'Удобно для короткой поездки.'},
{name:'Можайское водохранилище',fish:['Щука','Судак','Окунь'],distance:110,lat:55.55,lon:35.8,desc:'Большая акватория и разные форматы ловли.'}
];
const map=L.map('map').setView([55.75,37.4],8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);
let markers=[];
function render(){
const f=document.getElementById('fish').value;
const d=document.getElementById('distance').value;
const q=document.getElementById('search').value.toLowerCase();
const data=places.filter(p=>(f==='all'||p.fish.includes(f))&&(d==='all'||p.distance<=+d)&&(`${p.name} ${p.desc}`.toLowerCase().includes(q)));
document.getElementById('list').innerHTML=data.map(p=>`<article class="card"><h3>${p.name}</h3><div class="meta">${p.distance} км · ${p.fish.join(', ')}</div><p>${p.desc}</p><div class="actions"><button onclick="focusPlace(${places.indexOf(p)})">На карте</button><button class="secondary" onclick="route(${places.indexOf(p)})">Маршрут</button></div></article>`).join('')||'<p>Ничего не найдено. Измени фильтры.</p>';
markers.forEach(m=>map.removeLayer(m));
markers=data.map(p=>L.marker([p.lat,p.lon]).addTo(map).bindPopup(`<b>${p.name}</b><br>${p.fish.join(', ')}`));
}
function focusPlace(i){map.setView([places[i].lat,places[i].lon],12);markers.find(m=>m.getLatLng().lat===places[i].lat)?.openPopup()}
function route(i){location.href=`https://yandex.ru/maps/?rtext=~${places[i].lat},${places[i].lon}&rtt=auto`}
['fish','distance','search'].forEach(id=>document.getElementById(id).addEventListener('input',render));
render();
