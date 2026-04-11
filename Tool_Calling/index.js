import dotenv from "dotenv"
dotenv.config();
import Groq from 'groq-sdk';



const groq = new Groq({apiKey: process.env['GROQ_API_KEY']});



async function main() {
  const competion = await groq.chat.completions.create({
        model : 'llama-3.3-70b-versatile',
        temperature : 0,
        messages :[
            {
                role : 'system',
                content : `you are smart personal assistent ,  who answers tha askes questions. you give propely answer in simple way`

            },
            {
                role: "user",
                // content : "when was iphone 17 launched?"
                content : "what is wheather today of pune?"
            }
        ]
    });


    console.log(competion.choices[0].message.content);
    // console.log(JSON.parse(competion.choices[0].message))
}


main();


