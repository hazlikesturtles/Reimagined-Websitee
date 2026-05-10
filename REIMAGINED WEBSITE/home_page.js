// =============================================================================
//  home_page.js — Home Page Interactions
//  REIMAGINED | Filipino Street Games — Website
// =============================================================================
//  This file handles all the interactive buttons on the homepage:
//  - Play Now buttons that launch the game
//  - View Characters button that navigates to the characters page
//  - Social media icon links that open in a new tab
// =============================================================================


// ── Wait for the DOM to fully load ───────────────────────────────────────────
// Everything is wrapped in DOMContentLoaded so JavaScript only runs
// after all the HTML elements exist on the page. Without this, the
// querySelector calls below would return null and throw errors.
document.addEventListener('DOMContentLoaded', function() {

    // ── Sticky Header — hide on scroll up, show on scroll down ───────────────
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY < lastScrollY) {
            // Scrolling UP — hide header
            header.classList.add('hidden');
        } else {
            // Scrolling DOWN — show header
            header.classList.remove('hidden');
        }

        // Darken background once past hero
        if (currentScrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });

    // ── Play Now Buttons ──────────────────────────────────────────────────────
    // Selects ALL elements with either class 'play-now-button' or 'play-now-white'.
    // There are two Play Now buttons on the homepage (hero section + footer CTA),
    // so querySelectorAll grabs both at once and applies the same click listener.
    const playButtons = document.querySelectorAll('.play-now-button, .play-now-white');
    playButtons.forEach(button => {
        button.addEventListener('click', () => alert('Launching game...'));
        // TODO: Replace alert with actual game launch logic (e.g., open game window)
    });

    // ── View Characters Button ────────────────────────────────────────────────
    // The '?' after querySelector is optional chaining — it safely does nothing
    // if the element doesn't exist on the page, preventing a crash.
    // Clicking this navigates the user to the Characters page.
    document.querySelector('.view-characters-button')?.addEventListener('click', () => {
        window.location.href = 'characters_page.html';
    });

    // ── Social Media Icons ────────────────────────────────────────────────────
    // Each icon opens its respective platform in a new browser tab.
    // '_blank' as the second argument to window.open() means "open in new tab".
    // Optional chaining (?.) is used again so missing icons don't break anything.

    document.querySelector('.social-instagram')?.addEventListener('click', () => {
        window.open('https://instagram.com', '_blank');
    });
    
    document.querySelector('.social-facebook')?.addEventListener('click', () => {
        window.open('https://facebook.com', '_blank');
    });
    
    document.querySelector('.social-github')?.addEventListener('click', () => {
        window.open('https://github.com', '_blank');
    });

}); // end DOMContentLoaded