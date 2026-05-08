import { JenkinsClient } from '../lib/jenkins-client.js';
export interface ReplayBuildInput {
    jobName: string;
    buildNumber: number;
}
export declare const replayBuild: (client: JenkinsClient, input: ReplayBuildInput) => Promise<{
    jobName: string;
    buildNumber: number;
    queueUrl: string | null;
}>;
//# sourceMappingURL=replay-build.d.ts.map