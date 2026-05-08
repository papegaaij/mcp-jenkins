import { JenkinsClient } from '../lib/jenkins-client.js';
export interface GetJobConfigInput {
    jobName: string;
}
export declare const getJobConfig: (client: JenkinsClient, input: GetJobConfigInput) => Promise<{
    jobName: string;
    config: string;
}>;
//# sourceMappingURL=get-job-config.d.ts.map