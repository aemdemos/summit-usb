import { decorateIcons } from '../../scripts/aem.js';
import { getBlockId } from '../../scripts/scripts.js';

const FEATURE_ICONS = new Map([
  ['easily view your cash flow', 'cashflow'],
  ['grow your money faster', 'savings-growth'],
  ['manage your rewards', 'rewards'],
  ['send and transfer money', 'transfer'],
]);

const SERVICE_ICONS = new Map([
  ['branches', 'branches'],
  ['online banking', 'online-banking'],
  ['24-hour banking', 'phone-banking'],
  ['appointments', 'appointments'],
]);

function matchIcon(text, iconMap) {
  const lower = text.toLowerCase();
  for (const [key, icon] of iconMap) {
    if (lower.includes(key)) return icon;
  }
  return null;
}

function decorateServicesLayout(block) {
  const row = block.firstElementChild;
  if (!row) return false;

  // Find the content column (non-empty div with h2, lists, and image)
  const contentCol = [...row.children].find(
    (div) => div.querySelector('h2') && div.querySelectorAll('ul').length === 2,
  );
  if (!contentCol) return false;

  const h2 = contentCol.querySelector('h2');
  const picture = contentCol.querySelector('picture');
  const h3 = contentCol.querySelector('h3:not(ul h3)');
  const lists = contentCol.querySelectorAll('ul');
  const featureList = lists[0];
  const servicesList = lists[1];
  const downloadLink = contentCol.querySelector('a[href*="mobile-banking"], a[href*="download"]');

  if (!h2 || !picture || !featureList || !servicesList) return false;

  block.classList.add('services-layout');

  // Clear block and rebuild
  block.textContent = '';

  // Heading row — spans all columns
  const headingRow = document.createElement('div');
  headingRow.className = 'columns-heading';
  headingRow.append(h2);
  block.append(headingRow);

  // Content row — 3 columns
  const contentRow = document.createElement('div');
  contentRow.className = 'columns-content';

  // Column 1: Phone image
  const imgCol = document.createElement('div');
  imgCol.className = 'columns-img';
  const picWrapper = picture.closest('p') || picture;
  imgCol.append(picWrapper.contains(picture) ? picWrapper : picture);
  contentRow.append(imgCol);

  // Column 2: Feature list
  const featureCol = document.createElement('div');
  featureCol.className = 'columns-features';
  if (h3) featureCol.append(h3);

  // Add icons to feature list items
  [...featureList.children].forEach((li) => {
    const iconName = matchIcon(li.textContent, FEATURE_ICONS);
    if (iconName) {
      const iconSpan = document.createElement('span');
      iconSpan.className = `icon icon-${iconName}`;
      li.prepend(iconSpan);
    }
    li.classList.add('columns-feature-item');
  });
  featureCol.append(featureList);

  if (downloadLink) {
    const dlWrapper = downloadLink.closest('p') || downloadLink;
    downloadLink.classList.add('columns-download');
    featureCol.append(dlWrapper.contains(downloadLink) ? dlWrapper : downloadLink);
  }
  contentRow.append(featureCol);

  // Column 3: Services list
  const servicesCol = document.createElement('div');
  servicesCol.className = 'columns-services';

  [...servicesList.children].forEach((li) => {
    const heading = li.querySelector('h3');
    const iconName = heading ? matchIcon(heading.textContent, SERVICE_ICONS) : null;
    if (iconName) {
      const iconSpan = document.createElement('span');
      iconSpan.className = `icon icon-${iconName}`;
      li.prepend(iconSpan);
    }

    // Wrap heading + link in a content div for vertical stacking
    const contentDiv = document.createElement('div');
    contentDiv.className = 'columns-service-content';
    const children = [...li.children].filter((el) => !el.classList.contains('icon'));
    children.forEach((el) => contentDiv.append(el));
    li.append(contentDiv);

    li.classList.add('columns-service-item');

    // Add chevron to links
    const link = li.querySelector('a');
    if (link) {
      const chevron = document.createElement('span');
      chevron.className = 'icon icon-chevron-right';
      link.append(chevron);
    }
  });
  servicesCol.append(servicesList);
  contentRow.append(servicesCol);

  block.append(contentRow);

  decorateIcons(block);
  return true;
}

export default function decorate(block) {
  const blockId = getBlockId('columns');
  block.setAttribute('id', blockId);
  block.setAttribute('aria-label', `columns-${blockId}`);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Columns');

  // Check for services layout pattern first
  if (decorateServicesLayout(block)) return;

  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
