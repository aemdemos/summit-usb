import { getMetadata } from '../../scripts/aem.js';

const isDesktop = window.matchMedia('(min-width: 900px)');
let mobilePanelStack = ['main-menu'];

function closeAllMegamenus(nav) {
  const panels = nav.querySelectorAll('.megamenu-panel');
  panels.forEach((p) => { p.hidden = true; });
  const tabs = nav.querySelectorAll('.nav-submenu-item');
  tabs.forEach((t) => t.classList.remove('active'));
  const overlay = nav.querySelector('.megamenu-overlay');
  if (overlay) overlay.hidden = true;
}

function resetMobileMenu(nav) {
  const mobileMenu = nav.querySelector('.nav-mobile-menu');
  if (!mobileMenu) return;
  mobilePanelStack = ['main-menu'];
  const allPanels = mobileMenu.querySelectorAll('.mobile-panel');
  allPanels.forEach((p) => {
    p.classList.remove('active', 'behind');
  });
  const root = mobileMenu.querySelector('.mobile-panel-root');
  if (root) root.classList.add('active');
}

function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }
  if (expanded || isDesktop.matches) {
    closeAllMegamenus(nav);
  }
  if (expanded) {
    resetMobileMenu(nav);
  }
}

function buildMegamenuPanel(submenuLi) {
  const panel = document.createElement('div');
  panel.className = 'megamenu-panel';
  panel.hidden = true;

  const content = document.createElement('div');
  content.className = 'megamenu-content';

  const groups = document.createElement('div');
  groups.className = 'megamenu-groups';

  const nestedUl = submenuLi.querySelector(':scope > ul');
  if (!nestedUl) return panel;

  const children = [...nestedUl.children];
  children.forEach((groupLi) => {
    if (groupLi.classList.contains('promo-card')) {
      const promo = document.createElement('div');
      promo.className = 'megamenu-promo';
      const strong = groupLi.querySelector('strong');
      const em = groupLi.querySelector('em');
      const p = groupLi.querySelector('p');
      const a = groupLi.querySelector('a');
      if (strong) {
        const label = document.createElement('span');
        label.className = 'promo-label';
        label.textContent = strong.textContent;
        promo.append(label);
      }
      if (em) {
        const heading = document.createElement('strong');
        heading.className = 'promo-heading';
        heading.textContent = em.textContent;
        promo.append(heading);
      }
      if (p) {
        const desc = document.createElement('p');
        desc.className = 'promo-description';
        desc.textContent = p.textContent;
        promo.append(desc);
      }
      if (a) {
        const link = document.createElement('a');
        link.href = a.href;
        link.className = 'promo-cta';
        link.textContent = a.textContent;
        promo.append(link);
      }
      content.append(promo);
      return;
    }

    const group = document.createElement('div');
    group.className = 'megamenu-group';

    const strong = groupLi.querySelector(':scope > strong');
    if (strong) {
      const heading = document.createElement('h3');
      heading.className = 'megamenu-group-heading';
      heading.textContent = strong.textContent;
      group.append(heading);
    }

    const subUl = groupLi.querySelector(':scope > ul');
    if (subUl) {
      const list = document.createElement('ul');
      list.className = 'megamenu-links';
      [...subUl.children].forEach((li) => {
        const newLi = document.createElement('li');
        const a = li.querySelector('a');
        if (a) {
          const link = document.createElement('a');
          link.href = a.href;
          link.textContent = a.textContent;
          newLi.append(link);
        } else {
          newLi.textContent = li.textContent;
        }
        list.append(newLi);
      });
      group.append(list);
    }

    groups.append(group);
  });

  content.prepend(groups);
  panel.append(content);

  const ctaP = submenuLi.querySelector(':scope > .panel-cta');
  if (ctaP) {
    const ctaDiv = document.createElement('div');
    ctaDiv.className = 'megamenu-cta';
    const a = ctaP.querySelector('a');
    if (a) {
      const link = document.createElement('a');
      link.href = a.href;
      link.className = 'megamenu-cta-button';
      link.textContent = a.textContent;
      ctaDiv.append(link);
    }
    panel.append(ctaDiv);
  }

  return panel;
}

function buildSubmenu(personalLi, nav) {
  const submenuBar = document.createElement('div');
  submenuBar.className = 'nav-submenu';

  const ul = personalLi.querySelector(':scope > ul');
  if (!ul) return submenuBar;

  const panelsContainer = document.createElement('div');
  panelsContainer.className = 'megamenu-panels';

  [...ul.children].forEach((li) => {
    const a = li.querySelector(':scope > a');
    if (!a) return;

    const tab = document.createElement('button');
    tab.className = 'nav-submenu-item';
    tab.textContent = a.textContent;
    tab.setAttribute('type', 'button');

    const panel = buildMegamenuPanel(li);

    tab.addEventListener('click', () => {
      const isActive = tab.classList.contains('active');
      closeAllMegamenus(nav);
      if (!isActive) {
        tab.classList.add('active');
        panel.hidden = false;
        const overlay = nav.querySelector('.megamenu-overlay');
        if (overlay) overlay.hidden = false;
      }
    });

    submenuBar.append(tab);
    panelsContainer.append(panel);
  });

  return { submenuBar, panelsContainer };
}

