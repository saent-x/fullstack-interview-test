<script lang="ts">
	import { onMount } from 'svelte';
	import MenuTree from '$lib/components/MenuTree.svelte';
	import { menuStore } from '$lib/stores/menuStore';

	onMount(() => {
		menuStore.fetchMenu();
	});
</script>

<svelte:head>
	<title>Menu Edit - Fullstack Interview Test</title>
</svelte:head>

{#if $menuStore.loading}
	<div class="loading">
		<div class="spinner"></div>
		<p>Loading menu data...</p>
	</div>
{:else if $menuStore.error}
	<div class="error">
		<p>{$menuStore.error}</p>
		<button on:click={() => menuStore.fetchMenu()} class="btn btn-primary">Retry</button>
	</div>
{:else if $menuStore.items.length === 0}
	<div class="empty-state">
		<p>No menu data found. Would you like to seed the database with initial data?</p>
		<button on:click={() => menuStore.seedDatabase()} class="btn btn-primary">Seed Database</button>
	</div>
{:else}
	<div class="menu-container">
		<h2 class="nav-header !text-md">EDIT MENU STRUCTURE</h2>
		<p class="instructions">Drag and drop items to move them, or click the buttons to edit or delete.</p>
		
		<MenuTree items={$menuStore.items} />
	</div>
{/if} 