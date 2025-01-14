import { Action, IAgentRuntime, Memory } from "@ai16z/eliza";

export const hostLobby: Action = {
    name: "HOSTLOBBY",
    similes: ["HOST", "LOBBY"],
    description: "Call this action if the user has requested you to open a lobby, either directly or indirectly, or if they requested to play a game, or if they are unsure about what they can do it Nifty Island.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // Validation logic
        return true;
    },
    handler: async (runtime: IAgentRuntime, message: Memory) => {
        // Implementation logic
        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "{{user2}}, I'm bored, got anything I can do?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Of course, want to try playing this play ground game?",
                    action: "HOSTLOBBY",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "hey {{user2}} got any games I can play?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Sure, I'll open up a lobby for you!",
                    action: "HOSTLOBBY",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "hey {{user2}} can you start a lobby for me?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Sure thing, I'm on it",
                    action: "HOSTLOBBY",
                },
            },
        ],
    ],
};