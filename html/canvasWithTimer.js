var testWords = [];
var timer;

var wordBeingMoved;

var song = "Peaceful Easy Feeling";

var movingChord;

var deltaX, deltaY; //location where mouse is pressed
var canvas = document.getElementById('canvas1'); //our drawing canvas

function getWordAtLocation(aCanvasX, aCanvasY) {

	//locate the word near aCanvasX,aCanvasY
	//Just use crude region for now.
	//should be improved to using lenght of word etc.

	//note you will have to click near the start of the word
	//as it is implemented now
	var ctx = canvas.getContext("2d");
	ctx.font = '20pt Arial';
	for (var i = 0; i < testWords.length; i++) {
		var txt = testWords[i];
		var width = ctx.measureText(txt.word).width;
		if ((Math.abs(testWords[i].y - aCanvasY) < 20) &&
			(aCanvasX > testWords[i].x &&
				aCanvasX < (testWords[i].x + width))) {
			return testWords[i];
		}
	}
	return null;
}

var drawCanvas = function() {

	var context = canvas.getContext('2d');

	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height); //erase canvas

	context.font = '20pt Arial';
	context.fillStyle = 'cornflowerblue';
	context.strokeStyle = 'blue';

	for (var i = 0; i < testWords.length; i++) { //note i declared as var

		var data = testWords[i];
		//console.log(data.word);
		// if (data.word.startsWith("["))
		// {

		// context.fillText(data.word, data.x, data.y-20);
		// context.strokeText(data.word, data.x, data.y-20);

		// }
		// else{
		context.fillText(data.word, data.x, data.y);
		context.strokeText(data.word, data.x, data.y);
	//	}
	}


	context.stroke();
};

function handleMouseDown(e) {

	//get mouse location relative to canvas top left
	var rect = canvas.getBoundingClientRect();
	//var canvasX = e.clientX - rect.left;
	//var canvasY = e.clientY - rect.top;
	var canvasX = e.pageX - rect.left; //use jQuery event object pageX and pageY
	var canvasY = e.pageY - rect.top;
	console.log("mouse down:" + canvasX + ", " + canvasY);

	wordBeingMoved = getWordAtLocation(canvasX, canvasY);

	//console.log(wordBeingMoved.word);
	if (wordBeingMoved != null) {
		if (wordBeingMoved.word.startsWith("["))
			movingChord = true;
		deltaX = wordBeingMoved.x - canvasX;
		deltaY = wordBeingMoved.y - canvasY;
		//document.addEventListener("mousemove", handleMouseMove, true);
		//document.addEventListener("mouseup", handleMouseUp, true);
		$("#canvas1").mousemove(handleMouseMove);
		$("#canvas1").mouseup(handleMouseUp);

	}

	// Stop propagation of the event and stop any default
	//  browser action

	e.stopPropagation();
	e.preventDefault();

	drawCanvas();
}

function handleMouseMove(e) {

	console.log("mouse move");

	//get mouse location relative to canvas top left
	var rect = canvas.getBoundingClientRect();
	var canvasX = e.pageX - rect.left;
	var canvasY = e.pageY - rect.top;

	wordBeingMoved.x = canvasX + deltaX;
	wordBeingMoved.y = canvasY + deltaY;

		if (wordBeingMoved.y <= 50) {
			wordBeingMoved.y = 50;
		}
		else
			wordBeingMoved.y = Math.floor(wordBeingMoved.y / 50) * 50;

	if (movingChord)
		wordBeingMoved.y -= 20;


	e.stopPropagation();

	drawCanvas();
}

function handleMouseUp(e) {
	console.log("mouse up");
	movingChord = false;
	console.log(testWords);
	e.stopPropagation();
	testWords.sort(compareWords);
	console.log(testWords);
	//remove mouse move and mouse up handlers but leave mouse down handler
	$("#canvas1").off("mousemove", handleMouseMove); //remove mouse move handler
	$("#canvas1").off("mouseup", handleMouseUp); //remove mouse up handler

	drawCanvas(); //redraw the canvas
}



