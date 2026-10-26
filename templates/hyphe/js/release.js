Amplitude.init({
    "bindings": {
      37: 'prev',
      39: 'next',
      32: 'play_pause'
    },
    "songs": [
      // {% for trackname, track in zip(release.config_release.release_tracks , release.audiopath)  %}
      {
        "name": "{{ trackname }}",
        "artist": "{{ release.config_release.release_artist }}",
        "url": "../{{ release.slug }}/sounds/{{ track }}",
      },
      // {% endfor %}
    ]
  });


  document.getElementById('current-song-played-progress').addEventListener('click', function( e ){
  
    var offset = this.getBoundingClientRect();
    var x = e.pageX - offset.left;
  
    Amplitude.setSongPlayedPercentage( ( parseFloat( x ) / parseFloat( this.offsetWidth) ) * 100 );
  
  });



  const progressbars = document.querySelectorAll('.amplitude-song-played-progress');
  progressbars.forEach((bar, idx) => {
    // crée un élément pour augmenter la zone de clic
    const wrapper = document.createElement('div');
    // insère l’élément avant le progress
    bar.insertAdjacentElement("beforebegin", wrapper);
    // insère le progress dans l’élément 
    wrapper.appendChild(bar);
    // classname
    wrapper.className = "progress-wrapper";

    // click sur le wrapper plutôt que sur le progress
    wrapper.addEventListener("click", (e) => {
      if( Amplitude.getActiveIndex() == idx ){
        var offset = wrapper.getBoundingClientRect();
        var x = e.pageX - offset.left;      
        Amplitude.setSongPlayedPercentage( ( parseFloat( x ) / parseFloat( wrapper.offsetWidth) ) * 100 );
      }
    })   

  })
  


  