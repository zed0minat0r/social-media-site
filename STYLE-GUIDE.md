# MediaPro Style Guide

## Brand Identity
- **Name**: MediaPro
- **Tagline**: Digital Marketing That Drives Results
- **Tone**: Professional, confident, results-driven. Approachable but authoritative.

## Colors
- **Primary**: #4361ee
- **Gradient End / Secondary**: #7209b7
- **Background**: #f0f2f5
- **Card Background**: #ffffff
- **Text Primary**: #1c1e21
- **Text Secondary**: #606770
- **Border/Divider**: #e4e6eb
- **Error/Alert**: #dc3545
- **Success**: #28a745
- **Hover State**: darken primary by 5% (#166fe5)

## Typography
- **Font Stack**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Headings**: Bold (700 weight)
- **Body Text**: 15px, line-height 1.5
- **Small Text**: 12-13px (timestamps, captions, footer)
- **Post Author Names**: 600 weight (semi-bold)

## Spacing
- **Card Padding**: 16px
- **Card Margin Bottom**: 16px
- **Card Border Radius**: 8px
- **Button Border Radius**: 6px
- **Container Max Width**: 680px (feed), sidebar 300px
- **Section Gap**: 24px

## Components
- **Cards**: White background, border-radius 8px, subtle shadow (0 1px 2px rgba(0,0,0,0.1))
- **Buttons**: Primary = filled blue, Secondary = ghost/outline, Hover = slight darken
- **Avatars**: 40px circle, colored background with white initial letter, 700 weight
- **Inputs/Textareas**: No visible border, subtle background on focus
- **Post Actions Bar**: Top border divider, evenly spaced buttons, ghost style

## Layout Principles
- Mobile-first responsive design
- Single column feed (max 680px) centered
- Sidebar content on larger screens (>1024px)
- Consistent 16px base padding throughout
- Cards stack vertically with 16px gap

## Interaction States
- Hover: Background color shift on buttons/links
- Active: Slight scale down (0.98)
- Focus: Blue outline ring for accessibility
- Transitions: 0.2s ease for all interactive elements

## Accessibility
- All interactive elements must be keyboard navigable
- Minimum contrast ratio 4.5:1 for text
- Alt text required for all images
- ARIA labels on icon-only buttons
- Focus indicators must be visible

## Do Not
- Use more than 2 font families
- Use shadows heavier than 0 2px 4px
- Use colors outside the defined palette without good reason
- Break the card-based layout pattern
- Remove hover/focus states from interactive elements
