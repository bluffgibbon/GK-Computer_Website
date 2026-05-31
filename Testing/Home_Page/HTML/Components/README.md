# GK Computer Website Components

## Overview

This folder contains the HTML fragments used to assemble the `Testing/Home_Page` UI. The page is built at runtime by [`../Java_Script/JS_Init.js`](../Java_Script/JS_Init.js), which loads these files into placeholder containers and then initializes the matching JavaScript behavior.

There are two main patterns in this folder:

- standalone page sections such as the banner, header, welcome section, services section, footer, and scroll buttons
- shell-plus-subcomponent systems, where a base container loads first and item fragments are appended after, used by the main navigation and the services side menu

## Quick Start

1. Check [`../Java_Script/JS_Init.js`](../Java_Script/JS_Init.js) to confirm which file is actually loaded.
2. Edit the smallest fragment that owns the content or structure you need.
3. Treat IDs, BEM-like classes, and `data-service-key` values as contracts.
4. If a file looks duplicated, verify the load path before editing both copies.

## Runtime Assembly

### Load Order

`JS_Init.js` currently assembles the page in this order:

1. [`00_Top_Banner.html`](./00_Top_Banner.html)
2. [`01_Header_Brand_Bar.html`](./01_Header_Brand_Bar.html)
3. [`02_Main_Navigation_Bar/02_Main_Navigation_Bar.html`](./02_Main_Navigation_Bar/02_Main_Navigation_Bar.html)
4. nav subcomponents `02a` through `02f`
5. [`02_Main_Navigation_Bar/02B_Table_Of_Contents.html`](./02_Main_Navigation_Bar/02B_Table_Of_Contents.html)
6. [`03_Section_Welcome.html`](./03_Section_Welcome.html)
7. [`04_Section_Why_Choose_Us.html`](./04_Section_Why_Choose_Us.html)
8. [`05_Section_Services.html`](./05_Section_Services.html)
9. [`06_Footer.html`](./06_Footer.html)
10. [`07_Side_Menu_Services/07_Side_Menu_Services.html`](./07_Side_Menu_Services/07_Side_Menu_Services.html)
11. side-menu service subcomponents `07a` through `07m`
12. [`08_Scroll_Buttons.html`](./08_Scroll_Buttons.html)

### JavaScript Ownership

| UI area | Owning JavaScript |
| --- | --- |
| theme buttons in top banner | [`../Java_Script/JS_Theme.js`](../Java_Script/JS_Theme.js) |
| header logo lightbox | [`../Java_Script/JS_Logo.js`](../Java_Script/JS_Logo.js) |
| main navigation | [`../Java_Script/JS_Navigation.js`](../Java_Script/JS_Navigation.js) |
| nav flyout hover behavior | [`../Java_Script/04_Flyout_Panel.js`](../Java_Script/04_Flyout_Panel.js) |
| nav appointment calendar | [`../Java_Script/05_Flyout_Calendar.js`](../Java_Script/05_Flyout_Calendar.js) |
| welcome CTA appointment shortcut | [`../Java_Script/JS_Appointment.js`](../Java_Script/JS_Appointment.js) |
| Why Choose Us and shared modal behavior | [`../Java_Script/JS_WhyChooseUs.js`](../Java_Script/JS_WhyChooseUs.js) |
| side menu and service flyouts | [`../Java_Script/JS_Side_Menu.js`](../Java_Script/JS_Side_Menu.js) |
| scroll buttons and anchors | [`../Java_Script/JS_Scroll.js`](../Java_Script/JS_Scroll.js) |
| overall component orchestration | [`../Java_Script/JS_Init.js`](../Java_Script/JS_Init.js) |

## Component Map

### Top-Level Components

