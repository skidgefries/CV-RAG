# server.py
import faiss
import pickle
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from generator import Generator
from typing import List
import uvicorn
import os # Import os for accessing environment variables


INDEX_FILE = "index_file.faiss"
META_FILE = "meta_file.pkl"
EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"



class QueryRequest(BaseModel):
    query: str
    top_k: int = 5


def query(req: QueryRequest):
    # Load index and metadata
    index = faiss.read_index(INDEX_FILE)
    with open(META_FILE, "rb") as f:
        metadata = pickle.load(f)  # list of chunk dicts

    embed_model = SentenceTransformer(EMBED_MODEL)
    # Initialize the Generator with an OpenAI model name
    generator = Generator(model_name="gpt-4.1-mini")

    q = req.query
    top_k = req.top_k
    q_emb = embed_model.encode([q], convert_to_numpy=True).astype("float32")
    faiss.normalize_L2(q_emb)
    D, I = index.search(q_emb, top_k)
    results = []
    contexts = []
    for score, idx in zip(D[0], I[0]):
        if idx < 0:
            continue
        meta = metadata[idx]
        results.append({"id": meta["id"], "source_file": meta["source_file"], "score": float(score), "text": meta["text"]})
        contexts.append(meta["text"])
    # generate answer
    answer = generator.generate(q, contexts)
    return {
        "query": q,
        "answer": answer,
        "retrieved": results
    }
