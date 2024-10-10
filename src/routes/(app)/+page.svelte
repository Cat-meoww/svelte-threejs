<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Card from '$lib/components/Card.svelte';
	import Rings from '$lib/components/shapes/Rings.svelte';
	import Loop from '$lib/components/shapes/Loop.svelte';
	import Coins from '$lib/components/shapes/Coins.svelte';
	import Core from '$lib/components/shapes/Core.svelte';

	const items = [
		{ component: Rings, name: 'Rings' },
		{ component: Loop, name: 'Loop' },
		{ component: Coins, name: 'Coins' },
		{ component: Core, name: 'Core' },
		// { component: 'Item5', name: 'Rubik' },
		// { component: 'Item6', name: 'Travel' },
		// { component: 'Item7', name: 'Stagger' },
		// { component: 'Item8', name: 'Balance' },
		// { component: 'Item9', name: 'Pulse' },
		// { component: 'Item10', name: 'Pie' },
		// { component: 'Item11', name: "Newton's Cradle" },
		// { component: 'Item12', name: 'Arrows' }
	];

	let cards: HTMLDivElement[] = [];

	const handlePointerMove = (e: PointerEvent) => {
		cards.forEach((card) => {
			const rect = card.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			card.style.setProperty('--mouse-x', `${x}px`);
			card.style.setProperty('--mouse-y', `${y}px`);
		});
	};
</script>

<div class="relative mt-5 overflow-hidden">
	<div
		class="grid h-full gap-5 overflow-hidden group grid-clos-1 md:grid-cols-2 lg:grid-cols-4"
		data-gird
		on:pointermove={handlePointerMove}
	>
		{#each items as item, index}
			<Card bind:element={cards[index]} name={item.name}>
				<Canvas>
					
					<svelte:component this={item.component} />
				</Canvas>
			</Card>
		{/each}
	</div>

	<div class="fixed top-0 left-0 z-20 w-full h-screen pointer-events-none"></div>
</div>
