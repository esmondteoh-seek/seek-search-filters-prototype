# SEEK Design & Development Guidelines

Comprehensive guidance for building accessible, fast, SEEK-brand-aligned UIs with the Braid Design System.

Use **MUST/SHOULD/NEVER** to guide technical decisions.

**Reference**: https://seek-oss.github.io/braid-design-system/

**Local baseline for implementation**: All new UI work **MUST** start from the primitives exported by [`components/braid/index.ts`](components/braid/index.ts). Import them as `@/components/braid` (path alias `@/*` → repo root). Those modules are this project’s aligned component layer—use them before reaching for ad hoc markup, third-party UI kits, or one-off copies of Braid patterns. If something you need is not exported yet, **SHOULD** add or extend a component under `components/braid/` and export it from the barrel so the rest of the app stays consistent.

---

## SEEK Design Principles

These principles define what makes a great SEEK experience. Apply them throughout your design and development process.

### Principle 01: Maximise the Experience

**Create immersive digital interfaces by fully utilizing available space to add layers and depth.**

**Positive indicators:**
- Full viewport utilization with content expanding appropriately
- Layered information architecture with progressive disclosure
- Visual depth through elevation (cards, modals, sheets, panels)
- Immersive full-screen moments for key workflows
- Contextual overlays like bottom sheets and side panels
- Dimensional content relationships rather than flat design

**Warning signs to avoid:**
- Aimless whitespace without intentional purpose
- Single-layer interfaces lacking depth
- Cramped content areas surrounded by empty chrome
- Disconnected modal patterns
- Mobile layouts that fail to adapt to larger screens

**Platform approaches:**
- **Mobile**: Bottom sheets, full-screen flows, gesture-based transitions
- **Desktop**: Side panels, split views, hover-activated depth
- **Tablet**: Hybrid master-detail patterns

### Principle 02: Bring the Marketplace to Life

**Create vibrant, energetic marketplace experiences by emphasizing presence and activity through real-time indicators, trending content, and interactive features.**

**Positive indicators:**
- Real-time activity signals (jobs posted, applications in progress)
- Social proof elements (view counts, application numbers)
- Trending and popular content surfacing
- Recency indicators (timestamps like "posted 2 hours ago")
- Active status signals (quick-responding employers)
- Dynamic content responding to activity
- Notification badges and activity feeds
- Live counters and progress indicators

**Warning signs to avoid:**
- Static content without timestamps or signals
- No marketplace activity or popularity indicators
- Missing social proof for decision-making contexts
- Stale-feeling interfaces lacking temporal relevance
- No feedback when user actions affect the marketplace

**Audience-specific signals:**
- **Candidates** need trending jobs, application status, competitor interest, personalized new listings
- **Hirers** benefit from application counts, candidate engagement, comparative performance, real-time notifications
- **Recruiters** require pipeline activity visibility, market trends, client engagement signals

---

## SEEK Quality Framework

When designing and building for SEEK, prioritize these quality pillars in order:

### 01. Embrace Diversity (Highest Priority)

**Core Principle:** Accessibility and cultural sensitivity are non-negotiable.

**Key requirements:**
- **WCAG AA compliance**: 4.5:1 contrast for normal text, 3:1 for large text and UI components
- **Touch targets**: 44×44px mobile, 24×24px desktop minimum
- **Keyboard navigation**: All interactive elements keyboard accessible with visible focus
- **Screen reader support**: Descriptive alt text, proper labels, semantic HTML, aria-live regions
- **Motion sensitivity**: Respect `prefers-reduced-motion` media query
- **Cultural sensitivity**: Appropriate imagery, inclusive language, locally relevant content
- **Representation**: Diverse imagery avoiding stereotypes
- **Readability**: Clear sections, scannable layouts, simple language

### 02. Complex Made Simple

**Core Principle:** Simplify complexity through pragmatic solutions where each element serves a purpose.

**Key tactics:**
- **Reduce cognitive load**: Intuitive navigation, clear CTAs, immediate feedback
- **Streamline decisions**: Apply Hick's Law with limited choices, smart defaults, progressive disclosure
- **Eliminate friction**: Minimize task steps, auto-save, pre-fill fields, avoid dead ends
- **Context-aware interfaces**: Adapt content to user journey stage, surface relevant actions

