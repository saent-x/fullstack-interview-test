import { writable } from 'svelte/store';
import type { MenuItem } from '$lib/types';

interface MenuState {
	items: MenuItem[];
	loading: boolean;
	error: string;
	editingItem: MenuItem | null;
	editingTitle: string;
	draggedItem: MenuItem | null;
}

function createMenuStore() {
	const { subscribe, set, update } = writable<MenuState>({
		items: [],
		loading: false,
		error: '',
		editingItem: null,
		editingTitle: '',
		draggedItem: null
	});

	return {
		subscribe,
		
		async fetchMenu() {
			update(state => ({ ...state, loading: true, error: '' }));
			
			try {
				const response = await fetch('/api/menu');
				if (!response.ok) {
					throw new Error('Failed to fetch menu');
				}
				const data = await response.json();
				update(state => ({ 
					...state, 
					items: data.menu || [], 
					loading: false 
				}));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'An error occurred';
				update(state => ({ ...state, error, loading: false }));
			}
		},

		async seedDatabase() {
			try {
				const response = await fetch('/api/seed', { method: 'POST' });
				if (!response.ok) {
					throw new Error('Failed to seed database');
				}
				await this.fetchMenu();
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to seed database';
				update(state => ({ ...state, error }));
			}
		},

		startEdit(item: MenuItem) {
			update(state => ({ 
				...state, 
				editingItem: item, 
				editingTitle: item.title 
			}));
		},

		cancelEdit() {
			update(state => ({ 
				...state, 
				editingItem: null, 
				editingTitle: '' 
			}));
		},

		updateEditingTitle(title: string) {
			update(state => ({ ...state, editingTitle: title }));
		},

		async saveEdit() {
			let currentState: MenuState;
			update(state => {
				currentState = state;
				if (!state.editingItem || !state.editingTitle.trim()) return state;
				
				const updatedItems = this.updateItemInTree(
					state.items, 
					state.editingItem.id, 
					{ title: state.editingTitle.trim() }
				);
				
				return { 
					...state, 
					items: updatedItems,
					editingItem: null, 
					editingTitle: '' 
				};
			});

			if (!currentState!.editingItem || !currentState!.editingTitle.trim()) return;

			try {
				const response = await fetch('/api/menu', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						id: currentState!.editingItem.id,
						title: currentState!.editingTitle.trim(),
						parentId: currentState!.editingItem.parentId,
						orderIndex: currentState!.editingItem.orderIndex
					})
				});

				if (!response.ok) {
					throw new Error('Failed to update menu item');
				}

				await this.fetchMenu();
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to update menu item';
				update(state => ({ ...state, error }));
			}
		},

		async deleteItem(item: MenuItem) {
			if (!confirm(`Are you sure you want to delete "${item.title}" and all its submenu items?`)) {
				return;
			}

			try {
				const response = await fetch('/api/menu', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id: item.id })
				});

				if (!response.ok) {
					throw new Error('Failed to delete menu item');
				}

				await this.fetchMenu();
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to delete menu item';
				update(state => ({ ...state, error }));
			}
		},

		setDraggedItem(item: MenuItem | null) {
			update(state => ({ ...state, draggedItem: item }));
		},

		async moveItem(itemToMove: MenuItem, newParent: MenuItem) {
			try {
				const response = await fetch('/api/menu', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						id: itemToMove.id,
						title: itemToMove.title,
						parentId: newParent.id,
						orderIndex: itemToMove.orderIndex || 0
					})
				});

				if (!response.ok) {
					throw new Error('Failed to move menu item');
				}

				await this.fetchMenu();
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to move menu item';
				update(state => ({ ...state, error }));
			}
		},

		isDescendant(parent: MenuItem, child: MenuItem): boolean {
			if (!parent.submenu) return false;
			for (const item of parent.submenu) {
				if (item.id === child.id) return true;
				if (this.isDescendant(item, child)) return true;
			}
			return false;
		},

		updateItemInTree(items: MenuItem[], itemId: number, updates: Partial<MenuItem>): MenuItem[] {
			return items.map(item => {
				if (item.id === itemId) {
					return { ...item, ...updates };
				}
				if (item.submenu) {
					return { ...item, submenu: this.updateItemInTree(item.submenu, itemId, updates) };
				}
				return item;
			});
		},

		clearError() {
			update(state => ({ ...state, error: '' }));
		}
	};
}

export const menuStore = createMenuStore(); 