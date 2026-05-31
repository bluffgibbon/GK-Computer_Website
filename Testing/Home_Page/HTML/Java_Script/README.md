# GK Computer Website JavaScript

## Overview

This folder contains the client-side behavior for the `Testing/Home_Page` build of the GK Computer Website. The codebase is mostly modular: component loading, navigation, side-menu behavior, consent flow, theme handling, modals, scrolling utilities, and appointment scheduling are split into focused files.

The main exception is [`Home_Java.js`](./Home_Java.js). It duplicates a large portion of the modular system and should be treated as legacy or technical debt unless a page still depends on it.

## Quick Start

1. Start with [`JS_Init.js`](./JS_Init.js) to see how the page is assembled.
2. Edit the smallest module that directly owns the behavior.
3. Treat selectors and component paths as contracts with [../Components](../Components) and [../../CSS](../../CSS).
4. If behavior seems duplicated, verify whether the modular files or [`Home_Java.js`](./Home_Java.js) are actually in the load path.

## Runtime Model

The page is assembled in two phases:

1. HTML fragments are fetched and injected into placeholder containers.
2. Initializer functions run only after the required markup exists.

### Boot Path

[`JS_Init.js`](./JS_Init.js) waits for `DOMContentLoaded`, then uses loader utilities from [`JS_Loader.js`](./JS_Loader.js) to load components and initialize the rest of the system.

High-level dependency flow:

```text
JS_Init.js
  -> JS_Loader.js
  -> JS_Logo.js
  -> JS_Navigation.js
  -> 04_Flyout_Panel.js
  -> 05_Flyout_Calendar.js
  -> JS_WhyChooseUs.js
  -> JS_Side_Menu.js
  -> JS_Scroll.js
```

Adjacent but independently loaded behavior:

- [`JS_Theme.js`](./JS_Theme.js)
- [`JS_Consent.js`](./JS_Consent.js)
- [`JS_Appointment.js`](./JS_Appointment.js)

## Module Map

| File | Role | Status | Key notes |
| --- | --- | --- | --- |
| [`JS_Init.js`](./JS_Init.js) | bootstrap and orchestration | primary entry point | loads components and triggers init callbacks |
| [`JS_Loader.js`](./JS_Loader.js) | HTML fragment loading utilities | stable | fetches and injects fragments, sequential subcomponent loading |
| [`JS_Theme.js`](./JS_Theme.js) | theme toggle and persistence | stable | uses `body.light` / `body.dark`, `localStorage.theme` |
| [`JS_Consent.js`](./JS_Consent.js) | first-run consent flow | stable | depends on `setTheme()` when available |
| [`JS_Navigation.js`](./JS_Navigation.js) | main navigation system | complex / core | fixed nav, dropdowns, flyouts, wheel scroll |
| [`04_Flyout_Panel.js`](./04_Flyout_Panel.js) | hover-driven nav flyout behavior | review overlap | may overlap with JS_Navigation flyout control |
| [`05_Flyout_Calendar.js`](./05_Flyout_Calendar.js) | appointment calendar widget | placeholder data | hardcoded availability and time slots |
| [`JS_Logo.js`](./JS_Logo.js) | logo lightbox | stable | dynamically creates overlay |
| [`JS_Scroll.js`](./JS_Scroll.js) | scroll buttons and anchor scrolling | stable | scroll-to-top/bottom plus smooth anchors |
| [`JS_Appointment.js`](./JS_Appointment.js) | programmatic appointment opener | stable but fragile | relies on fixed selectors and timeouts |
| [`JS_Side_Menu.js`](./JS_Side_Menu.js) | side menu and service flyouts | complex / core | hamburger menu, backdrop, service flyouts |
| [`JS_WhyChooseUs.js`](./JS_WhyChooseUs.js) | shared modal logic | stable | reused for cards, images, header photo, footer media |
| [`Home_Java.js`](./Home_Java.js) | monolithic duplicate | technical debt | overlaps with several modular files |

## Core Modules

### [`JS_Init.js`](./JS_Init.js)

- Owns page startup and component orchestration.
- Loads HTML fragments from [../Components](../Components).
- Ensures initializers run only after the required markup exists.

### [`JS_Loader.js`](./JS_Loader.js)

- Owns `loadComponent()`, `appendComponent()`, and `loadSubComponents()`.
- Uses cache-busted fetch requests to avoid stale local-development content.
- Is the core bridge between static HTML fragments and runtime initialization.