### 03. Cohesive at Every Touchpoint

**Core Principle:** Leverage Braid design system (80% Braid, 20% custom) for familiar, intuitive design.

**Key requirements:**
- Use 80%+ UI primitives from `@/components/braid` (Braid-aligned building blocks maintained in-repo)
- Document custom patterns when necessary
- Ensure consistency across touchpoints
- Maintain same mental model across devices
- Follow standardized templates for common page types

### 04. Beautifully Crafted

**Core Principle:** Harmonious blend of form, function, and emotion with thoughtful attention to detail.

**Key tactics:**
- **Visual hierarchy**: Size, color, spacing guide attention
- **Responsive design**: Graceful adaptation across devices, appropriate touch targets
- **Functional visuals**: Elements enhance understanding, icons support text
- **Balanced spacing**: Negative space highlights key elements, consistent rhythm
- **Micro-interactions**: Subtle animations provide feedback, smooth transitions

### 05. Purposefully Innovative

**Core Principle:** Introduce novel ideas while maintaining usability and accessibility.

**Key tactics:**
- **Strive for originality**: Distinctive elements differentiate SEEK
- **Leverage technology**: AI/ML features enhance experience when purposeful
- **Balance with usability**: New patterns remain learnable, respect familiar conventions
- **Use trends wisely**: Selective adoption with purpose, maintain unique identity

---

## 0. Braid First (via `@/components/braid`)

- **MUST**: Use `@/components/braid` as the primary import path for UI building blocks (`Button`, `TextField`, `Checkbox`, `RadioGroup`, `Tabs`, `Dialog`, `Box`, `Stack`, `Columns`, `Tiles`, etc.). The canonical export list is [`components/braid/index.ts`](components/braid/index.ts).
- **MUST**: Use Braid themes and tones (`positive`, `critical`, `caution`, `neutral`, `info`, `promote`) instead of custom hex colours—express them through the props and tokens supported by the local components.
- **MUST**: Use layout primitives from `@/components/braid` (`Box`, `Stack`, `Columns`, `Tiles`, `Inline`, …) instead of manual margins/padding except where a primitive cannot express the layout.
- **MUST**: Keep code understandable to non-developers—Braid favours simple, composable APIs; preserve that shape when composing local exports.
- **SHOULD**: Prototype in **Braid Playroom** before generating custom code, then implement using `@/components/braid` so behaviour and visuals stay aligned with this codebase.
- **NEVER**: Re-implement components already provided under `components/braid/` or duplicate them under another folder for the same role.
- **SHOULD**: When upstream Braid exposes something not yet in `components/braid/`, add a thin wrapper or re-export under `components/braid/` and barrel-export it rather than scattering direct `braid-design-system` imports across features.

---

## Technical Implementation Guidelines

The following sections (1-13) provide technical best practices for web development. **Always prioritize `@/components/braid` exports and their design tokens over bespoke markup.** These guidelines complement Braid-aligned usage—they don't replace the local component layer.

**Key principle**: If a primitive exists in [`components/braid/index.ts`](components/braid/index.ts), import it from `@/components/braid`. Only apply custom solutions when there is no suitable export yet; in that case extend `components/braid/` and document patterns following the 80/20 Rule above.

---

## 1. Interactions

### Keyboard

- **MUST**: Full keyboard support per [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)
- **MUST**: Visible focus rings (`:focus-visible`; group with `:focus-within`)
- **MUST**: Manage focus (trap, move, return) per APG patterns for overlays
- **NEVER**: `outline: none` without visible focus replacement via `@/components/braid` / theme

### Targets & Input

- **MUST**: Hit target ≥24px desktop, ≥44px mobile; expand hit area if visual \<24px
- **MUST**: Mobile `<input>` font-size ≥16px to prevent iOS zoom
- **NEVER**: Disable browser zoom (`user-scalable=no`, `maximum-scale=1`)
- **MUST**: `touch-action: manipulation` to prevent double-tap zoom
- **SHOULD**: Align `-webkit-tap-highlight-color` with the active theme used by `@/components/braid`
- **MUST**: If it looks clickable, it must be clickable—no dead visual affordances

