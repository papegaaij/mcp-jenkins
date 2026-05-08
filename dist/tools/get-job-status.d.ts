import { JenkinsClient } from '../lib/jenkins-client.js';
export interface GetJobStatusInput {
    jobName: string;
}
export declare const getJobStatus: (client: JenkinsClient, input: GetJobStatusInput) => Promise<import("../lib/jenkins-client.js").NormalizedBuild>;
//# sourceMappingURL=get-job-status.d.ts.map