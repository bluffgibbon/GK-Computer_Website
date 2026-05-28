/* ============================================================
   GK COMPUTER BUSINESS - HOME JAVASCRIPT (REBUILT)
   Purpose:
   - Component loading (Live Server safe)
   - Header / Nav positioning
   - Nav dropdown hover (RESTORED)
   - Horizontal nav scroll
   - Side menu toggle
   - Smooth scrolling
   - Scroll buttons
============================================================ */

/* ============================================================
   COMPONENT LOADER
============================================================ */
function loadComponent(targetId, filePath, callback) {
    var target = document.getElementById(targetId);
    if (!target) return;

    var cacheBustedPath = filePath + (filePath.indexOf("?") === -1 ? "?" : "&") + "v=" + Date.now();

    fetch(cacheBustedPath, { cache: "no-store" })
        .then(function (res) { return res.text(); })
        .then(function (html) {
            target.innerHTML = html;
            if (typeof callback === "function") callback();
        })
        .catch(function (err) {
            console.error("Component load failed:", filePath, err);
        });
}


/* ============================================================
   NAV INITIALIZATION (ALL NAV LOGIC LIVES HERE)
============================================================ */
function initNavigation() {

    /* ---------- NAV POSITIONING ---------- */
    function positionNav() {
        var header = document.getElementById("header-logo-section");
        var nav = document.getElementById("main-navigation");
        if (!header || !nav) return;

        // Ensure nav bar is fixed below header
        nav.style.position = "fixed";
        nav.style.top = (header.offsetHeight + 31) + "px";
        nav.style.left = "0";
        nav.style.width = "100%";
        nav.style.zIndex = "9999";
    }

    positionNav();
    window.addEventListener("resize", positionNav);


    /* ---------- NAV SCROLL RESET ---------- */
    function resetNavScroll() {
        var scroll = document.querySelector("#main-navigation .nav-scroll");
        if (!scroll) return;
        // Force scroll to Home tab after layout
        setTimeout(function() { scroll.scrollLeft = 0; }, 50);
    }

    // Run on load and after resize (especially for mobile)
    resetNavScroll();
    window.addEventListener("resize", resetNavScroll);


    /* ---------- DROPDOWNS (FULL RESTORE) ---------- */
    var navItems = document.querySelectorAll(
        "#main-navigation .main-navigation__item--has-dropdown"
    );

    var activeDropdown = null;
    var activeItem = null;
    var activeArrow = null;

    function hideDropdown() {
        if (!activeDropdown) return;
        activeDropdown.style.opacity = "0";
        activeDropdown.style.visibility = "hidden";
        activeDropdown.style.pointerEvents = "none";
        activeDropdown.style.transform = "translateY(-10px)";
        if (activeItem) activeItem.classList.remove("active");
        if (activeArrow) activeArrow.textContent = "▾";
        activeDropdown = null;
        activeItem = null;
        activeArrow = null;
        // Close any open flyout panels and reset their arrows when the dropdown dismisses
        document.querySelectorAll(".main-navigation__flyout.is-open").forEach(function (f) {
            f.classList.remove("is-open");
        });
        document.querySelectorAll(".main-navigation__flyout-arrow").forEach(function (a) {
            a.textContent = "▸";
        });
    }

    function showDropdown(item, dropdown, arrow) {
        if (activeDropdown && activeDropdown !== dropdown) {
            hideDropdown();
        }

        activeDropdown = dropdown;
        activeItem = item;
        activeArrow = arrow;
        item.classList.add("active");
        arrow.textContent = "▴";

        var rect = item.getBoundingClientRect();
        dropdown.style.position = "fixed";
        dropdown.style.top = (rect.bottom + 8) + "px";

        // Center two-column dropdowns under the tab
        if (dropdown.classList.contains("main-navigation__dropdown--two-col")) {
            var tabCenter = rect.left + rect.width / 2;
            var dropWidth = dropdown.offsetWidth || 560;
            var centeredLeft = tabCenter - dropWidth / 2;
            // Clamp to viewport
            if (centeredLeft < 8) centeredLeft = 8;
            if (centeredLeft + dropWidth > window.innerWidth - 8) centeredLeft = window.innerWidth - 8 - dropWidth;
            dropdown.style.left = centeredLeft + "px";
        } else {
            dropdown.style.left = rect.left + "px";
        }

        dropdown.style.opacity = "1";
        dropdown.style.visibility = "visible";
        dropdown.style.pointerEvents = "auto";
        dropdown.style.transform = "translateY(0)";
        dropdown.style.zIndex = "99999";
    }

    navItems.forEach(function (item, index) {
        var dropdown = item.querySelector(".main-navigation__dropdown");
        var arrow = item.querySelector(".main-navigation__dropdown-arrow");
        if (!dropdown || !arrow) return;

        dropdown.classList.add(index % 2 === 0 ? "dropdown--teal" : "dropdown--blue");
        document.body.appendChild(dropdown);

        // Click anywhere on the nav item toggles the dropdown
        item.addEventListener("click", function (e) {
            // Don't toggle if clicking a link inside the dropdown itself
            if (dropdown.contains(e.target)) return;

            if (activeDropdown === dropdown) {
                hideDropdown();
            } else {
                showDropdown(item, dropdown, arrow);
            }
        });
    });

    // Close open dropdown when clicking outside the nav
    document.addEventListener("click", function (e) {
        if (!activeDropdown) return;
        var clickedInsideNav = activeItem && activeItem.contains(e.target);
        var clickedInsideDropdown = activeDropdown.contains(e.target);
        if (!clickedInsideNav && !clickedInsideDropdown) {
            hideDropdown();
        }
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
        if ((e.key === "Escape" || e.key === "Esc") && activeDropdown) {
            hideDropdown();
        }
    });

    function repositionDropdown() {
        if (!activeDropdown || !activeItem) return;
        var rect = activeItem.getBoundingClientRect();
        activeDropdown.style.top = (rect.bottom + 8) + "px";
        if (activeDropdown.classList.contains("main-navigation__dropdown--two-col")) {
            var tabCenter = rect.left + rect.width / 2;
            var dropWidth = activeDropdown.offsetWidth || 560;
            var centeredLeft = tabCenter - dropWidth / 2;
            if (centeredLeft < 8) centeredLeft = 8;
            if (centeredLeft + dropWidth > window.innerWidth - 8) centeredLeft = window.innerWidth - 8 - dropWidth;
            activeDropdown.style.left = centeredLeft + "px";
        } else {
            activeDropdown.style.left = rect.left + "px";
        }
    }

    window.addEventListener("scroll", repositionDropdown);
    window.addEventListener("resize", repositionDropdown);


    /* ---------- FLYOUT PANELS ---------- */
    function initFlyouts() {
        var flyoutItems = document.querySelectorAll(".main-navigation__dropdown-item--has-flyout");

        // Create backdrop overlay
        var backdrop = document.createElement("div");
        backdrop.className = "flyout-backdrop";
        document.body.appendChild(backdrop);

        // Clicking backdrop closes all flyouts
        backdrop.addEventListener("click", function () {
            closeAllFlyouts();
        });

        function closeAllFlyouts() {
            document.querySelectorAll(".main-navigation__flyout.is-open").forEach(function (f) {
                f.classList.remove("is-open");
            });
            flyoutItems.forEach(function (item) {
                var a = item.querySelector(".main-navigation__flyout-arrow");
                if (a) a.textContent = "\u25b8";
            });
            backdrop.classList.remove("is-active");
            document.body.classList.remove("flyout-open");
        }

        flyoutItems.forEach(function (item) {
            var flyout = item.querySelector(".main-navigation__flyout");
            var arrow = item.querySelector(".main-navigation__flyout-arrow");
            if (!flyout || !arrow) return;

            // Two-col dropdown: left-column items should open left
            var parentDropdown = item.parentElement;

            // Copy dropdown color class onto flyout before moving to body
            if (parentDropdown) {
                if (parentDropdown.classList.contains("dropdown--teal")) flyout.classList.add("flyout--teal");
                else if (parentDropdown.classList.contains("dropdown--blue")) flyout.classList.add("flyout--blue");
            }

            // Move flyout to body so position:fixed is relative to viewport
            document.body.appendChild(flyout);

            // Explicit override: --flyout-right always opens right
            var forceRight = item.classList.contains("main-navigation__dropdown-item--flyout-right");
            var isTwoCol = parentDropdown && parentDropdown.classList.contains("main-navigation__dropdown--two-col");
            var forceLeft = isTwoCol && !forceRight;

            function getBestSide() {
                if (forceRight) return "right";
                if (forceLeft) return "left";
                var dropdown = item.parentElement;
                if (!dropdown || !dropdown.style.left) return "right";
                var dropLeft = parseFloat(dropdown.style.left) || 0;
                var dropWidth = dropdown.offsetWidth || 220;
                var spaceLeft = dropLeft;
                var spaceRight = window.innerWidth - (dropLeft + dropWidth);
                return spaceLeft > spaceRight ? "left" : "right";
            }

            // Set the initial default arrow based on position (recalculated on open)
            item._defaultArrow = "\u25b8";

            function positionFlyout() {
                var dropdown = item.parentElement;
                if (dropdown && dropdown.style.top) {
                    var dropLeft = parseFloat(dropdown.style.left) || 0;
                    var dropWidth = dropdown.offsetWidth || 220;
                    var side = getBestSide();

                    if (side === "left") {
                        // Open to the left of the dropdown — stretch from viewport left edge to dropdown
                        flyout.style.left = "0";
                        flyout.style.right = (window.innerWidth - dropLeft + 10) + "px";
                        flyout.style.borderLeft = "none";
                        flyout.style.borderRight = "2px solid rgb(200, 0, 30)";
                        flyout.style.boxShadow = "16px 0 48px rgba(0, 0, 0, 0.85)";
                    } else {
                        // Open to the right of the dropdown — stretch from dropdown to viewport right edge
                        flyout.style.left = (dropLeft + dropWidth + 10) + "px";
                        flyout.style.right = "0";
                        flyout.style.borderLeft = "2px solid rgb(200, 0, 30)";
                        flyout.style.borderRight = "none";
                        flyout.style.boxShadow = "-16px 0 48px rgba(0, 0, 0, 0.85)";
                    }
                    flyout.style.top = dropdown.style.top;
                    flyout.style.height = "calc(100vh - " + dropdown.style.top + ")";
                    return side;
                }
                return "right";
            }

            function openFlyout() {
                // Close all other open flyouts and reset their arrows
                flyoutItems.forEach(function (other) {
                    var otherArrow = other.querySelector(".main-navigation__flyout-arrow");
                    if (otherArrow && other !== item) {
                        otherArrow.textContent = other._defaultArrow || "\u25b8";
                    }
                });
                document.querySelectorAll(".main-navigation__flyout.is-open").forEach(function (f) {
                    if (f !== flyout) f.classList.remove("is-open");
                });
                var side = positionFlyout();
                flyout.classList.add("is-open");

                // Always flip arrow when open (◂ = open, ▸ = closed)
                arrow.textContent = "\u25c2";
                item._defaultArrow = "\u25b8";
                item._defaultSide = side;
                backdrop.classList.add("is-active");
                document.body.classList.add("flyout-open");
            }

            function closeFlyout() {
                flyout.classList.remove("is-open");
                // Reset arrow back to default ▸
                arrow.textContent = "\u25b8";
                // Only remove backdrop if no flyouts are open
                if (!document.querySelector(".main-navigation__flyout.is-open")) {
                    backdrop.classList.remove("is-active");
                    document.body.classList.remove("flyout-open");
                }
            }

            // Click anywhere on the row toggles the flyout
            item.addEventListener("click", function (e) {
                e.stopPropagation();
                if (flyout.classList.contains("is-open")) {
                    closeFlyout();
                } else {
                    openFlyout();
                }
            });
        });
    }

    initFlyouts();


    /* ---------- HORIZONTAL WHEEL SCROLL (FULL RESTORE) ---------- */
    var nav = document.getElementById("main-navigation");
    var scrollContainer = nav ? nav.querySelector(".nav-scroll") : null;
    if (nav && scrollContainer) {
        var hoveringNav = false;
        nav.addEventListener("mouseenter", function () { hoveringNav = true; });
        nav.addEventListener("mouseleave", function () { hoveringNav = false; });
        document.addEventListener("wheel", function (e) {
            if (!hoveringNav) return;
            if (scrollContainer.scrollWidth <= scrollContainer.clientWidth) return;
            var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            scrollContainer.scrollLeft += delta;
            e.preventDefault();
        }, { passive: false });
    }
}


