var menu = function(game){};
var keyPressCount = 0;

menu.prototype = {
  create: function() {
    //start game text
    game.add.sprite(0,0, gameProperties.titleName);
  },
  update: function() {
    this.game.input.keyboard.onDownCallback = function(e) {
      keyPressCount++;
      if(keyPressCount >= 5){
        this.game.state.start('state3');
      }
    }
  }
};
