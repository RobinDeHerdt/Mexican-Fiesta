var game = new Phaser.Game(1920, 1080, Phaser.AUTO);

var arrow;
var mexican;
var mexicanFired 	= false;
var ground;

var obstacles;
var rednecks;
var obamas;

var stars;
var numberOfStars;
var powerStar = 0;
var powerStarText;

var lives = 3;
var livesText;
var hearts;
var numberOfHearts = 2;

var percentageDone = 0;
var percentageDoneText;


var wall;
var wallPosX;

var accX;


var sprite;
var spriteTrump;

// Score
var score			= 0;
var scoreText;
var ouch;
var music;
var hit;

var mexVeloX 		= 0;
var mexVeloY 		= 0;

var powerbar;
var power 			= 0;
var powerUP 		= true;
var lockedPower 	= 0;
var isPowerLocked 	= false;

var worldBounds;

var musicIsPlaying = false;
var currentMusic;
var isPlayed = false;

var powerUpGetSound;
var powerUpUseSound;

var livesSprite;
var powerSprite;

var Preload = {

	preload: function() {
		this.scale.scaleMode 		= Phaser.ScaleManager.EXACT_FIT;

		// Preload all the spriteSheets
		game.load.spritesheet('flag', 'img/flagSpritesheet.png',200, 150, 9);
		game.load.spritesheet('fireWorksprite', 'img/fireWorkSpritsheet.png',179, 179, 13);
		game.load.spritesheet('trumpSheet', 'img/trumpSheet.png',200, 150, 29);

		// Preload all the images
		this.load.image('boxmenu', 'img/backgroundBoxMenu.png');
		this.load.image('logo', 'img/logo.png');
		this.load.image('obama', 'img/obama.png');
		this.load.image('redneck', 'img/redneck.png');
		this.load.image('crate', 'img/crate.png');
		this.load.image('powerbar', 'img/balk.jpg');
		this.load.image('arrow', 'img/arrow.png');
		this.load.image('mexican', 'img/mexican.png');
		this.load.image('bgFloor', 'img/ground-bottom.png');
		this.load.image('bg', 'img/background.png');
		this.load.image('obstacle', 'img/trump.png');
		this.load.image('star', 'img/star.png');
		this.load.audio('ouch', 'audio/ouch.mp3');
		this.load.audio('powerUpUse', 'audio/powerUpUse.mp3');
		this.load.audio('powerUpGet', 'audio/powerUpGet.mp3');
		this.load.audio('hit', 'audio/hit.mp3');
		this.load.image('heart', 'img/heart.png');
		this.load.image('pole', 'img/pole.png');
		this.load.image('wall', 'img/brickwall.png');
		this.load.image("back", "img/btn-back.png");



		this.load.audio('backgroundMusic1', 'audio/music/background1.mp3');
		this.load.audio('backgroundMusic2', 'audio/music/background2.mp3');
		this.load.audio('backgroundMusic3', 'audio/music/background3.mp3');
		this.load.audio('backgroundMusic4', 'audio/music/background4.mp3');
	},
	create: function() 
	{
		game.state.start('MainMenu');
	}
};