/* ============================================================
   LOGO LIGHTBOX
============================================================ */
function initLogoLightbox() {
    var logo = document.querySelector('.site-header__logo--clickable');
    if (!logo) return;

    var overlay = document.createElement('div');
    overlay.id = 'logo-lightbox-overlay';
    overlay.style.cssText = [
        'display:none',
        'position:fixed',
        'inset:0',
        'background:rgba(0,0,0,0.85)',
        'z-index:99999',
        'align-items:center',
        'justify-content:center',
        'cursor:pointer'
    ].join(';');

    var fullImg = document.createElement('img');
    fullImg.src = logo.src;
    fullImg.alt = logo.alt;
    fullImg.style.cssText = [
        'max-width:90vw',
        'max-height:90vh',
        'object-fit:contain',
        'border-radius:8px',
        'box-shadow:0 0 40px rgba(0,212,255,0.3)'
    ].join(';');

    overlay.appendChild(fullImg);
    document.body.appendChild(overlay);

    function openLightbox() {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    logo.addEventListener('click', openLightbox);
    logo.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') openLightbox();
    });
    overlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
        if (overlay.style.display !== 'none' && (e.key === 'Escape' || e.key === 'Esc')) {
            closeLightbox();
        }
    });
}


/* ============================================================
   SIDE MENU
============================================================ */
function initSideMenu() {
    var menu = document.getElementById("sideMenu");
    var btn = document.getElementById("hamburger-menu_left");
    if (!menu || !btn) return;

    function getBackdrop() {
        return document.querySelector(".side-menu-flyout-backdrop");
    }

    function closeSideMenu() {
        menu.classList.remove("active");
        btn.classList.remove("active");
        var bd = getBackdrop();
        if (bd) bd.classList.remove("is-active");
        // Also close any open flyouts
        document.querySelectorAll(".side-menu__flyout.is-open").forEach(function (f) {
            f.classList.remove("is-open");
        });
        document.querySelectorAll(".side-menu__flyout-arrow").forEach(function (a) {
            a.textContent = "▸";
        });
    }

    btn.addEventListener("click", function (e) {
        e.preventDefault();
        var isOpening = !menu.classList.contains("active");
        menu.classList.toggle("active");
        btn.classList.toggle("active");
        var bd = getBackdrop();
        if (bd) {
            if (isOpening) bd.classList.add("is-active");
            else bd.classList.remove("is-active");
        }
    });

    // Only the ◄ arrow span closes the side menu
    var closeArrow = menu.querySelector("#sideMenuCloseArrow");
    if (closeArrow) {
        closeArrow.addEventListener("click", function (e) {
            e.stopPropagation();
            closeSideMenu();
        });
    }

    document.addEventListener("click", function (e) {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            var bd = getBackdrop();
            if (bd && !bd.contains(e.target)) {
                closeSideMenu();
            }
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeSideMenu();
        }
    });
}


