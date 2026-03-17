/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block.
 * Base: cards. Source: https://www.usbank.com
 * Used for: promotional cards (section 2), product category icons (section 3),
 *           happening now article cards (section 7).
 *
 * Block library structure (2 columns, multiple rows):
 *   Row 1: Block name
 *   Each subsequent row: Image | Title + Description + CTA link
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which type of cards section this is
  const isPromotionalCards = !!element.querySelector('.cards-container, .m-card-square');
  const isProductCategory = !!element.querySelector('.product-category-cards, .card-count-6');
  const isHappeningNow = !!element.querySelector('.styledContentBlock');

  if (isProductCategory) {
    // Product category icon cards
    // Found in captured HTML: <ul class="card-count-6"> with <li> items
    // Each <li> has <a class="m-card"> with icon <img> and text
    const items = element.querySelectorAll('ul.card-count-6 > li, .product-category-cards li');
    items.forEach((item) => {
      const icon = item.querySelector('.icon img, img');
      const link = item.querySelector('a.m-card, a');
      const label = item.querySelector('.card-label, .body');

      const imageCell = icon ? [icon] : [''];
      const textCell = [];
      if (label) {
        textCell.push(label);
      } else if (link) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent.trim();
        p.append(a);
        textCell.push(p);
      }
      cells.push([imageCell, textCell]);
    });
  } else if (isPromotionalCards) {
    // Promotional cards (3 cards with images)
    // Found in captured HTML: <div class="m-card-square"> elements
    const cardEls = element.querySelectorAll('.m-card-square');
    cardEls.forEach((card) => {
      const image = card.querySelector('picture img, img.backgrounded');
      const superhead = card.querySelector('.superhead h2, .superhead');
      const heading = card.querySelector('.heading.small h3, .heading h3, h3');
      const body = card.querySelector('.body p, .story-content .body');
      const ctaLink = card.querySelector('.arrow-link, .button-group a');

      const imageCell = image ? [image] : [''];
      const textCell = [];
      if (superhead) {
        const p = document.createElement('p');
        p.textContent = superhead.textContent.trim();
        textCell.push(p);
      }
      if (heading) textCell.push(heading);
      if (body) textCell.push(body);
      if (ctaLink) textCell.push(ctaLink);

      cells.push([imageCell, textCell]);
    });
  } else {
    // Happening Now / generic article cards
    // Found in captured HTML: <div class="scb-card"> elements within styledContentBlock
    const cardEls = element.querySelectorAll('.scb-card, .m-card-square');
    cardEls.forEach((card) => {
      const image = card.querySelector('picture img, img');
      const superhead = card.querySelector('.superhead h3, .superhead');
      const heading = card.querySelector('.heading h4, .heading h3, h3, h4');
      const ctaLink = card.querySelector('.arrow-link, .button-group a');

      const imageCell = image ? [image] : [''];
      const textCell = [];
      if (superhead) {
        const p = document.createElement('p');
        p.textContent = superhead.textContent.trim();
        textCell.push(p);
      }
      if (heading) textCell.push(heading);
      if (ctaLink) textCell.push(ctaLink);

      cells.push([imageCell, textCell]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
