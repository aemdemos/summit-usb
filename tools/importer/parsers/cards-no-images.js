/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-no-images block.
 * Base: cards (no images variant). Source: https://www.usbank.com
 * Used for: Borrowing section (section 6) - text-only cards.
 *
 * Block library structure (1 column, multiple rows):
 *   Row 1: Block name "Cards (no images)"
 *   Each subsequent row: Heading + Description + CTA links
 */
export default function parse(element, { document }) {
  const cells = [];

  // Found in captured HTML: <div class="scb-card"> within styledContentBlock.background-secondary
  // Each card has heading and arrow-links for borrowing products
  const cardEls = element.querySelectorAll('.scb-card, .m-card-square');

  cardEls.forEach((card) => {
    const heading = card.querySelector('.heading h3, .heading h4, h3, h4');
    const description = card.querySelector('.body p, p');
    const ctaLinks = Array.from(card.querySelectorAll('.arrow-link, .button-group a'));

    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    ctaLinks.forEach((link) => textCell.push(link));

    if (textCell.length > 0) {
      cells.push(textCell);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-no-images', cells });
  element.replaceWith(block);
}
