export const stopBuild = async (client, input) => {
    return client.stopBuild(input.jobName, input.buildNumber);
};
//# sourceMappingURL=stop-build.js.map