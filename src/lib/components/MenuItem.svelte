<script lang="ts">
	import { menuStore } from '$lib/stores/menuStore';
	import { canDropOn, setupDragImage, preventDefault } from '$lib/utils/dragAndDrop';
	import type { MenuItem } from '$lib/types';

	export let item: MenuItem;
	export let depth: number = 0;
	export let readOnly: boolean = false;

	let isDragOver = false;

	function handleEdit() { 
		if (readOnly) return;
		menuStore.startEdit(item); 
	}

	function handleDelete() { 
		if (readOnly) return;
		menuStore.deleteItem(item); 
	}

	function handleSaveEdit() { 
		if (readOnly) return;
		menuStore.saveEdit(); 
	}

	function handleCancelEdit() { 
		if (readOnly) return;
		menuStore.cancelEdit(); 
	}
	
	function handleTitleChange(event: Event) {
		if (readOnly) return;
		const target = event.target as HTMLInputElement;
		menuStore.updateEditingTitle(target.value);
	}

	function handleDragStart(event: DragEvent) {
		if (readOnly) return;
		const { editingItem } = $menuStore;
		if (editingItem?.id === item.id) return;
		
		menuStore.setDraggedItem(item);
		setupDragImage(event, event.target as HTMLElement);
	}

	function handleDragOver(event: DragEvent) {
		if (readOnly) return;
		const { editingItem, draggedItem } = $menuStore;
		if (!canDropOn(draggedItem, item, editingItem?.id === item.id)) {
			return;
		}
		
		preventDefault(event);
		isDragOver = true;
	}

	function handleDragLeave() {
		if (readOnly) return;
		isDragOver = false;
	}

	function handleDrop(event: DragEvent) {
		if (readOnly) return;
		event.preventDefault();
		isDragOver = false;
		
		const { draggedItem } = $menuStore;
		if (draggedItem && draggedItem.id !== item.id) {
			menuStore.moveItem(draggedItem, item);
		}
		menuStore.setDraggedItem(null);
	}

	$: editingItem = $menuStore.editingItem;
	$: editingTitle = $menuStore.editingTitle;
	$: draggedItem = $menuStore.draggedItem;
	$: isEditing = editingItem?.id === item.id;
	$: hasChildren = item.submenu && item.submenu.length > 0;
	$: canDrop = canDropOn(draggedItem, item, isEditing);
</script>

<div 
	class="menu-item" 
	class:drag-over={isDragOver}
	class:can-drop={canDrop}
	style="margin-left: {depth * 20}px;"
	draggable={!isEditing && !readOnly}
	role="button"
	tabindex="0"
	on:dragstart={handleDragStart}
	on:dragover={handleDragOver}
	on:dragleave={handleDragLeave}
	on:drop={handleDrop}
>
	<span class="icon">{hasChildren ? '🗂️' : '📂'}</span>
	
	{#if isEditing && !readOnly}
		<input 
			type="text" 
			value={editingTitle} 
			on:input={handleTitleChange}
			class="edit-input"
			on:keydown={(e) => e.key === 'Enter' && handleSaveEdit()}
		/>
		<div class="actions">
			<button on:click={handleSaveEdit} class="btn btn-small btn-success">Save</button>
			<button on:click={handleCancelEdit} class="btn btn-small btn-secondary">Cancel</button>
		</div>
	{:else}
		<span class="title">{item.title}</span>
		{#if !readOnly}
			<div class="actions">
				<button on:click={handleEdit} class="btn btn-small btn-primary">Edit</button>
				<button on:click={handleDelete} class="btn btn-small btn-danger">Delete</button>
			</div>
		{/if}
	{/if}
</div> 