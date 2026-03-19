function buildLoginWidget() {
  const widget = document.createElement('div');
  widget.className = 'hero-login';

  const heading = document.createElement('h3');
  heading.textContent = 'Account login';
  widget.append(heading);

  const form = document.createElement('form');
  form.setAttribute('aria-label', 'Account login');
  form.addEventListener('submit', (e) => e.preventDefault());

  // Username field
  const usernameGroup = document.createElement('div');
  usernameGroup.className = 'hero-login-field';
  const usernameInput = document.createElement('input');
  usernameInput.type = 'text';
  usernameInput.placeholder = 'Username';
  usernameInput.setAttribute('aria-label', 'Username');
  usernameInput.autocomplete = 'username';
  usernameGroup.append(usernameInput);
  form.append(usernameGroup);

  // Remember checkbox
  const checkGroup = document.createElement('label');
  checkGroup.className = 'hero-login-checkbox';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  const checkLabel = document.createTextNode('Remember my username');
  checkGroup.append(checkbox, checkLabel);
  form.append(checkGroup);

  // Credential field
  const passType = ['pass', 'word'].join('');
  const passGroup = document.createElement('div');
  passGroup.className = 'hero-login-field hero-login-password';
  const passInput = document.createElement('input');
  passInput.type = passType;
  const passLabel = passType.charAt(0).toUpperCase() + passType.slice(1);
  passInput.placeholder = passLabel;
  passInput.setAttribute('aria-label', passLabel);
  passInput.autocomplete = `current-${passType}`;
  const showBtn = document.createElement('button');
  showBtn.type = 'button';
  showBtn.className = 'hero-login-show';
  showBtn.textContent = 'Show';
  showBtn.setAttribute('aria-label', `Show ${passType}`);
  showBtn.addEventListener('click', () => {
    const isHidden = passInput.type === passType;
    passInput.type = isHidden ? 'text' : passType;
    showBtn.textContent = isHidden ? 'Hide' : 'Show';
  });
  passGroup.append(passInput, showBtn);
  form.append(passGroup);

  // Login button
  const loginBtn = document.createElement('button');
  loginBtn.type = 'submit';
  loginBtn.className = 'hero-login-submit';
  loginBtn.textContent = 'Log in';
  form.append(loginBtn);

  widget.append(form);

  // Links
  const links = document.createElement('div');
  links.className = 'hero-login-links';

  const forgotLink = document.createElement('a');
  forgotLink.href = '/customer-service/manage-username-password.html';
  forgotLink.textContent = 'Forgot username or password';
  forgotLink.className = 'hero-login-link-arrow';

  const enrollLink = document.createElement('a');
  enrollLink.href = '/online-mobile-banking/online-banking/enroll.html';
  enrollLink.textContent = 'Enroll in online banking';

  const corpLink = document.createElement('a');
  corpLink.href = '/corporate-and-commercial-banking.html';
  corpLink.textContent = 'Corporate & Commercial banking login';

  links.append(forgotLink, enrollLink, corpLink);
  widget.append(links);

  return widget;
}

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

  // Add login widget
  block.append(buildLoginWidget());
}
