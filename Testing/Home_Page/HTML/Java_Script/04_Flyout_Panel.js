/* ============================================================
   FLYOUT PANEL — NAVIGATION
   Handles the right-side flyout panels for dropdown items
   that contain rich content (heading, text, bullets, image).
   Called after the nav component finishes loading.
============================================================ */

function initFlyouts() {
    var items = document.querySelectorAll('.main-navigation__dropdown-item--has-flyout');
    if (!items.length) return;

    var hideTimer = null;
    var activeFlyout = null;

    /* --- Get the bottom edge of the fixed nav bar --- */
    function getNavBottom() {
        var nav = document.getElementById('main-navigation');
        if (!nav) return 64;
        return nav.getBoundingClientRect().bottom;
    }

    /* --- Position flyout flush against the bottom of the nav bar --- */
    function positionFlyout(flyout) {
        var navBottom = getNavBottom();
        flyout.style.top = navBottom + 'px';
        flyout.style.maxHeight = (window.innerHeight - navBottom - 16) + 'px';
    }

    /* --- Show the flyout for a given item --- */
    function showFlyout(item) {
        var flyout = item.querySelector('.main-navigation__flyout');
        if (!flyout) return;

        clearTimeout(hideTimer);

        /* Close any other open flyout without animation delay */
        if (activeFlyout && activeFlyout !== flyout) {
            activeFlyout.classList.remove('is-open');
        }

        activeFlyout = flyout;
        positionFlyout(flyout);
        flyout.classList.add('is-open');
    }

    /* --- Schedule hide with delay so mouse can travel to the panel --- */
    function scheduleFlyoutHide() {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function () {
            if (activeFlyout) {
                activeFlyout.classList.remove('is-open');
                activeFlyout = null;
            }
        }, 350);
    }

    /* --- Close immediately (e.g. dropdown closes) --- */
    function hideFlyoutNow() {
        clearTimeout(hideTimer);
        if (activeFlyout) {
            activeFlyout.classList.remove('is-open');
            activeFlyout = null;
        }
    }

    /* --- Bind events to each flyout item --- */
    items.forEach(function (item) {
        var flyout = item.querySelector('.main-navigation__flyout');
        if (!flyout) return;

        item.addEventListener('mouseenter', function () { showFlyout(item); });
        item.addEventListener('mouseleave', scheduleFlyoutHide);

        /* Mouse entering the panel cancels the hide timer */
        flyout.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
        flyout.addEventListener('mouseleave', scheduleFlyoutHide);
    });

    /* --- Close flyout when the parent dropdown is dismissed --- */
    document.querySelectorAll('.main-navigation__dropdown').forEach(function (dd) {
        dd.addEventListener('mouseleave', hideFlyoutNow);
    });

    /* --- Also close when the nav item itself is left --- */
    document.querySelectorAll('#main-navigation .main-navigation__item--has-dropdown').forEach(function (navItem) {
        navItem.addEventListener('mouseleave', hideFlyoutNow);
    });

    /* --- Reposition on resize --- */
    window.addEventListener('resize', function () {
        if (activeFlyout) positionFlyout(activeFlyout);
    });
}
