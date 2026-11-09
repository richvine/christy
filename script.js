// ==========================================
// A GAME THAT CHANGED EVERYTHING
// CINEMATIC STORY ENGINE
// ==========================================

// ELEMENTS
const intro = document.getElementById("intro");
const story = document.getElementById("story");
const ending = document.getElementById("ending");

const startButton = document.getElementById("startButton");
const nextButton = document.getElementById("nextButton");
const replayButton = document.getElementById("replayButton");
const soundButton = document.getElementById("soundButton");

const storyTitle = document.getElementById("storyTitle");
const storyText = document.getElementById("storyText");
const chapterNumber = document.getElementById("chapterNumber");
const progressBar = document.getElementById("progressBar");

const heart = document.getElementById("heart");
const particlesCanvas = document.getElementById("particles");

// ==========================================
// MUSIC ENGINE
// ==========================================

const backgroundMusic = document.getElementById("backgroundMusic");

let soundEnabled = true;
let musicStarted = false;

if (backgroundMusic) {
    backgroundMusic.loop = true;
    backgroundMusic.volume = 1;
    backgroundMusic.preload = "auto";
}

function playMusic() {
    if (!backgroundMusic) return;

    backgroundMusic.muted = false;
    backgroundMusic.volume = 1;

    // Call play immediately; don't delay it with another promise or timer.
    const playback = backgroundMusic.play();

    if (playback !== undefined) {
        playback.then(() => {
            soundEnabled = true;
            musicStarted = true;

            soundButton.textContent = "♫ SOUND ON";
        }).catch((error) => {
            console.log("Music playback failed:", error);

            soundEnabled = false;
            soundButton.textContent = "♫ TAP FOR SOUND";
        });
    }
}

function stopMusic() {
    if (!backgroundMusic) return;

    backgroundMusic.pause();

    soundEnabled = false;
    soundButton.textContent = "♫ SOUND OFF";
}

if (soundButton) {
    soundButton.addEventListener("click", () => {
        if (backgroundMusic.paused) {
            playMusic();
        } else {
            stopMusic();
        }
    });
}

// ==========================================
// STORY CHAPTERS
// ==========================================

const chapters = [

    {
        title: "IT WAS ONLY A GAME",
        text: "At first, it was just Call of Duty. Something we could enjoy together, laugh about and use to spend time with each other. It was never supposed to become something that constantly brought tension between us."
    },

    {
        title: "WE BARELY PLAY ANYMORE",
        text: "Things are different now. We barely play together like we used to. Sometimes you don't play with me, sometimes I don't play with you. And when we finally do, it somehow ends in another argument."
    },

    {
        title: "THE SAME CYCLE",
        text: "It feels like the same thing keeps happening. A simple game turns into frustration, misunderstandings and unnecessary tension. Something that should help us relax has become something I sometimes hesitate to even enjoy."
    },

    {
        title: "LITTLE THINGS. BIG DIFFERENCE.",
        text: "What bothers me isn't only the arguments. It's the little things too. The unnecessary lies, the things that could easily be said honestly but somehow aren't. I don't think honesty should be this difficult between two people."
    },

    {
        title: "SOMETHING CHANGED",
        text: "I won't pretend these things haven't changed how I see you. When the same situations keep repeating, eventually they affect how someone feels. Even the smallest things begin to mean something different."
    },

    {
        title: "IT'S HOW IT MAKES ME FEEL",
        text: "Sometimes I don't feel understood. Sometimes I feel like I'm being made to question things that should be simple. I don't want to keep feeling like I'm in a competition or constantly trying to figure out what's really going on."
    },

    {
        title: "THERE IS MORE TO LIFE",
        text: "At the end of the day, it's Call of Duty. There is a whole life outside that game. I don't want something that should be enjoyable to keep becoming a reason for arguments. Peace, honesty and respect matter more to me."
    }

];

let currentChapter = 0;

// ==========================================
// SHOW CHAPTER
// ==========================================

