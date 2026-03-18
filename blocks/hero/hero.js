export default function decorate(block) {
  // Style CTA links as buttons
  const contentDiv = block.querySelector(':scope > div:last-child');
  if (!contentDiv) return;

  const linkDivs = contentDiv.querySelectorAll(':scope > div');
  linkDivs.forEach((div) => {
    const link = div.querySelector('a');
    if (link && div.children.length === 1 && !div.querySelector('h1, h2, h3, h4, h5, h6, picture')) {
      link.classList.add('button');
      div.classList.add('button-container');
    }
  });
}