### [`JS_Navigation.js`](./JS_Navigation.js)

- Owns the fixed top navigation bar.
- Manages dropdown state, flyout positioning, outside-click dismissal, Escape handling, and horizontal wheel scrolling.
- Depends on exact nav structure from [../Components/02_Main_Navigation_Bar](../Components/02_Main_Navigation_Bar).

### [`JS_Side_Menu.js`](./JS_Side_Menu.js)

- Owns the hamburger-triggered side menu and its service flyouts.
- Manages backdrop behavior, open/close state, flyout positioning, and service-card routing by `data-service-key`.
- Depends on the shell and service fragments in [../Components/07_Side_Menu_Services](../Components/07_Side_Menu_Services).

### [`JS_WhyChooseUs.js`](./JS_WhyChooseUs.js)

- Owns modal behavior for the Why Choose Us section.
- Reuses the same modal for owner photos, footer images, and service-card content.
- Depends on the shared modal shell defined in [../Components/04_Section_Why_Choose_Us.html](../Components/04_Section_Why_Choose_Us.html).

## Supporting Modules

### UI Utilities

- [`JS_Logo.js`](./JS_Logo.js): clickable logo lightbox
- [`JS_Scroll.js`](./JS_Scroll.js): scroll buttons and smooth anchor navigation
- [`JS_Theme.js`](./JS_Theme.js): theme persistence and toggle behavior

### Appointment Flow

- [`JS_Appointment.js`](./JS_Appointment.js): programmatically opens the schedule flyout and focuses the form
- [`05_Flyout_Calendar.js`](./05_Flyout_Calendar.js): renders the appointment calendar UI and time-slot selector

### Consent Flow

- [`JS_Consent.js`](./JS_Consent.js): first-run terms/privacy/theme flow backed by localStorage

## Important Contracts

### Component Contracts

These modules are tightly coupled to the HTML fragments in [../Components](../Components), especially:

- `#main-navigation`
- `.main-navigation__list`
- `.main-navigation__dropdown`
- `.main-navigation__flyout`
- `#sideMenu`
- `#hamburger-menu_left`
- `.service-card[data-service-key]`
- `#why-choose-us-card-modal`
- `#scroll-to-top-button`
- `#scroll-to-bottom-button`

### Theme Contracts

[`JS_Theme.js`](./JS_Theme.js) expects `body.light` and `body.dark` to be supported by [../../CSS](../../CSS).

### Booking Contracts

[`JS_Appointment.js`](./JS_Appointment.js) and [`05_Flyout_Calendar.js`](./05_Flyout_Calendar.js) depend on schedule-related IDs and form markup inside [../Components/02_Main_Navigation_Bar/02d_Nav_Schedule.html](../Components/02_Main_Navigation_Bar/02d_Nav_Schedule.html).

## Known Risks

### `Home_Java.js` Duplication

[`Home_Java.js`](./Home_Java.js) duplicates major parts of the modular system, including loader logic, navigation logic, side-menu behavior, scroll behavior, appointment flow, and modal behavior. It is the largest maintenance risk in this folder.

### Flyout Overlap

[`JS_Navigation.js`](./JS_Navigation.js) and [`04_Flyout_Panel.js`](./04_Flyout_Panel.js) both participate in flyout behavior for the nav system. If flyouts become unstable, those two files should be reviewed together first.

### Placeholder Scheduling Data

[`05_Flyout_Calendar.js`](./05_Flyout_Calendar.js) currently uses hardcoded availability and time-slot data. It is suitable for UI behavior, but not yet for production-grade scheduling integrity.

### Tight DOM Coupling

Most modules assume exact selectors and component structure. Refactoring markup or class names without updating JavaScript will usually break behavior immediately.

## Editing Guidance

- Prefer the modular files over [`Home_Java.js`](./Home_Java.js).
- When changing nav behavior, check both the JavaScript here and the HTML/CSS for the navigation system.
- When changing service-card or side-menu behavior, verify the `data-service-key` mapping end to end.
- When changing booking behavior, verify both the appointment opener path and the schedule flyout markup.
- When changing theme behavior, verify the matching CSS layers in [../../CSS](../../CSS).

If this folder is going to be maintained long-term, the next cleanup target should be retiring or clearly scoping [`Home_Java.js`](./Home_Java.js) so the modular system becomes the unambiguous source of truth.