# SocialConnect — Product Requirements

## Vision
SocialConnect is a modern, clean social media platform that prioritizes authentic connections and a delightful user experience. Think the best parts of early Twitter and Facebook — simple, fast, and focused on content.

## Target Audience
- General social media users who want a clean, ad-free experience
- Content creators looking for a simple platform
- Communities that value authentic interaction

## Core Features (Priority Order)

### P0 — Must Have
1. **News Feed**: Scrollable feed of posts from the community
2. **Post Creation**: Text-based posts with a clean composer
3. **Post Interactions**: Like, comment, and share functionality
4. **User Profiles**: Avatar, name, bio, post count, follower/following counts
5. **Navigation**: Home, Explore, Messages, Profile sections
6. **Responsive Design**: Works on mobile, tablet, and desktop

### P1 — Should Have
1. **Dark Mode**: Toggle between light and dark themes
2. **Trending Topics**: Sidebar showing popular topics/hashtags
3. **People Suggestions**: "People you may know" recommendation section
4. **Stories/Highlights**: Ephemeral content row at the top of the feed
5. **Search**: Search for posts, people, and topics
6. **Notifications**: Bell icon with notification dropdown

### P2 — Nice to Have
1. **Image Posts**: Support for image uploads in posts
2. **Emoji Reactions**: Multiple reaction types beyond just "like"
3. **Bookmarks**: Save posts for later
4. **Settings Page**: User preferences and account settings
5. **Onboarding Flow**: Welcome screen for new users

## Technical Requirements
- Single-page HTML/CSS/JS (no build tools required)
- Fast load times (< 2s on 3G)
- Accessible (WCAG 2.1 AA compliance)
- Semantic HTML5
- CSS animations for micro-interactions
- No external dependencies (vanilla JS only)
- Works in all modern browsers

## Design Principles
1. **Simplicity**: Every element earns its place
2. **Speed**: Perceived and actual performance matter
3. **Delight**: Small animations and transitions that feel good
4. **Consistency**: Follow the STYLE-GUIDE.md religiously
5. **Accessibility**: Not an afterthought — built in from the start

## Success Metrics
The website-auditor agent scores these 1-10:
- **Design**: Visual appeal, consistency, modern feel
- **Content**: Quality, variety, and engagement of sample content
- **UX**: Ease of use, intuitive navigation, interaction feedback
- **Technical Quality**: Clean code, performance, accessibility, semantic HTML
- **Conversion Optimization**: CTAs, engagement hooks, user retention patterns

Goal: All scores 8+ within one week of agent operation.

## Agent Workflow
1. **agent-team-runner** reads TASKS.md → creates feature branches → opens PRs
2. **website-auditor** scores the current main branch → writes AUDIT.md
3. **website-improver** reads AUDIT.md → creates improvement branches → opens PRs
4. **gatekeeper** reviews open PRs → approves/merges good ones → requests changes on others

All agents must read STYLE-GUIDE.md and REQUIREMENTS.md before making changes.
