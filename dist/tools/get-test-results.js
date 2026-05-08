export const getTestResults = async (client, input) => {
    return client.getTestResults(input.jobName, input.buildNumber, {
        includePassing: input.includePassing,
    });
};
//# sourceMappingURL=get-test-results.js.map