# Icons to React SVG / Font-family / Experimental pseudo-element

## Important
### 1) Do not use unicode bigger than 1000 (it is not working)!
### 2) Use underscores in the icon file name!

## Installation:
`yarn`

## Adding new icons:
1) Add icon into `icon` folder

2) *Optional*: You can add icon number into `scripts/icons.json` file. 

	`{[icon_file_name], [unicode (it need to be uniq)]`.

	It will produce an icon with this unicode. If you will miss this step script will generate code for you.
	Everything you'll find in `scripts/icons.json` file.

3) Run `yarn build`

	It will produce icon components (`lib` folder) + experimental pseudo-elements with SVGs (`lib/styles.css`) + font-family (`dist` folder) + cleared icons in `.icons` 

PS. For a preview, you can check `dist/icons.html` in the browser.
 
## Base usage:
### 1) SVG as component:
`import { Add } from 'icons-to-react-svg';`
````
return (
	<Add
		color={STRING}
		size={NUMBER || STRING}
		{other props}
	/>
)
````

### 2) Font-family:
1) you need to set new icon in you icon file
2) you're able to use this icon by unicode, ie:
`@include icon(directions, '\e993');`

this mixin will create an icon in css `.icon-directions` and scss placeholder `%icon-directions`

### 3) Experimental SVG icons insider :before / :after - for now, it is OFF:
1) you need to import styles `lib/styles.css` into you repo
2) Icons are working with double dash as prefix ie:
- `.icon--add` - it is using `:before` pseudo-element
- `.icon--add-after` - it is using `:after` pseudo-element

## How `yarn build` works:
1) Remove files (files inside `src` and `.icons`)
2) Copy `icon` folder into folder `.icons`
3) Clean all `.icons` using `svgo` (it is removing useless SVG tags)
4) Generate react component with SVG in folder `src`
5) Generate experimental styles for using SVG inside pseudo-elements (`src/styles.css`)  
6) Generate font-family inside `dist` folder
7) Copy files from `src` into `lib` 
8) Remove temporary files inside `src`

## Components
