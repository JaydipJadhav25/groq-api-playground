import dotenv from "dotenv"
dotenv.config();
import {tavily} from "@tavily/core"

export const tvly = tavily({
    apiKey : process.env.TAVILY_API_KEY
});


async function main() {
    const response = await tvly.search("Who is Leo Messi?");
    console.log(response);
}
main();