/* ============================================================
   SIDE MENU FLYOUTS
============================================================ */
function initSideMenuFlyouts() {
    var items = document.querySelectorAll(".side-menu__item--has-flyout");
    if (!items.length) return;

    // Backdrop — plain rgba overlay, NO backdrop-filter (avoids stacking context bugs)
    var backdrop = document.createElement("div");
    backdrop.className = "side-menu-flyout-backdrop";
    document.body.appendChild(backdrop);
    backdrop.addEventListener("click", function () {
        closeAllFlyouts();
        // Also close the side menu itself
        var sideMenu = document.getElementById("sideMenu");
        var hamburger = document.getElementById("hamburger-menu_left");
        if (sideMenu) sideMenu.classList.remove("active");
        if (hamburger) hamburger.classList.remove("active");
    });

    function closeAllFlyouts() {
        document.querySelectorAll(".side-menu__flyout.is-open").forEach(function (f) {
            f.classList.remove("is-open");
        });
        document.querySelectorAll(".side-menu__flyout-arrow").forEach(function (a) {
            a.textContent = "▸";
        });
        backdrop.classList.remove("is-active");
    }

    function positionFlyout(flyout) {
        var sideMenu = document.getElementById("sideMenu");
        if (!sideMenu) return;
        var rect = sideMenu.getBoundingClientRect();
        flyout.style.left = rect.right + "px";
        flyout.style.top = rect.top + "px";
        flyout.style.height = (window.innerHeight - rect.top) + "px";
    }

    items.forEach(function (item, index) {
        var flyout = item.querySelector(".side-menu__flyout");
        var arrow = item.querySelector(".side-menu__flyout-arrow");
        if (!flyout || !arrow) return;

        // Stamp alternating color classes — drives label bg, flyout bg, and heading color via CSS
        var colorKey = (index % 2 === 0) ? "red" : "teal";
        item.classList.add("item--" + colorKey);
        flyout.classList.add("flyout--" + colorKey);

        document.body.appendChild(flyout);

        function openFlyout() {
            // Close all other open side menu flyouts
            items.forEach(function (other) {
                var a = other.querySelector(".side-menu__flyout-arrow");
                if (other !== item && a) a.textContent = "▸";
            });
            document.querySelectorAll(".side-menu__flyout.is-open").forEach(function (f) {
                if (f !== flyout) f.classList.remove("is-open");
            });
            positionFlyout(flyout);
            flyout.classList.add("is-open");
            arrow.textContent = "◂";
            backdrop.classList.add("is-active");
        }

        function closeFlyout() {
            flyout.classList.remove("is-open");
            arrow.textContent = "▸";
            backdrop.classList.remove("is-active");
        }

        item.addEventListener("click", function (e) {
            e.stopPropagation();
            if (flyout.classList.contains("is-open")) {
                closeFlyout();
            } else {
                openFlyout();
            }
        });
    });

    // Close flyouts when clicking outside the side menu
    document.addEventListener("click", function () {
        closeAllFlyouts();
    });

    window.addEventListener("resize", function () {
        document.querySelectorAll(".side-menu__flyout.is-open").forEach(function (f) {
            positionFlyout(f);
        });
    });
}


