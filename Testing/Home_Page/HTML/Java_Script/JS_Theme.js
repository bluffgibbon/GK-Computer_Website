//* Theme toggle functionality for the website. This allows
// users to switch between light and dark themes by clicking
// the respective buttons in the top banner.
//
// Uses event delegation on document so it works even though
// the top banner is injected asynchronously by JS_Loader.js. //

function setTheme(theme) {
    document.body.classList.toggle('dark',  theme === 'dark');
    document.body.classList.toggle('light', theme === 'light');

    // Update active state on buttons if they exist yet
    var btnDark  = document.querySelector('.Theme--dark');
    var btnLight = document.querySelector('.Theme--light');
    if (btnDark)  btnDark.classList.toggle('active',  theme === 'dark');
    if (btnLight) btnLight.classList.toggle('active', theme === 'light');

    localStorage.setItem('theme', theme);
}

// Event delegation — works regardless of when buttons are injected
document.addEventListener('click', function (e) {
    if (e.target.matches('.Theme--dark'))  setTheme('dark');
    if (e.target.matches('.Theme--light')) setTheme('light');
});

// Restore saved preference on page load
var saved = localStorage.getItem('theme');
if (saved) {
    // Buttons may not exist yet at this point — setTheme handles that gracefully
    setTheme(saved);
}