var GameState = {

	preload: function() {

		this.resetVariables();

		// Exactly fit the game window to the device
		this.scale.scaleMode 				= Phaser.ScaleManager.EXACT_FIT;
		this.scale.pageAlignHorizontally 	= true;
		this.scale.pageAlignVertically 		= true;

	},

	create: function() {

		numberOfStars = currentLevel*5;

		// Game world settings
		game.world.setBounds(0, -4950, worldBounds, 6030);
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.stage.backgroundColor	= "#59b7ff";

		wallPosX = game.world.width - 500;


		// Make the background and the ground
		var bg         				= game.add.tileSprite(0, 13, game.world.width, 1020, "bg");
		ground      				= game.add.tileSprite(0, 1083, game.world.width, 50, "bgFloor");
		ground.anchor.setTo(0, 1);

		wall = game.add.sprite(wallPosX, 850, 'wall');
		wall.anchor.setTo(0.5);
		game.physics.arcade.enable(wall);
		wall.body.enable = true;
		wall.body.allowGravity 	= false;
		wall.body.immovable = true;

		game.physics.arcade.enable(ground);
		ground.body.allowGravity 	= false;
		ground.body.immovable 		= true;

		// Make the power up and give it settings
		stars = game.add.group();
		stars.enableBody = true;
		stars.physicsBodyType = Phaser.Physics.ARCADE;
		this.createStar();

		// Make heart and give it settings
		hearts = game.add.group();
		hearts.enableBody = true;
		hearts.physicsBodyType = Phaser.Physics.ARCADE;
		this.createHeart();

		// Make the obstacles and give it settings
		obstacles 					= game.add.group();
		obstacles.enableBody 		= true;
		obstacles.physicsBodyType 	= Phaser.Physics.ARCADE;

		rednecks 					= game.add.group();
		rednecks.enableBody 		= true;
		rednecks.physicsBodyType 	= Phaser.Physics.ARCADE;

		obamas 						= game.add.group();
		obamas.enableBody 			= true;
		obamas.physicsBodyType 		= Phaser.Physics.ARCADE;




		this.createObstacle('obstacle', obstacles, worldBounds / 5000 , 10, 100, 0.13);
		this.createObstacle('redneck', rednecks, worldBounds / 1000, 10, 100, 0.3);
		this.createObstacle('obama', obamas, worldBounds / 2000, 10, 100, 0.3);



        // Make the arrow and give it settings
        arrow 						= this.game.add.sprite(800, 800, 'arrow');
        arrow.anchor.setTo(0, 0.5);

        // Make the mexican and give it settings
        mexican 					= this.game.add.sprite(575, 830, 'mexican');
        mexican.scale.setTo(0.1,0.1);
        mexican.anchor.setTo(0.5);
        mexican.enableBody 			= true;

        // Podium
        for (var i = 0; i < 4; i++) {
        	crate 						= this.game.add.sprite(i*150, game.height - 45, 'crate');
        	crate.anchor.setTo(0, 1);
        	crate.enableBody 			= true;
        }

        // flag animation 
        sprite = game.add.sprite(400, 360, 'flag');
        sprite.animations.add('wapperen');
        sprite.animations.play('wapperen', 20, true);
        pole = game.add.sprite(380, 330, 'pole');
        pole.scale.setTo(0.27);

    							// sprite, frame rate, tijd

    	// firework animation 
    	spriteFirework = game.add.sprite(50, 500, 'fireWorksprite');
    	spriteFirework.scale.setTo(3);
    	spriteFirework.animations.add('firework');
    	spriteFirework.animations.play('firework', 10, true);
    							// sprite, frame rate, tijd

    	// Trump animation
    	spriteTrump = game.add.sprite(-200, 500, 'trumpSheet');
    	spriteTrump.scale.setTo(4);
    	spriteTrump.animations.add('trump');

		// Camera settings		
		game.camera.follow(mexican, Phaser.Camera.FOLLOW_PLATFORMER);

		// Score settings
		scoreText 					= game.add.text(game.width / 2, 150, + "m traveled", { fontSize: '72px', fill: 'white' });
		scoreText.anchor.set(0.5);
		scoreText.fixedToCamera 	= true;


		percentageDoneText = game.add.text(1450, 100, percentageDone + '% done ', { fontSize: '72px', fill: 'white' });
		percentageDoneText.fixedToCamera 	= true;

		

		// Powerbar settings
		powerbar 					= this.game.add.sprite(100, 400, 'powerbar');
		powerbar.anchor.setTo(0.5);

		buttonBack = game.add.button(1700, 100, 'back', this.back, this);
		buttonBack.scale.setTo(0.5);
		buttonBack.fixedToCamera 	= true;

		livesText = game.add.text(250, 180, ': ' + lives, { fontSize: '72px', fill: 'white' });
		livesText.anchor.setTo(0.5);
		livesText.fixedToCamera 	= true;

		powerStarText = game.add.text(250, 80, ': ' + powerStar, { fontSize: '72px', fill: 'white' });
		powerStarText.anchor.setTo(0.5);
		powerStarText.anchor.set(0.5);
		powerStarText.fixedToCamera 	= true;

		powerSprite = game.add.sprite(170 , 80, 'star');
		powerSprite.anchor.setTo(0.5);
		powerSprite.scale.setTo(2,2);
		powerSprite.fixedToCamera 	= true;

		livesSprite = game.add.sprite(170 , 180, 'heart');
		livesSprite.scale.setTo(0.07,0.07);
		livesSprite.anchor.setTo(0.5);
		livesSprite.fixedToCamera 	= true;
	},

	update: function() {
		// Score settings
		score 						= Math.round(mexican.x /100 - 1);
		scoreText.setText(score - 5 + "m traveled");

    // Wallcollider
    game.physics.arcade.collide(mexican, wall);

		//powerStar = powerStar;
		powerStarText.setText(': ' + powerStar);

		livesText.setText(': ' + lives);



		
		
/*
		for (var i = 0; i < lives; i++) {

		livesSprite = game.add.sprite(150 + (i * 60), 200, 'heart');
		livesSprite.scale.setTo(0.07,0.07);
		livesSprite.fixedToCamera 	= true;
		
		
	}*/

		//livesText.setText('Lives: ' + lives);

		percentageDone = Math.round(((mexican.x / (wallPosX - 80)) * 100));

		if (percentageDone <= 100) {
			if (mexicanFired) {
				percentageDoneText.setText(percentageDone + '%');
			}
			else
			{
				percentageDoneText.setText('0%');
			}
			
		}
		
		

		// Hit ground and play sound 'ouch'
		var hitGround				= this.game.physics.arcade.collide(mexican, ground);

		if(hitGround){
			if (mexVeloY >= 20) 
			{
				ouch = game.add.audio('ouch');
				ouch.play();
			}
			mexican.body.velocity.x /= 1.2;
			mexican.body.velocity.y /= 1.2;

		}
		

		// Obstacle method call
		this.game.physics.arcade.overlap(mexican, stars, this.collectStar, null, this);
		this.game.physics.arcade.overlap(mexican, obstacles, this.onTrumpOverlap, null, this);
		this.game.physics.arcade.overlap(mexican, rednecks, this.onRedneckOverlap, null, this);
		this.game.physics.arcade.overlap(mexican, obamas, this.onObamaOverlap, null, this);
		this.game.physics.arcade.overlap(mexican, hearts, this.collectHeart, null, this);

		// Arrow angle
		accX = accelerationX *-9;

		if (accX <= -90) {
			accX = -90;
		}
		else if (accX >= 0) {
			accX = 0;
		}

		if (!isPowerLocked) {
			arrow.angle = accX.toFixed(3);
		}

		// If you tap and the mexican isn't fired yet, fire the mexican
		if (game.input.activePointer.isDown && !mexicanFired)
		{
			if(!isPowerLocked)
			{
				lockedPower = power;
				isPowerLocked = true;
			}

			spriteTrump.animations.play('trump', 20, false);

			game.time.events.add(Phaser.Timer.SECOND * 0.9, function()
			{
				if(!isPlayed)
				{
					hit = game.add.audio('hit');
					hit.play();
					isPlayed = true;
				}

				mexicanFired = true;

				game.physics.enable(mexican, Phaser.Physics.ARCADE);

				mexican.body.velocity.x = (accX+90) * lockedPower / 2;
				mexican.body.velocity.y = (accX) * lockedPower / 2;

				mexican.body.collideWorldBounds = true;
				mexican.body.bounce.y = 0.8;

				game.physics.arcade.gravity.y = 1500;
				game.physics.arcade.gravity.x = -100;
			});
		}

		// If the mexican is fired give it a rotation and set powerbar to 0
		if (mexicanFired) {
			mexVeloX = mexican.body.velocity.x;
			mexVeloY = mexican.body.velocity.y;
			powerbar.scale.setTo(0);

			// If the velocity is 0, place x-velocity and x-gravity to 0
			if (mexVeloX <= 0) {
				mexican.body.velocity.x = 0;
				game.physics.arcade.gravity.x = 0;

				if(mexVeloY <= 0)
				{
					if (mexican.x >= wallPosX) {
						game.state.start('Victory');
					}
					else 
					{
						if (lives === 0) {

							//currentLevel = 1;
							game.state.start('GameOver');

						}
						else{

							lives--;

							game.state.start('LostLife');

						}	
					}
				}	
			}
			else {
				mexican.rotation+= 0.05;
			}
		} else { // Animate the powerbar

			if (!isPowerLocked) {
				if (powerUP) {
					power += 2.5;
					if (power >= 100) {
						powerUP = false;
					}
				}
				else {
					power -=2.5;
					if (power <= 0) {
						powerUP = true;
					}
				}
			}
			
			
			powerbar.scale.setTo(1, power/100);
		}

		game.input.onTap.add(this.powerUpAcceleration, this);


		
	},

	back: function(){
		lives--;
		game.state.start("MainMenu");

	},


	onTrumpOverlap: function(mexican, obstacle) {
		// If the mexican hits an obstacle give it extra x and y velocity and kill the obstacle
		obstacle.kill();
		obstacle.body.immovable 		= true;
		this.obstacleHitAcceleration(1.8, 1.8, 3000, 3000);
		

	},

	onRedneckOverlap: function(mexican, redneck) {
		// If the mexican hits a redneck give it extra x and y velocity and kill the redneck
		redneck.kill();
		redneck.body.immovable 		= true;	
		this.obstacleHitAcceleration(1.15, 1.1, 2000, 2000);	

	},
	onObamaOverlap: function(mexican, obama) {
		// If the mexican hits a obama takes extra x and y velocity and kill the obama
		obama.kill();
		obama.body.immovable 		= true;	
		this.obstacleHitBrake(2,  2);	

	},


	obstacleHitAcceleration: function(multiplierX, multiplierY, solidX, solidY) {

		music 						= game.add.audio('hit');
		music.play();

		if (mexVeloY < 2000) {
			mexican.body.velocity.y = -solidY;
		}
		else {
			if (mexVeloY <= 0) {
				mexican.body.velocity.y = -mexican.body.velocity.y;
			}
			mexican.body.velocity.y *= -multiplierY;
		}

		if (mexVeloX < 2000) {
			mexican.body.velocity.x = solidX;
		}
		else {
			mexican.body.velocity.x *= multiplierX;
		}

	},

	obstacleHitBrake: function(reduceX, reduceY) {
		mexican.body.velocity.y /= reduceY;
		mexican.body.velocity.x /= reduceX;

	},

	createObstacle: function(obstacleToCreate, obstacleGroupName,  numberOfObstacles, speedMin, speedMax, scale) {

		for (var i  = 0; i < numberOfObstacles; i++)
		{

			var obstacle 					= obstacleGroupName.create(800 + (Math.random() * game.world.width), 900, obstacleToCreate);
			obstacle.body.allowGravity 		= false;
			obstacle.immovable 				= true;
			obstacle.body.velocity.x 		= game.rnd.between(speedMin, speedMax);
			obstacle.scale.setTo(scale);

		}

	},

	collectStar: function(mexican, star){
		powerUpGetSound = game.add.audio('powerUpGet');
		powerUpGetSound.play();

		star.kill();
		powerStar += 1;

	},

	createStar: function(){

		for(var i = 0; i < numberOfStars; i++){
			var star = stars.create(800 + (Math.random() * game.world.width), 900, 'star');
			star.body.allowGravity 		= false;
			star.immovable 				= true;
			star.body.velocity.x 		= game.rnd.between(10, 100);
			star.scale.setTo(2,2);
		}

	},
	createHeart: function(){
		for(var i = 0; i < numberOfHearts; i++){
			var heart = hearts.create(800 + (Math.random() * game.world.width), 900, 'heart');
			heart.body.allowGravity 		= false;
			heart.immovable 				= true;
			heart.body.velocity.x 		= game.rnd.between(10, 100);
			heart.scale.setTo(0.07,0.07);
		}
	},

	collectHeart: function(mexican, heart){
		powerUpGetSound = game.add.audio('powerUpGet');
		powerUpGetSound.play();

		heart.kill();
		lives += 1;

	},

	powerUpAcceleration: function() {
		if (powerStar > 0) {
			powerUpUseSound = game.add.audio('powerUpUse');
			powerUpUseSound.play();
			powerStar -= 1;
			mexican.body.velocity.x += 1500;
			mexican.body.velocity.y += -2000;
			
		}
	},

	resetVariables: function() {
		mexicanFired 	= false;
		powerStar 		= 0;
		score			= 0;
		mexVeloX 		= 0;
		mexVeloY 		= 0;
		power 			= 0;
		powerUP 		= true;
		lockedPower		= 0;
		isPowerLocked	= false;
		isPlayed		= false;
	}
};


