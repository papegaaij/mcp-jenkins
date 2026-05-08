export const getTestCase = async (client, input) => {
    return client.getTestCase(input.jobName, input.buildNumber, input.className, input.caseName);
};
//# sourceMappingURL=get-test-case.js.map