---

## 2. Forms

### Inputs & Labels

- **MUST**: Use form components from `@/components/braid` (`TextField`, `PasswordField`, `Dropdown`, `Autosuggest`, `Checkbox`, `RadioGroup`, `Textarea`, `MonthPicker`, …)
- **MUST**: Every control has a programmatically associated label; clicking label focuses/toggles control
- **MUST**: Correct `type`, `inputMode`, and `autoComplete` for right keyboard/validation/autofill
- **SHOULD**: Disable spellcheck for emails, codes, usernames

### Hydration & Loading

- **MUST**: Inputs are hydration-safe (no lost focus/value after React hydration)
- **NEVER**: Block paste in `<input>`/`<textarea>` (including passwords and OTPs)
- **MUST**: Loading buttons show spinner while keeping original label

### Submission & Validation

- **MUST**: Enter submits single focused input; in `<textarea>`, ⌘/Ctrl+Enter submits
- **MUST**: Keep submit enabled until request starts; then disable with spinner; use idempotent endpoints
- **MUST**: Accept free text, validate after—don't block typing
- **MUST**: Allow incomplete form submission to surface validation errors
- **MUST**: Errors inline next to fields; on submit, focus first error
- **MUST**: Trim values to handle trailing whitespace

### Security & Assistive Tools

- **MUST**: Warn on unsaved changes before navigation
- **MUST**: Compatible with password managers & 2FA; allow pasting codes; use appropriate `autoComplete` tokens
- **MUST**: No dead zones on checkboxes/radios—label and control share one generous hit target

---

## 3. State & Navigation

- **MUST**: URL reflects state—filters, tabs, pagination, expanded panels must be deep-linkable
- **MUST**: Back/Forward restores scroll position
- **MUST**: Links use `<a>`/`<Link>` for navigation; support Cmd/Ctrl-click, middle-click
- **NEVER**: Use `<div onClick>` or `<button>` for navigation when link is semantically correct

---

## 4. Feedback

- **SHOULD**: Optimistic UI for likely-to-succeed operations; reconcile on response; rollback or Undo on failure
- **MUST**: Confirm destructive actions (e.g. deleting a job ad) or provide Undo window
- **MUST**: Use polite `aria-live` for toasts/inline validation
- **SHOULD**: Ellipsis (`…`) for options opening follow-ups ("Rename…") and loading states ("Saving…")

---

## 5. Touch & Drag

- **MUST**: Generous targets, clear affordances; avoid finicky precision interactions
- **MUST**: Delay first tooltip in a group; subsequent peers show instantly
- **MUST**: `overscroll-behavior: contain` in modals/drawers to prevent scroll chaining
- **MUST**: During drag, disable text selection and apply `inert` to dragged elements

---

## 6. Animation

- **MUST**: Honor `prefers-reduced-motion`—provide reduced variant or disable
- **MUST**: Use built-in animations from `@/components/braid` where available (e.g., `Dialog`, `Drawer`, `Accordion`)
- **SHOULD**: For custom animations, prefer CSS \> Web Animations API \> JS libraries
- **MUST**: Animate compositor-friendly props only (`transform`, `opacity`)
- **NEVER**: Animate layout props (`top`, `left`, `width`, `height`)
- **NEVER**: `transition: all`—list properties explicitly
- **SHOULD**: Animate only to clarify cause/effect or add deliberate delight—avoid gratuitous motion
- **MUST**: Animations interruptible and input-driven (no autoplay loops)
- **MUST**: Correct `transform-origin`—motion starts where it physically should
- **MUST**: SVG transforms on `<g>` wrapper with `transform-box: fill-box`
- **NEVER**: Override `@/components/braid` component animations unless documenting a justified custom pattern

---

## 7. Layout

