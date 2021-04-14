let map;
const cityPostOffice = {lat: 10.779931668812813, lng: 106.69997186996581};
const quocTuGiam = {lat: 21.027847904091093, lng: 105.83550387007325};
const radius = 13;
let postMarker;
let quocTuGiamMarker;
let quocTuGiamLatLng;
let cityPostLatLng;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: cityPostOffice,
    zoom: 19,
  });

  const select = document.getElementById('select');
  select.addEventListener("change", ()=>{
  	if(select.value == '1'){
  		map.setCenter(cityPostOffice);
  	}else{
  		map.setCenter(quocTuGiam);
  	}
  });

  draw();
}

function draw(){
	// draw circle
  const cityPostOfficeCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map,
      center: cityPostOffice,
      radius,
    });

    const quocTuGiamCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map,
      center: quocTuGiam,
      radius,
    });

    // draw tam giác ngoại tiếp
    cityPostLatLng =  new google.maps.LatLng(cityPostOffice.lat, cityPostOffice.lng);
    const radiusX2 = radius * 2;
    var point1 = google.maps.geometry.spherical.computeOffset(cityPostLatLng, radiusX2, 120);
    var point2 = google.maps.geometry.spherical.computeOffset(cityPostLatLng, radiusX2, 0);
    var point3 = google.maps.geometry.spherical.computeOffset(cityPostLatLng, radiusX2, -120);

    const postOuterTriangle = new google.maps.Polygon({
        path: [point1, point2, point3],
        strokeColor: '#FDFDFD',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#00000',
        fillOpacity: 0.35,
        map
    });

    quocTuGiamLatLng =  new google.maps.LatLng(quocTuGiam.lat, quocTuGiam.lng);
    var point1 = google.maps.geometry.spherical.computeOffset(quocTuGiamLatLng, radiusX2, 120);
    var point2 = google.maps.geometry.spherical.computeOffset(quocTuGiamLatLng, radiusX2, 0);
    var point3 = google.maps.geometry.spherical.computeOffset(quocTuGiamLatLng, radiusX2, -120);
    
    const quocTuGiamOuterTriangle = new google.maps.Polygon({
        path: [point1, point2, point3],
        strokeColor: '#FDFDFD',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#00000',
        fillOpacity: 0.35,
        map
    });

    // draw tam giác nội tiếp
    var point1 = google.maps.geometry.spherical.computeOffset(cityPostLatLng, radius, 120);
    var point2 = google.maps.geometry.spherical.computeOffset(cityPostLatLng, radius, 0);
    var point3 = google.maps.geometry.spherical.computeOffset(cityPostLatLng, radius, -120);

    const postInnerTriangle = new google.maps.Polygon({
        path: [point1, point2, point3],
        strokeColor: 'green',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'green',
        fillOpacity: 0.35,
        map
    });

    var point1 = google.maps.geometry.spherical.computeOffset(quocTuGiamLatLng, radius, 120);
    var point2 = google.maps.geometry.spherical.computeOffset(quocTuGiamLatLng, radius, 0);
    var point3 = google.maps.geometry.spherical.computeOffset(quocTuGiamLatLng, radius, -120);
    
    const quocTuGiamInnerTriangle = new google.maps.Polygon({
        path: [point1, point2, point3],
        strokeColor: 'green',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'green',
        fillOpacity: 0.35,
        map
    });

    markersAndInforWindows();
}

function markersAndInforWindows(){
	postMarker = new google.maps.Marker({
        position: cityPostOffice,
        map
    });

    quocTuGiamMarker = new google.maps.Marker({
        position: quocTuGiam,
        map
    });

    const postInfoWindow = new google.maps.InfoWindow({
        content: "Đây là Bưu Điện Trung Tâm Thành Phố HCM",
        position: cityPostOffice,
    });

    const quocTuGiamInfoWindow = new google.maps.InfoWindow({
        content: "Đây là Văn Miếu Quốc Tử Giám HN",
        position: quocTuGiam,
    });

    postMarker.addListener('click', () => {
        postInfoWindow.open(map);
    });

    quocTuGiamMarker.addListener('click', () => {
        quocTuGiamInfoWindow.open(map);
    });

    direct();
}

function direct(){
		const directionsService = new google.maps.DirectionsService();
		const directionsRenderer = new google.maps.DirectionsRenderer();

		directionsRenderer.setMap(map);
	    directionsService.route(
	    {
	        origin: quocTuGiamLatLng, 
	        destination:  cityPostLatLng,
	        travelMode: google.maps.TravelMode.WALKING
	    },

	    (response, status)=>{
	    if (status === "OK") {
	        directionsRenderer.setDirections(response);
	    } else {
	        window.alert("Direction request failed due to " + status);
	    }
	    }
	);
}