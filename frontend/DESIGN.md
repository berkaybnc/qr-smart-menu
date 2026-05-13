# Design System Specification: The Gastronomic Curator

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Digital Sommelier**. 

In the world of high-end hospitality, the best service is invisible yet omnipresent. This system moves away from the "app-like" density of standard SaaS platforms toward a **High-End Editorial** experience. We are not just building a menu; we are curating a digital atmosphere. 

To break the "template" look, we utilize **Intentional Asymmetry** and **Tonal Depth**. By avoiding rigid grids in favor of overlapping elements and vast, breathable whitespace, we create a sense of luxury. The interface should feel like a premium printed menu—tactile, spacious, and authoritative.

---

## 2. Colors & Surface Philosophy
The palette is rooted in an organic, "Cream and Charcoal" foundation, punctuated by a high-energy sunset orange (`primary`).

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. 
Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting on a `surface` background provides all the definition needed. If you feel a line is necessary, your spacing is likely insufficient.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of fine cardstock.
*   **Base:** `surface` (#faf9f6) - The canvas.
*   **Sectioning:** `surface-container-low` (#f4f3f1) - For large, secondary content areas.
*   **Focus:** `surface-container-lowest` (#ffffff) - For primary cards and interactive elements to create a natural "lift."

### The "Glass & Gradient" Rule
To elevate the "SaaS" feel into "Luxury Service," use **Glassmorphism** for floating headers or navigation bars. Use semi-transparent `surface` colors with a 20px backdrop-blur. 
*   **Signature Texture:** Use a subtle linear gradient on main CTAs, transitioning from `primary` (#a93702) to `primary_container` (#f26b38) at a 135-degree angle. This adds "soul" and a sense of light that flat hex codes lack.

---

## 3. Typography: Editorial Authority
We use a pairing of **Plus Jakarta Sans** for display/headlines and **Inter** for functional body text.

*   **Display (Display-LG to SM):** Large, airy, and confident. Use `plusJakartaSans` with slightly tighter letter-spacing (-0.02em) to create an "Editorial" impact.
*   **Body (Body-LG to SM):** Utilize `inter` for maximum legibility in multilingual environments (EN, TR, AR). 
*   **Hierarchy as Identity:** Use high contrast between `display-lg` and `body-md`. The vast size difference signals a premium brand that isn't afraid to take up space.
*   **RTL Optimization:** Plus Jakarta Sans and Inter both maintain excellent balance when flipped for Arabic (AR), ensuring the "Premium" feel remains consistent across cultures.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often "dirty." We achieve depth through light and tone.

*   **The Layering Principle:** Instead of a shadow, place a `surface-container-highest` element behind a `surface` element to imply distance.
*   **Ambient Shadows:** For floating modals or "Add to Cart" buttons, use a shadow with a 40px-60px blur, at 4% opacity. The color should be `#58423a` (on-surface-variant) rather than pure black, mimicking natural light reflecting off warm surfaces.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., input fields), use `outline_variant` at 20% opacity. Never use 100% opaque lines.
*   **Glassmorphism:** Use for persistent elements. A floating "View Menu" button should be a glass container with a `surface` tint and a soft `primary` glow.

---

## 5. Components

### Buttons
*   **Primary:** Rounded `full` (pill-shaped). Gradient fill (Primary to Primary-Container). No border. High-contrast `on_primary` text.
*   **Secondary:** `surface-container-highest` background with `on_surface` text. Feels integrated, not "pasted on."
*   **Tertiary:** Pure text with an underline that only appears on hover. Use for "Cancel" or "Back."

### Cards & Lists
*   **Rule:** Forbid the use of divider lines. 
*   **Implementation:** Separate menu items using 24px of vertical whitespace. Use a `surface-container-low` background on hover to indicate interactivity. For image-heavy cards, use `rounded-xl` (1.5rem) to soften the visual impact.

### Input Fields
*   **Style:** Minimalist. No bottom line. Use a `surface-container-high` background with a `rounded-md` corner.
*   **States:** On focus, the background shifts to `surface-container-lowest` and a 1px `ghost-border` (outline-variant at 20%) fades in.

### Smart Menu Components (Context Specific)
*   **Language Switcher:** A "Glass" floating chip at the top-right. Minimalist icons only.
*   **QR Generator Preview:** Treat the QR code as a piece of art. Frame it in a `surface-container-lowest` card with a massive 48px padding and an ambient shadow.

---

## 6. Do's and Don'ts

### Do
*   **Do** embrace "Wasted Space." It is not wasted; it is luxury.
*   **Do** use `primary` (#a93702) sparingly. It should be a beacon, not a floodlight.
*   **Do** ensure RTL layouts mirror perfectly. Check that the "Sunset Orange" accent remains the focal point when the eye moves right-to-left.
*   **Do** use `rounded-xl` for any container that holds an image (e.g., food photography).

### Don't
*   **Don't** use 1px dividers. Use a `12px` height `surface-container-low` block if you must separate sections.
*   **Don't** use pure black (#000000). Use `on_surface` (#1a1c1a) for all "black" text to maintain the cream-based warmth.
*   **Don't** use harsh shadows. If the shadow is clearly visible, it is too dark. It should be felt, not seen.
*   **Don't** use "Standard" blue for links. Use `tertiary` (#45645e) for a sophisticated, deep emerald alternative.