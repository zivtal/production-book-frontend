import { h, render, type Component } from 'vue';

export const useCreateComponent = (
  component: Component,
  props: Record<string, unknown>,
  parentContainer: Element,
  slots: Record<string, unknown> = {},
  id?: string
) => {
  const node = h(component, props, slots);
  const container = document.createElement('div');
  container.setAttribute('id', id || '');
  parentContainer.appendChild(container);
  render(node, container);

  return node.component;
};
