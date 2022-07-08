/** @format */

kaboom({
  global: true,
  fullscreen: true,
  clearColor: [0, 0.4, 0.8, 1],
  debug: true,
  scale: 2,
});
loadRoot("./sprites/");
loadSprite("mario", "mario.png");
loadSprite("coin", "coin.png");
loadSprite("block", "ground.png");
loadSprite("surprise-block", "surprise.png");
loadSprite("goomba", "evil_mushroom.png");
loadSprite("castle", "castle.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("pipe", "pipe2.png");
loadSprite("cloud", "cloud.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("grass", "shrubbery.png");
loadSprite("flag", "flagg.png ");
loadSound("gameSound", "gameSound.mp3");
loadSound("game over", "gameOver.mp3");
loadSound("jumpSound", "jumpSound.mp3");

scene("win", (score) => {
  add([
    text("You win!!!!!\nscore : " + score, 35),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyRelease("space", () => {
    go("begin");
  });
});

scene("begin", () => {
  add([
    text("Wellcome to my game\n Press space to strat ", 30),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyRelease("space", () => {
    go("game");
  });
});

scene("vacation", (score) => {
  add([
    text(
      "Sam Elias \nGame over!!\nscore : " +
        score +
        "\nPress enter to restart : ",
      27
    ),
    origin("center"),
    pos(width() / 2, height() / 2),
    play("game over"),
  ]);
  keyRelease("enter", () => {
    go("game");
  });
});
scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");
  const symbolMap = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), scale(1.3)],
    "#": [sprite("cloud")],
    "@": [sprite("surprise-block"), solid(), "surprise-coin"],
    "*": [sprite("surprise-block"), solid(), "surprise-mushroom"],
    $: [sprite("goomba"), body(), solid(), "goomba"],
    "%": [sprite("pipe"), solid()],
    c: [sprite("coin"), "coin"],
    m: [sprite("mushroom"), body(), "mushroom"],
    x: [sprite("unboxed"), solid()],
    f: [sprite("flag"), scale(5), "flag"],
    "!": [sprite("castle")],
    "+": [sprite("grass"), scale(1.5)],
  };

  const map = [
    "    ####                                                    ####                              ",
    "              *===*==@                                                                ######  ",
    "  ###                   #####                   ######                                        ",
    "         $     ###                   =@==*                                #####               ",
    "       @====*                                                                                 ",
    "      =      =        @===*           ###                        @===*==    =   =             ",
    "                             ==@*==@           @          $                ==   ==     !   f  ",
    "   @*             $                                    =@@=*==             ==   ==            ",
    "                                                                          ===   ===           ",
    "       $    +     %       $   +            $ +         +          +   $  ====   ====%         ",
    "=====================================  ======================  ==============   ==============",
    "=====================================  ======================  ==============   ==============",
    "=====================================  ======================  ==============   ==============",
    "=====================================  ======================  ==============   ==============",
    "=====================================  ======================  ==============   ==============",
  ];
  const speed = 120;
  const jumpforce = 350;
  let isJumping = false;
  const falldown = 350;
  let score = 0;
  let goombaSpeed = 20;
  const scoreLabel = add([
    text("Score : " + score),
    pos(50, 10),
    layer("ui"),
    {
      value: score,
    },
  ]);
  const gameLevel = addLevel(map, symbolMap);
  const player = add([
    sprite("mario"),
    solid(),
    body(),
    pos(30, 0),
    origin("bot"),
    big(jumpforce),
  ]);

  player.on("headbump", (obj) => {
    if (obj.is("surprise-coin")) {
      gameLevel.spawn("c", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }
    if (obj.is("surprise-mushroom")) {
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }
  });

  keyDown("right", () => {
    player.move(speed, 0);
  });

  keyDown("left", () => {
    if (player.pos.x > 10) player.move(-speed, 0);
  });

  keyDown("up", () => {
    if (player.grounded()) {
      player.jump(jumpforce);
      play("jumpSound");
      isJumping = true;
    }
  });
  player.collides("coin", (x) => {
    scoreLabel.value += 5;
    scoreLabel.text = "Score : " + scoreLabel.value;
    destroy(x);
  });
  player.collides("mushroom", (x) => {
    destroy(x);
    player.biggify(7);
    scoreLabel.value += 10;
    scoreLabel.text = "Score : " + scoreLabel.value;
  });

  action("mushroom", (mush) => {
    mush.move(40, 0);
  });

  action("goomba", (goom) => {
    goom.move(-goombaSpeed, 0);
  });
  player.collides("goomba", (x) => {
    scoreLabel.value += 110;
    scoreLabel.text = "Score : " + scoreLabel.value;
    if (isJumping) {
      destroy(x);
    } else if (player.isBig()) {
      player.smallify();
      destroy(x);
    } else {
      go("vacation", scoreLabel.value);
      destroy(player);
    }
  });
  player.action(() => {
    camPos(player.pos.x, 200);
    scoreLabel.pos.x = player.pos.x - 400;
    if (player.grounded()) {
      isJumping = false;
    } else {
      isJumping = true;
    }

    if (player.pos.y > falldown) {
      destroy(player);
      go("vacation", scoreLabel.value);
    }
    if (scoreLabel.value >= 700) {
      go("win", scoreLabel.value);
    }
  });
  player.collides("flag", (x) => {
    destroy(player);
    go("win", scoreLabel.value);
  });
  loop(4, () => {
    goombaSpeed = goombaSpeed * -1;
  });
});

start("game");
