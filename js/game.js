var mainState = function(game){
  this.text;
  this.color;
  this.actionsSeen = new Set();
  this.overLaptime;
};

mainState.prototype = {

  create: function() {
    this.initPhysics();
    this.initBackground();
    this.initGraphics();
    this.calculateLevelTime();
    this.initPlayers();
    this.initKeyboard();
    this.startLevelTimer();
  },

  update: function() {
    this.updateLevel();
    this.movePlayers();

    game.physics.arcade.overlap(playersGroup, allItems, this.collideWithItem, null, this);
    this.updateScore();
    this.leaveLevelEarly();
    this.gameOver();
  },

  leaveLevelEarly: function() {
    //if all items have been killed
    if( gameProperties.currentLevel !== 0 && gameProperties.currentLevel !== levels.length-1){
      if(itemsInPlay.length === 0){
        this.removeLevelTimers();
        this.goToNextLevel()
      }
    }
  },

  removeOverlap: function(item, allItems) {
    var newWidth = Math.random() * gameProperties.itemMaxWidth + gameProperties.itemMinWidth;
    var newHeight = Math.random() * gameProperties.itemMaxHeight + gameProperties.itemMinHeight;
    item.x = newWidth;
    item.y = newHeight;
  },

  decreaseActionPointValue: function() {
    if(gameProperties.actionPointsCurrent > gameProperties.actionPointsMin){
        gameProperties.actionPointsCurrent = gameProperties.actionPointsCurrent - gameProperties.actionPointsDecreaseRate.points;
    }
    //
    this.generateActionText();
  },

  collideWithItem: function(player, item) {
    var items = actions.map(function(o) { return o.imageName; });
    var actionIndex = items.indexOf(item.key);
    var actionPoints = gameProperties.actionPointsCurrent;
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
      fadeAway.onComplete.add( function() {
        var itemToRemove = itemsInPlay.indexOf(item);
        itemsInPlay.splice(itemToRemove, 1);
        item.destroy();
      }, this);
      fadeAway.start();
      players[playersIndex].score += actionPoints;
      this.showPoints(player, item, actionPoints);
    }

  },

  showPoints: function(player, item, actionPoints) {
    var playersIndex = player.key.split("player")[1];
    var width = item.position.x;
    var height = item.position.y -20;
    var points = game.add.text(width, height, actionPoints + "", fontAssets.pointsFontStyle[playersIndex]);
    points.setShadow(3, 3, 'rgba(0,0,0,1.0)', 0);
    game.add.tween(points).to({y: height-50}, 800, Phaser.Easing.Linear.None, true);
    game.add.tween(points).to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
  },

  removeHover: function(playerControllerId) {
    $("#" + playerControllerId + " .controllerButton").removeClass("hover");
    $("#" + playerControllerId + " .keyboardButton").removeClass("hover");
  },

  movePlayers: function() {
    for(var i = 0; i < playersGroup.children.length; i++){
      playersGroup.children[i].body.velocity.x = 0;
      if(players[i].commandListeners.left.isDown){
        playersGroup.children[i].body.velocity.x = -gameProperties.playerSpeed;
        playersGroup.children[i].animations.play(gameProperties.playerMovements.left.animationName);
        $("#" + players[i].directionalCommands.left).addClass("hover");
        lastDirection = 'left';
      } else if(players[i].commandListeners.right.isDown){
        playersGroup.children[i].body.velocity.x = gameProperties.playerSpeed;
        playersGroup.children[i].animations.play(gameProperties.playerMovements.right.animationName);
        $("#" + players[i].directionalCommands.right).addClass("hover");
        lastDirection = 'right';
      } else if(players[i].commandListeners.down.isDown){
        playersGroup.children[i].body.velocity.y = gameProperties.playerSpeed;
        $("#" + players[i].directionalCommands.down).addClass("hover");
        this.moveUpAndDown(playersGroup.children[i]);
      } else if(players[i].commandListeners.up.isDown){
        playersGroup.children[i].body.velocity.y = -gameProperties.playerSpeed;
        $("#" + players[i].directionalCommands.up).addClass("hover");
        this.moveUpAndDown(playersGroup.children[i]);
      }
      else if(players[i].actionListeners[0].isDown){
        this.playActionAnimation(i, 0);
      } else if(players[i].actionListeners[1].isDown){
        this.playActionAnimation(i, 1);
      } else if(players[i].actionListeners[2].isDown){
        this.playActionAnimation(i, 2);
      } else if(players[i].actionListeners[3].isDown){
        this.playActionAnimation(i, 3);
      } else if(players[i].actionListeners[4].isDown){
        this.playActionAnimation(i, 4);
      } else if(players[i].actionListeners[5].isDown){
        this.playActionAnimation(i, 5);
      }
      else {
        this.removeHover(players[i].spriteName);
        playersGroup.children[i].body.velocity.x = 0;
        playersGroup.children[i].animations.stop();
        playersGroup.children[i].body.velocity.y = 0;
        playersGroup.children[i].frame = gameProperties.playerMovements.standStill.animationFrames;
      }
    }
  },

  playActionAnimation: function(playerIndex, actionIndex){
    playersGroup.children[playerIndex].animations.play(actions[actionIndex].animationName);
    $("#" + actions[actionIndex].command[playerIndex]).addClass("hover");
    $('#' + actions[actionIndex].animationName).get(0).play();
  },

  moveUpAndDown: function(player){
    var index = playersGroup.children.indexOf(player);
  	if(players[index].lastDirection === 'left'){
  			player.animations.play('left');
  	} else {
  		player.animations.play('right');
  	}
  },

  populateValidKeysArray: function(playerIndex) {
    for(var i = 0; i < actions.length; i++){
      players[playerIndex].validKeys.push(actions[i].command[playerIndex]);
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
        player.animations.add(gameProperties.playerMovements.left.animationName, gameProperties.playerMovements.left.animationFrames, 5, true);
        player.animations.add(gameProperties.playerMovements.right.animationName, gameProperties.playerMovements.right.animationFrames, 5, true);

        playersGroup.add(player);

        this.populateValidKeysArray(i);
    }

    this.enableRelevantAnimations();
  },

  initKeyboard: function() {
    for(var i = 0; i < players.length; i++){
      players[i].commandListeners.up = game.input.keyboard.addKey(players[i].directionalCommands.up);
      players[i].commandListeners.down = game.input.keyboard.addKey(players[i].directionalCommands.down);
      players[i].commandListeners.left = game.input.keyboard.addKey(players[i].directionalCommands.left);
      players[i].commandListeners.right = game.input.keyboard.addKey(players[i].directionalCommands.right);
    }

    for(var i = 0; i < players.length; i++){
      for(var y = 0; y < actions.length; y++){
        players[i].actionListeners.push(game.input.keyboard.addKey(actions[y].command[i]));
      }
    }
    //only enable those that are relevant to the level
    this.disableAllActions();
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
    var enabledActions = levels[gameProperties.currentLevel].enabledActions;
    for(var i = 0; i < enabledActions.length; i++){
      var index = enabledActions[i];
      for(var y = 0; y < players.length; y++){
        players[y].actionListeners[index].enabled = true;
      }
    }
  },

  addToActionsSeen: function() {
    var enabledActions = levels[gameProperties.currentLevel].enabledActions;
    for(var i = 0; i < enabledActions.length; i++){
      var index = enabledActions[i];
      this.actionsSeen.add(index);
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

  updateScore: function() {
    var p1 = "00000" + players[0].score;
    var p2 = "00000" + players[1].score;
    updatePoints(0, p1.substr(p1.length - 6));
    updatePoints(1, p2.substr(p2.length - 6));
  },

  initBackground: function() {
    gameProperties.currentBackground = game.add.sprite(0,0, levels[gameProperties.currentLevel].levelName);
  },

  killAllItemsInPlay: function() {
    for(var i = 0; i < itemsInPlay.length; i++){
        itemsInPlay[i].kill();
    }
    itemsInPlay = [];
  },

  initGraphics: function() {
    totalItemsGenerated = 0;
    this.killAllItemsInPlay();

    var enabledActions = levels[gameProperties.currentLevel].enabledActions;

    allItems = game.add.group();
    allItems.enableBody = true;

    for(var i = 0; i < enabledActions.length; i++){
      var index = enabledActions[i];
      //create group items
      for(var y = 0; y < gameProperties.itemsToGenerate; y++){
        item = allItems.create(
        Math.random() * gameProperties.itemMaxWidth + gameProperties.itemMinWidth,
        Math.random() * gameProperties.itemMaxHeight + gameProperties.itemMinHeight,
        actions[index].imageName);

        //  This adjusts the collision body size
        item.body.setSize(item.body.halfWidth, item.body.halfHeight, item.body.halfWidth/2, item.body.halfHeight/2);
        game.physics.arcade.enable(item);
        item.body.collideWorldBounds = true;
        itemsInPlay.push(item);
        totalItemsGenerated++;
      }
    }

    game.physics.arcade.overlap(allItems, allItems, this.removeOverlap, null, this);

    if(enabledActions.length === 0){
      this.text = "";
      this.color = "";
    }
    this.generateActionText();
  },

  generateActionText: function(){
    var currentLevel = gameProperties.currentLevel;
    var currentLevelActions = levels[currentLevel].enabledActions;
    var actionIndex;

    //chose a random action to display
    if(currentLevelActions.length > 1){
        actionIndex = currentLevelActions[Math.floor(Math.random()*currentLevelActions.length)];
    } else if(currentLevelActions.length === 1) {
        actionIndex = currentLevelActions[0];
    } else {
      this.text = "";
      this.color = "black";
      updateActionText(this.text, this.color);
      return;
    }

    if(this.actionsSeen.has(actionIndex)){
      this.text = (" " + actions[actionIndex].action + "!");
    } else {
      this.text = " NEW ACTION: " + actions[actionIndex].action + "!";
    }
    this.color = actions[actionIndex].color;

    updateActionText(this.text, this.color);
  },

  goToNextLevel: function(){
    if(gameProperties.currentLevel <= levels.length-2){
      this.addToActionsSeen();
      gameProperties.currentLevel++;
    }
  },

  calculateLevelTime: function() {
    levelTime = gameProperties.levelbaseTime + (totalItemsGenerated * gameProperties.actionTimeAddition);
  },

  removeLevelTimers: function() {
    game.time.events.remove(gameProperties.levelTimer);
    game.time.events.remove(gameProperties.actionPointsTimer);
  },

  startLevelTimer: function() {
    gameProperties.levelTimer = game.time.events.add(levelTime, this.goToNextLevel, this);
    if(gameProperties.currentLevel > 0){
        gameProperties.actionPointsTimer = game.time.events.loop(gameProperties.actionPointsDecreaseRate.time, this.decreaseActionPointValue, this);
    }
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
      gameProperties.actionPointsCurrent = gameProperties.actionPointsMax;
      this.updateBackground();
      this.initGraphics();

      if(gameProperties.currentLevel >= 7){
        //start switching buttons
        randomizePlayerActions(0);
        randomizePlayerActions(1);
      }
      this.enableRelevantActions();
      this.enableRelevantAnimations();
      this.calculateLevelTime();
      this.removeLevelTimers();
      this.startLevelTimer();

      //bring players to the top
      game.world.bringToTop(allItems);
      game.world.bringToTop(playersGroup);
    }
  },

  gameOver: function() {
    var timeLeft = gameProperties.levelTimer.tick - gameProperties.levelTimer.timer._now;
    if( (timeLeft === 0) && (gameProperties.currentLevel === levels.length-1 )){
      this.game.state.start('state3');
    }
  },

  render: function() {
    if(gameProperties.debug){
      // gameProperties.levelTimer.tick - gameProperties.levelTimer.timer._now
      // if(gameProperties.actionPointsTimer){
        game.debug.text("Action Text Timer: " +
        (gameProperties.levelTimer.tick - gameProperties.levelTimer.timer._now) + "\nItems In Play: " + itemsInPlay.length
        + "\nItems Generated: " + totalItemsGenerated, 32, 32);
        allItems.forEach(function(item){
            game.debug.body(item);
        });
      // }
      playersGroup
      .forEach(function(player){
        game.debug.body(player);
      });
    }
  },

};
