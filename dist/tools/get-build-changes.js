export const getBuildChanges = async (client, input) => {
    return client.getBuildChanges(input.jobName, input.buildNumber);
};
//# sourceMappingURL=get-build-changes.js.map