var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

 // Store state of playing songs
 var currentlyPlayingSong = null;
 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 var currentSoundFile = null
 var currentVolume = 80;
 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

var filterTimeCode = function(num){
  var minutes = 0; var seconds = 0;
  
  minutes = parseInt(num/60);
  seconds = parseInt(num % 60);
   if(seconds < 10){
     seconds = "0" + seconds;
   }
  return`${minutes}:${seconds}`;
}

//assignment checkpoint 21
var setCurrentTimeInPlayerBar = function(currentTime){

   $('.current-time').text(filterTimeCode(currentTime));
  
}

//assignment 21 continued
var setTotalTimeInPlayerBar = function(totalTime){

  $('.total-time').text(filterTimeCode(totalTime));
}


//assignment from checkpoint 19
//create a function called setSong that takes one arg.
var setSong = function(songNumber){
   if (currentSoundFile) {
         currentSoundFile.stop();
     }
  
  currentlyPlayingSongNumber = parseInt(songNumber); 
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         // #2
         formats: [ 'mp3' ],
         preload: true
     });
  
    setVolume(currentVolume);
  
  };

var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
     }
 };

//assignment from checkpoint 19 continued
//create a function called getSongNumberCell
var getSongNumberCell = function(number){
  return $('.song-item-number[data-song-number="' + number + '"]');
  
};

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' +songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
     
var clickHandler = function() {
     
       var songNumber = parseInt($(this).attr('data-song-number'));
  
      if (currentlyPlayingSongNumber !== null) {
            
          var currentlyPlayingCell = currentVolume; getSongNumberCell(currentlyPlayingSongNumber);
            
           currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
           currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        
        if (currentlyPlayingSongNumber !== songNumber) {
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            
            setTotalTimeInPlayerBar(Buzz.toTimer(curr entSoundFile.getDuration()));
          
           var $volumeFill = $('.volume .fill');
           var $volumeThumb = $('.volume .thumb');
           $volumeFill.width(currentVolume + '%');
           $volumeThumb.css({left: currentVolume + '%'});
           
            $(this).html(playerBarPauseButton);
            updatePlayerBarSong();
            
        } else if (currentlyPlayingSongNumber === songNumber) {
            $(this).html(playerBarPlayButton);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        }
         else if (currentSoundFile.isPaused()) {
              $(this).html(playerBarPlayButton);
              $('.main-controls .play-pause').html(playerBarPauseButton);
              console.log('isPaused')
              currentSoundFile.togglePlay();
              updateSeekBarWhileSongPlays();
          } else {
            console.log('iNotPaused')
              $(this).html(playerBarPlayButton);
              $('.main-controls .play-pause').html(playerBarPlayButton);
              currentSoundFile.pause();   
       }
        
        
};
    
   var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSongNumber) {
          if(currentSoundFile == null || (currentSoundFile && currentSoundFile.isPaused())){
           songNumberCell.html(playerBarPlayButton); 
          }else{
             songNumberCell.html(playerBarPauseButton);
          }
            
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
      //
      console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
    };
     //#1
     $row.find('.song-item-number').click(clickHandler);
     // #2
     $row.hover(onHover, offHover);
     // #3
     return $row;
 };

var setCurrentAlbum = function(album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     $albumSongList.empty();
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);;
     }
 };

var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
//           console.log(parseInt(this.getTime());
             setCurrentTimeInPlayerBar(this.getTime())
//           
//   
         });
     }
 };

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

 var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
 
     $seekBars.click(function(event) {
         
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         var seekBarFillRatio = offsetX / barWidth;
   
         if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);   
        }
   
         updateSeekPercentage($(this), seekBarFillRatio);
     });
   
  $seekBars.find('.thumb').mousedown(function(event) {
         var $seekBar = $(this).parent();

         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
           
             if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
            }
           
            updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     }); 
 };

 var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

//try on your own assignment to write a function 
var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  
   $('.main-controls .play-pause').html(playerBarPauseButton);


};
//try on your own to write nextsong() function

  var nextSong = function() {
    
  var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
  if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
     setSong(currentSongIndex + 1);
     currentSoundFile.play();
     updateSeekBarWhileSongPlays();
     currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

//try on your own to write previousSong() function

var previousSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    // Set a new current song
     setSong(currentSongIndex + 1);
     currentSoundFile.play();
     updateSeekBarWhileSongPlays();
     currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};
  


 
 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     setupSeekBars();
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
 
 });