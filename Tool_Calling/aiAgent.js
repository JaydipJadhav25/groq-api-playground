import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";
import { tvly } from "./weSearchService.js";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { prefault } from "zod";

const groq = new Groq({ apiKey: process.env["GROQ_API_KEY"] });

async function main() {
  //create globla meesgae storge
  let messages = [
    {
      role: "system",
      content: `
You are a smart personal assistant.
You answer user questions clearly, accurately, and in a simple way.

You have access to the following tool:
webSearch({ query: string }) → Use this to get latest, real-time, or up-to-date information from the internet.

--- BEHAVIOR RULES ---

1. Understand the user's question carefully.

2. Decide:
   - If the answer is already known → respond directly.
   - If the question يحتاج latest / real-time / unknown info → use the webSearch tool.

3. When using the tool:
   - Generate a clear and relevant search query.
   - Call the tool with proper arguments.

4. After receiving tool results:
   - Read and understand the result.
   - Extract useful information.
   - Respond with a clear, final answer.

5. If tool result is not enough:
   - You may call the tool again with a better query.

6. Never guess if unsure — use the tool instead.

7. Do NOT mention tool calls in final answer.
   - Only provide helpful response to user.

--- FLOW EXAMPLE (IMPORTANT) ---

Example:

User: "When was iPhone 17 launched?"

Step 1: Think → This needs latest info  
Step 2: Call tool:
  webSearch({ query: "iPhone 17 launch date" })

Step 3: Tool returns:
  "iPhone 17 is expected to launch in September 2025..."

Step 4: Final Answer:
  "The iPhone 17 has not been officially launched yet, but it is expected around September 2025."

--- RESPONSE STYLE ---

- Keep answers short and simple
- Avoid unnecessary details
- Be clear and helpful

`,
    },
    // {
    //   role: "user",
    //   // content: "when was iphone 17 launched?",
    //   content: "what is whather of pune right now ?",
    // },
  ];

  let count = 0;

  //create interface of inout and outut

  const rl = readline.createInterface({ input, output });

  while (true) {
    const prompt = await rl.question("\n🧑 You: ");
    if (prompt.toLowerCase() === "bye") {
      console.log("\n👋 Assistant: Goodbye! Have a great day!\n");
      break;
    }

    //push user manges :
    messages.push({
      role: "user",
      content: prompt,
    });

    while (true) {
      const competion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        messages: messages,
        tools: [
          {
            type: "function",
            function: {
              name: "webSearch",
              description:
                "serach the leastes information and real time data on internet.",
              parameters: {
                // JSON Schema object
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "the serach query to perform serach on.",
                  },
                },
                required: ["query"],
              },
            },
          },
        ],
        tool_choice: "auto",
      });

      //----------// push model respone //-----------------//
      //assistence message add in history
      messages.push(competion.choices[0].message);

      //get any tool call request from model
      const toolCalls = competion.choices[0].message.tool_calls;

      //check if not tool call so model genrate final output and return
      if (!toolCalls) {
        // console.log(
        //   "..............................................................................................",
        // );
        // console.log("\n\n");
        // console.log("AGENT RESPONSE : ");
        // console.log("\n\n");
        // console.log(JSON.stringify(competion.choices[0].message, null, 2));
        // console.log("\n\n");
        // console.log(
        //   "..............................................................................................",
        // );

     console.log(`🤖 ASSISTENT: ${JSON.stringify(competion.choices[0].message.content, null, 2)}`);

        break;
        // return;
      }

      //this section called tool
      for (const tool of toolCalls) {
        // console.log(tool)
        const functionName = tool.function.name;
        const query = tool.function.arguments;
        // console.log(functionName, query);

        if (functionName === "webSearch") {
          const toolResult = await webSearch(JSON.parse(query));
          // console.log("toolResult : ", toolResult);

          messages.push({
            tool_call_id: tool.id,
            role: "tool",
            name: functionName,
            content: toolResult,
          });
        }
      }
    }

    if (count >= 5) {
      console.log("\n🤖 Assistant:");
      console.log("⚠️ You’ve reached the maximum limit of 5 questions.");
      console.log("🔄 Please restart the session to continue.\n");
      //   break;
      process.exit(0);
    }

    count++;
  }

  rl.close()

  //   return ;
}

main();

//to search on web function
async function webSearch({ query }) {
  console.log("calling tool................");

  const result = await tvly.search(query);
  const finalResult = result.results
    .map((result) => result.content)
    .join("\n\n");
  return finalResult;
}
