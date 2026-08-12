---
name: Majestic Hearth
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1b1b1c'
  on-surface-variant: '#5a413e'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0ef'
  outline: '#8e706d'
  outline-variant: '#e2bebb'
  surface-tint: '#b3282a'
  primary: '#83000f'
  on-primary: '#ffffff'
  primary-container: '#a61e22'
  on-primary-container: '#ffb9b4'
  inverse-primary: '#ffb3ad'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#7c1417'
  on-tertiary: '#ffffff'
  tertiary-container: '#9c2d2b'
  on-tertiary-container: '#ffb9b3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3ad'
  on-primary-fixed: '#410004'
  on-primary-fixed-variant: '#900a15'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#881e1e'
  background: '#fcf9f8'
  on-background: '#1b1b1c'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Cairo
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Cairo
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Cairo
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Cairo
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style

The design system is anchored in the concept of "Majestic Hospitality," blending traditional Middle Eastern luxury with modern, high-end service efficiency. The brand personality is generous, warm, and authoritative, evoking the feeling of a premium dining experience delivered to one's doorstep.

The visual style utilizes a **Corporate Modern** foundation with **Tactile** accents. It avoids the clutter of traditional motifs in favor of a clean, editorial layout that allows high-quality food photography to serve as the primary texture. The aesthetic relies on the interplay between deep, regal reds and shimmering gold accents to signify quality and curated excellence.

Targeting a discerning audience that values both culinary heritage and seamless technology, the UI evokes a sense of trust, indulgence, and precision.

## Colors

This design system employs a palette that balances intensity with light. 

- **Primary Red (#A61E22):** Used for critical brand moments, primary action buttons, and major headings. It represents the "heart" of the kitchen and the warmth of hospitality.
- **Dark Red (#7A1316):** Reserved for hover states of primary elements and deep structural accents to provide dimension.
- **Gold (#D4AF37):** Used specifically for high-value highlights, including star ratings, premium badges (e.g., "Chef’s Choice"), and small interactive accents.
- **Light Gold (#F4D35E):** Utilized for soft backgrounds behind gold text or subtle decorative borders to ensure legibility without losing the premium feel.
- **Neutral Palette:** Pure white serves as the primary canvas to ensure food photography pops. Inactive states, disabled buttons, and secondary icons use a neutral mid-gray to ensure the red and gold remain the undisputed focal points.

## Typography

The typography strategy pairs **Cairo**, a typeface with strong calligraphic roots and modern geometric structure, with **Inter**, the industry standard for functional legibility.

- **Cairo** is exclusive to headings and display elements. Its personality shines in the Primary Red color, creating a sense of "Modern Majlis."
- **Inter** handles all body copy, forms, and technical data. It ensures that even complex menus and nutritional information remain highly readable.
- **Hierarchy:** Use tight tracking on display styles to maintain a premium, editorial feel. Labels and small captions should use slightly increased letter spacing for clarity on mobile devices.

## Layout & Spacing

The design system follows a **8px rhythmic grid**, ensuring all elements align to a consistent mathematical scale. 

- **Grid System:** A 12-column grid is used for desktop, a 6-column grid for tablet, and a 4-column grid for mobile.
- **Horizontal Margins:** Mobile screens must maintain a 20px "safe zone" on the left and right edges to prevent the UI from feeling cramped.
- **Vertical Rhythm:** Use larger spacing (32px+) between distinct restaurant sections or menu categories to create "breathing room," emphasizing the premium nature of the service.
- **Content Density:** Maintain a comfortable density; do not crowd food items. Each dish should feel like a "hero" within its card.

## Elevation & Depth

This design system uses **Tonal Layering** combined with **Ambient Shadows** to create a sense of organized luxury. 

- **Surfaces:** The base layer is Pure White. Secondary content (e.g., sidebars, cart summaries) sits on Secondary Background (#FAFAFA).
- **Shadows:** Use extremely soft, low-opacity shadows for floating elements like cards and bottom sheets. The shadow color should be slightly tinted with Primary Red (e.g., 4% opacity of #A61E22) to keep the depth feeling warm rather than sterile gray.
- **Depth Levels:**
  - **Level 0 (Flat):** Dividers and inactive input fields.
  - **Level 1 (Raised):** Restaurant cards and menu items.
  - **Level 2 (Floating):** Floating Action Buttons (FABs) and active navigation bars.
  - **Level 3 (Overlay):** Modals, bottom sheets, and high-priority alerts.

## Shapes

The shape language is defined by "Sophisticated Softness." 

Following the **ROUND_EIGHT** principle, the standard border radius is **0.5rem (8px)**. This provides a approachable, modern feel that avoids the clinical sharpness of 0px corners or the overly casual appearance of fully pill-shaped components.

- **Standard Elements:** Buttons, cards, and input fields use the 8px radius.
- **Small Elements:** Checkboxes and tags use a 4px radius.
- **Specialty Elements:** Image containers for food items may use the `rounded-lg` (16px) setting to make the food feel more "framed" and artistic.

## Components

### Buttons
- **Primary:** Background #A61E22, Text #FFFFFF. 8px radius.
- **Secondary:** Border #A61E22, Text #A61E22, Background Transparent.
- **Premium Action:** For "Checkout" or "Join Gold Membership," use #D4AF37 background with white text.

### Cards
- **Restaurant Cards:** White background, 8px radius, Level 1 shadow. Food imagery should fill the top half. Title in Cairo (Primary Red), Rating in Gold.
- **Menu Item Cards:** Use #FAFAFA background to distinguish from the main surface.

### Input Fields
- **Default:** #ECECEC border, 8px radius, Inter 16px text.
- **Focus:** #A61E22 2px border with a soft red glow (4px blur).

### Chips & Badges
- **Status (Active):** #A61E22 background, white text.
- **Highlight (e.g., "Trending"):** #F4D35E background, #D4AF37 text.
- **Inactive:** #ECECEC background, #757575 text.

### Interactive Elements
- **Checkboxes/Radios:** Use #A61E22 for the selected state.
- **Ratings:** Use the Star icon in #D4AF37 (Gold).
- **Lists:** Use the Divider color (#ECECEC) for 1px separators between menu items, with 16px padding on either side.