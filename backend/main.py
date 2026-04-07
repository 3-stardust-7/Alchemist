import os
import json
from typing import TypedDict, List
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage

from database import Base, engine, get_db
from models import Campaign
from schemas import DocReq, CampaignResponse, CampaignSummary

load_dotenv()

# Create all tables on startup
Base.metadata.create_all(bind=engine)

api_key = os.getenv("GEMINI_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
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
    res = llm.invoke([
        SystemMessage(content="Return ONLY JSON with keys: blog_post, social_thread, email_teaser."),
        HumanMessage(content=f"Facts: {state['fact_sheet']}")
    ])
    txt = res.content.replace("```json", "").replace("```", "").strip()
    try:
        return {"final_outputs": json.loads(txt)}
    except:
        return {"final_outputs": {"blog_post": txt, "social_thread": "", "email_teaser": ""}}

builder = StateGraph(AgentState)
builder.add_node("fact_checker", fact_checker_node)
builder.add_node("copywriter", copywriter_node)
builder.set_entry_point("fact_checker")
builder.add_edge("fact_checker", "copywriter")
builder.add_edge("copywriter", END)
graph = builder.compile()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/process-document", response_model=CampaignResponse)
async def process(payload: DocReq, db: Session = Depends(get_db)):
    try:
        result = graph.invoke({"source_material": payload.content})

        fact_sheet = result.get("fact_sheet")
        blog_post = result["final_outputs"].get("blog_post")
        social_thread = result["final_outputs"].get("social_thread")
        email_teaser = result["final_outputs"].get("email_teaser")

        # Persist to DB
        campaign = Campaign(
            source_content=payload.content,
            fact_sheet=fact_sheet,
            blog_post=blog_post if isinstance(blog_post, str) else json.dumps(blog_post),  # ← add this guard
            social_thread=json.dumps(social_thread) if not isinstance(social_thread, str) else social_thread,
            email_teaser=email_teaser if isinstance(email_teaser, str) else json.dumps(email_teaser),
        )
        db.add(campaign)
        db.commit()
        db.refresh(campaign)

        return campaign

    except Exception as e:
        print(f"!!! DEBUG ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/history", response_model=List[CampaignSummary])
def get_history(db: Session = Depends(get_db)):
    campaigns = db.query(Campaign).order_by(Campaign.created_at.desc()).limit(50).all()
    return [
        CampaignSummary(
            id=c.id,
            source_preview=c.source_content[:120],
            created_at=c.created_at,
        )
        for c in campaigns
    ]


@app.get("/api/history/{campaign_id}", response_model=CampaignResponse)
def get_campaign(campaign_id: int, db: Session = Depends(get_db)):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign