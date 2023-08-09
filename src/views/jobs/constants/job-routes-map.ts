export default class JobRoutesMap {
  public static readonly JOBS: string = 'job';
  public static readonly JOB_MANAGER: string = 'job-manager';
  public static readonly JOB_OFFER: string = 'job-offer';

  public static readonly PATHS: Record<string, string> = {
    [JobRoutesMap.JOBS]: '/job',
    [JobRoutesMap.JOB_MANAGER]: '/job/manager',
    [JobRoutesMap.JOB_OFFER]: '/job/offer',
  };
}
