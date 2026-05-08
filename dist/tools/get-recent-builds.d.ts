import { JenkinsClient, NormalizedBuild } from '../lib/jenkins-client.js';
export interface GetRecentBuildsInput {
    jobName: string;
    limit?: number;
}
export declare const getRecentBuilds: (client: JenkinsClient, input: GetRecentBuildsInput) => Promise<NormalizedBuild[]>;
//# sourceMappingURL=get-recent-builds.d.ts.map