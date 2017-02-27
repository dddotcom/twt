var menu = function(game){};
var keyPressCount = 0;

menu.prototype = {
  create: function() {
    //start game text
    game.add.sprite(0,0, gameProperties.titleName);
    this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    if(this.isMobile()){
      $( document ).click(function() {
        $( "#mobileMessage" ).effect( "bounce", {}, 1000 );
      });
    }
  },

  update: function() {
    //only start game if it is on desktop
    this.showMobileMessage();

    if(this.enterKey.isDown) {
      if(!this.isMobile()){
        this.game.state.start('state2');
      }
    }

  },

  showMobileMessage: function() {
    if(this.isMobile()){
      $("#mobileMessage").show();
    } else {
      $("#mobileMessage").hide();
    }
  },

  isMobile: function() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        return true;
    }
    return false;
  }
};
