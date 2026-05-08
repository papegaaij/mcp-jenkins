import { JenkinsClient } from '../lib/jenkins-client.js';
export interface GetConsoleLogInput {
    jobName: string;
    buildNumber?: number;
    maxSnippetLength?: number;
}
export declare const getConsoleLog: (client: JenkinsClient, input: GetConsoleLogInput) => Promise<{
    jobName: string;
    buildNumber: number;
    logSnippet: string;
    fullLog: string;
}>;
//# sourceMappingURL=get-console-log.d.ts.map