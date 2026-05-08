import { JenkinsClient } from '../lib/jenkins-client.js';
export interface GetTestCaseInput {
    jobName: string;
    buildNumber: number;
    className: string;
    caseName: string;
}
export declare const getTestCase: (client: JenkinsClient, input: GetTestCaseInput) => Promise<any>;
//# sourceMappingURL=get-test-case.d.ts.map