const X = 20, Y = 80;
var bpm = [];
var raw_bpm = [];
var temp = [];
var upper_threshold = 180;
var at_upper_threshold = false;

function median(values){
  if(values.length ===0){return 0;}
  sliced_values = values.slice();
  sliced_values.sort(function(a,b){return a-b;});
  var half = Math.floor(sliced_values.length / 2);
  if (sliced_values.length % 2){return sliced_values[half];}
  return (sliced_values[half - 1] + sliced_values[half]) / 2.0;
}

Bangle.on('HRM', function(hrm) {
  if(bpm.length > 50){bpm.shift(); temp.shift();}
  if(raw_bpm.length > 9){
    raw_bpm.shift();
    var current_bpm = median(raw_bpm);
    bpm.push(current_bpm);
  }
  raw_bpm.push(hrm.bpm);
  temp.push(E.getTemperature());
});

function check_pulse(){
  g.clear();
  Bangle.drawWidgets();
  if(bpm.length > 1){
    var pulse = bpm[bpm.length -1];
    if(pulse > upper_threshold){
      //warn
      Bangle.buzz(200,1);
      at_upper_threshold = true;
    }
    if(at_upper_threshold){
      if(pulse < upper_threshold){
        //maybe do something else
        at_upper_threshold = false;
      }
    }
    g.setFont("Vector", 30);
    g.drawString('bpm: ' + median(bpm), X, Y, true);
    var colour = g.getColor();
    if(at_upper_threshold){g.setColor(1,0,0);}
    else{g.setColor(0,1,0);}
    require("graph").drawLine(g, bpm);
    g.setColor(colour);
  }
  else{
    g.setFont("Vector", 20);
    g.drawString('not enough data ', X, Y, true);
    g.drawString('using raw values ', X, Y+20, true);
    g.drawString('bpm: ' + median(raw_bpm), X, Y+40, true);
    require("graph").drawLine(g, raw_bpm);
  }
}
setInterval(check_pulse, 5000);
Bangle.setHRMPower(1);
