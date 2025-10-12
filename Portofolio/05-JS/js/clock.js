function drawClock() {
  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  drawTime(ctx, radius);
}

function drawFace(ctx, radius) {
  var grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();

  // Draw the edge circle with gradient
 var grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
  grad.addColorStop(0, "#002b28");
  grad.addColorStop(0.5, "white");
  grad.addColorStop(1, "#002b28");
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius * 0.06;
  ctx.stroke();

  // Center circle
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.05, 0, 2* Math.PI);
  ctx.fillStyle = "#000";
  ctx.fill();
}

function drawNumbers(ctx, radius) {
  var ang;
  var num ;
  ctx.font = radius * 0.15 + "px arial";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#002b28";
  ctx.textAlign = "center";

  for (num = 1; num <= 12; num++) {
    ang = (num * Math.PI) / 6;
    ctx.save();
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.restore();
  }
}

function drawTime(ctx, radius) {
  var now = new Date();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();

  var secondAngle = (second * Math.PI) / 30;
  var minuteAngle = (minute + second / 60) * (Math.PI / 30);
  var hourAngle = (hour % 12 + minute / 60 + second / 3600) * (Math.PI / 6);

  //hour
  drawHand(ctx, hourAngle, radius * 0.5, radius * 0.07);
  //minute
  drawHand(ctx, minuteAngle, radius * 0.8, radius * 0.07);
  // second
  ctx.save();
  ctx.strokeStyle = "#e74c3c"; 
  drawHand(ctx, secondAngle, radius * 0.9, radius * 0.02);
  ctx.restore();
}

function drawHand(ctx, pos, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}