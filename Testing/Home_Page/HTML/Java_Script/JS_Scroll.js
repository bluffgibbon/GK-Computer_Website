/* ============================================================
   SCROLL UTILITIES
   - initScrollButtons(): top/bottom scroll buttons with positioning
   - initSmoothScroll(): smooth anchor link scrolling
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
