const navbar = document.getElementById('mainNavbar');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar .nav-link');
const revealItems = document.querySelectorAll('.reveal');
const metricValues = document.querySelectorAll('.metric-value');
const inquiryForm = document.getElementById('inquiryForm');

const updateScrollState = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (scrollProgress) scrollProgress.style.width = `${scrollPercent}%`;
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

const animateCounter = (element) => {
    const target = Number(element.getAttribute('data-count')) || 0;
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(eased * target);
        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    };
    requestAnimationFrame(tick);
};

const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            metricObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (metricValues.length > 0) {
    metricValues.forEach((counter) => metricObserver.observe(counter));
}

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

if (inquiryForm) {
    inquiryForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const nameField = document.getElementById('customerName');
        const emailField = document.getElementById('customerEmail');
        const reqField = document.getElementById('customerRequirement');
        const msgField = document.getElementById('customerMessage');

        const name = nameField ? nameField.value.trim() : '';
        const email = emailField ? emailField.value.trim() : '';
        const requirement = reqField ? reqField.value.trim() : '';
        const message = msgField ? msgField.value.trim() : '';

        const subject = encodeURIComponent(`Inquiry from ${name || 'Website Visitor'}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\nRequirement: ${requirement}\nMessage: ${message}`
        );
        window.location.href = `mailto:praveensteel@gmail.com?subject=${subject}&body=${body}`;
    });
}


document.addEventListener('scroll', () => {
    updateScrollState();
    setActiveNav();
});

// Cookie Consent Banner Logic
const initConsentBanner = () => {
    const cookieConsentKey = 'ps_cookie_consent';
    const isTechnicalPage = window.location.pathname.includes('technicals');
    const privacyPath = isTechnicalPage ? '../privacy.html' : 'privacy.html';

    if (localStorage.getItem(cookieConsentKey)) return;

    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-content">
            <h4><i class="fas fa-cookie-bite me-2" aria-hidden="true"></i>We Value Your Privacy</h4>
            <p>We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. <a href="${privacyPath}">Read our Privacy Policy</a></p>
        </div>
        <div class="cookie-actions">
            <button class="cookie-btn cookie-btn-decline" id="declineCookies">Decline</button>
            <a href="${privacyPath}" class="cookie-btn cookie-btn-settings">View Policy</a>
            <button class="cookie-btn cookie-btn-accept" id="acceptCookies">Accept All</button>
        </div>
    `;

    document.body.appendChild(banner);

    // Trigger show class with slight delay for animation
    setTimeout(() => banner.classList.add('show'), 800);

    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');

    const hideBanner = () => {
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 500);
    };

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem(cookieConsentKey, 'accepted');
            hideBanner();
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem(cookieConsentKey, 'declined');
            hideBanner();
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsentBanner);
} else {
    initConsentBanner();
}

updateScrollState();
setActiveNav();

// Material Design 3 - Initialize ripple effects
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
