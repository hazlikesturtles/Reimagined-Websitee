const characters = [
    { name: 'Ayana',       sprite: 'ayana_sprite_idle.png' },
    { name: 'Franko',      sprite: 'franko_sprite_idle.png' },
    { name: 'Mara',        sprite: 'mara_sprite_idle.png' },
    { name: 'Rico',        sprite: 'rico_sprite_idle.png' },
    { name: 'Neneng Ding', sprite: 'neneng_ding_idle.png' },
    { name: 'Boyet Kalbo', sprite: 'boyet_kalbo_idle.png' },
];

const BG = 'hero.bg.png';
const POSITIONS = ['pos-far-left', 'pos-left', 'pos-center', 'pos-right', 'pos-far-right'];

let current = 0;
let animating = false;

const track = document.getElementById('slidesTrack');
const charName = document.getElementById('charName');

function idx(offset) {
    return (current + offset + characters.length * 100) % characters.length;
}

function buildCards() {
    track.innerHTML = '';
    [-2, -1, 0, 1, 2].forEach((offset, pi) => {
        const c = characters[idx(offset)];
        const card = document.createElement('div');
        card.className = `char-card ${POSITIONS[pi]}`;
        card.innerHTML = `<img class="card-bg" src="${BG}" alt=""><img class="char-sprite" src="${c.sprite}" alt="${c.name}">`;
        track.appendChild(card);
    });
}

function updateName() {
    charName.style.opacity = '0';
    setTimeout(() => {
        charName.textContent = characters[current].name;
        charName.style.opacity = '1';
    }, 200);
}

function slide(dir) {
    if (animating) return;
    animating = true;

    // Update current index
    if (dir === 'next') current = (current + 1) % characters.length;
    else current = (current - 1 + characters.length) % characters.length;

    // Get all existing cards (5)
    const cards = Array.from(track.querySelectorAll('.char-card'));

    // Add new card on the incoming side (starts hidden off-screen)
    const incomingOffset = dir === 'next' ? 2 : -2;
    const newChar = characters[idx(incomingOffset)];
    const newCard = document.createElement('div');
    const startPos = dir === 'next' ? 'pos-far-right' : 'pos-far-left';
    newCard.className = `char-card ${startPos}`;
    newCard.innerHTML = `<img class="card-bg" src="${BG}" alt=""><img class="char-sprite" src="${newChar.sprite}" alt="${newChar.name}">`;
    track.appendChild(newCard);

    // Force reflow so transition fires
    newCard.getBoundingClientRect();

    // Shift all existing cards one step
    cards.forEach(card => {
        const curPos = POSITIONS.indexOf(Array.from(card.classList).find(c => c.startsWith('pos-')));
        card.classList.remove(POSITIONS[curPos]);
        const newPos = dir === 'next' ? curPos - 1 : curPos + 1;
        if (newPos < 0 || newPos >= POSITIONS.length) {
            // Slide off screen
            card.style.opacity = '0';
            card.style.transform = dir === 'next' ? 'translateX(-500px)' : 'translateX(500px)';
            card.style.width = '120px';
            card.style.height = '140px';
        } else {
            card.classList.add(POSITIONS[newPos]);
        }
    });

    // Move new card to its proper position
    newCard.classList.remove(startPos);
    newCard.classList.add(dir === 'next' ? 'pos-right' : 'pos-left');

    updateName();

    setTimeout(() => {
        buildCards();
        animating = false;
    }, 450);
}

document.getElementById('nextBtn').addEventListener('click', () => slide('next'));
document.getElementById('prevBtn').addEventListener('click', () => slide('prev'));

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') slide('next');
    if (e.key === 'ArrowLeft') slide('prev');
});

buildCards();
