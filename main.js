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

document.querySelectorAll('.service-card, .portfolio-item, .testimonial').forEach(function(el) {
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

// Blog card clicks — first card navigates to article with page transition, others scroll to contact
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

// Contact form — inline validation with error messages
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
// Real-time validation on blur
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
    // Clear error states on successful submit
    document.querySelectorAll('.form-error').forEach(function(el) { el.classList.remove('visible'); el.textContent = ''; });
    document.querySelectorAll('.input-error').forEach(function(el) { el.classList.remove('input-error'); });
    setTimeout(function() {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        e.target.reset();
    }, 2000);
}

// ROI Calculator — interactive tool
var calcSpend = document.getElementById('calcSpend');
if (calcSpend) {
    calcSpend.addEventListener('input', function() {
        var spend = parseInt(this.value);
        var roas = 3.8 - (spend > 20000 ? 0.5 : 0); // slightly lower ROAS at high spend
        var wastePercent = 0.6; // 60% waste eliminated
        var cpl = 52; // cost per lead
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

// Custom cursor follower
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
    function animate() {
        dotX += (mouseX - dotX) * 0.15;
        dotY += (mouseY - dotY) * 0.15;
        dot.style.left = dotX - 6 + 'px';
        dot.style.top = dotY - 6 + 'px';
        requestAnimationFrame(animate);
    }
    animate();
})();

// Smooth page transitions for internal links
document.querySelectorAll('a[href$=".html"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        e.preventDefault();
        document.body.classList.add('page-exit');
        setTimeout(function() { window.location.href = href; }, 300);
    });
});

// Hero parallax effect
var heroContent = document.getElementById('heroContent');
var heroSection = document.querySelector('.hero');
var particles = document.querySelector('.particles');
window.addEventListener('scroll', function() {
    var scrollY = window.scrollY;
    var heroH = heroSection.offsetHeight;
    if (scrollY < heroH) {
        var ratio = scrollY / heroH;
        heroContent.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
        heroContent.style.opacity = 1 - ratio * 0.8;
        if (particles) particles.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
    }
}, { passive: true });

// Stats bar reveal animation
var statsBarEl = document.querySelector('.stats-bar');
if (statsBarEl) {
    statsBarEl.style.opacity = '0';
    var statsRevealObs = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
            statsBarEl.classList.add('animate');
            statsRevealObs.unobserve(statsBarEl);
        }
    }, { threshold: 0.2 });
    statsRevealObs.observe(statsBarEl);
}

// Social proof toast — show after 8s, hide after 14s
setTimeout(function() {
    var toast = document.getElementById('socialToast');
    if (toast) {
        toast.classList.add('visible');
        setTimeout(function() { toast.classList.remove('visible'); }, 6000);
    }
}, 8000);

// Konami code easter egg
(function() {
    var code = [38,38,40,40,37,39,37,39,66,65]; // up up down down left right left right B A
    var pos = 0;
    var triggered = false;
    document.addEventListener('keydown', function(e) {
        if (triggered) return;
        if (e.keyCode === code[pos]) {
            pos++;
            if (pos === code.length) {
                triggered = true;
                // Confetti burst
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
                // Message
                var msg = document.createElement('div');
                msg.className = 'easter-egg-msg';
                msg.innerHTML = '<h3>You found the secret!</h3><p>You clearly pay attention to details.<br>That\'s exactly the kind of client I love working with.</p><button class="btn btn-primary close-egg" onclick="this.parentElement.remove()">Nice.</button>';
                document.body.appendChild(msg);
            }
        } else { pos = 0; }
    });
})();

// Magnetic 3D tilt on testimonial cards
(function() {
    if (window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('.testimonial').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateY = ((x - centerX) / centerX) * 4; // max 4deg
            var rotateX = ((centerY - y) / centerY) * 4;
            card.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(8px)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });
})();

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
