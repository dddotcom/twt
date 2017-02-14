var gameProperties = {
  screenWidth: 800,
  screenHeight: 600,
  playerSpriteHeight: 200,
  playerSpriteWidth: 129,
  // playerSpriteWidth: 133,
  playerSpeed: 300,
  playerStartWidth: 32,
  itemMinHeight: 191,
  itemMaxHeight:200,
  itemMaxWidth: 800,
  actionTimer: 500,
  levelbaseTime: 7000,
  oldLevel: 0,
  currentLevel: 0,
  itemsToGenerate: 3
};

var players = [
  {
    spriteName: 'player0',
    spriteURL: 'assets/player1_moreActions11.png',
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
    spriteURL: 'assets/player2_moreActions3.png',
    upCommand: Phaser.Keyboard.W,
    downCommand: Phaser.Keyboard.S,
    leftCommand: Phaser.Keyboard.A,
    rightCommand: Phaser.Keyboard.D,
    commandListeners: [],
    actionListeners: [],
    lastDirection:'',
    score: 0,
  }
];

var fontAssets = {
  actionFontStyle: {font: '32px "Fredoka One"', fill: 'rgba(0,0,0, 0.9)', backgroundcolor: 'rgba(0,0,0, 0.5)'},
  actionTextWidth: 16,
  actionTextHeight: gameProperties.screenHeight - 50,
  scoreTextWidthLeft: gameProperties.screenWidth * 0.01,
  scoreTextWidthRight: gameProperties.screenWidth * 0.72,
  scoreTextHeight: gameProperties.screenHeight * 0.02,
  scoreFontStyle: {font: '25px "Fredoka One"', fill: 'rgba(0,0,0, 0.9)', backgroundcolor: 'rgba(0,0,0, 0.5)'},
  scoreFontStyleP1: {font: '25px "Fredoka One"', fill: '#33cc33'},
  scoreFontStyleP2: {font: '25px "Fredoka One"', fill: '#cc3399'},
  pointsFontStyle: [
    {font: '30px "Fredoka One"', fill: '#33cc33', backgroundcolor: 'rgba(0,0,0, 0.5)'},
    {font: '30px "Fredoka One"', fill: '#cc3399', backgroundcolor: 'rgba(0,0,0, 0.5)'},
  ],
};

var actionText, playerZeroText, playerOneText;
var playersGroup, textGroup;
var sinks, showers, skunks;
var cursors;
var actionListeners;
var itemsInPlay, totalItemsGenerated;

var levels = [
  {
    levelName: 'bathroom',
    levelURL: 'assets/bathroom1.png',
    enabledActions: [0],
  },
  {
    levelName: 'bathroom2',
    levelURL: 'assets/bathroom1.png',
    enabledActions: [1],
  },
  {
    levelName: 'road',
    levelURL: 'assets/road.png',
    enabledActions: [0,1],
  },
  {
    levelName: 'outsideSchool',
    levelURL: 'assets/school.png',
    enabledActions: [2],
  }
];

var actions = [
  {
    action: "BRUSH TEETH",
    command: [Phaser.Keyboard.N, Phaser.Keyboard.Z],
    commandKey: ["[N]", "[Z]"],
    imageName: 'sink',
    imageURL: 'assets/sink2.png',
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
    imageURL: 'assets/shower3.png',
    group: showers,
    animationName: 'shower',
    animationFrames: [7,8],
    points: 400,
  },
  {
    action: "FART",
    command: [Phaser.Keyboard.B, Phaser.Keyboard.C],
    commandKey: ["[B]", "[C]"],
    imageName: 'skunk',
    imageURL: 'assets/skunk.png',
    group: skunks,
    animationName: 'fart',
    animationFrames: [9,10,11],
    points: 800,
  }
];

var mainState = function(game) {
};

