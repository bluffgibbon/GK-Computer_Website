/* ============================================================
   COMPONENT LOADER
   Fetches HTML component files and injects them into the DOM.
   Cache-busted on every load (Live Server safe).
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
   SUB-COMPONENT LOADER
   Appends HTML fragments into an existing element (by CSS
   selector). Used to load split nav/menu items in sequence
   after the parent shell has been injected.
============================================================ */

function appendComponent(targetSelector, filePath, callback) {
    var target = document.querySelector(targetSelector);
    if (!target) return;

    var cacheBustedPath = filePath + (filePath.indexOf("?") === -1 ? "?" : "&") + "v=" + Date.now();

    fetch(cacheBustedPath, { cache: "no-store" })
        .then(function (res) { return res.text(); })
        .then(function (html) {
            target.insertAdjacentHTML("beforeend", html);
            if (typeof callback === "function") callback();
        })
        .catch(function (err) {
            console.error("Sub-component load failed:", filePath, err);
        });
}

/* Loads an ordered array of sub-component files into targetSelector,
   then calls done() after the last one completes. */
function loadSubComponents(targetSelector, files, done) {
    if (!files || files.length === 0) {
        if (typeof done === "function") done();
        return;
    }
    function loadNext(i) {
        if (i >= files.length) {
            if (typeof done === "function") done();
            return;
        }
        appendComponent(targetSelector, files[i], function () {
            loadNext(i + 1);
        });
    }
    loadNext(0);
}
