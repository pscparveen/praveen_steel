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
    scrollProgress.style.width = `${scrollPercent}%`;
    navbar.classList.toggle('navbar-scrolled', scrollTop > 20);
    backToTop.classList.toggle('show', scrollTop > 260);
};

const setActiveNav = () => {
    let currentId = '';
    sections.forEach((section) => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
            currentId = section.getAttribute('id');
        }
    });
    navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${currentId}`;
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

revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
    revealObserver.observe(item);
});

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

metricValues.forEach((counter) => metricObserver.observe(counter));

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

inquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const requirement = document.getElementById('customerRequirement').value.trim();
    const message = document.getElementById('customerMessage').value.trim();
    const subject = encodeURIComponent(`Inquiry from ${name || 'Website Visitor'}`);
    const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nRequirement: ${requirement}\nMessage: ${message}`
    );
    window.location.href = `mailto:praveensteel@gmail.com?subject=${subject}&body=${body}`;
});

document.addEventListener('scroll', () => {
    updateScrollState();
    setActiveNav();
});

updateScrollState();
setActiveNav();