mainState.prototype = {

  loadAssets: function() {
    //backgrounds
    for(var i = 0; i < levels.length; i++){
        game.load.image(levels[i].levelName, levels[i].levelURL);
    }
    //items
    for(var i = 0; i < actions.length; i++){
      game.load.image(actions[i].imageName, actions[i].imageURL);
    }

    // player sprites
    for(var i = 0; i < players.length; i++){
      game.load.spritesheet(
        players[i].spriteName, players[i].spriteURL,
        gameProperties.playerSpriteWidth,
        gameProperties.playerSpriteHeight
      );
    }
  },

  preload: function() {
    itemsInPlay = 0;
    totalItemsGenerated = 0;

    this.loadAssets();
  },

  create: function() {
    this.initPhysics();
    this.initBackground();
    this.initText();
    this.initGraphics();
    this.calculateLevelTime();
    this.initPlayers();

    this.initKeyboard();
    this.startLevelTimer();
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
    var actionKey = players[playersIndex].actionListeners[actionIndex];

    if(actionKey.isDown && actionKey.duration == gameProperties.actionTimer){
      var playerWidth = player.position.x;
      var fadeDirection;
      if(playerWidth < gameProperties.screenWidth/2){
        fadeDirection = 0;
      } else {
        fadeDirection = gameProperties.screenWidth;
      }

      var fadeAway = game.add.tween(item).to({x: fadeDirection}, 800, Phaser.Easing.Linear.None, true);
      fadeAway.chain(game.add.tween(item).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true));
      fadeAway.onComplete.addOnce(item.kill, this);
      fadeAway.start();

      itemsInPlay--;
      players[playersIndex].score += actionPoints;
      this.showPoints(player, actionPoints);
    }

  },

  showPoints: function(player, actionPoints) {
    var playersIndex = player.key.split("player")[1];
    var width = player.position.x;
    var height = player.position.y -20;
    var points = game.add.text(width, height, actionPoints + "", fontAssets.pointsFontStyle[playersIndex]);
    points.setShadow(3, 3, 'rgba(0,0,0,1.0)', 0);
    game.add.tween(points).to({y: height-50}, 800, Phaser.Easing.Linear.None, true);
    game.add.tween(points).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
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
        playersGroup.children[i].animations.play(actions[0].animationName);
      } else if(players[i].actionListeners[1].isDown){
        playersGroup.children[i].animations.play(actions[1].animationName);
      } else if(players[i].actionListeners[2].isDown){
        playersGroup.children[i].animations.play(actions[2].animationName);
      }
      else {
        playersGroup.children[i].animations.stop();
        playersGroup.children[i].body.velocity.y = 0;
        playersGroup.children[i].frame = 2;
      }

      // for(var actionIndex = 0; actionIndex < actions.length; actionIndex++){
      //   if(players[i].actionListeners[actionIndex].isDown){
      //     playersGroup.children[i].animations.play(actions[0].animationName);
      //   }
      // }


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
    var enabledActions = levels[gameProperties.currentLevel].enabledActions;
    for(var i = 0; i < enabledActions.length; i++){
      var index = enabledActions[i];
      playersGroup.forEach(function(player) {
        player.animations.add(actions[index].animationName, actions[index].animationFrames, 5, true);
      }, this);
    }
  },

  enableRelevantActions: function() {
    this.disableAllActions();
    var enabledActions = levels[gameProperties.currentLevel].enabledActions;
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
    $("#level").text("Level: " + gameProperties.currentLevel);

    playerZeroText = game.add.text(fontAssets.scoreTextWidthLeft, fontAssets.scoreTextHeight, "Player 1: 000000", fontAssets.scoreFontStyleP1);
    playerOneText = game.add.text(fontAssets.scoreTextWidthRight, fontAssets.scoreTextHeight, "Player 2: 000000", fontAssets.scoreFontStyleP2);
    playerZeroText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
    playerOneText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

    textGroup = game.add.group();
    textGroup.add(actionText);
    textGroup.add(playerZeroText);
    textGroup.add(playerOneText);
  },

  updateScore: function() {
    var p1 = "00000" + players[0].score;
    var p2 = "00000" + players[1].score;
    playerZeroText.text = "Player 1: " + p1.substr(p1.length - 6);
    playerOneText.text = "Player 2: " + p2.substr(p2.length - 6);
  },

  initBackground: function() {
    gameProperties.currentBackground = game.add.sprite(0,0, levels[gameProperties.currentLevel].levelName);
  },

  initGraphics: function() {
    totalItemsGenerated = 0;
    var enabledActions = levels[gameProperties.currentLevel].enabledActions;
    for(var i = 0; i < enabledActions.length; i++){
      var index = enabledActions[i];
      actions[index].group = game.add.group();
      actions[index].group.enableBody = true;

      //create group items
      for(var y = 0; y < gameProperties.itemsToGenerate; y++){
        var item = actions[index].group.getFirstExists(false);
        if(item){
          item.revive();
        } else {
            item = actions[index].group.create(
            Math.random() * gameProperties.itemMaxWidth,
            Math.random() * gameProperties.itemMaxHeight + gameProperties.itemMinHeight,
            actions[index].imageName);
            item.body.collideWorldBounds = true;
            itemsInPlay++;
            totalItemsGenerated++;
        }
      }

      var text = actions[index].commandKey + " NEW ACTION: " + actions[index].action + "!";
      actionText.text = text;
    }
  },

  goToNextLevel: function(){
    if(gameProperties.currentLevel <= levels.length-2){
      gameProperties.currentLevel++;
    }
  },

  calculateLevelTime: function() {
    levelTime = gameProperties.levelbaseTime + (totalItemsGenerated * gameProperties.actionTimer);
  },

  startLevelTimer: function() {
    game.time.events.add(levelTime, this.goToNextLevel, this);
  },

  updateBackground: function() {
    game.add.tween(gameProperties.currentBackground).to({x: -gameProperties.screenWidth}, 800, Phaser.Easing.Linear.None, true);

    var newBackground = game.add.sprite(0,0, levels[gameProperties.currentLevel].levelName);
    newBackground.alpha = 1;
    game.add.tween(newBackground).from({x: gameProperties.screenWidth}, 800, Phaser.Easing.Linear.None, true);

    gameProperties.currentBackground = newBackground;
  },

  updateLevel: function() {
    if(gameProperties.oldLevel !== gameProperties.currentLevel){
      gameProperties.oldLevel = gameProperties.currentLevel;
      this.updateBackground();
      $("#level").text("Level: " + gameProperties.currentLevel);
      this.initGraphics();
      this.enableRelevantAnimations();
      this.enableRelevantActions();
      this.calculateLevelTime();
      this.startLevelTimer();
      //bring players to top
      var enabledActions = levels[gameProperties.currentLevel].enabledActions;
      for(var i = 0; i < enabledActions.length; i++){
        var actionIndex = enabledActions[i];
        game.world.bringToTop(actions[actionIndex].group);
      }
      game.world.bringToTop(textGroup);
      game.world.bringToTop(playersGroup);
    }
  },

  render: function() {
    // game.debug.text("Time until event: " + game.time.events.duration + "\nItems In Play: " + itemsInPlay
    // + "\nItems Generated: " + totalItemsGenerated, 32, 32);
  },

};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add('main', mainState);
game.state.start('main');
