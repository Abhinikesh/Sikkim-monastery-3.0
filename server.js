const express = require("express");
const path = require("path");

const app = express();
const PORT = 5000;

// Serve static files (style.css, script.js, images) from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html when visiting "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Frontend running at http://localhost:${PORT}`);
});

monasteries.forEach(m => {
  L.marker([m.lat, m.lng])
    .addTo(map)
    .bindPopup(`<b>${m.name}</b>`);
});



const track = document.getElementById('carousel-track');
const carousel = document.getElementById('carousel');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let index = 0;
const visibleCards = 3;
const originalCards = [...track.children];
const cardWidth = track.children[0].offsetWidth + 20; // width + margin

for (let i = 0; i < visibleCards; i++) {
  track.appendChild(originalCards[i].cloneNode(true));
  track.prepend(originalCards[originalCards.length - 1 - i].cloneNode(true));
}

track.style.transform = `translateX(-${cardWidth * visibleCards}px)`;

let interval;

function moveNext() {
  index++;
  track.style.transition = "transform 0.6s ease-in-out";
  track.style.transform = `translateX(-${(visibleCards + index) * cardWidth}px)`;

  if (index >= originalCards.length) {
    setTimeout(() => {
      track.style.transition = "none";
      track.style.transform = `translateX(-${cardWidth * visibleCards}px)`;
      index = 0;
    }, 600);
  }
}

function movePrev() {
  index--;
  track.style.transition = "transform 0.6s ease-in-out";
  track.style.transform = `translateX(-${(visibleCards + index) * cardWidth}px)`;

  if (index < 0) {
    setTimeout(() => {
      track.style.transition = "none";
      track.style.transform = `translateX(-${cardWidth * (visibleCards + originalCards.length - 1)}px)`;
      index = originalCards.length - 1;
    }, 600);
  }
}

function startCarousel() {
  interval = setInterval(moveNext, 2500);
}

function stopCarousel() {
  clearInterval(interval);
}

nextBtn.addEventListener('click', moveNext);
prevBtn.addEventListener('click', movePrev);
carousel.addEventListener('mouseenter', stopCarousel);
carousel.addEventListener('mouseleave', startCarousel);

startCarousel();
