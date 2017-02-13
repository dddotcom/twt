var gameProperties = {
  screenWidth: 800,
  screenHeight: 600,
  playerSpriteHeight: 100,
  playerSpriteWidth: 67,
  playerSpeed: 300,
  playerStartWidth: 32,
  itemMinHeight: 191,
  itemMaxHeight:200,
  itemMaxWidth: 800,
  bathroomBgName: 'bathroom',
  bathroomBgURL: 'assets/bathroom1.png',
}

var players = [
  {
    spriteName: 'player0',
    spriteURL: 'assets/player1.png',
    upCommand: Phaser.Keyboard.I,
    downCommand: Phaser.Keyboard.K,
    leftCommand: Phaser.Keyboard.J,
    rightCommand: Phaser.Keyboard.L,
    commandListeners: [],
    actionListeners: [],
    lastDirection: '',
    score: 0,
  },
  {
    spriteName: 'player1',
    spriteURL: 'assets/player22.png',
    upCommand: Phaser.Keyboard.W,
    downCommand: Phaser.Keyboard.S,
    leftCommand: Phaser.Keyboard.A,
    rightCommand: Phaser.Keyboard.D,
    commandListeners: [],
    actionListeners: [],
    lastDirection:'',
    score: 0,
  }
]

var fontAssets = {
  actionFontStyle: {font: '32px Arial', fill: 'rgba(0,0,0, 0.9)', backgroundcolor: 'rgba(0,0,0, 0.5)'},
  actionTextWidth: 16,
  actionTextHeight: gameProperties.screenHeight - 50,
  scoreTextWidthLeft: gameProperties.screenWidth * 0.02,
  scoreTextWidthRight: gameProperties.screenWidth * 0.82,
  scoreTextHeight: gameProperties.screenHeight * 0.02,
  scoreFontStyle: {font: '20px Arial', fill: 'rgba(0,0,0, 0.9)', backgroundcolor: 'rgba(0,0,0, 0.5)'},
}

var actionText, playerZeroText, playerOneText;
var playersGroup;
var sinks, showers;
var oldLevel;
var currentLevel;
var levelTimer = 10000;
var cursors;
var actionListeners;

var levelToEnabledActions = {
  0: [0],
  1: [1],
  2: [0,1]
}

var actions = [
  {
    action: "BRUSH TEETH",
    command: [Phaser.Keyboard.N, Phaser.Keyboard.Z],
    commandKey: ["[N]", "[Z]"],
    imageName: 'sink',
    imageURL: 'assets/sink1.png',
    group: sinks,
    animationName: 'brushTeeth',
    animationFrames: [5,6],
    points: 800,
  },
  {
    action: "GET NAKED",
    command: [Phaser.Keyboard.M, Phaser.Keyboard.X],
    commandKey: ["[M]", "[X]"],
    imageName: 'shower',
    imageURL: 'assets/shower1.png',
    group: showers,
    animationName: 'shower',
    animationFrames: [7,8],
    points: 400,
  }
]

var mainState = function(game) {
}

