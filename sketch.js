function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	rectMode(CENTER);
	noStroke();
}

function draw() {
	circle(mouseX, mouseY, 20);
	withProbability(0.015, () => rect(mouseX, mouseY, 100, 100, 5));
}


function withProbability(p, fn){
	if (random() < p){
		fn();
	}
}
