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

// ============================================================
// SCROLL-DRIVEN ANIMATION ENGINE
// Single rAF loop. Only transforms + opacity (GPU-composited).
// ============================================================

var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Split headings into word spans ---
function splitHeadings() {
    document.querySelectorAll('.split-heading').forEach(function(el) {
        var text = el.textContent.trim();
        var words = text.split(/\s+/);
        el.textContent = '';
        words.forEach(function(w, i) {
            var span = document.createElement('span');
            span.className = 'word';
            span.textContent = w;
            if (i < words.length - 1) {
                span.style.marginRight = '0.28em';
            }
            el.appendChild(span);
        });
    });
}
splitHeadings();

// Mark initial states for service cards + testimonials
document.querySelectorAll('.service-card').forEach(function(el) {
    el.classList.add('sd-hidden');
});
document.querySelectorAll('.testimonial').forEach(function(el) {
    el.classList.add('sd-hidden');
});

// --- Scroll state ---
var scrollY = 0;
var lastScrollY = 0;
var scrollVelocity = 0;
var rafPending = false;

// --- Cache DOM refs ---
var heroSection = document.getElementById('heroSection');
var heroContent = document.getElementById('heroContent');
var particlesEl = document.querySelector('.particles');
var statsBar = document.querySelector('.stats-bar');
var serviceCards = document.querySelectorAll('.service-card');
var portfolioItems = document.querySelectorAll('.portfolio-item');
var testimonials = document.querySelectorAll('.testimonial');
var splitWords = document.querySelectorAll('.split-heading .word');
var stickyCta = document.getElementById('stickyCta');
var backToTop = document.getElementById('backToTop');
var scrollProgress = document.getElementById('scrollProgress');
var contactSection = document.getElementById('contact');
var heroHeight = heroSection ? heroSection.offsetHeight : 0;

// --- Counter state ---
var countersTriggered = false;
var counterData = [];
if (statsBar) {
    statsBar.querySelectorAll('.stat-number').forEach(function(el) {
        var text = el.textContent;
        var match = text.match(/(\d+)/);
        if (match) {
            counterData.push({ el: el, target: parseInt(match[1]), suffix: text.replace(match[1], ''), current: 0 });
            el.textContent = '0' + text.replace(match[1], '');
        }
    });
}

// --- Helper: clamp ---
function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

// --- Helper: scroll progress through element ---
// Returns 0 when bottom of viewport hits top of el, 1 when top of viewport hits bottom of el
function getScrollProgress(el, startOffset, endOffset) {
    if (!el) return 0;
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight;
    startOffset = startOffset || 0;
    endOffset = endOffset || 0;
    var start = rect.top - vh + startOffset;
    var end = rect.bottom - endOffset;
    if (end <= start) return 0;
    return clamp(-start / (end - start), 0, 1);
}

// --- Hero sticky exit ---
function animateHero() {
    if (!heroSection || !heroContent) return;
    var scrolled = scrollY;
    heroHeight = heroSection.offsetHeight;
    if (scrolled >= heroHeight) return;
    var ratio = scrolled / heroHeight;
    var scale = 1 - ratio * 0.08;
    var translateY = scrolled * 0.28;
    var opacity = 1 - ratio * 1.1;
    heroContent.style.transform = 'translateY(' + translateY + 'px) scale(' + scale + ')';
    heroContent.style.opacity = Math.max(0, opacity);
    if (particlesEl) {
        particlesEl.style.transform = 'translateY(' + (scrolled * 0.12) + 'px)';
        particlesEl.style.opacity = Math.max(0, 1 - ratio * 1.5);
    }
    // Subtle hero bg shift via brightness
    heroSection.style.filter = 'brightness(' + (1 - ratio * 0.25) + ')';
}

