//import { createApp, reactive } from 'https://unpkg.com/petite-vue@0.2.2/dist/petite-vue.es.js'
//import { vDraggable } from 'https://cdn.jsdelivr.net/npm/@neodrag/vue@2.2.0/+esm';

import { default as Alpine } from 'https://cdn.jsdelivr.net/npm/alpinejs@3.14.7/+esm';

window.Alpine = Alpine;

document.addEventListener('alpine:init', init);

function init () {
	console.log('x');
}

function Editor () {
	return {
		pages: [],
		count: 2,

		init () {
			console.log('Editor mounted!');

			// make first page
			const newPage = Page({
				id: 1
			});
			newPage.addElement('I am new');
			this.pages.push(newPage);
		},
		addPage (id) {
			console.log('add Page!', id);
			const newPage = Page({
				id: id
			});
			this.pages.push(newPage);
		}
	}
}
Alpine.data('editor', Editor);

function Page (props) {
	return {
		id: null,
		order: null,
		count: 0,
		elements: [],

		init (props) {
			console.log('Page mounted!', props);
		},
		addElement () {
			console.log('add Element!');

			// make element
			const newElement = Element({
				// text: 'abc123'
			});
			this.elements.push(newElement);
		},
		deletePage (ele, index, $data) {
			console.log('delete Page!', index, ele);

			console.log('info', $data.pages);
			// console.log('page id', this.pages[index].id);
			$data.pages.splice(index, 1);
		},
		destroy () {
			// call upon removal
			console.log('removed page');
		}
	}
}
Alpine.data('page', Page);

function Element (props) {
	return {
		id: null,
		position: {
			x: 0,
			y: 0
		},
		text: props?.text || "I'm a new element",

		init () {
			const id = Alpine.store('global').uniqueString(4);
			this.id = id;
			console.log('Element mounted!', this.id);
		}
	}
}
Alpine.data('element', Element);

Alpine.store('global', {
	pageIDs: 1,
	ui: [],
	documents: [],
	currentDocument: null,

	uniqueString(numBytes) {
		const bytes = crypto.getRandomValues(new Uint8Array(numBytes));
		const array = Array.from(bytes);
		const hexPairs = array.map(b => b.toString(16).padStart(2, '0'));
		return hexPairs.join('');
	}
});

const panels = [];

const tabs = [
	{ title: 'x', content: '1', open: true },
	{ title: 'y', content: '2', open: false },
];
/*
const store = reactive({
	count: 0,
	ui: [],
	documents: [],
	currentDocument: null,
	inc() {
		this.count++
	}
});

// manipulate it here
store.inc();

// element component
function Element (props) {
	return {
		id: null,
		position: {
			x: 0,
			y: 0
		},
		text: "I'm a new element",
		mounted() {
			console.log('Element Object mounted!', props);
		}
	}
}

// page component
function Page (props) {
	return {
		id: null,
		order: null,
		count: props.initialCount,
		elements: [1,2,3],
		delete() {
			console.log('PageObject delete method');
		},
		mounted() {
			console.log('Page mounted!', props);
		},
		addElement(page) {
			console.log('Element added', page);
		}
	}
}

const x = createApp({
	Page
});
x.id = 1;
x.order = 1;

createApp({
	// exposed to all expressions
	pages: [x],
	count: 2,
	// getters
	get plusOne() {
		return store.count;
	},
	mounted() {
		console.log('Editor mounted!');
	},
	// methods
	increment() {
		// store.count += 1;
		// store.inc();
		// this.count += 1;

		const newPage = createApp({
			Page
		});
		newPage.id = this.count++;
		this.pages.push(newPage);
		console.log(this.pages);
	},
	del(index) {
		console.log('deleted page', index+1);
		console.log('page id', this.pages[index].id);
		this.pages.splice(index, 1);
		//const target_copy = Object.assign({}, props);
		//console.log('delete 2', target_copy.id);
	},
	addElement(page) {
		console.log('Element added', page.id);
		const newEle = createApp({
			Element
		});
		newEle.text = "abc123";
		console.log(page);
		page.elements.push(newEle);
	}
}).mount('.editor');
*/

Alpine.start();