var currentLevel 					= 1;

var Menu = {
	preload: function() {
		this.scale.scaleMode 		= Phaser.ScaleManager.EXACT_FIT;
	},
	create: function() 
	{
		game.world.setBounds(0, 0, 1920,1080);
		var bg         				= game.add.tileSprite(0, 13, game.world.width, 1020, "bg");
		ground      				= game.add.tileSprite(0, 1083, game.world.width, 50, "bgFloor");
		ground.anchor.setTo(0, 1);

		worldBounds = (15000 * Math.pow(currentLevel, 2) / 2);

		var title = game.add.sprite(game.width / 2, game.height / 2, 'boxmenu');
		title.anchor.setTo(0.5);

		var levelText 				= game.add.text(game.width / 2, game.height / 2 - 200, "Level " + currentLevel, { font: "168px Arial", fill: "white", align: "center" });
		var tertiaryText 			= game.add.text(game.width / 2, (game.height / 2), "Distance: " + worldBounds / 100 + "m", { font: "96px Arial", fill: "white", align: "center"});
		var secondaryText 			= game.add.text(game.width / 2, (game.height / 2) + 175, "Tap to start game!", { font: "96px Arial", fill: "white", align: "center"});

		levelText.anchor.set(0.5);
		tertiaryText.anchor.set(0.5);
		secondaryText.anchor.set(0.5);

		secondaryText.inputEnabled = true;
		game.input.onDown.add(this.mouseClick);
	},
	mouseClick: function() 
	{
		game.state.start('GameState');
	},
	update: function() 
	{

	}
};

