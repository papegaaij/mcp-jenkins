import { JenkinsClient } from '../lib/jenkins-client.js';
export interface DeleteJobInput {
    jobName: string;
}
export declare const deleteJob: (client: JenkinsClient, input: DeleteJobInput) => Promise<{
    jobName: string;
    deleted: boolean;
}>;
//# sourceMappingURL=delete-job.d.ts.map