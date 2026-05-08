export const getBuildStatus = async (client, input) => {
    return client.getBuild(input.jobName, input.buildNumber);
};
//# sourceMappingURL=get-build-status.js.map