//import { createApp, reactive } from 'https://unpkg.com/petite-vue@0.2.2/dist/petite-vue.es.js'
//import { vDraggable } from 'https://cdn.jsdelivr.net/npm/@neodrag/vue@2.2.0/+esm';

import { default as Alpine } from 'alpine';
import sort from 'alpinesort'
import { Draggable } from 'neodrag';

window.Alpine = Alpine;
Alpine.plugin(sort);

document.addEventListener('alpine:init', init);

function init () {
	console.log('init');

	// todo: put this somewhere that makes sense!
	Alpine.store('global').cssRoot.style.setProperty('--page-width', '210mm');
	Alpine.store('global').cssRoot.style.setProperty('--page-height', '297mm');

	const toolbar = document.querySelector('.toolbar');

	const options = {
		threshold: { delay: 300 },
		bounds: document.documentElement, // body element
		disabled: false,
		handle: '.handle',
		onDragEnd: function (data) {
			localStorage.setItem('toolbarPosition', JSON.stringify({ x: data.offsetX, y: data.offsetY }));
		}
	};

	// restore UI toolbar position, if applicable
	const storedPosition = localStorage.getItem('toolbarPosition');
	if (storedPosition) {
		options.position = JSON.parse(storedPosition);
		console.log('restored position', options.position);
	}

	Alpine.store('global').ui.dragInstance = new Draggable(toolbar, options);
}

function Editor (props) {
	return {
		pages: [],
		pageCount: 1,

		init (x) {
			console.log('Editor mounted!', x, props);

			// todo: make first page
			//this.addPage('page-1');
			//this.activatePage(1);
			/*
			const newPage = Page({
				id: 1
			});
			newPage.addElement('I am new');
			this.pages.push(newPage);
			*/
			this.activatePage(1);
		},
		addPage (id) {
			console.log('add Page!', id);
			/*
			const newPage = Page({
				id: id,
				dimensions: {
					width: 210,
					height: 297
				}
			});
			this.pages.push(newPage); // todo: insert after currentPage!
			*/
			this.pageCount += 1;
			console.log(this.pages);
		},
		deletePage (id) {
			if (this.pages.length <= 1) {
				window.alert('You cannot remove the last page!');
				return;
			}

			if (window.confirm('Delete page ' + id + '?')) {
				const p = document.querySelector('.page[data-order="'+id+'"]');
				const pageID = p.getAttribute('data-page');

				for (var i = 0; i < this.pages.length; i++) {
					console.log(i, this.pages[i]);
					if (this.pages[i].id == pageID) {
						console.log('removed page reference');
						this.pages.splice(i, 1);
					}
				}

				p.remove();
				// this.pageCount -= 1;
				// this.activatePage(Math.max(1, this.pages.length));
			}
		},
		activatePage (id) {
			Alpine.store('global').currentPage = id;
			console.log('activated page', Alpine.store('global').currentPage);
		},
		doPageSort (event) {

			const self = this;

			/*
			document.querySelectorAll('.pages-navigator > div').forEach(function (ele, i) {
				console.log(i, ele.id, ele.dataset.page);
				const page = self.pages.find(function (element) {
					console.log('x', element);
					return element.id == ele.id;
				});
				console.log('found', self.pages);
			});
			*/

			for (const [i, ele] of document.querySelectorAll('.pages-navigator > div').entries()) {
				// console.log(i, ele.id, ele.dataset.page);
				const page = self.pages.find(function (element) {
					return element.id == ele.dataset.page;
				});
				page.order = i+1;
				console.log('found', page.id);
			}

			return;

			const { item, position } = event.detail;
			console.log('notify page sort', item, position);

			// todo: sort the actual pages
			const pages = document.querySelectorAll('.doc .page');
			const pagesOrdered = Array.from(pages).sort(function(a, b) {
				const orderA = parseInt(window.getComputedStyle(a).getPropertyValue('order'));
				const orderB = parseInt(window.getComputedStyle(b).getPropertyValue('order'));
				console.log('sort', orderA, orderB);
				return orderA - orderB;
			});
			console.log(pagesOrdered);
			for (const p of pagesOrdered) {
				const data = Alpine.evaluate(p, '$data');
				// console.log('page at position', index, 'gets new position', data.order);
				let newPosition;
				if (data.order < item) {
					newPosition = data.order-1;
					console.log('lower page', newPosition);
					// p.setOrder(position + 1);
					// console.log('set order to', p.order);

				} else if (data.order == item) {
					newPosition = position+1;
					console.log('found page to sort', newPosition);
					// p.setOrder(position + 1);
					// console.log('set order to', p.order);

				} else {
					newPosition = data.order;
					console.log('higher page', newPosition);
				}

				p.dispatchEvent(new CustomEvent('orderchange', {
					detail: {
						position: newPosition
					},
					bubbles: false
				}));
			}


		},
		storeDocument () {

		},
		scrollTo (pageID) {
			if (!pageID) return;
			// console.log('p', pageID, this.pages[pageID-1].$el);
			const pages = document.querySelectorAll('.doc .page');
			const pageEle = pages[pageID-1];
			pageEle.scrollIntoView({ behavior: 'smooth', block: "start" });
		}
	}
}
Alpine.data('editor', (props) => Editor(props));

