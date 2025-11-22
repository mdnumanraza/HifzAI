# HifzAI - Brand Identity Guide

## Logo Overview

HifzAI combines the Arabic word "حِفْظ" (Hifz - meaning memorization) with "AI" to represent our AI-powered Quran memorization platform.

## Logo Components

### Primary Logo
- **Arabic Text**: حِفْظ (Hifz) in gold gradient
- **Latin Text**: AI in white
- **Font Family**: 
  - Arabic: Amiri, Scheherazade New (serif)
  - Latin: Poppins (sans-serif, bold 800)

### Color Palette

#### Gold Gradient
- **Start**: `#F9D976` (Light Gold)
- **Mid**: `#D4AF37` (Classic Gold)
- **End**: `#B8941E` (Deep Gold)

#### Primary Colors
- **Emerald Primary**: `#047857` (Main brand color)
- **Emerald Light**: `#10B981` (Accent)
- **Navy Primary**: `#1E3A5F` (Deep background)
- **Pearl/White**: `#F9FAFB` (Text/backgrounds)

### Logo Enhancements

#### Visual Effects
1. **Gold Gradient**: Linear gradient across Arabic text
2. **Shimmer Animation**: Subtle light sweep across logo (3s loop)
3. **Glow Effect**: Soft blur around elements for depth
4. **Shadow**: Drop shadow for text elevation
5. **Background Glow**: Semi-transparent circle behind Arabic text
6. **Accent Dot**: Animated pulsing dot near "AI"
7. **Underline**: Subtle gold gradient line beneath text

#### Animation Features
- **Initial Load**: Fade-in with scale (0.8 → 1.0)
- **Hover**: Scale up slightly (1.0 → 1.05)
- **Shimmer**: Continuous light sweep animation
- **Pulse Dot**: Opacity animation on accent dot (0.5 → 1.0 → 0.5)

## Logo Sizes

### Small (150x55px)
- **Use Cases**: Mobile navbar, small UI elements
- **Arabic Font**: 32px
- **AI Font**: 24px

### Default (220x80px)
- **Use Cases**: Desktop navbar, login/signup pages
- **Arabic Font**: 48px
- **AI Font**: 36px

### Large (380x140px)
- **Use Cases**: Loading screen, hero sections, marketing
- **Arabic Font**: 76px
- **AI Font**: 58px

## Component Usage

### Static Logo
```jsx
import Logo from './components/ui/Logo.jsx';

<Logo size="default" className="my-custom-class" />
```

### Animated Logo (with entrance animation)
```jsx
import { AnimatedLogo } from './components/ui/Logo.jsx';

<AnimatedLogo size="large" />
```

## Where Logo Appears

### Frontend
- ✅ **Navbar**: Small logo, scales on hover
- ✅ **Login Page**: Default size with animation
- ✅ **Signup Page**: Default size with animation
- ✅ **Loading Screen**: Large logo with bouncing dots
- ✅ **Profile**: Can be used in headers

### Mobile Responsiveness
- Logo scales smoothly across breakpoints
- Maintains aspect ratio
- Legible at all sizes
- Animations remain smooth on mobile

## Brand Voice

### Taglines
- "AI-Powered Quran Memorization"
- "Your intelligent memorization companion"
- "Memorize smarter, not harder"

### Tone
- **Respectful**: Islamic context requires dignity
- **Modern**: AI-powered, tech-forward
- **Encouraging**: Supportive of user's journey
- **Clear**: Easy to understand, no jargon

## Design Principles

### Typography
1. **Arabic**: Traditional serif fonts for authenticity
2. **English**: Modern sans-serif for tech feel
3. **Hierarchy**: Bold weights for emphasis
4. **Spacing**: Generous letter-spacing for "AI"

### Colors
1. **Gold**: Achievement, excellence, value
2. **Emerald**: Growth, Islam, peace
3. **Navy**: Trust, depth, stability
4. **White/Pearl**: Purity, clarity, simplicity

### Motion
1. **Smooth**: All animations use easing curves
2. **Purposeful**: Animations guide attention
3. **Subtle**: Never distracting or flashy
4. **Performance**: Optimized for 60fps

## File Locations

```
/frontend/src/components/ui/Logo.jsx
├── Logo component (static)
└── AnimatedLogo component (with entrance animation)

Used in:
├── /frontend/src/components/layout/Navbar.jsx
├── /frontend/src/pages/Login.jsx
├── /frontend/src/pages/Signup.jsx
└── /frontend/src/App.jsx (loading screen)
```

## Technical Specs

### SVG Structure
- **ViewBox**: Scales to maintain proportions
- **Gradients**: Defined in `<defs>` for reusability
- **Filters**: Glow and shadow effects
- **Animations**: CSS/SMIL for shimmer and pulse

### Performance
- **SVG Format**: Scalable, crisp at any size
- **Inline**: No external file requests
- **Optimized**: Minimal DOM nodes
- **Cached**: React component memoization

## Brand Assets Checklist

- ✅ Logo component created
- ✅ Multiple size variants
- ✅ Animated version
- ✅ Applied to all pages
- ✅ Responsive design
- ✅ Loading screen
- ✅ Navbar integration
- ✅ Package.json updated
- ✅ HTML title updated
- ✅ Meta description added

## Future Enhancements

### Potential Additions
1. **Favicon**: 16x16, 32x32 versions of logo
2. **Open Graph Image**: Social media preview (1200x630)
3. **App Icons**: iOS/Android app icons if mobile app created
4. **Email Templates**: Logo for transactional emails
5. **Merch**: T-shirts, stickers, posters
6. **Dark Mode Variant**: Adjusted colors for dark backgrounds
7. **Monochrome Version**: Single-color for specific uses

### Design System Expansion
1. **Icon Library**: Custom icons matching logo style
2. **Illustration Style**: Consistent with brand
3. **Photography Guidelines**: Image treatment rules
4. **Voice & Tone Guide**: Detailed writing standards

## Usage Guidelines

### Do's ✅
- Use official logo files from component
- Maintain aspect ratio when scaling
- Use on contrasting backgrounds
- Keep animations smooth
- Center logo in prominent placements

### Don'ts ❌
- Don't stretch or distort logo
- Don't change colors arbitrarily
- Don't add effects beyond provided ones
- Don't place on busy backgrounds
- Don't use low-quality renders

## Accessibility

### Considerations
- **Contrast**: Gold meets WCAG AA standards on dark backgrounds
- **Size**: Logo remains legible at smallest size (150px width)
- **Alt Text**: "HifzAI Logo" when used as image
- **Animations**: Respect `prefers-reduced-motion` media query

### Implementation
```jsx
// Respect user motion preferences
@media (prefers-reduced-motion: reduce) {
  .logo-animation {
    animation: none !important;
  }
}
```

---

**Brand Created**: November 2024  
**Version**: 1.0  
**Status**: Active ✨

---

## Quick Reference

**Project Name**: HifzAI  
**Arabic**: حِفْظ (Hifz)  
**Meaning**: Memorization  
**Focus**: AI-Powered Quran Memorization  

**Primary Gold**: `#D4AF37`  
**Primary Emerald**: `#047857`  
**Primary Navy**: `#1E3A5F`  

**Logo File**: `/frontend/src/components/ui/Logo.jsx`  
**Sizes**: `small` | `default` | `large`  
**Types**: `<Logo />` | `<AnimatedLogo />`
