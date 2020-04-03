const format = require('prettier-eslint');
const fs = require('fs');
const path = require('path');
const { Signale } = require('signale');

const options = {
  types: {
    error: {
      badge: '!!',
      label: 'fatal error',
    },
    success: {
      badge: '✨',
      label: 'Component written successfully:',
    },
  },
};

const formatFile = 'utf-8';
const rootDir = path.join(__dirname, '..');
const readme = path.join(rootDir, 'README.md');
const iconsUnicodePath = path.join(rootDir, 'scripts', 'icons.json');

const iconsUnicode = fs.readFileSync(iconsUnicodePath);

const regexForRemovingBreakLines= /(\r\n|\n|\r)/gm;
const regexForRemovingStyles= /<style\b[^<>]*>[\s\S]*?<\/style\s*>/gi;
const regexForStyleNotSupported= /style=".*?"/s;
const regexForXlinkNotSupported= /xlink=href/sg;
const regexForXmlLinkNotSupported= /xmlns=xlink=".*?"/s;
const regexForXmlSpaceNotSupported= /xml=space=".*?"/s;
const regexIconName= /\w+.svg$/g;
const regexSvg= /svg/;
const regexWithUselessInformation= /\<\?xml.+\?\>|\<!--.Generator.+-->/g;

const attrsToString = attrs => Object.keys(attrs)
  .map(key => {
    if (key === 'width' || key === 'height' || key === 'fill') {
      return key + '={' + attrs[key] + '}';
    }
    if (key === 'others') {
      return '{...others}';
    }
    return key + '="' + attrs[key] + '"';
  })
  .join(' ');

const cleanFileName =  (filePath) => filePath.replace(new RegExp(' ', 'g'), '_').replace(new RegExp('-', 'g'), '_');

const cleanBaseName = (filePath) => {
  const fileName = cleanFileName(filePath);
  const matchFileName = fileName.match(regexIconName);
  return matchFileName ? matchFileName[0].replace('.svg','') : fileName;
};

module.exports = {
  formatFile,
  readme,
  regexForRemovingBreakLines,
  rootDir,
  signale: new Signale(options),
  /**
   * Converts a brand title into a filename (not a full path)
   * @param {String} title The title to convert
   */
  titleToFilename: title =>
    title
      .toLowerCase()
      .replace(/'/g, '')
      .replace(/\+/g, 'plus')
      .replace(/^\./, 'dot-')
      .replace(/\.$/, '-dot')
      .replace(/\./g, '-dot-')
      .replace(/^&/, 'and-')
      .replace(/&$/, '-and')
      .replace(/&/g, '-and-')
      .replace(/[ !’]/g, '')
      .replace(/à|á|â|ã|ä/, 'a')
      .replace(/ç/, 'c')
      .replace(/è|é|ê|ë/, 'e')
      .replace(/ì|í|î|ï/, 'i')
      .replace(/ñ/, 'n')
      .replace(/ò|ó|ô|õ|ö/, 'o')
      .replace(/ù|ú|û|ü/, 'u')
      .replace(/ý|ÿ/, 'y')
      .replace(/500px/, 'five-hundred-px')
      .replace(/1password/, 'onePassword')
      .replace(/1001tracklists/, 'OneThousandOneTracklists')
      .replace(/micro:bit/, 'MicroBit'),

  outputFileFormat: element =>
    format({
      text: element,
      eslintConfig: {
        extends: ['plugin:prettier/recommended', 'eslint:recommended', 'plugin:react/recommended'],
      },
      prettierOptions: {
        arrowParens: 'avoid',
        singleQuote: true,
        jsxBracketSameLine: true,
        trailingComma: 'es5',
        printWidth: 120,
        semi: true,
        endOfLine: 'lf',
      },
    }),

  renderReactElement: (componentName, contents) => {
    const defaultAttrs = {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 'size',
      height: 'size',
      fill: 'color',
      others: '...others',
    };

    const svgWithoutUselessTags = module.exports.cleanSvg(contents);
    const svgWithoutNotWorkingTags = svgWithoutUselessTags.replace(regexForStyleNotSupported, '');
    const svgWithExtraProps = svgWithoutNotWorkingTags.replace(regexSvg, `svg ${attrsToString(defaultAttrs)}`);

    return `
        import React from 'react';
        import PropTypes from 'prop-types';

        const ${componentName} = (props) => {
          const { color, size, ...others } = props;
          return (
            ${svgWithExtraProps}
          )
        };

        ${componentName}.propTypes = {
          /**
          * Hex color or color name
          */
          color: PropTypes.string,
          /**
          * The size of the Icon.
          */
          size: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
          ]),
        }

        ${componentName}.defaultProps = {
          color: 'currentColor',
          size: '24',
        }
        export default ${componentName}
      `;
  },

  renderStyleElement: (styleClassName, svgForStyles) => {
    return `.icon--${styleClassName}:before,.icon--${styleClassName}-after:after{
        width: 24px;
        height: 24px;
        display: inline-block;
        content: '';
        -webkit-mask: url('data:image/svg+xml;charset=UTF-8,${svgForStyles}') no-repeat 50% 50%;
        mask: url('data:image/svg+xml;charset=UTF-8,${svgForStyles}') no-repeat 50% 50%;
        -webkit-mask-size: cover;
        mask-size: cover;
      }`
  },

  cleanFileName,

  cleanBaseName,

  cleanSvg: (contents) => {
    const svgContent = contents.replace(regexWithUselessInformation, '');
    const svgWithoutStyles = svgContent.replace(regexForRemovingStyles, '');
    return svgWithoutStyles.replace(regexForXlinkNotSupported, 'link').replace(regexForXmlLinkNotSupported,'').replace(regexForXmlSpaceNotSupported, '');
  },

  addComponentsToReadme: (componentName, file, styleClassName) => {
    const baseName = cleanBaseName(file);
    const fileName = cleanFileName(file);
    const matchFileName = fileName.match(regexIconName);
    const unicode = JSON.parse(iconsUnicode)[baseName];
    const code = unicode ? unicode.replace('0x','') : '???';

    const readmeContent = `1) \`import { ${componentName} } from 'icons-to-react-svg';\`\r\n`+
      `2) unicode: \`${code}\`\r\n`+
      `3) \`.icon--${styleClassName}:before\`, \`.icon--${styleClassName}-after:after\`\r\n`;
    const readmeIconImage = `<img src="${file}" alt="${componentName}" height="16"/>\r\n`;
    const readmeIconTitle = `\r\n### ${matchFileName} ${readmeIconImage}\r\n`;

    fs.appendFileSync(readme, readmeIconTitle, formatFile);
    fs.appendFileSync(readme, readmeContent, formatFile);
  }
};
