import { JenkinsClient } from '../lib/jenkins-client.js';

export interface GetTestResultsInput {
  jobName: string;
  buildNumber: number;
  includePassing?: boolean;
}

export const getTestResults = async (client: JenkinsClient, input: GetTestResultsInput) => {
  return client.getTestResults(input.jobName, input.buildNumber, {
    includePassing: input.includePassing,
  });
};
