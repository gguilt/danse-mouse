/*
Changes since last commit:
	Turning the code from total mess to FP (but it's still a mess)
	Multiple boxes (+1 every 10th score)
	Moved addEventListener to outside of the loop (horror)
	Made random(min, max) function to simplify code
	Made inside(x, y, rect) function for checking if mouse in the box
	Changed min. canvas size from 800x500 to 320x320 for mobile support
	Moved startup random box size code inside array (for first box)
	Fixed inside(x, y, rect) function logic bug
	Now supporting mousedown and mouseup events along with click
*/
(function() {
	"use strict";
	let random = (min, max) => Math.floor(Math.random() * max + min);

	let canvas = document.getElementById("mainCanvas");
	let ctx = canvas.getContext("2d");
	let score = 0;
	let size = {
		big: 100,
		gap: 2
	};

	let boxes = [
		{
			x: random(0, 320), y: random(0, 320),
			dxm: 1, dym: 1,
			width: random(size.big - size.gap - score*2,size.big - score*2),
			height: random(size.big - size.gap - score*2,size.big - score*2)
		}
	];

	let inside = function(x, y, rect) {
		return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
	}

	function events(e) {
		let mouseX = event.clientX - canvas.getBoundingClientRect().left;
		let mouseY = event.clientY - canvas.getBoundingClientRect().top;

		boxes.forEach((box) => {
			if (inside(mouseX, mouseY, box)) {
				box.x = random(1, canvas.width - box.width - 5);
				box.y = random(1, canvas.height - box.height - 5);
				score++;

				box.width = box.height = (box.width > 40) ? random(size.big - size.gap - score*2, size.big - score*2) : 40;

				if (score % 10 == 0) {
					boxes.push({
						x: random(0, 320), y: random(0, 320),
						dxm: 1, dym: 1,
						width: random(size.big - size.gap - score*2,size.big - score*2),
						height: random(size.big - size.gap - score*2,size.big - score*2)
					});
				}
			}
		});

	}

	canvas.addEventListener("click", events);
	canvas.addEventListener("mousedown", events);
	canvas.addEventListener("mouseup", events);

	function loop() {
		canvas.width = (window.innerWidth > 320) ? window.innerWidth : 320;
		canvas.height = (window.innerHeight > 320) ? window.innerHeight : 320;

		boxes.forEach((box) => {
			box.x += box.dxm * random(1, score + 1);
			box.y += box.dym * random(1, score + 1);

			if (box.x <= 0 || box.x + box.width >= canvas.width) {
				if (box.x <= 0) box.x = 0;
				else if (box.x + box.width >= canvas.width) box.x = canvas.width - box.width;
				box.dxm = -box.dxm;
			}

			if (box.y <= 0 || box.y + box.height >= canvas.height) {
				if (box.y <= 0) box.y = 0;
				else if (box.y + box.height >= canvas.height) box.y = canvas.height - box.height;
				box.dym = -box.dym;
			}
		});

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		boxes.forEach((box) => {
			ctx.fillStyle = "red";
			ctx.beginPath();
			ctx.fillRect(box.x, box.y, box.width, box.height);
			ctx.stroke();
		});

		ctx.font = "24px serif";
		ctx.strokeText(score + " Points", 5, 30);
	}
	setInterval(loop, 10);
}());
