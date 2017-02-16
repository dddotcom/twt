var menu = function(game){};
var keyPressCount = 0;

menu.prototype = {
  create: function() {
    //start game text
    game.add.sprite(0,0, gameProperties.titleName);
    this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  },
  update: function() {
    if(this.enterKey.isDown) {
      this.game.state.start('state2');
    }
  }
};
