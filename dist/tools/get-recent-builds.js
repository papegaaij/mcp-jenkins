export const getRecentBuilds = async (client, input) => {
    return client.getRecentBuilds(input.jobName, input.limit ?? 5);
};
//# sourceMappingURL=get-recent-builds.js.map