
// new instance of speech recognition
var recognition = new webkitSpeechRecognition();
// set params
recognition.continuous = true;
recognition.interimResults = true;
recognition.start();

recognition.onresult = function(event){
  
	// delve into words detected results & get the latest
	// total results detected
	let str = "";
	for(let i=0; i<event.results.length; i++){
		console.log(event.results[i][0].transcript);
		str += event.results[i][0].transcript;
		str += ' ';
	}
	document.querySelector(".txt").value = str;
}

// speech error handling
recognition.onerror = function(event){
  console.log(`Error: `);
  console.log(event);
}











let synth = window.speechSynthesis;

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
}