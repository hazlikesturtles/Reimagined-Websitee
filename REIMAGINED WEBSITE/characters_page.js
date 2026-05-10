


// ── Character Data ────────────────────────────────────────────────────────────
// Each object holds a character's display name and their idle sprite filename.
// These sprites are the same ones used inside the actual Python game.
const characters = [
    { name: 'Ayana',       sprite: 'ayana_sprite_idle.png' },
    { name: 'Franko',      sprite: 'franko_sprite_idle.png' },
    { name: 'Mara',        sprite: 'mara_sprite_idle.png' },
    { name: 'Rico',        sprite: 'rico_sprite_idle.png' },
    { name: 'Neneng Ding', sprite: 'neneng_ding_idle.png' },
    { name: 'Boyet Kalbo', sprite: 'boyet_kalbo_idle.png' },
];

// ── Shared Card Background ────────────────────────────────────────────────────
// All character cards use the same background image (hero.bg.png).
// The character sprite is layered on top of it using CSS absolute positioning.
const BG = 'hero.bg.png';

// ── Position Classes ──────────────────────────────────────────────────────────
// CSS classes that control each card's size, position, opacity, and z-index.
// The carousel shows 5 cards at once; 'pos-center' is the focused one.
const POSITIONS = ['pos-far-left', 'pos-left', 'pos-center', 'pos-right', 'pos-far-right'];

// ── State Variables ───────────────────────────────────────────────────────────
// 'current' is the index of the character currently in the center card.
// 'animating' prevents overlapping transitions from corrupting the carousel state.
let current = 0;
let animating = false;

// ── DOM References ────────────────────────────────────────────────────────────
const track    = document.getElementById('slidesTrack'); // container for the 5 cards
const charName = document.getElementById('charName');    // character name text below carousel


// ── Index Helper ──────────────────────────────────────────────────────────────
// Returns the characters[] index at 'offset' positions from current.
// The * 100 trick ensures the modulo never receives a negative number.
// Example: idx(-2) gives the character two slots to the LEFT of center.
function idx(offset) {
    return (current + offset + characters.length * 100) % characters.length;
}


// ── Build All 5 Cards ─────────────────────────────────────────────────────────
// Clears the track and creates 5 fresh character cards.
// Each card is a layered composition:
//   - card-bg  → the shared background image (hero.bg.png)
//   - char-sprite → the character's idle sprite, positioned on top by CSS
// Called once on page load, and again after every slide animation completes.
function buildCards() {
    track.innerHTML = '';
    [-2, -1, 0, 1, 2].forEach((offset, pi) => {
        const c = characters[idx(offset)];
        const card = document.createElement('div');
        card.className = `char-card ${POSITIONS[pi]}`;
        card.innerHTML = `
            <img class="card-bg"     src="${BG}"       alt="">
            <img class="char-sprite" src="${c.sprite}" alt="${c.name}">
        `;
        track.appendChild(card);
    });
}


// ── Update Character Name ─────────────────────────────────────────────────────
// Fades the name text out, swaps it to the current character's name,
// then fades it back in. The 200ms delay matches the CSS opacity transition.
function updateName() {
    charName.style.opacity = '0';
    setTimeout(() => {
        charName.textContent = characters[current].name;
        charName.style.opacity = '1';
    }, 200);
}


// ── Slide Animation ───────────────────────────────────────────────────────────
// Animates the carousel one step to the left (prev) or right (next).
// Steps:
//   1. Lock animation, advance the 'current' index.
//   2. Create a new card just off-screen on the incoming side.
//   3. Force a browser reflow so CSS sees the starting position before animating.
//   4. Shift all 5 existing cards one position in the direction of travel.
//      Cards sliding off the edge are pushed further out and hidden.
//   5. Move the new card into the position next to the center.
//   6. Fade-update the character name text.
//   7. After 450ms (the CSS transition time), rebuild DOM and release the lock.
function slide(dir) {
    if (animating) return; // prevent input while transition is running
    animating = true;

    // Step 1: Advance index, wrapping at both ends of the array
    if (dir === 'next') current = (current + 1) % characters.length;
    else current = (current - 1 + characters.length) % characters.length;

    const cards = Array.from(track.querySelectorAll('.char-card'));

    // Step 2: Create the incoming card and place it just off-screen
    const incomingOffset = dir === 'next' ? 2 : -2;
    const newChar = characters[idx(incomingOffset)];
    const newCard = document.createElement('div');
    const startPos = dir === 'next' ? 'pos-far-right' : 'pos-far-left';
    newCard.className = `char-card ${startPos}`;
    newCard.innerHTML = `
        <img class="card-bg"     src="${BG}"            alt="">
        <img class="char-sprite" src="${newChar.sprite}" alt="${newChar.name}">
    `;
    track.appendChild(newCard);

    // Step 3: Reading getBoundingClientRect() forces the browser to calculate
    // the card's current position before we change it, making the CSS transition fire.
    newCard.getBoundingClientRect();

    // Step 4: Shift every existing card one position left or right
    cards.forEach(card => {
        const curPos = POSITIONS.indexOf(Array.from(card.classList).find(c => c.startsWith('pos-')));
        card.classList.remove(POSITIONS[curPos]);
        const newPos = dir === 'next' ? curPos - 1 : curPos + 1;

        if (newPos < 0 || newPos >= POSITIONS.length) {
            // This card is leaving the visible range — animate it off-screen
            card.style.opacity = '0';
            card.style.transform = dir === 'next' ? 'translateX(-500px)' : 'translateX(500px)';
            card.style.width = '120px';
            card.style.height = '140px';
        } else {
            card.classList.add(POSITIONS[newPos]);
        }
    });

    // Step 5: Transition the new card from off-screen into the adjacent-to-center slot
    newCard.classList.remove(startPos);
    newCard.classList.add(dir === 'next' ? 'pos-right' : 'pos-left');

    // Step 6: Update the displayed character name
    updateName();

    // Step 7: Once the transition finishes, rebuild the DOM from scratch and unlock
    setTimeout(() => {
        buildCards();
        animating = false;
    }, 450);
}


// ── Button & Keyboard Controls ────────────────────────────────────────────────
// Clicking the arrow buttons triggers a slide in the corresponding direction.
// Keyboard arrow keys do the same for users who prefer not to use the mouse.
document.getElementById('nextBtn').addEventListener('click', () => slide('next'));
document.getElementById('prevBtn').addEventListener('click', () => slide('prev'));

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') slide('next');
    if (e.key === 'ArrowLeft')  slide('prev');
});


// ── Initialise ────────────────────────────────────────────────────────────────
// Build the initial 5 cards when the page first loads.
// (Note: updateName() is not called here because the name is already set in HTML.)
buildCards();