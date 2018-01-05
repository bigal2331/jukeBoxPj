
SC.initialize({
  client_id: '99859bbbc016945344ec5ba5731400b4'
});
let audio = document.getElementById("playa");  
let list = document.getElementById("playlist");
var albumArt = document.querySelector("#albumArt")



function JukeBox(audioObj) {

	this.audioObj = audioObj;
	this.songList = [];
	this.shuffledList;
	this.currentplayer;
	this.currentTrackIdx = 0;
	let shuffledTrack = 0;
	this.isShuffled = false;
	this.play = function(songIdx) {
		let song = this.songList[songIdx];
		let songImgHolder = document.getElementById('artWork');
		this.currentTrackIdx = Number(songIdx);
		// songImgHolder.src = song.artWorkUrl !== undefined ? song.artWorkUrl:"";
		
		if(!audioObj.paused && !audioObj.duration){
			
			if(typeof song === 'string'){
				audioObj.src = song;
				audioObj.play();			
			}else{				
				song.scPlayer.play();
			}
		}else if(audioObj.paused){
			if(!song.hasOwnProperty('scPlayer')){
				audioObj.play();
			}else{
				song.scPlayer.play();
			}
		}else{
			if(!song.hasOwnProperty('scPlayer')){
				audioObj.play();
			}else{
				song.scPlayer.play();
			}
		}
		
	};

	this.load = function (songObj) {
		this.songList.push(songObj);
					
		let songId = this.songList.indexOf(songObj);
		albumArt.innerHTML += `<img id=${songId} class="artWork" src=${songObj.artWorkUrl}>`
		
		
	};
	
}


JukeBox.prototype.stop = function() {
	let currentSong = this.songList[this.currentTrackIdx];
	
	if(currentSong.hasOwnProperty('scPlayer')){

		currentSong.scPlayer.pause();
	}else{
		this.audioObj.pause();
	}
}

JukeBox.prototype.shuffle = function(){

	this.isShuffled = !this.isShuffled;
 
    let newSongList = [];

    while(this.songList.length > newSongList.length){
	    var song = this.songList[randomInt(this.songList)];
	    if(newSongList.indexOf(song) === -1){
	        newSongList.push(song);
	    }
                   
    }
    this.shuffledList = newSongList;
};
 

function randomInt(arry) {
    var int = Math.floor(Math.random() * arry.length);
    if(int <= arry.length){
        return int;
    }else{
        randomInt(arry);
    }
}



JukeBox.prototype.queue = function() {
	this.audioObj.on('ended', function(){

		if(this.isShuffled){

			this.audioObj.src = this.shuffledList[shuffledTrack++];
		
		}else{
			
			this.audioObj.src = this.songList[trackNum++];
			
		}
	});

}

// Add method to search and load songs from SC api.
//it's a method because you want all instances of JukeBox
// to be able to add songs from the API.

JukeBox.prototype.addSCSong = function(songName){

	SC.get('/tracks', {
		q: songName
	})
	.then(function(songObj) {
			SC.stream('/tracks/' + songObj[0].id)
			.then(function(player){
				this.load({title: songObj[0].title, id: songObj[0].id, scPlayer: player, artWorkUrl: songObj[0].artwork_url});
			}.bind(this))
	}.bind(this));		
};


let myJukeBox = new JukeBox(audio);
let btns = document.getElementById('btns');

// myJukeBox.load("track1.mp3");

btns.addEventListener('click', function(event) {
	let btn = event.target.id;
	
	if (btn === "play") {
		//the play button current causes an error
		//because the the currentSrc is never set to anything if the 
		if(myJukeBox.currentTrackIdx < 0){
			
			myJukeBox.play(0);
		}else{
			
			myJukeBox.play(myJukeBox.currentTrackIdx);
		}		
 	}else if(btn === "submit") {
	  	// this is where we'll pass the song name from the user and call the function
	  	// that will look it up in sound cloud.
	  	let songToSearch = document.getElementById("urllocation").value;
	  	myJukeBox.addSCSong(songToSearch);
	  	document.getElementById("urllocation").value = ""; 	 	
  	}else if(btn === "stop") {		
  		myJukeBox.stop();	  	
  	}else if(btn === "add") {		
  		btns.innerHTML += `<p><input id='urllocation' placeholder="Search Song"><i class="fa fa-search" aria-hidden="true" id="submit"></i> </p>`;
  	}else if(btn === "shuf") {		
  		myJukeBox.shuffle();	  	
  	}else if(btn === "fwd") {
  		myJukeBox.currentTrackIdx++;
  		myJukeBox.stop();
  		myJukeBox.play(myJukeBox.currentTrackIdx);	  	
  	}else if(btn === "back") {
  		
	  	myJukeBox.stop();
	  	myJukeBox.currentTrackIdx--;			  	
  		myJukeBox.play(myJukeBox.currentTrackIdx);	  	
  	}    	
})

  
albumArt.addEventListener('click', function(){
	let song = event.target.id;
	if(song !== "albumArt"){
		console.log('this is my the clicked album', song)
	
	// myJukeBox.audioObj.src = myJukeBox.songList[song];
		myJukeBox.play(song);
	}

})



