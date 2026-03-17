/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block.
 * Base: columns. Source: https://www.usbank.com
 * Used for: Banking Smarter section (section 4) and Plan/Track section (section 5).
 *
 * Block library structure (multiple columns, multiple rows):
 *   Row 1: Block name
 *   Each subsequent row: Column 1 content | Column 2 content | ...
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which columns section this is
  const isBankingSmarter = !!element.querySelector('.full-span-content-block, .fsb-block, .fsb-content-container');
  const isPlanTrack = !!element.querySelector('.component-fullspan, .infoComp');

  if (isBankingSmarter) {
    // Banking Smarter: 2-column layout
    // Found in captured HTML: <section class="full-span-content-block">
    // Left: <picture> with image, Right: <div class="fsb-content-container">
    const image = element.querySelector('picture img, img.responsive');
    const contentContainer = element.querySelector('.fsb-content-container, .fsb-block .sub-grid > div:last-child');

    const heading = contentContainer
      ? contentContainer.querySelector('h3.display, h3, h2')
      : element.querySelector('h3.display, h3');
    const bodyParagraphs = contentContainer
      ? Array.from(contentContainer.querySelectorAll('.textContainer p, .body p, p'))
      : [];
    const ctaButton = contentContainer
      ? contentContainer.querySelector('.button-group a.button, a.button')
      : element.querySelector('a.button');

    // Column 1: Image
    const col1 = [];
    if (image) col1.push(image);

    // Column 2: Heading + body + CTA
    const col2 = [];
    if (heading) col2.push(heading);
    bodyParagraphs.forEach((p) => col2.push(p));
    if (ctaButton) col2.push(ctaButton);

    cells.push([col1, col2]);
  } else if (isPlanTrack) {
    // Plan, Track, Achieve: complex layout - image | features | services
    // Found in captured HTML: <section class="component-fullspan">
    const imageEl = element.querySelector('.image-container img, img.phone-image');

    // Left features list
    // Found in captured HTML: <div class="left gc-2 gc-1-sm"> with icon list
    const leftContent = element.querySelector('.left.gc-2, .left');
    const featureHeading = leftContent ? leftContent.querySelector('h3.heading, h3') : null;
    const featureItems = leftContent
      ? Array.from(leftContent.querySelectorAll('.iconlist-item .content p'))
      : [];
    const downloadLink = leftContent
      ? leftContent.querySelector('a.secondary, a[href*="mobile-banking"]')
      : null;

    // Right services list
    // Found in captured HTML: <div class="right gc-1"> with service items
    const rightContent = element.querySelector('.right.gc-1, .right');
    const serviceItems = rightContent
      ? Array.from(rightContent.querySelectorAll('.iconlist-item'))
      : [];

    // Column 1: Phone image
    const col1 = [];
    if (imageEl) col1.push(imageEl);

    // Column 2: Features heading + bullet list + download link
    const col2 = [];
    if (featureHeading) col2.push(featureHeading);
    if (featureItems.length > 0) {
      const ul = document.createElement('ul');
      featureItems.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item.textContent.trim();
        ul.append(li);
      });
      col2.push(ul);
    }
    if (downloadLink) col2.push(downloadLink);

    // Column 3: Service items (heading + link each)
    const col3 = [];
    serviceItems.forEach((item) => {
      const serviceHeading = item.querySelector('h3.heading, h3');
      const serviceLink = item.querySelector('a.arrow-link, a');
      if (serviceHeading) col3.push(serviceHeading);
      if (serviceLink) col3.push(serviceLink);
    });

    cells.push([col1, col2, col3]);
  } else {
    // Fallback: generic 2-column extraction
    const children = Array.from(element.querySelectorAll(':scope > div > div, :scope > div'));
    if (children.length >= 2) {
      cells.push([children[0], children[1]]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
