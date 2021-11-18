/**
 * Generates an array of a range of numbers.
 *
 * @param {number} start Starting number of the range array
 * @param {number} end Ending number of the range array
 * @returns
 */
function generateNumberRange(start, end)
{
  return Array.from({ length: (end - start) + 1 }, (_, i) => i + start);
}
