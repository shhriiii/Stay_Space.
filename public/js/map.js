
                    mapboxgl.accessToken = mapToken;
                    const map = new mapboxgl.Map({
                        container: 'map',
                        style: 'mapbox://styles/mapbox/dark-v11',
                        center: coordinates, // example coordinates
                        zoom: 9,
                      });
                      

console.log(coordinates);

  const marker = new mapboxgl.Marker()
  .setLngLat(coordinates) // or listing.geometry.coordinates
  .addTo(map);




               