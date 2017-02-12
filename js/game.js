var gameProperties = {
  screenWidth: 800,
  screenHeight: 600,
  playerOneSpriteName: 'player1',
  playerOneSpriteURL: 'assets/player1.png',
  playerTwoSpriteName: 'player2',
  playerTwoSpriteURL: 'assets/player22.png',
  playerSpriteHeight: 100,
  playerSpriteWidth: 67,
  playerSpeed: 300,
  itemMinHeight: 191,
  itemMaxHeight:200,
  itemMaxWidth: 800,
  bathroomBgName: 'bathroom',
  bathroomBgURL: 'assets/bathroom1.png',
}

var playerTwo = {
  upCommand: Phaser.Keyboard.W,
  downCommand: Phaser.Keyboard.S,
  leftCommand: Phaser.Keyboard.D,
  rightCommand: Phaser.Keyboard.A
}

var fontAssets = {
  actionFontStyle: {font: '32px Arial', fill: 'rgba(0,0,0, 0.9)', backgroundcolor: 'rgba(0,0,0, 0.5)'},
  actionTextWidth: 16,
  actionTextHeight: gameProperties.screenHeight - 50,
}

var actionText;
var player1, player2;
var lastDirection, lastDirectionP2;
var sinks, showers;
var oldLevel;
var currentLevel;
var levelTimer = 10000;
var cursors;
var actionListeners;
// var brushTeeth, getNaked;

var levelToEnabledActions = {
  0: [0],
  1: [1],
  2: [0,1]
}

var actions = [
  {
    action: "BRUSH TEETH",
    command: Phaser.Keyboard.P,
    commandP2: Phaser.Keyboard.Q,
    commandKey: "[P]",
    commandKeyP2: "[Q]",
    imageName: 'sink',
    imageURL: 'assets/sink1.png',
    group: sinks,
    animationName: 'brushTeeth',
    animationFrames: [5,6],
  },
  {
    action: "GET NAKED",
    command: Phaser.Keyboard.M,
    commandP2: Phaser.Keyboard.E,
    commandKey: "[M]",
    commandKeyP2: "[E]",
    imageName: 'shower',
    imageURL: 'assets/shower1.png',
    group: showers,
    animationName: 'shower',
    animationFrames: [7,8],
  }
]

var mainState = function(game) {
  this.brushTeeth;
  this.getNaked;
  this.playerTwo_brushTeeth;
  this.playerTwo_getNaked;
  this.playerTwo_up;
  this.playerTwo_down;
  this.playerTwo_left;
  this.playerTwo_right;
}

