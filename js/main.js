var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add('state0', preload);
game.state.add('state1', menu);
game.state.add('state2', mainState);
game.state.add('state3', gameOver);
game.state.start('state0');

$(document).ready( function() {
  console.log("DOM Loaded");

  displayPlayerControllers();
});

function randomizePlayerActions(playerIndex){
  shuffleArray(players[playerIndex].validKeys);
  updatePlayerCommands(playerIndex, players[playerIndex].validKeys);
  updateActionListeners(playerIndex, players[playerIndex].validKeys);
  updatePlayerController(playerIndex);
}

// initialize buttons
function displayPlayerControllers() {
  for(var player = 0; player < players.length; player++){
    $("#" + players[player].spriteName + " .controllerButton").each(function(i) {
      $(this).addClass(actions[i].color);
      $(this).attr('id', actions[i].command[player]);
      // $(this).text(actions[i].command[player]);
    });
    //show scoreImages
    $("#" + players[player].spriteName + " img").attr("src", players[player].scoreImg);
  }
}

function shuffleArray(arr){
  var temp, j;
  for(var i = arr.length-1; i > 0; i--){
    temp = arr[i];
    j = Math.floor(Math.random() * (i+1));
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

function updatePlayerCommands(playerIndex, shuffledKeysArray){
  for(var i = 0; i < actions.length; i++){
    actions[i].command[playerIndex] = shuffledKeysArray[i];
  }
}

function updatePlayerController(playerIndex){
  var controllerDiv = $("#" + players[playerIndex].spriteName);

  for(var action = 0; action < actions.length; action++){
    var button = $("#" + actions[action].command[playerIndex]);
    button.removeClass();
    button.addClass(actions[action].color + " controllerButton");
  }
}

function updateActionListeners(playerIndex){
  players[playerIndex].actionListeners = [];
  for(var i = 0; i < actions.length; i++){
    players[playerIndex].actionListeners.push(game.input.keyboard.addKey(actions[i].command[playerIndex]));
  }
}

function updateActionText(text, color){
  $("#actionText span").text(text);
  $("#actionTextButton").removeClass();
  $("#actionTextButton").addClass(color + " controllerButton");
}

function updatePoints(playerIndex, score){
  $("#" + players[playerIndex].spriteName + " .score").text(score);
}