var GameOver = {
	preload: function() {
		this.scale.scaleMode 		= Phaser.ScaleManager.EXACT_FIT;
		worldBounds 				= 5000;
		lives 						= 3;
	},

	create: function() 
	{
		game.world.setBounds(0, 0, 1920,1080);
		var bg         				= game.add.tileSprite(0, 13, game.world.width, 1020, "bg");
		ground      				= game.add.tileSprite(0, 1083, game.world.width, 50, "bgFloor");
		ground.anchor.setTo(0, 1);

		var levelText 				= game.add.text(game.width / 2, game.height / 2, "Made it to level: " + currentLevel, { font: "140px Arial", fill: "white", align: "center" });
		var gameOverText 			= game.add.text(game.width / 2, game.height / 2 - 200, "Game over!", { font: "168px Arial", fill: "white", align: "center" });
		var secondaryText 			= game.add.text(game.width / 2, (game.height / 2) + 200, "Tap to move to Main Menu", { font: "96px Arial", fill: "white", align: "center"});

		gameOverText .anchor.set(0.5);
		secondaryText.anchor.set(0.5);
		levelText.anchor.set(0.5);

		secondaryText.inputEnabled = true;
		game.input.onDown.add(this.mouseClick);
	},
	mouseClick: function() 
	{
		currentLevel = 1;
		game.state.start('MainMenu');
	},
	update: function() 
	{

	}
};

