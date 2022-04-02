export function cssVariables(node: HTMLElement, variables: Record<string, string>): SvelteActionReturnType
{
  setCssVariables(node, variables);
  return {
    update: (variables) => setCssVariables(node, variables)
  };
}

function setCssVariables(element: HTMLElement, variables)
{
  for(const name in variables)
    element.style.setProperty(`--${name}`, variables[name]);
}
