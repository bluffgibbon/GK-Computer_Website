/* ============================================================
   LOGO LIGHTBOX
   Click the header logo to open a full-screen overlay.
   Click anywhere on the overlay (or press Escape) to close.
============================================================ */

function initLogoLightbox() {
    var logo = document.querySelector('.site-header__logo--clickable');
    if (!logo) return;

    var overlay = document.createElement('div');
    overlay.id = 'logo-lightbox-overlay';
    overlay.style.cssText = [
        'display:none',
        'position:fixed',
        'inset:0',
        'background:rgba(0,0,0,0.85)',
        'z-index:99999',
        'align-items:center',
        'justify-content:center',
        'cursor:pointer'
    ].join(';');

    var fullImg = document.createElement('img');
    fullImg.src = logo.src;
    fullImg.alt = logo.alt;
    fullImg.style.cssText = [
        'max-width:90vw',
        'max-height:90vh',
        'object-fit:contain',
        'border-radius:8px',
        'box-shadow:0 0 40px rgba(0,212,255,0.3)'
    ].join(';');

    overlay.appendChild(fullImg);
    document.body.appendChild(overlay);

    function openLightbox() {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    logo.addEventListener('click', openLightbox);
    logo.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') openLightbox();
    });
    overlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
        if (overlay.style.display !== 'none' && (e.key === 'Escape' || e.key === 'Esc')) {
            closeLightbox();
        }
    });
}
