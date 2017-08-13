
let audio = document.getElementById("playa");  
let list = document.getElementById("playlist");



function JukeBox(audioObj) {

	this.audioObj = audioObj;
	this.songList = [];
	this.shuffledList;
	var trackNum = 0;
	var shuffledTrack = 0;
	this.isShuffled = false;
	this.play = function() {
		
		audioObj.play();
	};

	this.load = function (song) {
		this.songList.push(song);
		let songId = this.songList.indexOf(song);
		list.innerHTML += `<li id=${songId}>${song}</li>`;
		audioObj.src = song;
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

// both of these don't work, why?
// JukeBox.prototype.stop = function(audioObj){this.pause();};
// JukeBox.prototype.stop = function(audioObj){audioObj.pause();};



let myJukeBox = new JukeBox(audio);
let btns = document.getElementById('btns');
myJukeBox.load("track1.mp3");

btns.addEventListener('click', function(event) {
	let btn = event.target.id;
	
	if (btn === "play") {		
		myJukeBox.play();
	  }else if(btn === "submit") {
	  	myJukeBox.load(document.getElementById("urllocation").value);	
	  	document.getElementById("urllocation").value = ""; 	 	
	  }else if(btn === "stop") {		
	  	myJukeBox.stop();	  	
	  }else if(btn === "add") {		
	  	btns.innerHTML += `<input id='urllocation' placeholder="Please enter the url"><button id="submit">Load</button>`;
	  }	else if(btn === "shuf") {		
	  	myJukeBox.shuffle();	  	
	  }    	
})

  
list.addEventListener('click', function(){

	let song = event.target.id;

	myJukeBox.audioObj.src = myJukeBox.songList[song];
	myJukeBox.play();

})



