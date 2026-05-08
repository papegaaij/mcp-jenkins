import { JenkinsClient } from '../lib/jenkins-client.js';
export interface GetVersionInput {
}
export declare const getVersion: (client: JenkinsClient, _input: GetVersionInput) => Promise<{
    version: string;
}>;
//# sourceMappingURL=get-version.d.ts.map