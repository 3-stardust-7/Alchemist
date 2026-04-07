from sqlalchemy import Column, Integer, Text, DateTime, func
from database import Base

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    source_content = Column(Text, nullable=False)
    fact_sheet = Column(Text, nullable=True)
    blog_post = Column(Text, nullable=True)
    social_thread = Column(Text, nullable=True)
    email_teaser = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())