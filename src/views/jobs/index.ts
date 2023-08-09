import JobRoutesMap from '@/views/jobs/constants/job-routes-map';
import { RouteRecordRaw } from 'vue-router';

const JobOffer = () => import(/* webpackChunkName: "job-offer" */ '@/views/jobs/views/job-offer/job-offer.view.vue');

const JobManager = () => import(/* webpackChunkName: "job-manager" */ '@/views/jobs/views/post-job/job-manager.view.vue');

const jobRoutes: Readonly<Array<RouteRecordRaw>> = [
  {
    path: JobRoutesMap.PATHS[JobRoutesMap.JOBS],
    name: JobRoutesMap.JOBS,
    redirect: { name: JobRoutesMap.JOB_OFFER },
    children: [
      {
        path: `${JobRoutesMap.PATHS[JobRoutesMap.JOB_MANAGER]}/:jobId?/:positionId?`,
        name: JobRoutesMap.JOB_MANAGER,
        component: JobManager,
        meta: {
          signed: true,
          breadcrumb: JobRoutesMap.JOB_MANAGER,
          parentName: JobRoutesMap.JOBS,
        },
      },
      {
        path: `${JobRoutesMap.PATHS[JobRoutesMap.JOB_OFFER]}/:positionId?`,
        name: JobRoutesMap.JOB_OFFER,
        meta: {
          breadcrumb: JobRoutesMap.JOB_OFFER,
          parentName: JobRoutesMap.JOBS,
        },
        component: JobOffer,
      },
    ],
  },
];

export default jobRoutes;
