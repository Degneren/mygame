// Get the canvas element and its 2D context
var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext('2d');

// Set up the game state
var score = 0;
var balloons = [];

// Define the Balloon class
function Balloon(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 20;
  this.color = 'red';
}

// Define the Archer class
function Archer(x, y) {
  this.x = x;
  this.y = y;
  this.width = 50;
  this.height = 50;
  this.color = 'green';
  this.arrow = null;

  // Fire an arrow
  this.fireArrow = function() {
    if (!this.arrow) {
      this.arrow = {
        x: this.x + this.width / 2,
        y: this.y,
        speed: 10,
        radius: 5
      };
    }
  };
}

// Create a new Archer object
var archer = new Archer(canvas.width / 2 - 25, canvas.height - 50);

// Handle mouse clicks to fire arrows
canvas.addEventListener('click', function(event) {
  archer.fireArrow();
});

// Set up the game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the archer
  ctx.fillStyle = archer.color;
  ctx.fillRect(archer.x, archer.y, archer.width, archer.height);

  // Draw the arrow if it exists
  if (archer.arrow) {
    ctx.beginPath();
    ctx.arc(archer.arrow.x, archer.arrow.y, archer.arrow.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    archer.arrow.y -= archer.arrow.speed;
    if (archer.arrow.y < 0) {
      archer.arrow = null;
    }
  }

  // Draw the balloons
  for (var i = 0; i < balloons.length; i++) {
    ctx.beginPath();
    ctx.arc(balloons[i].x, balloons[i].y, balloons[i].radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = balloons[i].color;
    ctx.fill();
    balloons[i].y -= 1;
    if (balloons[i].y < -balloons[i].radius) {
      balloons.splice(i, 1);
      i--;
    }
    else if (archer.arrow && distance(archer.arrow.x, archer.arrow.y, balloons[i].x, balloons[i].y) < archer.arrow.radius + balloons[i].radius) {
      balloons.splice(i, 1);
      i--;
      archer.arrow = null;
      score++;
    }
  }

  // Draw the score
  ctx.font = '24px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score,
