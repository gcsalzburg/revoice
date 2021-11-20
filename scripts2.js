
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
		str += '<br>';
	}
	document.querySelector(".main").innerHTML = str;
}

// speech error handling
recognition.onerror = function(event){
  console.log(`Error: `);
  console.log(event);
}
