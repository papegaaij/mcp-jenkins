export const listArtifacts = async (client, input) => {
    return client.listArtifacts(input.jobName, input.buildNumber);
};
//# sourceMappingURL=list-artifacts.js.map