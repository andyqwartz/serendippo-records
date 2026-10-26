
function getRandomInt (min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

// transmet au CSS “--y” dépendant de la position du scroll dans la page
function onScroll(event) {
    let y = window.scrollY;
    document.body.style.setProperty('--y', `${y}px`);
}


var images = document.querySelectorAll('.to-place');
var images_to_load = images.length;


for (var i = 0; i < images.length; i++) {
    var img = new Image();
    img.addEventListener('load', function(){
        images_to_load --;
        if (images_to_load == 0)  initPage();
    })
    img.src= images[i].src;
}


function initPage(){
    for (var i = 0; i < images.length; i++) {
        var el = images[i];
        // on met chaque image en top aléatoire tout en restreignant sa position à la dimension du viewport
        var count = getRandomInt(1,4)
        if (count == 1) el.classList.add('speed-1');
        if (count == 2) el.classList.add('speed-2');
        if (count == 3) el.classList.add('speed-3'); 
        if (count == 4) el.classList.add('speed-4');
    }
    window.addEventListener('scroll', onScroll, { capture: false, passive: true })
}