| File | Role | Key contracts | Notes |
| --- | --- | --- | --- |
| [`000_CSS_Links.html`](./000_CSS_Links.html) | stylesheet include fragment | `<link rel="stylesheet">` tags | utility-like include list, not a full manifest |
| [`00_Top_Banner.html`](./00_Top_Banner.html) | status banner and theme toggle | `#top-banner`, `.Theme--dark`, `.Theme--light` | contains a stray trailing `.` after the closing paragraph |
| [`01_Header_Brand_Bar.html`](./01_Header_Brand_Bar.html) | brand/header shell | `#header-logo-section`, `#hamburger-menu_left`, `.site-header__logo--clickable` | shared contract with logo lightbox and side menu |
| [`03_Section_Welcome.html`](./03_Section_Welcome.html) | hero / welcome section | `#section-welcome`, `.welcome__cta-button` | uses inline `openAppointmentSchedulerFlyout()` |
| [`04_Section_Why_Choose_Us.html`](./04_Section_Why_Choose_Us.html) | Why Choose Us cards plus modal shell | `.why-choose-us__card`, `.why-choose-us__icon`, `#why-choose-us-card-modal` | modal is reused outside this section |
| [`05_Section_Services.html`](./05_Section_Services.html) | services card grid | `.service-card[data-service-key]` | routes into side-menu service details |
| [`06_Footer.html`](./06_Footer.html) | footer content and media strip | `.footer__bottom-images img`, `.footer__bottom-copy` | footer images are modal triggers |
| [`08_Scroll_Buttons.html`](./08_Scroll_Buttons.html) | floating page scroll controls | `#scroll-to-top-button`, `#scroll-to-bottom-button` | intentionally minimal |

### Navigation System

**Shell**

- [`02_Main_Navigation_Bar/02_Main_Navigation_Bar.html`](./02_Main_Navigation_Bar/02_Main_Navigation_Bar.html)
- Defines `#main-navigation` and `.main-navigation__list`
- Receives appended nav item fragments from `JS_Init.js`

**Shared nav fragment contract**

- `.main-navigation__item.main-navigation__item--has-dropdown`
- `.main-navigation__link`
- `.main-navigation__dropdown-arrow`
- `.main-navigation__dropdown`
- `.main-navigation__dropdown-item--has-flyout`
- `.main-navigation__flyout`

**Files**

| File | Role | Notes |
| --- | --- | --- |
| [`02_Main_Navigation_Bar/02a_Nav_About.html`](./02_Main_Navigation_Bar/02a_Nav_About.html) | About Me / Portfolio | includes image-supported flyouts |
| [`02_Main_Navigation_Bar/02b_Nav_Terms.html`](./02_Main_Navigation_Bar/02b_Nav_Terms.html) | Terms and Conditions | more text-heavy than the other nav files |
| [`02_Main_Navigation_Bar/02B_Table_Of_Contents.html`](./02_Main_Navigation_Bar/02B_Table_Of_Contents.html) | in-page table of contents | tied to smooth scrolling |
| [`02_Main_Navigation_Bar/02c_Nav_Privacy.html`](./02_Main_Navigation_Bar/02c_Nav_Privacy.html) | Privacy Policy | long-form informational content |
| [`02_Main_Navigation_Bar/02d_Nav_Schedule.html`](./02_Main_Navigation_Bar/02d_Nav_Schedule.html) | Schedule a Service | hosts the appointment hooks and form surface |
| [`02_Main_Navigation_Bar/02e_Nav_Payment.html`](./02_Main_Navigation_Bar/02e_Nav_Payment.html) | Payment and Pricing | informational dropdown |
| [`02_Main_Navigation_Bar/02f_Nav_Support.html`](./02_Main_Navigation_Bar/02f_Nav_Support.html) | Support and FAQ | support and contact content |

### Side Menu System

**Active load path**

- [`07_Side_Menu_Services/07_Side_Menu_Services.html`](./07_Side_Menu_Services/07_Side_Menu_Services.html)
- then [`07a_Service_Computer_Repair.html`](./07_Side_Menu_Services/07a_Service_Computer_Repair.html) through [`07m_Service_Ewaste.html`](./07_Side_Menu_Services/07m_Service_Ewaste.html)

**Shell contract**

- `.hover-label-container`
- `#sideMenu`
- `#sideMenuCloseArrow`
- the `<ul>` that receives appended service items

**Service fragment contract**

