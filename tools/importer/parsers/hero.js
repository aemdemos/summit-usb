/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block.
 * Base: hero. Source: https://www.usbank.com
 * Selectors from captured DOM: section.ghp-login-banner
 *
 * Block library structure (1 column, 3 rows):
 *   Row 1: Block name
 *   Row 2: Background image
 *   Row 3: Title + Subheading + CTA buttons
 */
export default function parse(element, { document }) {
  // Extract background image
  // Found in captured HTML: <img class="backgrounded of-cover op-cc responsive ghp-login-banner-img">
  const bgImage = element.querySelector('img.backgrounded, img.ghp-login-banner-img, picture img');

  // Extract heading content from the banner card overlay
  // Found in captured HTML: <div class="m-banner-card bordered">
  const bannerCard = element.querySelector('.m-banner-card, .layered-row > div:first-child');

  // Extract heading - found as h2.heading.medium
  const heading = bannerCard
    ? bannerCard.querySelector('h2.heading, h2, h3')
    : element.querySelector('h2.heading, h2');

  // Extract superhead - found as h1.superhead "PERSONAL BANKING"
  const superhead = bannerCard
    ? bannerCard.querySelector('h1.superhead, .superhead')
    : element.querySelector('.superhead');

  // Extract body text
  const bodyText = bannerCard
    ? bannerCard.querySelector('.body.selectorText p, .selectorText p.body, p.body')
    : element.querySelector('p.body');

  // Extract CTA buttons
  // Found in captured HTML: <a class="button loud small"> and <a class="button secondary small">
  const ctaButtons = bannerCard
    ? Array.from(bannerCard.querySelectorAll('.button-group a.button'))
    : Array.from(element.querySelectorAll('.button-group a.button'));

  // Build cells matching hero block library structure
  const cells = [];

  // Row 1: Background image (optional)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content (heading + subheading + description + CTAs)
  const contentCell = [];
  if (superhead) {
    const p = document.createElement('p');
    p.textContent = superhead.textContent.trim();
    contentCell.push(p);
  }
  if (heading) contentCell.push(heading);
  if (bodyText) contentCell.push(bodyText);
  ctaButtons.forEach((btn) => contentCell.push(btn));

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
