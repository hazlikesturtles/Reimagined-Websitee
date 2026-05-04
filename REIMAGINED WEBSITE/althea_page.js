document.addEventListener('DOMContentLoaded', function () {

    // ── ENTRANCE ANIMATIONS ──
    const motto   = document.querySelector('.hero-motto');
    const bio     = document.querySelector('.hero-bio');
    const tags    = document.querySelector('.skills-tags');
    const photo   = document.querySelector('.photo-circle');
    const backBtn = document.querySelector('.back-btn');

    [motto, bio, tags, backBtn].forEach(el => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(28px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
    });

    if (photo) {
        photo.style.opacity = '0';
        photo.style.transform = 'scale(0.88)';
        photo.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    }

    // Staggered reveal
    setTimeout(() => { if (backBtn) { backBtn.style.opacity = '1'; backBtn.style.transform = 'translateY(0)'; } }, 100);
    setTimeout(() => { if (motto)   { motto.style.opacity   = '1'; motto.style.transform   = 'translateY(0)'; } }, 250);
    setTimeout(() => { if (photo)   { photo.style.opacity   = '1'; photo.style.transform   = 'scale(1)';      } }, 350);
    setTimeout(() => { if (bio)     { bio.style.opacity     = '1'; bio.style.transform     = 'translateY(0)'; } }, 450);
    setTimeout(() => { if (tags)    { tags.style.opacity    = '1'; tags.style.transform    = 'translateY(0)'; } }, 580);

    // ── BACK BUTTON ──
    document.getElementById('backBtn').addEventListener('click', function () {
        window.location.href = 'about_page.html';
    });

});
