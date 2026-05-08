export const getArtifact = async (client, input) => {
    return client.getArtifact(input.jobName, input.buildNumber, input.relativePath);
};
//# sourceMappingURL=get-artifact.js.map