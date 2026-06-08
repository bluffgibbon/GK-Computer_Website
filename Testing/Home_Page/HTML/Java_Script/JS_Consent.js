/* ============================================================
   JS_Consent.js
   First-visit consent flow: Terms -> Privacy -> Theme
   Stores result in localStorage so it only shows once.
============================================================ */

(function () {

    var STORAGE_KEY = 'gk_consent_done';

    // If already consented, hide overlay immediately and exit
    if (localStorage.getItem(STORAGE_KEY) === '1') {
        var el = document.getElementById('consent-overlay');
        if (el) el.classList.add('hidden');
        return;
    }

    // Wait for DOM then wire up all buttons
    document.addEventListener('DOMContentLoaded', function () {

        var overlay = document.getElementById('consent-overlay');
        if (!overlay) return;

        // ---------- helpers ----------

        var stepLabels = {
            'consent-step-tos':     { num: 1, dots: 1 },
            'consent-step-privacy': { num: 2, dots: 2 },
            'consent-step-theme':   { num: 3, dots: 3 },
            'consent-step-blocked': { num: 0, dots: 0 }
        };

        function showStep(id) {
            document.querySelectorAll('.consent-step').forEach(function (s) {
                s.classList.remove('active');
            });
            var step = document.getElementById(id);
            if (step) step.classList.add('active');

            // Update progress dots
            var activeDots = stepLabels[id] ? stepLabels[id].dots : 0;
            document.querySelectorAll('.consent-progress__dot').forEach(function (dot, i) {
                dot.classList.toggle('active', i < activeDots);
            });

            // Update step label text
            var labelEl = document.getElementById('consent-step-label');
            if (labelEl && stepLabels[id] && stepLabels[id].num > 0) {
                labelEl.textContent = 'Step ' + stepLabels[id].num + ' of 3';
            }
        }

        function showZoomHint() {
            if (window.innerWidth <= 900) return;
            var hint = document.getElementById('zoom-hint');
            if (!hint) return;

            // Show after the consent overlay finishes fading out
            setTimeout(function () {
                hint.classList.add('visible');

                // Auto-dismiss after 6 seconds
                var autoTimer = setTimeout(function () {
                    hint.classList.add('hiding');
                    setTimeout(function () { hint.classList.remove('visible', 'hiding'); }, 300);
                }, 6000);

                // Click anywhere on the hint to dismiss early
                hint.addEventListener('click', function () {
                    clearTimeout(autoTimer);
                    hint.classList.add('hiding');
                    setTimeout(function () { hint.classList.remove('visible', 'hiding'); }, 300);
                }, { once: true });
            }, 600);
        }

        function completeConsent() {
            localStorage.setItem(STORAGE_KEY, '1');
            overlay.classList.remove('consent-overlay--preview');
            overlay.classList.add('fadeout');
            setTimeout(function () {
                overlay.classList.add('hidden');
            }, 420);
            showZoomHint();
        }

        function applyTheme(theme) {
            // Use the existing setTheme() from JS_Theme.js
            if (typeof setTheme === 'function') {
                setTheme(theme);
            } else {
                // Fallback if JS_Theme.js not loaded yet
                document.body.classList.toggle('dark',  theme === 'dark');
                document.body.classList.toggle('light', theme === 'light');
                localStorage.setItem('theme', theme);
            }
        }

        // ---------- button wiring ----------

        // Step 1: Terms — decline shows warning and lets user continue anyway
        document.getElementById('tos-accept').addEventListener('click', function () {
            showStep('consent-step-privacy');
        });
        document.getElementById('tos-decline').addEventListener('click', function () {
            document.getElementById('tos-warning').style.display = 'block';
            document.getElementById('tos-actions').style.display = 'none';
        });
        document.getElementById('tos-warning-back').addEventListener('click', function () {
            document.getElementById('tos-warning').style.display = 'none';
            document.getElementById('tos-actions').style.display = 'flex';
        });
        document.getElementById('tos-warning-continue').addEventListener('click', function () {
            document.getElementById('tos-warning').style.display = 'none';
            document.getElementById('tos-actions').style.display = 'flex';
            showStep('consent-step-privacy');
        });

        // Step 2: Privacy (leave as-is — decline still blocks)
        document.getElementById('privacy-accept').addEventListener('click', function () {
            showStep('consent-step-theme');
        });
        document.getElementById('privacy-decline').addEventListener('click', function () {
            showStep('consent-step-blocked');
        });

        // Step 3: Theme — clicking previews; OK button confirms
        var selectedTheme = null;

        function selectTheme(theme) {
            selectedTheme = theme;
            applyTheme(theme);
            document.getElementById('theme-dark').classList.toggle('selected', theme === 'dark');
            document.getElementById('theme-light').classList.toggle('selected', theme === 'light');
            document.getElementById('theme-ok').disabled = false;
            overlay.classList.add('consent-overlay--preview');
        }

        document.getElementById('theme-dark').addEventListener('click', function () {
            selectTheme('dark');
        });
        document.getElementById('theme-light').addEventListener('click', function () {
            selectTheme('light');
        });
        document.getElementById('theme-ok').addEventListener('click', function () {
            if (!selectedTheme) return;
            completeConsent();
        });

        // Blocked screen: go back to step 1
        document.getElementById('consent-restart').addEventListener('click', function () {
            showStep('consent-step-tos');
        });
    });

})();