// --- Word-by-word heading reveal ---
function animateHeadings() {
    document.querySelectorAll('.split-heading').forEach(function(heading) {
        var rect = heading.getBoundingClientRect();
        var vh = window.innerHeight;
        // Start revealing when heading enters viewport at 85% from top
        var triggerPoint = vh * 0.85;
        var words = heading.querySelectorAll('.word');
        if (rect.top > triggerPoint) return;
        // How far past trigger (0 to 1)
        var progress = clamp((triggerPoint - rect.top) / (triggerPoint * 0.6), 0, 1);
        words.forEach(function(word, i) {
            // Each word staggered by index
            var wordProgress = clamp((progress - i * 0.12) / 0.3, 0, 1);
            if (wordProgress <= 0) return;
            var eased = 1 - Math.pow(1 - wordProgress, 3);
            var translateY = 48 * (1 - eased);
            var skewY = 4 * (1 - eased);
            word.style.opacity = eased;
            word.style.transform = 'translateY(' + translateY + 'px) skewY(' + skewY + 'deg)';
        });
    });
}

// --- Service cards 3D entrance from different angles ---
var serviceAngles = [
    { tx: -60, ty: 40, tz: -20, rx: 8, ry: -12 },
    { tx: 0,   ty: 60, tz: -20, rx: -10, ry: 0 },
    { tx: 60,  ty: 40, tz: -20, rx: 8, ry: 12 },
    { tx: -60, ty: 30, tz: -20, rx: -8, ry: -12 },
    { tx: 0,   ty: 60, tz: -20, rx: 10, ry: 0 },
    { tx: 60,  ty: 30, tz: -20, rx: -8, ry: 12 }
];

