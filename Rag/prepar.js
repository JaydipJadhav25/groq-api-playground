import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";

export async function indexDocuments(fileName) {
     
    const filePath = path.resolve(fileName);
    const loader = new PDFLoader(filePath , { splitPages : false});
    // const docs = await loader.load();
    const doc = await loader.load();
    console.log(doc[0].pageContent);
}
