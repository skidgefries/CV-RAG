import argparse
import json
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle
from tqdm import tqdm

def load_chunks(jsonl_file):
    docs = []
    with open(jsonl_file, "r", encoding="utf-8") as f:
        for line in f:
            docs.append(json.loads(line))
    return docs

def build_index(model_name, chunks, index_file, meta_file, batch_size=64):
    model = SentenceTransformer(model_name)
    texts = [c["text"] for c in chunks]
    # compute embeddings in batches
    all_emb = []
    for i in tqdm(range(0, len(texts), batch_size)):
        batch = texts[i:i+batch_size]
        emb = model.encode(batch, show_progress_bar=False, convert_to_numpy=True)
        all_emb.append(emb)
    embeddings = np.vstack(all_emb).astype("float32")
    d = embeddings.shape[1]
    index = faiss.IndexFlatIP(d)  # cosine with normalized vectors OR use IndexHNSWFlat for speed
    # normalize for cosine similarity
    faiss.normalize_L2(embeddings)
    index.add(embeddings)
    faiss.write_index(index, index_file)
    # store metadata mapping index -> chunk
    with open(meta_file, "wb") as f:
        pickle.dump(chunks, f)
    print(f"Index with {index.ntotal} vectors saved to {index_file} and meta saved to {meta_file}")

