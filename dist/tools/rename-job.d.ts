import { JenkinsClient } from "../lib/jenkins-client.js";
export interface RenameJobInput {
    jobName: string;
    newName: string;
}
export declare const renameJob: (client: JenkinsClient, input: RenameJobInput) => Promise<{
    oldName: string;
    newName: string;
    renamed: boolean;
}>;
//# sourceMappingURL=rename-job.d.ts.map