export const deleteBuild = async (client, input) => {
    return client.deleteBuild(input.jobName, input.buildNumber);
};
//# sourceMappingURL=delete-build.js.map