function compareWords(a, b) {
  var ay = a.word.startsWith("[") ? a.y+20 : a.y;
  var by = b.word.startsWith("[") ? b.y+20 : b.y;
  if (ay < by){
  	return -1;
  }
  else if (ay == by){
  	if (a.x < b.x)
  		return -1;
	else if (a.x == b.x)
	{
		return 0;
	}
	return 1;
  }
  else if (ay > by)
  {
  	return 1;
  }
}

//JQuery Ready function -called when HTML has been parsed and DOM
//created
//can also be just $(function(){...});
//much JQuery code will go in here because the DOM will have been loaded by the time
//this runs

function handleTimer() {

	drawCanvas()
}




function handleSubmitButton() {

	var userText = $('#userTextField').val(); //get text from user text input field
	if (userText && userText != '') {
		var userRequestObj = {
			text: userText,
			type: "getSong"
		};
		var userRequestJSON = JSON.stringify(userRequestObj);
		$('#userTextField').val(''); //clear the user text field

		//alert ("You typed: " + userText);
		$.post("/", userRequestJSON, function(data, status) {
			console.log("data: " + data);
			console.log("typeof: " + typeof data);
			var responseObj = JSON.parse(data);
			if(responseObj.text === "NOT FOUND"){
				alert("File Not Found");
				testWords = null;
			}
			else {
				console.log(responseObj.wordArray);
				if (responseObj.wordArray) testWords = responseObj.wordArray;
				display();
				drawCanvas();
				song = userText;
				console.log(song);
			}
		});
	}

}


$(document).ready(function() {
	//This is called after the broswer has loaded the web page
	display();
	//add mouse down listener to our canvas object
	$("#canvas1").mousedown(handleMouseDown);



	timer = setInterval(handleTimer, 100);
	//timer.clearInterval(); //to stop

	drawCanvas();
});

function display() {
	if(testWords.length == 0){
		var userRequestObj = {
			text: "Brown Eyed Girl",
			type: "getSong"
		};
		var userRequestJSON = JSON.stringify(userRequestObj);
		$.post("/", userRequestJSON, function(data, status) {
			console.log("data: " + data);
			console.log("typeof: " + typeof data);
			var responseObj = JSON.parse(data);
			if(responseObj.text === "NOT FOUND"){
				alert("File Not Found");
				testWords = null;
			}
			else {
				if (responseObj.wordArray) testWords = responseObj.wordArray;
				display();
				drawCanvas();
				song = "Brown Eyed Girl";
			}
		});
	}
	var ctx = canvas.getContext('2d');
	ctx.font = "20pt Arial";
	var spaceWidth = ctx.measureText(" ").width;
	var leftPad = spaceWidth * 1;
	var topPad = 50;
	var lineSplit = 50;
	var chordDisplace = 20;
	for (var i = 0; i < testWords.length; i++) {
		var wordObj = testWords[i];
		if (wordObj.word == "\n") {

			topPad += lineSplit;
			leftPad = 0;
//continue;
		}
		wordObj.x = leftPad + spaceWidth;
		if (wordObj.word.startsWith("[")) {
			wordObj.y = topPad - chordDisplace;
		}
		else wordObj.y = topPad;

		if (wordObj.word != "\n")
			leftPad = wordObj.x + ctx.measureText(wordObj.word).width;
		else leftPad = wordObj.x;
		console.log(wordObj);
		console.log("leftPad: " + leftPad);
		console.log("width: " + ctx.measureText(wordObj.word).width);


	}

}


function handleSave()
{

	var userRequestObj = {
			text: testWords,
			type: "saveSong",
			song: song
		};
		console.log(testWords);
	$.post("/", JSON.stringify(userRequestObj), function(data, status) {

	});
}
