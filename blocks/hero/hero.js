/**
 * Decorates the hero block.
 * Expects a single cell containing an image and text content.
 * The image becomes the background, text is wrapped in an overlay card.
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');
  if (!cell) return;

  // Find the image (picture or img)
  const picture = cell.querySelector('picture');
  const img = picture || cell.querySelector('img');
  if (!img) return;

  // Remove the image's wrapping <p> if present
  const imgWrapper = img.closest('p');

  // Create the background container
  const bgDiv = document.createElement('div');
  bgDiv.className = 'hero-bg';
  bgDiv.append(picture || img);

  // Everything else becomes the overlay card
  const overlay = document.createElement('div');
  overlay.className = 'hero-overlay';

  // Move remaining content into the overlay
  [...cell.children].forEach((child) => {
    if (child === imgWrapper) return; // skip empty <p> left behind
    overlay.append(child);
  });

  // Remove the leftover empty wrapper if it exists
  if (imgWrapper && imgWrapper.parentElement) imgWrapper.remove();

  // Clear the cell and rebuild
  cell.textContent = '';
  cell.append(bgDiv, overlay);
}
