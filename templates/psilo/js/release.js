Amplitude.init({
    "bindings": {
      37: 'prev',
      39: 'next',
      32: 'play_pause',
    },
    waveforms: {
        sample_rate: 500
    },
    "songs": [
      // {% for trackname, track in zip(release.config_release.release_tracks , release.audiopath)  %}
      {
        "name": "{{ trackname }}",
        "artist": "{{ release.config_release.release_artist }}",
        "url": "../{{ release.slug }}/sounds/{{ track }}",
      },
      // {% endfor %}
    ],
    visualizations: [
        {
            object: RandomImgAccumulation,
            params: {}
        }
    ],
    visualization: 'random_img_accumulation',
    callbacks: {
      pause: function(){
        // Cacher les images quand le son est coupé
          var placedImgs = document.querySelectorAll('.random-img')
          var bin = document.getElementById('bin')

          bin.classList.add('hidden')

          placedImgs.forEach(img => {
                  img.remove();
          })
          clearInterval(timer);

      }
    },
  });



  document.getElementById('current-song-played-progress').addEventListener('click', function( e ){
  
    var offset = this.getBoundingClientRect();
    var x = e.pageX - offset.left;
  
    Amplitude.setSongPlayedPercentage( ( parseFloat( x ) / parseFloat( this.offsetWidth) ) * 100 );
  
  });

// pour toutes les progress bar (et pas une par une !)
  const progressbars = document.querySelectorAll('.amplitude-wave-form');
  progressbars.forEach((bar, idx) => {

    // click sur le wrapper plutôt que sur le progress
    bar.addEventListener("click", (e) => {
      if( Amplitude.getActiveIndex() == idx ){
        var offset = bar.getBoundingClientRect();
        var x = e.pageX - offset.left;      
        Amplitude.setSongPlayedPercentage( ( parseFloat( x ) / parseFloat( bar.offsetWidth) ) * 100 );
      }
    })   

  })


  