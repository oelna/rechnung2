import { ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { vDraggable } from 'https://cdn.jsdelivr.net/npm/@neodrag/vue@2.2.0/+esm';

export const panel = {
	directives: {
		draggable: vDraggable
	},
	props: {
		title: String,
		tabs: Array
	},
	setup() {
		const count = ref(0)
		return { count }
	},
	template: `
		<div class="panel" v-draggable>
			<nav class="handle">
				<h2>{{ title }}</h2>
			</nav>
			<div class="tabs" v-for="tab in tabs">
				<details name="panel-1" open>
					<summary>Type</summary>
					<div class="tab-content">ABC</div>
				</details>
			</div>
		</div>`
	// Can also target an in-DOM template:
	// template: '#my-template-element'
}
