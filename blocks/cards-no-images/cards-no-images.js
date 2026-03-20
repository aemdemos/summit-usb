import { decorateIcons } from '../../scripts/aem.js';

export default function decorate(block) {
  // Inject section heading and description before the card list
  const header = document.createElement('div');
  header.className = 'cards-no-images-header';

  const h2 = document.createElement('h2');
  h2.textContent = 'Borrowing money is a big deal. We\u2019re ready to help.';
  header.append(h2);

  const desc = document.createElement('p');
  desc.textContent = 'From calculators and rate charts to get you started, to experienced loan officers and bankers, U.S. Bank has answers for all your loan and mortgage questions.';
  header.append(desc);

  const items = [...block.children];
  const ul = document.createElement('ul');

  items.forEach((item) => {
    const li = document.createElement('li');
    const heading = item.querySelector('h3');
    const links = item.querySelectorAll('a');

    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent;
      li.append(h3);
    }

    if (links.length) {
      const linksDiv = document.createElement('div');
      linksDiv.className = 'cards-no-images-links';
      links.forEach((link) => {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent;
        const chevron = document.createElement('span');
        chevron.className = 'icon icon-chevron-right';
        a.append(chevron);
        p.append(a);
        linksDiv.append(p);
      });
      li.append(linksDiv);
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(header);
  block.append(ul);

  decorateIcons(block);
}
