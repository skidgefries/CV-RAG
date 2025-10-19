from preprocess import process_folder
from build_index import load_chunks, build_index
from server import query, QueryRequest

process_folder('resume-dataset', 'output_file.jsonl')
chunks = load_chunks('output_file.jsonl')
build_index("sentence-transformers/all-MiniLM-L6-v2", chunks, 'index_file.faiss', 'meta_file.pkl')

sample_query = "Who is good at DevOps?"
response = query(QueryRequest(query=sample_query, top_k=3))
print("Query:", response["query"])
print("Answer:", response["answer"])
print("\nRetrieved Chunks:")
for item in response["retrieved"]:
    print(f"- Source: {item['source_file']}, Score: {item['score']:.4f}, Text: {item['text'][:200]}...") # Print first 200 chars
