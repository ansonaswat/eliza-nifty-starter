# eliza-nifty-starter

### Overview
ai16z has quickly become one of the most popular and powerful agentic creation frameworks.

The repository can be found [here](https://github.com/gtspencer/eliza-starter-nifty-action-example), and is a forked version of the elizaOS starter, but this tutorial will walk through the setup from scratch.

## Quick start
Clone the [elizaOS starter](https://github.com/elizaOS/eliza-starter) from the Eliza github account.  This is a lightweight, packaged version of the [Eliza source code](https://github.com/elizaOS/eliza).

Navigate to `/characters` to view example characters; create your own or use a pre-made character.

Setup environment variables by copying the example `.env` file (`cp .env.example .env`), and setting the relevant values.

Run `pnpm i && pnpm start` to install dependencies, and start the agent.

Your agent is now running at `http://localhost:3000/${agentId}/message`.  You can interface with the agent locally, but in order for other players to be able to use your agent, you must deploy it using a platform like Vercel or Heroku.

Once deployed, you will have the endpoint with which you can interface with the agent remotely.  This will be the URL to input into Nifty when configuring your agent.

The response format that ai16z uses is already compatible with the Nifty agent standard.  No further work is needed to bring it in line with the standard.

## Actions
ai16z makes it exceedingly simple to create [new actions](https://elizaos.github.io/eliza/docs/core/actions/).  Below is an example action "HOSTLOBBY", which opens up a new lobby in Nifty Island.  It *does not* include implementation for action contexts, nor is it relatively robust; it merely serves as an example on how to implement a new action in ai16z.

The action is placed in its own file, titled `hostLobby.ts`.  It describes a `name`, which is the action string passed in the agent's response, followed by `similes`, which effectively act as action aliases.  Next, it describes a description that is passed to the agent as a prompt; this prompt should be descriptive and unambiguous.

#### Validate
Next is a validation method.  Implement logic here that the agent can run to determine if the action should be taken.  You can run validation logic on the user input, or call any external method to derive a boolean determining whether the action should run.

#### Handler
This is local agent implementation of the action.  If this action involves buying an asset off a marketplace, that logic would be included here.  Because `HOSTLOBBY` is an action that is handled within the Nifty ecosystem, no handler is necessary for this action.

#### Examples
Lastly, the action should include examples as natural language conversations between a user and the agent.  These serve as context for the agent to better understand when the action should be carried out.  The more examples the better; examples inform the agent in which scenarios the agent can take the specified action.

```ts
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
```

### Adding to the Agent
Place your action file in the `src` directory of the elizaOS starter.  In this example, an `actions` folder is created for organization.  At the top of the file, import the action with the line:

```ts
import { hostLobby } from "./actions/hostLobby.ts";
```

Then, in `src/index.ts`, navigate to the `createAgent()` method.  In the return object (`AgentRuntime`), add `hostLobby` to the `actions` array.  The code should look like this:

```ts
return new AgentRuntime({
    databaseAdapter: db,
    token,
    modelProvider: character.modelProvider,
    evaluators: [],
    character,
    plugins: [
      bootstrapPlugin,
      nodePlugin,
      character.settings.secrets?.WALLET_PUBLIC_KEY ? solanaPlugin : null,
    ].filter(Boolean),
    providers: [],
    actions: [hostLobby],
    services: [],
    managers: [],
    cacheManager: cache,
  });
```

And that's it!  Run the agent with `pnpm start` and ask the agent to open a lobby for you!

:::note

This implementation is a basic one; it does not account for action contexts (i.e. passing the name of the playground game to launch).  Feel free to modify this approach to include action contexts, or hard code a context if you want the agent to launch the same game every time!

:::

## Customizations
ai16z provides a solid framework for creating agents and actions.  Explore their [Eliza source code](https://github.com/elizaOS/eliza) to add new custom actions or modify your agent in any way.  These actions can be within the Nifty action space, or be an external action to be carried out locally by your agent.

## Troubleshooting
If you have trouble installing dependencies and running the agent, perform the following steps:
1. Remove the following packages from `package.json`
    - `"@elizaos/client-discord": "0.1.7"`
    - `"@elizaos/client-telegram": "0.1.7"`
    - `"@elizaos/client-twitter": "0.1.7"`

These packages are needed for Discord, Telegram, and Twitter integration, respectively.  Your agent may or may not need these; for the purposes of getting an Agent into Nifty, these are not needed (but may be nice to have if you want your agent to Tweet about your in-game actions)

2. Navigate to `src/clients/index.tx` and remove lines 2 to 4, and 19 to 31.  These lines help setup the Discord, Telegram, and Twitter interfaces.

:::warning

These packages are used for Discord, Telegram, and Twitter integrations.  If you wish to use these integrations alongside the Nifty integration, you *should not* delete these.

:::
