/* Deals with JavaScript events and drawing.
Respond to any messages received from the server via gameSocket.js
Pass any messages to be sent to the server to gameSocket.js */

// Draw canvas
//
// var radius;
// var x = 60;
// var y = 60;

var player = {id: null, x: (Math.random()*400), y : (Math.random()*400) , radius: 20, fillStyle: 'black'}




const up = 38;
const down = 40
const left = 37
const right = 39

var delta = 10;

var opponents = [];

// testing opponent

//opponents.push({x:100, y:200, radius: 30, fillStyle:'green'});

var dots = [];

var canvas = document.getElementById('game-canvas');
var context = canvas.getContext('2d');

window.addEventListener('keydown', keypress);

function keypress(e) {
//  console.log(e.keyCode);

  if (e.keyCode === up) {
//    player.y = Math.max(0, player.y-= delta);
player.y -= delta;
  }


  if (e.keyCode === down) {
//    player.y = Math.min(canvas.heigt, player.y += delta);
player.y += delta;
  }

  if (e.keyCode === left) {
  //  player.x = Math.max(0, player.x-= delta);;
  player.x -= delta;

  }

  if (e.keyCode === right) {
    player.x += delta;

  //  player.x = Math.min(canvas.width, player.x += delta);
  }

}

makeDots();
function makeDots() {

  // Replace with procedurally generated dots so each client has the same

  for (var x = 0 ; x < 100 ; x++) {

    let dot = { x : (Math.random() * canvas.width),  y: (Math.random() * canvas.height), radius: 10, fillStyle: "red"}
    dots.push(dot)
  }

}


setInterval(update, 100);


function update() {

  // draw all the things
  context.clearRect(0, 0, canvas.height, canvas.width);

  // opponents.forEach(function(op){
  //
  //   draw(op);
  // });

  //for (var n = 0 ; n < opponents.length ; n++) {
  for (var op in opponents) {

    if (!opponents[op]) {
      // yuck - figure out why they are undefined
      continue;
    }
    if (opponents[op].id == player.id) {
      //that's us, ignore
      continue;
    }

    if (collide(op, player)) {
      if (player.radius > op.radius) {
        // player is larger, nom nom nom
        ateOpponent(op);
      } else {
        // player is smaller, gets eaten
        wasEaten();
      }
    }

    draw(opponents[op], 'border');
  }

  draw(player)

  //ate dot(s?)

  for (var d = 0 ; d < dots.length ; d++) {

      let dot = dots[d];

      if (collide(dot, player)) {
        dots[d] = undefined;
        console.log('collision with ', d)
        player.radius ++;
      } else {
        draw(dot);
      }
  }

  dots = dots.filter(function(d) { return d != null ; })  // remove undefineds

  sendPosition(player);

}

function collide(a, b) {

  let dx = Math.abs(a.x - b.x);
  let dy = Math.abs(a.y - b.y);

  let rSum = a.radius + b.radius;

  return (dx*dx) + (dy*dy) <= (rSum * rSum);

}


function draw(actor, border) {
  //console.log(actor)
//  context.fillColor = actor.color;
context.fillStyle = actor.fillStyle;
  context.beginPath();
  context.arc(actor.x, actor.y, actor.radius, 0, 2 * 6.2);
  context.fill();

  if (border == "border") {
    context.strokeStyle= 'green';
    context.arc(actor.x, actor.y, actor.radius, 0, 2 * 6.2);
    context.stroke();
  }

  //context.fillRect(10, 10, 200, 200);
}





// todo handle window resize ?
