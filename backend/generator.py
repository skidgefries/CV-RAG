import openai
import os
from dotenv import load_dotenv

load_dotenv()

class Generator:
    def __init__(self, model_name="gpt-4.1-nano"):
        self.model_name = model_name
        # Ensure OpenAI API key is set up in Colab secrets
        openai.api_key = os.getenv('API_KEY')
        if not openai.api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables. Please set it up in Colab secrets.")

    def generate(self, query: str, contexts: list, max_tokens=150, temperature=0.7):
        # Create a prompt that conditions on multiple contexts
        ctx_text = "\n\n".join([f"Context {i+1}: {c}" for i, c in enumerate(contexts)])
        prompt = f"Answer the question using the contexts below. If the answer is not in the contexts, say 'Not found'.\n\nQuestion: {query}\n\n{ctx_text}\n\nAnswer:"

        try:
            response = openai.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that answers questions based on provided context."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens,
                temperature=temperature,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return "Error generating response."
