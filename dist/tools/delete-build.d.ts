import { JenkinsClient } from '../lib/jenkins-client.js';
export interface DeleteBuildInput {
    jobName: string;
    buildNumber: number;
}
export declare const deleteBuild: (client: JenkinsClient, input: DeleteBuildInput) => Promise<{
    jobName: string;
    buildNumber: number;
    deleted: boolean;
}>;
//# sourceMappingURL=delete-build.d.ts.map