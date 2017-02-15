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
    var controllerDiv = $("#" + players[player].spriteName);
    for(var action = 0; action < actions.length; action++){
        var newButton = $('<button/>',
        {
          "class": actions[action].color + " controllerButton",
          "id": actions[action].command[player],
          text: actions[action].command[player],
        });
        controllerDiv.append(newButton);
    }
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