function showChapter() {

    const chapter = chapters[currentChapter];

    storyTitle.textContent = chapter.title;
    storyText.textContent = chapter.text;

    chapterNumber.textContent =
        `CHAPTER ${String(currentChapter + 1).padStart(2, "0")} / ${chapters.length}`;

    const progress = ((currentChapter + 1) / chapters.length) * 100;

    progressBar.style.width = `${progress}%`;

    if (currentChapter === chapters.length - 1) {
        nextButton.textContent = "FINISH THE STORY";
    } else {
        nextButton.textContent = "CONTINUE";
    }

    // Restart text animation
    storyTitle.style.animation = "none";
    storyText.style.animation = "none";

    void storyTitle.offsetWidth;

    storyTitle.style.animation = "";
    storyText.style.animation = "";

    // Heart animation
    if (heart) {
        heart.classList.remove("heart-beat");
        void heart.offsetWidth;
        heart.classList.add("heart-beat");
    }
}

// ==========================================
// START EXPERIENCE
// ==========================================

startButton.addEventListener("click", () => {

    intro.classList.add("hidden");
    story.classList.remove("hidden");

    currentChapter = 0;

    showChapter();

    // MUSIC STARTS DIRECTLY FROM THIS CLICK
    playMusic();

});

// ==========================================
// NEXT CHAPTER
// ==========================================

nextButton.addEventListener("click", () => {

    currentChapter++;

    if (currentChapter < chapters.length) {

        showChapter();

    } else {

        story.classList.add("hidden");
        ending.classList.remove("hidden");

        progressBar.style.width = "100%";

    }

});

// ==========================================
// REPLAY
// ==========================================

replayButton.addEventListener("click", () => {

    currentChapter = 0;

    ending.classList.add("hidden");
    intro.classList.remove("hidden");

    progressBar.style.width = "0%";

    // Keep the music playing if it was already enabled.
    if (soundEnabled && musicStarted && backgroundMusic.paused) {
        playMusic();
    }

});

// ==========================================
// PARTICLE ENGINE
// ==========================================

if (particlesCanvas) {

    const ctx = particlesCanvas.getContext("2d");

    let particles = [];

    let width;
    let height;

    const PARTICLE_COUNT = 110;

    function resizeCanvas() {

        width = particlesCanvas.width = window.innerWidth;
        height = particlesCanvas.height = window.innerHeight;

    }

    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();

    class Particle {

        constructor() {
            this.reset(true);
        }

        reset(initial = false) {

            this.x = Math.random() * width;

            this.y = initial
                ? Math.random() * height
                : height + Math.random() * 100;

            this.size = Math.random() * 2 + 0.5;

            this.speedY = Math.random() * 0.7 + 0.2;

            this.speedX = (Math.random() - 0.5) * 0.4;

            this.opacity = Math.random() * 0.6 + 0.1;

            this.pulse = Math.random() * 0.02 + 0.005;

        }

        update() {

            this.y -= this.speedY;
            this.x += this.speedX;

            this.opacity += this.pulse;

            if (this.opacity > 0.8 || this.opacity < 0.1) {
                this.pulse *= -1;
            }

            if (this.y < -10) {
                this.reset();
            }

        }

        draw() {

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = `rgba(255, 75, 110, ${this.opacity})`;

            ctx.shadowBlur = 12;
            ctx.shadowColor = "rgba(255, 40, 80, 0.7)";

            ctx.fill();

            ctx.shadowBlur = 0;

        }

    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {

        ctx.clearRect(0, 0, width, height);

        particles.forEach(particle => {

            particle.update();
            particle.draw();

        });

        requestAnimationFrame(animateParticles);

    }

    animateParticles();

}

// ==========================================
// INITIAL STATE
// ==========================================

if (soundButton) {
    soundButton.textContent = "♫ SOUND ON";
}

console.log("A GAME THAT CHANGED EVERYTHING loaded successfully.");