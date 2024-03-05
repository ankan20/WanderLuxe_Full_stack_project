mapboxgl.accessToken = mapToken;
console.log(mapToken);
const map = new mapboxgl.Map({
  container: "map", // container ID
  style:"mapbox://styles/mapbox/streets-v12",
  center: [87.8607, 22.4352], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
