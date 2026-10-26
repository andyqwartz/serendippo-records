function getRandomInt (min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

var imgs = document.querySelectorAll('.to-place');
var container = document.getElementById('scroll')

var pixelCount = 0

imgs.forEach((the_img) => {
  
  window.addEventListener('load', function() {

    // taille img aléatoire (mais + petite) 
    var randomWidth = getRandomInt(10,50)
    the_img.style.cssText += 'width:' + randomWidth + '%;';

    // Augmenter la taille du conteneur en fonction du nombre d'images
    // Pas hyper opti je pense mais pour l'instant ça marche
    function pxCount(){
      pixelCount = pixelCount + 100;
      return pixelCount
    } 
    var pxs = pxCount()
    container.style.cssText += 'height:' + pxs + 'px;';  

    // dimension fenêtre d'affichage 
    var grid = document.getElementById('scroll');
    var rect = grid.getBoundingClientRect()
    var vpHeight = pxs;
    var vpWidth = rect.width;

    // position de l'image 
    var xPos = getRandomInt(0, vpWidth - the_img.offsetWidth);
    var yPos = getRandomInt(the_img.offsetHeight*15, vpHeight - the_img.offsetHeight);
    
    the_img.style.cssText += '--x-position:' + xPos + 'px; --y-position:' + yPos + 'px;';  


  });

});

