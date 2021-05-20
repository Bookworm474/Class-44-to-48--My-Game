const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

//declare variables
var engine, world;
var earth, venus, mars;
var sat1, sat2, sat2_counter = 0;
var earth_orbit, venus_orbit, mars_orbit, venus_counter = 0, mars_counter = 0;
var earth_image, venus_image, mars_image, sat_image, bg_image, sys_cas;

//declare game states
var game_state;
const start = "Start Game", 
	play1 = "0 satellites in orbit", 
	play2a = "1 satellite in  Orbit around Venus",
	play2b = "1 satellite in Orbit around Mars", 
	end = "Game Over";
var start_button, start_image, start_frame;
var restart_button, restart_image, restart_frame = 0, restart_counter = 0;

function preload(){
	//load images
	earth_image = loadImage("images/earth.png");
	venus_image = loadImage("images/venus.png");
	mars_image = loadImage("images/mars.png");
	sat_image = loadImage("images/satellite.png");
	bg_image = loadImage("images/background.jpeg");
	sys_cas = loadImage("images/syscas.png");
	start_image = loadImage("images/start.png");
	restart_image = loadImage("images/restart.png");
}

function setup() {
  	//set canvas
	createCanvas(1000,600);
	
	//create engine and world
	engine = Engine.create();
	world = engine.world;
	//remove gravity
	engine.world.gravity.y = 0;

	//set original game state to start
	game_state = start;

	//create planets
	earth = new Planet(500,300,75,earth_image);
	venus = new Planet(175,225,70,venus_image);
	mars = new Planet(850,450,37.5,mars_image);
	//create satellites
	sat1 = new Satellite(500,375,10);
	//create earth orbit
	earth_orbit = new Orbit(sat1.body,earth.body,75);
	//create start button
	start_button = createSprite(75,550,50,50);
	start_button.addImage(start_image);
	start_button.scale = 0.1875;
	//create restart button
	restart_button = createSprite(825,217.5,50,50);
	restart_button.addImage(restart_image);
	restart_button.scale = 0.3125;
	restart_button.visible = false;
}

function draw() {
	//set background
	background(bg_image); 
	//update engine
	Engine.update(engine);

	text(mouseX+" "+mouseY,25,25);
	
	if (game_state === start){
		//display story, status and missions
		displayStart();

		//if start button is pressed, change game state to play1
		if (mousePressedOver(start_button)){
			game_state = play1;
			start_frame = frameCount;
			//restart_button.depth = start_button.depth + 1;
		}

		// if (restart_frame != 0){
		// 	if (frameCount - restart_frame > 25){

		// 	}
		// }
	}

	if (game_state === play1){
		for (var i = 0; i < 1; i++){
			if (restart_counter != 0){
				venus_orbit.launch();
				mars_orbit.launch();
				earth_orbit.set_orbit(sat1.body);
				sat2_counter = 0;
			}
		}
		
		//display status and missions
		displayPlay1();

		//if satellite approaches venus, settle satellite in orbit
		approach(sat1.body,venus.body);
		//if satellite approaches mars, settle satellite in orbit
		approach(sat1.body,mars.body);

		//mouseDragged();
		//mouseReleased();

		//display earth orbit
		earth_orbit.display();
		//display planets
		earth.display();
		venus.display();
		mars.display();
		//display satellites
		sat1.display();
	}

	if (game_state === play2a){
		//display status and missions
		displayPart2a();


		if (sat2_counter === 0 && restart_counter === 0){
			sat2 = new Satellite(500,375,10);
			sat2_counter = 1;
			earth_orbit.set_orbit(sat2.body);
		}
		for (var i = 0; i < 1; i++){
			if (restart_counter != 0){
				sat2.body.position.x = 500;
				sat2.body.position.y = 375;
				sat2_counter = 1;
				earth_orbit.set_orbit(sat2.body);
			}
		}

		//if satellite approaches mars, settle satellite in orbit
		approach(sat2.body,mars.body);

		//display orbits
		earth_orbit.display();
		venus_orbit.display();
		//display planets
		earth.display();
		venus.display();
		mars.display();
		//display satellites
		sat1.display();
		if (sat2_counter === 1){
			sat2.display();
		}
	}

	if (game_state === play2b){
		//display status and mission
		displayPart2b();
		
		if (sat2_counter === 0){
			sat2 = new Satellite(500,375,10);
			sat2_counter = 1;
			earth_orbit.set_orbit(sat2.body);
		}

		//if satellite approaches venus, settle satellite in orbit
		approach(sat2.body,venus.body);
		
		//display orbits
		earth_orbit.display();
		mars_orbit.display();
		//display planets
		earth.display();
		venus.display();
		mars.display();
		//display satellites
		sat1.display();
		if (sat2_counter === 1){
			sat2.display();
		}
	}

	if (game_state === end){
		//display the restart instruction, status and missions
		displayEnd();

		//show the restart button
		restart_button.visible = true;

		//if restart button is clicked, take game to start page
		if (mousePressedOver(restart_button)){
			game_state = start;
			restart_button.visible = false;
			start_button.visible = true;
			restart_counter+=1;
		}

		//display orbits
		earth_orbit.display();
		venus_orbit.display();
		mars_orbit.display();
		//display planets
		earth.display();
		venus.display();
		mars.display();
		//display satellites
		sat1.display();
		sat2.display();
	}
	
	//display start and reset buttons
	drawSprites();
}

