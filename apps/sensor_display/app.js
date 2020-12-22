// position on screen
const X = 20, Y = 80;
const screens = ['practice','hrm','accel','step','temp','gps','mag'];
var screen = 0;

var bpm = [];
var temp = [];
var accel = [];
var mag = [];
var gps;
var steps;

function median(values){
  if(values.length ===0){return 0};
  values.sort(function(a,b){return a-b;});
  var half = Math.floor(values.length / 2);
  if (values.length % 2){return values[half]};
  return (values[half - 1] + values[half]) / 2.0;
}

Bangle.on('HRM', function(hrm) {
  if(bpm.length > 100){bpm.shift();}
  bpm.push(hrm.bpm);
});

Bangle.on('accel', function(xyz) {
  if(accel.length > 100){accel.shift();}
  accel.push(xyz.mag);
});

Bangle.on('swipe', function(direction) {
  screen += direction;
  if(screen < 0){screen = screens.length -1;}
  else if(screen > screens.length -1){screen = 0;}
  g.clear();
});

Bangle.on('gesture', function(xyz) { 
  //this is the start of an attack
  console.log('gesture'); console.log(xyz);
});
                                                   
function draw() {
  g.clear();
  switch(screens[screen]){
    case 'hrm':
      //Graphics.clearRect(X, Y, 240, Y-30);
      g.setFont("Vector", 40);
      g.drawString('bpm:' + Math.floor(median(bpm.slice())).toString(), X, Y, true);
    break;
    case 'accel':
      var sorted_accel = accel.slice().sort();
      var max_accel = Math.round(sorted_accel[sorted_accel.length -1]*100)/100;
      g.setFont("Vector", 40);
      g.drawString('accel', X, Y-40, true);
      g.drawString(max_accel, X, Y, true);
    break;
    case 'temp':
      g.setFont("Vector", 40);
      g.drawString('temp', X, Y-40, true);
      g.drawString(Math.round(E.getTemperature()), X, Y, true);
    break;
    default:
    //show the overall stats or a menu
  }

  
}

// Clear the screen once, at startup
g.clear();
// draw immediately at first
draw();
var secondInterval = setInterval(draw, 1000);
Bangle.setHRMPower(1);
Bangle.setCompassPower(1);
Bangle.setGPSPower(1);