import { JenkinsClient } from "../lib/jenkins-client.js";
export interface CopyJobInput {
    fromName: string;
    newName: string;
}
export declare const copyJob: (client: JenkinsClient, input: CopyJobInput) => Promise<{
    fromName: string;
    newName: string;
    copied: boolean;
}>;
//# sourceMappingURL=copy-job.d.ts.map