var Victory = {
	preload: function() {
		this.scale.scaleMode 		= Phaser.ScaleManager.EXACT_FIT;
	},
	create: function() 
	{
		game.world.setBounds(0, 0, 1920,1080);
		
		var bg         				= game.add.tileSprite(0, 13, game.world.width, 1020, "bg");
		ground      				= game.add.tileSprite(0, 1083, game.world.width, 50, "bgFloor");
		ground.anchor.setTo(0, 1);
		trump = game.add.sprite(0, 0, "obstacle"),
		


		vicTxt = game.add.text(game.width / 2, game.height / 2, "Deported!", { fontSize: '72px', fill: 'white' });
		vicTxt.anchor.set(0.5);
		vicTxt.fixedToCamera 	= true;

		startTxt = game.add.text(game.width / 2, 700, "Tap to continue", { fontSize: '72px', fill: 'white' });
		startTxt.anchor.set(0.5);
		startTxt.fixedToCamera 	= true;

		game.input.onDown.add(this.resetGame);
	},

	resetGame: function() {
		game.state.start('Menu');
		currentLevel++;
	}
};

var MainMenu = {
	preload: function(){
		this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

		this.load.image("play", "img/btn-play.png");
		this.load.image("settings", "img/btn-settings.png");
		this.load.image("instructions", "img/btn-instructions.png");
		this.load.image("credits", "img/btn-credits.png");

	},
	create: function(){

		if (!musicIsPlaying) {
			musicIsPlaying 	= true;
			backgroundMusic2 			= game.add.audio('backgroundMusic2');
			backgroundMusic2.play();
			backgroundMusic2.loopFull();
			currentMusic 	= backgroundMusic2;
		}


		game.world.setBounds(0, 0, 1920,1080);
		var bg         				= game.add.tileSprite(0, 13, game.world.width, 1020, "bg");
		ground      				= game.add.tileSprite(0, 1083, game.world.width, 50, "bgFloor");
		ground.anchor.setTo(0, 1);

		var title = game.add.sprite(game.width / 2, 400, 'logo');

		worldBounds = (15000 * Math.pow(currentLevel, 2) / 2);

		title.anchor.setTo(0.5,0.5);	

		buttonPlay = game.add.button((game.width * (2/8)), (game.height/2) + 200, 'play', this.playGame, this);
		buttonSettings = game.add.button((game.width * (4/8)), (game.height/2) + 200, 'settings', this.settings, this);
		buttonInstructions = game.add.button((game.width * (6/8)), (game.height/2) + 200, 'instructions', this.instructions, this);
		buttonCredits = game.add.button((game.width * (7/8)), 200, 'credits', this.credits, this);

		buttonPlay.anchor.setTo(0.5,0.5);
		buttonSettings.anchor.setTo(0.5,0.5);
		buttonInstructions.anchor.setTo(0.5,0.5);
		buttonCredits.anchor.setTo(0.5);

		//buttonSettings.scale.setTo(0.2, 0.2);



	},
	update: function(){

	},
	playGame: function(){

		game.state.start("Menu");

	},
	settings: function(){

		game.state.start("SettingsMenu");

	},
	instructions: function(){

		game.state.start("InstructionsMenu");

	},
	credits: function(){

		game.state.start("CreditsMenu");

	}
};

