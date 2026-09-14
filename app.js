const places=[
{name:'Истринское водохранилище',fish:['Щука','Окунь','Судак'],distance:55,lat:56.1,lon:36.8,desc:'Спиннинг, лодка, береговые точки.'},
{name:'Клязьминское водохранилище',fish:['Щука','Окунь','Карп'],distance:25,lat:56.03,lon:37.55,desc:'Удобно для короткой поездки.'},
{name:'Можайское водохранилище',fish:['Щука','Судак','Окунь'],distance:110,lat:55.55,lon:35.8,desc:'Большая акватория и разные форматы ловли.'}
];

let map;
let objects=[];

function init(){
  map=new ymaps.Map('map',{center:[55.75,37.4],zoom:8,controls:['zoomControl','fullscreenControl']});
  render();
}

function render(){
  const f=document.getElementById('fish').value;
  const d=document.getElementById('distance').value;
  const q=document.getElementById('search').value.toLowerCase();
  const data=places.filter(p=>(f==='all'||p.fish.includes(f))&&(d==='all'||p.distance<=Number(d))&&(`${p.name} ${p.desc}`.toLowerCase().includes(q)));

  document.getElementById('list').innerHTML=data.map(p=>{
    const i=places.indexOf(p);
    return `<article class="card"><h3>${p.name}</h3><div class="meta">${p.distance} км · ${p.fish.join(', ')}</div><p>${p.desc}</p><div class="actions"><button onclick="focusPlace(${i})">На карте</button><button class="secondary" onclick="route(${i})">Маршрут</button></div></article>`;
  }).join('')||'<p>Ничего не найдено. Измени фильтры.</p>';

  objects.forEach(o=>map.geoObjects.remove(o));
  objects=data.map(p=>{
    const placemark=new ymaps.Placemark([p.lat,p.lon],{
      balloonContentHeader:`<b>${p.name}</b>`,
      balloonContentBody:`${p.fish.join(', ')}<br>${p.desc}`,
      hintContent:p.name
    },{preset:'islands#blueFishingIcon'});
    map.geoObjects.add(placemark);
    return placemark;
  });
}

function focusPlace(i){
  const p=places[i];
  map.setCenter([p.lat,p.lon],12);
  const marker=objects.find(o=>o.geometry.getCoordinates()[0]===p.lat&&o.geometry.getCoordinates()[1]===p.lon);
  if(marker) marker.balloon.open();
}

function route(i){
  const p=places[i];
  window.open(`https://yandex.ru/maps/?rtext=~${p.lat},${p.lon}&rtt=auto`,'_blank');
}

['fish','distance','search'].forEach(id=>document.getElementById(id).addEventListener('input',render));

if(window.ymaps){
  ymaps.ready(init);
}else{
  document.getElementById('map').innerHTML='<p>Не удалось загрузить Яндекс Карты. Проверь API-ключ.</p>';
}
