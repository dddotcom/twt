$(document).ready( function() {
  console.log("DOM Loaded");

  displayPlayerControllers();
})

// initialize buttons
function displayPlayerControllers() {
  for(var player = 0; player < players.length; player++){
    var controllerDiv = $("#" + players[player].spriteName);
    for(var action = 0; action < actions.length; action++){
        var newButton = $('<button/>',
        {
          "class": actions[action].color + " controllerButton",
          "id": actions[action].commandKey[player],
          text: actions[action].commandKey[player],
        });
        controllerDiv.append(newButton);
    }
  }
}


$(document).keypress(function(e) {
    if(e.which == 13) {
      $("#" + actions[0].commandKey[0]).click();
    }
});
