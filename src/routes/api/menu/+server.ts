import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { menuItems } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';
import type { RequestHandler } from './$types';

function buildMenuTree(items: any[], parentId: number | null = null): any[] {
	return items
		.filter(item => item.parentId === parentId)
		.sort((a, b) => a.orderIndex - b.orderIndex)
		.map(item => ({
			...item,
			submenu: buildMenuTree(items, item.id)
		}));
}

export const GET: RequestHandler = async () => {
	try {
		const allItems = await db.select().from(menuItems).orderBy(asc(menuItems.orderIndex));
		const menuTree = buildMenuTree(allItems);
		
		return json({ menu: menuTree });
	} catch (error) {
		console.error('Error fetching menu:', error);
		return json({ error: 'Failed to fetch menu' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { title, parentId, orderIndex } = await request.json();
		
		if (!title) {
			return json({ error: 'Title is required' }, { status: 400 });
		}

		const result = await db.insert(menuItems).values({
			title,
			parentId: parentId || null,
			orderIndex: orderIndex || 0
		}).returning();

		const newItem = Array.isArray(result) ? result[0] : result.rows[0];

		return json(newItem, { status: 201 });
	} catch (error) {
		console.error('Error creating menu item:', error);
		return json({ error: 'Failed to create menu item' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request }) => {
	try {
		const { id, title, parentId, orderIndex } = await request.json();
		
		if (!id || !title) {
			return json({ error: 'ID and title are required' }, { status: 400 });
		}

		const result = await db.update(menuItems)
			.set({
				title,
				parentId: parentId || null,
				orderIndex: orderIndex || 0,
				updatedAt: new Date()
			})
			.where(eq(menuItems.id, id))
			.returning();

		const updatedItem = Array.isArray(result) ? result[0] : result.rows[0];

		if (!updatedItem) {
			return json({ error: 'Menu item not found' }, { status: 404 });
		}

		return json(updatedItem);
	} catch (error) {
		console.error('Error updating menu item:', error);
		return json({ error: 'Failed to update menu item' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { id } = await request.json();
		
		if (!id) {
			return json({ error: 'ID is required' }, { status: 400 });
		}

		async function deleteChildren(parentId: number) {
			const children = await db.select().from(menuItems).where(eq(menuItems.parentId, parentId));
			for (const child of children) {
				await deleteChildren(child.id);
			}
			await db.delete(menuItems).where(eq(menuItems.id, parentId));
		}

		await deleteChildren(id);
		
		return json({ success: true });
	} catch (error) {
		console.error('Error deleting menu item:', error);
		return json({ error: 'Failed to delete menu item' }, { status: 500 });
	}
}; 