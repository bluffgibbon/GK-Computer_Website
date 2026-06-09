/* ============================================================
   JS_Quote_Modal.js
   Free quote estimator modal for the header CTA button.
============================================================ */

(function () {

    var SERVICES = {
        'pc-repair':    { name: 'PC & Laptop Repair',       icon: '🖥️',  min: 75,  max: 200, note: 'Diagnosis + basic hardware/software repair' },
        'virus':        { name: 'Virus & Malware Removal',  icon: '🛡️',  min: 85,  max: 150, note: 'Full scan, removal & security hardening' },
        'software':     { name: 'Software & OS Help',       icon: '💻',  min: 75,  max: 150, note: 'Installation, updates, troubleshooting' },
        'network':      { name: 'Network & Wi-Fi Setup',    icon: '📶',  min: 95,  max: 250, note: 'Router config, range extension, security' },
        'custom-pc':    { name: 'Custom PC Build',          icon: '🔧',  min: 150, max: 500, note: 'Labor only — parts billed separately' },
        'data':         { name: 'Data Recovery',            icon: '💾',  min: 150, max: 400, note: 'Depends on drive type & severity' },
        'consulting':   { name: 'IT Consulting',            icon: '🤝',  min: 75,  max: 150, note: 'Per hour, minimum 1 hour' },
        'other':        { name: 'Not Sure / Other',         icon: '❓',  min: 75,  max: null, note: 'We\'ll assess and give you a firm quote on-site' }
    };

    var selectedService = null;

    function openQuoteModal() {
        document.getElementById('quote-backdrop').classList.add('open');
        document.getElementById('quote-modal').classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeQuoteModal() {
        document.getElementById('quote-backdrop').classList.remove('open');
        document.getElementById('quote-modal').classList.remove('open');
        document.body.style.overflow = '';
    }

    function selectService(key) {
        selectedService = key;
        var svc = SERVICES[key];

        // Update button states
        document.querySelectorAll('.quote-modal__service-btn').forEach(function (btn) {
            btn.classList.toggle('selected', btn.dataset.service === key);
        });

        // Update price display
        var amount = document.getElementById('quote-price-amount');
        var noteEl = document.getElementById('quote-price-note');

        if (svc.max) {
            amount.textContent = '$' + svc.min + ' – $' + svc.max;
        } else {
            amount.textContent = '$' + svc.min + '+';
        }
        amount.classList.add('has-value');
        noteEl.textContent = svc.note;
    }

    function sendEmail() {
        var emailInput = document.getElementById('quote-email-input');
        var email = emailInput.value.trim();
        var successMsg = document.getElementById('quote-email-success');

        if (!email || !email.includes('@')) {
            emailInput.style.borderColor = 'rgba(200,0,30,0.8)';
            setTimeout(function () { emailInput.style.borderColor = ''; }, 1500);
            return;
        }

        var svc = selectedService ? SERVICES[selectedService] : null;
        var svcName = svc ? svc.name : 'General IT Service';
        var priceStr = svc
            ? (svc.max ? '$' + svc.min + ' – $' + svc.max : '$' + svc.min + '+')
            : 'Starting at $75+';
        var note = svc ? svc.note : 'Service call fee starting at $75';

        var subject = encodeURIComponent('Free Quote Request – ' + svcName);
        var body = encodeURIComponent(
            'Hello GK Computer Business,\n\n' +
            'I would like to receive a free quote for the following service:\n\n' +
            'Service: ' + svcName + '\n' +
            'Estimated Range: ' + priceStr + '\n' +
            'Details: ' + note + '\n\n' +
            'Please send my quote to: ' + email + '\n\n' +
            'Thank you!'
        );

        window.location.href = 'mailto:support@gkcomputerbusiness.com?subject=' + subject + '&body=' + body;

        successMsg.classList.add('visible');
        setTimeout(function () { successMsg.classList.remove('visible'); }, 4000);
    }

    // Event delegation — works with async-loaded components
    document.addEventListener('click', function (e) {

        // Open modal via quote button
        if (e.target.closest('#quote-btn')) {
            e.preventDefault();
            openQuoteModal();
            return;
        }

        // Close via backdrop
        if (e.target.id === 'quote-backdrop') {
            closeQuoteModal();
            return;
        }

        // Close via close button
        if (e.target.closest('#quote-modal-close')) {
            closeQuoteModal();
            return;
        }

        // Service selection
        var serviceBtn = e.target.closest('.quote-modal__service-btn');
        if (serviceBtn && serviceBtn.dataset.service) {
            selectService(serviceBtn.dataset.service);
            return;
        }

        // Send email button
        if (e.target.closest('#quote-email-send')) {
            sendEmail();
            return;
        }

        // Schedule button inside modal → open appointment flyout + close modal
        if (e.target.closest('#quote-schedule-btn')) {
            closeQuoteModal();
            setTimeout(function () {
                if (typeof openAppointmentSchedulerFlyout === 'function') {
                    openAppointmentSchedulerFlyout();
                }
            }, 300);
            return;
        }
    });

    // Close via Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeQuoteModal();
    });

    // Expose globally so inline onclick can also call it
    window.openQuoteModal = openQuoteModal;

})();
