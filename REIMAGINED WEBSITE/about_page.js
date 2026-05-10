// =============================================================================
//  about_page.js — About Page (Team Carousel)
//  REIMAGINED | Filipino Street Games — Website
// =============================================================================
//  This file powers the interactive team member carousel on the About page.
//  It dynamically builds cards, handles left/right sliding animations,
//  and updates the member name and dot indicators on each transition.
// =============================================================================


// ── Team Member Data ──────────────────────────────────────────────────────────
// Each object holds one team member's info.
// 'image' is the photo filename, 'page' is the link to their individual profile.
const members = [
    {
        name: 'Emman',
        role: 'Developer',
        bio: 'One of the minds behind the code powering REIMAGINED. Emman helped bring the game logic and mechanics to life, turning childhood game concepts into a playable browser experience.',
        image: 'EMMANN.jpg',
        page: 'emman_page.html'
    },
    {
        name: 'Althea',
        role: 'Designer',
        bio: 'The creative force behind the pixel art and visual identity of REIMAGINED. Althea crafted the maps, characters, and overall aesthetic that gives the game its nostalgic charm.',
        image: 'althea.jpg',
        page: 'althea_page.html'
    },
    {
        name: 'Rhal',
        role: 'Developer',
        bio: 'Rhal worked on the technical side of REIMAGINED, building out the systems and interactions that make the gameplay feel smooth and responsive across different game modes.',
        image: 'rhal.jpg',
        page: 'rhal_page.html'
    },
    {
        name: 'Shelly',
        role: 'Designer & Writer',
        bio: 'Shelly shaped the storytelling and visual presentation of REIMAGINED. From character personalities to the layout of the website, she made sure everything felt cohesive and polished.',
        image: 'shelly.jpg',
        page: 'shelly_page.html'
    },
    {
        name: 'Heicha',
        role: 'Producer',
        bio: 'Heicha kept the team aligned and on track throughout the project. Managing timelines and making sure every piece of REIMAGINED came together into a complete, finished product.',
        image: 'heicha.jpg',
        page: 'heicha_page.html'
    },
];

// ── Position Classes ──────────────────────────────────────────────────────────
// The carousel always shows 5 cards at once, arranged in these CSS positions.
// 'pos-center' is the focused card; the others shrink and fade toward the sides.
const POSITIONS = ['pos-far-left', 'pos-left', 'pos-center', 'pos-right', 'pos-far-right'];

// ── State Variables ───────────────────────────────────────────────────────────
// 'current' tracks which member index is in the center card.
// 'animating' prevents rapid clicks from breaking the animation mid-transition.
let current = 0;
let animating = false;

// ── DOM References ────────────────────────────────────────────────────────────
// Grabbing the HTML elements we'll be manipulating in JavaScript.
const track      = document.getElementById('slidesTrack'); // container holding all 5 cards
const memberName = document.getElementById('memberName');  // the big name text below the carousel
const dotsRow    = document.getElementById('dotsRow');     // row of clickable dot indicators


// ── Build Navigation Dots ─────────────────────────────────────────────────────
// Creates one dot per team member and appends them to the dots row.
// Clicking a dot calls goTo(i) to jump directly to that member.
members.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : ''); // first dot starts active
    dot.addEventListener('click', () => goTo(i));
    dotsRow.appendChild(dot);
});


// ── Index Helper ──────────────────────────────────────────────────────────────
// Returns the array index for a member at 'offset' positions away from current.
// Multiplying by 100 before modulo prevents negative results in JavaScript.
// Example: idx(-1) gives the member to the LEFT of the current one.
function idx(offset) {
    return (current + offset + members.length * 100) % members.length;
}


// ── Card HTML Builder ─────────────────────────────────────────────────────────
// Builds the inner HTML for a single member card.
// If no image is provided, it shows a placeholder SVG icon instead.
// The "VIEW PROFILE →" button only appears on the center card (pos-center),
// so it only shows for the currently focused member.
function makeCardHTML(member, posClass) {
    const photoContent = member.image
        ? `<img src="${member.image}" alt="${member.name}" style="width:100%;height:100%;object-fit:cover;">`
        : `<div class="card-photo-placeholder">
               <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                 <circle cx="12" cy="8" r="4"/>
                 <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
               </svg>
               <span>PHOTO COMING SOON</span>
           </div>`;

    return `
        <div class="card-photo">${photoContent}</div>
        <div class="card-content">
            <div class="card-role">${member.role}</div>
            <div class="card-bio">${member.bio}</div>
            ${posClass === 'pos-center' && member.page
                ? `<div class="card-view-btn" onclick="window.location.href='${member.page}'">VIEW PROFILE →</div>`
                : ''}
        </div>
        <div class="card-number">0${members.indexOf(member) + 1} / 0${members.length}</div>
    `;
}


