// -------------- UNWRAP TRACKLIST --------------------

let tracks = document.getElementById("tracks")
let unwrap = document.getElementById("tracks-unwrap")

// je sais que c'est plus pratique de faire avec des classList.toggle mais là ça marche comme ça je creuserai plus tard 
unwrap.addEventListener('click', (e) => {
   
    if(tracks.classList.contains('unwrapped')){

    tracks.classList.remove('unwrapped');
    tracks.style.setProperty("height", 20 + "vh");
    unwrap.classList.remove('rotated')
    unwrap.classList.remove('unwrapped')
    } 
    else {
    tracks.classList.add('unwrapped');
    tracks.style.setProperty("height", 60 + "vh");
    unwrap.classList.add('rotated')
    unwrap.classList.add('unwrapped')
    }
  });

  
// -------------- SCROLL CANVAS --------------------

var playButtons = document.querySelectorAll('.amplitude-play-pause');
var goback = document.getElementById('exit-canvas')
var canvas = document.getElementById('canvas')

playButtons.forEach((btn) => {

    btn.addEventListener("click", () => {

        // goback.classList.remove('hidden')
        canvas.scrollIntoView({ behavior: "smooth", block: "start"});

    })

    goback.addEventListener("click", () => {
        page.scrollIntoView({ behavior: "smooth", block: "start"});
        // goback.classList.add('hidden')
    })
})