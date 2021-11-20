'use strict';

// Speech recognition & synthesis objects
const recognition = new webkitSpeechRecognition();
const synthesis = window.speechSynthesis;

// Data object for voice properties
const voice_data = {
	voice_name: "Google UK English Female",
	voice: null,
	pitch: 1,
	rate: 1
};
let voices = null;

document.addEventListener("DOMContentLoaded", () =>{

	// Feature detection
	if('webkitSpeechRecognition' in window){
		// if('SpeechRecognition' in window || 'webkitSpeechRecognition' in window){
		document.querySelector('.speechrecognition_warning').style.display = 'none';
	}
	
	// Fetch list of speech synthesis voices
	if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
		speechSynthesis.onvoiceschanged = () => {
			voices = synthesis.getVoices();
			console.log(voices);
			set_voice(voice_data.voice_name);
		};
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

	// Events for options buttons and sliders
	document.querySelector(".options_button").addEventListener("click", (e) => {
		e.preventDefault();
		document.querySelector(".options").classList.toggle("show_options");
	});
	document.querySelector(".options").addEventListener("click", (e) => {
		e.preventDefault();
		if(e.target.dataset.voiceName != undefined){
			set_voice(e.target.dataset.voiceName);
			document.querySelectorAll(".options a").forEach(btn => btn.classList.remove("selected"));
			e.target.classList.add("selected");
			speak(document.querySelector(".speech_capture").innerHTML);
		}
	});
	document.querySelectorAll(`input[type="range"]`).forEach(slider => {
		slider.addEventListener("input",(e) => {
			// Update whilst dragging
			document.querySelector(`#${slider.dataset.valueId}`).innerHTML = slider.value;
		});
		slider.addEventListener("change", (e) => {
			// When change finally confirmed
			voice_data[slider.dataset.voiceProperty] = slider.value;
			document.querySelector(`#${slider.dataset.valueId}`).innerHTML = slider.value;
			speak(document.querySelector(".speech_capture").innerHTML);
		});
	});

	// RECORD button event listeners
	set_button_state('record');
	const action_btn = document.querySelector(".action_button");
	action_btn.addEventListener("mousedown", (e) => {
		e.preventDefault();
		set_button_state('recording');

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

		// Now speak!
		speak(document.querySelector(".speech_capture").innerHTML);
	});


});

// Set the display of the action button
function set_button_state(state){
	const action_btn = document.querySelector(".action_button");

	action_btn.classList.remove('recording');
	action_btn.classList.remove('speaking');

	switch(state){
		case 'record':
			action_btn.innerHTML = 'Record';
			break;
		case 'recording':
			action_btn.innerHTML = 'Recording';
			action_btn.classList.add('recording');
			break;
		case 'speaking':
			action_btn.innerHTML = 'Speaking';
			action_btn.classList.add('speaking');
			break;
	}
}

// Speak the phrase
function speak(playback_string){

	// Stop if no string present
	if(playback_string == ''){
		set_button_state('record');
		return;
	}

	// If already playing, stop!
	if(synthesis.speaking){
		synthesis.pause();
		synthesis.cancel();
	}

	// UI change for speaking
	set_button_state('speaking');
	console.log(`Playing: ${playback_string}`);

	// Create new phrase
	let phrase = new SpeechSynthesisUtterance(playback_string);
	
	// Set button state when it finishes
	phrase.onend = function (e) {
		set_button_state('record');
	}

	// Set properties of voice
	phrase.voice = voice_data.voice;
	phrase.pitch = voice_data.pitch;
	phrase.rate = voice_data.rate;

	// Speak!
	synthesis.speak(phrase);
}

// Set the voice we will use
function set_voice(voice_name){
	for(let i=0; i<voices.length; i++) {
		if(voices[i].name === voice_name) {
			voice_data.voice_name = voice_name;
			voice_data.voice = voices[i];
			break;
		}
	}
}