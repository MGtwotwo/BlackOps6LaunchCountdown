// Confetti taken from https://medium.com/@codewithashutosh/40-css-confetti-animation-b65f236efa93
let W = window.innerWidth;
let H = window.innerHeight;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const maxConfettis = 150;
const particles = [];

const possibleColors = [
    "DodgerBlue",
    "OliveDrab",
    "Gold",
    "Pink",
    "SlateBlue",
    "LightBlue",
    "Gold",
    "Violet",
    "PaleGreen",
    "SteelBlue",
    "SandyBrown",
    "Chocolate",
    "Crimson"
];

function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
    this.x = Math.random() * W; // x
    this.y = Math.random() * H - H; // y
    this.r = randomFromTo(11, 33); // radius
    this.d = Math.random() * maxConfettis + 11;
    this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
    this.tilt = Math.floor(Math.random() * 33) - 11;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;

    this.draw = function() {
        context.beginPath();
        context.lineWidth = this.r / 2;
        context.strokeStyle = this.color;
        context.moveTo(this.x + this.tilt + this.r / 3, this.y);
        context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
        return context.stroke();
    };
}

function Draw() {
    const results = [];

    // Magical recursive functional love
    requestAnimationFrame(Draw);

    context.clearRect(0, 0, W, window.innerHeight);

    for (var i = 0; i < maxConfettis; i++) {
        results.push(particles[i].draw());
    }

    let particle = {};
    let remainingFlakes = 0;
    for (var i = 0; i < maxConfettis; i++) {
        particle = particles[i];

        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
        particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

        if (particle.y <= H) remainingFlakes++;

        // If a confetti has fluttered out of view,
        // bring it back to above the viewport and let if re-fall.
        if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
            particle.x = Math.random() * W;
            particle.y = -30;
            particle.tilt = Math.floor(Math.random() * 10) - 20;
        }
    }

    return results;
}

window.addEventListener(
    "resize",
    function() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    },
    false
);

// Push new confetti objects to `particles[]`
for (var i = 0; i < maxConfettis; i++) {
    particles.push(new confettiParticle());
}

const zeroPad = (num, places) => String(num).padStart(places, '0');

// Countdown taken from W3Schools, thanks W3Schools.
// Set the date we're counting down to
var countdownDate = new Date("Oct 25, 2024 00:00:00").getTime();

function updateDate() {
    // Get today's date and time
    var currentDate = new Date().getTime();

    // Find the distance between the current date and the countdown date
    var distance = countdownDate - currentDate;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result
    document.getElementById("days").innerHTML = zeroPad(days, 2);
    document.getElementById("hours").innerHTML = zeroPad(hours, 2);
    document.getElementById("minutes").innerHTML = zeroPad(minutes, 2);
    document.getElementById("seconds").innerHTML = zeroPad(seconds, 2);

    // If the countdown is finished,
    if (distance < 0) {
        // remove the countdown,
        document.getElementById("countdown").remove();
        
        // create OUT NOW text, then append it into the main container,
        const countdownFinished = document.createElement("div");
        countdownFinished.classList.add('countdownFinished');
        const countdownFinishedText = document.createTextNode("OUT NOW");
        countdownFinished.appendChild(countdownFinishedText);
        const containerElement = document.getElementById("container");
        containerElement.appendChild(countdownFinished);

        // and initialize confetti.
        canvas.width = W;
        canvas.height = H;
        Draw();
    }
};

// Update the countdown on website launch,
updateDate();
// and repeat every second.
var x = setInterval(function() {
    // Check if the countdown element exists,
    if (document.getElementById("countdown")) {
        updateDate();
    }
    // stop updating if not.
    else {
        clearInterval(x);
    }
}, 1000);
