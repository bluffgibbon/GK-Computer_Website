/* ============================================================
   SIDE MENU
   - initSideMenu(): hamburger toggle, close arrow, outside-click dismiss
   - initSideMenuFlyouts(): per-item flyout panels with alternating
     red/teal color stamping, backdrop, and resize repositioning
============================================================ */

var serviceCardLinksInitialized = false;

function getSideMenuBackdrop() {
    return document.querySelector(".side-menu-flyout-backdrop");
}

function closeAllSideMenuFlyouts() {
    document.querySelectorAll(".side-menu__flyout.is-open").forEach(function (flyout) {
        flyout.classList.remove("is-open");
    });
    document.querySelectorAll(".side-menu__flyout-arrow").forEach(function (arrow) {
        arrow.textContent = "▸";
    });

    var backdrop = getSideMenuBackdrop();
    if (backdrop) backdrop.classList.remove("is-active");
}

function positionSideMenuFlyout(flyout) {
    var sideMenu = document.getElementById("sideMenu");
    if (!sideMenu || !flyout) return;

    var rect = sideMenu.getBoundingClientRect();

    // If the side menu fills the viewport (mobile full-screen mode),
    // show the flyout as a full-screen overlay on top of everything
    if (rect.right >= window.innerWidth - 10) {
        flyout.style.left = '0';
        flyout.style.top = '0';
        flyout.style.width = '100vw';
        flyout.style.minWidth = '0';
        flyout.style.height = '100vh';
        // Side menu z-index is 2147483647 (max). Match it here — flyout comes
        // later in the DOM so same z-index makes flyout paint on top.
        flyout.style.zIndex = '2147483647';
        return;
    }

    // Desktop: position flyout to the right of the side menu, restore z-index
    flyout.style.left = rect.right + "px";
    flyout.style.top = rect.top + "px";
    flyout.style.width = '';
    flyout.style.minWidth = '';
    flyout.style.height = (window.innerHeight - rect.top) + "px";
    flyout.style.zIndex = '';
}

function openSideMenuFlyoutByKey(serviceKey) {
    if (!serviceKey) return false;

    var sideMenu = document.getElementById("sideMenu");
    var hamburger = document.getElementById("hamburger-menu_left");
    var item = document.querySelector('.side-menu__item--has-flyout[data-service-key="' + serviceKey + '"]');
    if (!sideMenu || !hamburger || !item) return false;

    // Flyouts are moved to document.body by initSideMenuFlyouts — find by key
    var flyout = document.querySelector('.side-menu__flyout[data-flyout-key="' + serviceKey + '"]');
    var arrow = item.querySelector(".side-menu__flyout-arrow");
    if (!flyout || !arrow) return false;

    sideMenu.classList.add("active");
    hamburger.classList.add("active");

    closeAllSideMenuFlyouts();
    flyout.classList.add("is-open");
    arrow.textContent = "◂";

    var backdrop = getSideMenuBackdrop();
    if (backdrop) backdrop.classList.add("is-active");

    // Wait for the 240ms side menu slide-in transition before measuring position
    setTimeout(function () {
        positionSideMenuFlyout(flyout);
    }, 260);

    if (typeof item.scrollIntoView === "function") {
        item.scrollIntoView({ block: "nearest" });
    }

    return true;
}

function initServiceCardLinks() {
    if (serviceCardLinksInitialized) return;
    serviceCardLinksInitialized = true;

    document.addEventListener("click", function (e) {
        var card = e.target.closest(".service-card[data-service-key]");
        if (!card) return;

        e.preventDefault();
        openSideMenuFlyoutByKey(card.getAttribute("data-service-key"));
    });

    document.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;

        var card = e.target.closest(".service-card[data-service-key]");
        if (!card) return;

        e.preventDefault();
        openSideMenuFlyoutByKey(card.getAttribute("data-service-key"));
    });
}

window.openSideMenuFlyoutByKey = openSideMenuFlyoutByKey;