- **SHOULD**: Use layout primitives from `@/components/braid` (`Box`, `Stack`, `Columns`, `Tiles`, `Inline`, `ContentBlock`, `PageBlock`, `Bleed`, …—see barrel exports)
- **SHOULD**: Optical alignment—adjust ±1px when perception beats geometry
- **MUST**: Deliberate alignment to grid/baseline/edges—no accidental placement
- **SHOULD**: Balance icon/text lockups (weight/size/spacing/tone)
- **MUST**: Verify mobile, tablet, desktop, wide (simulate ultra-wide at ~50% zoom)
- **MUST**: Respect safe areas (`env(safe-area-inset-*)`)
- **MUST**: Avoid unwanted scrollbars; fix overflows at source
- **SHOULD**: Flex/grid over JS measurement for layout

### Spacing Scale

Braid's standard white space scale: `none`, `xxsmall`, `xsmall`, `small`, `medium`, `gutter`, `large`, `xlarge`, `xxlarge`, `xxxlarge`

Responsive example:
\`\`\`jsx
<Stack space={{ mobile: 'small', tablet: 'medium', desktop: 'large' }}>
\`\`\`

---

## 8. Content & Accessibility

### Content & States

- **SHOULD**: Inline help first; tooltips as last resort for additional hints
- **MUST**: Skeletons mirror final content structure to avoid layout shift
- **MUST**: `<title>` matches current page context
- **MUST**: No dead ends—always offer next step or recovery path
- **MUST**: Design empty, sparse, dense, and error states explicitly

### Typography & Numbers

- **SHOULD**: Curly quotes (" "); avoid widows/orphans (`text-wrap: balance`)
- **MUST**: `font-variant-numeric: tabular-nums` for number comparisons (salaries, counts, metrics)

### Status & Semantics

- **MUST**: Redundant status cues—never rely on colour alone; pair tones with icons and/or text
- **MUST**: Accessible names exist even when visuals omit labels; icon-only buttons need `aria-label`
- **MUST**: Use `…` character (not `...`)

### Headings, Links & Locale

- **MUST**: Hierarchical headings (`<h1>`–`<h6>`); include "Skip to content" link
- **MUST**: `scroll-margin-top` on headings to avoid sticky header occlusion
- **MUST**: Resilient to user-generated content—handle short, average, and very long strings
- **MUST**: Locale-aware formatting (`Intl.DateTimeFormat`, `Intl.NumberFormat`)—use language preferences, not IP
- **MUST**: Non-breaking spaces for glued terms (`10&nbsp;MB`, keyboard shortcuts, brand names)

### Accessibility Tree

- **MUST**: Accurate `aria-label`/`aria-labelledby`; decorative elements use `aria-hidden="true"`
- **MUST**: Prefer native semantics (`button`, `a`, `label`, `table`) before ARIA roles

---

## 9. Content Handling

- **MUST**: Text containers handle long content (`truncate`, `line-clamp`, `break-words`)
- **MUST**: Flex children need `min-width: 0` to allow truncation
- **MUST**: Handle empty states—no broken UI for empty strings/arrays

---

## 10. Performance

- **SHOULD**: Test iOS Low Power Mode, macOS Safari, lower-end devices, throttled networks
- **MUST**: Measure reliably—disable extensions that skew runtime
- **MUST**: Track and minimize React re-renders (React DevTools/React Scan)
- **MUST**: Batch layout reads/writes; avoid reflows/repaints
- **MUST**: Mutations (`POST`/`PATCH`/`DELETE`) target \<500ms; show progress if longer
- **SHOULD**: Prefer uncontrolled inputs; controlled inputs must be cheap per keystroke
- **MUST**: Virtualize large lists (\>50 items) or use `content-visibility: auto`
- **MUST**: Preload above-fold images; lazy-load the rest; prevent CLS with explicit dimensions

---

## 11. Dark Mode & Theming

- **MUST**: Use Braid's theme system (`apac`, `seekJobs`, `seekBusiness`) instead of custom theme implementations
- **MUST**: For dark themes, Braid handles `color-scheme: dark` automatically—don't override
- **SHOULD**: `<meta name="theme-color">` matches page background of active Braid theme
- **NEVER**: Manually style native form elements—use `Dropdown`, `TextField`, etc. from `@/components/braid`, which handle theming consistently

---

## 12. Hydration

- **MUST**: Inputs with `value` need `onChange` (or use `defaultValue`)
- **SHOULD**: Guard date/time rendering against hydration mismatch

---

## 13. Design Tokens & Visual Consistency

- **MUST**: Use Braid's elevation tokens for shadows and depth—never custom box-shadow values
- **MUST**: Use Braid's border radius tokens (`standard`, `large`, `xlarge`, `full`) via `borderRadius` prop
- **MUST**: Use Braid's semantic colour tokens—never hardcode hex/rgb values
- **MUST**: Meet WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text and UI components)
- **MUST**: Use Braid tones (`critical`, `caution`, `positive`, `neutral`, `info`, `promote`) for semantic colour
- **MUST**: For data visualizations, ensure colour-blind-friendly palettes with redundant encodings (patterns, labels, shapes)
- **SHOULD**: Use `Card` from `@/components/braid` for elevated surfaces rather than custom shadows
- **NEVER**: Override Braid's design tokens with custom values unless documenting a justified custom pattern

---

## Braid Tones

| Tone       | Usage                                        | Examples                                             |
| ---------- | -------------------------------------------- | ---------------------------------------------------- |
| `critical` | High risk, urgency, error, failed, delete    | Error messages, overdue status, delete confirmations |
| `caution`  | Low risk, pending, in-progress, needs action | Warnings, drafts, expiring items                     |
| `positive` | Success, complete, approved                  | Confirmations, completed status                      |
| `neutral`  | Default, informational                       | Standard text, secondary actions                     |
| `info`     | Informational, guidance                      | Tips, hints, contextual help                         |
| `promote`  | Marketing, promotional                       | Upsells, featured content                            |

---

## Braid Components

**Import surface in this repo**: Use `@/components/braid`. The authoritative list of exported symbols is [`components/braid/index.ts`](components/braid/index.ts); prefer named imports from that barrel for every new feature.

The groups below mirror Braid’s vocabulary; availability is defined by the barrel—if a name is missing, add it under `components/braid/` first.

**Layout**: `Box`, `Stack`, `Inline`, `Columns`/`Column`, `Tiles`, `Bleed`, `ContentBlock`, `PageBlock`, `Hidden`, `HiddenVisually`

**Typography**: `Text`, `Heading`, `Strong`, `Secondary`, `TextLink`

**Forms**: `TextField`, `PasswordField`, `Textarea`, `Dropdown`, `Autosuggest`, `Checkbox`, `RadioGroup`/`RadioItem`, `Toggle`, `MonthPicker`, `FieldLabel`, `FieldMessage`, `Select`, `TextDropdown`, `SearchField`

**Actions**: `Button`, `ButtonLink`, `IconButton`, `Actions`, `TextLink`

**Feedback**: `Alert`, `Notice`, `Badge`, `Tag`, `Loader`, `ToastProvider`, `useToast`

**Containers**: `Card`, `Accordion`, `AccordionItem`, `Disclosure`, `Dialog`, `Drawer`, `TabsProvider`, `Tabs`, `Tab`, `TabPanels`, `TabPanel`

**Navigation**: `Pagination`, `OverflowMenu`, `MenuItem`, `MenuItemCheckbox`, `MenuItemDivider`

**Data**: `List`, `ListItem`, `TickList`, `TickListItem`, `Divider`, `Rating`

**Utilities**: `Tooltip`, `Avatar`

*(Hooks such as `useResponsiveValue`, `useColor`, `useSpace`, or `BraidProvider` may come from `braid-design-system` only when wiring app-level theme/provider setup—feature UI still composes `@/components/braid`.)*

---

## Setup

**Feature and page UI** — import from the local barrel:

\`\`\`tsx
import { Text, Stack, Button } from '@/components/braid';

export const Example = () => (
  <Stack space="medium">
    <Text>Hello World!</Text>
    <Button type="button">Action</Button>
  </Stack>
);
\`\`\`

**App shell / full Braid runtime** (optional, only if this project uses `BraidProvider` from the package):

\`\`\`jsx
import 'braid-design-system/reset'; // Must be first when using BraidProvider
import apacTheme from 'braid-design-system/themes/apac';
import { BraidProvider } from 'braid-design-system';
import { Text } from '@/components/braid';

export const App = () => (
  <BraidProvider theme={apacTheme}>
    <Text>Hello World!</Text>
  </BraidProvider>
);
\`\`\`

**Themes** (when using `braid-design-system` provider): `apac`, `seekJobs`, `seekBusiness`, `docs`, `wireframe`

---

## Custom Pattern Guidelines (The 80/20 Rule)

**SEEK adheres to an 80/20 rule: 80% standard Braid components, 20% custom patterns for innovation.**

### When Custom Work is Acceptable

Custom patterns require:
- **Justification**: Clear reason why Braid components don't meet the need
- **Documentation**: Pattern documented for team reuse
- **Accessibility**: WCAG AA compliance maintained
- **Consistency**: Applied consistently across similar contexts

**Acceptable scenarios:**
- Unique SEEK features not covered by generic design systems
- Complex data visualizations (charts, graphs, dashboards)
- Market-specific needs (e.g., Thai salary formatting)
- Advanced interactions beyond Braid's scope

### When Custom Work is Unacceptable

**Do NOT create custom versions of:**
- Buttons, links, inputs (use `@/components/braid` `Button`, `TextLink`, `TextField`, …)
- Layout and spacing (use `Box`, `Stack`, `Columns`, `Tiles`, …)
- Typography (use `Text`, `Heading`, `Strong`, `Secondary`, …)
- Form controls (use `Checkbox`, `RadioGroup`, `Dropdown`, …)
- Standard modals/dialogs (use `Dialog`, `Drawer`)

**Prioritize convenience over custom work:**
- If `@/components/braid` exports it, use it—even if your design is "slightly different"
- Adapt your design to the shared primitives rather than forking duplicates outside `components/braid/`
- Custom styling purely for visual preference is not acceptable

---

## Applying Principles in Practice

### Integration Example: Job Detail Page

**Maximise the Experience:**
- Layered sheet pattern over search results
- Expandable company panels showing hiring volume
- Full-screen application flow when user commits

**Bring the Marketplace to Life:**
- Real-time viewer count ("12 people viewing")
- Recency indicator ("Posted 2 hours ago")
- Social proof ("87 applications, 5 new today")
- Employer responsiveness badge

**Quality Framework:**
- `@/components/braid` throughout (Dialog, Card, Button, Badge)
- WCAG AA contrast on all text and interactive elements
- Keyboard navigation through all layers
- Responsive layout from mobile to ultra-wide

### Trade-offs and Resolution

**Maximise vs. Simplicity:**
- Layering shouldn't introduce complexity; each layer must serve a genuine purpose
- Ask: Does this layer help users achieve their goals?

**Marketplace Activity vs. Cognitive Overload:**
- Real-time data should inform without distracting
- Hierarchy must prioritize relevant information
- Use Braid tones to differentiate signal types

**Resolution Strategy:**
When principles conflict, ask whether the addition helps users achieve their goals. If yes, balance thoughtfully; if no, simplify.

---

## SEEK Resources

- **Braid Design System**: https://seek-oss.github.io/braid-design-system/
- **Playroom**: https://seek-oss.github.io/braid-design-system/playroom/
- **GitHub**: https://github.com/seek-oss/braid-design-system

**Internal (SEEK employees)**:
- `#braid-design-support` — Design questions
- `#braid-support` — Implementation questions

---

## Decision Tree

\`\`\`
Need a UI element?
├─ Exported from components/braid/index.ts? → import from @/components/braid
├─ Layout/spacing? → Box, Stack, Columns, Tiles, Inline (from @/components/braid)
├─ Semantic colour? → Use tone prop (positive, critical, etc.) on local primitives
├─ Custom styling? → Box / component props first (still @/components/braid)
└─ Still need custom? → Add under components/braid/ + barrel export; then vanilla-extract / CSS vars aligned with tokens if necessary
\`\`\`
