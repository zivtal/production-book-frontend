import type { EmployeeActions, EmployeeGetters, EmployeeMutations, EmployeeState } from '@/views/employee/store/types';
import store from '@/store';
import employeeStore from '@/views/employee/store';
import { StoreNamespace } from '@/store/store-namespace';
import { createNamespacedHelpers } from 'vuex-composition-helpers';

const useEmployeeStore = () => {
  if (!store.hasModule(StoreNamespace.EMPLOYEES_MODULE)) {
    store.registerModule(StoreNamespace.EMPLOYEES_MODULE, employeeStore);
  }

  return createNamespacedHelpers<EmployeeState, EmployeeGetters, EmployeeActions, EmployeeMutations>(StoreNamespace.EMPLOYEES_MODULE);
};

export default useEmployeeStore;
