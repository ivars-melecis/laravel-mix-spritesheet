const mix = require('laravel-mix');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const path = require('path');
const fs = require('fs-extra');
const theme = './public';

const monoIconProps = {
    output: {
      filename: `mono-icon-sprite.svg`,
      svg: {
        sizes: false,
        attributes: {}
      }
    },
    styles: {
      filename: `${theme}/build/css/mono-icons.css`,
      format: 'fragment',
      callback: content => {
        const lines = content.split(/\r?\n/);
        const icons = lines.map(line => line.split('{')[0].trim().replace('.',''));
        const path = `url(/public/build/mono-icon-sprite.svg`;
        let result = `*[class^="svg-"]{ width:2rem; height:2rem; display:block; background-position: center center; background-repeat: no-repeat; background-size:contain; mask-repeat: no-repeat; -webkit-mask-repeat:no-repeat; }`;
        icons.forEach(icon => {result +=`.${icon} {mask-image:${path}#svg-${icon}-mono);-webkit-mask-image: ${path}#${icon}-mono);}`;
        });
        return result;
      }
    },
    input: {
      allowDuplicates: false
    },
    sprite: {
      prefix: 'svg-',
      prefixStylesSelectors: true,
      gutter: 0,
      idify: (filename) => filename.replace(/[\s]+/g, '-').split('-').map(line => line.toLowerCase()).join('-'),
      generate: {
        title: true,
        symbol: true,
        use: true,
        view: '-mono'
      }
    },
  };

  const colourIconProps = {
    output: {
      filename: `coloured-icon-sprite.svg`,
      svg: {
        sizes: false,
        attributes: {}
      }
    },
    styles: {
      filename: `${theme}/build/css/coloured-icons.css`,
      format: 'fragment',
      callback: (content) =>
        `${
              content
              .replace(new RegExp('/coloured-icon-sprite.svg', 'g'), `/public/build/coloured-icon-sprite.svg`)
          }`
    },
    input: {
      allowDuplicates: false
    },
    sprite: {
      prefix: 'svg-',
      prefixStylesSelectors: true,
      gutter: 0,
      idify: (filename) => filename.replace(/[\s]+/g, '-').split('-').map(line =>
        line.toLowerCase()).join('-'),
      generate: {
        title: true,
        symbol: true,
        use: true,
        view: '-coloured'
      }
    },
  };

  mix.webpackConfig({
    plugins: [
      new SVGSpritemapPlugin(`${theme}/icons/mono/*.svg`, monoIconProps),
      new SVGSpritemapPlugin(`${theme}/icons/coloured/*.svg`, colourIconProps)
    ],
  });

  mix
  .js(`${theme}/js/app.js`, `js/bundle.js`)
  .sass(`${theme}/styles/style.scss`, `css/bundle.css`)
  .options({
    processCssUrls: false,
  })
  .setPublicPath(`${theme}/build`);


  mix.combine([`${theme}/build/css/mono-icons.css`, `${theme}/build/css/coloured-icons.css`], `${theme}/build/css/icons.css`).then(() => {
    fs.remove(`${theme}/build/css/coloured-icons.css`);
    fs.remove(`${theme}/build/css/mono-icons.css`);
});