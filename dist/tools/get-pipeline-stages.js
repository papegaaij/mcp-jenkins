export const getPipelineStages = async (client, input) => {
    return client.getPipelineStages(input.jobName, input.buildNumber);
};
//# sourceMappingURL=get-pipeline-stages.js.map