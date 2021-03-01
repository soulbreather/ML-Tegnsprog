// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'my_model/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let lastLabel = "rest";
let commonLabel = "";
let arrayLabels = [];

let mySpeech;

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(640, 360*2);
  // Create the video
  video = createCapture(VIDEO);
  video.size(640, 360);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  // Start classifying
  classifyVideo();

  mySpeech = new p5.Speech();
}

function draw() {
  background(200);
  // Draw the video
  image(flippedVideo, 0, 360);

  // Draw the label
  fill(140);
  textSize(72);
  textAlign(CENTER, CENTER);
  if(label != "Rest"){
    text(label, width / 2, height/4);
  }

  arrayLabels.unshift(label);
  if (arrayLabels.length > 45) {
    arrayLabels.pop();
    commonLabel = common(arrayLabels);
    if(lastLabel != commonLabel) {
      lastLabel = commonLabel;
      if(commonLabel != "Rest"){
        mySpeech.speak(commonLabel);
      }
    }
  }
}

// Return most common element in an array
function common(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++; 
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();

}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  // Classifiy again!
  classifyVideo();
}