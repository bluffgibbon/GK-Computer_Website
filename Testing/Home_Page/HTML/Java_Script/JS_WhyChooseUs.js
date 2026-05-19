/* ============================================================
   WHY CHOOSE US — CARD MODAL
   Click a card to open an expanded modal overlay.
   Click an image to open it in a pop-out view.
   Modal moved to document.body to escape any stacking context
   created by the section's animation/transform.
============================================================ */

function initWhyChooseUsCards() {
    const cards = document.querySelectorAll('.why-choose-us__card');
    const images = document.querySelectorAll('.why-choose-us__images-row .why-choose-us__icon');
    const modal = document.getElementById('why-choose-us-card-modal');

    if (modal && modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }

    const modalBody = modal ? modal.querySelector('.card-modal__body') : null;
    const modalClose = modal ? modal.querySelector('.card-modal__close') : null;
    const modalOverlay = modal ? modal.querySelector('.card-modal__overlay') : null;
    let lastDimmedImage = null;

    function openModal(contentElem, isImage) {
        if (!modal || !modalBody) return;

        if (isImage) {
            // Clean vertical image pop out: image centered, caption below
            const img = contentElem.cloneNode(true);
            img.classList.remove('why-choose-us__icon');
            img.classList.add('modal-image-popout');
            img.style.position = 'static';
            img.style.margin = '0 auto 0 auto';
            img.style.display = 'block';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '70vh';
            img.style.width = 'auto';
            img.style.height = 'auto';
            modalBody.innerHTML = '';
            modalBody.appendChild(img);
            if (img.alt) {
                const caption = document.createElement('div');
                caption.textContent = img.alt;
                caption.className = 'modal-image-caption';
                modalBody.appendChild(caption);
            }
            contentElem.classList.add('why-choose-us__icon--dimmed');
            lastDimmedImage = contentElem;
        } else {
            // Clone the card and fix image positioning for modal
            const cardClone = contentElem.cloneNode(true);
            const img = cardClone.querySelector('.why-choose-us__icon');
            if (img) {
                img.classList.remove('why-choose-us__icon');
                img.classList.add('modal-image-large');
                img.style.position = 'static';
                img.style.top = '';
                img.style.right = '';
                img.style.width = '';
                img.style.height = '';
                img.style.maxWidth = '';
                img.style.maxHeight = '';
                img.style.objectFit = 'contain';
                img.style.margin = '0 0 0 24px';
            }
            cardClone.style.position = 'static';
            cardClone.style.maxWidth = '100%';
            cardClone.style.boxShadow = 'none';
            cardClone.style.margin = '0 auto';
            modalBody.innerHTML = '';
            modalBody.appendChild(cardClone);
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            modal.querySelector('.card-modal__content').focus();
        }, 10);
    }

    function closeModal() {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = '';
        modalBody.innerHTML = '';
        if (lastDimmedImage) {
            lastDimmedImage.classList.remove('why-choose-us__icon--dimmed');
            lastDimmedImage = null;
        }
    }

    cards.forEach(card => {
        card.addEventListener('click', function (e) {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
            openModal(card, false);
        });
    });

    images.forEach(img => {
        img.addEventListener('click', function () {
            openModal(img, true);
        });
        img.style.cursor = 'pointer';
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', img.alt || 'View image');
        img.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                openModal(img, true);
            }
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
        if (modal && modal.style.display !== 'none' && (e.key === 'Escape' || e.key === 'Esc')) {
            closeModal();
        }
    });
}


/* ============================================================
   GENERIC IMAGE / CARD MODAL
   Reuses the why-choose-us modal to pop out:
   - Owner headshot in header
   - Certification/partner logos in footer bottom bar
   - Service cards in section 05
============================================================ */
function initGenericModal() {
    var modal = document.getElementById('why-choose-us-card-modal');
    if (!modal) return;

    if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }

    var modalBody = modal.querySelector('.card-modal__body');

    function openImageModal(img) {
        if (!modal || !modalBody) return;
        var clone = img.cloneNode(true);
        clone.className = 'modal-image-popout';
        clone.removeAttribute('style');
        modalBody.innerHTML = '';
        modalBody.appendChild(clone);
        if (img.alt) {
            var caption = document.createElement('div');
            caption.textContent = img.alt;
            caption.className = 'modal-image-caption';
            modalBody.appendChild(caption);
        }
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function openServiceCardModal(card) {
        if (!modal || !modalBody) return;
        var clone = card.cloneNode(true);
        clone.removeAttribute('style');
        clone.removeAttribute('role');
        clone.removeAttribute('tabindex');
        clone.removeAttribute('aria-label');
        clone.className = 'modal-service-card-clone';
        // Remove the dot span from the text to avoid double-dot in modal
        var dot = clone.querySelector('.service-card__text-dot');
        if (dot) dot.remove();
        modalBody.innerHTML = '';
        modalBody.appendChild(clone);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(function () {
            var content = modal.querySelector('.card-modal__content');
            if (content) content.focus();
        }, 10);
    }

    // Event delegation — works regardless of when elements are added to DOM
    document.addEventListener('click', function (e) {
        // Skip if modal is already open (avoid double-open from multiple handlers)
        if (modal.style.display === 'flex') return;

        // Owner headshot
        if (e.target.matches('.site-header__owner-photo')) {
            openImageModal(e.target);
            return;
        }

        // Footer certification/partner logos
        var footerImg = e.target.closest('.footer__bottom-images img');
        if (footerImg) {
            openImageModal(footerImg);
            return;
        }

        // Service cards
        var card = e.target.closest('.service-card[data-service-key]');
        if (card) {
            e.preventDefault();
            e.stopPropagation();
            openServiceCardModal(card);
        }
    });
}