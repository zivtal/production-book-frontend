import { Ref } from 'vue';

export const useFormValidator = (formRef: Ref<Element | undefined>): (() => boolean) => {
  const execute = (el?: Element): boolean =>
    [...((el || formRef.value)?.children || [])]
      .map((child: any) => {
        const isValid = !child.getAttribute('data-errors');

        return [child.children ? execute(child) : true, isValid].every((item) => item);
      })
      .every((isValid) => isValid);

  return () => {
    const isValid = execute();

    if (!isValid) {
      formRef.value?.setAttribute('validate', 'errors');
    } else {
      formRef.value?.removeAttribute('validate');
    }

    return isValid;
  };
};
