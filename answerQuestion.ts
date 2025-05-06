import { Action, IAgentRuntime, Memory } from "@ai16z/eliza";
import fs from "fs/promises";
import path from "path";

export const answerQuestion: Action = {
    name: "ANSWERQUESTION",
    similes: ["ANSWER", "QUESTION", "RESPOND"],
    description: "Use this action if the user has asked a question that can be answered by the project's website content stored in a JSON dataset.",

    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const content = message.content?.text || "";
        return content.trim().endsWith("?"); // Simple validation: ends with '?'
    },

    handler: async (runtime: IAgentRuntime, message: Memory) => {
        try {
            const datasetPath = path.resolve("data/dataset_website-content-crawler_2025-04-21_19-46-47-189.json");
            const file = await fs.readFile(datasetPath, "utf-8");
            const data = JSON.parse(file);

            const question = message.content?.text || "";
            let bestMatch = null;
            let bestScore = 0;

            for (const item of data) {
                const text = item.text?.toLowerCase() || "";
                const score = question.toLowerCase().split(" ").reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);

                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = item;
                }
            }

            if (bestMatch?.text) {
                return {
                    text: bestMatch.text,
                };
            } else {
                return {
                    text: "I'm not sure how to answer that right now, but I'll keep learning!",
                };
            }
        } catch (error) {
            console.error("Error reading dataset:", error);
            return {
                text: "Oops! I had trouble accessing the information I need to answer that.",
            };
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What is the Chiroos project about?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "The Chiroos project is focused on...",
                    action: "ANSWERQUESTION",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you explain how $CHI is earned?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "$CHI can be earned through...",
                    action: "ANSWERQUESTION",
                },
            },
        ],
    ],
};
