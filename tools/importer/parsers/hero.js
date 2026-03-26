/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block — 3-column layout.
 * Base: hero. Source: https://www.usbank.com
 * Selectors from captured DOM: section.ghp-login-banner
 *
 * Block structure (1 row, 3 columns):
 *   Column 1: Superhead + Heading + Description + CTA buttons
 *   Column 2: Background image
 *   Column 3: Login widget content (heading + form fields + links)
 */
export default function parse(element, { document }) {
  // Extract background image
  const bgImage = element.querySelector('img.backgrounded, img.ghp-login-banner-img, picture img');

  // Extract heading content from the banner card overlay
  const bannerCard = element.querySelector('.m-banner-card, .layered-row > div:first-child');

  // Extract heading
  const heading = bannerCard
    ? bannerCard.querySelector('h2.heading, h2, h3')
    : element.querySelector('h2.heading, h2');

  // Extract superhead
  const superhead = bannerCard
    ? bannerCard.querySelector('h1.superhead, .superhead')
    : element.querySelector('.superhead');

  // Extract body text
  const bodyText = bannerCard
    ? bannerCard.querySelector('.body.selectorText p, .selectorText p.body, p.body')
    : element.querySelector('p.body');

  // Extract CTA buttons
  const ctaButtons = bannerCard
    ? Array.from(bannerCard.querySelectorAll('.button-group a.button'))
    : Array.from(element.querySelectorAll('.button-group a.button'));

  // Column 1: Content card
  const contentCol = [];
  if (superhead) {
    const p = document.createElement('p');
    p.textContent = superhead.textContent.trim();
    contentCol.push(p);
  }
  if (heading) contentCol.push(heading);
  if (bodyText) contentCol.push(bodyText);
  ctaButtons.forEach((btn) => {
    const p = document.createElement('p');
    const wrapper = btn.classList.contains('loud')
      ? document.createElement('strong')
      : document.createElement('em');
    btn.className = '';
    wrapper.append(btn);
    p.append(wrapper);
    contentCol.push(p);
  });

  // Column 2: Hero image
  const imageCol = bgImage ? [bgImage] : [];

  // Column 3: Login widget content markers
  const loginCol = [];
  const loginHeading = document.createElement('h3');
  loginHeading.textContent = 'Account login';
  loginCol.push(loginHeading);

  // Form element with fields
  const form = document.createElement('form');
  form.setAttribute('aria-label', 'Account login');

  const usernameField = document.createElement('div');
  usernameField.className = 'hero-login-field';
  const usernameInput = document.createElement('input');
  usernameInput.type = 'text';
  usernameInput.placeholder = 'Username';
  usernameInput.setAttribute('aria-label', 'Username');
  usernameInput.autocomplete = 'username';
  usernameField.append(usernameInput);
  form.append(usernameField);

  const checkLabel = document.createElement('label');
  checkLabel.className = 'hero-login-checkbox';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkLabel.append(checkbox);
  checkLabel.append(document.createTextNode(' Remember my username'));
  form.append(checkLabel);

  const passField = document.createElement('div');
  passField.className = 'hero-login-field hero-login-password';
  const passInput = document.createElement('input');
  passInput.type = 'password';
  passInput.placeholder = 'Password';
  passInput.setAttribute('aria-label', 'Password');
  passInput.autocomplete = 'current-password';
  passField.append(passInput);
  form.append(passField);

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'hero-login-submit';
  submitBtn.textContent = 'Log in';
  form.append(submitBtn);

  loginCol.push(form);

  // Login links
  const loginLinks = [
    ['/customer-service/manage-username-password.html', 'Forgot username or password'],
    ['/online-mobile-banking/online-banking/enroll.html', 'Enroll in online banking'],
    ['/corporate-and-commercial-banking.html', 'Corporate & Commercial banking login'],
  ];
  loginLinks.forEach(([href, text]) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    p.append(a);
    loginCol.push(p);
  });

  // Build single row with 3 columns
  const cells = [contentCol, imageCol, loginCol];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