var SettingsMenu = {
	preload: function(){


		this.load.image("music1", "img/btn-music1.png");
		this.load.image("music2", "img/btn-music2.png");
		this.load.image("music3", "img/btn-music3.png");
		this.load.image("music4", "img/btn-music4.png");
		this.load.image("mute", "img/btn-mute.png");


	},
	create: function(){

		game.world.setBounds(0, 0, 1920,1080);
		var bg         				= game.add.tileSprite(0, 13, game.world.width, 1020, "bg");
		ground      				= game.add.tileSprite(0, 1083, game.world.width, 50, "bgFloor");
		ground.anchor.setTo(0, 1);

		var title = game.add.text((game.width / 2), 200, "Settings", { font: "168px Arial", fill: "white", align: "center" });

		title.anchor.setTo(0.5,0.5);

		buttonBack = game.add.button((game.width * (2/10)), (game.height/2)+ 300, 'back', this.back, this);
		buttonMusic1 = game.add.button((game.width * (2/10)), (game.height/2), 'music1', this.playMusic1, this);
		buttonMusic2 = game.add.button((game.width * (4/10)), (game.height/2), 'music2', this.playMusic2, this);
		buttonMusic3 = game.add.button((game.width * (6/10)), (game.height/2), 'music3', this.playMusic3, this);
		buttonMusic4 = game.add.button((game.width * (8/10)), (game.height/2), 'music4', this.playMusic4, this);
		buttonMute = game.add.button((game.width * (8/10)), (game.height/2) + 300, 'mute', this.musteSound, this);

		buttonBack.anchor.setTo(0.5,0.5);
		buttonMusic1.anchor.setTo(0.5,0.5);
		buttonMusic2.anchor.setTo(0.5,0.5);
		buttonMusic3.anchor.setTo(0.5,0.5);
		buttonMusic4.anchor.setTo(0.5,0.5);
		buttonMute.anchor.setTo(0.5,0.5);

		//buttonBack.scale.setTo(0.3,0.3);

	},
	back: function(){

		game.state.start("MainMenu");

	},

	playMusic1: function() {
		currentMusic.destroy();
		backgroundMusic1 			= game.add.audio('backgroundMusic1');
		backgroundMusic1.play();
		backgroundMusic1.loopFull();
		currentMusic 	= backgroundMusic1;
	},

	playMusic2: function() {
		currentMusic.destroy();
		backgroundMusic2 			= game.add.audio('backgroundMusic2');
		backgroundMusic2.play();
		backgroundMusic2.loopFull();
		currentMusic 	= backgroundMusic2;
	},

	playMusic3: function() {
		currentMusic.destroy();
		backgroundMusic3 			= game.add.audio('backgroundMusic3');
		backgroundMusic3.play();
		backgroundMusic3.loopFull();
		currentMusic 	= backgroundMusic3;
	},

	playMusic4: function() {
		currentMusic.destroy();
		backgroundMusic4 			= game.add.audio('backgroundMusic4');
		backgroundMusic4.play();
		backgroundMusic4.loopFull();
		currentMusic 	= backgroundMusic4;
	},

	musteSound: function() {
		currentMusic.destroy();
	}




};

