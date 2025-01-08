//import { createApp, reactive } from 'https://unpkg.com/petite-vue@0.2.2/dist/petite-vue.es.js'
//import { vDraggable } from 'https://cdn.jsdelivr.net/npm/@neodrag/vue@2.2.0/+esm';

import { default as Alpine } from 'alpine';
import sort from 'alpinesort';
import { default as localForage } from 'localforage';
import { Draggable } from 'neodrag';

window.Alpine = Alpine;
Alpine.plugin(sort);

document.addEventListener('alpine:init', init);

function init () {
	console.log('init', localForage);

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

// https://github.com/alpinejs/alpine/issues/270
class Editor2 {
	$component = null;
	pages = [];

	get activePage () {
		const index = this.findPageIndex('active', true);
		return (index > -1) ? this.pages[index] : null;
	}

	constructor (options) {
		this.$component = this;

		console.log('Editor mounted!', options, this.$component);

		// todo: make first page
		const pageID = this.addPage();
		this.activatePage(pageID);
	}

	init () {
		Alpine.store('global').editor = this;
	}

	findPageIndex (prop, val) {
		const pageIndex = this.pages.findIndex(function (page) {
			return page[prop] === val;
		});
		return pageIndex;
	}

	findPage (prop, val) {
		const pageIndex = this.pages.findIndex(function (page) {
			return page[prop] === val;
		});
		return this.pages[pageIndex] || null;
	}

	addPage (index) {
		console.log('add Page!', index);

		const newPage = new Page2({
			parent: this,
			width: 210,
			height: 297,
			order: index || this.pages.length + 1
		});
		this.pages.push(newPage); // todo: insert after currentPage!

		if (index) {
			this.doPageSort();
		}

		console.log(this.pages);
		return newPage.id;
	}

	deletePage (pageID) {
		if (this.pages.length <= 1) {
			window.alert('You cannot remove the last page!');
			return;
		}

		// delete a specific page, or just the one currently active?
		let activePage;
		if (pageID) {
			activePage = this.findPage('id', pageID);
		} else {
			activePage = this.activePage;
		}

		if (!activePage) return;

		if (window.confirm('Delete page ' + activePage.order + '?')) {
			console.log('delete', activePage.id);
			activePage.deleted = true; // todo: for future undelete function?

			const index = this.findPageIndex('id', activePage.id);

			// activate a new page
			let newActivePage;
			if (activePage.order == 1) {
				newActivePage = this.findPage('order', activePage.order+1);
			} else {
				newActivePage = this.findPage('order', activePage.order-1);
			}

			this.activatePage(newActivePage.id);

			// actually remove the page to be deleted
			this.pages.splice(index, 1);

			// make page order nice again
			this.doPageSort();
		}
	}

	activatePage (id) {
		// loop all and only set one active
		for (const page of this.pages) {
			if (page.id == id) {
				page.active = true;
				continue;
			}
			page.active = false;
		}
		/*
		const index = this.findPageIndex('id', id);
		if (index > -1) {
			this.pages[index].active = true;
		}
		*/
	}

	doPageSort () {
		const self = this;
		let i = 0; // this becomes the new page order

		for (const ele of document.querySelectorAll('.pages-navigator > div')) {
			const page = self.findPage('id', ele.dataset.page);
			// console.log(i, ele.id, ele.dataset.page, page);
			i += 1;
			if (!page) {
				i -= 1;
				continue; // skip deleted pages!
			}
			page.order = i;
		}
	}

	storeDocument () {

	}

	scrollTo (pageID) {
		if (!pageID) return;
		// console.log('p', pageID, this.pages[pageID-1].$el);
		const pages = document.querySelectorAll('.doc .page');
		const pageEle = pages[pageID-1];
		pageEle.scrollIntoView({ behavior: 'smooth', block: "start" });
	}
}

Alpine.data('editor', (options) => (new Editor2(options)));

class Page2 {
	$component = null;
	parent = null;
	id = null;
	order = null;
	active = false;
	deleted = false;
	elements = [];
	dimensions = {
		width: 0,
		height: 0
	};

	constructor (options) {
		this.$component = this;
		this.parent = options.parent || null;
		this.id = Alpine.store('global').uniqueString(4);
		this.order = options.order || 0;
		this.dimensions.width = options.width || 0;
		this.dimensions.height = options.height || 0;
		// this.isOpen = !!options.isOpen;

		// console.log('init new Page class', this, this.$component);

		console.log('Page mounted! order:', this.id, this.order, this.$component.$refs);
		/*
		setTimeout(function (self) {
			console.log(self.parent.pages);
		}, 1000, this);
		*/
		// this.$data.pages.push(this);

		// console.log('editor data', Alpine.evaluate(document.querySelector('.editor'), '$data'));
		// console.log(this.$data.pages);

		/*
		 this.methodA(); //<- no worky
		this.$component.methodA(); //<- works
		*/

		/*
		const prototype = Object.getPrototypeOf(this);
		for (const prop of Object.getOwnPropertyNames(prototype)) {
			if (typeof prototype[prop] !== "function") continue;
			this[prop] = prototype[prop];
		}
		*/
	}

	findElementIndex (prop, val) {
		const elementIndex = this.elements.findIndex(function (ele) {
			return ele[prop] === val;
		});
		return elementIndex;
	}

	findElement (prop, val) {
		const elementIndex = this.findElementIndex(prop, val);
		return this.elements[elementIndex] || null;
	}

	addElement () {
		const newElement = new Element2({
			parent: this
		});
		// console.log(newElement.constructor.name);

		this.elements.push(newElement);

		console.log('add Element', newElement);

		return newElement.id;
	}

	addTable () {
		const newTable = new TableElement({
			parent: this
		});

		this.elements.push(newTable);

		console.log('add Table Element', newTable);

		return newTable.id;
	}
}

Alpine.data('page', (options) => (new Page2(options)));

class PagesNavigator2 {
	constructor (options) {
		console.log('init navigator');
	}

	sortEnd (item, pos, $dispatch) {

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

Alpine.data('pagesNavigator', (options) => (new PagesNavigator2(options)));

class Element2 {
	$component = null;
	$el = null;
	type = 'element';
	id = null;
	active = false;
	parent = null;
	dragInstance = null;
	text = '';
	x = 0;
	y = 0;
	get xmm () {
		return Alpine.store('global').pxmm(this.x).toFixed(2);
	};
	get ymm () {
		return Alpine.store('global').pxmm(this.y).toFixed(2);
	};

	constructor (options) {
		this.$component = this;
		this.parent = options.parent || null;
		this.id = Alpine.store('global').uniqueString(4);
		this.text = options?.text || "I'm a new element";
		this.type = 'textframe';

		console.log('Element mounted!', this, this.id);
	}

	init () {
		// runs with magics available
		console.log('elem init', this);

		const dragOptions = {
			// grid: [10, 10],
			grid: [18.9, 18.9], // magic number: 5mm
			threshold: { delay: 300 },
			// bounds: 'parent',
			disabled: false,
			handle: '.handle',
			// onDragStart: (data) => console.log('Dragging started', data),
			onDrag: function (data, x) {
				// console.log('Dragging', data.offsetX, data.offsetY, data.rootNode);
				const frameEle = data.rootNode;
				// const frame = Alpine.evaluate(frameEle, '$data');
				const frame = Alpine.store('global').xdataFromDOM(frameEle);
				const frameRect = frameEle.getBoundingClientRect();
				const elmTop = frameRect.top + window.scrollY;
				const elmLeft = frameRect.left + window.scrollX;

				const pageEle = data.rootNode.closest('.page');
				const page = Alpine.store('global').xdataFromDOM(pageEle);
				const pageRect = pageEle.getBoundingClientRect();
				const pageTop = pageRect.top + window.scrollY;
				const pageLeft = pageRect.left + window.scrollX;

				// todo: very wasteful, find page object
				const editor = Alpine.store('global').editor;
				// const page = editor.findPage('id', pageEle.dataset.page);
				// console.log(frame);

				// const frame = Alpine.evaluate(frameEle, '$data');

				/*
				Alpine.store('global').currentFrame.x = Math.abs(pageLeft-elmLeft);
				Alpine.store('global').currentFrame.y = Math.abs(pageTop-elmTop);
				*/

				frame.x = (pageLeft-elmLeft) * -1;
				frame.y = (pageTop-elmTop) * -1;

				// console.log(page.x, page.y);
			},
			onDragEnd: function (data) {
				console.log('Dragging stopped', data);
				Alpine.store('global').currentFrame = null;
			}
		};

		this.dragInstance = new Draggable(this.$el, dragOptions);
	}

	activate (ele) {
		Alpine.store('global').currentFrame = ele;
		console.log('activate', ele);
	}
}

Alpine.data('element', (options) => (new Element2(options)));

class TableElement extends Element2 {
	columns = [1, 1];
	rows = [1, 1];

	constructor (options) {
		super(options);

		this.type = 'table';

		console.log('construct table element');
	}

	init () {
		super.init();

		this.$el.style.setProperty('--cols', this.columns.length);
		this.$el.style.setProperty('--rows', this.rows.length);

		console.log('init table element');
	}
}

class TableCell {
	content = '';
	computedContent = '';

	constructor (options) {
		console.log('construct table cell');
	}

	init () {

		console.log('init table cell');
	}

	editCell (event) {
		// if (document.activeElement === this.$el) return false;
		// console.log((document.activeElement === this.$el));
		event.preventDefault();
		this.$el.focus();
		this.$el.innerText = this.content;
		// this.$el.setSelectionRange(-1, -1);
	}

	evaluateCell (event) {
		event.preventDefault();
		this.content = event.target.innerText.trim();

		if (this.content.startsWith('=')) {
			this.computedContent = 'formula';

			const formula = this.content.substring(1);
				// this.computedContent = eval(formula);
			const regexWrapFunctions = /([A-Z]+\()/g;
			let newFormula = formula.replaceAll(regexWrapFunctions, 'this.$1');

			const regexQuoteCellNames = /([A-Z][0-9]+)/g;
			newFormula = newFormula.replaceAll(regexQuoteCellNames, '"$1"');

			console.log(formula, newFormula);
			this.computedContent = Function(`'use strict'; return ${newFormula}`).bind(this)(); // return ${formula}
			console.log(this.computedContent);
return;
			// calculate related cells
			try {
				const formula = this.content.substring(1);
				// this.computedContent = eval(formula);
				this.computedContent = Function(`'use strict'; return ${formula}`).bind(this)();
				console.log(this.computedContent);
			} catch (error) {
				console.error('could not eval cell');
				this.computedContent = 'error in formula';
			}
		} else {
			this.computedContent = ''+this.content+'';
		}

		this.$el.innerText = this.computedContent;
		console.log('eval cell', this.content, this.computedContent);

		// todo: reevaluate all other formulas??
	}

	VAL (cellID) {
		const row = 1;
		const column = 1;
		// const selector = '> div.row:nth-of-type('+row+') > div.cell:nth-of-type('+column+')';
		// console.log(selector);

		const parentTable = this.$el.closest('.table');
		console.log(parentTable, this.$el);
		const rows = parentTable.querySelectorAll('.row');
		const cells = rows[row-1].querySelectorAll('.cell');
		const cell = cells[column-1];
		if (!cell) return false;
		return cell.querySelector('.cell-content').getAttribute('data-computed');
	}

	SUM (cellID1, cellID2) {
		return cellID1 + cellID2;
	}
}

Alpine.data('tablecell', (options) => (new TableCell(options)));

class DragTest {
	x = 0;
	y = 0;
	tempX = 0;
	tempY = 0;
	originalX = 0;
	originalY = 0;
	w = null;
	h = null;
	mouseOffsetX = 0;
	mouseOffsetY = 0;

	dragging = false;

	constructor (options) {
		console.log('init dragtest');
	}

	init () {
		const { width, height } = window.getComputedStyle(this.$el);
		// this.originalX =
	}

	dragStart (event) {
		this.dragging = true;
		event.dataTransfer.dropEffect = "move";
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setDragImage(this.$el, 10, 10)
		//event.dataTransfer.setData('text/plain', event.target.id);

		const { width, height } = window.getComputedStyle(this.$el);
		this.w = parseInt(width);
		this.h = parseInt(height);

		this.mouseOffsetX = event.offsetX;
		this.mouseOffsetY = event.offsetY;

		console.log('start drag', this.mouseOffsetX, this.mouseOffsetY);
	}

	dragMove (event) {
		event.preventDefault();
		// if (!event.screenX && !event.screenY) return;
		this.tempX = event.offsetX;
		this.tempY = event.offsetY;
		// console.log('move', event.offsetX, event.offsetY);
	}

	dragEnd (event) {
		event.preventDefault();
		this.dragging = false;

		console.log(this.x, this.y);

		this.x = this.x + this.tempX - this.mouseOffsetX;
		this.y = this.y + this.tempY - this.mouseOffsetY;

		this.tempX = 0;
		this.tempY = 0;

		// this.$el.style.translate = this.x + 'px ' + this.y + 'px';



		// this.$el.style.translate = (this.x-parseInt(this.w))+'px '+(this.y-parseInt(this.h))+'px';
		this.$el.style.translate = (this.x)+'px '+(this.y)+'px';

		console.log(event, this);
	}
}

Alpine.data('dragtest', (options) => (new DragTest(options)));

Alpine.store('global', {
	screenDPI: 96, // todo: magic
	editor: null,
	// pageIDs: 1,
	ui: {
		// dragInstance: null
	},
	documents: [],
	currentDocument: null,
	currentFrame: null,
	currentPage: null, // retired, use getter on Page.active instead
	cssRoot: document.querySelector(':root'),

	uniqueString (numBytes) {
		const bytes = crypto.getRandomValues(new Uint8Array(numBytes));
		const array = Array.from(bytes);
		const hexPairs = array.map(b => b.toString(16).padStart(2, '0'));
		return hexPairs.join('');
	},
	pxmm (px) {
		return (px * 25.4) / this.screenDPI;
	},
	xdataFromDOM (node) {
		// todo
		return node['_x_dataStack'][0];
	}
});

Alpine.start();
