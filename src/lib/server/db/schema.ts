import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';

export const menuItems = sqliteTable('menu_items', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	parentId: integer('parent_id').references(() => menuItems.id),
	orderIndex: integer('order_index').notNull().default(0),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
}, (table) => [
	index('parent_id_idx').on(table.parentId),
	index('order_idx').on(table.orderIndex)
]) as any;
