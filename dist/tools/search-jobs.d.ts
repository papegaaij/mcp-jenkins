import { JenkinsClient } from '../lib/jenkins-client.js';
export interface SearchJobsInput {
    query: string;
}
export declare const searchJobs: (client: JenkinsClient, input: SearchJobsInput) => Promise<{
    name: string;
    url: string;
}[]>;
//# sourceMappingURL=search-jobs.d.ts.map