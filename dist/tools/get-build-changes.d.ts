import { JenkinsClient } from '../lib/jenkins-client.js';
export interface GetBuildChangesInput {
    jobName: string;
    buildNumber: number;
}
export declare const getBuildChanges: (client: JenkinsClient, input: GetBuildChangesInput) => Promise<any>;
//# sourceMappingURL=get-build-changes.d.ts.map