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

const POSITIONS = ['pos-far-left', 'pos-left', 'pos-center', 'pos-right', 'pos-far-right'];

let current = 0;
let animating = false;

const track      = document.getElementById('slidesTrack');
const memberName = document.getElementById('memberName');
const dotsRow    = document.getElementById('dotsRow');

// Build dots
members.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsRow.appendChild(dot);
});

function idx(offset) {
    return (current + offset + members.length * 100) % members.length;
}

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
            ${posClass === 'pos-center' && member.page ? `<div class="card-view-btn" onclick="window.location.href='${member.page}'">VIEW PROFILE →</div>` : ''}
        </div>
        <div class="card-number">0${members.indexOf(member) + 1} / 0${members.length}</div>
    `;
}

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

function updateInfo() {
    memberName.style.opacity = '0';
    setTimeout(() => {
        memberName.textContent = members[current].name;
        memberName.style.opacity = '1';
    }, 200);

    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
    });
}

function slide(dir) {
    if (animating) return;
    animating = true;

    if (dir === 'next') current = (current + 1) % members.length;
    else current = (current - 1 + members.length) % members.length;

    const cards = Array.from(track.querySelectorAll('.member-card'));

    // Add incoming card off-screen
    const incomingOffset = dir === 'next' ? 2 : -2;
    const newMember = members[idx(incomingOffset)];
    const startPos = dir === 'next' ? 'pos-far-right' : 'pos-far-left';
    const newCard = document.createElement('div');
    newCard.className = `member-card ${startPos}`;
    newCard.innerHTML = makeCardHTML(newMember, startPos);
    track.appendChild(newCard);

    // Force reflow
    newCard.getBoundingClientRect();

    // Shift existing cards
    cards.forEach(card => {
        const curPos = POSITIONS.indexOf(Array.from(card.classList).find(c => c.startsWith('pos-')));
        card.classList.remove(POSITIONS[curPos]);
        const newPos = dir === 'next' ? curPos - 1 : curPos + 1;
        if (newPos < 0 || newPos >= POSITIONS.length) {
            card.style.opacity = '0';
            card.style.transform = dir === 'next' ? 'translateX(-620px)' : 'translateX(620px)';
            card.style.width = '120px';
            card.style.height = '140px';
        } else {
            card.classList.add(POSITIONS[newPos]);
        }
    });

    // Bring new card into proper position
    newCard.classList.remove(startPos);
    newCard.classList.add(dir === 'next' ? 'pos-right' : 'pos-left');

    updateInfo();

    setTimeout(() => {
        buildCards();
        animating = false;
    }, 450);
}

function goTo(target) {
    if (target === current || animating) return;
    const dir = target > current ? 'next' : 'prev';
    function step() {
        if (current === target) return;
        slide(dir);
        setTimeout(step, 460);
    }
    step();
}

document.getElementById('nextBtn').addEventListener('click', () => slide('next'));
document.getElementById('prevBtn').addEventListener('click', () => slide('prev'));

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') slide('next');
    if (e.key === 'ArrowLeft')  slide('prev');
});

buildCards();
updateInfo();