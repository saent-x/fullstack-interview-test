<script lang="ts">
	import { onMount } from 'svelte';
	import MenuTree from '$lib/components/MenuTree.svelte';

	interface MenuItem {
		id: number;
		title: string;
		submenu?: MenuItem[];
	}

	let menuData: MenuItem[] = [];
	let loading = true;
	let error = '';

	async function fetchMenu() {
		try {
			loading = true;
			const response = await fetch('/api/menu');
			if (!response.ok) {
				throw new Error('Failed to fetch menu');
			}
			const data = await response.json();
			menuData = data.menu || [];
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	async function seedDatabase() {
		try {
			const response = await fetch('/api/seed', { method: 'POST' });
			if (!response.ok) {
				throw new Error('Failed to seed database');
			}
			await fetchMenu();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to seed database';
		}
	}

	onMount(() => {
		fetchMenu();
	});
</script>

<svelte:head>
	<title>Fullstack Interview Test</title>
</svelte:head>

{#if loading}
	<div class="loading">
		<div class="spinner"></div>
		<p>Loading menu data...</p>
	</div>
{:else if error}
	<div class="error">
		<p>{error}</p>
		<button on:click={fetchMenu} class="btn btn-primary">Retry</button>
	</div>
{:else if menuData.length === 0}
	<div class="empty-state">
		<p>No menu data found. Would you like to seed the database with initial data?</p>
		<button on:click={seedDatabase} class="btn btn-primary">Seed Database</button>
	</div>
{:else}
	<div class="menu-display">
		<h2 class="nav-header !text-md">MENU STRUCTURE</h2>
		<MenuTree items={menuData} readOnly={true} />
	</div>
{/if}
