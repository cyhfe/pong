const width = 500;
const height = 700;
const offset = 10;

const body = document.body;
const screenWidth = body.scrollWidth;

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

canvas.addEventListener('mousemove', (e) => {
  let offsetLeft = screenWidth / 2 - width / 2;
  user.x = e.clientX - offsetLeft;
  canvas.style.cursor = 'none';
});

const ball = {
  x: width / 2,
  y: height / 2,
  radius: 5,
  velocityX: 0,
  velocityY: 5,
  speed: 5,
};

const user = {
  x: width / 2 - 25,
  y: height - 20,
  width: 50,
  height: 10,
  score: 0,
};

const com = {
  x: width / 2 - 25,
  y: offset,
  width: 50,
  height: 10,
  score: 0,
};

function createCanvas() {
  canvas.width = width;
  canvas.height = height;
  body.appendChild(canvas);
  render();
}

function render() {
  // 渲染背景
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  // 板
  context.fillStyle = 'white';
  context.fillRect(com.x, com.y, com.width, com.height);
  context.fillRect(user.x, user.y, user.width, user.height);
  // 线
  context.beginPath();
  context.setLineDash([4]);
  context.moveTo(0, 350);
  context.lineTo(500, 350);
  context.strokeStyle = 'grey';
  context.stroke();
  // 球
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 2 * Math.PI, false);
  context.fillStyle = 'white';
  context.fill();

  // 分数
  context.fillStyle = '#FFF';
  context.font = '32px Courier New';
  context.fillText(com.score, 20, height / 2 - 50);
  context.fillText(user.score, 20, height / 2 + 70);
}

function resetBall() {
  ball.x = width / 2;
  ball.y = height / 2;
  ball.velocityY = -ball.velocityY;
  ball.speed = 7;
}

function update() {
  ball.y += ball.velocityY;
  ball.x += ball.velocityX;
  // 左右边界碰撞
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
    ball.velocityX = -ball.velocityX;
  }

  // 得分
  if (ball.y < 0) {
    user.score++;
    resetBall();
  }
  if (ball.y > height) {
    com.score++;
    resetBall();
  }
  console.log(collision());
  // 板碰撞
  if (collision()) {
    let player = ball.y > height / 2 ? user : com;
    let collidePoint = ball.x - (player.x + player.width / 2);
    // -1 到 1
    let collideRate = collidePoint / (player.width / 2);

    // 反射角度
    let angle = collideRate * (Math.PI / 4);

    let direction = ball.y + ball.radius < canvas.height / 2 ? 1 : -1;
    ball.velocityY = direction * ball.speed * Math.cos(angle);
    ball.velocityX = ball.speed * Math.sin(angle);
    ball.speed += 0.1;
  }

  // AI
  let computerLevel = 0.15;
  com.x += (ball.x - (com.x + com.width / 2)) * computerLevel;
}

function collision() {
  let userContact =
    ball.y + ball.radius >= user.y &&
    ball.x >= user.x &&
    ball.x <= user.x + user.width;
  let comContact =
    ball.y - ball.radius <= com.y &&
    ball.x >= com.x &&
    ball.x <= com.x + com.width;
  return userContact || comContact;
}

function animate() {
  update();
  render();
  requestAnimationFrame(animate);
}

createCanvas();
animate();
