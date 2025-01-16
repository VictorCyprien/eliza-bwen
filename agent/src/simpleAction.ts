import { Action, elizaLogger, IAgentRuntime, Memory, ServiceType, State } from "@elizaos/core";
import { AwsS3Service } from "@elizaos/plugin-node";

export const uploadFileOnS3: Action = {
    name: "UPLOAD_FILE_ON_S3",
    similes: [
        "ADD_FILE_ON_S3",
        "CREATE_IMAGE_ON_S3"
    ],
    description: "Upload an document into a S3 Database",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const awsAccessKeyIdOk = !!runtime.getSetting("AWS_ACCESS_KEY_ID");
        const awsSecretAccessKeyOk = !!runtime.getSetting(
            "AWS_SECRET_ACCESS_KEY"
        );
        const awsRegionOk = !!runtime.getSetting("AWS_REGION");
        const awsS3BucketOk = !!runtime.getSetting("AWS_S3_BUCKET");
        const awsS3EndpointOk = !!runtime.getSetting("AWS_S3_ENDPOINT");

        return (
            awsAccessKeyIdOk ||
            awsSecretAccessKeyOk ||
            awsRegionOk ||
            awsS3BucketOk ||
            awsS3EndpointOk
        );
    },
    handler: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("Uploading file to database...")

        const awsS3Service: AwsS3Service = runtime.getService(ServiceType.AWS_S3);

        try {
            await awsS3Service.uploadFile(
                "agent/generatedImages/generated_1736931688584_0.png",
                "my_folder",
                false
            )
            elizaLogger.log("Done !")
        } catch (e: any) {
            console.log(e);
            throw e;
        }

    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Upload a file on my S3 database" },
            },
            {
                user: "{{agentName}}",
                content: { text: "I'm uploading your file to a S3 database", action: "UPLOAD_FILE_ON_S3" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Upload file S3" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Successfully uploading your file to a S3 database",
                    action: "UPLOAD_FILE_ON_S3",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Can you upload a file on my S3 database ?" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'm uploading you file into your S3 database",
                    action: "UPLOAD_FILE_ON_S3",
                },
            },
        ]
    ],
};
