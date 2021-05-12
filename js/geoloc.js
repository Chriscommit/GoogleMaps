let map, infoWindow;

//on enregistre dans une variable un icone pour notre geoloc
let im = 'http://www.robotwoods.com/dev/misc/bluecircle.png';

function recupVal(e) {
    //suppression du comportement par défaut du navigateur
    e.preventDefault()
        //récupération de la valeur de search
    const userValue = document.getElementById("search").value
}

function initMap() {
    //on initialise la map avec une position d'origine en appliquant celle ci dans la div d'affichage
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 48.856614, lng: 2.3522219 },
        zoom: 12
    });

    //on crée la fenêtre d'infos
    infoWindow = new google.maps.InfoWindow;

    //condition si le navigateur détecte tes coordonnées avec navigator.geolocation
    if (navigator.geolocation) {
        //on récupère la position acturelle et on y enferme l'objet contenant la latitude et la longitude dans la variable pos
        function getCoordonnees(pos) {
            const position = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            }

            //on recentre la map sur votre position actuelle
            map.setCenter(position);
            //on attribut la latitude longitude à la map
            let myLatLng = new google.maps.LatLng(position.lat, position.lng)

            const marker = new google.maps.Marker({
                position: myLatLng,
                icon: im,
                map: map
            })
            infoWindow.open(map);

            //initialisation de la librairie searchbox
            const input = document.querySelector("#search")
            const searchBox = new google.maps.places.SearchBox(input)
                // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)

            // glisser les résultats de la SearchBox vers la fenêtre d'affichage de la carte actuelle

            map.addListener("bounds_changed", () => {
                searchBox.setBounds(map.getBounds())
            })

            //on crée un tableau vide pour les markers
            let markers = []
                // Récupère les infos lorsque l'utilisateur sélectionne une prédiction
            searchBox.addListener("places_changed", () => {
                const places = searchBox.getPlaces();
                //si il n'ya pas de points de coordonées pour l'établissement 
                if (places.length == 0) {
                    //on sort de la fonction
                    return;
                }

                //on récup les bounds (points des markers)
                markers.forEach((marker) => {
                    marker.setMap(null);
                });
                // On efface les anciens markers.

                markers = [];

                const bounds = new google.maps.LatLngBounds();

                // On fait une boucle forEach pour récuperer les locations.
                places.forEach((place) => {
                    if (!place.geometry || !place.geometry.location) {
                        console.log("Returned place contains no geometry");
                        return;
                    }

                    //on crée un icon
                    const icon = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25),
                    };

                    // Créaction des markers pour tous les lieux trouvé sur la recherche
                    markers.push(
                        new google.maps.Marker({
                            map,
                            icon,
                            title: place.name,
                            position: place.geometry.location,
                        })
                    );
                    //renvoi vers le bon lieu
                    //si il y'a une geocode il rezoom et recentre bien (union)
                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                map.fitBounds(bounds);
            });
        }

        //deuxième argument de la fonction getCurrentPosition (function annonyme)
        navigator.geolocation.getCurrentPosition(getCoordonnees, () => {
            handleLocationError(true, infoWindow, map.getCenter())
        })
    } else {
        //si le navigateur ne supporte pas la geoloc et que vous avez accepté d'être géolocalisé et vous êtes recentré
        handleLocationError(false, infoWindow, map.getCenter());
    }

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    //le navigateur supporte la géoloc, on envoi le message et on centre la map il sera true
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}