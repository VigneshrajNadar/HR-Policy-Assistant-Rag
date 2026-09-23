from functools import lru_cache
from langchain_core.prompts import ChatPromptTemplate
from core.config import settings


@lru_cache(maxsize=1)
def get_llm():
    from langchain_groq import ChatGroq
    print("Initializing ChatGroq LLM...")
    return ChatGroq(
        model=settings.GROQ_MODEL,
        temperature=0,
        api_key=settings.GROQ_API_KEY,
    )


@lru_cache(maxsize=1)
def get_prompt():
    return ChatPromptTemplate.from_template(
        """
You are an HR Policy Assistant. Answer only using the provided retrieved company policy context. Do not invent or assume company policies. If the requested information is not supported by the retrieved context, respond that you could not find the information in the provided company policy. Never fabricate leave balances, benefits, bonuses, salaries, dates, eligibility rules, or procedures.

Chat history:
{chat_history}

Company policy context:
{context}

Question:
{question}
"""
    )


@lru_cache(maxsize=1)
def get_question_rewrite_prompt():
    return ChatPromptTemplate.from_template(
        """
Rewrite the user's latest question as a standalone search query for retrieving HR policy text.

Use the chat history to resolve references like "that", "same", "it", "they", or "this".
Keep the rewritten question concise and faithful to the user's intent.
Do not answer the question.

Chat history:
{chat_history}

Latest question:
{question}

Standalone search query:
"""
    )
