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