- `.side-menu__item--has-flyout`
- `.side-menu__flyout-label`
- `.side-menu__flyout-arrow`
- `.side-menu__flyout`
- `.flyout__content`
- `.flyout__text-col`

**Service files**

| File | Primary key |
| --- | --- |
| [`07a_Service_Computer_Repair.html`](./07_Side_Menu_Services/07a_Service_Computer_Repair.html) | `computer-repair` |
| [`07b_Service_Laptop.html`](./07_Side_Menu_Services/07b_Service_Laptop.html) | `laptop-repair` |
| [`07c_Service_Software.html`](./07_Side_Menu_Services/07c_Service_Software.html) | `software-installation` |
| [`07d_Service_Custom_PC.html`](./07_Side_Menu_Services/07d_Service_Custom_PC.html) | `custom-pc` |
| [`07e_Service_Networking.html`](./07_Side_Menu_Services/07e_Service_Networking.html) | `networking` |
| [`07f_Service_Website.html`](./07_Side_Menu_Services/07f_Service_Website.html) | `website-services` |
| [`07g_Service_Data_Recovery.html`](./07_Side_Menu_Services/07g_Service_Data_Recovery.html) | `data-recovery` |
| [`07h_Service_Virus.html`](./07_Side_Menu_Services/07h_Service_Virus.html) | `virus-removal` |
| [`07i_Service_IT_Consulting.html`](./07_Side_Menu_Services/07i_Service_IT_Consulting.html) | `it-consulting` |
| [`07j_Service_Elder_Tech.html`](./07_Side_Menu_Services/07j_Service_Elder_Tech.html) | `elderly-tech` |
| [`07k_Service_Mobile.html`](./07_Side_Menu_Services/07k_Service_Mobile.html) | `mobile-repair` |
| [`07l_Service_AI.html`](./07_Side_Menu_Services/07l_Service_AI.html) | `ai-services` |
| [`07m_Service_Ewaste.html`](./07_Side_Menu_Services/07m_Service_Ewaste.html) | `ewaste` |

**Critical contract**

The `data-service-key` values in [`05_Section_Services.html`](./05_Section_Services.html) must stay aligned with the matching side-menu fragments. That mapping is how service cards open the correct service flyout.

## Known Risks

### Duplicate Side-Menu File

There are two files named `07_Side_Menu_Services.html`:

- [`07_Side_Menu_Services/07_Side_Menu_Services.html`](./07_Side_Menu_Services/07_Side_Menu_Services.html)
- [`07_Side_Menu_Services.html`](./07_Side_Menu_Services.html)

The nested file is the active modular shell used by `JS_Init.js`. The root-level file is much larger and appears to inline full service content, which makes it likely to be a legacy or duplicate artifact.

### Tight DOM Coupling

These files are tightly bound to JavaScript and CSS selectors. Renaming any of the following without updating the other layers will break behavior:

- `#main-navigation`
- `.main-navigation__list`
- `#sideMenu`
- `#hamburger-menu_left`
- `.service-card[data-service-key]`
- `#why-choose-us-card-modal`
- `#scroll-to-top-button`
- `#scroll-to-bottom-button`

### Content and Behavior Are Mixed

Several fragments carry both business copy and behavior hooks in the same file. That is practical for a static site, but it raises the risk of breaking interaction logic during content-only edits.

### Runtime Assembly Depends on Ordering

Composite systems work only because the shell loads before the appended subcomponents. If part of that load fails, the page can degrade into incomplete UI with little visible error reporting.

## Editing Guidance

- Use [`../Java_Script/JS_Init.js`](../Java_Script/JS_Init.js) to confirm which fragment is active.
- Prefer editing the smallest owning fragment over editing a large duplicate.
- Keep IDs, BEM-like classes, and `data-service-key` values stable unless you are updating all dependent layers.
- When changing navigation or side-menu structure, verify both desktop and mobile behavior.
- When a component seems duplicated, confirm the load path before making parallel edits.

If this folder is going to be maintained long-term, the next cleanup target should be deciding whether the root-level [`07_Side_Menu_Services.html`](./07_Side_Menu_Services.html) is still needed at all.