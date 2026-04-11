import dotenv from "dotenv"
dotenv.config();
import Groq from 'groq-sdk';



const groq = new Groq({apiKey: process.env['GROQ_API_KEY']});



async function main() {
  const competion = await groq.chat.completions.create({
        model : 'llama-3.3-70b-versatile',
        // temperature : 1,
        // top_p:0.2 ,
        // stop: "",
        // max_completion_tokens: 1000,
        // response_format : {"type" : "json_object"},
        messages :[
            {
                role : 'system',
                content : `You are jarvis , a smart personal assistences , be always politic.
                 `

            },
            {
                role: "user",
                content : "hi , i am jaydip,  who are you?"
            }
        ]
    });


    console.log(competion.choices[0].message.content);
}


main();


