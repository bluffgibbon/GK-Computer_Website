/* ============================================================
   JS_Welcome_Modal.js
   Opens a flyout modal when the welcome section is clicked on desktop.
   Uses event delegation so it works with async-loaded components.
   Desktop only (> 900px width).
============================================================ */

(function () {

    function openWelcomeModal() {
        var backdrop = document.getElementById('welcome-modal-backdrop');
        var modal    = document.getElementById('welcome-modal');
        if (!backdrop || !modal) return;
        backdrop.classList.add('open');
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeWelcomeModal() {
        var backdrop = document.getElementById('welcome-modal-backdrop');
        var modal    = document.getElementById('welcome-modal');
        if (!backdrop || !modal) return;
        backdrop.classList.remove('open');
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Event delegation — works even though #section-welcome loads async
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 900) return;

        // Close via backdrop click
        if (e.target.id === 'welcome-modal-backdrop') {
            closeWelcomeModal();
            return;
        }

        // Close via close buttons
        if (e.target.closest('#welcome-modal-close') ||
            e.target.closest('#welcome-modal-close-bottom')) {
            closeWelcomeModal();
            return;
        }

        // Open when clicking welcome section (but not the CTA schedule button)
        var section = e.target.closest('#section-welcome');
        if (section && !e.target.closest('.welcome__cta-button')) {
            openWelcomeModal();
        }
    });

    // Close via Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeWelcomeModal();
    });

})();
