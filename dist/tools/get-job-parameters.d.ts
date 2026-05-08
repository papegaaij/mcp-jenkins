import { JenkinsClient } from "../lib/jenkins-client.js";
export interface GetJobParametersInput {
    jobName: string;
}
export declare const getJobParameters: (client: JenkinsClient, input: GetJobParametersInput) => Promise<{
    jobName: string;
    parameters: {
        name: string;
        type: string;
        description: string;
        defaultValue: any;
        choices?: string[];
    }[];
}>;
//# sourceMappingURL=get-job-parameters.d.ts.map