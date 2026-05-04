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

const POSITIONS = ['pos-far-left', 'pos-left', 'pos-center', 'pos-right', 'pos-far-right'];

let current = 0;
let animating = false;

const track    = document.getElementById('slidesTrack');
const mapName  = document.getElementById('mapName');
const mapDesc  = document.getElementById('mapDesc');
const dotsRow  = document.getElementById('dotsRow');

// Build dots
maps.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsRow.appendChild(dot);
});

function idx(offset) {
    return (current + offset + maps.length * 100) % maps.length;
}

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

function updateInfo() {
    // Name
    mapName.style.opacity = '0';
    setTimeout(() => {
        mapName.textContent = maps[current].name;
        mapName.style.opacity = '1';
    }, 200);

    // Description
    mapDesc.style.opacity = '0';
    setTimeout(() => {
        mapDesc.querySelector('p').textContent = maps[current].desc;
        mapDesc.style.opacity = '1';
    }, 200);

    // Dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
    });
}

function slide(dir) {
    if (animating) return;
    animating = true;

    if (dir === 'next') current = (current + 1) % maps.length;
    else current = (current - 1 + maps.length) % maps.length;

    const cards = Array.from(track.querySelectorAll('.map-card'));

    // Add incoming card off-screen
    const incomingOffset = dir === 'next' ? 2 : -2;
    const newMap = maps[idx(incomingOffset)];
    const newCard = document.createElement('div');
    const startPos = dir === 'next' ? 'pos-far-right' : 'pos-far-left';
    newCard.className = `map-card ${startPos}`;
    newCard.innerHTML = `<img src="${newMap.image}" alt="${newMap.name}">`;
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
            card.style.transform = dir === 'next' ? 'translateX(-600px)' : 'translateX(600px)';
            card.style.width = '120px';
            card.style.height = '140px';
        } else {
            card.classList.add(POSITIONS[newPos]);
        }
    });

    // Move new card into view
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
    // Step one at a time until we reach target
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