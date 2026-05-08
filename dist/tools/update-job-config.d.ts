import { JenkinsClient } from "../lib/jenkins-client.js";
export interface UpdateJobConfigInput {
    jobName: string;
    configXml: string;
}
export declare const updateJobConfig: (client: JenkinsClient, input: UpdateJobConfigInput) => Promise<{
    jobName: string;
    updated: boolean;
}>;
//# sourceMappingURL=update-job-config.d.ts.map