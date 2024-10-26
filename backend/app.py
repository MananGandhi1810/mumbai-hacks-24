from flask import Flask, request
from flask_cors import CORS
from PyPDF2 import PdfReader

from langchain.text_splitter import RecursiveCharacterTextSplitter

import os
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms.cloudflare_workersai import CloudflareWorkersAI
from pytesseract import image_to_string
from pdf2image import convert_from_path
from cloudflare import Cloudflare

app = Flask(__name__)
CORS(app)

client = Cloudflare(api_token="API Token")

def get_pdf_text(pdf_docs):
    text_content = ""
    print(pdf_docs)
    for pdf in pdf_docs:
      txt = ""
      filename = os.path.join("tempDir",pdf.name)
      with open(filename,"wb") as f:
        f.write(pdf.getbuffer())
      images = convert_from_path(filename)
      print(len(images))
      progress = 0
      for image in images:
        print(progress)
        image = image.point(lambda x: 0 if x < 100 else 255)
        text = image_to_string(image)
        txt += text
        progress += 1
      with open(f"{pdf.name}.txt", "w") as f:
        f.write(txt)
      text_content += txt
    return text_content

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store(text_chunks):
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("./faiss_index")

def get_nearest_words(character, prompt):
  embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

  new_db = FAISS.load_local(
    "./faiss_index", embeddings, allow_dangerous_deserialization=True
  )

  info = new_db.similarity_search(f"{character}: {prompt}", k=2)
  content = "\n".join([x.page_content for x in info])
  return content

@app.post("/chat")
def chat():
  data = request.json
  print(data)
  character = data['character']
  prompt = data['prompt']
  history = data['history']
  content = get_nearest_words(character, prompt)
  qa_prompt = "Use the following pieces of context to answer the user's question. Use data from any tables you find as well."
  system_prompt = (
      f"You are {character}. I have shared related context that should help you talk like him. Behave like him, and only answer relevant question as if in a conversation. say no to answer the question if it is out of context"
      + qa_prompt + "\nContext:" + content
  )
  result = client.workers.ai.run(
    "@cf/meta/llama-3.1-8b-instruct" ,
    account_id="Account ID",
    messages=[
        {"role": "system", "content": system_prompt},
        *history,
        {"role": "user", "content": prompt}
    ],
    max_tokens=1024,
  )
  print([
        {"role": "system", "content": system_prompt},
        # *history,
        {"role": "user", "content": prompt}
    ])
  print(result)
  return result

if __name__ == "__main__":
  app.run(port=4000, debug=True)