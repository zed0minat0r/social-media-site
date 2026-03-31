# Changelog

## 2026-03-31

### Builder: Pricing Section + FAQ Accordion (Task 5 Complete)
- Added 3-tier pricing section: Starter ($2,500/mo), Growth ($5,000/mo), Enterprise (Custom)
- Growth tier marked as "MOST POPULAR" with featured badge and primary CTA
- Each tier has specific deliverables and feature lists
- Added FAQ accordion with 5 questions — smooth expand/collapse animation
- FAQ covers: results timeline, contracts, industries, getting started, reporting
- Only one FAQ can be open at a time (auto-closes others)
- Pricing cards responsive — stack to single column on mobile
- Task 5 marked as COMPLETE (all sub-items done by various agents)

### Pixel: Comprehensive Mobile Overhaul
- Added 360px breakpoint for ultra-small screens (iPhone SE, older devices)
- Nav links hidden at 480px and below (prevents overflow — hamburger menu needed later)
- Logo, theme toggle, and header padding all scale down progressively
- Hero CTA buttons now full-width on mobile with max-width cap for thumb-friendly tapping
- Stats bar numbers scale from 36px to 28px to 24px across breakpoints
- Client logos shrink to 18px on tablets
- Portfolio overlay text and headings reduced for readability in small cards
- Contact form selects forced to width: 100% on mobile (prevents overflow)
- CTA section padding and margins reduced on small screens
- Testimonial cards get tighter padding, smaller text on mobile
- Form inputs set to 16px on mobile (prevents iOS auto-zoom)
- Footer social links bumped to 44px touch targets
- About photo emoji scales down on mobile
- Section padding reduces at each breakpoint for better content density

### Refiner: 4 Recurring Issues Addressed
- RECURRING FIX: Testimonials now varied — 2 are 5-star, 2 are 4-star with constructive feedback and specific details (timelines, metrics, company sizes, industries)
- RECURRING FIX: Contact form now has 3 qualification dropdowns — service type, budget range ($2K-$25K+), and timeline
- RECURRING FIX: Added urgency to CTA — "Currently accepting 2 new clients for Q2 2026" with fire emoji
- BONUS: Rebuilt footer with newsletter signup form, social media links, and email input. No longer wasted space.

### QA: 6 bugs found and fixed
- Fixed Home nav link: was href="#" (invalid selector), now href="#top" with id="top" on body
- Removed unused --accent CSS variable (dead code since day 1)
- Fixed browser mockup colors for dark mode: background, browser bar, and URL bar now use CSS variables instead of hardcoded white
- Added `<main>` landmark element for screen reader accessibility
- Noted: social link hrefs are still "#" placeholders — not broken per se but not functional
- Noted: footer Privacy/Terms links are dead — acceptable for now as placeholder

### Spark's Innovation: Browser Mockup Portfolio + Animated Counters
- Replaced plain gradient portfolio items with CSS browser mockups (window chrome, URL bar, wireframe content)
- Each mockup has unique layout (hero sections, grids, CTAs, charts) matching the project type
- Mockups are color-coded to match each client's gradient theme
- Added animated number counters on the stats bar — numbers count up with easing when scrolled into view
- Stats start at 0 and animate to 50+, 200%, 10M+, 8+ on scroll

### Nigel's Audit #2 — Recalibrated (Strict Standards)
- Scores dropped across the board with honest grading: Design 4 (was 7), Content 5 (was 6), UX 6 (was 7), Technical 6 (was 7), Conversion 4 (was 6)
- Overall: 5.0 (was 6.6)
- 4 recurring issues flagged: portfolio imagery, testimonial authenticity, form qualification, urgency
- Score history tracking now active in AUDIT.md

### Builder: Major Visual Upgrade — Font, Dividers, Process Section, Portfolio Content
- Added Space Grotesk display font from Google Fonts for distinctive typography
- Added wave SVG divider between hero and stats bar for visual depth
- Added "How I Work" 3-step process section with numbered circles and connector lines
- Enriched all 6 portfolio items with brand names and project types visible on the cards
- Expanded portfolio overlay descriptions with real strategy details (not one-liners)
- Portfolio items now show brand name + type even before hover

### Refiner: Audit Fixes — About Section, Mobile Portfolio, SEO, Focus States
- Added About section with photo placeholder, bio, role title, and social links (Instagram, LinkedIn, X, TikTok)
- Fixed mobile portfolio: overlays now always visible on touch devices (no hover needed)
- Improved portfolio overlay gradient for better text readability
- Added full SEO meta tags: description, Open Graph, Twitter card
- Added emoji favicon (rocket)
- Added focus-visible states on all interactive elements for keyboard accessibility
- Added About link to navigation
- Responsive about section stacks on mobile

### Spark's Innovation: Typewriter Hero + Floating Particles
- Added animated typewriter effect in hero that cycles through: "Drives Results", "Builds Brands", "Goes Viral", "Converts Clicks", "Tells Stories", "Breaks Records"
- Golden yellow highlight color (#ffd166) for the rotating text with blinking cursor
- Added 8 floating particle dots that rise through the hero background
- Particles vary in size, speed, and timing for organic feel

### Nigel's Audit — First Portfolio Review
- Scored site: Design 7, Content 6, UX 7, Technical 7, Conversion 6 (overall 6.6)
- Key findings: missing About section, portfolio needs real imagery, mobile hover issue, no SEO meta tags
- Full audit saved to AUDIT.md with structured JSON scores and detailed recommendations

### Task 3 Completed: Full Portfolio Rebuild
- Rebuilt entire site from social feed to digital marketing portfolio
- New brand: MediaPro — Digital Marketing & Media Services
- Added hero section with gradient background and dual CTAs
- Added stats bar (50+ clients, 200% avg ROI, 10M+ impressions, 8+ years)
- Added 6 client logos (TechFlow, NovaBrand, Meridian Co., Pulse Digital, Vertex Labs, Bloom Health)
- Added 6 service cards (Social Media, Video, Paid Ads, Brand Strategy, Email, SEO)
- Added 6 portfolio items with hover overlays showing results
- Added 4 testimonials with star ratings
- Added CTA banner section
- Added contact form and info section
- Scroll-triggered fade-in animations
- Smooth scroll navigation
- Full dark mode support
- Responsive at 768px and 480px

### Task 2 Completed: Visual Design Improvements
- Added dark mode toggle with sun/moon icon in header (persists via localStorage)
- Added CSS custom properties (variables) for seamless theme switching
- Added smooth animations: fadeInUp on posts, popIn on like, shimmer on skeletons
- Added loading skeleton screen that shows for 800ms on page load
- Improved mobile responsiveness with breakpoints at 768px and 480px
- Added micro-interactions: button scale on click, avatar hover scale, theme toggle rotation
- All transitions are 0.2-0.3s for a polished feel
- Comments section now animates open/closed with max-height transition

## 2026-03-30

### Task 1 Completed: Core Social Media Features
- Added functional like counters to each post (click to toggle, count updates)
- Added expandable comment sections with existing comments
- Added ability to write and post new comments
- Added user profile sidebar with avatar, bio, posts/followers/following stats
- Added active page highlighting on navigation
- Added responsive layout (sidebar stacks on mobile)
- Added hover animations and transitions on posts and buttons
- Added sticky header

### Initial Setup
- Created starter index.html with SocialConnect branding
- Created TASKS.md with 3 task categories
- Added STYLE-GUIDE.md and REQUIREMENTS.md for agent consistency
