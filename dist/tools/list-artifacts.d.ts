import { JenkinsClient } from '../lib/jenkins-client.js';
export interface ListArtifactsInput {
    jobName: string;
    buildNumber: number;
}
export declare const listArtifacts: (client: JenkinsClient, input: ListArtifactsInput) => Promise<{
    fileName: string;
    relativePath: string;
    url: string;
    size?: number;
}[]>;
//# sourceMappingURL=list-artifacts.d.ts.map