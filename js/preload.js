//loading the game assets
var preload = function(game){}

preload.prototype = {

  preload: function() {
    // itemsInPlay = 0;
    totalItemsGenerated = 0;

    this.loadAssets();
  },


    loadAssets: function() {
      //backgrounds
      for(var i = 0; i < levels.length; i++){
          game.load.image(levels[i].levelName, levels[i].levelURL);
      }
      //title
      game.load.image(gameProperties.titleName, gameProperties.titleURL);

      //gameOver
      game.load.image(gameProperties.gameOverName, gameProperties.gameOverURL);

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
        game.load.spritesheet(
          players[i].winLoseName, players[i].winLoseURL,
          gameProperties.winLoseSpriteWidth,
          gameProperties.winLoseSpriteHeight
        );
      }
    },

  create: function() {
  	this.game.state.start('state1');
  }
};
