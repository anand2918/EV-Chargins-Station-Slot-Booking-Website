const apiKey = 'pk.eyJ1IjoiYXVzZXJoZXJlIiwiYSI6ImNrdjhza3UzajBwOTkyb21nZjlnazNtczgifQ._9p_M5tb5DlNCsoncfKwwQ';

const mymap = L.map('map').setView([18.53447651471912, 73.84824125254049], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: apiKey
}).addTo(mymap);

// Adding Marker

const marker = L.marker([18.53447651471912, 73.84824125254049]).addTo(mymap);

// Add popup message
let template = `
<h3>Modern Station</h3>
<div style="text-align:center">
    <img width="150" height="150"src="https://5.imimg.com/data5/ANDROID/Default/2020/12/YD/OD/CV/41417600/img-20201113-wa0010-jpg-500x500.jpg"/>
    <br><a href="book.html" class="btn">Book Slot</a></br>
</div>
`
marker.bindPopup(template);
