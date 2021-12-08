<!-- PLEASE READ: This component requires Tailwind CSS and the `classnames` package. -->
<script>
  import classNames from 'classnames';

  export let temporary = false;
  export let shown = false;

  $: isShown = shown || !temporary;

  const hide = () => (shown = false);
</script>

<div
  class={classNames(
    $$props.class,
    'bg-bg-darker',
    temporary &&
      'fixed transition duration-300 z-50 md:relative md:translate-x-0',
    !isShown && '-translate-x-full'
  )}
>
  <slot />
</div>
<div
  class={classNames(
    'absolute w-full h-full bg-black transition duration-300 z-40',
    temporary && isShown
      ? 'pointer-events-auto opacity-40'
      : 'pointer-events-none opacity-0'
  )}
  on:click={hide}
/>
