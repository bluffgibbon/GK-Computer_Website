# GK Computer Website CSS

## Overview

This folder contains the stylesheet system for the `Testing/Home_Page` build of the GK Computer Website. The CSS is organized as a layered cascade with numbered folders that communicate both ownership and expected load order.

At a high level, the structure is:

- `00_Global_Settings` for tokens, reset, typography, utilities, and global theme helpers
- `01` through `11` for component and section styling
- `12_Responsive` for breakpoint overrides
- `13_Light_Theme` for section-level light-theme overrides
- `14_Consent` for the first-visit consent overlay

This is plain CSS with no preprocessor or bundling layer, so import order and naming discipline are the main tools keeping the cascade predictable.

## Quick Start

1. Start with the folder number. It usually tells you both the UI area and where the file sits in the cascade.
2. Change the most local file that owns the behavior before adding broad overrides.
3. If you are editing light mode, check both `00_Global_Settings` and `13_Light_Theme`.
4. If you are editing mobile behavior, check `12_Responsive` before adding new responsive rules elsewhere.

## Cascade Model

The stylesheet system is intended to load in layers:

1. global foundations
2. component and section defaults
3. responsive overrides
4. theme overrides
5. feature overlays such as consent

In practice, later layers are expected to refine earlier ones rather than compete with them.

## Folder Map

| Folder | Purpose | Notes |
| --- | --- | --- |
| [`00_Global_Settings`](./00_Global_Settings) | tokens, reset, typography, utilities, base animation helpers | foundation layer |
| [`01_Top_Banner`](./01_Top_Banner) | top banner layout, content, status, background, theme toggle | component module |
| [`02_Header`](./02_Header) | header shell, hamburger, brand, trust, CTA styling | component module |
| [`03_Navigation_Bar`](./03_Navigation_Bar) | fixed nav shell, links, list layout, scroll behavior | component module |
| [`04_Navigation_Drop_Down_Menu`](./04_Navigation_Drop_Down_Menu) | dropdowns, nav flyouts, appointment-flyout styling | component module |
| [`05_Main_Content`](./05_Main_Content) | page container, title bar, table of contents, shared content framing | structural layer |
| [`06_Welcome_Section`](./06_Welcome_Section) | hero/welcome section | section module |
| [`07_Why_Choose_Us_Section`](./07_Why_Choose_Us_Section) | Why Choose Us section and modal styling | section module |
| [`08_Services_Section`](./08_Services_Section) | services grid and service cards | section module |
| [`09_Side_Menu`](./09_Side_Menu) | services side menu and flyout panels | component module |
| [`10_Footer`](./10_Footer) | footer layout, columns, links, bottom bar | section module |
| [`11_Scroll_Buttons`](./11_Scroll_Buttons) | scroll button base, position, states | utility component |
| [`12_Responsive`](./12_Responsive) | breakpoint-specific overrides | override layer |
| [`13_Light_Theme`](./13_Light_Theme) | light-theme section overrides | override layer |
| [`14_Consent`](./14_Consent) | consent overlay styling | feature overlay |
| [`12_Responsive_.css`](./12_Responsive_.css) | root-level consolidated responsive file | review / likely legacy |

## Core Ownership

### Foundation

[`00_Global_Settings`](./00_Global_Settings) defines the design system and baseline behavior.

Key files:

- [`00.1_Root_Variables.css`](./00_Global_Settings/00.1_Root_Variables.css): global tokens plus `body.light` variable overrides
- [`00.2_Reset_Base.css`](./00_Global_Settings/00.2_Reset_Base.css): baseline reset
- [`00.3_Body_Background.css`](./00_Global_Settings/00.3_Body_Background.css): page atmosphere and background treatment
- [`00.4_Animations.css`](./00_Global_Settings/00.4_Animations.css): shared animation primitives
- [`00.5_Typography.css`](./00_Global_Settings/00.5_Typography.css): typography defaults
- [`00.6_Utilities.css`](./00_Global_Settings/00.6_Utilities.css): generic helpers
- [`00.7_Light_Theme_Overrides.css`](./00_Global_Settings/00.7_Light_Theme_Overrides.css): early global light-theme corrections

### Component and Section Modules

The numbered component folders follow a consistent pattern:

- `*.1` files usually own layout
- `*.2` files usually own background or shell treatment
- middle files style content, labels, items, links, or subparts
- later files often handle animations, modals, flyouts, or specialized variants

Important modules:

