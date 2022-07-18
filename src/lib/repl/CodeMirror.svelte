<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import Message from './Message.svelte';
	import { addCodeToDB, getCodeFromDB, updateCodeInDB, deleteCodeFromDB } from '../../supabase-db.js';
	import { user_email, diagrams, user } from '$lib/stores/authStore.js';

	const dispatch = createEventDispatcher();

	export let readonly = false;
	export let errorLoc = null;
	export let lineNumbers = true;
	export let tab = true;
	export let theme;

	let w;
	let h;
	let code = '';
	let mode;

	// We have to expose set and update methods, rather
	// than making this state-driven through props,
	// because it's difficult to update an editor
	// without resetting scroll otherwise
	export async function set(new_code, new_mode) {
		if (new_mode !== mode) {
			await createEditor(mode = new_mode);
		}

		code = new_code;
		updating_externally = true;
		if (editor) editor.setValue(code);
		updating_externally = false;
	}

	export function update(new_code) {
		code = new_code;

		if (editor) {
			const { left, top } = editor.getScrollInfo();
			editor.setValue(code = new_code);
			editor.scrollTo(left, top);
		}
	}

	export function resize() {
		editor.refresh();
	}

	export function focus() {
		editor.focus();
	}

	export function getHistory() {
		return editor.getHistory();
	}

	export function setHistory(history) {
		editor.setHistory(history);
	}

	export function clearHistory() {
		if (editor) editor.clearHistory();
	}

	export function setCursor(pos) {
		if (editor) editor.setCursor(pos);
	}

	export const cursorIndex = writable(0);

	export function markText({ from, to }) {
		if (editor) editor.markText(editor.posFromIndex(from), editor.posFromIndex(to), { className: 'mark-text' });
	}

	export function unmarkText() {
		if (editor) editor.getAllMarks().forEach(m => m.clear());
	}

	//----- NEW FUNCTIONS AS OF SVELVET 2.0 -----

	export async function copyCodeEditor() {
		const code_to_copy = editor.getValue();
		const copyToClipboard = () => {
  		if (navigator && navigator.clipboard && navigator.clipboard.writeText){
    		return navigator.clipboard.writeText(code_to_copy);
			}
  		return Promise.reject('The Clipboard API is not available.');
		};
		copyToClipboard();
	}

	export async function getCodeEditorValue(id, diagramName) {
		const codeToSave = editor.getValue();
		let found = false;

		if(diagramName && $diagrams.length < 6) {
			// loop through the array of projects in store and check each object's id	
			for(const obj of $diagrams) {
				if(obj.id === id && obj.diagram_name === diagramName) {
					updateCodeInDB(id, codeToSave, $diagrams);
					alert('Diagram updated successfully!');
					found = true;
				}
			}
			if(!found) {
	  		addCodeToDB(codeToSave, $user_email, diagramName, $diagrams);
				alert('Diagram saved to database successfully!');
			}
		}
		else if($diagrams.length >= 6 && !found) {
			alert('You have reached the limit in terms of how many diagrams you can store. Please delete one to save a new diagram.');
		}
		else {
			alert('Please provide a name for your diagram before attempting to save.');
		}
	}
	
	export async function loadSavedCode(code) {
		// grab and load saved code into the editor
		editor.setValue(code);
	}

	export async function deleteCode(id) {
		deleteCodeFromDB(id, $diagrams);
		// clear the editor
		editor.setValue('');
		// reset the project name field
		document.getElementById('project-name').value = '';
	}

	export async function updateCode(id, updated_code) {
		updateCodeInDB(id, updated_code);
	}

	const modes = {
		js: {
			name: 'javascript',
			json: false
		},
		json: {
			name: 'javascript',
			json: true
		},
		svelte: {
			name: 'handlebars',
			base: 'text/html'
		},
		md: {
			name: 'markdown'
		}
	};

	const refs = {};
	let editor;
	let updating_externally = false;
	let marker;
	let error_line;
	let destroyed = false;
	let CodeMirror;

	$: if (editor && w && h) {
		editor.refresh();
	}

	$: {
		if (marker) marker.clear();

		if (errorLoc) {
			const line = errorLoc.line - 1;
			const ch = errorLoc.column;

			marker = editor.markText({ line, ch }, { line, ch: ch + 1 }, {
				className: 'error-loc'
			});

			error_line = line;
		} else {
			error_line = null;
		}
	}

	let previous_error_line;
	$: if (editor) {
		if (previous_error_line != null) {
			editor.removeLineClass(previous_error_line, 'wrap', 'error-line')
		}

		if (error_line && (error_line !== previous_error_line)) {
			editor.addLineClass(error_line, 'wrap', 'error-line');
			previous_error_line = error_line;
		}
	}

	onMount(() => {
		(async () => {
			if (!CodeMirror) {
				let mod = await import('./codemirror.js');
				CodeMirror = mod.default;
			}
			await createEditor(mode || 'svelte');
			if($user) {
				if(editor) editor.setValue(code || '');
			}
			else {
				if(editor) editor.setValue(code || `<script>
  import Svelvet from 'svelvet';
  const initialNodes = [
    {
      id: 1,
      position: { x: 190, y: 40 },
      data: { label: 'Input Node' },
      width: 175,
      height: 40,
      bgColor: '#FF4121'
    },
    {
      id: 2,
      position: { x: 355, y: 160 },
      data: { label: 'Default Node' },
      width: 175,
      height: 40,
      bgColor: 'yellow'
    },
    {
      id: 3,
      position: { x: 190, y: 260 },
      data: { label: 'Output Node' },
      width: 175,
      height: 40,
      bgColor: 'red'
    },
    {
      id: 4,
      position: { x: 25, y: 160 },
      data: { label: 'Drag me!' },
      width: 175,
      height: 40,
      bgColor: 'rgb(246,111,83)'
    },
    {
      id: 5,
      position: { x: 355, y: 360 },
      data: { label: 'Custom Node' },
      width: 175,
      height: 40,
      bgColor: 'rgb(251,113,133)',
      borderColor: 'transparent',
      borderRadius: 0
    },
    {
      id: 6,
      position: { x: 72.5, y: 360 },
      data: { label: 'Custom Node' },
      width: 80,
      height: 80,
      borderColor: '#FF4121',
      borderRadius: 30,
      bgColor: 'white',
      textColor: '#FF4121'
    }
  ];
  const initialEdges = [
    { id: 'e1-2', source: 1, target: 2, label: 'edge label' },
    { id: 'e2-3', source: 2, target: 3, animate: true },
    { id: 'e1-4', source: 1, target: 4 },
    { id: 'e2-5', source: 2, target: 5, label: 'animated edge', animate: true, arrow: true },
    { id: 'e2-5', source: 4, target: 6, type: 'straight' },
    { id: 'e2-5', source: 3, target: 6 }
  ];
	</\script>
<Svelvet nodes={initialNodes} edges={initialEdges} width={710} height={700} background />
			`);
			}
		})();

		return () => {
			destroyed = true;
			if (editor) editor.toTextArea();
		}
	});

	let first = true;

	async function createEditor(mode) {
		if (destroyed || !CodeMirror) return;

		if (editor) editor.toTextArea();

		const opts = {
			lineNumbers,
			lineWrapping: true,
			indentWithTabs: true,
			indentUnit: 2,
			tabSize: 2,
			value: '',
			mode: modes[mode] || {
				name: mode
			},
			readOnly: readonly,
			autoCloseBrackets: true,
			autoCloseTags: true,
			extraKeys: CodeMirror.normalizeKeyMap({
				'Enter': 'newlineAndIndentContinueMarkdownList',
				'Ctrl-/': 'toggleComment',
				'Cmd-/': 'toggleComment',
				'Ctrl-Q': function (cm) {
					cm.foldCode(cm.getCursor());
				},
				'Cmd-Q': function (cm) {
					cm.foldCode(cm.getCursor());
				},
				// allow escaping the CodeMirror with Esc Tab
				'Esc Tab': false
			}),
			foldGutter: true,
			gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
			theme
		};

		if (!tab) {
			opts.extraKeys['Tab'] = tab;
			opts.extraKeys['Shift-Tab'] = tab;
		}

		// Creating a text editor is a lot of work, so we yield
		// the main thread for a moment. This helps reduce jank
		if (first) await sleep(50);

		if (destroyed) return;

		editor = CodeMirror.fromTextArea(refs.editor, opts);

		editor.on('change', instance => {
			if (!updating_externally) {
				const value = instance.getValue();
				dispatch('change', { value });
			}
		});

		editor.on('cursorActivity', instance => {
			cursorIndex.set(instance.indexFromPos(instance.getCursor()));
		});

		if (first) await sleep(50);
		editor.refresh();

		first = false;
	}

	function sleep(ms) {
		return new Promise(fulfil => setTimeout(fulfil, ms));
	}
