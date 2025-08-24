// Filter logic
const buttons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    // update active button UI
    buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    const filter = btn.dataset.filter;
    cards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

// Lightbox viewer
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCap = document.getElementById('lightbox-cap');
const lightboxClose = document.querySelector('.lightbox__close');
const prevBtn = document.querySelector('.lightbox__prev');
const nextBtn = document.querySelector('.lightbox__next');

/* --- Navigation helpers --- */
function getVisibleImgs() {
  return Array.from(document.querySelectorAll('.card'))
    .filter(card => card.style.display !== 'none')
    .map(card => card.querySelector('img'))
    .filter(Boolean);
}

let currentIndex = -1;

function showByIndex(idx) {
  const imgs = getVisibleImgs();
  if (!imgs.length) return;

  currentIndex = (idx + imgs.length) % imgs.length; // wrap
  const imgEl = imgs[currentIndex];
  lightboxImg.src = imgEl.src;

  // (Optional) caption if your figures have figcaptions
  const cap = imgEl.closest('figure').querySelector('figcaption')?.textContent?.trim() || '';
  lightboxCap.textContent = cap;
}

/* --- Open lightbox and capture index within visible set --- */
document.getElementById('gallery').addEventListener('click', (e) => {
  const img = e.target.closest('img');
  if (!img) return;

  const imgs = getVisibleImgs();
  currentIndex = imgs.indexOf(img);

  showByIndex(currentIndex);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}, true);

/* --- Close logic --- */
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
}
lightboxClose.addEventListener('click', closeLightbox);

// Close on clicking the dark backdrop (but not the image or buttons)
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showByIndex(currentIndex + 1);
  if (e.key === 'ArrowLeft') showByIndex(currentIndex - 1);
});

/* --- Prev/Next buttons --- */
nextBtn.addEventListener('click', () => showByIndex(currentIndex + 1));
prevBtn.addEventListener('click', () => showByIndex(currentIndex - 1));
