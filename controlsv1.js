
  let audio = document.getElementById("playa");  
  let list = document.getElementById("playlist");



function JukeBox(audioObj) {
	this.audioObj = audioObj;
	this.songList = [];
	this.isShuffled = false;
	this.play = function() {
		
		audioObj.play();
	};

	this.load = function (song) {
		this.songList.push(song);
		let songId = this.songList.indexOf(song);
		list.innerHTML += `<li id=${songId}>${song}</li>`;
		audioObj.src = song;
		audioObj.load();
	};
	
}

JukeBox.prototype.stop = function() {
	this.audioObj.pause();
}

JukeBox.prototype.shuffle = function(){
	if (this.isShuffled) {
		return this.isShuffled = false;
	} else if (!this.isShuffled) {
		return this.isShuffled = true;
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
	  }	    	
})

  
list.addEventListener('click', function(){

	let song = event.target.id;

	myJukeBox.audioObj.src = myJukeBox.songList[song];
	myJukeBox.play();

})
