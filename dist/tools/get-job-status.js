export const getJobStatus = async (client, input) => {
    const build = await client.getLastBuild(input.jobName);
    return build;
};
//# sourceMappingURL=get-job-status.js.map