function Page (props) {
	return {
		id: null,
		order: props.order || null,
		count: 0,
		elements: [],
		dimensions: {
			width: 0,
			height: 0
		},

		init () {
			this.id = Alpine.store('global').uniqueString(4);

			console.log('Page mounted! order:', this.order );
			this.$data.pages.push(this);

			// console.log('editor data', Alpine.evaluate(document.querySelector('.editor'), '$data'));
			console.log(this.$data.pages);
		},
		addElement () {
			console.log('add Element!');
			// console.log($refs);

			// make element
			const newElement = Element({
				// text: 'abc123'
			});
			this.elements.push(newElement);
		},
		setOrder (event) {
			console.log('reorder page', this.id, event.detail.position);
			this.order = event.detail.position;
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
Alpine.data('page', (props) => Page(props));

function PagesNavigator () {
	return {

		init () {
			console.log('init navigator');
		},
		sortEnd (item, pos, $dispatch) {
			// todo: reorder page numbers
			$dispatch('sortpage', {
				item: item,
				position: pos
			});

			/*
			window.addEventListener('sortpage', function (event) {
				console.log('event', event.detail);
			});

			window.dispatchEvent(new CustomEvent('sortpage', {
				detail: {
					message: 'Hello World!',
					item: item,
					position: pos
				},
				bubbles: true
			}));
			*/
		}
	}
}
Alpine.data('pagesNavigator', PagesNavigator);

function Element (props) {
	return {
		id: null,
		parentPage: null,
		position: {
			x: 0,
			y: 0
		},
		text: props?.text || "I'm a new element",

		/*
		// todo: getter and setter for mm values?
		set price_USD (val) {
			this.price_INR = val * 83;
		},

		get price_USD () {
			return this.price_INR / 83;
		}
		*/

		init () {
			const id = Alpine.store('global').uniqueString(4);
			this.id = id;
			console.log('Element mounted!', this.$el, this.$refs.editor, this.id);

			const options = {
				// grid: [10, 10],
				grid: [18.9, 18.9], // magic number: 5mm
				threshold: { delay: 300 },
				// bounds: 'parent',
				disabled: false,
				handle: '.handle',
				// onDragStart: (data) => console.log('Dragging started', data),
				onDrag: function (data) {
					// console.log('Dragging', data.offsetX, data.offsetY, data.rootNode);
					const frame = data.rootNode;
					const frameRect = frame.getBoundingClientRect();
					const elmTop = frameRect.top + window.scrollY;
					const elmLeft = frameRect.left + window.scrollX;

					const page = data.rootNode.closest('.page');
					const pageRect = page.getBoundingClientRect();
					const pageTop = pageRect.top + window.scrollY;
					const pageLeft = pageRect.left + window.scrollX;

					Alpine.store('global').currentFrame.position.x = Math.abs(pageLeft-elmLeft);
					Alpine.store('global').currentFrame.position.y = Math.abs(pageTop-elmTop);

					// console.log('drag', Alpine.store('global').currentFrame.position);
					/*
					this.position.x = pageLeft-elmLeft;
					this.position.y = pageTop-elmTop;

					console.log(this.position);
					*/
				},
				onDragEnd: function (data) {
					console.log('Dragging stopped', data);
					Alpine.store('global').currentFrame = null;
				}
			};

			const dragInstance = new Draggable(this.$el, options);
		},
		activate (ele) {
			Alpine.store('global').currentFrame = ele;
			console.log('activate', ele);
		},
		getXmm () {
			return Alpine.store('global').pxmm(this.position.x).toFixed(2);
		},
		getYmm () {
			return Alpine.store('global').pxmm(this.position.y).toFixed(2);
		}
	}
}
Alpine.data('element', (props) => Element(props));

Alpine.store('global', {
	screenDPI: 96, // todo: magic
	pageIDs: 1,
	ui: {
		dragInstance: null
	},
	documents: [],
	currentDocument: null,
	currentFrame: null,
	currentPage: null,
	cssRoot: document.querySelector(':root'),

	uniqueString (numBytes) {
		const bytes = crypto.getRandomValues(new Uint8Array(numBytes));
		const array = Array.from(bytes);
		const hexPairs = array.map(b => b.toString(16).padStart(2, '0'));
		return hexPairs.join('');
	},
	pxmm (px) {
		return (px * 25.4) / this.screenDPI;
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
