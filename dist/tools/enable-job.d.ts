import { JenkinsClient } from '../lib/jenkins-client.js';
export interface EnableJobInput {
    jobName: string;
}
export declare const enableJob: (client: JenkinsClient, input: EnableJobInput) => Promise<{
    jobName: string;
    enabled: boolean;
}>;
//# sourceMappingURL=enable-job.d.ts.map