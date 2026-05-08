import { JenkinsClient } from '../lib/jenkins-client.js';
export interface TriggerBuildInput {
    jobName: string;
    params?: Record<string, any>;
}
export declare const triggerBuild: (client: JenkinsClient, input: TriggerBuildInput) => Promise<{
    jobName: string;
    queueUrl: string | null;
}>;
//# sourceMappingURL=trigger-build.d.ts.map