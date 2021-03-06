var gameProperties = {
  soundOff: false,
  screenWidth: 800,
  screenHeight: 600,
  playerSpriteHeight: 200,
  playerSpriteWidth: 126,
  playerMovements: {
    left: {
      animationName: 'left',
      animationFrames: [0, 1],
    },
    right: {
      animationName: 'right',
      animationFrames: [3, 4],
    },
    standStill: {
      animationFrames: 2,
    },
  },
  winLoseSpriteHeight:180,
  winLoseSpriteWidth: 230,
  playerSpeed: 300,
  playerStartWidth: 32,
  itemMinHeight: 100,
  itemMaxHeight: 400,
  itemMaxWidth: 600,
  itemMinWidth: 100,
  actionTimer: 500,
  actionTimeAddition: 4000,
  levelbaseTime: 3000,
  oldLevel: 0,
  currentLevel: 0,
  itemsToGenerate: 2,
  titleName: 'title',
  titleURL: 'assets/backgrounds/title.png',
  gameOverName: 'gameOver',
  gameOverURL: 'assets/backgrounds/gameOver.png',
  actionPointsMax: 800,
  actionPointsMin: 100,
  actionPointsCurrent: 800,
  actionPointsDecreaseRate: {
    points: 100,
    time: 2000
  },
  debug: false,
};

var players = [
  {
    spriteName: 'player0',
    spriteURL: 'assets/playerSprites/player3_evenMoreActions2.png',
    scoreImg: 'assets/playerSprites/player2.png',
    directionalCommands: {
      up: Phaser.Keyboard.W,
      down: Phaser.Keyboard.S,
      left: Phaser.Keyboard.A,
      right: Phaser.Keyboard.D,
    },
    commandListeners: {},
    actionListeners: [],
    lastDirection:'',
    score: 0,
    validKeys: [],
    winLoseName: 'winLosePlayer0',
    winLoseURL: 'assets/playerSprites/winLoseP0_1.png',
    winFrame: [0,1],
    loseFrame: [2,3],
  },
  {
    spriteName: 'player1',
    spriteURL: 'assets/playerSprites/player1_evenMoreActions6.png',
    scoreImg: 'assets/playerSprites/player1.png',
    directionalCommands: {
      up: Phaser.Keyboard.I,
      down: Phaser.Keyboard.K,
      left: Phaser.Keyboard.J,
      right: Phaser.Keyboard.L,
    },
    commandListeners: {},
    actionListeners: [],
    lastDirection: '',
    score: 0,
    validKeys: [],
    winLoseName: 'winLosePlayer1',
    winLoseURL: 'assets/playerSprites/winLoseP1_2.png',
    winFrame: [0,1],
    loseFrame: [2,3],
  },

];

var fontAssets = {
  pointsFontStyle: [
    {font: '30px "Fredoka One"', fill: '#33cc33', backgroundcolor: 'rgba(0,0,0, 0.5)'},
    {font: '30px "Fredoka One"', fill: '#FF8C00', backgroundcolor: 'rgba(0,0,0, 0.5)'},
  ],
};

var playersGroup, textGroup;
var allItems;
var cursors;
var actionListeners;
var itemsInPlay = [];
var totalItemsGenerated;

var levels = [
  {
    levelName: '0',
    levelURL: 'assets/backgrounds/br_day.png',
    enabledActions: [],
  },
  {
    levelName: '1',
    levelURL: 'assets/backgrounds/bathroom1.png',
    enabledActions: [0], //teeth
  },
  {
    levelName: '2',
    levelURL: 'assets/backgrounds/bathroom1.png',
    enabledActions: [1], //shower
  },
  {
    levelName: '3',
    levelURL: 'assets/backgrounds/road.png',
    enabledActions: [2], //fart
  },
  {
    levelName: '4',
    levelURL: 'assets/backgrounds/road.png',
    enabledActions: [3], //brandish
  },
  {
    levelName: '5',
    levelURL: 'assets/backgrounds/school.png',
    enabledActions: [2,3], //bat
  },
  {
    levelName: '6',
    levelURL: 'assets/backgrounds/classroom1.png',
    enabledActions: [4], //answer
  },
  {
    levelName: '7',
    levelURL: 'assets/backgrounds/hallway1.png',
    enabledActions: [5], //rockout
  },
  {
    levelName: '8',
    levelURL: 'assets/backgrounds/classroom1.png',
    enabledActions: [4], //answer
  },
  {
    levelName: '9',
    levelURL: 'assets/backgrounds/school.png',
    enabledActions: [5,3], //bat
  },
  {
    levelName: '10',
    levelURL: 'assets/backgrounds/road.png',
    enabledActions: [0,3,5], //all + punch
  },
  {
    levelName: '11',
    levelURL: 'assets/backgrounds/bathroom1.png',
    enabledActions: [0,1,2], //all
  },
  {
    levelName: '12',
    levelURL: 'assets/backgrounds/br_night.png',
    enabledActions: [], //sleep
  },
];

var actions = [
  {
    action: "BRUSH TEETH",
    command: [Phaser.Keyboard.ONE, Phaser.Keyboard.SEVEN],
    imageName: 'sink',
    imageURL: 'assets/items/sink2.png',
    animationName: 'brushTeeth',
    animationFrames: [5,6],
    points: 800,
    color: 'blue',
    audioURL: 'assets/audio/brush.m4a',
  },
  {
    action: "GET NAKED",
    command: [Phaser.Keyboard.TWO, Phaser.Keyboard.EIGHT],
    imageName: 'shower',
    imageURL: 'assets/items/shower3.png',
    animationName: 'shower',
    animationFrames: [7,8],
    points: 800,
    color: 'green',
    audioURL: 'assets/audio/shampoo.m4a',
  },
  {
    action: "FART",
    command: [Phaser.Keyboard.THREE, Phaser.Keyboard.NINE],
    imageName: 'skunk',
    imageURL: 'assets/items/skunk.png',
    animationName: 'fart',
    animationFrames: [9,10,11],
    points: 800,
    color: 'purple',
    audioURL: 'assets/audio/fart.m4a',
  },
  {
    action: "BRANDISH",
    command: [Phaser.Keyboard.FOUR, Phaser.Keyboard.ZERO],
    imageName: 'rock',
    imageURL: 'assets/items/sword.png',
    animationName: 'brandish',
    animationFrames: [12,13],
    points: 800,
    color: 'orange',
    audioURL: 'assets/audio/brandish.m4a',
  },
  {
    action: "ANSWER",
    command: [Phaser.Keyboard.Q, Phaser.Keyboard.U],
    imageName: 'chalkboard',
    imageURL: 'assets/items/chalkboard1.png',
    animationName: 'answer',
    animationFrames: [14,15,16],
    points: 800,
    color: 'lavender',
    audioURL: 'assets/audio/answer.m4a',
  },
  {
    action: "ROCK OUT",
    command: [Phaser.Keyboard.E, Phaser.Keyboard.O],
    imageName: 'microphone',
    imageURL: 'assets/items/microphone.png',
    animationName: 'rockOut',
    animationFrames: [18,19],
    points: 800,
    color: 'red',
    audioURL: 'assets/audio/rockOut.m4a',
  },
];