var InstructionsMenu = {
	preload: function(){

		this.load.image("back", "img/btn-back.png");

	},
	create: function(){

		game.world.setBounds(0, 0, 1920,1080);
		var bg         				= game.add.tileSprite(0, 13, game.world.width, 1020, "bg");
		ground      				= game.add.tileSprite(0, 1083, game.world.width, 50, "bgFloor");
		ground.anchor.setTo(0, 1);

		var title = game.add.text((game.width / 2), 200, "Instructions", { font: "168px Arial", fill: "white", align: "center" });

		title.anchor.setTo(0.5,0.5);

		txt1 = game.add.text((game.width / 2), 400, "The goal of the game is to kick the mexican over the border.", { font: "50px Arial", fill: "white", align: "right" });
		txt2 = game.add.text((game.width / 2), 470, "You can aim by tilting your phone, and shoot by tapping.", { font: "50px Arial", fill: "white", align: "right" });
		txt3 = game.add.text((game.width / 2), 540, "You can pick up powerups and extra lives during your journey to the border,", { font: "50px Arial", fill: "white", align: "right" });
		txt4 = game.add.text((game.width / 2), 610, "to use the powerups you have to tap the screen.", { font: "50px Arial", fill: "white", align: "right" });
		
		heartInstr = game.add.sprite(400, 800, 'heart');
		heartInstr.scale.setTo(0.1,0.1);
		game.add.text(500, 800, "= lives", { font: "50px Arial", fill: "black", align: "right" });

		starInstr = game.add.sprite(1000, 800, 'star');
		starInstr.scale.setTo(3,3);
		game.add.text(1100, 800, "= powerup", { font: "50px Arial", fill: "black", align: "right" });

		txt1.anchor.setTo(0.5,0.5);
		txt2.anchor.setTo(0.5,0.5);
		txt3.anchor.setTo(0.5,0.5);
		txt4.anchor.setTo(0.5,0.5);

		buttonBack = game.add.button(200, (game.height/2) + 400, 'back', this.back, this);

		buttonBack.anchor.setTo(0.5,0.5);

	},
	back: function(){

		game.state.start("MainMenu");

	}
};

