import os
import json
from typing import TypedDict
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# --- THE STABLE MODEL CONFIG ---
# Using 2.0-flash often solves the 404 issues seen in 1.5-flash on new accounts
# Update this block in main.py
# The 2026 stable free model
# Updated LLM block in main.py
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite", # Let's go back to 2.0-flash now that we've fixed the imports
    google_api_key=api_key,
    temperature=0.1,
    max_retries=3
)

class AgentState(TypedDict):
    source_material: str
    fact_sheet: str
    final_outputs: dict

def fact_checker_node(state: AgentState):
    res = llm.invoke([
        SystemMessage(content="You are a meticulous Fact-Checker. Create a Markdown Fact-Sheet."),
        HumanMessage(content=state["source_material"])
    ])
    return {"fact_sheet": res.content}

def copywriter_node(state: AgentState):
    # We force the model to be very strict with JSON
    res = llm.invoke([
        SystemMessage(content="Return ONLY JSON with keys: blog_post, social_thread, email_teaser."),
        HumanMessage(content=f"Facts: {state['fact_sheet']}")
    ])
    
    # Cleaning the response
    txt = res.content.replace("```json", "").replace("```", "").strip()
    try:
        return {"final_outputs": json.loads(txt)}
    except:
        return {"final_outputs": {"blog_post": txt, "social_thread": "", "email_teaser": ""}}

# --- GRAPH ---
builder = StateGraph(AgentState)
builder.add_node("fact_checker", fact_checker_node)
builder.add_node("copywriter", copywriter_node)
builder.set_entry_point("fact_checker")
builder.add_edge("fact_checker", "copywriter")
builder.add_edge("copywriter", END)
graph = builder.compile()

# --- APP ---
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class DocReq(BaseModel):
    content: str

@app.post("/api/process-document")
async def process(payload: DocReq):
    try:
        # This is the actual execution
        result = graph.invoke({"source_material": payload.content})
        return {
            "fact_sheet": result.get("fact_sheet"),
            "blog_post": result["final_outputs"].get("blog_post"),
            "social_thread": result["final_outputs"].get("social_thread"),
            "email_teaser": result["final_outputs"].get("email_teaser"),
        }
    except Exception as e:
        # This will print the EXACT error in your terminal if it fails
        print(f"!!! DEBUG ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)