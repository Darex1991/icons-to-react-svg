const fs = require('fs');
const glob = require('glob');
const path = require('path');
const upperCamelCase = require('uppercamelcase');

const {
  addComponentsToReadme,
  cleanBaseName,
  cleanFileName,
  cleanSvg,
  formatFile,
  outputFileFormat,
  readme,
  regexForRemovingBreakLines,
  renderReactElement,
  renderStyleElement,
  rootDir,
  signale,
  titleToFilename,
} = require('./utils');

const dir = path.join(rootDir, 'src/');

const pathIndexExport = path.join(rootDir, 'src', 'index.js');
const pathIndexExportTypeScript = path.join(rootDir, 'src', 'index.d.ts');
const styleFileLocation = path.join(rootDir, 'src', `styles.css`);

const basicReadme = path.join(rootDir, 'BASIC_README.md');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const initialTypeDefinitions = `
import { ComponentType, SVGAttributes } from 'react';

interface Props extends SVGAttributes<SVGElement> {
  color?: string;
  size?: string | number;
}

type Icon = ComponentType<Props>;

`;

fs.writeFileSync(styleFileLocation, '', formatFile);
fs.writeFileSync(pathIndexExport, '', formatFile);
fs.writeFileSync(pathIndexExportTypeScript, initialTypeDefinitions, formatFile);
fs.writeFileSync(readme, '', formatFile);

const data = fs.readFileSync(basicReadme);
fs.appendFileSync(readme, data);

glob(`./.icons/*.svg`, function(er, files) {
  files.forEach(file => {
    const fileName = cleanFileName(file);
    const baseName = cleanBaseName(file);
    const styleClassName = baseName.replace(new RegExp('_', 'g'), '-');

    const contents = fs.readFileSync(file, 'utf8');

    if (contents) {
      const svgWithoutUselessTags = cleanSvg(contents);
      const svgForStyles = svgWithoutUselessTags.replace(
        regexForRemovingBreakLines, '');

      const componentName = baseName === 'React' ? 'ReactJs' : upperCamelCase(
        titleToFilename(baseName));

      const location = path.join(rootDir, 'src', `${componentName}.js`);

      const element = renderReactElement(componentName, contents);
      const styleFile = renderStyleElement(styleClassName, svgForStyles);
      const component = outputFileFormat(element);

      fs.writeFileSync(location, component, formatFile);

      signale.success(`${componentName}`);

      const exportFileNameComponent = `// ${fileName}\r\n`;
      const exportComponent = outputFileFormat(
        `export { default as ${componentName} } from './${componentName}';\r\n`);
      const exportComponentTypeScript = `export const ${componentName}: Icon;\n`;

      signale.pending(
        `export { default as ${componentName} } from './${componentName}';\r\n`);

      fs.appendFileSync(styleFileLocation, styleFile, formatFile);
      fs.appendFileSync(pathIndexExport, exportFileNameComponent, formatFile);
      fs.appendFileSync(pathIndexExport, exportComponent, formatFile);
      fs.appendFileSync(pathIndexExportTypeScript, exportComponentTypeScript,
        formatFile);

      addComponentsToReadme(componentName, file, styleClassName);
    }
  });
}, {});

signale.complete(`Ready components`);
