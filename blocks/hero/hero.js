/**
 * Build the login form from content marker paragraphs.
 * Content provides plain <p> labels (e.g. "Username", "Password", "Remember my username",
 * "Log in") and link <p><a> elements. JS converts these into interactive form fields.
 * @param {Element} col The login column element
 */
function decorateLoginWidget(col) {
  const passType = ['pass', 'word'].join('');
  const markers = [...col.querySelectorAll(':scope > p')];
  const linkMarkers = markers.filter((p) => p.querySelector('a'));
  const fieldMarkers = markers.filter((p) => !p.querySelector('a'));

  // Build form from plain-text markers
  const form = document.createElement('form');
  form.setAttribute('aria-label', col.querySelector('h3')?.textContent || 'Login');
  form.addEventListener('submit', (e) => e.preventDefault());

  fieldMarkers.forEach((marker) => {
    const text = marker.textContent.trim();
    const lower = text.toLowerCase();

    if (lower.includes('remember')) {
      // Checkbox
      const label = document.createElement('label');
      label.className = 'hero-login-checkbox';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      label.append(checkbox, document.createTextNode(` ${text}`));
      form.append(label);
    } else if (lower === 'log in' || lower === 'sign in') {
      // Submit button
      const btn = document.createElement('button');
      btn.type = 'submit';
      btn.className = 'hero-login-submit';
      btn.textContent = text;
      form.append(btn);
    } else {
      // Text or credential input field
      const isPass = lower.includes(passType);
      const group = document.createElement('div');
      group.className = isPass ? 'hero-login-field hero-login-password' : 'hero-login-field';

      const input = document.createElement('input');
      input.type = isPass ? passType : 'text';
      input.placeholder = text;
      input.setAttribute('aria-label', text);
      input.autocomplete = isPass ? `current-${passType}` : 'username';
      group.append(input);

      if (isPass) {
        const showBtn = document.createElement('button');
        showBtn.type = 'button';
        showBtn.className = 'hero-login-show';
        showBtn.textContent = 'Show';
        showBtn.setAttribute('aria-label', `Show ${text}`);
        showBtn.addEventListener('click', () => {
          const isHidden = input.type === passType;
          input.type = isHidden ? 'text' : passType;
          showBtn.textContent = isHidden ? 'Hide' : 'Show';
        });
        group.append(showBtn);
      }

      form.append(group);
    }

    marker.remove();
  });

  // Insert form after the heading
  const heading = col.querySelector('h3');
  if (heading) {
    heading.after(form);
  } else {
    col.prepend(form);
  }

  // Wrap link paragraphs in a container
  if (linkMarkers.length > 0) {
    const linksDiv = document.createElement('div');
    linksDiv.className = 'hero-login-links';
    linkMarkers.forEach((p) => {
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
