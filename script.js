var options = ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","00","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36"];

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item) {
  if(item%2 == 0){
    return "#b40e0e";
  }else{
    return "#1B0606";
  }
}

function drawRouletteWheel() {

  var canvas = document.getElementById("canvas");
  
  if (canvas.getContext) {
    var outsideRadius = 150;
    var textRadius = 120;
    var insideRadius = 100;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,500,500);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = 'bold 10px Helvetica, Arial';

    for(var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];
      if(i == 0 || i == 19){
        ctx.fillStyle = "darkGreen";
      }else{
        ctx.fillStyle = getColor(i);
      }

      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 0;
      ctx.shadowColor   = "rgb(220,220,220)";
      ctx.fillStyle = "white";
      ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                    250 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    } 

    //Arrow
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(260, 260 - outsideRadius + 5, 8, 0, 2 * Math.PI); // Draws a circle
    ctx.fill();
  }
}



function spin() {
    $("#rollet-audio").trigger('play');
    // document.getElementById("rollet-audio").play();
  setTimeout(() => {
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 2000;
    rotateWheel();
  }, 500);
  setTimeout(() => {    
    $("#rollet-audio").trigger('pause');
    $("#rollet-audio").prop("currentTime",0);
  }, 7500);
}

function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
    document.getElementById("rollet-audio").pause();
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = options[index]
  console.log(text);
//   ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
}

function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

drawRouletteWheel();