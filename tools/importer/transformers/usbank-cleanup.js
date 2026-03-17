/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: U.S. Bank cleanup.
 * Removes non-authorable content (header, footer, modals, login widget, social media).
 * Selectors from captured DOM of https://www.usbank.com.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove modal templates and overlays that may interfere with block parsing
    // Found in captured HTML: <template class="shield-modals" id="#speedBump">
    // Found in captured HTML: <template class="shield-modals" id="#cpra">
    WebImporter.DOMUtils.remove(element, [
      'template.shield-modals',
      '.speedBump',
      '.authorableModal',
    ]);

    // Remove login widget from hero (not authorable - requires backend integration)
    // Found in captured HTML: <div class="cs-10-lg c-3-lg hidden-md hidden-sm login-widget-wrapper">
    WebImporter.DOMUtils.remove(element, [
      '.login-widget-wrapper',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome
    // Found in captured HTML: <header>, <footer class="experiencefragment">
    // Found in captured HTML: <div class="socialMedia">, <div class="smart-assistant">
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '.socialMedia',
      '#smart-assistant',
      'noscript',
      'link',
      'iframe',
    ]);

    // Remove screen-reader-only structural markers (not authorable)
    // Found in captured HTML: <div class="sr-only disclosure_entry_notice">
    // Found in captured HTML: <div class="sr-only footer-nav-bottom">
    WebImporter.DOMUtils.remove(element, [
      '.sr-only.disclosure_entry_notice',
      '.sr-only.footer-nav-bottom',
    ]);

    // Clean up data-analytics attributes (tracking, not authorable)
    element.querySelectorAll('[data-analytics-click]').forEach((el) => {
      el.removeAttribute('data-analytics-click');
    });
    element.querySelectorAll('[data-queue_seq]').forEach((el) => {
      el.removeAttribute('data-queue_seq');
    });
  }
}
