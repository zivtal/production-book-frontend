import type { BaseId } from '@/shared/models';
import type { ActiveUser } from '@/store/auth/models/auth-user';
import { computed, type ComputedRef } from 'vue';
import { GET_USER, IS_LOGGED_IN, USER } from '@/store/auth/constants';
import useAuthStore from '@/views/lobby/modals/login-modal/composables/use-auth-store';

export function useAuthUser(): {
  isMe: (userId: BaseId, isRoot?: boolean) => boolean;
  isAdmin: ComputedRef<boolean>;
  activeUser: ComputedRef<ActiveUser | null | undefined>;
  isLoggedIn: ComputedRef<boolean>;
} {
  const { useGetters, useState } = useAuthStore();
  const { [USER]: userState } = useState([USER]);
  const { [GET_USER]: getUserGetter, [IS_LOGGED_IN]: isLoggedInGetter } = useGetters([GET_USER, IS_LOGGED_IN]);

  return {
    isMe: (userId: BaseId, isRoot?: boolean): boolean => (isRoot ? userState.value?._id : getUserGetter.value?._id) === userId,
    isAdmin: computed((): boolean => userState.value?.role === 'ADMIN'),
    activeUser: computed((): ActiveUser => getUserGetter.value as ActiveUser),
    isLoggedIn: computed((): boolean => isLoggedInGetter.value),
  };
}
