const status = document.querySelector('#widget-status');
const widget = document.querySelector('#wp-widget-reviews');
const content = document.querySelector('#widget-content');
const initialContent = widget.innerHTML;
let failed = false;
function unavailable() {
  failed = true;
  status.textContent = 'Le module est indisponible. Vous pouvez lire les avis directement sur Mariages.net.';
  widget.innerHTML = initialContent;
}
const timeout = setTimeout(unavailable, 15000);
const observer = new MutationObserver(() => {
  if (failed || widget.innerHTML === initialContent) return;
  clearTimeout(timeout);
  status.textContent = '';
});
observer.observe(widget, { childList: true, subtree: true, characterData: true });
const script = document.createElement('script');
script.src = 'https://cdn1.mariages.net/js/wp-widget.js?symfnw-FR48-1-20260922-012-0_www_m_';
script.async = true;
script.addEventListener('load', () => {
  if (failed) return;
  try {
    if (typeof window.wpShowReviews !== 'function') throw new Error('Widget unavailable');
    window.wpShowReviews(265589, 'black');
  } catch {
    clearTimeout(timeout);
    unavailable();
  }
});
script.addEventListener('error', () => { clearTimeout(timeout); unavailable(); });
document.body.append(script);
new ResizeObserver(() => {
  window.parent.postMessage({ type: 'big-brothers-reviews-height', height: Math.ceil(content.getBoundingClientRect().height) + 16 }, '*');
}).observe(content);
