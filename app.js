const places = [
  {id:1,name:"Истринское водохранилище",lat:56.050,lon:36.800,fish:["Щука","Окунь","Судак"],methods:["Спиннинг"],distance:55,description:"Большой водоём с перспективными заливами и береговыми точками.",tips:"Лучше искать хищника на бровках и у травы."},
  {id:2,name:"Пироговское водохранилище",lat:56.050,lon:37.700,fish:["Щука","Окунь","Лещ"],methods:["Спиннинг","Фидер"],distance:25,description:"Популярное направление недалеко от Москвы.",tips:"Для мирной рыбы пригодятся фидерные монтажи."},
  {id:3,name:"Озеро Сенеж",lat:56.200,lon:37.000,fish:["Судак","Окунь","Лещ"],methods:["Спиннинг","Фидер"],distance:65,description:"Крупное озеро с разными сценариями ловли.",tips:"Проверь ветер и выбирай подветренные участки."},
  {id:4,name:"Москва-река у Бронниц",lat:55.420,lon:38.260,fish:["Щука","Окунь","Лещ"],methods:["Спиннинг","Фидер","Поплавок"],distance:55,description:"Речные точки с течением и разнообразным рельефом.",tips:"Не забывай о безопасном подходе к берегу."},
  {id:5,name:"Платный пруд — пример",lat:55.780,lon:37.450,fish:["Карп"],methods:["Карпфишинг","Фидер"],distance:18,description:"Демонстрационная точка для будущего каталога.",tips:"Перед поездкой уточни правила и стоимость."}
];

const map = L.map('map').setView([55.75,37.6], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

const markers = new Map();
places.forEach(p => {
  const marker = L.marker([p.lat,p.lon]).addTo(map).bindPopup(`<b>${p.name}</b><br>${p.fish.join(', ')}`);
  marker.on('click', () => showDetails(p));
  markers.set(p.id, marker);
});

const cards = document.getElementById('cards');
const count = document.getElementById('count');
const search = document.getElementById('search');
const fish = document.getElementById('fish');
const method = document.getElementById('method');

function showDetails(p){
  document.getElementById('details-content').innerHTML =
    `<h2>${p.name}</h2><p>${p.description}</p><p><b>Рыба:</b> ${p.fish.join(', ')}</p><p><b>Способы:</b> ${p.methods.join(', ')}</p><p><b>Расстояние:</b> около ${p.distance} км от Москвы</p><p><b>Совет:</b> ${p.tips}</p>`;
  document.getElementById('details').showModal();
}

function render(){
  const q = search.value.toLowerCase().trim();
  const filtered = places.filter(p =>
    (!q || `${p.name} ${p.fish.join(' ')} ${p.methods.join(' ')}`.toLowerCase().includes(q)) &&
    (!fish.value || p.fish.includes(fish.value)) &&
    (!method.value || p.methods.includes(method.value))
  );
  cards.innerHTML = filtered.map(p => `<article class="card" data-id="${p.id}">
    <h3>${p.name}</h3><div class="meta">≈ ${p.distance} км от Москвы</div>
    <div>${p.fish.map(x=>`<span class="tag">${x}</span>`).join('')}</div>
    <button>Подробнее</button>
  </article>`).join('');
  count.textContent = `${filtered.length} мест`;
  cards.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const p = places.find(x=>x.id===Number(card.dataset.id));
      map.flyTo([p.lat,p.lon], 12);
      showDetails(p);
    });
  });
  markers.forEach((marker,id)=>marker.setOpacity(filtered.some(p=>p.id===id)?1:0.25));
}
[search,fish,method].forEach(el=>el.addEventListener('input',render));
document.getElementById('close').addEventListener('click',()=>document.getElementById('details').close());
render();
