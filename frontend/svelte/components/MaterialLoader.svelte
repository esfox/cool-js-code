<script lang="ts">
  export let width = '4rem';
  export let thickness = '4px';
  export let color = 'red';
  export let duration = '2s';

  const variables = {
    width,
    thickness,
    color,
    duration
  };

  function cssVariables(
    node: HTMLElement,
    variables: Record<string, string>
  ): SvelteActionReturnType {
    setCssVariables(node, variables);
    return {
      update: (variables) => setCssVariables(node, variables)
    };
  }

  function setCssVariables(element: HTMLElement, variables) {
    for (const name in variables) element.style.setProperty(`--${name}`, variables[name]);
  }
</script>

<div class="loader" use:cssVariables={variables}>
  <svg class="circular" viewBox="25 25 50 50">
    <circle
      class="path"
      cx="50"
      cy="50"
      r="20"
      fill="none"
      stroke-width="2"
      stroke-miterlimit="10"
    />
  </svg>
</div>

<style lang="scss">
  .loader {
    position: relative;
    margin: 0 auto;
    width: var(--width);

    &:before {
      content: '';
      display: block;
      padding-top: 100%;
    }
  }

  .circular {
    animation: rotate var(--duration) linear infinite;
    height: 100%;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .path {
    stroke: var(--color);
    stroke-width: var(--thickness);
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px;
    }
  }
</style>