function animateServiceCards() {
    serviceCards.forEach(function(card, i) {
        var rect = card.getBoundingClientRect();
        var vh = window.innerHeight;
        var triggerStart = vh * 0.9;
        var triggerEnd = vh * 0.4;
        if (rect.top > triggerStart) return;
        // Progress: 0 = just entering, 1 = fully in
        var progress = clamp((triggerStart - rect.top) / (triggerStart - triggerEnd), 0, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var angle = serviceAngles[i] || serviceAngles[0];
        var tx = angle.tx * (1 - eased);
        var ty = angle.ty * (1 - eased);
        var tz = angle.tz * (1 - eased);
        var rx = angle.rx * (1 - eased);
        var ry = angle.ry * (1 - eased);
        card.style.opacity = eased;
        card.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,' + tz + 'px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
        card.classList.toggle('sd-entered', progress >= 0.95);
    });
}

// --- Portfolio items: parallax + scale ---
function animatePortfolioItems() {
    var parallaxSpeeds = [0.06, -0.06, 0.04, -0.04, 0.08, -0.05];
    portfolioItems.forEach(function(item, i) {
        var rect = item.getBoundingClientRect();
        var vh = window.innerHeight;
        var centerOffset = rect.top + rect.height / 2 - vh / 2;
        var speed = parallaxSpeeds[i] || 0.05;
        var parallax = centerOffset * speed;
        // Scale: slightly larger when in center of viewport
        var distFromCenter = Math.abs(centerOffset) / vh;
        var scale = 1 + (1 - clamp(distFromCenter * 2, 0, 1)) * 0.04;
        // Entrance opacity based on how far into view
        var enterProgress = clamp((vh - rect.top) / (vh * 0.3), 0, 1);
        var eased = 1 - Math.pow(1 - enterProgress, 3);
        item.style.opacity = eased;
        item.style.transform = 'translateY(' + parallax + 'px) scale(' + scale + ')';
    });
}

// --- Testimonials staggered reveal ---
function animateTestimonials() {
    testimonials.forEach(function(card, i) {
        var rect = card.getBoundingClientRect();
        var vh = window.innerHeight;
        var triggerStart = vh * 0.88;
        if (rect.top > triggerStart) return;
        var delay = i * 0.08;
        var progress = clamp((triggerStart - rect.top) / (triggerStart * 0.5), 0, 1);
        var staggeredProgress = clamp((progress - delay) / 0.4, 0, 1);
        var eased = 1 - Math.pow(1 - staggeredProgress, 3);
        var ty = 40 * (1 - eased);
        card.style.opacity = eased;
        card.style.transform = 'translateY(' + ty + 'px)';
    });
}

// --- Stats: scroll-linked counter ---
function animateStats() {
    if (!statsBar || counterData.length === 0) return;
    var rect = statsBar.getBoundingClientRect();
    var vh = window.innerHeight;
    // Start counting when statsBar enters bottom 60% of viewport, finish at 20%
    var progress = clamp((vh * 0.8 - rect.top) / (vh * 0.6), 0, 1);
    if (progress <= 0) return;
    var eased = 1 - Math.pow(1 - progress, 2);
    counterData.forEach(function(item) {
        var val = Math.round(item.target * eased);
        item.el.textContent = val + item.suffix;
    });
    if (progress >= 1 && !countersTriggered) {
        countersTriggered = true;
        counterData.forEach(function(item) {
            item.el.textContent = item.target + item.suffix;
        });
    }
}

// --- Stats bar fade-in ---
function animateStatsBar() {
    if (!statsBar) return;
    var rect = statsBar.getBoundingClientRect();
    var vh = window.innerHeight;
    var progress = clamp((vh - rect.top) / (vh * 0.4), 0, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    statsBar.style.opacity = eased;
    statsBar.style.transform = 'translateY(' + (30 * (1 - eased)) + 'px) scale(' + (0.95 + 0.05 * eased) + ')';
}

// --- UI utilities: progress bar, back-to-top, sticky CTA ---
function animateUI() {
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgress) {
        scrollProgress.style.width = (scrollY / docHeight) * 100 + '%';
    }
    if (backToTop) {
        backToTop.classList.toggle('visible', scrollY > 600);
    }
    if (stickyCta && contactSection) {
        var contactTop = contactSection.getBoundingClientRect().top + scrollY;
        var show = scrollY > heroHeight && scrollY < contactTop - window.innerHeight;
        stickyCta.classList.toggle('visible', show);
    }
}

// --- Master rAF tick ---
function tick() {
    rafPending = false;
    scrollVelocity = scrollY - lastScrollY;
    lastScrollY = scrollY;

    if (!prefersReducedMotion) {
        animateHero();
        animateHeadings();
        animateServiceCards();
        animatePortfolioItems();
        animateTestimonials();
        animateStats();
        animateStatsBar();
    } else {
        // Reduced motion: just show everything instantly
        document.querySelectorAll('.split-heading .word').forEach(function(w) {
            w.style.opacity = '1';
            w.style.transform = 'none';
        });
        document.querySelectorAll('.service-card').forEach(function(el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        document.querySelectorAll('.portfolio-item').forEach(function(el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        document.querySelectorAll('.testimonial').forEach(function(el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        if (statsBar) {
            statsBar.style.opacity = '1';
            statsBar.style.transform = 'none';
        }
        counterData.forEach(function(item) { item.el.textContent = item.target + item.suffix; });
    }
    animateUI();
}

// --- Single passive scroll listener ---
window.addEventListener('scroll', function() {
    scrollY = window.scrollY;
    if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(tick);
    }
}, { passive: true });

// Initial paint
scrollY = window.scrollY;
tick();

// Re-cache hero height on resize
window.addEventListener('resize', function() {
    heroHeight = heroSection ? heroSection.offsetHeight : 0;
}, { passive: true });

// ============================================================
// SMOOTH SCROLL via native scrollIntoView — works on mobile
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href.length <= 1) return;
        e.preventDefault();
        var mobileNav = document.getElementById('mobileNav');
        if (mobileNav && mobileNav.classList.contains('open')) {
            closeMenu();
        }
        var target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ============================================================
// TYPEWRITER EFFECT
// ============================================================
(function() {
    var words = ['Drives Results', 'Builds Brands', 'Goes Viral', 'Converts Clicks', 'Tells Stories', 'Breaks Records'];
    var el = document.getElementById('typewriter');
    if (!el) return;
    if (prefersReducedMotion) {
        el.textContent = words[0];
        return;
    }
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

// ============================================================
// HAMBURGER MENU
// ============================================================
function toggleMenu() {
    document.querySelector('.hamburger').classList.toggle('open');
    document.getElementById('mobileNav').classList.toggle('open');
}
function closeMenu() {
    document.querySelector('.hamburger').classList.remove('open');
    document.getElementById('mobileNav').classList.remove('open');
}

// ============================================================
// BLOG CARD CLICKS
// ============================================================
document.querySelectorAll('.blog-card').forEach(function(card, index) {
    card.addEventListener('click', function(e) {
        if (e.target.closest('a')) return;
        if (index === 0) {
            document.body.classList.add('page-exit');
            setTimeout(function() { window.location.href = 'blog-ad-budget.html'; }, 300);
        } else {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================================
// FAQ ACCORDION
// ============================================================
document.querySelectorAll('.faq-question').forEach(function(q, idx) {
    q.setAttribute('tabindex', '0');
    q.setAttribute('role', 'button');
    q.setAttribute('aria-expanded', 'false');
    var answerId = 'faq-answer-' + idx;
    var answer = q.parentElement.querySelector('.faq-answer');
    if (answer) {
        answer.setAttribute('id', answerId);
        answer.setAttribute('role', 'region');
    }
    q.setAttribute('aria-controls', answerId);
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
    document.querySelectorAll('.faq-item').forEach(function(i) {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = null;
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        el.setAttribute('aria-expanded', 'true');
    }
}

// ============================================================
// CONTACT FORM VALIDATION
// ============================================================
function showError(input, errorEl, message) {
    input.classList.add('input-error');
    errorEl.textContent = message;
    errorEl.classList.add('visible');
}
function clearError(input, errorEl) {
    input.classList.remove('input-error');
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
}
function validateName(silent) {
    var input = document.getElementById('formName');
    var error = document.getElementById('formNameError');
    if (!input || !error) return true;
    if (input.value.trim() === '') {
        if (!silent) showError(input, error, 'Please enter your name so I know who I\'m talking to.');
        return false;
    }
    if (input.value.trim().length < 2) {
        if (!silent) showError(input, error, 'Name should be at least 2 characters.');
        return false;
    }
    clearError(input, error);
    return true;
}
function validateEmail(silent) {
    var input = document.getElementById('formEmail');
    var error = document.getElementById('formEmailError');
    if (!input || !error) return true;
    if (input.value.trim() === '') {
        if (!silent) showError(input, error, 'I\'ll need your email to get back to you.');
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        if (!silent) showError(input, error, 'That doesn\'t look like a valid email. Double-check?');
        return false;
    }
    clearError(input, error);
    return true;
}
(function() {
    var nameInput = document.getElementById('formName');
    var emailInput = document.getElementById('formEmail');
    if (nameInput) {
        nameInput.addEventListener('blur', function() { if (this.value.trim() !== '') validateName(); });
        nameInput.addEventListener('input', function() { if (this.classList.contains('input-error')) validateName(); });
    }
    if (emailInput) {
        emailInput.addEventListener('blur', function() { if (this.value.trim() !== '') validateEmail(); });
        emailInput.addEventListener('input', function() { if (this.classList.contains('input-error')) validateEmail(); });
    }
})();
function handleSubmit(e) {
    e.preventDefault();
    var nameOk = validateName();
    var emailOk = validateEmail();
    if (!nameOk || !emailOk) return;
    var btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Sent!';
    btn.style.background = '#06d6a0';
    document.querySelectorAll('.form-error').forEach(function(el) { el.classList.remove('visible'); el.textContent = ''; });
    document.querySelectorAll('.input-error').forEach(function(el) { el.classList.remove('input-error'); });
    setTimeout(function() {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        e.target.reset();
    }, 2000);
}

// ============================================================
// ROI CALCULATOR
// ============================================================
var calcSpend = document.getElementById('calcSpend');
if (calcSpend) {
    calcSpend.addEventListener('input', function() {
        var spend = parseInt(this.value);
        var roas = 3.8 - (spend > 20000 ? 0.5 : 0);
        var wastePercent = 0.6;
        var cpl = 52;
        var revenue = Math.round(spend * roas);
        var saved = Math.round(spend * wastePercent);
        var leads = Math.round((spend * (1 - wastePercent * 0.5)) / cpl);
        document.getElementById('calcSpendValue').textContent = '$' + spend.toLocaleString() + '/mo';
        document.getElementById('calcRevenue').textContent = '$' + revenue.toLocaleString();
        document.getElementById('calcRoas').textContent = roas.toFixed(1) + 'x';
        document.getElementById('calcSaved').textContent = '$' + saved.toLocaleString();
        document.getElementById('calcLeads').textContent = leads.toLocaleString();
    });
}

// ============================================================
// CUSTOM CURSOR FOLLOWER
// ============================================================
(function() {
    var dot = document.getElementById('cursorDot');
    if (!dot || window.matchMedia('(hover: none)').matches) return;
    var mouseX = 0, mouseY = 0, dotX = 0, dotY = 0;
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.classList.add('visible');
    });
    document.addEventListener('mouseleave', function() { dot.classList.remove('visible'); });
    function animateDot() {
        dotX += (mouseX - dotX) * 0.15;
        dotY += (mouseY - dotY) * 0.15;
        dot.style.left = dotX - 6 + 'px';
        dot.style.top = dotY - 6 + 'px';
        requestAnimationFrame(animateDot);
    }
    animateDot();
})();

// ============================================================
// PAGE TRANSITIONS
// ============================================================
document.querySelectorAll('a[href$=".html"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        e.preventDefault();
        document.body.classList.add('page-exit');
        setTimeout(function() { window.location.href = href; }, 300);
    });
});

// ============================================================
// PROCESS STEPS — cascade reveal (IntersectionObserver, subtle)
// ============================================================
(function() {
    var processSteps = document.querySelector('.process-steps');
    if (!processSteps) return;
    var observer = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
            entries[0].target.querySelectorAll('.process-step').forEach(function(step) {
                step.classList.add('step-visible');
            });
            observer.unobserve(entries[0].target);
        }
    }, { threshold: 0.2 });
    observer.observe(processSteps);
})();

// ============================================================
// SOCIAL PROOF TOAST
// ============================================================
setTimeout(function() {
    var toast = document.getElementById('socialToast');
    if (toast) {
        toast.classList.add('visible');
        setTimeout(function() { toast.classList.remove('visible'); }, 6000);
    }
}, 8000);

// ============================================================
// KONAMI CODE EASTER EGG
// ============================================================
(function() {
    var code = [38,38,40,40,37,39,37,39,66,65];
    var pos = 0;
    var triggered = false;
    document.addEventListener('keydown', function(e) {
        if (triggered) return;
        if (e.keyCode === code[pos]) {
            pos++;
            if (pos === code.length) {
                triggered = true;
                var colors = ['#4361ee','#7209b7','#f72585','#4cc9f0','#06d6a0','#ffd166','#ff6b6b'];
                for (var i = 0; i < 80; i++) {
                    var piece = document.createElement('div');
                    piece.className = 'confetti-piece';
                    piece.style.left = Math.random() * 100 + 'vw';
                    piece.style.top = -10 + 'px';
                    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
                    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
                    piece.style.width = (Math.random() * 8 + 6) + 'px';
                    piece.style.height = (Math.random() * 8 + 6) + 'px';
                    piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
                    piece.style.animationDelay = (Math.random() * 0.5) + 's';
                    document.body.appendChild(piece);
                    setTimeout(function(p) { p.remove(); }, 4000, piece);
                }
                var msg = document.createElement('div');
                msg.className = 'easter-egg-msg';
                msg.innerHTML = '<h3>You found the secret!</h3><p>You clearly pay attention to details.<br>That\'s exactly the kind of client I love working with.</p><button class="btn btn-primary close-egg" onclick="this.parentElement.remove()">Nice.</button>';
                document.body.appendChild(msg);
            }
        } else { pos = 0; }
    });
})();

// ============================================================
// MAGNETIC 3D TILT ON TESTIMONIAL CARDS (desktop only)
// ============================================================
(function() {
    if (window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('.testimonial').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var cx = rect.width / 2;
            var cy = rect.height / 2;
            var ry = ((x - cx) / cx) * 4;
            var rx = ((cy - y) / cy) * 4;
            card.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(8px)';
        });
        card.addEventListener('mouseleave', function() {
            // Don't wipe transform — let scroll engine reclaim it next tick
            card.style.transform = '';
        });
    });
})();

// ============================================================
// SECTION DOTS NAVIGATOR
// ============================================================
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
