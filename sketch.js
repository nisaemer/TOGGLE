//AI USAGE--------------------------------
//Prompt: "toggle the lamp image between 'on.png' and 'off.png' whenever the player presses the SPACE key."


// ASSETS
let introImg, bgImg, failImg, successImg;
let lampOnImg, lampOffImg, moonImg, sunImg;

// GAME
let state = "intro";        
let score = 0;
const target = 10;

let lampX, lampY;
let lightOn = true;

let drop = null;
let nextSpawn = 0;

function preload() {
  introImg   = loadImage("intro.png");
  bgImg      = loadImage("background.png");
  failImg    = loadImage("fail.png");
  successImg = loadImage("success.png");

  lampOnImg  = loadImage("on.png");
  lampOffImg = loadImage("off.png");
  moonImg    = loadImage("moon.png");
  sunImg     = loadImage("sun.png");
}

function setup() {
  createCanvas(600, 600);
  lampX = 300;
  lampY = 400;
  scheduleSpawn();
}

function draw() {
  if (state === "intro")   { image(introImg,   0, 0, width, height); return; }
  if (state === "fail")    { image(failImg,    0, 0, width, height); return; }
  if (state === "success") { image(successImg, 0, 0, width, height); return; }

  // PLAY
  image(bgImg, 0, 0, width, height);

  moveLamp();

  
  if (!drop && frameCount >= nextSpawn) {
    drop = new Drop();
  }

  
  if (drop) {
    drop.update();
    drop.display();

    // CATCH
    const catchY = lampY - 10;
    const catchW = 100;

    if (drop.y >= catchY) {
      const underLamp = abs(drop.x - lampX) < catchW;

      if (!underLamp) {
        state = "fail";
        drop = null;
        return;
      }

      // MOON: LIGHT ON   SUN: LIGH OFF
      const correct =
        (drop.type === "moon" && lightOn) ||
        (drop.type === "sun" && !lightOn);

      if (correct) {
        score++;
        drop = null;
        scheduleSpawn();

        if (score >= target) {
          state = "success";
          return;
        }
      } else {
        state = "fail";
        drop = null;
        return;
      }
    }

    
    if (drop && drop.y > height + 80) {
      state = "fail";
      drop = null;
      return;
    }
  }

  drawLamp();
  drawScore();
}

function drawLamp() {
  const img = lightOn ? lampOnImg : lampOffImg;

  // LAMP SIZES
  const w = 400, h = 400;

  imageMode(CENTER);
  image(img, lampX, lampY, w, h);
  imageMode(CORNER);
}

////Prompt: "Spawn a moon or sun sprite at random intervals from the top and end the game after 1 mistake win after 10 correct catches."
///"Add a scoreboard: show Score in the top-left"
function drawScore() {
  noStroke();
  fill(0, 130);
  rect(12, 12, 140, 40, 10);
  fill(255);
  textSize(18);
  textAlign(LEFT, CENTER);
  text(`Score: ${score}/${target}`, 22, 32);
}

function moveLamp() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) lampX -= 5;   // A
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) lampX += 5;  // D
  lampX = constrain(lampX, 90, width - 90);
}

function keyPressed() {
  if (state === "play" && key === " ") lightOn = !lightOn;
}

function mousePressed() {
  // CLİCK TO START
  if (state !== "play") startGame();
}

function startGame() {
  state = "play";
  score = 0;
  lampX = width / 2;
  lightOn = true;
  drop = null;
  scheduleSpawn();
}

function scheduleSpawn() {
 //SPAWN
  nextSpawn = frameCount + floor(random(84, 168));
}

// DROPP
class Drop {
  constructor() {
    this.type = random() < 0.5 ? "moon" : "sun";
    this.x = random(70, width - 70);
    this.y = -80;
    this.speed = random(2.0, 3.0);
  }
  update() { this.y += this.speed; }
  display() {
    const img = this.type === "moon" ? moonImg : sunImg;
    const s = 200; //moon and sun sizes
    imageMode(CENTER);
    image(img, this.x, this.y, s, s);
    imageMode(CORNER);
  }
}