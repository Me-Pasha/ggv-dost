import pymongo
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="GGV DOST API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite React
        "http://localhost:3000",   # React (optional)
        "https://admirable-faun-0e3c9a.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Request schema 
class QueryRequest(BaseModel):
    query: str

# Response schema
class QueryResponse(BaseModel):
    query: str
    answer: str

mongodb_user = os.getenv("MONGODB_USER")
mongodb_password = os.getenv("MONGODB_PASSWORD")
google_api_key = os.getenv("GOOGLE_API_KEY")
# Connect to MongoDB Atlas
mongodb_client = pymongo.MongoClient(f"mongodb+srv://{mongodb_user}:{mongodb_password}@cluster0.jt0ctfq.mongodb.net/?appName=Cluster0")

#initialize the gemini client
gemini_client = genai.Client(api_key=google_api_key)

def vector_search(user_input):
    #Converting to embeddings
    result = gemini_client.models.embed_content(
                    model="text-embedding-004", # 'text-embedding-004' is the current latest version
                    contents=user_input,
                    config=types.EmbedContentConfig(output_dimensionality=768)
                )

    queryVector = result.embeddings[0].values

    # Define the aggregation pipeline
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",          # your vector index name
                "path": "embeddings",             # vector field in documents
                "queryVector": queryVector,       # 768-d query embedding
                "numCandidates": 68,              # suitable for 68 documents
                "limit": 5                        # top 3 most similar results
            }
        },
        {
            "$project": {
                "_id": 0,
                "content": 1,                      # replace with your text field
                "score": { "$meta": "vectorSearchScore" }
            }
        }
    ]
    # performing the search using the embedded vector numerical
    results = mongodb_client["ggv_content"]["handpicked_sample"].aggregate(pipeline)
    return results


def answer_with_gemini(user_question: str, retrieved_docs: list):
    """
    user_question: str -> user's query
    retrieved_docs: list -> list of strings from vector search
    """

    # Combine retrieved documents into a single context
    context = "\n\n".join(
        [f"- {doc}" for doc in retrieved_docs]
    )

    # RAG prompt
    prompt = f"""
You are an intelligent university assistant chatbot.

Your task is to answer the user's question using ONLY the information provided in the context below.
If the answer is not present in the context, say:
"I don’t have enough information in the provided data to answer that."

Do NOT use outside knowledge.
Be clear, concise, and helpful.
If relevant, summarize points in bullet form.

====================
CONTEXT (retrieved from database):
{context}
====================

USER QUESTION:
{user_question}

ANSWER:
"""


    # Call Gemini 2.5 Flash
    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text


@app.get("/")
def health_dost():
    return {"status": "GGV DOST running"}

@app.post("/ask", response_model=QueryResponse)
def ask_dost(request: QueryRequest):
    user_input = request.query

    results = vector_search(user_input)
    answer = answer_with_gemini(user_input, results)

    return {
        "query": user_input,
        "answer": answer
    }
