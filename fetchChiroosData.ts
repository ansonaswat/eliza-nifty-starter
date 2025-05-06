import { Action, IAgentRuntime, Memory } from "@ai16z/eliza";

export const fetchChiroosData: Action = {
    name: "FETCHCHIROOSDATA",
    similes: ["CHIROOSINFO", "GETCHIROOSDATA", "CHIROOSPROJECT"],
    description: "Call this action if the user asks for information about the Chiroos Project, NFT collection, meme coin, or anything related to Chiroos. The action fetches live data from the Chiroos project dataset on Apify.",

    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const text = message.content?.text?.toLowerCase() || "";
        return text.includes("chiroos") || text.includes("$chi") || text.includes("meme coin");
    },

    handler: async (runtime: IAgentRuntime, message: Memory) => {
        try {
            const response = await fetch(
                "https://api.apify.com/v2/datasets/KgYYi2TYpfbUerNJW/items?clean=true&format=json"
            );
            const data = await response.json();

            // Customize the response based on the dataset format
            const summary = Array.isArray(data) && data.length > 0
                ? `Here's something from the Chiroos Project:\n\n${data[0].summary || JSON.stringify(data[0], null, 2)}`
                : "I fetched the data, but it seems to be empty.";

            return {
                text: summary,
            };
        } catch (error) {
            console.error("Failed to fetch Chiroos data:", error);
            return {
                text: "Sorry, I couldn't get the Chiroos Project info right now. Please try again later.",
            };
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Hey {{user2}}, what's new with the Chiroos project?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Let me check the latest data for you.",
                    action: "FETCHCHIROOSDATA",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Do you have any info on the Chiroos NFT collection?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Sure! Let me fetch the latest details.",
                    action: "FETCHCHIROOSDATA",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What is the current status of the $CHI meme coin?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Let me pull the live Chiroos dataset for you.",
                    action: "FETCHCHIROOSDATA",
                },
            },
        ],
    ],
};
