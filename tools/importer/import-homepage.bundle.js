var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const bgImage = element.querySelector("img.backgrounded, img.ghp-login-banner-img, picture img");
    const bannerCard = element.querySelector(".m-banner-card, .layered-row > div:first-child");
    const heading = bannerCard ? bannerCard.querySelector("h2.heading, h2, h3") : element.querySelector("h2.heading, h2");
    const superhead = bannerCard ? bannerCard.querySelector("h1.superhead, .superhead") : element.querySelector(".superhead");
    const bodyText = bannerCard ? bannerCard.querySelector(".body.selectorText p, .selectorText p.body, p.body") : element.querySelector("p.body");
    const ctaButtons = bannerCard ? Array.from(bannerCard.querySelectorAll(".button-group a.button")) : Array.from(element.querySelectorAll(".button-group a.button"));
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (superhead) {
      const p = document.createElement("p");
      p.textContent = superhead.textContent.trim();
      contentCell.push(p);
    }
    if (heading) contentCell.push(heading);
    if (bodyText) contentCell.push(bodyText);
    ctaButtons.forEach((btn) => contentCell.push(btn));
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
    const cells = [];
    const isPromotionalCards = !!element.querySelector(".cards-container, .m-card-square");
    const isProductCategory = !!element.querySelector(".product-category-cards, .card-count-6");
    const isHappeningNow = !!element.querySelector(".styledContentBlock");
    if (isProductCategory) {
      const items = element.querySelectorAll("ul.card-count-6 > li, .product-category-cards li");
      items.forEach((item) => {
        const icon = item.querySelector(".icon img, img");
        const link = item.querySelector("a.m-card, a");
        const label = item.querySelector(".card-label, .body");
        const imageCell = icon ? [icon] : [""];
        const textCell = [];
        if (label) {
          textCell.push(label);
        } else if (link) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = link.textContent.trim();
          p.append(a);
          textCell.push(p);
        }
        cells.push([imageCell, textCell]);
      });
    } else if (isPromotionalCards) {
      const cardEls = element.querySelectorAll(".m-card-square");
      cardEls.forEach((card) => {
        const image = card.querySelector("picture img, img.backgrounded");
        const superhead = card.querySelector(".superhead h2, .superhead");
        const heading = card.querySelector(".heading.small h3, .heading h3, h3");
        const body = card.querySelector(".body p, .story-content .body");
        const ctaLink = card.querySelector(".arrow-link, .button-group a");
        const imageCell = image ? [image] : [""];
        const textCell = [];
        if (superhead) {
          const p = document.createElement("p");
          p.textContent = superhead.textContent.trim();
          textCell.push(p);
        }
        if (heading) textCell.push(heading);
        if (body) textCell.push(body);
        if (ctaLink) textCell.push(ctaLink);
        cells.push([imageCell, textCell]);
      });
    } else {
      const cardEls = element.querySelectorAll(".scb-card, .m-card-square");
      cardEls.forEach((card) => {
        const image = card.querySelector("picture img, img");
        const superhead = card.querySelector(".superhead h3, .superhead");
        const heading = card.querySelector(".heading h4, .heading h3, h3, h4");
        const ctaLink = card.querySelector(".arrow-link, .button-group a");
        const imageCell = image ? [image] : [""];
        const textCell = [];
        if (superhead) {
          const p = document.createElement("p");
          p.textContent = superhead.textContent.trim();
          textCell.push(p);
        }
        if (heading) textCell.push(heading);
        if (ctaLink) textCell.push(ctaLink);
        cells.push([imageCell, textCell]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-no-images.js
  function parse3(element, { document }) {
    const cells = [];
    const cardEls = element.querySelectorAll(".scb-card, .m-card-square");
    cardEls.forEach((card) => {
      const heading = card.querySelector(".heading h3, .heading h4, h3, h4");
      const description = card.querySelector(".body p, p");
      const ctaLinks = Array.from(card.querySelectorAll(".arrow-link, .button-group a"));
      const textCell = [];
      if (heading) textCell.push(heading);
      if (description) textCell.push(description);
      ctaLinks.forEach((link) => textCell.push(link));
      if (textCell.length > 0) {
        cells.push(textCell);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-no-images", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse4(element, { document }) {
    const cells = [];
    const isBankingSmarter = !!element.querySelector(".full-span-content-block, .fsb-block, .fsb-content-container");
    const isPlanTrack = !!element.querySelector(".component-fullspan, .infoComp");
    if (isBankingSmarter) {
      const image = element.querySelector("picture img, img.responsive");
      const contentContainer = element.querySelector(".fsb-content-container, .fsb-block .sub-grid > div:last-child");
      const heading = contentContainer ? contentContainer.querySelector("h3.display, h3, h2") : element.querySelector("h3.display, h3");
      const bodyParagraphs = contentContainer ? Array.from(contentContainer.querySelectorAll(".textContainer p, .body p, p")) : [];
      const ctaButton = contentContainer ? contentContainer.querySelector(".button-group a.button, a.button") : element.querySelector("a.button");
      const col1 = [];
      if (image) col1.push(image);
      const col2 = [];
      if (heading) col2.push(heading);
      bodyParagraphs.forEach((p) => col2.push(p));
      if (ctaButton) col2.push(ctaButton);
      cells.push([col1, col2]);
    } else if (isPlanTrack) {
      const imageEl = element.querySelector(".image-container img, img.phone-image");
      const leftContent = element.querySelector(".left.gc-2, .left");
      const featureHeading = leftContent ? leftContent.querySelector("h3.heading, h3") : null;
      const featureItems = leftContent ? Array.from(leftContent.querySelectorAll(".iconlist-item .content p")) : [];
      const downloadLink = leftContent ? leftContent.querySelector('a.secondary, a[href*="mobile-banking"]') : null;
      const rightContent = element.querySelector(".right.gc-1, .right");
      const serviceItems = rightContent ? Array.from(rightContent.querySelectorAll(".iconlist-item")) : [];
      const col1 = [];
      if (imageEl) col1.push(imageEl);
      const col2 = [];
      if (featureHeading) col2.push(featureHeading);
      if (featureItems.length > 0) {
        const ul = document.createElement("ul");
        featureItems.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item.textContent.trim();
          ul.append(li);
        });
        col2.push(ul);
      }
      if (downloadLink) col2.push(downloadLink);
      const col3 = [];
      serviceItems.forEach((item) => {
        const serviceHeading = item.querySelector("h3.heading, h3");
        const serviceLink = item.querySelector("a.arrow-link, a");
        if (serviceHeading) col3.push(serviceHeading);
        if (serviceLink) col3.push(serviceLink);
      });
      cells.push([col1, col2, col3]);
    } else {
      const children = Array.from(element.querySelectorAll(":scope > div > div, :scope > div"));
      if (children.length >= 2) {
        cells.push([children[0], children[1]]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/usbank-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "template.shield-modals",
        ".speedBump",
        ".authorableModal"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".login-widget-wrapper"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        ".socialMedia",
        "#smart-assistant",
        "noscript",
        "link",
        "iframe"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".sr-only.disclosure_entry_notice",
        ".sr-only.footer-nav-bottom"
      ]);
      element.querySelectorAll("[data-analytics-click]").forEach((el) => {
        el.removeAttribute("data-analytics-click");
      });
      element.querySelectorAll("[data-queue_seq]").forEach((el) => {
        el.removeAttribute("data-queue_seq");
      });
    }
  }

  // tools/importer/transformers/usbank-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "U.S. Bank homepage with hero banner, product cards, promotional sections, and account login",
    urls: [
      "https://www.usbank.com"
    ],
    blocks: [
      {
        name: "hero",
        instances: [
          "section.ghp-login-banner"
        ]
      },
      {
        name: "cards",
        instances: [
          "section.cards-container",
          "section.product-category-cards",
          "section.styledContentBlock.nocolor"
        ]
      },
      {
        name: "cards-no-images",
        instances: [
          "section.styledContentBlock.background-secondary"
        ]
      },
      {
        name: "columns",
        instances: [
          "section.full-span-content-block",
          "section.component-fullspan"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: "section.ghp-login-banner",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Promotional Cards",
        selector: "section.cards-container",
        style: null,
        blocks: ["cards"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Product Category Icons",
        selector: "section.product-category-cards",
        style: null,
        blocks: ["cards"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Banking Smarter",
        selector: "section.full-span-content-block",
        style: "grey",
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Plan Track Achieve",
        selector: "section.component-fullspan",
        style: null,
        blocks: ["columns"],
        defaultContent: ["section.component-fullspan .component-offset > h2"]
      },
      {
        id: "section-6",
        name: "Borrowing",
        selector: "section.styledContentBlock.background-secondary",
        style: "grey",
        blocks: ["cards-no-images"],
        defaultContent: ["section.styledContentBlock.background-secondary .m-section-header"]
      },
      {
        id: "section-7",
        name: "Happening Now",
        selector: "section.styledContentBlock.nocolor",
        style: null,
        blocks: ["cards"],
        defaultContent: ["section.styledContentBlock.nocolor .m-section-header"]
      },
      {
        id: "section-8",
        name: "Disclosures",
        selector: "div.disclosure section",
        style: null,
        blocks: [],
        defaultContent: ["div.disclosure .body"]
      }
    ]
  };
  var parsers = {
    hero: parse,
    cards: parse2,
    "cards-no-images": parse3,
    columns: parse4
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
