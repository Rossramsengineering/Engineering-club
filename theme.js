// Wait for the page to load before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get the button, icon, and body elements
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const body = document.body;

    // Function to apply the chosen theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            // show the light icon to indicate action (switch to light)
            if (themeToggleIcon) themeToggleIcon.textContent = 'light_mode';
            themeToggle.setAttribute('aria-pressed', 'true');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            // show the dark icon to indicate action (switch to dark)
            if (themeToggleIcon) themeToggleIcon.textContent = 'dark_mode';
            themeToggle.setAttribute('aria-pressed', 'false');
            localStorage.setItem('theme', 'light');
        }
    }

    // Function to toggle the theme
    function toggleTheme() {
        if (body.classList.contains('dark-mode')) {
            applyTheme('light');
        } else {
            applyTheme('dark');
        }
    }

    // Function to set the initial theme on page load
    function setInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            applyTheme(savedTheme);
        } else if (prefersDark) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }

    // Add the click listener to the button
    themeToggle.addEventListener('click', toggleTheme);

    // Run the initial theme setup
    setInitialTheme();

});