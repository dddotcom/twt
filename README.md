# Tanya Wenya Teens

This game was inspired by [Tenya Wanya Teens](http://tenyawanyateens.com/), a party game co-created by
[Uvula](http://www.uvula.jp/), [Wild Rumpus](http://thewildrumpus.co.uk/), and [Venus Patrol](http://venuspatrol.com/)


Background music from [Katamari Damacy](https://en.wikipedia.org/wiki/Katamari_Damacy)


All images and sound effects made by [dddotcom](https://github.com/dddotcom)

# Created using the following technologies
* HTML
* CSS
* JavaScript
* jQuery
* [Phaser.io](http://phaser.io/)
* and... [Google Drawings](https://drawings.google.com)

# Interesting Problems

### Spawning items *randomly*

Midway through development, I ran into an issue where the items I was randomly spawning were overlapping with each other. This led to some weird edge cases in the game play, where users could go over to one item, complete the correct action, and then trigger a collision with 2 (or more) items if they were overlapping.

In order to solve this problem, I used phaser's overlap detection to detect if an item was overlapping with another after it was randomly spawned on a new level. If an overlap was detected, new X and Y coordinates were randomly generated and the item would move to the new location.

Initially the items were too big, so overlapping was happening at nearly every random X and Y coordinate that I was re-generating. Therefore, I had to decrease the collision box size for each item by half its width and height. This solved the problem and prevented the items from overlapping, for the most part.

In order to make this more effective/efficient I would look into a "smarter" way of generating new X and Y coordinates when an overlap is detected.  

### Controller - How to emulate the gameplay

The original game is played with a 16 button controller custom-made for the game's launch. Initially, you are given one task to do. It is tied to a pink button and all 16 buttons on the controller turn pink. Hitting any one of them executes the correct action and you get points. However, as the game progresses, more actions get added to your controller and you need to keep track of which colors perform which actions. Adding to the chaos, the colors on the buttons also change position throughout the game.

Figuring out how to simulate this crucial part of the gameplay on the web was definitely a challenge. In order to simulate the controller, I added a visual controller on the screen and assigned certain keys to as "action buttons". When users pressed these keys, there would be visual feedback on the controller, showing the button as "pressed down".

I created an Action object to keep track of the mappings. Each action is mapped to two keys, one for player 1 and another for player 2. Actions also have a color attribute which enables the buttons to be colored with the correct CSS. Whenever the players proceed to the next level, the actions are mapped to new keys for each player, key listeners are updated, and the buttons' CSS are re-assigned, thus re-randomizing the buttons on the screen.
