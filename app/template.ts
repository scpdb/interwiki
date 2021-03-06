'use strict';

import { sites, titlesByLang } from './config';

export type Layout = 'standard' | 'two-column';

export interface Styles {
  linkColor: string;
  titleColor: string;
  borderColor: string;
  bgColor: string;
  hideBorder: boolean;
  layout: Layout;
}

function generateWikiLink(wikiName: string, pageName: string) {
  const url = `${sites[wikiName].url}/${pageName}`;
  const language = sites[wikiName].title;
  return `<div class="interwiki__entry"><a href="${url}">${language}</a></div>`;
}


export default function render(list: string[], lang: string, pageName: string, styles: Styles) {
  if (!list.length) {
    return '';
  }

  const sortedList = list.sort((a, b) => (sites[a].name > sites[b].name ? 1 : -1));

  const bgColor = styles.bgColor ? `#${styles.bgColor}` : '#fff';
  const titleColor = styles.titleColor ? `#${styles.titleColor}` : '#600';
  const borderColor = styles.borderColor ? `#${styles.borderColor}` : '#600';
  const linkColor = styles.linkColor ? `#${styles.linkColor}` : '#b01';

  function getBorderStyles(hideBorder: boolean) {
    if (hideBorder) {
      return '';
    }
    return `
          padding: 10px;
          border: 1px solid ${borderColor};
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(102,0,0,.5);
    `.trim();
  }

  function getEntriesStyles(layout: Layout) {
    if (layout === 'two-column') {
      return `
        display: grid;
        grid-template-columns: 47% 40%;
        font-size: 0.95em;
        margin-top: 7px;
      `.trim();
    }
    return '';
  }

  return `

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>SCPNET Interwiki</title>
    <base target="_parent" />
    <style>
    body {
        margin: 0;
        padding: 5px;
        font-size: 0.80em;
    }
    /* width: 217px; */
    .interwiki {
        font-family: Verdana, Arial, Helvetica, sans-serif;
        background: ${bgColor};
        margin: 0;
        ${getBorderStyles(styles.hideBorder)}
        box-sizing: border-box;
        width: 16.25em;
    }
    .interwiki__title {
        color: ${titleColor};
        border-bottom: solid 1px ${titleColor};
        padding-left: 15px;
        margin-top: 10px;
        margin-bottom: 5px;
        font-size: 8pt;
        font-weight: bold;
    }
    .interwiki__entries {
      ${getEntriesStyles(styles.layout)}
    }
    .interwiki__entry {
        position: relative;
        margin: 2px 0;
    }
    .interwiki__entry:before {
        content: "■";
        font-size: 7px;
        color: ${linkColor};
        position: relative;
        margin: 0 7px 0 5px;
        bottom: 3px;
    }
    .interwiki__entry a, .interwiki__entry a:visited {
        font-weight: bold;
        color: ${linkColor};
        text-decoration: none;
        background: transparent;
    }
    .interwiki__entry a:hover {
        text-decoration: underline;
    }
    @media (min-width: 14.375em) {
        .interwiki {
            width: 17em;
        }
    }
    </style>
</head>
<body>
    <div class="interwiki">
        <div class="interwiki__title">${titlesByLang[lang] || 'Unknown language'}</div>
        ${styles.layout === 'two-column' ? '<div class="interwiki__entries">' : ''}
          ${sortedList.map(wikiName => generateWikiLink(wikiName, pageName)).join('\n')}
        ${styles.layout === 'two-column' ? '</div>' : ''}
    </div>
    <!-- SCP Foundation Russia Networks -->
</body>
</html>

    `.trim();
}
