import { createApp, reactive } from 'https://unpkg.com/petite-vue@0.2.2/dist/petite-vue.es.js'
import { vDraggable } from 'https://cdn.jsdelivr.net/npm/@neodrag/vue@2.2.0/+esm';

const panels = [];

const tabs = [
	{ title: 'x', content: '1', open: true },
	{ title: 'y', content: '2', open: false },
];

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
