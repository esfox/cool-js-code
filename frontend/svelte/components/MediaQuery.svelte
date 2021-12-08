<script>
  import { onMount } from 'svelte';

  export let query;

  let mediaQueryList;
  let mediaQueryListListener;
  let wasMounted = false;
  let matches = false;

  onMount(() => {
    wasMounted = true;
    return () => {
      removeActiveListener();
    };
  });

  $: {
    if (wasMounted) {
      removeActiveListener();
      addNewListener(query);
    }
  }

  function addNewListener(query) {
    mediaQueryList = window.matchMedia(query);
    mediaQueryListListener = (event) => (matches = event.matches);
    mediaQueryList.addEventListener('change', mediaQueryListListener);
    matches = mediaQueryList.matches;
  }

  function removeActiveListener() {
    if (mediaQueryList && mediaQueryListListener) {
      mediaQueryList.removeListener(mediaQueryListListener);
    }
  }
</script>

<slot {matches} />
