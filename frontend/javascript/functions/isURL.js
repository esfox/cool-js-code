/**
 * Checks if the given link is a valid URL.
 *
 * @param {string} link
 * @returns {boolean}
 */
function isURL(link)
{
  try
  {
    new URL(link);
    return true;
  }
  catch(_)
  {
    return false;
  }
}
