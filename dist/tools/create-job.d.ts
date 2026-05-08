import { JenkinsClient } from "../lib/jenkins-client.js";
export interface CreateJobInput {
    jobName: string;
    configXml: string;
}
export declare const createJob: (client: JenkinsClient, input: CreateJobInput) => Promise<{
    jobName: string;
    created: boolean;
}>;
//# sourceMappingURL=create-job.d.ts.map