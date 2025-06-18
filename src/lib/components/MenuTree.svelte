<script lang="ts">
	import MenuItemComponent from './MenuItem.svelte';
	import type { MenuItem } from '$lib/types';

	export let items: MenuItem[];
	export let readOnly: boolean = false;
</script>

<div class="menu-tree">
	{#each items as item}
		<div>
			<MenuItemComponent 
				{item} 
				depth={0} 
				{readOnly}
			/>
			{#if item.submenu && item.submenu.length > 0}
				{#each item.submenu as subItem}
					<div>
						<MenuItemComponent 
							item={subItem} 
							depth={1} 
							{readOnly}
						/>
						{#if subItem.submenu && subItem.submenu.length > 0}
							{#each subItem.submenu as subSubItem}
								<div>
									<MenuItemComponent 
										item={subSubItem} 
										depth={2} 
										{readOnly}
									/>
									{#if subSubItem.submenu && subSubItem.submenu.length > 0}
										{#each subSubItem.submenu as subSubSubItem}
											<MenuItemComponent 
												item={subSubSubItem} 
												depth={3} 
												{readOnly}
											/>
										{/each}
									{/if}
								</div>
							{/each}
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	{/each}
</div> 