mainState.prototype = {

  preload: function() {
    game.load.image(gameProperties.bathroomBgName, gameProperties.bathroomBgURL);

    currentLevel = 0;
    oldLevel = 0;

    //load items
    for(var i = 0; i < actions.length; i++){
      game.load.image(actions[i].imageName, actions[i].imageURL);
    }

    //load players
    for(var i = 0; i < players.length; i++){
      game.load.spritesheet(players[i].spriteName, players[i].spriteURL, gameProperties.playerSpriteWidth, gameProperties.playerSpriteHeight);
    }

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
    this.movePlayers();
    for(var i = 0; i < actions.length; i++){
      for(var y = 0; y < playersGroup.children.length; y++){
        game.physics.arcade.overlap(playersGroup.children[y], actions[i].group, this.collideWithItem, null, this);
      }
    }
    this.updateScore();
  },

  collideWithItem: function(player, item) {
    var items = actions.map(function(o) { return o.imageName; });
    var actionIndex = items.indexOf(item.key);
    var actionPoints = actions[actionIndex].points;
    var playersIndex = player.key.split("player")[1];

    if(players[playersIndex].actionListeners[actionIndex].isDown){
      item.kill();
      players[playersIndex].score += actionPoints;
    }

  },

  movePlayers: function() {
    for(var i = 0; i < playersGroup.children.length; i++){
      playersGroup.children[i].body.velocity.x = 0;
      if(players[i].commandListeners[2].isDown){
        playersGroup.children[i].body.velocity.x = -gameProperties.playerSpeed;
        playersGroup.children[i].animations.play('left');
        lastDirection = 'left';
      } else if(players[i].commandListeners[3].isDown){
        playersGroup.children[i].body.velocity.x = gameProperties.playerSpeed;
        playersGroup.children[i].animations.play('right');
        lastDirection = 'right';
      } else if(players[i].commandListeners[1].isDown){
        playersGroup.children[i].body.velocity.y = gameProperties.playerSpeed;
        this.moveUpAndDown(playersGroup.children[i]);
      } else if(players[i].commandListeners[0].isDown){
        playersGroup.children[i].body.velocity.y = -gameProperties.playerSpeed;
        this.moveUpAndDown(playersGroup.children[i]);
      }
      else if(players[i].actionListeners[0].isDown){
        playersGroup.children[i].animations.play('brushTeeth');
      } else if(players[i].actionListeners[1].isDown){
        playersGroup.children[i].animations.play('shower');
      }
      else {
        playersGroup.children[i].animations.stop();
        playersGroup.children[i].body.velocity.y = 0;
        playersGroup.children[i].frame = 2;
      }
    }
  },

  moveUpAndDown: function(player){
    var index = playersGroup.children.indexOf(player);
  	if(players[index].lastDirection === 'left'){
  			player.animations.play('left');
  	} else {
  		player.animations.play('right');
  	}
  },

  initPlayers: function() {
    playersGroup = game.add.group();
    playersGroup.enableBody = true;

    //create players
    for(var i = 0; i < players.length; i++){
      var player = game.add.sprite(
        gameProperties.playerStartWidth,
        Math.random() * gameProperties.itemMaxHeight + gameProperties.itemMinHeight,
        players[i].spriteName);

      game.physics.arcade.enable(player);
      player.body.collideWorldBounds = true;
      player.animations.add('left', [0, 1], 5, true);
      player.animations.add('right', [3, 4], 5, true);


      playersGroup.add(player);
    }
    this.enableRelevantAnimations();
  },

  initKeyboard: function() {
    for(var i = 0; i < players.length; i++){
      players[i].commandListeners.push(game.input.keyboard.addKey(players[i].upCommand));
      players[i].commandListeners.push(game.input.keyboard.addKey(players[i].downCommand));
      players[i].commandListeners.push(game.input.keyboard.addKey(players[i].leftCommand));
      players[i].commandListeners.push(game.input.keyboard.addKey(players[i].rightCommand));
    }

    for(var i = 0; i < players.length; i++){
      for(var y = 0; y < actions.length; y++){
        players[i].actionListeners.push(game.input.keyboard.addKey(actions[y].command[i]));
      }
    }

    //only enable those that are relevant to the level
    this.enableRelevantActions();
  },

  enableRelevantAnimations: function() {
    var enabledActions = levelToEnabledActions[currentLevel];
    for(var i = 0; i < enabledActions.length; i++){
      var index = enabledActions[i];
      playersGroup.forEach(function(player) {
        player.animations.add(actions[index].animationName, actions[index].animationFrames, 5, true);
      }, this);
    }
  },

  enableRelevantActions: function() {
    this.disableAllActions();
    var enabledActions = levelToEnabledActions[currentLevel];
    for(var i = 0; i < enabledActions.length; i++){
      var index = enabledActions[i];
      for(var y = 0; y < players.length; y++){
        players[y].actionListeners[index].enabled = true;
      }
    }
  },

  disableAllActions: function(){
    for(var i = 0; i < actions.length; i++){
      for(var y = 0; y < players.length; y++){
        players[y].actionListeners[i].enabled = false;
      }
    }
  },

  initPhysics: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
  },

  initText: function() {
    actionText = game.add.text(fontAssets.actionTextWidth, fontAssets.actionTextHeight, "LETS GO!", fontAssets.actionFontStyle);
    $("#level").text("Level: " + currentLevel);

    playerZeroText = game.add.text(fontAssets.scoreTextWidthLeft, fontAssets.scoreTextHeight, "Player 1: 0", fontAssets.scoreFontStyle);
    playerOneText = game.add.text(fontAssets.scoreTextWidthRight, fontAssets.scoreTextHeight, "Player 2: 0", fontAssets.scoreFontStyle);
  },

  updateScore: function() {
    playerZeroText.text = "Player 1: " + players[0].score;
    playerOneText.text = "Player 2: " + players[1].score;
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
        var item = actions[index].group.create(
          Math.random() * gameProperties.itemMaxWidth,
          Math.random() * gameProperties.itemMaxHeight + gameProperties.itemMinHeight,
          actions[index].imageName);
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
