export interface MenuItem {
	id: number;
	title: string;
	submenu?: MenuItem[];
	parentId?: number | null;
	orderIndex?: number;
} 