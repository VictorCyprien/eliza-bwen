import { Action, composeContext, elizaLogger, generateObject, HandlerCallback, IAgentRuntime, Memory, ModelClass, ServiceType, State } from "@elizaos/core";
import { AwsS3Service } from "@elizaos/plugin-node";
import { getFileLocationTemplate } from "../../packages/plugin-node/src/templates";
import { FileLocationResultSchema, isFileLocationResult } from "../../packages/plugin-node/src/types";

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
    handler: async (runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Getting image...")

        const getFileLocationContext = composeContext({
            state,
            template: getFileLocationTemplate,
        });
        const fileLocationResultObject = await generateObject({
            runtime,
            context: getFileLocationContext,
            modelClass: ModelClass.SMALL,
            schema: FileLocationResultSchema,
            stop: ["\n"],
        });
        if (!isFileLocationResult(fileLocationResultObject?.object)) {
            elizaLogger.error("Failed to generate file location");
            return false;
        }

        const { fileLocation } = fileLocationResultObject.object;

        elizaLogger.log("Uploading file to database...")
        const awsS3Service: AwsS3Service = runtime.getService(ServiceType.AWS_S3);

        try {
            const test = await awsS3Service.uploadFile(
                fileLocation,
                state.userId,
                false
            )
            elizaLogger.log("Done !")
            elizaLogger.log(test.error)
            elizaLogger.log(test.success)
            elizaLogger.log(test.url)
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


export const uploadFileOnInstagram: Action = {
    name: "UPLOAD_FILE_ON_INSTAGRAM",
    similes: [
        "ADD_FILE_ON_INSTAGRAM",
        "CREATE_IMAGE_ON_INSTAGRAM"
    ],
    description: "Upload an image into Instagram",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const instagramUsernameOk = !!runtime.getSetting("INSTAGRAM_USERNAME");
        const instagramPasswordOk = !!runtime.getSetting("INSTAGRAM_PASSWORD");
        const instagramAppIdOk = !!runtime.getSetting("INSTAGRAM_APP_ID");
        const instagramAppSecretOk = !!runtime.getSetting("INSTAGRAM_APP_SECRET");

        return (
            instagramUsernameOk ||
            instagramPasswordOk ||
            instagramAppIdOk ||
            instagramAppSecretOk
        );
    },
    handler: async (runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Getting image...")

        const getFileLocationContext = composeContext({
            state,
            template: getFileLocationTemplate,
        });
        const fileLocationResultObject = await generateObject({
            runtime,
            context: getFileLocationContext,
            modelClass: ModelClass.SMALL,
            schema: FileLocationResultSchema,
            stop: ["\n"],
        });
        if (!isFileLocationResult(fileLocationResultObject?.object)) {
            elizaLogger.error("Failed to generate file location");
            return false;
        }

        const { fileLocation } = fileLocationResultObject.object;

        elizaLogger.log("Uploading file to instagram...")

        const instagramManager: Record<string, any> = await runtime.clients.instagram
        await instagramManager.post.createPost({
            media: [{
              type: 'IMAGE',
              url: fileLocation
            }],
            caption: 'This post has been generated by ElizaOS <3'
        });
        elizaLogger.log("Post send to Instagram !")

        return true
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Upload a file on my Instagram Page" },
            },
            {
                user: "{{agentName}}",
                content: { text: "I'm uploading your file to your Instagram", action: "UPLOAD_FILE_ON_INSTAGRAM" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Upload file Instagram" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Successfully uploading your file to your Instagram page",
                    action: "UPLOAD_FILE_ON_INSTAGRAM",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Can you upload a file on my Instagram ?" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'm uploading you file into your Instagram",
                    action: "UPLOAD_FILE_ON_INSTAGRAM",
                },
            },
        ]
    ],
};
