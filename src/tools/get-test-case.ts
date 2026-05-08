import { JenkinsClient } from '../lib/jenkins-client.js';

export interface GetTestCaseInput {
  jobName: string;
  buildNumber: number;
  className: string;
  caseName: string;
}

export const getTestCase = async (client: JenkinsClient, input: GetTestCaseInput) => {
  return client.getTestCase(
    input.jobName,
    input.buildNumber,
    input.className,
    input.caseName,
  );
};
