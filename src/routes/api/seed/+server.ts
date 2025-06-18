import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { menuItems } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

async function insertMenuItems(items: any[], parentId: number | null = null, orderIndex: number = 0): Promise<void> {
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const result = await db.insert(menuItems).values({
			title: item.title,
			parentId,
			orderIndex: orderIndex + i
		}).returning();

		const insertedItem = Array.isArray(result) ? result[0] : result.rows[0];

		if (item.submenu && item.submenu.length > 0) {
			await insertMenuItems(item.submenu, insertedItem.id, 0);
		}
	}
}

export const POST: RequestHandler = async () => {
	try {
		await db.delete(menuItems);

		const response = await fetch('https://formation-media.github.io/fullstack-interview-test/menu.json');
		if (!response.ok) {
			throw new Error('Failed to fetch menu data');
		}

		const data = await response.json();
		
		await insertMenuItems(data.menu);

		return json({ success: true, message: 'Database seeded successfully' });
	} catch (error) {
		console.error('Error seeding database:', error);
		return json({ error: 'Failed to seed database' }, { status: 500 });
	}
}; 