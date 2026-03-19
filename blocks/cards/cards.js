import { createOptimizedPicture, decorateIcons } from '../../scripts/aem.js';
import { moveInstrumentation, getBlockId } from '../../scripts/scripts.js';
import { createCard } from '../card/card.js';

const CATEGORY_ICONS = new Map([
  ['credit cards', 'credit-card'],
  ['checking accounts', 'checking'],
  ['savings accounts', 'savings'],
  ['cd accounts', 'cd-account'],
  ['mortgage', 'mortgage'],
  ['investing', 'investing'],
]);

function isProductCategoryCard(li) {
  const hasImage = li.querySelector('.cards-card-image picture, .cards-card-image img[src]');
  const hasHeading = li.querySelector('h1, h2, h3, h4, h5, h6');
  const link = li.querySelector('a');
  return !hasImage && !hasHeading && link;
}

function decorateProductCategoryCards(ul) {
  const items = [...ul.children];
  if (!items.length || !items.every((li) => isProductCategoryCard(li))) return;

  ul.classList.add('product-category');
  items.forEach((li) => {
    const link = li.querySelector('a');
    if (!link) return;

    const iconName = CATEGORY_ICONS.get(link.textContent.trim().toLowerCase());
    if (iconName) {
      const iconSpan = document.createElement('span');
      iconSpan.className = `icon icon-${iconName}`;
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'cards-card-icon';
      iconWrapper.append(iconSpan);
      link.prepend(iconWrapper);
    }

    li.textContent = '';
    li.append(link);
  });

  decorateIcons(ul);
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

  decorateProductCategoryCards(ul);
}
