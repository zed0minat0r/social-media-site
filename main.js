// Dark mode
function toggleTheme() {
    var body = document.body;
    var btn = document.querySelector('.theme-toggle');
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        btn.innerHTML = '&#x2600;&#xFE0F;';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        btn.innerHTML = '&#x1F319;';
        localStorage.setItem('theme', 'dark');
    }
}
(function() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.querySelector('.theme-toggle').innerHTML = '&#x1F319;';
    }
})();

// Scroll animations
var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .portfolio-item, .testimonial, .stat').forEach(function(el) {
    el.style.opacity = '0';
    observer.observe(el);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href.length <= 1) return; // skip bare "#" links
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Typewriter effect
(function() {
    var words = ['Drives Results', 'Builds Brands', 'Goes Viral', 'Converts Clicks', 'Tells Stories', 'Breaks Records'];
    var el = document.getElementById('typewriter');
    var wordIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var speed = 100;

    function type() {
        var current = words[wordIndex];
        if (deleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            speed = 50;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            speed = 100;
        }
        if (!deleting && charIndex === current.length) {
            speed = 2000;
            deleting = true;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 400;
        }
        setTimeout(type, speed);
    }
    type();
})();

// Animated counters
var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            var nums = entry.target.querySelectorAll('.stat-number');
            nums.forEach(function(num) {
                var text = num.textContent;
                var match = text.match(/(\d+)/);
                if (!match) return;
                var target = parseInt(match[1]);
                var suffix = text.replace(match[1], '');
                var duration = 1500;
                var start = performance.now();
                num.textContent = '0' + suffix;
                function tick(now) {
                    var elapsed = now - start;
                    var progress = Math.min(elapsed / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    num.textContent = Math.floor(target * eased) + suffix;
                    if (progress < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
var statsBar = document.querySelector('.stats-bar');
if (statsBar) counterObserver.observe(statsBar);

// Hamburger menu
function toggleMenu() {
    document.querySelector('.hamburger').classList.toggle('open');
    document.getElementById('mobileNav').classList.toggle('open');
}
function closeMenu() {
    document.querySelector('.hamburger').classList.remove('open');
    document.getElementById('mobileNav').classList.remove('open');
}

// Unified scroll handler (sticky CTA + back-to-top + progress bar)
var stickyCta = document.getElementById('stickyCta');
var backToTop = document.getElementById('backToTop');
var scrollProgress = document.getElementById('scrollProgress');
var heroHeight = document.querySelector('.hero').offsetHeight;
var contactSection = document.getElementById('contact');
window.addEventListener('scroll', function() {
    var scrollY = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    // Progress bar
    scrollProgress.style.width = (scrollY / docHeight) * 100 + '%';
    // Back-to-top
    if (scrollY > 600) { backToTop.classList.add('visible'); }
    else { backToTop.classList.remove('visible'); }
    // Sticky CTA
    var contactTop = contactSection.getBoundingClientRect().top + scrollY;
    if (scrollY > heroHeight && scrollY < contactTop - window.innerHeight) {
        stickyCta.classList.add('visible');
    } else {
        stickyCta.classList.remove('visible');
    }
});

// Blog card clicks
document.querySelectorAll('.blog-card').forEach(function(card) {
    card.addEventListener('click', function() {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
});

// FAQ accordion — keyboard accessible
document.querySelectorAll('.faq-question').forEach(function(q) {
    q.setAttribute('tabindex', '0');
    q.setAttribute('role', 'button');
    q.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFaq(this);
        }
    });
});
function toggleFaq(el) {
    var item = el.parentElement;
    var answer = item.querySelector('.faq-answer');
    var isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(function(i) {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = null;
    });
    // Open clicked if it was closed
    if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
    }
}

// Contact form
function handleSubmit(e) {
    e.preventDefault();
    var btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Sent!';
    btn.style.background = '#06d6a0';
    setTimeout(function() {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        e.target.reset();
    }, 2000);
}

// Section dots navigator
(function() {
    var sections = document.querySelectorAll('.section[id]');
    var dotsNav = document.getElementById('sectionDots');
    if (!dotsNav || !sections.length) return;
    sections.forEach(function(sec) {
        var dot = document.createElement('button');
        dot.className = 'section-dot';
        dot.setAttribute('aria-label', sec.id);
        dot.addEventListener('click', function() {
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        dotsNav.appendChild(dot);
    });
    var dots = dotsNav.querySelectorAll('.section-dot');
    var dotsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var idx = Array.from(sections).indexOf(entry.target);
                dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
            }
        });
    }, { threshold: 0.3 });
    sections.forEach(function(sec) { dotsObserver.observe(sec); });
})();
