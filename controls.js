
SC.initialize({
  client_id: 'fd4e76fc67798bfa742089ed619084a6'
});
let audio = document.getElementById("playa");  
let list = document.getElementById("playlist");



function JukeBox(audioObj) {

	this.audioObj = audioObj;
	this.songList = [];
	this.shuffledList;
	this.currentplayer;
	var trackNum = 0;
	var shuffledTrack = 0;
	this.isShuffled = false;
	this.play = function(songIdx) {
		let song = this.songList[songIdx];
		//if it's a SC song then stream it
		//if not then it's local and you can just play it
		if(this.songList.indexOf(song) > -1 && song.hasOwnProperty('id')){
			SC.stream('/tracks/' + song.id)
			.then(function(player){
				player.play();
			})
		}else{
			audioObj.src = song;
			audioObj.play();			
		}
	};

	this.load = function (songObj) {
		this.songList.push(songObj);
		let songId = this.songList.indexOf(songObj);
		list.innerHTML += `<li id=${songId}>${songObj.title}</li>`;
		// audioObj.load();
	};
	
}

JukeBox.prototype.queue = function() {
	this.audioObj.on('ended', function(){
		// console.log("this is isShuffled", this.isShuffled);
		// console.log("this is trackNum", trackNum);
		// console.log("this is ShuffledTrackNum", this.shuffledTrack);
		console.log('HELLO')

		if(this.isShuffled){

			this.audioObj.src = this.shuffledList[shuffledTrack++];
		
		}else{
			
			this.audioObj.src = this.songList[trackNum++];
			
		}
	});

}

JukeBox.prototype.stop = function() {
	this.audioObj.pause();
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

// Add method to search and load songs from SC api.
//it's a method because you want all instances of JukeBox
// to be able to add songs from the API.

JukeBox.prototype.addSCSong = function(songName){

	SC.get('/tracks', {
		q: songName
	})
	.then(function(songObj) {
		
		this.load({title: songObj[0].title, id: songObj[0].id});

	}.bind(this));

		
};















let myJukeBox = new JukeBox(audio);
let btns = document.getElementById('btns');

myJukeBox.load("track1.mp3");

btns.addEventListener('click', function(event) {
	let btn = event.target.id;
	
	if (btn === "play") {		
		myJukeBox.play();
	  }else if(btn === "submit") {
	  	// this is where we'll pass the song name from the user and call the function
	  	// that will look it up in sound cloud.
	  	let songToSearch = document.getElementById("urllocation").value;
	  	myJukeBox.addSCSong(songToSearch);
	  	document.getElementById("urllocation").value = ""; 	 	
	  }else if(btn === "stop") {		
	  	myJukeBox.stop();	  	
	  }else if(btn === "add") {		
	  	btns.innerHTML += `<input id='urllocation' placeholder="Please enter name of the song"><button id="submit">Search</button>`;
	  }	else if(btn === "shuf") {		
	  	myJukeBox.shuffle();	  	
	  }    	
})

  
list.addEventListener('click', function(){

	let song = event.target.id;

	// myJukeBox.audioObj.src = myJukeBox.songList[song];
	myJukeBox.play(song);

})



