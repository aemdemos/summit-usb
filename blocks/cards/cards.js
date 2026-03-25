import { createOptimizedPicture, decorateIcons } from '../../scripts/aem.js';
import { moveInstrumentation, getBlockId } from '../../scripts/scripts.js';
import { createCard } from '../card/card.js';

function classifyProductCategoryCards(ul) {
  const items = [...ul.children];
  if (!items.length) return;
  const allHaveIcon = items.every((li) => li.querySelector('.cards-card-icon'));
  const noneHaveImage = !items.some((li) => li.querySelector('.cards-card-image'));
  if (allHaveIcon && noneHaveImage) {
    ul.classList.add('product-category');
  }
}

function isEditorialCard(li) {
  const hasImage = li.querySelector('.cards-card-image picture, .cards-card-image img[src]');
  const hasHeading = li.querySelector('h1, h2, h3, h4, h5, h6');
  return hasImage && hasHeading;
}

function decorateEditorialCards(block, ul) {
  const items = [...ul.children];
  if (!items.length || !items.every((li) => isEditorialCard(li))) return;

  ul.classList.add('editorial');

  // Inject section heading
  const header = document.createElement('div');
  header.className = 'cards-editorial-header';
  const h2 = document.createElement('h2');
  h2.textContent = 'Happening now';
  header.append(h2);
  block.prepend(header);

  // Add chevron icons to CTA links
  items.forEach((li) => {
    const body = li.querySelector('.cards-card-body');
    if (!body) return;
    const ctaLink = body.querySelector('p:last-child a');
    if (ctaLink) {
      const chevron = document.createElement('span');
      chevron.className = 'icon icon-chevron-right';
      ctaLink.append(chevron);
    }
  });

  decorateIcons(block);
}

export default function decorate(block) {
  const blockId = getBlockId('cards');
  block.setAttribute('id', blockId);
  block.setAttribute('aria-label', `Cards for ${blockId}`);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Cards');

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    ul.append(createCard(row));
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);

  classifyProductCategoryCards(ul);
  decorateEditorialCards(block, ul);
}
