import { JenkinsClient } from '../lib/jenkins-client.js';
export interface ListJobsInput {
}
export declare const listJobs: (client: JenkinsClient, _input: ListJobsInput) => Promise<{
    name: string;
    url: string;
}[]>;
//# sourceMappingURL=list-jobs.d.ts.map