var CreditsMenu = {
	preload: function(){

		this.load.image("back", "img/btn-back.png");

	},
	create:  function(){

		game.world.setBounds(0, 0, 1920,1080);
		var bg         				= game.add.tileSprite(0, 13, game.world.width, 1020, "bg");
		ground      				= game.add.tileSprite(0, 1083, game.world.width, 50, "bgFloor");
		ground.anchor.setTo(0, 1);

		var madeBy = game.add.text((game.width / 2), 200, "Made By:", { font: "168px Arial", fill: "white", align: "center" });

		var Sam = game.add.text((game.width / 2), 350, "Sam De Wachter", { font: "84px Arial", fill: "white", align: "center" });
		var Dieter = game.add.text((game.width / 2), 450, "Dieter Vercammen", { font: "84px Arial", fill: "white", align: "center" });
		var Kristof = game.add.text((game.width / 2), 550, "Kristof Van Aken", { font: "84px Arial", fill: "white", align: "center" });
		var Stig = game.add.text((game.width / 2), 650, "Stig Vanbrabant", { font: "84px Arial", fill: "white", align: "center" });
		var Robin = game.add.text((game.width / 2), 750, "Robin De Herdt", { font: "84px Arial", fill: "white", align: "center" });

		buttonBack = game.add.button((game.width * (2/10)), (game.height/2)+ 300, 'back', this.back, this);

		madeBy.anchor.setTo(0.5);

		Sam.anchor.setTo(0.5);
		Dieter.anchor.setTo(0.5);
		Kristof.anchor.setTo(0.5);
		Stig.anchor.setTo(0.5);
		Robin.anchor.setTo(0.5);

		buttonBack.anchor.setTo(0.5,0.5);

	},
	back: function(){

		game.state.start("MainMenu");

	}
};

var LostLife = {
	preload: function(){

		this.load.image("back", "img/btn-back.png");

	},
	create: function(){

		game.world.setBounds(0, 0, 1920,1080);
		var bg         				= game.add.tileSprite(0, 13, game.world.width, 1020, "bg");
		ground      				= game.add.tileSprite(0, 1083, game.world.width, 50, "bgFloor");
		ground.anchor.setTo(0, 1);

		var title = game.add.text((game.width / 2), 200, "You lost a life!", { font: "168px Arial", fill: "white", align: "center" });

		title.anchor.setTo(0.5,0.5);

		var instructionsText = game.add.text((game.width / 2), 400, "Tap to continue", { font: "84px Arial", fill: "white", align: "right" });

		instructionsText.anchor.setTo(0.5,0.5);

		game.input.onDown.add(this.mouseClick);

	},
	mouseClick : function()
	{
		game.state.start("GameState");
	}
};

// start the game state
game.state.add('GameState', GameState);
game.state.add('Menu', Menu);
game.state.add('GameOver', GameOver);
game.state.add('Victory', Victory);
game.state.add('Preload', Preload);
game.state.add('MainMenu', MainMenu);
game.state.add("SettingsMenu", SettingsMenu);
game.state.add('InstructionsMenu', InstructionsMenu);
game.state.add('LostLife', LostLife);
game.state.add('CreditsMenu', CreditsMenu);
game.state.start('Preload');