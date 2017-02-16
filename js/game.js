var mainState = function(game){};

mainState.prototype = {

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

  removeHover: function(playerControllerId) {
    $("#" + playerControllerId + " .controllerButton").removeClass("hover");
    $("#" + playerControllerId + " .keyboardButton").removeClass("hover");
  },

  movePlayers: function() {
    for(var i = 0; i < playersGroup.children.length; i++){
      playersGroup.children[i].body.velocity.x = 0;
      if(players[i].commandListeners[2].isDown){
        playersGroup.children[i].body.velocity.x = -gameProperties.playerSpeed;
        playersGroup.children[i].animations.play('left');
        $("#" + players[i].leftCommand).addClass("hover");
        lastDirection = 'left';
      } else if(players[i].commandListeners[3].isDown){
        playersGroup.children[i].body.velocity.x = gameProperties.playerSpeed;
        playersGroup.children[i].animations.play('right');
        $("#" + players[i].rightCommand).addClass("hover");
        lastDirection = 'right';
      } else if(players[i].commandListeners[1].isDown){
        playersGroup.children[i].body.velocity.y = gameProperties.playerSpeed;
        $("#" + players[i].downCommand).addClass("hover");
        this.moveUpAndDown(playersGroup.children[i]);
      } else if(players[i].commandListeners[0].isDown){
        playersGroup.children[i].body.velocity.y = -gameProperties.playerSpeed;
        $("#" + players[i].upCommand).addClass("hover");
        this.moveUpAndDown(playersGroup.children[i]);
      }
      //TODO: genericize this
      else if(players[i].actionListeners[0].isDown){
        playersGroup.children[i].animations.play(actions[0].animationName);
        $("#" + actions[0].command[i]).addClass("hover");
      } else if(players[i].actionListeners[1].isDown){
        playersGroup.children[i].animations.play(actions[1].animationName);
        $("#" + actions[1].command[i]).addClass("hover");
      } else if(players[i].actionListeners[2].isDown){
        playersGroup.children[i].animations.play(actions[2].animationName);
        $("#" + actions[2].command[i]).addClass("hover");
      } else if(players[i].actionListeners[3].isDown){
        playersGroup.children[i].animations.play(actions[3].animationName);
        $("#" + actions[3].command[i]).addClass("hover");
      } else if(players[i].actionListeners[4].isDown){
        playersGroup.children[i].animations.play(actions[4].animationName);
        $("#" + actions[4].command[i]).addClass("hover");
      } else if(players[i].actionListeners[5].isDown){
        playersGroup.children[i].animations.play(actions[5].animationName);
        $("#" + actions[5].command[i]).addClass("hover");
      }
      else {
        this.removeHover(players[i].spriteName);
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
        player.animations.add('left', [0, 1], 5, true);
        player.animations.add('right', [3, 4], 5, true);

        playersGroup.add(player);

        this.populateValidKeysArray(i);
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

  initGraphics: function() {
    totalItemsGenerated = 0;
    var text;
    var color;
    var enabledActions = levels[gameProperties.currentLevel].enabledActions;
    if(enabledActions.length === 0){
      text = "";
      color = "";
    }

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
      text = " NEW ACTION: " + actions[index].action + "!";
      color = actions[index].color;
    }
    updateActionText(text, color);
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
      console.log("current level is: " + gameProperties.currentLevel);
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
      this.startLevelTimer();

      //bring players to the top
      //TODO: FIX THIS BECAUSE ITEMS ARE BEING BURIED..
      var enabledActions = levels[gameProperties.currentLevel].enabledActions;
      for(var i = 0; i < enabledActions.length; i++){
        var actionIndex = enabledActions[i];
        game.world.bringToTop(actions[actionIndex].group);
      }
      game.world.bringToTop(playersGroup);
    }
  },

  render: function() {
    // game.debug.text("Time until event: " + game.time.events.duration + "\nItems In Play: " + itemsInPlay
    // + "\nItems Generated: " + totalItemsGenerated, 32, 32);
  },

};