function slideTo(mobileMenu, panelId) {
  const isBack = mobilePanelStack.includes(panelId);
  const target = mobileMenu.querySelector(`[data-panel-id="${panelId}"]`);
  if (!target) return;

  if (isBack) {
    // Going back: pop panels off the stack until we reach target
    while (mobilePanelStack.length > 0
      && mobilePanelStack[mobilePanelStack.length - 1] !== panelId) {
      const poppedId = mobilePanelStack.pop();
      const popped = mobileMenu.querySelector(`[data-panel-id="${poppedId}"]`);
      if (popped) popped.classList.remove('active', 'behind');
    }
    // Reveal the target (remove behind, add active)
    target.classList.remove('behind');
    target.classList.add('active');
  } else {
    // Going forward: current panel slides left (behind), new panel slides in
    const currentId = mobilePanelStack[mobilePanelStack.length - 1];
    const current = mobileMenu.querySelector(`[data-panel-id="${currentId}"]`);
    if (current) {
      current.classList.remove('active');
      current.classList.add('behind');
    }
    mobilePanelStack.push(panelId);
    target.classList.add('active');
  }
}

function createMobilePanel(id) {
  const panel = document.createElement('div');
  panel.className = 'mobile-panel';
  panel.setAttribute('data-panel-id', id);
  return panel;
}

function createMobileBackButton(labelText, targetPanelId, menuEl) {
  const btn = document.createElement('button');
  btn.className = 'mobile-back-btn';
  btn.type = 'button';
  const arrow = document.createElement('span');
  arrow.className = 'mobile-back-arrow';
  arrow.textContent = '‹';
  btn.append(arrow, ` Return to ${labelText}`);
  btn.addEventListener('click', () => slideTo(menuEl, targetPanelId));
  return btn;
}

function createMobileHeading(text) {
  const h = document.createElement('div');
  h.className = 'mobile-panel-heading';
  h.textContent = text;
  return h;
}

function createMobileNavItem(text, href, hasChevron, onClick) {
  const item = document.createElement('div');
  item.className = 'mobile-nav-item';
  if (hasChevron) item.classList.add('has-chevron');
  if (href && !hasChevron) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    a.className = 'mobile-nav-link';
    item.append(a);
  } else {
    const span = document.createElement('span');
    span.className = 'mobile-nav-label';
    span.textContent = text;
    item.append(span);
  }
  if (hasChevron) {
    const chevron = document.createElement('span');
    chevron.className = 'mobile-chevron';
    chevron.textContent = '›';
    item.append(chevron);
    if (onClick) item.addEventListener('click', onClick);
  }
  return item;
}

function buildMobileLevel3Content(deepUl, subLi, parentLabel, parentPanelId, deepPanel, ctx) {
  [...deepUl.children].forEach((deepLi) => {
    if (deepLi.classList.contains('promo-card') || deepLi.classList.contains('panel-cta')) return;
    const deepStrong = deepLi.querySelector(':scope > strong');
    const deepSubUl = deepLi.querySelector(':scope > ul');
    if (deepStrong && deepSubUl) {
      ctx.counter += 1;
      const groupPanelId = `panel-${ctx.counter}`;
      deepPanel.append(createMobileNavItem(
        deepStrong.textContent,
        null,
        true,
        () => slideTo(ctx.menu, groupPanelId),
      ));
      const groupPanel = createMobilePanel(groupPanelId);
      groupPanel.append(createMobileBackButton(parentLabel, parentPanelId, ctx.menu));
      groupPanel.append(createMobileHeading(deepStrong.textContent));
      [...deepSubUl.children].forEach((itemLi) => {
        const itemA = itemLi.querySelector('a');
        if (itemA) {
          groupPanel.append(createMobileNavItem(itemA.textContent.trim(), itemA.href, false));
        }
      });
      ctx.menu.append(groupPanel);
    } else {
      const deepA = deepLi.querySelector('a');
      if (deepA) {
        deepPanel.append(createMobileNavItem(deepA.textContent.trim(), deepA.href, false));
      }
    }
  });
  const ctaP = subLi.querySelector(':scope > .panel-cta');
  if (ctaP) {
    const ctaA = ctaP.querySelector('a');
    if (ctaA) {
      deepPanel.append(createMobileNavItem(ctaA.textContent.trim(), ctaA.href, false));
    }
  }
}

