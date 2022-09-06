/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {
  setLibs,
  unwrapSingularFragments,
  decorateButtons,
  turnH6intoDetailM,
  customSpacings,
  externalLinks,
  gnavUnderline,
} from './utils.js';

const LIBS = 'https://milo.adobe.com/libs';
const STYLES = '/pages/styles/styles.css';
const CONFIG = {
  // imsClientId: 'college',
  contentRoot: '/pages',
  codeRoot: '/pages',
  locales: {
    '': { ietf: 'en-US', tk: 'hah7vzn.css' },
    de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
    cn: { ietf: 'zh-CN', tk: 'puu3xkp' },
  },
};

(async function loadLCPImage() {
  const lcpImg = document.querySelector('img');
  lcpImg?.setAttribute('loading', 'eager');
}());

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

const miloLibs = setLibs(LIBS);

(function loadStyles() {
  const paths = [`${miloLibs}/styles/styles.css`];
  if (STYLES) { paths.push(STYLES); }
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  });
}());

const { loadArea,  loadDelayed,  setConfig } = await import(`${miloLibs}/utils/utils.js`);

(async function loadPage() {
  setConfig({ ...CONFIG, miloLibs });
  document.body.style.visibility = 'hidden';
  decorateButtons();
  turnH6intoDetailM();
  await loadArea();
  unwrapSingularFragments();
  externalLinks();
  customSpacings();
  gnavUnderline();
  document.body.style.removeProperty("visibility");
  const { default: loadModals } = await import(`${miloLibs}/blocks/modals/modals.js`);
  loadModals();
  loadDelayed();
}());

export function getLocale(url) {
  const locale = url.pathname.split('/')[1];
  if (/^[a-z]{2}$/.test(locale)) {
    return locale;
  }
  return 'us';
}

export function toClassName(name) {
  return name && typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}

export async function fetchPlaceholders() {
  if (!window.placeholders) {
    try {
      const locale = getLocale(window.location);
      const urlPrefix = locale === 'us' ? '' : `/${locale}`;
      const resp = await fetch(`${urlPrefix}/express/placeholders.json`);
      const json = await resp.json();
      window.placeholders = {};
      json.data.forEach((placeholder) => {
        window.placeholders[toClassName(placeholder.Key)] = placeholder.Text;
      });
    } catch {
      const resp = await fetch('/pages/artisthub/placeholders.json');
      const json = await resp.json();
      window.placeholders = {};
      json.data.forEach((placeholder) => {
        window.placeholders[toClassName(placeholder.Key)] = placeholder.Text;
      });
    }
  }
  return window.placeholders;
}
