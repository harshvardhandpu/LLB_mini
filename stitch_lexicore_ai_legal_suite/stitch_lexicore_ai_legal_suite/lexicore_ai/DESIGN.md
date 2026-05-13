---
name: LexiCore AI
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1b1b1d'
  surface-container: '#1f1f21'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e4e2e4'
  on-surface-variant: '#c6c6cd'
  inverse-surface: '#e4e2e4'
  inverse-on-surface: '#303032'
  outline: '#909097'
  outline-variant: '#45464d'
  surface-tint: '#bec6e0'
  primary: '#bec6e0'
  on-primary: '#283044'
  primary-container: '#0f172a'
  on-primary-container: '#798098'
  inverse-primary: '#565e74'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#dec29a'
  on-tertiary: '#3e2d11'
  tertiary-container: '#231500'
  on-tertiary-container: '#957d5a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#131315'
  on-background: '#e4e2e4'
  surface-variant: '#353436'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-fixed:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-ui:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-tabular:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 16px
  gutter: 12px
  component-gap: 8px
  density-scale: compact
---

## Brand & Style
The design system is engineered for the high-stakes world of legal intelligence, where speed of comprehension and absolute precision are paramount. The aesthetic, termed "Glassmorphic Data-Industrialism," bridges the gap between the legacy reliability of a Bloomberg Terminal and the predictive power of modern AI. 

The brand personality is authoritative, surgical, and discreet. It prioritizes information density over white space, ensuring that legal professionals have the maximum amount of relevant data visible without cognitive overload. Visual cues are used strategically to guide the eye through complex hierarchies of case law, statutes, and risk assessments. This design system evokes a sense of "technological sovereignty"—giving the user total control over vast datasets through a highly refined, translucent, and structured interface.

## Colors
The palette is rooted in a "Deep Obsidian" foundation, providing a low-strain environment for extended research sessions. 

- **Primary & Secondary:** Deep Obsidian and Midnight Slate form the structural layers. These are used for backgrounds and container surfaces to create a sense of depth and hierarchy.
- **Electric Indigo:** Reserved strictly for primary calls to action, active AI processing states, and critical interactive nodes.
- **Semantic Accents:** Emerald Green indicates verified safety or positive legal precedents, while Amber Gold highlights risks, warnings, or conflicting case law.
- **AI States:** Subtle gradients from Indigo to Violet are applied to borders and progress indicators to signify generative or analytical background tasks.

## Typography
This design system utilizes a dual-font approach to distinguish between interface controls and raw legal data.

- **Inter:** Used for all UI elements, headers, and navigation. Its neutral, systematic nature ensures clarity in high-density layouts. Headlines use Semi-bold to Bold weights to anchor sections.
- **JetBrains Mono:** Employed for "Data Snippets"—excerpts from legal documents, citations, and code-like structures. The monospaced nature of the font allows for precise alignment of vertical data columns, making it easier for users to scan for specific patterns or reference numbers.
- **Hierarchy:** We use a tight scale to maintain density. Text smaller than 11px is avoided to ensure readability, utilizing all-caps and increased tracking for labels to maintain professional rigor.

## Layout & Spacing
The layout philosophy is built on a **12-column Fluid Grid** with a "Compact" density scale. 

- **Grid:** Columns are separated by 12px gutters, allowing for more data points per row compared to standard SaaS layouts.
- **Responsive Behavior:** On desktop, sidebars are persistent to allow for multi-document cross-referencing. On mobile, the system collapses into a single-column view, prioritizing the "AI Intelligence Summary" at the top of the scroll.
- **Rhythm:** A 4px baseline grid governs all spacing. Vertical margins are kept tight (8px-16px) to maximize the "above the fold" information. Content blocks should feel tightly packed but organized through clear borders rather than wide gaps.

## Elevation & Depth
Depth is achieved through **Glassmorphism and Tonal Layering** rather than traditional shadows.

- **Surfaces:** Main content areas use `surface_glass` with a 15px backdrop blur. This allows the background "Deep Obsidian" to peak through, maintaining a sense of place.
- **Layering:** 
  - Level 0: Deep Obsidian (#0F172A) - App Background.
  - Level 1: Midnight Slate (#1E293B) - Navigation bars and side panels.
  - Level 2: Glass Surfaces - Floating modals, tooltips, and data cards.
- **Borders:** Subtle 1px borders in `rgba(255, 255, 255, 0.1)` define boundaries. For active AI states, these borders utilize a "shimmer" animation—a moving linear gradient that tracks the perimeter of the component.

## Shapes
The shape language is "Soft" yet disciplined. A base roundedness of 4px (0.25rem) is applied to most UI components including buttons, input fields, and tags. This slight curve prevents the UI from feeling "sharp" or hostile while maintaining a serious, professional profile. Larger containers and cards may scale up to 8px (0.5rem) to provide a clearer visual distinction for grouped content.

## Components
- **Buttons:** Primary buttons use the Electric Indigo fill. Secondary buttons use a ghost style with a subtle white border. All buttons have a high-hover state with a 10% opacity increase.
- **Data Chips:** Small, 4px rounded labels used for legal citations. Emerald for "Precedent" and Amber for "Risk." They use JetBrains Mono at 11px.
- **Input Fields:** Darker than the surface background with a 1px Midnight Slate border. On focus, the border shimmers with the AI gradient if the field is AI-enhanced.
- **Legal Cards:** Semi-transparent glass containers. They should include a "Quick Action" header and a JetBrains Mono "Metadata" footer.
- **AI Intelligence Pulse:** A specialized component—a small, glowing indigo dot—placed next to titles or data points where the AI has generated fresh insights.
- **Terminal Lists:** High-density list items with 4px vertical padding, separated by 1px dividers, utilizing monospaced text for document IDs.