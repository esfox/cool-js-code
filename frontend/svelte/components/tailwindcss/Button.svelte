<!-- PLEASE READ: This component requires Tailwind CSS and the `classnames` package. -->
<script>
  import classNames from 'classnames';

  export let fab = false;
  export let outlined = false;
  export let text = false;
  export let icon = false;
  export let basic = !fab && !outlined && !text && !icon;
  export let rounded = false;
  export let noPadding = false;
</script>

<button
  class={classNames(
    'focus:outline-none focus:ring transition font-bold',
    !noPadding && 'px-4 py-2',
    basic && 'bg-primary hover:bg-primary-hover',
    (text || icon) && 'focus:ring-0 bg-transparent hover:bg-primary',
    icon && 'rounded-full',
    outlined &&
      'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white',
    rounded && 'rounded-sm',
    fab &&
      'bg-primary hover:bg-primary-hover w-16 h-16 grid place-items-center rounded-full text-5xl shadow-xl',
    $$props.class
  )}
  on:click
>
  <slot />
</button>
