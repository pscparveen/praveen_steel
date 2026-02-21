const navbar = document.getElementById('mainNavbar');
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar .nav-link');
const revealItems = document.querySelectorAll('.reveal');

const updateScrollState = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    if (navbar) navbar.classList.toggle('navbar-scrolled', scrollTop > 20);
    if (backToTop) backToTop.classList.toggle('show', scrollTop > 260);
};

const setActiveNav = () => {
    let currentId = '';
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    sections.forEach((section) => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
            currentId = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        let isActive = false;

        if (href.includes('#')) {
            const [path, hash] = href.split('#');
            const targetPath = path || 'index.html';
            // Match path and hash
            isActive = (targetPath === currentPath || (targetPath === 'index.html' && currentPath === '')) && currentId === hash;
        } else {
            // Direct page link (like calculator.html)
            isActive = href === currentPath;
        }

        link.classList.toggle('active', isActive);
    });
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

if (revealItems.length > 0) {
    revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
        revealObserver.observe(item);
    });
}

updateScrollState();
setActiveNav();
if (typeof mdc !== 'undefined') {
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.btn-outline-custom'));
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.btn-primary-custom'));

    // Add ripple effect to all buttons
    document.querySelectorAll('.btn, button, .nav-link').forEach((el) => {
        if (!el.classList.contains('mdc-button')) {
            new mdc.ripple.MDCRipple(el);
        }
    });
}
