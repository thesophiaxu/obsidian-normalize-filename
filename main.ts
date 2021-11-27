import { Plugin } from 'obsidian';

const notCapitalize = [
	// Articles
	'a', 'an', 'the', 
	// Coordinate conjunctions
	'for', 'and', 'not', 'but', 'yet', 'so',
	// Prepositions
	'at', 'around', 'by', 'after', 'along', 'for', 'from', 'of', 'on', 'to', 'with', 'without'
]

const transformTitle = (title: string) => {
	const words = title.split('_');
	const finalWords = words.map(el => notCapitalize.includes(el) ? el : el[0].toUpperCase()+el.substring(1));
	return finalWords.join(' ');
}

export default class MyPlugin extends Plugin {
	observer: MutationObserver;

	async onload() {

		const updateTitles = () => {
			const titles = [
				...Array.from(document.getElementsByClassName('nav-file-title-content')),
				...Array.from(document.getElementsByClassName('nav-folder-title-content'))
			];
			
			let el;
			for (let i=0; i<titles.length; ++i) {
				el = titles[i];
				if (el.getText().length > 0) {
					const newTitle = transformTitle(el.getText());
					el.setText(newTitle);
				}
			}
		};

		this.observer = new MutationObserver(updateTitles);

		setTimeout(() => {
			this.observer.observe(document.getElementsByClassName('nav-files-container')[0], {
				childList: true,
				subtree: true,
				characterData: true
			});

			updateTitles();
		}, 100);

	}

	onunload() {
		this.observer.disconnect();
	}
}