/* ============================================================
   SCROLL BUTTONS
============================================================ */
function initScrollButtons() {
    var topBtn = document.getElementById("scroll-to-top-button");
    var bottomBtn = document.getElementById("scroll-to-bottom-button");

    if (topBtn) {
        topBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    if (bottomBtn) {
        bottomBtn.addEventListener("click", function () {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        });

        // Position the bottom button flush under the nav bar
        function positionBottomBtn() {
            var nav = document.getElementById("main-navigation");
            if (nav) {
                var navBottom = nav.getBoundingClientRect().bottom;
                bottomBtn.style.top = (navBottom - 1) + "px";
            }
        }
        positionBottomBtn();
        window.addEventListener("resize", positionBottomBtn);
        window.addEventListener("scroll", positionBottomBtn);
    }
}


/* ============================================================
   SMOOTH ANCHOR SCROLL
============================================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (e) {
            var target = document.querySelector(this.getAttribute("href"));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}


/* ============================================================
   APPOINTMENT FLYOUT SHORTCUT
============================================================ */
function openAppointmentSchedulerFlyout() {
    var navItem = document.getElementById("scheduleAppointmentNavItem");
    var schedulerTrigger = document.getElementById("appointmentSchedulerFlyoutTrigger");

    if (!navItem || !schedulerTrigger) return;

    var dropdown = navItem.querySelector(".main-navigation__dropdown");
    var flyout = schedulerTrigger.querySelector(".main-navigation__flyout");

    if (!dropdown) return;

    navItem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

    var isDropdownOpen = dropdown.style.visibility === "visible" && dropdown.style.pointerEvents === "auto";
    if (!isDropdownOpen) {
        navItem.click();
    }

    window.setTimeout(function () {
        if (flyout && !flyout.classList.contains("is-open")) {
            schedulerTrigger.click();
        }

        window.setTimeout(function () {
            var firstField = document.querySelector("#flyoutAppointmentForm input, #flyoutAppointmentForm select, #flyoutAppointmentForm textarea");
            if (firstField && typeof firstField.focus === "function") {
                firstField.focus();
            }
        }, 60);
    }, 80);
}

window.openAppointmentSchedulerFlyout = openAppointmentSchedulerFlyout;


/* ============================================================
   LOAD COMPONENTS + INITIALIZE
============================================================ */
document.addEventListener("DOMContentLoaded", function () {

    loadComponent("Components-00_Top_Banner", "../HTML/Components/00_Top_Banner.html");
    loadComponent("Components-01_Header_Brand_Bar", "../HTML/Components/01_Header_Brand_Bar.html", initLogoLightbox);
    loadComponent("Components-02_Main_Navigation_Bar","../HTML/Components/02_Main_Navigation_Bar/02_Main_Navigation_Bar.html", function () {
        initNavigation();
        if (typeof initFlyouts === "function") initFlyouts();
        if (typeof initFlyoutCalendar === "function") initFlyoutCalendar();
    });
    initSmoothScroll();
    loadComponent("Components-02B_Table_Of_Contents", "../HTML/Components/02_Main_Navigation_Bar/02B_Table_Of_Contents.html");
    loadComponent("Components-03_Section_Welcome", "../HTML/Components/03_Section_Welcome.html");
    loadComponent("Components-04_Section_Why_Choose_Us", "../HTML/Components/04_Section_Why_Choose_Us.html", initWhyChooseUsCards);
    loadComponent("Components-05_Section_Services", "../HTML/Components/05_Section_Services.html");
    loadComponent("Components-06_Footer", "../HTML/Components/06_Footer.html");
    loadComponent("Components-07_Side_Menu_Services", "../HTML/Components/07_Side_Menu_Services/07_Side_Menu_Services.html", function () {
        initSideMenu();
        initSideMenuFlyouts();
    });
    loadComponent("Components-08_Scroll_Buttons", "../HTML/Components/08_Scroll_Buttons.html", initScrollButtons);
});

function initWhyChooseUsCards() {
    const cards = document.querySelectorAll('.why-choose-us__card');
    const images = document.querySelectorAll('.why-choose-us__images-row .why-choose-us__icon');
    const modal = document.getElementById('why-choose-us-card-modal');
    // Move modal to document.body to escape any stacking context created by
    // the section's animation/transform — same pattern as nav dropdowns
    if (modal && modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }
    const modalBody = modal ? modal.querySelector('.card-modal__body') : null;
    const modalClose = modal ? modal.querySelector('.card-modal__close') : null;
    const modalOverlay = modal ? modal.querySelector('.card-modal__overlay') : null;
    let lastDimmedImage = null;

    function openModal(contentElem, isImage) {
        if (!modal || !modalBody) return;
        if (isImage) {
            // Clean vertical image pop out: image centered, caption/text below
            const img = contentElem.cloneNode(true);
            img.classList.remove('why-choose-us__icon');
            img.classList.add('modal-image-popout');
            img.style.position = 'static';
            img.style.margin = '0 auto 0 auto';
            img.style.display = 'block';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '70vh';
            img.style.width = 'auto';
            img.style.height = 'auto';
            // Use alt as caption below image
            modalBody.innerHTML = '';
            modalBody.appendChild(img);
            if (img.alt) {
                const caption = document.createElement('div');
                caption.textContent = img.alt;
                caption.className = 'modal-image-caption';
                modalBody.appendChild(caption);
            }
            // Optionally dim the original image for polish
            contentElem.classList.add('why-choose-us__icon--dimmed');
            lastDimmedImage = contentElem;
        } else {
            // Clone the card and fix image positioning for modal
            const cardClone = contentElem.cloneNode(true);
            // Find the image and adjust its class for modal
            const img = cardClone.querySelector('.why-choose-us__icon');
            if (img) {
                img.classList.remove('why-choose-us__icon');
                img.classList.add('modal-image-large');
                img.style.position = 'static';
                img.style.top = '';
                img.style.right = '';
                img.style.width = '';
                img.style.height = '';
                img.style.maxWidth = '';
                img.style.maxHeight = '';
                img.style.objectFit = 'contain';
                img.style.margin = '0 0 0 24px';
            }
            cardClone.style.position = 'static';
            cardClone.style.maxWidth = '100%';
            cardClone.style.boxShadow = 'none';
            cardClone.style.margin = '0 auto';
            modalBody.innerHTML = '';
            modalBody.appendChild(cardClone);
        }
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            modal.querySelector('.card-modal__content').focus();
        }, 10);
    }
    function closeModal() {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = '';
        modalBody.innerHTML = '';
        // Remove dimming from any image
        if (lastDimmedImage) {
            lastDimmedImage.classList.remove('why-choose-us__icon--dimmed');
            lastDimmedImage = null;
        }
    }

    cards.forEach(card => {
        card.addEventListener('click', function (e) {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
            openModal(card, false);
        });
    });
    images.forEach(img => {
        img.addEventListener('click', function () {
            openModal(img, true);
        });
        img.style.cursor = 'pointer';
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', img.alt || 'View image');
        img.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                openModal(img, true);
            }
        });
    });
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    // ESC key closes modal
    document.addEventListener('keydown', function(e) {
        if (modal && modal.style.display !== 'none' && (e.key === 'Escape' || e.key === 'Esc')) {
            closeModal();
        }
    });
}
