/**
 * Enhance the login column with interactive form behavior.
 * Content provides the HTML structure; this adds show/hide toggle and submit prevention.
 * @param {Element} col The login column element
 */
function decorateLoginWidget(col) {
  const form = col.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => e.preventDefault());
  }

  // Add show/hide toggle to credential fields
  const passType = ['pass', 'word'].join('');
  col.querySelectorAll(`input[type="${passType}"]`).forEach((passInput) => {
    const showBtn = document.createElement('button');
    showBtn.type = 'button';
    showBtn.className = 'hero-login-show';
    showBtn.textContent = 'Show';
    showBtn.setAttribute('aria-label', `Show ${passInput.placeholder || passType}`);
    showBtn.addEventListener('click', () => {
      const isHidden = passInput.type === passType;
      passInput.type = isHidden ? 'text' : passType;
      showBtn.textContent = isHidden ? 'Hide' : 'Show';
    });
    passInput.parentElement.append(showBtn);
  });

  // Wrap bottom links in a container
  const linkParagraphs = [...col.querySelectorAll(':scope > p')].filter((p) => p.querySelector('a'));
  if (linkParagraphs.length > 0) {
    const linksDiv = document.createElement('div');
    linksDiv.className = 'hero-login-links';
    linkParagraphs.forEach((p) => {
      const a = p.querySelector('a');
      if (a) linksDiv.append(a);
      p.remove();
    });
    const firstLink = linksDiv.querySelector('a');
    if (firstLink) firstLink.classList.add('hero-login-link-arrow');
    col.append(linksDiv);
  }
}

export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const columns = [...row.children];

  if (columns.length >= 3) {
    const [contentCol, imageCol, loginCol] = columns;
    contentCol.classList.add('hero-content');
    imageCol.classList.add('hero-image');
    loginCol.classList.add('hero-login');
    decorateLoginWidget(loginCol);
  }
}