mainState.prototype = {

  preload: function() {
    game.load.image(gameProperties.bathroomBgName, gameProperties.bathroomBgURL);

    currentLevel = 0;
    oldLevel = 0;

    for(var i = 0; i < actions.length; i++){
      game.load.image(actions[i].imageName, actions[i].imageURL);
    }

    game.load.spritesheet(gameProperties.playerOneSpriteName, gameProperties.playerOneSpriteURL, gameProperties.playerSpriteWidth, gameProperties.playerSpriteHeight);
    game.load.spritesheet(gameProperties.playerTwoSpriteName, gameProperties.playerTwoSpriteURL, gameProperties.playerSpriteWidth, gameProperties.playerSpriteHeight);
  },

  create: function() {
    this.initPhysics();
    this.initBackground();
    this.initText();
    this.initGraphics();
    this.initPlayers();
    this.initKeyboard();

    this.initButtons();
  },

  update: function() {
    this.updateLevel();
    this.movePlayerOne();
    this.movePlayerTwo();
    game.physics.arcade.overlap(player1, actions[0].group, this.collideWithItem, null, this);
    game.physics.arcade.overlap(player1, actions[1].group, this.collideWithItem, null, this);
    game.physics.arcade.overlap(player2, actions[0].group, this.collideWithItem, null, this);
    game.physics.arcade.overlap(player2, actions[1].group, this.collideWithItem, null, this);
  },

  collideWithItem: function(player, item) {
    // console.log(player);
    if(item.key === actions[0].imageName){
      if(player.key === 'player1'){
        if(actionListeners[0].player1.isDown){
          item.kill();
        }
      } else if(player.key === 'player2'){
        if(actionListeners[0].player2.isDown){
          item.kill();
        }
      }

    } else if (item.key === actions[1].imageName){
        if(player.key === 'player1'){
          if(actionListeners[1].player1.isDown){
            item.kill();
          }
        } else if(player.key === 'player2'){
            if(actionListeners[1].player2.isDown){
            item.kill();
            }
          }
      }
  },

  movePlayerOne: function() {
    player1.body.velocity.x = 0;
    if(cursors.left.isDown){
      player1.body.velocity.x = -gameProperties.playerSpeed;
      player1.animations.play('left');
      lastDirection = 'left';
    } else if(cursors.right.isDown){
      player1.body.velocity.x = gameProperties.playerSpeed;
      player1.animations.play('right');
      lastDirection = 'right';
    } else if(cursors.down.isDown){
      player1.body.velocity.y = gameProperties.playerSpeed;
      this.moveUpAndDownP1();
    } else if(cursors.up.isDown){
      player1.body.velocity.y = -gameProperties.playerSpeed;
      this.moveUpAndDownP1();
    } else if(this.brushTeeth.isDown){
      player1.animations.play('brushTeeth');
    } else if(this.getNaked.isDown){
      player1.animations.play('shower');
    } else {
      player1.animations.stop();
      player1.body.velocity.y = 0;
      player1.frame = 2;
    }
  },

  movePlayerTwo: function() {
    player2.body.velocity.x = 0;
    if(this.playerTwo_left.isDown){
      player2.body.velocity.x = gameProperties.playerSpeed;
      player2.animations.play('left');
      lastDirectionP2 = 'left';
    } else if(this.playerTwo_right.isDown){
      player2.body.velocity.x = -gameProperties.playerSpeed;
      player2.animations.play('right');
      lastDirectionP2 = 'right';
    } else if(this.playerTwo_up.isDown){
      player2.body.velocity.y = -gameProperties.playerSpeed;
      this.moveUpAndDownP2();
    } else if(this.playerTwo_down.isDown){
      player2.body.velocity.y = gameProperties.playerSpeed;
      this.moveUpAndDownP2();
    } else if(this.playerTwo_brushTeeth.isDown){
      player2.animations.play('brushTeeth');
    } else if(this.playerTwo_getNaked.isDown){
      player2.animations.play('shower');
    } else {
      player2.animations.stop();
      player2.body.velocity.y = 0;
      player2.frame = 2;
    }
  },

  moveUpAndDownP1: function(){
  	if(lastDirection == 'left'){
  			player1.animations.play('left');
  	} else {
  		player1.animations.play('right');
  	}
  },

  moveUpAndDownP2: function(){
  	if(lastDirectionP2 == 'left'){
  			player2.animations.play('left');
  	} else {
  		player2.animations.play('right');
  	}
  },

  initPlayers: function() {
    player1 = game.add.sprite(Math.random() * gameProperties.itemMaxWidth,  Math.random() * gameProperties.itemMaxHeight + gameProperties.itemMinHeight, gameProperties.playerOneSpriteName);
    game.physics.arcade.enable(player1);
    player1.body.collideWorldBounds = true;

    player1.animations.add('left', [0, 1], 5, true);
    player1.animations.add('right', [3, 4], 5, true);

    player2 = game.add.sprite(32,  Math.random() * gameProperties.itemMaxHeight + gameProperties.itemMinHeight, gameProperties.playerTwoSpriteName);
    game.physics.arcade.enable(player2);
    player2.body.collideWorldBounds = true;

    player2.animations.add('left', [0, 1], 5, true);
    player2.animations.add('right', [3, 4], 5, true);

    this.enableRelevantAnimations();
  },

  enableRelevantAnimations: function() {
    var enabledActions = levelToEnabledActions[currentLevel];
    for(var i = 0; i < enabledActions.length; i++){
      var index = enabledActions[i];
      player1.animations.add(actions[index].animationName, actions[index].animationFrames, 5, true);
      player2.animations.add(actions[index].animationName, actions[index].animationFrames, 5, true);
    }
  },

  initActionListeners: function() {
    actionListeners = [
      {player1: this.brushTeeth, player2: this.playerTwo_brushTeeth},
      {player1: this.getNaked, player2: this.playerTwo_getNaked},
    ];
  },

  initKeyboard: function() {
    cursors = game.input.keyboard.createCursorKeys();

    this.brushTeeth = game.input.keyboard.addKey(actions[0].command);
    this.getNaked = game.input.keyboard.addKey(actions[1].command);

    //playerTwo
    this.playerTwo_up = game.input.keyboard.addKey(playerTwo.upCommand);
    this.playerTwo_down = game.input.keyboard.addKey(playerTwo.downCommand);
    this.playerTwo_left = game.input.keyboard.addKey(playerTwo.leftCommand);
    this.playerTwo_right = game.input.keyboard.addKey(playerTwo.rightCommand);
    this.playerTwo_brushTeeth = game.input.keyboard.addKey(actions[0].commandP2);
    this.playerTwo_getNaked = game.input.keyboard.addKey(actions[1].commandP2);

    this.initActionListeners();
    //only enable those that are relevant to the level
    this.enableRelevantActions();
  },

  enableRelevantActions: function() {
    this.disableAllActions();
    var enabledActions = levelToEnabledActions[currentLevel];
    for(var i = 0; i < enabledActions.length; i++){
      var index = enabledActions[i];
      actionListeners[index].player1.enabled = true;
      actionListeners[index].player2.enabled = true;
    }
  },

  disableAllActions: function(){
    for(var i = 0; i < actionListeners.length; i++){
      actionListeners[i].enabled = false;
      console.log(actions[i].commandKey + " enabled = " + actionListeners[i].enabled);
    }
  },

  initPhysics: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
  },

  initText: function() {
    actionText = game.add.text(fontAssets.actionTextWidth, fontAssets.actionTextHeight, "LETS GO!", fontAssets.actionFontStyle);
    $("#level").text("Level: " + currentLevel);
  },

  initBackground: function() {
    game.add.sprite(0,0, gameProperties.bathroomBgName);
  },

  initGraphics: function() {
    var enabledActions = levelToEnabledActions[currentLevel];
    for(var i = 0; i < enabledActions.length; i++){
      var index = enabledActions[i];
      actions[index].group = game.add.group();
      actions[index].group.enableBody = true;

      //create group items
      for(var y = 0; y < 3; y++){
        var item = actions[index].group.create( Math.random() * gameProperties.itemMaxWidth,  Math.random() * gameProperties.itemMaxHeight + gameProperties.itemMinHeight, actions[index].imageName);
        item.body.collideWorldBounds = true;
      }

      var text = actions[index].commandKey + " NEW ACTION: " + actions[index].action + "!";
      console.log(text);
      actionText.text = text;
    }
  },

  initButtons: function() {
    $("#level0").click(function() {
      console.log("level0 clicked");
      currentLevel = 0;
    });
    $("#level1").click(function() {
      currentLevel = 1;
    });
    $("#level2").click(function() {
      currentLevel = 2;
    });
  },

  updateLevel: function() {
    if(oldLevel !== currentLevel){
      oldLevel = currentLevel;
      $("#level").text("Level: " + currentLevel);
      this.initGraphics();
      this.enableRelevantAnimations();
      this.enableRelevantActions();
    }
  }

};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add('main', mainState);
game.state.start('main');
