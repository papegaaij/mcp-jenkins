import { JenkinsClient } from '../lib/jenkins-client.js';
export interface GetArtifactInput {
    jobName: string;
    buildNumber: number;
    relativePath: string;
}
export declare const getArtifact: (client: JenkinsClient, input: GetArtifactInput) => Promise<{
    fileName: string;
    relativePath: string;
    size: number;
    base64: string;
}>;
//# sourceMappingURL=get-artifact.d.ts.map