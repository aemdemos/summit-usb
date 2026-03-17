export default function decorate(block) {
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
        p.append(a);
        linksDiv.append(p);
      });
      li.append(linksDiv);
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