function buildMobileLevel2Content(subUl, parentText, subPanelId, subPanel, ctx) {
  [...subUl.children].forEach((subLi) => {
    const subA = subLi.querySelector(':scope > a');
    if (!subA) return;
    const subText = subA.textContent.trim();
    const deepUl = subLi.querySelector(':scope > ul');
    if (deepUl) {
      ctx.counter += 1;
      const deepPanelId = `panel-${ctx.counter}`;
      subPanel.append(createMobileNavItem(
        subText,
        null,
        true,
        () => slideTo(ctx.menu, deepPanelId),
      ));
      const deepPanel = createMobilePanel(deepPanelId);
      deepPanel.append(createMobileBackButton(parentText, subPanelId, ctx.menu));
      deepPanel.append(createMobileHeading(subText));
      buildMobileLevel3Content(deepUl, subLi, subText, deepPanelId, deepPanel, ctx);
      ctx.menu.append(deepPanel);
    } else {
      subPanel.append(createMobileNavItem(subText, subA.href, false));
    }
  });
}

function buildMobileUtilitySection(toolsSection, panel) {
  const utilSection = document.createElement('div');
  utilSection.className = 'mobile-utility-section';
  const toolsUl = toolsSection.querySelector('ul');
  if (!toolsUl) return;
  const iconMap = {
    'How can we help you?': 'search',
    Locations: 'location',
    Support: 'headset',
    'Financial education': 'book',
    'About us': 'people',
  };
  const items = [...toolsUl.children].filter((li) => {
    const a = li.querySelector('a');
    return a && a.textContent.trim() !== 'Log in';
  });
  items.reverse();
  items.forEach((li) => {
    const a = li.querySelector('a');
    const text = a.textContent.trim();
    const item = document.createElement('div');
    item.className = 'mobile-utility-item';
    const iconType = iconMap[text];
    if (iconType) item.setAttribute('data-icon', iconType);
    if (text === 'How can we help you?') {
      item.classList.add('smart-assistant-item');
      const icon = document.createElement('span');
      icon.className = 'mobile-utility-icon search-icon-mobile';
      const labelSpan = document.createElement('span');
      labelSpan.textContent = text;
      item.append(icon, labelSpan);
    } else {
      const icon = document.createElement('span');
      icon.className = 'mobile-utility-icon';
      const link = document.createElement('a');
      link.href = a.href;
      link.className = 'mobile-utility-link';
      link.textContent = text;
      item.append(icon, link);
    }
    utilSection.append(item);
  });
  panel.append(utilSection);
}

function buildMobileMenu(navSection, toolsSection) {
  const menu = document.createElement('div');
  menu.className = 'nav-mobile-menu';
  const ctx = { menu, counter: 0 };

  const menuPanel = createMobilePanel('main-menu');
  menuPanel.classList.add('mobile-panel-root', 'active');

  if (toolsSection) buildMobileUtilitySection(toolsSection, menuPanel);

  const navItems = document.createElement('div');
  navItems.className = 'mobile-nav-items';

  if (navSection) {
    const topUl = navSection.querySelector(':scope > ul');
    if (topUl) {
      [...topUl.children].forEach((li) => {
        const a = li.querySelector(':scope > a');
        if (!a) return;
        const text = a.textContent.trim();
        const subUl = li.querySelector(':scope > ul');
        if (subUl) {
          ctx.counter += 1;
          const subPanelId = `panel-${ctx.counter}`;
          navItems.append(createMobileNavItem(
            text,
            null,
            true,
            () => slideTo(menu, subPanelId),
          ));
          const subPanel = createMobilePanel(subPanelId);
          subPanel.append(createMobileBackButton('Main Menu', 'main-menu', menu));
          subPanel.append(createMobileHeading(text));
          buildMobileLevel2Content(subUl, text, subPanelId, subPanel, ctx);
          menu.append(subPanel);
        } else {
          navItems.append(createMobileNavItem(text, a.href, false));
        }
      });
    }
  }

  menuPanel.append(navItems);
  menu.prepend(menuPanel);
  return menu;
}

function buildBrand(brandSection) {
  const navBrand = document.createElement('div');
  navBrand.className = 'nav-brand';
  if (!brandSection) return navBrand;
  const brandLink = brandSection.querySelector('a');
  if (brandLink) {
    const a = document.createElement('a');
    a.href = brandLink.href;
    a.setAttribute('aria-label', 'U.S. Bank home');
    const img = brandSection.querySelector('img');
    if (img) {
      const logo = document.createElement('img');
      logo.src = img.getAttribute('src');
      logo.alt = img.alt || 'U.S. Bank';
      logo.loading = 'eager';
      a.append(logo);
    }
    navBrand.append(a);
  }
  return navBrand;
}

