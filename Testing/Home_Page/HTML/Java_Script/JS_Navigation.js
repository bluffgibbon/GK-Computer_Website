/* ============================================================
   NAVIGATION
   - Nav bar positioning (fixed below header)
   - Nav scroll reset
   - Dropdown toggle (click-based, with color stamping)
   - Flyout panels (click-based, left/right positioning, backdrop)
   - Horizontal mouse-wheel scroll on nav
============================================================ */

function initNavigation() {

    /* ---------- NAV POSITIONING ---------- */
    var lastNavBottom = 0;

    function positionNav() {
        var banner = document.getElementById("top-banner");
        var header = document.getElementById("header-logo-section");
        var nav = document.getElementById("main-navigation");
        if (!header || !nav) return;

        // On mobile, snap header flush to banner's actual rendered bottom instead of
        // relying on the hardcoded `top: 32px` CSS value (banner height varies).
        if (window.innerWidth <= 480 && banner && !header.style.transform) {
            var bannerBottom = Math.round(banner.getBoundingClientRect().bottom);
            header.style.top = bannerBottom + 'px';
        }

        var navTop = Math.round(header.getBoundingClientRect().bottom);
        nav.style.position = "fixed";
        nav.style.top = navTop + "px";
        nav.style.left = "0";
        nav.style.width = "100%";
        nav.style.zIndex = "9999";

        // On mobile: position the collapse button below the nav, then set body padding.
        if (window.innerWidth <= 480) {
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    var navBottom = navTop + nav.offsetHeight;
                    lastNavBottom = navBottom;
                    var collapseBtn = document.getElementById('nav-collapse-btn');
                    if (collapseBtn && collapseBtn.dataset.collapsed !== 'true') {
                        collapseBtn.style.top = navBottom + 'px';
                    }
                    var pad = navBottom + 30;
                    document.body.style.setProperty('padding-top', pad + 'px', 'important');
                });
            });
        }
    }

    positionNav();
    window.addEventListener("resize", positionNav);


    /* ---------- NAV SCROLL RESET ---------- */
    function resetNavScroll() {
        var scroll = document.querySelector("#main-navigation .nav-scroll");
        if (!scroll) return;
        setTimeout(function () { scroll.scrollLeft = 0; }, 50);
    }

    resetNavScroll();
    window.addEventListener("resize", resetNavScroll);


    /* ---------- DROPDOWNS ---------- */
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
        activeDropdown.style.height = "";
        activeDropdown.style.overflowY = "";
        activeDropdown.style.overflowX = "";
        if (activeItem) activeItem.classList.remove("active");
        if (activeArrow) activeArrow.textContent = "▾";
        activeDropdown = null;
        activeItem = null;
        activeArrow = null;
        // Close any open flyout panels when the dropdown dismisses
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

        dropdown.style.opacity = "1";
        dropdown.style.visibility = "visible";
        dropdown.style.pointerEvents = "auto";
        dropdown.style.transform = "translateY(0)";
        dropdown.style.zIndex = "99999";

        if (window.innerWidth <= 480) {
            // Mobile: full-screen overlay (same UX as side menu)
            dropdown.style.position = "fixed";
            dropdown.style.top = "0";
            dropdown.style.left = "0";
            dropdown.style.width = "100vw";
            dropdown.style.height = "100vh";
            dropdown.style.overflowY = "auto";
            dropdown.style.overflowX = "hidden";
        } else {
            // Desktop: position below the nav item
            dropdown.style.height = "";
            dropdown.style.overflowY = "";
            dropdown.style.overflowX = "";
            var rect = item.getBoundingClientRect();
            dropdown.style.position = "fixed";
            dropdown.style.top = (rect.bottom + 8) + "px";

            // Center two-column dropdowns under the tab
            if (dropdown.classList.contains("main-navigation__dropdown--two-col")) {
                var tabCenter = rect.left + rect.width / 2;
                var dropWidth = dropdown.offsetWidth || 560;
                var centeredLeft = tabCenter - dropWidth / 2;
                if (centeredLeft < 8) centeredLeft = 8;
                if (centeredLeft + dropWidth > window.innerWidth - 8) centeredLeft = window.innerWidth - 8 - dropWidth;
                dropdown.style.left = centeredLeft + "px";
            } else {
                dropdown.style.left = rect.left + "px";
            }
        }
    }

    navItems.forEach(function (item, index) {
        var dropdown = item.querySelector(".main-navigation__dropdown");
        var arrow = item.querySelector(".main-navigation__dropdown-arrow");
        if (!dropdown || !arrow) return;

        dropdown.classList.add(index % 2 === 0 ? "dropdown--teal" : "dropdown--blue");
        document.body.appendChild(dropdown);

        // Mobile close button (CSS hides it on desktop)
        var mobileClose = document.createElement("button");
        mobileClose.className = "nav-dropdown__mobile-close";
        mobileClose.setAttribute("aria-label", "Close menu");
        mobileClose.innerHTML = "✕ Close";
        mobileClose.addEventListener("click", function (e) {
            e.stopPropagation();
            hideDropdown();
        });
        dropdown.insertBefore(mobileClose, dropdown.firstChild);

        item.addEventListener("click", function (e) {
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
        if (window.innerWidth <= 480) {
            activeDropdown.style.top = "0";
            activeDropdown.style.left = "0";
            activeDropdown.style.width = "100vw";
            activeDropdown.style.height = "100vh";
            return;
        }
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


    /* ---------- FLYOUT PANELS (click-based, with backdrop) ---------- */
    function initFlyouts() {
        var flyoutItems = document.querySelectorAll(".main-navigation__dropdown-item--has-flyout");

        // Create backdrop overlay
        var backdrop = document.createElement("div");
        backdrop.className = "flyout-backdrop";
        document.body.appendChild(backdrop);

        backdrop.addEventListener("click", function () {
            closeAllFlyouts();
        });

        function closeAllFlyouts() {
            document.querySelectorAll(".main-navigation__flyout.is-open").forEach(function (f) {
                f.classList.remove("is-open");
            });
            flyoutItems.forEach(function (item) {
                var a = item.querySelector(".main-navigation__flyout-arrow");
                if (a) a.textContent = "▸";
            });
            backdrop.classList.remove("is-active");
            document.body.classList.remove("flyout-open");
        }

        flyoutItems.forEach(function (item) {
            var flyout = item.querySelector(".main-navigation__flyout");
            var arrow = item.querySelector(".main-navigation__flyout-arrow");
            if (!flyout || !arrow) return;

            var parentDropdown = item.parentElement;

            // Copy dropdown color class onto flyout before moving to body
            if (parentDropdown) {
                if (parentDropdown.classList.contains("dropdown--teal")) flyout.classList.add("flyout--teal");
                else if (parentDropdown.classList.contains("dropdown--blue")) flyout.classList.add("flyout--blue");
            }

            // Move flyout to body so position:fixed is relative to viewport
            document.body.appendChild(flyout);

            // Mobile back button (CSS hides it on desktop)
            var mobileBack = document.createElement("button");
            mobileBack.className = "nav-flyout__mobile-close";
            mobileBack.setAttribute("aria-label", "Back to menu");
            mobileBack.innerHTML = "◄ Back to Menu";
            mobileBack.addEventListener("click", function (e) {
                e.stopPropagation();
                closeFlyout();
            });
            flyout.insertBefore(mobileBack, flyout.firstChild);

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

            item._defaultArrow = "▸";

            function positionFlyout() {
                if (window.innerWidth <= 480) {
                    // Mobile: full-screen overlay on top of dropdown
                    flyout.style.position = "fixed";
                    flyout.style.top = "0";
                    flyout.style.left = "0";
                    flyout.style.right = "0";
                    flyout.style.width = "100vw";
                    flyout.style.height = "100vh";
                    flyout.style.zIndex = "100001";
                    flyout.style.borderLeft = "none";
                    flyout.style.borderRight = "none";
                    flyout.style.borderTop = "2px solid rgb(200, 0, 30)";
                    flyout.style.boxShadow = "none";
                    return "right";
                }

                // Desktop: position to the left or right of dropdown
                flyout.style.zIndex = "";
                flyout.style.borderTop = "";
                var dropdown = item.parentElement;
                if (dropdown && dropdown.style.top) {
                    var dropLeft = parseFloat(dropdown.style.left) || 0;
                    var dropWidth = dropdown.offsetWidth || 220;
                    var side = getBestSide();

                    if (side === "left") {
                        flyout.style.left = "0";
                        flyout.style.right = (window.innerWidth - dropLeft + 10) + "px";
                        flyout.style.borderLeft = "none";
                        flyout.style.borderRight = "2px solid rgb(200, 0, 30)";
                        flyout.style.boxShadow = "16px 0 48px rgba(0, 0, 0, 0.85)";
                    } else {
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
                flyoutItems.forEach(function (other) {
                    var otherArrow = other.querySelector(".main-navigation__flyout-arrow");
                    if (otherArrow && other !== item) {
                        otherArrow.textContent = other._defaultArrow || "▸";
                    }
                });
                document.querySelectorAll(".main-navigation__flyout.is-open").forEach(function (f) {
                    if (f !== flyout) f.classList.remove("is-open");
                });
                var side = positionFlyout();
                flyout.classList.add("is-open");
                arrow.textContent = "◂";
                item._defaultArrow = "▸";
                item._defaultSide = side;
                backdrop.classList.add("is-active");
                document.body.classList.add("flyout-open");
            }

            function closeFlyout() {
                flyout.classList.remove("is-open");
                arrow.textContent = "▸";
                if (!document.querySelector(".main-navigation__flyout.is-open")) {
                    backdrop.classList.remove("is-active");
                    document.body.classList.remove("flyout-open");
                }
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
    }

    initFlyouts();


    /* ---------- HORIZONTAL WHEEL SCROLL ---------- */
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

    /* ---------- COLLAPSE TOGGLE (mobile only) ---------- */
    (function initCollapseToggle() {
        if (window.innerWidth > 480) return;

        var banner    = document.getElementById('top-banner');
        var hdr       = document.getElementById('header-logo-section');
        var navEl     = document.getElementById('main-navigation');
        if (!hdr || !navEl) return;

        var btn = document.createElement('button');
        btn.id = 'nav-collapse-btn';
        btn.setAttribute('aria-label', 'Toggle navigation visibility');
        btn.innerHTML = '&#9652;';
        document.body.appendChild(btn);

        var isCollapsed = false;

        function collapse() {
            var stackH = navEl.getBoundingClientRect().bottom;
            var t = 'translateY(-' + (stackH + 24) + 'px)';
            if (banner) banner.style.transform = t;
            hdr.style.transform   = t;
            navEl.style.transform = t;
            btn.style.top = '0px';
            btn.innerHTML = '&#9662;';
            btn.dataset.collapsed = 'true';
            document.body.style.setProperty('padding-top', '28px', 'important');
            isCollapsed = true;
        }

        function expand() {
            if (banner) banner.style.transform = '';
            hdr.style.transform   = '';
            navEl.style.transform = '';
            btn.innerHTML = '&#9652;';
            btn.dataset.collapsed = 'false';
            isCollapsed = false;
            // Immediately slide the button to its resting position so it moves in sync
            // with the elements (CSS transition: top 0.28s handles the animation).
            if (lastNavBottom) btn.style.top = lastNavBottom + 'px';
            // Remeasure after transition in case font/layout shifted
            setTimeout(positionNav, 320);
        }

        btn.addEventListener('click', function () {
            if (isCollapsed) { expand(); } else { collapse(); }
        });

        positionNav();
    })();
}