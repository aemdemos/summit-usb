import { getMetadata, decorateIcons, DOMPURIFY } from '../../scripts/aem.js';
import { ensureDOMPurify } from '../../scripts/scripts.js';

const SOCIAL_PLATFORMS = {
  facebook: 'facebook',
  'x.com': 'x-twitter',
  twitter: 'x-twitter',
  instagram: 'instagram',
  linkedin: 'linkedin',
  youtube: 'youtube',
};

/**
 * Detect social platform from a link's href or text.
 * @param {HTMLAnchorElement} link
 * @returns {string|null} icon name or null
 */
function detectSocialPlatform(link) {
  const href = link.href.toLowerCase();
  const text = link.textContent.trim().toLowerCase();
  const entries = Object.entries(SOCIAL_PLATFORMS);
  for (let i = 0; i < entries.length; i += 1) {
    const [key, icon] = entries[i];
    if (href.includes(key) || text === key) return icon;
  }
  return null;
}

/**
 * Build social icons row from a section containing social links.
 * @param {Element} section
 * @returns {Element}
 */
function buildSocialSection(section) {
  const wrapper = document.createElement('div');
  wrapper.className = 'footer-social';
  const links = section.querySelectorAll('a');
  links.forEach((link) => {
    const platform = detectSocialPlatform(link);
    if (platform) {
      const a = document.createElement('a');
      a.href = link.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', link.title || `${platform} opens in new tab.`);
      const icon = document.createElement('span');
      icon.className = `icon icon-${platform}`;
      a.append(icon);
      wrapper.append(a);
    }
  });
  return wrapper;
}

/**
 * Build navigation links grid from a section containing nav links.
 * @param {Element} section
 * @param {string} privacyIconSrc
 * @returns {Element}
 */
function buildNavSection(section, privacyIconSrc) {
  const wrapper = document.createElement('div');
  wrapper.className = 'footer-nav';
  const grid = document.createElement('nav');
  grid.className = 'footer-links';
  grid.setAttribute('aria-label', 'Footer');
  const links = section.querySelectorAll('a');
  links.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent;
    if (link.textContent.toLowerCase().includes('privacy choices') && privacyIconSrc) {
      const img = document.createElement('img');
      img.src = privacyIconSrc;
      img.alt = 'Privacy options';
      img.className = 'footer-privacy-icon';
      img.width = 30;
      img.height = 14;
      a.append(img);
    }
    grid.append(a);
  });
  wrapper.append(grid);
  return wrapper;
}

/**
 * Build address section from content.
 * @param {Element} section
 * @returns {Element}
 */
function buildAddressSection(section) {
  const wrapper = document.createElement('div');
  wrapper.className = 'footer-address';
  const paragraphs = section.querySelectorAll('p');
  paragraphs.forEach((p) => {
    const line = document.createElement('p');
    line.textContent = p.textContent;
    wrapper.append(line);
  });
  return wrapper;
}

/**
 * Build copyright section from content.
 * @param {Element} section
 * @returns {Element}
 */
function buildCopyrightSection(section) {
  const wrapper = document.createElement('div');
  wrapper.className = 'footer-copyright';
  const p = document.createElement('p');
  p.textContent = section.querySelector('p')?.textContent || '';
  wrapper.append(p);
  return wrapper;
}

/**
 * Loads and decorates the footer.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';

  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${footerPath}.plain.html`);
  }
  if (!resp.ok) return;

  await ensureDOMPurify();
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = window.DOMPurify.sanitize(html, DOMPURIFY);

  const sections = tmp.querySelectorAll(':scope > div');
  block.textContent = '';

  const footer = document.createElement('div');
  footer.className = 'footer-content';

  // Find privacy icon from content
  const privacyImg = tmp.querySelector('img[src*="privacy"]');
  const privacyIconSrc = privacyImg ? privacyImg.getAttribute('src') : '';

  // Bottom area: links on left, address+copyright on right
  const bottomArea = document.createElement('div');
  bottomArea.className = 'footer-bottom';
  const infoColumn = document.createElement('div');
  infoColumn.className = 'footer-info';

  sections.forEach((section, index) => {
    const links = section.querySelectorAll('a');
    const hasSocialLinks = [...links].some((l) => detectSocialPlatform(l));

    if (index === 0 && hasSocialLinks) {
      footer.append(buildSocialSection(section));
    } else if (links.length > 3) {
      bottomArea.prepend(buildNavSection(section, privacyIconSrc));
    } else if (section.textContent.includes('\u00A9') || section.textContent.includes('\u00a9')) {
      infoColumn.append(buildCopyrightSection(section));
    } else {
      infoColumn.append(buildAddressSection(section));
    }
  });

  bottomArea.append(infoColumn);
  footer.append(bottomArea);
  block.append(footer);
  decorateIcons(block);
}
