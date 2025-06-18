<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<div class="container">
	<header class="header">
		<h1 class="nav-header">FULLSTACK-INTERVIEW-TEST</h1>
		<nav class="nav">
			<a href="/" class="nav-link" class:active={page.url.pathname === '/'}>Display</a>
			<a href="/edit" class="nav-link" class:active={page.url.pathname === '/edit'}>Edit</a>
		</nav>
	</header>

	<main class="main">
		<div class="page-content">
			{@render children()}
		</div>
	</main>
</div>