- [`01_Top_Banner`](./01_Top_Banner): banner and theme toggle styling for [../HTML/Components/00_Top_Banner.html](../HTML/Components/00_Top_Banner.html)
- [`02_Header`](./02_Header): header and brand-bar styling for [../HTML/Components/01_Header_Brand_Bar.html](../HTML/Components/01_Header_Brand_Bar.html)
- [`03_Navigation_Bar`](./03_Navigation_Bar): fixed main nav shell
- [`04_Navigation_Drop_Down_Menu`](./04_Navigation_Drop_Down_Menu): dropdown and flyout styling for the nav system
- [`06_Welcome_Section`](./06_Welcome_Section): welcome section
- [`07_Why_Choose_Us_Section`](./07_Why_Choose_Us_Section): Why Choose Us cards, images, and modal styling
- [`08_Services_Section`](./08_Services_Section): services grid and card system
- [`09_Side_Menu`](./09_Side_Menu): side-menu shell and service flyouts
- [`10_Footer`](./10_Footer): footer composition
- [`11_Scroll_Buttons`](./11_Scroll_Buttons): floating scroll controls

These folders are tightly coupled to [../HTML/Components](../HTML/Components) and, for stateful behavior, [../HTML/Java_Script](../HTML/Java_Script).

## Override Layers

### Responsive

[`12_Responsive`](./12_Responsive) contains focused breakpoint overrides instead of a single monolithic file.

Files:

- [`12.1_Header_Responsive.css`](./12_Responsive/12.1_Header_Responsive.css)
- [`12.2_Navigation_Responsive.css`](./12_Responsive/12.2_Navigation_Responsive.css)
- [`12.3_Dropdown_Responsive.css`](./12_Responsive/12.3_Dropdown_Responsive.css)
- [`12.4_Main_Content_Responsive.css`](./12_Responsive/12.4_Main_Content_Responsive.css)
- [`12.5_Welcome_Responsive.css`](./12_Responsive/12.5_Welcome_Responsive.css)
- [`12.6_Services_Responsive.css`](./12_Responsive/12.6_Services_Responsive.css)
- [`12.7_Side_Menu_Responsive.css`](./12_Responsive/12.7_Side_Menu_Responsive.css)
- [`12.8_Footer_Responsive.css`](./12_Responsive/12.8_Footer_Responsive.css)
- [`12.9_Global_Accessibility.css`](./12_Responsive/12.9_Global_Accessibility.css)

### Light Theme

[`13_Light_Theme`](./13_Light_Theme) contains section-level overrides scoped to `body.light`.

It complements, rather than replaces:

- [`00.1_Root_Variables.css`](./00_Global_Settings/00.1_Root_Variables.css)
- [`00.7_Light_Theme_Overrides.css`](./00_Global_Settings/00.7_Light_Theme_Overrides.css)

### Consent

[`14_Consent/14.1_Consent_Overlay.css`](./14_Consent/14.1_Consent_Overlay.css) styles the first-visit consent flow used by [`../HTML/Java_Script/JS_Consent.js`](../HTML/Java_Script/JS_Consent.js). It is relatively self-contained and mostly independent from the rest of the layout system.

## Known Risks

### Root-Level Responsive Duplicate

[`12_Responsive_.css`](./12_Responsive_.css) appears to be a consolidated legacy responsive file at the CSS root. Its contents overlap conceptually with the modular [`12_Responsive`](./12_Responsive) folder, so it should not be treated as the active source of truth without verification.

### Theme Logic Is Split Across Two Layers

Light-theme behavior is divided between:

- global variable and early overrides in `00_Global_Settings`
- section-specific overrides in `13_Light_Theme`

That split works, but it is easy to update only one layer and miss the other.

### Flyout Styling Is Spread Across Multiple Systems

Flyout-related styling lives in both:

- [`04_Navigation_Drop_Down_Menu`](./04_Navigation_Drop_Down_Menu)
- [`09_Side_Menu`](./09_Side_Menu)

These are different UI systems, but they share a visual language. Changes often require review in both places.

### Strict Order Matters

This CSS system depends heavily on deterministic link order. Reordering files or skipping a late override layer can create regressions, especially in mobile and light-theme behavior.

### Tight HTML Coupling

The selectors in this folder map closely to the markup in [../HTML/Components](../HTML/Components). Renaming classes or IDs in HTML without updating CSS will usually fail immediately rather than degrade gracefully.

## Editing Guidance

- Prefer the most local owning file before adding broad overrides.
- Treat `body.light`, responsive files, and component defaults as separate layers with separate responsibilities.
- When editing navigation or flyouts, review both the nav-dropdown CSS and the side-menu CSS if the visual language should stay aligned.
- When editing anything structural, check the matching component fragment in [../HTML/Components](../HTML/Components) and any stateful behavior in [../HTML/Java_Script](../HTML/Java_Script).

If this folder is going to be maintained long-term, the next cleanup target should be deciding whether [`12_Responsive_.css`](./12_Responsive_.css) is still needed and documenting the exact intended stylesheet import order.