import { JenkinsClient } from '../lib/jenkins-client.js';
export interface DisableJobInput {
    jobName: string;
}
export declare const disableJob: (client: JenkinsClient, input: DisableJobInput) => Promise<{
    jobName: string;
    disabled: boolean;
}>;
//# sourceMappingURL=disable-job.d.ts.map