function keyPressed(){
	//if space key is pressed, set satellite in earth orbit
	if (keyCode === 32 && game_state === play1){
		earth_orbit.set_orbit(sat1.body);
	}
	if (keyCode === 32 && (game_state === play2a || game_state === play2b)){
		earth_orbit.set_orbit(sat2.body);
	}
}

function mouseDragged(){
	//if mouse is dragged, make mouse position the satellite's coordinates
	if (game_state === play1 && frameCount - start_frame > 25){
		sat1.body.position.x = mouseX;
		sat1.body.position.y = mouseY;
	}
	if ((game_state === play2a || game_state === play2b) && sat2_counter === 1){
		sat2.body.position.x = mouseX;
		sat2.body.position.y = mouseY;
	}
	console.log(game_state);
}

function mouseReleased(){
	//if mouse is released, launch satellite from earth orbit
	if (game_state === play1 && frameCount - start_frame > 25){
		earth_orbit.launch();
	}
	if ((game_state === play2a || game_state === play2b) && sat2_counter === 1){
		earth_orbit.launch();
	}
}

function displayStart(){
	push();
	textFont("monospace");
	textSize(15);
	fill("azure");
	//story:
	text("Hello there. This is the System for Calibrating Alignment of Satellites, or SYS-CAS for short.", 75,200);
	text("I’ve been tasked with helping you launch our latest satellites the Explorer 1 and 2 to our",75,225);
	text("cosmic neighbours—Venus and Mars. When the satellites are close enough to the planets, the",75,250);
	text("planets’ gravity will do the work of establishing an orbit for us! However, to get the",75,275);
	text("satellites this far away from Earth, I need your help. By dragging and releasing your mouse,",75,300);
	text("you can direct the satellites towards their destinations. If the satellite happens to be",75,325);
	text("headed in the wrong direction, press the space key to direct it back to Earth, where we can",75,350);
	text("attempt to launch them again. You must be careful though, the satellite cannot be travelling",75,375);
	text("too fast, or it will fly past the planet. Be careful to regulate the speed of the spacecraft.",75,400);
	text("If you need any other help, I’ve provided all the information on the screen in front of you.",75,425);
	text("Good luck!",75,450);
	//start button text:
	text("Click to Play:",16.75,512.5);
	//status text:
	text("Status:",250,512.5);
	text(game_state,250,550);
	//missions text:
	text("Missions:",600,512.5);
	text(" - Launch Explorer 1 to Venus",600,550);
	text(" - Launch Explorer 2 to Mars",600,575);
	//display SYS-CAS image
	imageMode(CENTER);
	image(sys_cas,250,100,150,150);
	pop();
}

function displayPlay1(){
	push();
	textFont("monospace");
	textSize(15);
	fill("azure");
	//status text:
	text("Status:",200,512.5);
	text(game_state,200,550);
	//missions text:
	text("Missions:",600,512.5);
	text(" - Launch Explorer 1 to Venus",600,550);
	text(" - Launch Explorer 2 to Mars",600,575);
	pop();
	start_button.visible = false;
}

function displayPart2a(){
	push();
	textFont("monospace");
	textSize(15);
	fill("azure");
	//status text:
	text("Status:",200,512.5);
	text(game_state,200,550);
	//missions text:
	text("Missions:",600,512.5);
	text(" - Launch Explorer 2 to Mars",600,550);
	pop();
	start_button.visible = false;
}

function displayPart2b(){
	push();
	textFont("monospace");
	textSize(15);
	fill("azure");
	//status text:
	text("Status:",250,512.5);
	text(game_state,250,550);
	//missions text:
	text("Missions:",550,512.5);
	text(" - Launch Explorer 1 to Venus",600,550);
	pop();
	start_button.visible = false;
}

function displayEnd(){
	push();
	textFont("monospace");
	textSize(15);
	fill("azure");
	//end text:
	text("Well done! You successfully directed the",75,350);
	text("Explorer 1 and 2 to their respective planets.",75,375);
	text("If you want to attempt this again, click the",75,400);
	text("restart button in the upper right corner.",75,425);
	//restart text:
	text("Click to Play Again:",750,175);
	//status text:
	text("Status:",750,287.5);
	text(game_state,750,312.5);
	//missions text:
	text("Missions:",750,362.5);
	text("[None]",750,387.5);
	pop();
	start_button.visible = false;
}

function approach(satellite,planet){
	if (((satellite.position.x - planet.position.x < 75 &&
			satellite.position.x - planet.position.x > 0) ||
			(planet.position.x - satellite.position.x < 75 &&
			planet.position.x - satellite.position.x > 0)) &&
			((satellite.position.y - planet.position.y < 75 &&
			satellite.position.y - planet.position.y > 0) ||
			(planet.position.y - satellite.position.y < 75 &&
			planet.position.y - satellite.position.y > 0)) &&
			satellite.speed < 7.5){
		if (planet === venus.body){
			venus_orbit = new Orbit(satellite,planet,120);
			if (game_state === play1){
				game_state = play2a;
			}
			if (game_state === play2b){
				game_state = end;
			}
		}
		if (planet === mars.body){
			mars_orbit = new Orbit(satellite,planet,50);
			if (game_state === play1){
				game_state = play2b;
			}
			if (game_state === play2a){
				game_state = end;
			}
		}
	}
}