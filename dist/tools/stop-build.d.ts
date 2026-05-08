import { JenkinsClient } from '../lib/jenkins-client.js';
export interface StopBuildInput {
    jobName: string;
    buildNumber: number;
}
export declare const stopBuild: (client: JenkinsClient, input: StopBuildInput) => Promise<{
    jobName: string;
    buildNumber: number;
    stopped: boolean;
}>;
//# sourceMappingURL=stop-build.d.ts.map