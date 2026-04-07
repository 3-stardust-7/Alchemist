from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocReq(BaseModel):
    content: str
    source_type: Optional[str] = "text"

class CampaignResponse(BaseModel):
    id: int
    source_content: str
    fact_sheet: Optional[str]
    blog_post: Optional[str]
    social_thread: Optional[str]
    email_teaser: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class CampaignSummary(BaseModel):
    id: int
    # First 120 chars of source as a preview
    source_preview: str
    created_at: datetime

    class Config:
        from_attributes = True