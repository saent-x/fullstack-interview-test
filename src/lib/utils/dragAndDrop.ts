import type { MenuItem } from '$lib/types';

export function isDescendant(parent: MenuItem, child: MenuItem): boolean {
	if (!parent.submenu) return false;
	for (const item of parent.submenu) {
		if (item.id === child.id) return true;
		if (isDescendant(item, child)) return true;
	}
	return false;
}

export function canDropOn(draggedItem: MenuItem | null, targetItem: MenuItem, isEditing: boolean): boolean {
	if (!draggedItem || isEditing) return false;
	if (draggedItem.id === targetItem.id) return false;
	if (isDescendant(draggedItem, targetItem)) return false;
	return true;
}

export function setupDragImage(event: DragEvent, element: HTMLElement) {
	event.dataTransfer!.setDragImage(element, 0, 0);
}

export function preventDefault(event: DragEvent) {
	event.preventDefault();
	event.dataTransfer!.dropEffect = 'move';
} 