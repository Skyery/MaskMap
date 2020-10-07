const mymap = L.map('mymap', {
    center: [0, 0],
    zoom: 16
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>         contributors'
}).addTo(mymap);

function init(){
    getData();
}

let data;

function getData(){
    const xhr = new XMLHttpRequest;
    xhr.open('get', 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json', true);
    xhr.send(null);
    xhr.onload = function(){
        data = JSON.parse(xhr.responseText).features;
        addMarker();
    }
}

init();
const markers = new L.MarkerClusterGroup({ disableClusteringAtZoom: 18 }).addTo(mymap);

function addMarker(){
    for(let i = 0; i < data.length; i++){
        const pharmacyName = data[i].properties.name;
        const maskAdult = data[i].properties.mask_adult;
        const maskChild = data[i].properties.mask_child;
        const lat = data[i].geometry.coordinates[1];
        const lng = data[i].geometry.coordinates[0];
        if(maskAdult == 0 || maskChild == 0){
            mask = redIcon;
        }else if(maskAdult < 100 && maskAdult !== 0 || maskChild < 100 && maskChild !== 0){
            mask = orangeIcon;
        }else{
            mask = greenIcon;
        }
        markers.addLayer(L.marker([lat, lng], {icon: mask}).bindPopup(`
        <h3>${pharmacyName}</h3><br>
        <h4>成人: ${maskAdult}</h4>
        <h4>兒童: ${maskChild}</h4>
        `));
    }
    mymap.addLayer(markers);
}

let mask;

const violetIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const marker = L.marker([0, 0] , {icon:violetIcon}).addTo(mymap);

if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(position =>{
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
        setLocation();
    })
}else{
    console.log('定位失敗');
}

function setLocation(){
    mymap.setView([userLat, userLng], 13);
    marker.setLatLng([userLat, userLng]).bindPopup(`<h3>我的位置</h3>`).openPopup();
}


const greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const orangeIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

let geoBtn = document.getElementById('jsGeoBtn');

geoBtn.addEventListener('click', () =>{
    setLocation();
})