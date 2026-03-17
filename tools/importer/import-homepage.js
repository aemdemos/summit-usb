/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import cardsParser from './parsers/cards.js';
import cardsNoImagesParser from './parsers/cards-no-images.js';
import columnsParser from './parsers/columns.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/usbank-cleanup.js';
import sectionsTransformer from './transformers/usbank-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'U.S. Bank homepage with hero banner, product cards, promotional sections, and account login',
  urls: [
    'https://www.usbank.com',
  ],
  blocks: [
    {
      name: 'hero',
      instances: [
        'section.ghp-login-banner',
      ],
    },
    {
      name: 'cards',
      instances: [
        'section.cards-container',
        'section.product-category-cards',
        'section.styledContentBlock.nocolor',
      ],
    },
    {
      name: 'cards-no-images',
      instances: [
        'section.styledContentBlock.background-secondary',
      ],
    },
    {
      name: 'columns',
      instances: [
        'section.full-span-content-block',
        'section.component-fullspan',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: 'section.ghp-login-banner',
      style: null,
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Promotional Cards',
      selector: 'section.cards-container',
      style: null,
      blocks: ['cards'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Product Category Icons',
      selector: 'section.product-category-cards',
      style: null,
      blocks: ['cards'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Banking Smarter',
      selector: 'section.full-span-content-block',
      style: 'grey',
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Plan Track Achieve',
      selector: 'section.component-fullspan',
      style: null,
      blocks: ['columns'],
      defaultContent: ['section.component-fullspan .component-offset > h2'],
    },
    {
      id: 'section-6',
      name: 'Borrowing',
      selector: 'section.styledContentBlock.background-secondary',
      style: 'grey',
      blocks: ['cards-no-images'],
      defaultContent: ['section.styledContentBlock.background-secondary .m-section-header'],
    },
    {
      id: 'section-7',
      name: 'Happening Now',
      selector: 'section.styledContentBlock.nocolor',
      style: null,
      blocks: ['cards'],
      defaultContent: ['section.styledContentBlock.nocolor .m-section-header'],
    },
    {
      id: 'section-8',
      name: 'Disclosures',
      selector: 'div.disclosure section',
      style: null,
      blocks: [],
      defaultContent: ['div.disclosure .body'],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  hero: heroParser,
  cards: cardsParser,
  'cards-no-images': cardsNoImagesParser,
  columns: columnsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
