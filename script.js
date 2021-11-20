
// Speech recognition & synthesis objects
const recognition = new webkitSpeechRecognition();
const synthesis = window.speechSynthesis;

document.addEventListener("DOMContentLoaded", () =>{

	// Feature detection
	if('webkitSpeechRecognition' in window){
		// if('SpeechRecognition' in window || 'webkitSpeechRecognition' in window){
		document.querySelector('.speechrecognition_warning').style.display = 'none';
	}

	// Prep speech recognition
	recognition.continuous = true;
	recognition.interimResults = true;
	recognition.onresult = function(event){
		// Create string from last available phrase
		let str = "";
		for(let i=0; i<event.results.length; i++){
			str += event.results[i][0].transcript;
			str += ' ';
		}
		document.querySelector(".speech_capture").innerHTML = str;
	}

	// Request access to microphone on page load
	recognition.start();
	setTimeout(() => {
		recognition.abort();
	}, 5);

	// Attach button event listeners
	const action_btn = document.querySelector(".action_button");

	action_btn.addEventListener("mousedown", (e) => {
		e.preventDefault();

		// Stop speaking
		synthesis.pause();
		synthesis.cancel();

		// ⚠ Important
		// If webpage not running under https://, this will ask for permission every time it is called!
		document.querySelector(".speech_capture").innerHTML = "";
		recognition.start();
	});
	action_btn.addEventListener("mouseup", (e) => { // TODO: This should be mouseup on the whole block
		e.preventDefault();
		// We call abort not error, so that the user hears the current status of the text box and we don't continue to update it as we improve on the translation
		recognition.abort();
		console.log(`Playing: ${document.querySelector(".speech_capture").innerHTML}`);
		speak(document.querySelector(".speech_capture").innerHTML);
	});


});

// Speak the phrase
function speak(playback_string){

	if(synthesis.speaking){
		console.error('speechSynthesis.speaking');
		return;
	}
	if(playback_string !== ''){
		let phrase = new SpeechSynthesisUtterance(playback_string);
		// phrase.voice = voices[i];
		// phrase.pitch = pitch.value;
		// phrase.rate = rate.value;
		synthesis.speak(phrase);
	}

}



/*

	let inputForm = document.querySelector('form');
	let inputTxt = document.querySelector('.txt');
	let voiceSelect = document.querySelector('select');
	
	let pitch = document.querySelector('#pitch');
	let pitchValue = document.querySelector('.pitch-value');
	let rate = document.querySelector('#rate');
	let rateValue = document.querySelector('.rate-value');

let voices = [];

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });
  var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = '';
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(){
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (inputTxt.value !== '') {
    var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
  }
}

inputForm.onsubmit = function(event) {
  event.preventDefault();

  speak();

  inputTxt.blur();
}

pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
}

rate.onchange = function() {
  rateValue.textContent = rate.value;
}

voiceSelect.onchange = function(){
  speak();
}*/