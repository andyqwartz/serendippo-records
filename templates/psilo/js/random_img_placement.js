/*
    Random Img Accumulation
*/

function RandomImgAccumulation(){

    this.id = 'random_img_accumulation';

    this.name = 'Random Img Accumulation';

    this.container = '';

    this.analyser = '';

    /* Les prefs’ */
    this.preferences = {
        // Nombre d’images max (pour pas overflow la mémoire des smartphones)
        maxImages: 100,
        // Utile pour enlever les images l’une après l’autre
        removeSpeed: 1
    };

    /* Il faut garder en mémoire les intervals */
    this.timers = [];

    this.removeTimer = null;

    this.getID = function(){
        return this.id;
    }

    this.getName = function(){
        return this.name;
    }

    this.setPreferences = function(userPreferences){

        for(var key in this.preferences){

            if(userPreferences[key] != undefined){

                this.preferences[key] = userPreferences[key];
            }
        }
    }

    /* Start visualization */
    this.startVisualization = function(element){

        this.analyser = Amplitude.getAnalyser();

        this.container = element;

        var self = this;

        //  Utilities 
        function getRandomInt(min, max){
            return Math.floor(Math.random() * (max - min)) + min;
        }

        //  Show bin 
        var bin = document.getElementById("bin");
        bin.classList.remove('hidden');

        //  DOM references 
        var canvas = document.querySelector('body');
        var icon_template = document.querySelector('#template');
        var the_images = document.querySelectorAll('.to-place');

        //  Pick random source image 
        function pickRandomImage(){
            var i = getRandomInt(0, the_images.length);
            var random_img = the_images[i]
            return random_img;
        }

        //  Viewport size 
        var rect = canvas.getBoundingClientRect();
        var vpHeight = rect.height;
        var vpWidth = rect.width;
        
        //  Random position 
        function randomCoordinate(){
            return [ getRandomInt(-100, vpWidth), getRandomInt(-100, vpHeight) ];
        }

        //  Create image 
        function createImage(){

            var currentImages = document.querySelectorAll('.random-img');
            if(currentImages.length >= self.preferences.maxImages){
                currentImages[0].remove();
            }

            var random_picked_img = pickRandomImage()

            function isTransparent(){
                if (random_picked_img.classList.contains('transparent-img')){
                    return 'transparent-img';
                };
            }

            var node = icon_template.cloneNode(true);
            var xy = randomCoordinate();
            var rotate = getRandomInt(0, 360);

            // taille aléatoire, mais rend pas super bien en fait
            // var randomwidth = getRandomInt(150, 600)

            node.removeAttribute('id');
            node.classList.remove('hidden');
            node.classList.add('random-img');
            node.style.top = xy[1] + 'px';
            node.style.left = xy[0] + 'px';
            node.style.transform = 'rotate(' + rotate + 'deg)';
            // node.style.width = randomwidth + 'px';
            node.setAttribute('src', random_picked_img.src);
            node.classList.add(isTransparent())
            canvas.appendChild(node);

            const imgs = document.querySelectorAll('.random-img')

            imgs.forEach(img => {
                $(img).drags();    
            });
        }

        //  Create intervals 
        function timer(){
            var rand = Math.random() * 10;
            var interval = setInterval(createImage, rand * 4000);
            self.timers.push(interval);
        }

        //  Start creation timers 
        for(var j = 0; j < the_images.length; j++){
            timer();
        }
    }

    /* Stop visualization */
    this.stopVisualization = function(){

        for(var i = 0; i < this.timers.length; i++){
            clearInterval(this.timers[i]);
        }
        this.timers = [];

        if(this.removeTimer){
            clearInterval(this.removeTimer);
        }

        var self = this;
        var bin = document.getElementById('bin');

        this.removeTimer = setInterval(function(){

            var imgs = document.querySelectorAll('.random-img');

            if(imgs.length === 0){
                clearInterval(self.removeTimer);
                self.removeTimer = null;
                if(bin){
                    bin.classList.add('hidden');
                }
                return;
            }

            imgs[0].remove();

        }, this.preferences.removeSpeed);
    }
}