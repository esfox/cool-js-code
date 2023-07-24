/**
 * Gets the percentage of the scroll of a page if no `fromPercent` parameter is provided,
 * but returns the actual scroll amount (similar to `scrollY`) if it is provided.
 */
function convertScrollPercent(params?: { fromPercent: number }) {
  const { fromPercent } = params ?? {};

  const scrollTopOffset = document.body.scrollHeight - window.innerHeight;
  if (fromPercent !== undefined) {
    const toScrollY = scrollTopOffset * (fromPercent / 100);
    return Math.round(toScrollY);
  }

  const scrollPercent = window.scrollY / scrollTopOffset;
  return Math.round(scrollPercent * 100);
}