</script>

<style>
	.codemirror-container {
		position: relative;
		width: 100%;
		height: 100%;
		border: none;
		line-height: 1.5;
		overflow: hidden;
	}

	.codemirror-container :global(.CodeMirror) {
		height: 100%;
		font: 400 var(--code-fs)/1.7 var(--font-mono);
	}

	.codemirror-container :global(.error-loc) {
		position: relative;
		border-bottom: 2px solid #da106e;
	}

	.codemirror-container :global(.error-line) {
		background-color: rgba(200, 0, 0, .05);
	}

	.codemirror-container :global(.mark-text) {
		background-color: var(--highlight);
	}

	textarea {
		visibility: hidden;
	}

	pre {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		border: none;
		padding: 4px 4px 4px 60px;
		resize: none;
		font-family: var(--font-mono);
		font-size: 13px;
		line-height: 1.7;
		user-select: none;
		pointer-events: none;
		color: #ccc;
		tab-size: 2;
		-moz-tab-size: 2;
	}
</style>

<div class='codemirror-container' bind:offsetWidth={w} bind:offsetHeight={h}>
	<textarea
		bind:this={refs.editor}
		readonly
		value={code}
	></textarea>

	{#if !CodeMirror}
		<pre style="position: absolute; left: 0; top: 0"
		>{code}</pre>

		<div style="position: absolute; width: 100%; bottom: 0">
			<Message kind='info'>loading editor...</Message>
		</div>
	{/if}
</div>

