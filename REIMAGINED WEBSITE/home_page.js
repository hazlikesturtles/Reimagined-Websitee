// Interactive functionality for the homepage
document.addEventListener('DOMContentLoaded', function() {
    // Play Now buttons
    const playButtons = document.querySelectorAll('.play-now-button, .play-now-white');
    playButtons.forEach(button => {
        button.addEventListener('click', () => alert('Launching game...'));
    });

    // View Characters button
    document.querySelector('.view-characters-button')?.addEventListener('click', () => {
        window.location.href = 'characters_page.html';
    });

    // Social media icons
    document.querySelector('.social-instagram')?.addEventListener('click', () => {
        window.open('https://instagram.com', '_blank');
    });
    
    document.querySelector('.social-facebook')?.addEventListener('click', () => {
        window.open('https://facebook.com', '_blank');
    });
    
    document.querySelector('.social-github')?.addEventListener('click', () => {
        window.open('https://github.com', '_blank');
    });
});