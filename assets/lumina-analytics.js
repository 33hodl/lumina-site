/* Lumina lightweight CRO instrumentation.
   Free stack: Telegram start attribution now; PostHog when project key is added.
   Keep this small: one experiment, one action, no page bloat. */
(function () {
  var POSTHOG_KEY = ''; // Public project key from PostHog. Not a secret. Fill to enable PostHog events.
  var POSTHOG_HOST = 'https://us.i.posthog.com';
  var EXPERIMENT = 'cta_color_v1';
  var STORAGE_KEY = 'lumina_' + EXPERIMENT;
  var START_PREFIX = 'site_cta_';

  var variants = {
    black: { bg: '#171411', fg: '#FAF8F3', border: '#171411', hover: '#24201B' },
    clay: { bg: '#D97757', fg: '#FFFDF8', border: '#C86545', hover: '#C86545' },
    telegram: { bg: '#2AABEE', fg: '#FFFFFF', border: '#229ED9', hover: '#229ED9' }
  };

  function pickVariant() {
    var qs = new URLSearchParams(window.location.search);
    var forced = qs.get('cta_variant');
    if (forced && variants[forced]) {
      localStorage.setItem(STORAGE_KEY, forced);
      return forced;
    }
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && variants[saved]) return saved;
    var names = Object.keys(variants);
    var chosen = names[Math.floor(Math.random() * names.length)];
    localStorage.setItem(STORAGE_KEY, chosen);
    return chosen;
  }

  function capture(event, props) {
    props = Object.assign({
      experiment: EXPERIMENT,
      variant: window.__luminaVariant,
      path: window.location.pathname,
      referrer: document.referrer || null
    }, props || {});
    if (window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture(event, props);
    }
  }

  function initPostHog() {
    if (!POSTHOG_KEY || POSTHOG_KEY.indexOf('phc_') !== 0) return;
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split('.');2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement('script')).type='text/javascript';p.crossOrigin='anonymous';p.async=!0;p.src=s.api_host.replace('.i.posthog.com','-assets.i.posthog.com')+'/static/array.js';(r=t.getElementsByTagName('script')[0]).parentNode.insertBefore(p,r);var u=e;void 0!==a?u=e[a]=[]:a='posthog';u.people=u.people||[];u.toString=function(t){var e='posthog';return'posthog'!==a&&(e+='.'+a),t||(e+=' (stub)'),e};u.people.toString=function(){return u.toString(1)+'.people (stub)'};o='init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags on onFeatureFlags identify reset get_distinct_id get_session_id set_config get_property getSessionProperty'.split(' ');for(n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    window.posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      defaults: '2026-05-30',
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true,
      persistence: 'localStorage+cookie'
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var variant = pickVariant();
    window.__luminaVariant = variant;
    var colors = variants[variant];
    var root = document.documentElement;
    root.style.setProperty('--cta-bg', colors.bg);
    root.style.setProperty('--cta-fg', colors.fg);
    root.style.setProperty('--cta-border', colors.border);
    root.style.setProperty('--cta-hover', colors.hover);
    root.setAttribute('data-cta-variant', variant);

    var cta = document.querySelector('[data-primary-cta]');
    if (cta) {
      cta.href = 'https://t.me/luminahermesagentbot?start=' + START_PREFIX + variant + '_v1';
      cta.addEventListener('click', function () {
        capture('lumina_cta_click', { destination: 'telegram', start_param: START_PREFIX + variant + '_v1' });
      });
    }

    initPostHog();
    capture('lumina_variant_seen', { start_param: START_PREFIX + variant + '_v1' });
    capture('lumina_landing_view', { title: document.title });
  });
})();
