import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function indexDocuments(fileName) {
  const filePath = path.resolve(fileName);
  const loader = new PDFLoader(filePath, { splitPages: false });
  // const docs = await loader.load();
  const doc = await loader.load();
//   console.log(doc[0].pageContent);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const chunks = await splitter.splitText(doc[0].pageContent);


  console.log(chunks.length);
  console.log(chunks);
}
