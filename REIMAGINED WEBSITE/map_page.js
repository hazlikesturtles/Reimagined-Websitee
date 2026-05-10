// =============================================================================
//  map_page.js — Maps Page (Map Carousel)
//  REIMAGINED | Filipino Street Games — Website
// =============================================================================
//  This file powers the interactive map carousel on the Maps page.
//  It works almost identically to the About page carousel, but instead of
//  team member cards it shows map preview images, and the info panel below
//  updates both the map name AND its description on each slide.
// =============================================================================


// ── Map Data ──────────────────────────────────────────────────────────────────
// Each object represents one in-game map.
// 'image' is the preview image filename shown in the carousel card.
// 'desc' is the flavour text displayed below the carousel when that map is active.
const maps = [
    {
        name: 'TAGLAGAS',
        image: 'taglagas_map.png',
        desc: 'This pixel art map depicts a cozy, autumnal street scene. The warm orange and brown tones of the background and the falling leaves suggest a crisp fall day. The street itself is cracked and weathered, with yellow lane markings at the bottom, giving it a lived-in, neighborhood feel.'
    },
    {
        name: 'KALYE',
        image: 'kalye_map.png',
        desc: 'Captures a charming, rural neighborhood scene set along a quiet paved road. The vibrant green grass and simple building designs give it a peaceful, "small-town" vibe. The central blue building resembles a traditional Filipino neighborhood store, complete with a barred window for transactions and small advertisements or signs posted on the exterior.'
    },
    {
        name: 'LUNGSOD',
        image: 'lungsod_map.png',
        desc: 'Features a convenient roadside stop, blending a familiar convenience store with a small gas station. The muted gray and tan color palette gives the scene a grounded, urban feel. A building modeled after a 7-Eleven, complete with the iconic orange, green, and red stripes on the sign. It features glass doors and windows displaying silhouetted items inside.'
    },
    {
        name: 'DAMUHAN',
        image: 'damuhan_map.png',
        desc: 'Shows an open, lush grassy field. It uses various shades of green to create a sense of texture and depth, with darker tones along the edges suggesting shaded areas or taller brush. Perfect area to run around and play with friends without feeling the need to be worried.'
    },
];

// ── Position Classes ──────────────────────────────────────────────────────────
// CSS classes that define where each card sits on screen.
// The carousel always shows 5 cards: center is focused, sides shrink and fade.
const POSITIONS = ['pos-far-left', 'pos-left', 'pos-center', 'pos-right', 'pos-far-right'];

// ── State Variables ───────────────────────────────────────────────────────────
// 'current' is the index of the map currently shown in the center card.
// 'animating' is a lock that prevents double-clicks from breaking the animation.
let current = 0;
let animating = false;

// ── DOM References ────────────────────────────────────────────────────────────
// Elements we update dynamically with JavaScript.
const track   = document.getElementById('slidesTrack'); // holds the 5 map cards
const mapName = document.getElementById('mapName');     // large map name text
const mapDesc = document.getElementById('mapDesc');     // description paragraph below
const dotsRow = document.getElementById('dotsRow');     // row of dot indicators


// ── Build Navigation Dots ─────────────────────────────────────────────────────
// Creates one clickable dot per map. The active dot highlights to show
// which map is currently centered. Clicking any dot jumps to that map.
maps.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : ''); // first dot starts active
    dot.addEventListener('click', () => goTo(i));
    dotsRow.appendChild(dot);
});


// ── Index Helper ──────────────────────────────────────────────────────────────
// Calculates a wrapped array index for any offset from the current position.
// Multiplying by 100 before the modulo prevents negative results in JS.
// Example: if current=0 and offset=-1, this returns the last map (wraps around).
function idx(offset) {
    return (current + offset + maps.length * 100) % maps.length;
}


// ── Build All 5 Cards ─────────────────────────────────────────────────────────
// Clears the carousel track and rebuilds all 5 visible map cards from scratch.
// Each card shows only the map's preview image — no text inside the card itself.
// Called once on load, and again after each slide transition completes.
function buildCards() {
    track.innerHTML = '';
    [-2, -1, 0, 1, 2].forEach((offset, pi) => {
        const m = maps[idx(offset)];
        const card = document.createElement('div');
        card.className = `map-card ${POSITIONS[pi]}`;
        card.innerHTML = `<img src="${m.image}" alt="${m.name}">`;
        track.appendChild(card);
    });
}


