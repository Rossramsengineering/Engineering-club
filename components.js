// components.js
// Small helper to render/enhance common components (header/footer) and add accessibility helpers

(function () {
    'use strict';

    function setActiveNav(linkHref) {
        const links = document.querySelectorAll('.navigation .nav-link');
        links.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === linkHref);
            if (a.classList.contains('active')) {
                a.setAttribute('aria-current', 'page');
            } else {
                a.removeAttribute('aria-current');
            }
        });
    }

    // Enhance header: add role, keyboard handling for theme toggle, ensure nav has aria-label
    function enhanceHeader() {
        const header = document.querySelector('header.header');
        if (!header) return;

        // Hide navigation links and only show page title + logo
        const logoSpan = header.querySelector('.logo span');
        const nav = header.querySelector('.navigation');

        // Hide old nav links
        const navLinks = header.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.style.display = 'none');

        // Hide hamburger menu on desktop (only show on mobile)
        const menuBtn = header.querySelector('#menu-button');
        if (menuBtn) menuBtn.style.display = 'none';

        // Create page title element if it doesn't exist
        if (!header.querySelector('.page-title')) {
            const pageTitle = document.createElement('div');
            pageTitle.className = 'page-title';

            // Map page filenames to display names
            const pageNames = {
                'index.html': 'Home',
                'store.html': 'Store',
                'members.html': 'Members',
                'activities.html': 'Activities',
                'tsa.html': 'TSA',
                'contact.html': 'Contact',
                'order.html': 'Order',
            };

            // Add product pages
            const productPages = ['led.html', 'octopus.html', 'choppingboard.html', 'fidgetBall.html', 'custom3dPrint.html', 'customOrnament.html', 'christmasTree.html', 'snowflake.html'];
            productPages.forEach(page => {
                pageNames[page] = 'Product';
            });

            const path = window.location.pathname.split('/').pop() || 'index.html';
            const pageName = pageNames[path] || 'Engineering Club';
            pageTitle.textContent = pageName;

            // Insert after logo
            header.insertBefore(pageTitle, logoSpan.nextSibling);
        }

        if (nav) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Main navigation');
        }

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('role', 'button');
            themeToggle.setAttribute('aria-pressed', themeToggle.getAttribute('aria-pressed') || 'false');
            // keyboard accessibility
            themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    themeToggle.click();
                }
            });
        }

        // Add skip link for keyboard users if missing
        if (!document.getElementById('skip-link')) {
            const skip = document.createElement('a');
            skip.href = '#main-content';
            skip.id = 'skip-link';
            skip.className = 'skip-link';
            skip.textContent = 'Skip to content';
            document.body.appendChild(skip);
        }

        // If there's no main landmark, set one
        const main = document.querySelector('main.content');
        if (main) main.id = main.id || 'main-content';
    }

    // Set up keyboard-visible focus outlines and ensure interactive elements have tabindex
    function accessibilityEnhancements() {
        // Ensure material-checkbox inputs are keyboard focusable
        const checkboxes = document.querySelectorAll('input.material-checkbox');
        checkboxes.forEach(cb => {
            if (!cb.hasAttribute('tabindex')) cb.setAttribute('tabindex', '0');
            cb.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    cb.checked = !cb.checked;
                    cb.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        });

        // Add focus-visible polyfill style class behavior for browsers without :focus-visible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') document.body.classList.add('using-keyboard');
        });
        document.addEventListener('mousedown', () => document.body.classList.remove('using-keyboard'));
    }

    // Navigation Rail Functionality - Desktop/Large screens
    function initializeRail() {
        // Check if rail already exists
        if (document.getElementById('nav-rail')) return;

        // Create rail markup
        const rail = document.createElement('aside');
        rail.id = 'nav-rail';
        rail.className = 'nav-rail';
        rail.setAttribute('role', 'navigation');
        rail.setAttribute('aria-label', 'Navigation rail');

        // Build rail content
        let railContent = '<div class="rail-container">';

        // Top section with logo
        railContent += '<div class="rail-top">';

        railContent += '<div class="rail-logo">';
        // Add both logos for swappable UI
        // !! IMPORTANT: Update these src paths to your logo files !!
        railContent += '<img src="Images/EngineeringClub-White.png" alt="Logo" class="rail-logo-regular">';
        railContent += '<img src="Images/EngineeringClubFull-White.png" alt="Engineering Club" class="rail-logo-full">';
        railContent += '</div>';

        // Expand button
        railContent += '<button class="rail-expand-btn" id="rail-expand-btn" aria-label="Expand navigation" title="Expand navigation">';
        railContent += '<span class="material-symbols-outlined">menu</span>';
        railContent += '<span class="rail-destination-label">Menu</span>'; // railContent += '</button>';
        railContent += '</div>';

        railContent += '<div class="rail-divider"></div>';

        // Destinations
        railContent += '<div class="rail-destinations">';

        // Define all 6 destinations
        const destinations = [
            { href: 'index.html', icon: 'home', label: 'Home' },
            { href: 'store.html', icon: 'store', label: 'Store' },
            { href: 'members.html', icon: 'people', label: 'Members' },
            { href: 'activities.html', icon: 'event', label: 'Activities' },
            { href: 'tsa.html', icon: 'trophy', label: 'TSA' },
            { href: 'contact.html', icon: 'mail', label: 'Contact' }
        ];

        destinations.forEach(dest => {
            railContent += `<a href="${dest.href}" class="rail-destination" title="${dest.label}" aria-label="${dest.label}">`;
            railContent += `<span class="material-symbols-outlined">${dest.icon}</span>`;
            railContent += `<span class="rail-destination-label">${dest.label}</span>`;
            railContent += '</a>';
        });

        railContent += '</div>';
        railContent += '<div class="rail-divider"></div>';
        railContent += '<button class="rail-theme-toggle" id="theme-toggle" title="Toggle theme" aria-label="Toggle color theme">';
        railContent += '<span class="material-symbols-outlined">dark_mode</span>';
        railContent += '<span class="rail-destination-label">Theme</span>'; // railContent += '</button>';

        railContent += '</div>';
        rail.innerHTML = railContent;

        document.body.insertBefore(rail, document.body.firstChild);

        // Expand/collapse functionality
        const expandBtn = document.getElementById('rail-expand-btn');
        if (expandBtn) {
            expandBtn.addEventListener('click', () => {
                rail.classList.toggle('expanded');
                const isExpanded = rail.classList.contains('expanded');
                expandBtn.setAttribute('aria-label', isExpanded ? 'Collapse navigation' : 'Expand navigation');
                expandBtn.title = isExpanded ? 'Collapse navigation' : 'Expand navigation';

                // NEW (4/4): Update both icon and text label
                const icon = expandBtn.querySelector('.material-symbols-outlined');
                const label = expandBtn.querySelector('.rail-destination-label');
                if (icon) {
                    icon.textContent = isExpanded ? 'menu_open' : 'menu';
                }
                if (label) {
                    label.textContent = isExpanded ? 'Collapse' : 'Menu';
                }
                // End NEW

                // Save expanded state to localStorage
                localStorage.setItem('rail-expanded', isExpanded);
            });

            // Restore expanded state from localStorage
            const wasExpanded = localStorage.getItem('rail-expanded') === 'true';
            if (wasExpanded) {
                rail.classList.add('expanded');
                expandBtn.setAttribute('aria-label', 'Collapse navigation');
                expandBtn.title = 'Collapse navigation';
                expandBtn.querySelector('.material-symbols-outlined').textContent = 'menu_open';

                // NEW: Also update label on load
                expandBtn.querySelector('.rail-destination-label').textContent = 'Collapse';
            }
        }

        // Update rail active state
        updateRailActive();
    }

    // Update rail active destination
    function updateRailActive() {
        const rail = document.getElementById('nav-rail');
        if (!rail) return;

        const path = window.location.pathname.split('/').pop();
        const fname = path === '' ? 'index.html' : path;

        const destinations = rail.querySelectorAll('.rail-destination');
        destinations.forEach(dest => {
            const href = dest.getAttribute('href');
            dest.classList.toggle('active', href === fname);
        });
    }

    // Navigation Drawer Functionality - Mobile
    function initializeDrawer() {
        const header = document.querySelector('header.header');
        if (!header) return;

        // Check if drawer already exists
        if (document.getElementById('nav-drawer')) return;

        // Create drawer markup
        const drawer = document.createElement('div');
        drawer.id = 'nav-drawer';
        drawer.className = 'nav-drawer';
        drawer.setAttribute('role', 'navigation');
        drawer.setAttribute('aria-label', 'Mobile navigation');

        // Define all 6 destinations
        const destinations = [
            { href: 'index.html', label: 'Home' },
            { href: 'store.html', label: 'Store' },
            { href: 'members.html', label: 'Members' },
            { href: 'activities.html', label: 'Activities' },
            { href: 'tsa.html', label: 'TSA' },
            { href: 'contact.html', label: 'Contact' }
        ];

        // Build drawer content
        let drawerContent = '<div class="drawer-header">';
        drawerContent += '<button id="drawer-close" class="drawer-close" aria-label="Close navigation menu">';
        drawerContent += '<span class="material-symbols-outlined">close</span>';
        drawerContent += '</button>';
        drawerContent += '</div>';
        drawerContent += '<div class="drawer-content">';
        drawerContent += '<nav class="drawer-nav">';

        destinations.forEach(dest => {
            drawerContent += `<a href="${dest.href}" class="drawer-nav-link">${dest.label}</a>`;
        });

        drawerContent += '</nav>';
        drawerContent += '</div>';
        drawer.innerHTML = drawerContent;

        document.body.appendChild(drawer);

        // Create backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'drawer-backdrop';
        backdrop.className = 'drawer-backdrop';
        document.body.appendChild(backdrop);

        // Add hamburger menu button to header if not exists
        const themeToggle = header.querySelector('#theme-toggle');
        if (themeToggle && !header.querySelector('#menu-button')) {
            const menuBtn = document.createElement('button');
            menuBtn.id = 'menu-button';
            menuBtn.className = 'menu-button';
            menuBtn.setAttribute('aria-label', 'Open navigation menu');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.innerHTML = '<span class="material-symbols-outlined">menu</span>';
            header.querySelector('.navigation').insertBefore(menuBtn, themeToggle);
        }

        // Drawer event handlers
        const menuButton = document.getElementById('menu-button');
        const drawerClose = document.getElementById('drawer-close');
        const drawerBackdrop = document.getElementById('drawer-backdrop');
        const drawerElement = document.getElementById('nav-drawer');
        const drawerLinks = drawerElement.querySelectorAll('.drawer-nav-link');

        function openDrawer() {
            drawerElement.classList.add('open');
            drawerBackdrop.classList.add('open');
            menuButton.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeDrawer() {
            drawerElement.classList.remove('open');
            drawerBackdrop.classList.remove('open');
            menuButton.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        if (menuButton) {
            menuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if (drawerElement.classList.contains('open')) {
                    closeDrawer();
                } else {
                    openDrawer();
                }
            });
        }

        if (drawerClose) {
            drawerClose.addEventListener('click', closeDrawer);
        }

        if (drawerBackdrop) {
            drawerBackdrop.addEventListener('click', closeDrawer);
        }

        drawerLinks.forEach(link => {
            link.addEventListener('click', closeDrawer);
        });

        // Close drawer on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawerElement.classList.contains('open')) {
                closeDrawer();
            }
        });
    }

    // Call these on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        initializeRail();
        initializeDrawer();
        enhanceHeader();
        accessibilityEnhancements();

        // Auto-detect current page and set active nav
        const path = window.location.pathname.split('/').pop();
        const fname = path === '' ? 'index.html' : path;
        setActiveNav(fname);
        updateRailActive();
    });

    // Expose helper for other scripts
    window.ROSS_components = {
        setActiveNav,
        enhanceHeader,
        initializeRail,
        initializeDrawer,
        updateRailActive,
    };
})();