function buildTopbar(toolsSection) {
  const navTopbar = document.createElement('div');
  navTopbar.className = 'nav-topbar';
  const topbarLeft = document.createElement('div');
  topbarLeft.className = 'topbar-left';
  const topbarRight = document.createElement('div');
  topbarRight.className = 'topbar-right';
  if (toolsSection) {
    const toolsUl = toolsSection.querySelector('ul');
    if (toolsUl) {
      [...toolsUl.children].forEach((li, i) => {
        const a = li.querySelector('a');
        if (!a) return;
        const text = a.textContent.trim();
        const link = document.createElement('a');
        link.href = a.href;
        link.textContent = text;
        if (text === 'How can we help you?') {
          const btn = document.createElement('button');
          btn.className = 'topbar-smart-assistant';
          btn.type = 'button';
          const sIcon = document.createElement('span');
          sIcon.className = 'search-icon';
          const sLabel = document.createElement('span');
          sLabel.textContent = text;
          btn.append(sIcon, sLabel);
          topbarRight.append(btn);
        } else if (text === 'Log in') {
          const loginBtn = document.createElement('a');
          loginBtn.href = a.href;
          loginBtn.className = 'topbar-login';
          loginBtn.textContent = text;
          topbarRight.append(loginBtn);
        } else if (i < 2) {
          link.className = 'topbar-link';
          topbarLeft.append(link);
        } else {
          link.className = 'topbar-link';
          topbarRight.append(link);
        }
      });
    }
  }
  navTopbar.append(topbarLeft, topbarRight);
  return navTopbar;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return;

  const html = await resp.text();
  // eslint-disable-next-line secure-coding/no-xxe-injection -- CWE-611: safe; DOMParser text/html does not process external entities
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const sections = [...doc.body.children];

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  // Section 0: Brand (logo)
  const navBrand = buildBrand(sections[0]);

  // Section 1: Nav sections (main nav tree)
  const navSection = sections[1];
  const navSections = document.createElement('div');
  navSections.className = 'nav-sections';

  const primaryNav = document.createElement('div');
  primaryNav.className = 'nav-primary';

  let submenuResult = null;

  if (navSection) {
    const topUl = navSection.querySelector(':scope > ul');
    if (topUl) {
      [...topUl.children].forEach((li) => {
        const a = li.querySelector(':scope > a');
        if (!a) return;
        const text = a.textContent.trim();
        const hasSubmenu = li.querySelector(':scope > ul');

        const navItem = document.createElement('a');
        navItem.href = a.href;
        navItem.className = 'nav-primary-item';
        navItem.textContent = text;

        if (hasSubmenu) {
          navItem.classList.add('has-submenu');
          navItem.setAttribute('aria-current', 'true');
          submenuResult = buildSubmenu(li, nav);
        }

        primaryNav.append(navItem);
      });
    }
  }

  navSections.append(primaryNav);
  if (submenuResult) {
    navSections.append(submenuResult.submenuBar);
  }

  // Section 2: Tools (topbar utility links)
  const toolsSection = sections[2];
  const navTopbar = buildTopbar(toolsSection);

  // Mobile menu (slide-in panels)
  const mobileMenu = buildMobileMenu(navSection, toolsSection);

  // Mobile login button (shown in header bar)
  const mobileLogin = document.createElement('a');
  mobileLogin.className = 'nav-mobile-login';
  mobileLogin.textContent = 'Log in';
  if (toolsSection) {
    const loginLink = [...toolsSection.querySelectorAll('a')].find((a) => a.textContent.trim() === 'Log in');
    mobileLogin.href = loginLink ? loginLink.href : '#';
  }

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  const hBtn = document.createElement('button');
  hBtn.type = 'button';
  hBtn.setAttribute('aria-controls', 'nav');
  hBtn.setAttribute('aria-label', 'Open navigation');
  const hIcon = document.createElement('span');
  hIcon.className = 'nav-hamburger-icon';
  hBtn.append(hIcon);
  hamburger.append(hBtn);
  hamburger.addEventListener('click', () => toggleMenu(nav));

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'megamenu-overlay';
  overlay.hidden = true;
  overlay.addEventListener('click', () => closeAllMegamenus(nav));

  // Assemble
  nav.append(hamburger, navBrand, mobileLogin, navSections);
  if (submenuResult) {
    nav.append(submenuResult.panelsContainer);
  }
  nav.append(mobileMenu, overlay);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(navTopbar, nav);
  block.append(navWrapper);

  // Escape key
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      closeAllMegamenus(nav);
      if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
        toggleMenu(nav);
      }
    }
  });

  // Click outside panels
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !navTopbar.contains(e.target)) {
      closeAllMegamenus(nav);
    }
  });

  // Viewport resize handling
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, isDesktop.matches);
    closeAllMegamenus(nav);
  });
}
