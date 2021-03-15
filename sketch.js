
// creating gameState for the game.
var START = 2;
var PLAY = 1;
var END = 0;
var gameState = 2;

// creating variables for the games.
var bird;
var logo;
var back;
var back1;
var pipe1;
var pipe2;
var edges;
var ground;
var gameOver;
var invisiblewall;

// creating value for the score.
var score = 0;

//this is the funtion preload where we upload images,animation,sound clips for the the game.
function preload() {

  //this is the image section.
  pipe1Img = loadImage("p2.png");
  pipe2Img = loadImage("p1.jpg");
  logoImg = loadImage("logo.png");
  backImg = loadImage("back1.png");
  back1Img = loadImage("back2.png");
  groundImg = loadImage("ground1.png");
  gameOverImg = loadImage("g1.png");

  //this is the animation section.
  bird_stop = loadAnimation("f5.png");
  bird_flying = loadAnimation("f1.png", "f2.png", "f3.png", "f4.png");

  //this is the sound section.
  loopSound = loadSound("loop.wav");
  jumpSound = loadSound("jump.wav");
  hitSound = loadSound("hit.wav");
}

//this is the function setup where we create sprite required for the game.
function setup() {
  //creating a compatable screen for the game(playable for every screen).
  createCanvas(windowWidth, windowHeight);
  
  //making loop sound for the game.
  loopSound.loop();

  //creating the ground for the game.
  ground = createSprite(width / 2, height + 50);
  ground.addImage(groundImg);
  ground.velocityX = -8;
  ground.scale = 0.3;

  //creating mountain1 for the game.
  back = createSprite(width / 2 + 200, 500);
  back.addImage(backImg);
  back.velocityX = -0.8;
  back.scale = 2;

  //creating mountain2 for the game.
  back1 = createSprite(width / 2 + 1000, 500);
  back1.addImage(back1Img);
  back1.velocityX = -0.8;
  back1.scale = 0.3;

  //creating flappy bird for the game.
  bird = createSprite(width / 2, height / 2);
  bird.addAnimation("flying", bird_flying);
  bird.scale = 0.08;

  //creating logo for the game.
  logo = createSprite(width / 2, height / 2 - 200);
  logo.addImage(logoImg);
  logo.scale = 0.7;

  //creating gameOver for the game
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.15;

  //creating edges for the game.
  edges = createEdgeSprites();

  //creating specific group for random object.
  pipeGroup = new Group();
  invisibleGroup = new Group();
}

//this is the function draw where we make certain changes for the game.
function draw() {
  
  //making the sky;
  background("lightblue");

  //this is the gameState START.
  if (gameState === START) {
    //making invisible the gameOver.
    gameOver.visible = false;
    //giving velocity to the object .
    back.velocityX = -0.8;
    back1.velocityX = -0.8;
    ground.velocityX = -8;

    //changing the gameState START to PLAY .
    if (touches.length > 0 || mouseIsPressed) {
      back.velocityX = -0.8;
      back1.velocityX = -0.8;
      ground.velocityX = -8;
      gameState = PLAY;
      touches = [];
    }
  }

  //displaying all the sprites.
  drawSprites();

  //this is the gameState PLAY;
  if (gameState === PLAY) {
    //making object invisible.
    logo.visible = false;
    gameOver.visible = false;

    //colliding bird with the edges.
    bird.collide(edges);

    //making jump the birdon touching or pressing the key space in keyboard.
    if (touches.length > 0 || keyWentDown("space")) {
      jumpSound.play();
      bird.velocityY = -15;
      touches = [];
    }

    //creating 1 point of score on touching the invisible bar.
    if (bird.isTouching(invisibleGroup)) {
      score = score + 0.125;
    }

    //creating the function that if bird is touching pipeGroup or ground the gamestate is changed to END.
    if (bird.isTouching(pipeGroup) || bird.isTouching(ground)) {
      hitSound.play();
      gameState = END;
    }

    //increcing gravity of ground on increase of score.
    bird.velocityY = bird.velocityY + (1 + score / 10);

    //creating pillar at random position.
    if (frameCount % 70 === 0) {
      pipe1 = createSprite(width, height - Math.round(random(150, 0)));
      pipe1.addImage(pipe1Img);
      pipe1.scale = 1.5;
      pipe1.lifetime = 400;
      pipe1.velocityX = -8;
      pipeGroup.add(pipe1);
    }
   //creating pillar at random position.
    if (frameCount % 70 === 0) {
      pipe2 = createSprite(width, 0);
      pipe2.y = pipe1.y - (700 - (10 * score / 2));
      pipe2.addImage(pipe2Img);
      pipe2.scale = 1.5;
      pipe2.lifetime = 400;
      pipe2.velocityX = -8;
      pipeGroup.add(pipe2);
    }
    //creating invisible pillar at random position.
    if (frameCount % 70 === 0) {
      invisiblewall = createSprite(width, 0, 1, 150);
      invisiblewall.y = pipe1.y - 350;
      invisiblewall.x = pipe1.x + 20;
      invisiblewall.scale = 1.5;
      invisiblewall.lifetime = 400;
      invisiblewall.velocityX = -8;
      invisiblewall.visible = false;
      invisibleGroup.add(invisiblewall);
    }

    //displaying score on the game.
    textSize(40);
    fill("black");
    stroke("black");
    text(Math.round(score), width / 2, height / 2 - 250);
  }

  //this is the gameState END.
  if (gameState === END) {
    gameOver.visible = true;

    //this is for changing animation.
    bird.addAnimation("flying", bird_stop);

    //this is for colliding with the selected object.
    bird.collide(ground);
    bird.collide(pipeGroup);

    //this is the velocity of the object.
    bird.velocityY = 15;
    bird.velocityX = 0;
    back.velocityX = 0;
    back1.velocityX = 0;
    ground.velocityX = 0;

    //this is for stoping pipeGroup.
    pipeGroup.setVelocityXEach(0);
    pipeGroup.setLifetimeEach(-1);

    //this is for stoping invisibleGroup.
    invisibleGroup.setVelocityXEach(0);
    invisibleGroup.setLifetimeEach(-1);

    //if we press mouse then we will restart the game;
    if(mouseIsPressed){ 
      bird.addAnimation("flying", bird_flying);
      pipeGroup.destroyEach();
      invisibleGroup.destroyEach();
      back.x =width / 2 + 200;
      back1.x =width / 2 + 1000;
      score = 0;
      bird.y = height/2;
      bird.velocityY = -10;
      bird.velocityX = 0;
      back.velocityX = -0.8;
      back1.velocityX = -0.8;
      ground.velocityX = -8;
      gameState = PLAY;
    }
    //displaying click for restart;
    textSize(20);
    stroke("black");
    fill("black");
    text("'click to restart'",width/2-60,height-300);
  }

  //this is for infinte mountain1.
  if (back.x < -1000) {
    back.x = 2000;
  }

  //this is for infinte mountain2.
  if (back1.x < -1800) {
    back1.x = 2300;
  }

  //this is for infinite background.
  if (ground.x < height / 2 + 150) {
    ground.x = width;
  }

  //this is for keeping specific object above specific object.
  ground.depth = back.depth;
  ground.depth = ground.depth + 1;
  ground.depth = back1.depth;
  ground.depth = ground.depth + 1;
  back.depth = back1.depth;
  back.depth = back.depth - 1;
  gameOver.depth = gameOver.depth+10; 
}