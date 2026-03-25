export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cell = row.firstElementChild;
    if (cell) {
      while (cell.firstChild) li.append(cell.firstChild);
    }
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
