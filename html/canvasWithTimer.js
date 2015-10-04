/*
   Javasript to handle mouse dragging and release
   to drag a string around the html canvas
   Keyboard arrow keys are used to move a moving box around

   Here we are doing all the work with javascript and jQuery. (none of the words
   are HTML, or DOM, elements. The only DOM element is just the canvas on which
   where are drawing and a text field and button where the user can type data

   This example shows examples of using JQuery
   See the W3 Schools website to learn basic JQuery
   JQuery syntax:
   $(selector).action();
   e.g.
   $(this).hide() - hides the current element.
   $("p").hide() - hides all <p> elements.
   $(".test").hide() - hides all elements with class="test".
   $("#test").hide() - hides the element with id="test".

   Mouse event handlers are being added and removed using jQuery and
   a jQuery event object is being passed to the handlers

   Keyboard keyDown handler is being used to move a "moving box" around
   Keyboard keyUP handler is used to trigger communication with the
   server via POST message sending JSON data

 */

//Use javascript array of objects to represent words and their locations
var words = [];
words.push({word: "I", x:50, y:50});
words.push({word: "like", x:70, y:50});
words.push({word: "the", x:120, y:50});
words.push({word: "way", x:170, y:50});
words.push({word: "your", x:230, y:50});
words.push({word: "sparkling", x:300, y:50});
words.push({word: "earrings", x:430, y:50});
words.push({word: "lay", x:540, y:50});


var testWords       = [];
testWords.push({word: "I"});
testWords.push({word: "like"});
testWords.push({word: "the"});
testWords.push({word: "[Cm]"})
testWords.push({word: "way"});
testWords.push({word: "your"});
testWords.push({word: "sparkling"});
testWords.push({word: "earrings"});
testWords.push({word: "lay"});

var timer;

var wordBeingMoved;

var deltaX, deltaY; //location where mouse is pressed
var canvas = document.getElementById('canvas1'); //our drawing canvas

function getWordAtLocation(aCanvasX, aCanvasY){

	//locate the word near aCanvasX,aCanvasY
	//Just use crude region for now.
	//should be improved to using lenght of word etc.

	//note you will have to click near the start of the word
	//as it is implemented now
	var ctx= canvas.getContext("2d");
	ctx.font = '20pt Arial';
	for(var i=0; i<testWords.length; i++){
		var txt= testWords[i];
		var width = ctx.measureText(txt.word).width;
		if((Math.abs(testWords[i].y - aCanvasY) < 20) &&
				(aCanvasX > testWords[i].x &&
				 aCanvasX < (testWords[i].x + width))){
			return testWords[i];
		}
	}
	return null;
}

var drawCanvas = function(){

	var context = canvas.getContext('2d');

	context.fillStyle = 'white';
	context.fillRect(0,0,canvas.width,canvas.height); //erase canvas

	context.font = '20pt Arial';
	context.fillStyle = 'cornflowerblue';
	context.strokeStyle = 'blue';

	for(var i=0; i<testWords.length; i++){  //note i declared as var

		var data = testWords[i];
		//console.log(data.word);
		context.fillText(data.word, data.x, data.y);
		context.strokeText(data.word, data.x, data.y);

	}


	context.stroke();
};

function handleMouseDown(e){

	//get mouse location relative to canvas top left
	var rect = canvas.getBoundingClientRect();
	//var canvasX = e.clientX - rect.left;
	//var canvasY = e.clientY - rect.top;
	var canvasX = e.pageX - rect.left; //use jQuery event object pageX and pageY
	var canvasY = e.pageY - rect.top;
	console.log("mouse down:" + canvasX + ", " + canvasY);

	wordBeingMoved = getWordAtLocation(canvasX, canvasY);
	//console.log(wordBeingMoved.word);
	if(wordBeingMoved != null ){
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

function handleMouseMove(e){

	console.log("mouse move");

	//get mouse location relative to canvas top left
	var rect = canvas.getBoundingClientRect();
	var canvasX = e.pageX - rect.left;
	var canvasY = e.pageY - rect.top;

	wordBeingMoved.x = canvasX + deltaX;
	wordBeingMoved.y = canvasY + deltaY;

	e.stopPropagation();

	drawCanvas();
}

function handleMouseUp(e){
	console.log("mouse up");

	e.stopPropagation();

	//remove mouse move and mouse up handlers but leave mouse down handler
	$("#canvas1").off("mousemove", handleMouseMove); //remove mouse move handler
	$("#canvas1").off("mouseup", handleMouseUp); //remove mouse up handler

	drawCanvas(); //redraw the canvas
}

//JQuery Ready function -called when HTML has been parsed and DOM
//created
//can also be just $(function(){...});
//much JQuery code will go in here because the DOM will have been loaded by the time
//this runs

function handleTimer(){

	drawCanvas()
}




function handleSubmitButton () {

	var userText = $('#userTextField').val(); //get text from user text input field
	if(userText && userText != ''){
		var userRequestObj = {text: userText};
		var userRequestJSON = JSON.stringify(userRequestObj);
		$('#userTextField').val(''); //clear the user text field

		//alert ("You typed: " + userText);
		$.post("userText", userRequestJSON, function(data, status){
				console.log("data: " + data);
				console.log("typeof: " + typeof data);
				var responseObj = JSON.parse(data);
			
				if(responseObj.wordArray) words = responseObj.wordArray;
				});
	}

}


$(document).ready(function(){
		//This is called after the broswer has loaded the web page
		display();
		//add mouse down listener to our canvas object
		$("#canvas1").mousedown(handleMouseDown);



		timer = setInterval(handleTimer, 100);
		//timer.clearInterval(); //to stop

		drawCanvas();
		});

function display ()
{
	var ctx = canvas.getContext('2d');
	ctx.font = "20pt Arial";
	var spaceWidth = ctx.measureText(" ").width;
	var leftPad = spaceWidth*5;
	var topPad = 50;
	var lineSplit = 3;
	var chordDisplace = 10;
	for (var i = 0; i < testWords.length; i++)
	{
		var wordObj = testWords[i];
		if (wordObj.word == "\n")
			topPad += lineSplit;
		wordObj.x =  leftPad + spaceWidth;
		if (wordObj.word.startsWith("["))
		{
			wordObj.y =topPad-chordDisplace;
		}
		else wordObj.y = topPad;
		
	
		leftPad = wordObj.x +ctx.measureText(wordObj.word).width;
		console.log(wordObj);
		console.log("leftPad: " + leftPad);	
		console.log("width: " + ctx.measureText(wordObj.word).width );
		
		
	}

}



