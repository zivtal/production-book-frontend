import { defineAsyncComponent } from 'vue';

const EmployeeCommunicate = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "profile" */ '@/views/employee/components/full-identity-card/components/employee-information/employee-communicate.vue'
    )
);

const EmployeeWage = defineAsyncComponent(
  () => import(/* webpackChunkName: "profile" */ '@/views/employee/components/full-identity-card/components/employee-information/employee-wage.vue')
);

const EmployeeGeneralInfo = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "profile" */ '@/views/employee/components/full-identity-card/components/employee-information/employee-general-info.vue'
    )
);

const EmployeeSkills = defineAsyncComponent(
  () => import(/* webpackChunkName: "profile" */ '@/views/employee/components/full-identity-card/components/employee-information/employee-skills.vue')
);

const EmployeeAbout = defineAsyncComponent(
  () => import(/* webpackChunkName: "profile" */ '@/views/employee/components/full-identity-card/components/employee-information/employee-about.vue')
);

const EmployeeGalleryTab = defineAsyncComponent(
  () => import(/* webpackChunkName: "profile" */ '@/views/employee/components/full-identity-card/components/media-gallery/media-gallery-tab.vue')
);

const EmployeeReviewsTab = defineAsyncComponent(
  () =>
    import(/* webpackChunkName: "profile" */ '@/views/employee/components/full-identity-card/components/employee-reviews/employee-reviews-tab.vue')
);

const EmployeeInformationTab = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "profile" */ '@/views/employee/components/full-identity-card/components/employee-information/employee-information-tab.vue'
    )
);

const EmployeeCover = defineAsyncComponent(
  () => import(/* webpackChunkName: "profile" */ '@/views/employee/components/full-identity-card/components/employee-cover.vue')
);

const AlbumModal = defineAsyncComponent(() => import(/* webpackChunkName: "profile-album" */ '@/views/employee/modals/album-modal.vue'));

export default {
  EmployeeCommunicate,
  EmployeeWage,
  EmployeeGeneralInfo,
  EmployeeSkills,
  EmployeeAbout,
  EmployeeGalleryTab,
  EmployeeReviewsTab,
  EmployeeInformationTab,
  EmployeeCover,
  AlbumModal,
};
