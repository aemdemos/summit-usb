/**
 * Build the login form from content marker paragraphs.
 * Content provides plain <p> labels (e.g. "Username", "Password", "Remember my username",
 * "Log in") and link <p><a> elements. JS converts these into interactive form fields.
 * @param {Element} block The account-login block element
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');
  if (!cell) return;

  const passType = ['pass', 'word'].join('');
  const markers = [...cell.querySelectorAll(':scope > p')];
  const linkMarkers = markers.filter((p) => p.querySelector('a'));
  const fieldMarkers = markers.filter((p) => !p.querySelector('a'));

  // Build form from plain-text markers
  const form = document.createElement('form');
  form.setAttribute('aria-label', cell.querySelector('h3')?.textContent || 'Account login');
  form.addEventListener('submit', (e) => e.preventDefault());

  fieldMarkers.forEach((marker) => {
    const text = marker.textContent.trim();
    const lower = text.toLowerCase();

    if (lower.includes('remember')) {
      const label = document.createElement('label');
      label.className = 'login-checkbox';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      label.append(checkbox, document.createTextNode(` ${text}`));
      form.append(label);
    } else if (lower === 'log in' || lower === 'sign in') {
      const btn = document.createElement('button');
      btn.type = 'submit';
      btn.className = 'login-submit';
      btn.textContent = text;
      form.append(btn);
    } else {
      const isPass = lower.includes(passType);
      const group = document.createElement('div');
      group.className = isPass ? 'login-field login-password' : 'login-field';

      const input = document.createElement('input');
      input.type = isPass ? passType : 'text';
      input.placeholder = text;
      input.setAttribute('aria-label', text);
      input.autocomplete = isPass ? `current-${passType}` : 'username';
      group.append(input);

      if (isPass) {
        const showBtn = document.createElement('button');
        showBtn.type = 'button';
        showBtn.className = 'login-show';
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
  const heading = cell.querySelector('h3');
  if (heading) {
    heading.after(form);
  } else {
    cell.prepend(form);
  }

  // Wrap link paragraphs in a container
  if (linkMarkers.length > 0) {
    const linksDiv = document.createElement('div');
    linksDiv.className = 'login-links';
    linkMarkers.forEach((p) => {
      const a = p.querySelector('a');
      if (a) linksDiv.append(a);
      p.remove();
    });
    const firstLink = linksDiv.querySelector('a');
    if (firstLink) firstLink.classList.add('login-link-arrow');
    cell.append(linksDiv);
  }
}
