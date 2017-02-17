var gameOver = function(game){};

gameOver.prototype = {
    	create: function(){
        this.updateBackground();
        
        var winnerIndex = 0;
        for(var i = 1; i < players.length; i++){
          if(players[i].score > players[winnerIndex].score){
            winnerIndex = i;
          }
        }

        console.log(winnerIndex);

        for(var i = 0; i < players.length; i++){
          var player = game.add.sprite(
            200,
            i*200+100,
            players[i].winLoseName);

          if(winnerIndex === i){
            player.frame = players[i].winFrame;
          } else {
            player.frame = players[i].loseFrame;
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
