//gestionnaire d'événement sur la searchbar
let search = document.querySelector("#search")
search.addEventListener("keypress", function(e) {
        if (e.keyCode === 13) {
            e.preventDefault()
            recupVal(e)
        }
    })
    //ici on peut limiter ses suggestions. On récupère les places