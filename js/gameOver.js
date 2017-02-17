var gameOver = function(game){};
var gameOverPlayers = [];
var winnerIndex;

gameOver.prototype = {


    	create: function(){
        this.updateBackground();
        winnerIndex = 0;
        for(var i = 0; i < players.length; i++){
          var player = game.add.sprite(
            200,
            i*200+100,
            players[i].winLoseName);

            player.animations.add('win', players[i].winFrame, 3, true);
            player.animations.add('lose', players[i].loseFrame, 3, true);
            gameOverPlayers.push(player);
  	    }

        this.showWinner();
      },

      showWinner: function() {
        for(var i = 1; i < players.length; i++){
          if(players[i].score > players[winnerIndex].score){
            winnerIndex = i;
          }
        }

        for(var x = 0; x < players.length; x++){
          if(winnerIndex === x){
            gameOverPlayers[x].animations.play('win');
          } else {
            gameOverPlayers[x].animations.play('lose');
          }
        }
      },

      updateBackground: function() {
        game.add.tween(gameProperties.currentBackground).to({x: -gameProperties.screenWidth}, 800, Phaser.Easing.Linear.None, true);

        var newBackground = game.add.sprite(0,0, gameProperties.gameOverName);
        newBackground.alpha = 1;
        game.add.tween(newBackground).from({x: gameProperties.screenWidth}, 800, Phaser.Easing.Linear.None, true);

        gameProperties.currentBackground = newBackground;
      },


}
