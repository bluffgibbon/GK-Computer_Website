/* ============================================================
   SCROLL UTILITIES
   - initScrollButtons(): top/bottom scroll buttons with positioning
   - initSmoothScroll(): smooth anchor link scrolling
============================================================ */

function initScrollButtons() {
    var topBtn = document.getElementById("scroll-to-top-button");
    var bottomBtn = document.getElementById("scroll-to-bottom-button");

    // Guard against accidental activation during scroll momentum on mobile.
    // Scroll buttons at the bottom-corner positions are in the natural swipe-start
    // zone — ghost clicks from momentum scrolling can fire scrollTo unexpectedly.
    var _scrollActive = false;
    var _scrollGuardTimer;
    window.addEventListener('scroll', function () {
        _scrollActive = true;
        clearTimeout(_scrollGuardTimer);
        _scrollGuardTimer = setTimeout(function () { _scrollActive = false; }, 600);
    }, { passive: true });

    if (topBtn) {
        topBtn.addEventListener("click", function () {
            if (_scrollActive) return;
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    if (bottomBtn) {
        bottomBtn.addEventListener("click", function () {
            if (_scrollActive) return;
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        });
    }
}


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
