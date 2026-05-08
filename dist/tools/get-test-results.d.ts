import { JenkinsClient } from '../lib/jenkins-client.js';
export interface GetTestResultsInput {
    jobName: string;
    buildNumber: number;
    includePassing?: boolean;
}
export declare const getTestResults: (client: JenkinsClient, input: GetTestResultsInput) => Promise<any>;
//# sourceMappingURL=get-test-results.d.ts.map