// ── Update Name, Description & Dots ──────────────────────────────────────────
// Fades out both the map name and description simultaneously,
// swaps their text content, then fades them back in.
// Also moves the 'active' highlight to the correct dot.
function updateInfo() {
    // Fade out name → swap text → fade in
    mapName.style.opacity = '0';
    setTimeout(() => {
        mapName.textContent = maps[current].name;
        mapName.style.opacity = '1';
    }, 200);

    // Fade out description → swap text → fade in
    mapDesc.style.opacity = '0';
    setTimeout(() => {
        mapDesc.querySelector('p').textContent = maps[current].desc;
        mapDesc.style.opacity = '1';
    }, 200);

    // Move active dot highlight to current map
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
    });
}


// ── Slide Animation ───────────────────────────────────────────────────────────
// Animates the carousel one step left (prev) or right (next).
// Steps:
//   1. Lock input, advance the 'current' index.
//   2. Spawn a new card just off-screen on the incoming side.
//   3. Force a browser reflow so the CSS transition fires correctly.
//   4. Shift all existing cards one position in the slide direction.
//      Cards that fall off the visible range are pushed further off-screen.
//   5. Slide the new card into the second-from-edge slot.
//   6. Update the name/description panel and dots.
//   7. After 450ms (the CSS transition duration), rebuild cleanly and unlock.
function slide(dir) {
    if (animating) return; // ignore clicks while transition is running
    animating = true;

    // Step 1: Advance current index (wraps around at both ends)
    if (dir === 'next') current = (current + 1) % maps.length;
    else current = (current - 1 + maps.length) % maps.length;

    const cards = Array.from(track.querySelectorAll('.map-card'));

    // Step 2: Create the new incoming card off-screen
    const incomingOffset = dir === 'next' ? 2 : -2;
    const newMap = maps[idx(incomingOffset)];
    const newCard = document.createElement('div');
    const startPos = dir === 'next' ? 'pos-far-right' : 'pos-far-left';
    newCard.className = `map-card ${startPos}`;
    newCard.innerHTML = `<img src="${newMap.image}" alt="${newMap.name}">`;
    track.appendChild(newCard);

    // Step 3: Force reflow — makes the browser register startPos before we change it
    newCard.getBoundingClientRect();

    // Step 4: Shift all existing cards one position
    cards.forEach(card => {
        const curPos = POSITIONS.indexOf(Array.from(card.classList).find(c => c.startsWith('pos-')));
        card.classList.remove(POSITIONS[curPos]);
        const newPos = dir === 'next' ? curPos - 1 : curPos + 1;

        if (newPos < 0 || newPos >= POSITIONS.length) {
            // Card is leaving view — animate it off-screen then it will be removed
            card.style.opacity = '0';
            card.style.transform = dir === 'next' ? 'translateX(-600px)' : 'translateX(600px)';
            card.style.width = '120px';
            card.style.height = '140px';
        } else {
            card.classList.add(POSITIONS[newPos]);
        }
    });

    // Step 5: Slide new card into the adjacent-to-center position
    newCard.classList.remove(startPos);
    newCard.classList.add(dir === 'next' ? 'pos-right' : 'pos-left');

    // Step 6: Update info panel and dots
    updateInfo();

    // Step 7: After the CSS transition finishes, rebuild DOM and unlock
    setTimeout(() => {
        buildCards();
        animating = false;
    }, 450);
}


// ── Go To Specific Map ────────────────────────────────────────────────────────
// Used by dot clicks to jump directly to a specific map.
// Slides one step at a time (with a 460ms gap between each step)
// until the carousel reaches the target index.
function goTo(target) {
    if (target === current || animating) return;
    const dir = target > current ? 'next' : 'prev';
    function step() {
        if (current === target) return;
        slide(dir);
        setTimeout(step, 460); // wait slightly longer than the 450ms animation
    }
    step();
}


// ── Button & Keyboard Controls ────────────────────────────────────────────────
// The Next and Prev arrow buttons call slide() directly.
// Arrow keys on the keyboard provide the same control for accessibility.
document.getElementById('nextBtn').addEventListener('click', () => slide('next'));
document.getElementById('prevBtn').addEventListener('click', () => slide('prev'));

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') slide('next');
    if (e.key === 'ArrowLeft')  slide('prev');
});


// ── Initialise ────────────────────────────────────────────────────────────────
// Build the carousel cards and update the info panel when the page loads.
buildCards();
updateInfo();