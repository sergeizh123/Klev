const places = [
  {id:1,name:"Истринское водохранилище",lat:56.050,lon:36.800,fish:["Щука","Окунь","Судак"],methods:["Спиннинг"],distance:55,description:"Большой водоём с перспективными заливами и береговыми точками.",tips:"Ищи хищника у травы, бровок и входов в заливы."},
  {id:2,name:"Пироговское водохранилище",lat:56.050,lon:37.700,fish:["Щука","Окунь","Лещ"],methods:["Спиннинг","Фидер"],distance:25,description:"Популярное направление недалеко от Москвы.",tips:"Для мирной рыбы подойдут фидерные монтажи."},
  {id:3,name:"Озеро Сенеж",lat:56.200,lon:37.000,fish:["Судак","Окунь","Лещ"],methods:["Спиннинг","Фидер"],distance:65,description:"Крупное озеро с разными сценариями ловли.",tips:"Проверь ветер и выбирай перспективные участки."},
  {id:4,name:"Москва-река у Бронниц",lat:55.420,lon:38.260,fish:["Щука","Окунь","Лещ"],methods:["Спиннинг","Фидер","Поплавок"],distance:55,description:"Речные точки с течением и разнообразным рельефом.",tips:"Будь внимателен на берегу и учитывай течение."},
  {id:5,name:"Платный пруд — пример",lat:55.780,lon:37.450,fish:["Карп"],methods:["Карпфишинг","Фидер"],distance:18,description:"Демонстрационная точка для будущего каталога.",tips:"Перед поездкой уточни правила и стоимость ловли."}
];

const map = L.map("map", {
  zoomControl:true,
  attributionControl:true
}).setView([55.75,37.6],9);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom:19,
  attribution:"© OpenStreetMap"
}).addTo(map);

const markers = new Map();
places.forEach(p=>{
  const marker=L.marker([p.lat,p.lon])
    .addTo(map)
    .bindPopup(`<b>${p.name}</b><br>${p.fish.join(", ")}`);
  marker.on("click",()=>showDetails(p));
  markers.set(p.id,marker);
});

const cards=document.getElementById("cards");
const count=document.getElementById("count");
const fish=document.getElementById("fish");
const method=document.getElementById("method");

function showDetails(p){
  document.getElementById("details-content").innerHTML=
    `<h2>${p.name}</h2>
     <p>${p.description}</p>
     <p><b>Рыба:</b> ${p.fish.join(", ")}</p>
     <p><b>Способы:</b> ${p.methods.join(", ")}</p>
     <p><b>Расстояние:</b> около ${p.distance} км от Москвы</p>
     <p><b>Совет:</b> ${p.tips}</p>`;
  document.getElementById("details").showModal();
}

function render(){
  const filtered=places.filter(p=>
    (!fish.value||p.fish.includes(fish.value)) &&
    (!method.value||p.methods.includes(method.value))
  );
  cards.innerHTML=filtered.map(p=>`
    <article class="card" data-id="${p.id}">
      <h2>${p.name}</h2>
      <div class="meta">≈ ${p.distance} км от Москвы</div>
      <div class="tags">${p.fish.map(f=>`<span class="tag">${f}</span>`).join("")}</div>
      <button type="button">Подробнее</button>
    </article>
  `).join("");
  count.textContent=`${filtered.length} мест`;
  markers.forEach((marker,id)=>{
    marker.setOpacity(filtered.some(p=>p.id===id)?1:0.25);
  });
  cards.querySelectorAll(".card").forEach(card=>{
    card.addEventListener("click",()=>{
      const p=places.find(x=>x.id===Number(card.dataset.id));
      map.flyTo([p.lat,p.lon],12);
      showDetails(p);
    });
  });
}
fish.addEventListener("change",render);
method.addEventListener("change",render);
document.getElementById("close").addEventListener("click",()=>document.getElementById("details").close());
render();
