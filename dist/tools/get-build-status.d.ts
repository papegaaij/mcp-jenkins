import { JenkinsClient } from '../lib/jenkins-client.js';
export interface GetBuildStatusInput {
    jobName: string;
    buildNumber: number;
}
export declare const getBuildStatus: (client: JenkinsClient, input: GetBuildStatusInput) => Promise<import("../lib/jenkins-client.js").NormalizedBuild>;
//# sourceMappingURL=get-build-status.d.ts.map