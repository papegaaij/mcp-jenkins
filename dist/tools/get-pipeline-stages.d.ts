import { JenkinsClient } from '../lib/jenkins-client.js';
export interface GetPipelineStagesInput {
    jobName: string;
    buildNumber: number;
}
export declare const getPipelineStages: (client: JenkinsClient, input: GetPipelineStagesInput) => Promise<any>;
//# sourceMappingURL=get-pipeline-stages.d.ts.map