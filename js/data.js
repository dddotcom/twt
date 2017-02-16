var gameProperties = {
  screenWidth: 800,
  screenHeight: 600,
  playerSpriteHeight: 200,
  playerSpriteWidth: 126,
  playerSpeed: 300,
  playerStartWidth: 32,
  itemMinHeight: 191,
  itemMaxHeight:200,
  itemMaxWidth: 800,
  actionTimer: 500,
  levelbaseTime: 7000,
  oldLevel: 0,
  currentLevel: 0,
  itemsToGenerate: 1,
  titleName: 'title',
  titleURL: 'assets/backgrounds/title.png',
};

var players = [
  {
    spriteName: 'player0',
    spriteURL: 'assets/playerSprites/player3_evenMoreActions1.png',
    scoreImg: 'assets/playerSprites/player2.png',
    upCommand: Phaser.Keyboard.W,
    downCommand: Phaser.Keyboard.S,
    leftCommand: Phaser.Keyboard.A,
    rightCommand: Phaser.Keyboard.D,
    commandListeners: [],
    actionListeners: [],
    lastDirection:'',
    score: 0,
    validKeys: [],
  },
  {
    spriteName: 'player1',
    spriteURL: 'assets/playerSprites/player1_evenMoreActions6.png',
    scoreImg: 'assets/playerSprites/player1.png',
    upCommand: Phaser.Keyboard.I,
    downCommand: Phaser.Keyboard.K,
    leftCommand: Phaser.Keyboard.J,
    rightCommand: Phaser.Keyboard.L,
    commandListeners: [],
    actionListeners: [],
    lastDirection: '',
    score: 0,
    validKeys: [],
  },

];

var fontAssets = {
  pointsFontStyle: [
    {font: '30px "Fredoka One"', fill: '#33cc33', backgroundcolor: 'rgba(0,0,0, 0.5)'},
    {font: '30px "Fredoka One"', fill: '#FF8C00', backgroundcolor: 'rgba(0,0,0, 0.5)'},
  ],
};

var playersGroup, textGroup;
var sinks, showers, skunks, rocks, chalkboards, microphones;
var cursors;
var actionListeners;
var itemsInPlay, totalItemsGenerated;

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
    enabledActions: [3], //brandish
  },
  {
    levelName: '4',
    levelURL: 'assets/backgrounds/road.png',
    enabledActions: [2], //fart
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
    enabledActions: [0,1,4,2], //all
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
    group: sinks,
    animationName: 'brushTeeth',
    animationFrames: [5,6],
    points: 800,
    color: 'blue',
  },
  {
    action: "GET NAKED",
    command: [Phaser.Keyboard.TWO, Phaser.Keyboard.EIGHT],
    imageName: 'shower',
    imageURL: 'assets/items/shower3.png',
    group: showers,
    animationName: 'shower',
    animationFrames: [7,8],
    points: 400,
    color: 'green',
  },
  {
    action: "FART",
    command: [Phaser.Keyboard.THREE, Phaser.Keyboard.NINE],
    imageName: 'skunk',
    imageURL: 'assets/items/skunk.png',
    group: skunks,
    animationName: 'fart',
    animationFrames: [9,10,11],
    points: 800,
    color: 'purple'
  },
  {
    action: "BRANDISH",
    command: [Phaser.Keyboard.FOUR, Phaser.Keyboard.ZERO],
    imageName: 'rock',
    imageURL: 'assets/items/sword.png',
    group: rocks,
    animationName: 'brandish',
    animationFrames: [12,13],
    points: 800,
    color: 'orange',
  },
  {
    action: "ANSWER",
    command: [Phaser.Keyboard.Q, Phaser.Keyboard.U],
    imageName: 'chalkboard',
    imageURL: 'assets/items/chalkboard.png',
    group: chalkboards,
    animationName: 'answer',
    animationFrames: [14,15,16],
    points: 800,
    color: 'lavender',
  },
  {
    action: "ROCK OUT",
    command: [Phaser.Keyboard.E, Phaser.Keyboard.O],
    imageName: 'microphone',
    imageURL: 'assets/items/microphone.png',
    group: microphones,
    animationName: 'rockOut',
    animationFrames: [18,19],
    points: 800,
    color: 'red',
  },
];