function initSideMenu() {
    var menu = document.getElementById("sideMenu");
    var btn = document.getElementById("hamburger-menu_left");
    if (!menu || !btn) return;

    // On mobile, the side menu covers the full viewport (z-index max).
    // Lift the hamburger button above it so the user can click it to close.
    function liftHamburger() {
        if (window.innerWidth > 480) return;
        btn.style.position = 'fixed';
        btn.style.top = '36px';
        btn.style.left = '10px';
        btn.style.zIndex = '2147483648';
    }

    function resetHamburger() {
        btn.style.position = '';
        btn.style.top = '';
        btn.style.left = '';
        btn.style.zIndex = '';
    }

    function closeSideMenu() {
        menu.classList.remove("active");
        btn.classList.remove("active");
        var bd = getSideMenuBackdrop();
        if (bd) bd.classList.remove("is-active");
        closeAllSideMenuFlyouts();
        resetHamburger();
    }

    btn.addEventListener("click", function (e) {
        e.preventDefault();
        var isOpening = !menu.classList.contains("active");
        menu.classList.toggle("active");
        btn.classList.toggle("active");
        var bd = getSideMenuBackdrop();
        if (bd) {
            if (isOpening) {
                bd.classList.add("is-active");
                liftHamburger();
            } else {
                bd.classList.remove("is-active");
                resetHamburger();
            }
        }
    });

    // The close arrow span AND the full h1 pill both close the side menu
    var closeArrow = menu.querySelector("#sideMenuCloseArrow");
    if (closeArrow) {
        closeArrow.addEventListener("click", function (e) {
            e.stopPropagation();
            closeSideMenu();
        });
    }
    var menuTitle = menu.querySelector(".side-menu__header-title");
    if (menuTitle) {
        menuTitle.addEventListener("click", function (e) {
            e.stopPropagation();
            closeSideMenu();
        });
    }

    document.addEventListener("click", function (e) {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            var bd = getSideMenuBackdrop();
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

    // Reset hamburger position if viewport grows past mobile breakpoint while menu is open
    window.addEventListener("resize", function () {
        if (window.innerWidth > 480) {
            resetHamburger();
        }
    });
}


function initSideMenuFlyouts() {
    var items = document.querySelectorAll(".side-menu__item--has-flyout");
    if (!items.length) return;

    // Backdrop — plain rgba overlay, NO backdrop-filter (avoids stacking context bugs)
    var backdrop = document.createElement("div");
    backdrop.className = "side-menu-flyout-backdrop";
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", function () {
        closeAllSideMenuFlyouts();
        // Also close the side menu itself
        var sideMenu = document.getElementById("sideMenu");
        var hamburger = document.getElementById("hamburger-menu_left");
        if (sideMenu) sideMenu.classList.remove("active");
        if (hamburger) hamburger.classList.remove("active");
    });

    items.forEach(function (item, index) {
        var flyout = item.querySelector(".side-menu__flyout");
        var arrow = item.querySelector(".side-menu__flyout-arrow");
        if (!flyout || !arrow) return;

        // Stamp alternating color classes — drives label bg, flyout bg, and heading color via CSS
        var colorKey = (index % 2 === 0) ? "red" : "teal";
        item.classList.add("item--" + colorKey);
        flyout.classList.add("flyout--" + colorKey);

        var itemKey = item.getAttribute('data-service-key');
        if (itemKey) flyout.setAttribute('data-flyout-key', itemKey);
        document.body.appendChild(flyout);

        // Mobile-only close button so users can dismiss flyout and return to menu list
        var mobileCloseBtn = document.createElement('button');
        mobileCloseBtn.className = 'flyout__mobile-close';
        mobileCloseBtn.setAttribute('aria-label', 'Back to services list');
        mobileCloseBtn.innerHTML = '✕  Back to Menu';
        mobileCloseBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            closeFlyout();
        });
        flyout.insertBefore(mobileCloseBtn, flyout.firstChild);

        function openFlyout() {
            // Close all other open side menu flyouts
            items.forEach(function (other) {
                var a = other.querySelector(".side-menu__flyout-arrow");
                if (other !== item && a) a.textContent = "▸";
            });
            document.querySelectorAll(".side-menu__flyout.is-open").forEach(function (f) {
                if (f !== flyout) f.classList.remove("is-open");
            });
            positionSideMenuFlyout(flyout);
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
        closeAllSideMenuFlyouts();
    });

    window.addEventListener("resize", function () {
        document.querySelectorAll(".side-menu__flyout.is-open").forEach(function (f) {
            positionSideMenuFlyout(f);
        });
    });
}