'use strict';

var video = document.querySelector('video');
var canvas = window.canvas = document.querySelector('canvas');
var textArea = $('#text-box');
var snapshot_button = $('#btn-snapshot');
var rec_button = $('#btn-rec');

var msg = new SpeechSynthesisUtterance();

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = true;
recognition.lang = 'ko-KR';
var recognizing = false;
var final_transcript = '';
var ignore_onend;
var start_timestamp;
var desc_img_flag = false;


snapshot_button.on( "click", function() {
  if (recognizing) {
    recognition.stop();
    // return;
  }
  take_picture();
});

rec_button.on( "click", function() {
  if (recognizing) {
    recognition.stop();
    // return;
  } else {
    final_transcript = '';
    recognition.start();
    ignore_onend = false;
    console.log('info_allow');
    start_timestamp = event.timeStamp;
  }
});

function take_picture() {
  if(desc_img_flag){
    return;
  }

  desc_img_flag = true;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').
    drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.toBlob(describeImage)
}

function describeImage(file){
  // var server_url = 'https://52.231.65.117:8080/'
  $.ajax({
    // url: server_url+'describe_image',
    url: 'get_img',
    type: "post",
    data: file,
    processData: false,
    contentType: false,
    success: function(data){
      console.log('----------------------------');
      // var result = JSON.parse(data);
      var desc_img = getImageData(data);
      $('#text-secondary').text('Explain : '+desc_img['text']);
      // $('#img-desc-accuracy').text('Accuracy : '+desc_img['accuracy']+'%');
      setInputValue(myvalue, desc_img['text']);
      speakText(desc_img['text']);
      desc_img_flag = false;
    },
    error:function(data){
      // TODO
    }
  });
}

function setInputValue(input_id, val) {
    document.getElementById(input_id).value('value', val);
}

function getImageData(result){
  var text = '';
  var accuracy = '';
  var tags = [];
  text = result['text']
 //  try {
 //    text = result["description"]["captions"][0]["text"];
 //    accuracy = result["description"]["captions"][0]["confidence"];
 //    tags = result["description"]["tags"];
 //  }
 //  catch (e) {
 //   console.log(e); // pass exception object to error handler
 // }
 console.log(text)
 return {"text":text }
}

function speakText(text) {
  // Set the text.
	msg.text = text;
	msg.volume = 1;
  // Queue this utterance.
	window.speechSynthesis.speak(msg);
}

function isMobileDevice(){
  var filter = "win16|win32|win64|mac";
  if(navigator.platform){
    if(0 > filter.indexOf(navigator.platform.toLowerCase())){
      return true
    }else{
      return false
    }
  }
}


function stopStream (stream) {
    for (let track of stream.getTracks()) {
        track.stop();
    }
}

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

(function(){
  var constraints = {
    audio: false,
    video: true
  };

  if(isMobileDevice() == true){
    constraints['video'] = { facingMode: { exact: "environment" } };
  }

  navigator.mediaDevices.getUserMedia(constraints).
      then(handleSuccess).catch(handleError);
}());

recognition.onstart = function() {
  recognizing = true;
  console.log('info_speak_now');
  $('#btn-rec > i').addClass('recording');
};

recognition.onerror = function(event) {
  if (event.error == 'no-speech') {
    console.log('info_no_speech');
    ignore_onend = true;
  }
  if (event.error == 'audio-capture') {
    console.log('info_no_microphone');
    ignore_onend = true;
  }
  if (event.error == 'not-allowed') {
    if (event.timeStamp - start_timestamp < 100) {
      console.log('info_blocked');
    } else {
      console.log('info_denied');
    }
    ignore_onend = true;
  }
};

recognition.onend = function() {
  recognizing = false;
  $('#btn-rec > i').removeClass('recording');
  if (ignore_onend) {
    return;
  }

  if (!final_transcript) {
    console.log('info_start');
  } else {
    textArea.text(final_transcript);
  }
};

recognition.onresult = function(event) {
  var interim_transcript = '';
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final_transcript += event.results[i][0].transcript;
    } else {
      interim_transcript += event.results[i][0].transcript;
    }
  }
  console.log(interim_transcript);
  textArea.text(interim_transcript);

  if (isKeywordInText(interim_transcript) == true){
    recognition.stop();
    take_picture();
  }
};

function isKeywordInText(text){
  // var keyword_list = ['뭐야', '뭐냐', '상황', '일이야', '일 있나', '일 있어'];
  var keyword_list = ['뭐야', '뭐냐', '상황', '일이야', '일 있나', '일 있어','무슨', '알려줘'];

  for (var keyword of keyword_list){
    if (text.search(keyword) != -1){
      return true
    }
  }
  return false
}