// ── Build All 5 Cards ─────────────────────────────────────────────────────────
// Clears the track and rebuilds all 5 visible cards from scratch.
// Called once on load, and again after every slide transition completes,
// so the DOM always reflects the correct current state cleanly.
// Offsets [-2, -1, 0, 1, 2] map to [far-left, left, center, right, far-right].
function buildCards() {
    track.innerHTML = '';
    [-2, -1, 0, 1, 2].forEach((offset, pi) => {
        const m = members[idx(offset)];
        const card = document.createElement('div');
        card.className = `member-card ${POSITIONS[pi]}`;
        card.innerHTML = makeCardHTML(m, POSITIONS[pi]);
        track.appendChild(card);
    });
}


// ── Update Name & Dots ────────────────────────────────────────────────────────
// Fades the member name out, swaps the text, then fades it back in.
// Also moves the 'active' class to the dot matching the current index.
function updateInfo() {
    memberName.style.opacity = '0';
    setTimeout(() => {
        memberName.textContent = members[current].name;
        memberName.style.opacity = '1';
    }, 200); // 200ms delay matches the CSS fade-out duration

    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
    });
}


// ── Slide Animation ───────────────────────────────────────────────────────────
// Core function that animates the carousel left or right by one step.
// Steps:
//   1. Update 'current' index based on direction.
//   2. Create a new card just off-screen on the incoming side.
//   3. Force a reflow so the browser registers the card before transitioning.
//   4. Shift all existing cards one position in the direction of travel.
//      Cards that fall off the visible range are pushed further off-screen.
//   5. Move the new card into the second-from-edge position.
//   6. After 450ms (CSS transition duration), rebuild the DOM cleanly.
function slide(dir) {
    if (animating) return; // block input during transition
    animating = true;

    // Step 1: Advance the current index
    if (dir === 'next') current = (current + 1) % members.length;
    else current = (current - 1 + members.length) % members.length;

    const cards = Array.from(track.querySelectorAll('.member-card'));

    // Step 2: Create incoming card, placed off-screen on the correct side
    const incomingOffset = dir === 'next' ? 2 : -2;
    const newMember = members[idx(incomingOffset)];
    const startPos = dir === 'next' ? 'pos-far-right' : 'pos-far-left';
    const newCard = document.createElement('div');
    newCard.className = `member-card ${startPos}`;
    newCard.innerHTML = makeCardHTML(newMember, startPos);
    track.appendChild(newCard);

    // Step 3: Force reflow — without this, the transition won't fire
    newCard.getBoundingClientRect();

    // Step 4: Shift all existing cards one step in the slide direction
    cards.forEach(card => {
        const curPos = POSITIONS.indexOf(Array.from(card.classList).find(c => c.startsWith('pos-')));
        card.classList.remove(POSITIONS[curPos]);
        const newPos = dir === 'next' ? curPos - 1 : curPos + 1;

        if (newPos < 0 || newPos >= POSITIONS.length) {
            // Card is leaving the visible range — push it further off-screen
            card.style.opacity = '0';
            card.style.transform = dir === 'next' ? 'translateX(-620px)' : 'translateX(620px)';
            card.style.width = '120px';
            card.style.height = '140px';
        } else {
            card.classList.add(POSITIONS[newPos]);
        }
    });

    // Step 5: Slide new card into the second-from-edge position
    newCard.classList.remove(startPos);
    newCard.classList.add(dir === 'next' ? 'pos-right' : 'pos-left');

    updateInfo();

    // Step 6: After animation completes, rebuild cleanly and re-enable input
    setTimeout(() => {
        buildCards();
        animating = false;
    }, 450);
}


// ── Go To Specific Member ─────────────────────────────────────────────────────
// Lets dot clicks jump to any member directly by sliding one step at a time
// until 'current' reaches the target index. Uses a 460ms interval between steps
// to wait for each slide animation to finish before starting the next.
function goTo(target) {
    if (target === current || animating) return;
    const dir = target > current ? 'next' : 'prev';
    function step() {
        if (current === target) return;
        slide(dir);
        setTimeout(step, 460); // slightly longer than slide's 450ms to avoid overlap
    }
    step();
}


// ── Button & Keyboard Controls ────────────────────────────────────────────────
// Next/Prev arrow buttons trigger the slide function.
// Arrow keys on the keyboard do the same for accessibility.
document.getElementById('nextBtn').addEventListener('click', () => slide('next'));
document.getElementById('prevBtn').addEventListener('click', () => slide('prev'));

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') slide('next');
    if (e.key === 'ArrowLeft')  slide('prev');
});


// ── Initialise ────────────────────────────────────────────────────────────────
// Build the carousel and set the name text when the page first loads.
buildCards();
updateInfo();