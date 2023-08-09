import type { Directive } from '@vue/runtime-core';
import { DirectiveBinding, type Ref } from 'vue';

export const vValidate: [string, Directive] = [
  'validate',
  (el: Element, binding: DirectiveBinding<{ isValid: Ref<boolean>; isMarked: Ref<boolean> }>) => {
    const execute = (elem?: Element): boolean =>
      [...(elem?.children || [])]
        .map((child: any) => {
          const isValid = !child.getAttribute('data-errors');

          return [child.children ? execute(child) : true, isValid].every((item) => item);
        })
        .every((isValid) => isValid);

    const isValid = execute();

    if (!isValid) {
      el.setAttribute('validate', 'errors');
    } else {
      el.removeAttribute('validate');
    }
  },
];
