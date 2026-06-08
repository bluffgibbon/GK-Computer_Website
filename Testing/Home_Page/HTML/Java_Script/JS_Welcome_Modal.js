/* ============================================================
   JS_Welcome_Modal.js
   Opens a flyout modal when the welcome section is clicked on desktop.
   Desktop only (> 900px width).
============================================================ */

(function () {

    function openWelcomeModal() {
        document.getElementById('welcome-modal-backdrop').classList.add('open');
        document.getElementById('welcome-modal').classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeWelcomeModal() {
        document.getElementById('welcome-modal-backdrop').classList.remove('open');
        document.getElementById('welcome-modal').classList.remove('open');
        document.body.style.overflow = '';
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (window.innerWidth <= 900) return;

        var section = document.getElementById('section-welcome');
        var backdrop = document.getElementById('welcome-modal-backdrop');
        var closeBtn = document.getElementById('welcome-modal-close');

        if (!section || !backdrop) return;

        // Open on section click — but NOT if the CTA button was clicked
        section.addEventListener('click', function (e) {
            if (e.target.closest('.welcome__cta-button')) return;
            openWelcomeModal();
        });

        // Close via backdrop click
        backdrop.addEventListener('click', function (e) {
            if (e.target === backdrop) closeWelcomeModal();
        });

        // Close via close buttons
        if (closeBtn) closeBtn.addEventListener('click', closeWelcomeModal);
        var closeBtnBottom = document.getElementById('welcome-modal-close-bottom');
        if (closeBtnBottom) closeBtnBottom.addEventListener('click', closeWelcomeModal);

        // Close via Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeWelcomeModal();
        });
    });

})();
