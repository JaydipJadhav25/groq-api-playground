import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env["GROQ_API_KEY"] });

async function main() {
  const competion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `you are smart personal assistent.
                  who answers tha askes questions. you give propely answer in simple way.
                  you have access to follwing tool:
                  webSearch({query :string }) // serach the leastes information and real time data on internet.

                  `,
      },
      {
        role: "user",
        // content : "when was iphone 17 launched?"
        content: "when was iphone 17 launched?",
      },
    ],

    tools: [
      {
        type: "function",
        function: {
          name: "webSearch",
          description: "serach the leastes information and real time data on internet.",
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
    tool_choice : 'auto'
  });
  
  //get any tool call request from model
  const toolCalls = competion.choices[0].message.tool_calls;


  //check if not tool call so model genrate final output and return
   if(!toolCalls){
    console.log("Output :");
    console.log(`Assistant : ${competion.choices[0].message.content}`);
    return;
  }

  //this section called tool
  for(const tool of toolCalls){
    // console.log(tool)
    const functionName = tool.function.name;
    const query = tool.function.arguments;
    console.log(functionName , query);

    if (functionName === 'webSearch') {
      const toolResult =   await  webSearch(JSON.parse(query));
      console.log("toolResult : " , toolResult);
    }
  }





  //   console.log(JSON.parse(competion.choices[0].message))
//   console.log(competion.choices[0].message);
  // console.log(JSON.stringify(competion.choices[0].message , null , 2))
}

main();

//to search on web function
async function webSearch({ query }) {
  // console.log("wesearch : " , query);
  console.log("calling tool................");
  return "The iPhone 17 lineup was officially announced by Apple on September 9, 2025,";
}
