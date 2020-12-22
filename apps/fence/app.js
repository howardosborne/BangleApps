// position on screen
const X = 20, Y = 80;
const screens = ['time','hrm','accel','step','temp','gps','mag'];
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
  if(bpm.length > 8){bpm.shift();}
  bpm.push(hrm.bpm);
});

Bangle.on('accel', function(xyz) {
  if(accel.length > 100){accel.shift();}
  accel.push(xyz.mag);
});

Bangle.on('mag', function(xyz) {
  if(mag.length > 10){mag.shift();}
  mag.push(xyz.heading);
});

Bangle.on('swipe', function(direction) {
  screen += direction;
  if(screen < 0){screen = screens.length -1;}
  else if(screen > screens.length -1){screen = 0;}
  //screens = ['time','hrm','accel','step','temp','gps','mag'];
  /*switch(screens[screen]){
    case 'mag' | 'gps':
      Bangle.setCompassPower(1);
      Bangle.setGPSPower(1);
    break;
    default:
      Bangle.setCompassPower(0);
      Bangle.setGPSPower(0);
  }
  */
  g.clear();
});
//Bangle.on('touch', function(button) {console.log('touch'); console.log(button); });
//Bangle.on('twist', function() { console.log("twist"); });
Bangle.on('step', function(up) { steps = up;});
//Bangle.on('aiGesture', function(gesture, weights) {console.log('aiGesture'); console.log(gesture); console.log(weights); });
//Bangle.on('charging', function(charging) { console.log('charging'); console.log(charging);});
//Bangle.on('faceUp', function(up) { console.log('faceUp'); console.log(up);});
//Bangle.on('gesture', function(xyz) { console.log('gesture'); console.log(xyz);});
Bangle.on('GPS', function(fix) { gps = fix;});
//Bangle.on('GPS-raw', function(nmea) { console.log('GPS-raw'); console.log(nmea);});
//Bangle.on('lcdPower', function(on) { console.log('lcdPower'); console.log(on);});

                                                   
function draw() {
  //screens = ['time','hrm','accel','step','temp','gps','mag'];
  g.clear();
  switch(screens[screen]){
    case 'time':
      var d = new Date();
      var h = d.getHours(), m = d.getMinutes();
      var time = (" "+h).substr(-2) + ":" + ("0"+m).substr(-2);
      //clear area written by time - could check what has changed and clear that
      //g.clearRect(X, Y, 240, Y-30);
      g.setFont("Vector", 60);
      g.drawString(time, X, Y, true);
      g.setFont("Vector", 40);
      g.drawString(("0"+d.getSeconds()).substr(-2), X+170, Y+18, true);
    break;
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
    case 'step':
      g.setFont("Vector", 40);
      g.drawString('step', X, Y-40, true);
      g.drawString(steps, X, Y, true);
    break;
    case 'temp':
      g.setFont("Vector", 40);
      g.drawString('temp', X, Y-40, true);
      g.drawString(Math.round(E.getTemperature()), X, Y, true);
    break;
    case 'gps':
      g.setFont("Vector", 40);
      g.drawString('gps', X, Y-40, true);
      /*
      console.log(gps);
      gps.lat
      gps.lon
      gps.alt
      gps.speed
      gps.course
      gps.time
      gps.satellites
      gps.fix
      gsp.hdop
      */
      g.drawString(gps.speed, X, Y, true);
    break;
    case 'mag':
      g.setFont("Vector", 40);
      g.drawString('mag', X, Y-40, true);
      g.drawString(mag[mag.length-1], X, Y, true);
    break;
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