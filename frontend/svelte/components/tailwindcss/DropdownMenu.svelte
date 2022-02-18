<script>
  import { onMount } from 'svelte';

  let shown = false;

  const toggleMenu = () => (shown = !shown);

  onMount(() => {
    window.addEventListener('click', (event) => {
      if (event.target.matches('.toggle')) return;
      shown = false;
    });
  });
</script>

<slot name="toggle" toggleClass="toggle" onClick={toggleMenu} />
{#if shown}
  <div class="menu absolute">
    <slot />
  </div>
{/if}
