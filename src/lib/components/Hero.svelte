<script>
	import Link from './Link.svelte';
    import { useStore } from '$lib/store/storage';
</script>

<div
	class="w-full space-y-3 sm:space-y-5 border flex flex-col justify-between from-[#111111] to-[#181818] bg-gradient-to-t border-white/10 rounded-md p-5 md:p-10"
>
	<div class="flex items-center justify-between">
		<div class="text-md sm:text-xl lg:text-2xl">12+ 3D Motion Graphics</div>

		<div class="flex items-center">
			<div class="hidden text-xs text-white/60 md:block">VARIATIONS</div>
			<div class="flex ml-4 space-x-2">
				{#each Array.from({ length: 4 }) as _, key}
					<button
						class={`${
							key === $useStore.index ? 'text-white/100 bg-white/20' : 'text-white/60 bg-white/5 '
						}  flex items-center justify-center rounded-sm w-6 h-6  md:w-8 md:h-8 transition-colors duration-300  cursor-pointer  bg-white/10 hover:bg-white/15  hover:text-white`}
						on:click={() => {
							useStore.setIndex(key);
						}}
					>
						<span class="text-xs md:text-sm">{key + 1}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>
	<div
		class="text-5xl text-transparent sm:text-6xl zen-dots-regular md:text-8xl lg:text-9xl from-[#828282] to-white bg-gradient-to-l bg-clip-text"
	>
		ORIGAMI
	</div>
	<div class="flex flex-col justify-around text-xs border lg:flex-row md:text-s border-white/10">
		<div class="px-2 py-2 sm:px-4">
			©️ 2024 <Link href="https://x.com/codrops">Codrops</Link> &amp; <Link
				href="https://x.com/deadrabbbbit">deadrabbbbit</Link
			>
		</div>
		<div
			class="flex justify-between flex-grow px-2 py-2 sm:px-4 lg:justify-around border-white/10 md:border-x"
		>
			<Link href="https://tympanus.net/codrops/demos/?tag=webgl">webgl</Link>
			<div class="hidden sm:inline-block">▲</div>
			<Link href="https://tympanus.net/codrops/demos/?tag=three-js">three.js</Link>
			<div class="hidden sm:inline-block">▲</div>
			<Link href="https://tympanus.net/codrops/demos/">svelte</Link>
			<div class="hidden sm:inline-block">▲</div>
			<Link href="https://tympanus.net/codrops/demos/?tag=3d">3D</Link>
		</div>
		<div class="flex px-2 py-2 space-x-4 sm:px-4 lg:justify-around">
			<Link href="https://github.com/d3adrabbit/origami">GitHub</Link>
			<Link href="https://tympanus.net/codrops/?p=79782">Article</Link>
		</div>
	</div>
</div>
