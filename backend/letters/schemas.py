"""Pydantic schemas for request/response validation."""
from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
from uuid import UUID
from pydantic import BaseModel, Field, EmailStr


# Content Block Schemas
class ContentBlockData(BaseModel):
    """Base content block data."""
    block_type: Literal['text', 'image', 'rich_text']
    order: int = Field(ge=0)
    content: Dict[str, Any]


class TextBlockContent(BaseModel):
    """Text block content structure."""
    text: str


class ImageBlockContent(BaseModel):
    """Image block content structure."""
    url: str
    caption: Optional[str] = None


class RichTextBlockContent(BaseModel):
    """Rich text block content structure."""
    html: str


# LetterType Schemas
class LetterTypeBase(BaseModel):
    """Base letter type schema."""
    name: str
    description: str
    meta_schema: Dict[str, Any] = Field(default_factory=dict)


class LetterTypeCreate(LetterTypeBase):
    """Schema for creating a letter type."""
    pass


class LetterTypeResponse(LetterTypeBase):
    """Schema for letter type response."""
    id: UUID
    slug: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Letter Schemas
class LetterBase(BaseModel):
    """Base letter schema."""
    title: str
    description: str
    recipient_name: str
    custom_properties: Dict[str, Any] = Field(default_factory=dict)


class LetterCreate(LetterBase):
    """Schema for creating a letter."""
    letter_type_id: UUID
    content_blocks: List[ContentBlockData] = Field(default_factory=list)


class LetterUpdate(BaseModel):
    """Schema for updating a letter."""
    title: Optional[str] = None
    description: Optional[str] = None
    recipient_name: Optional[str] = None
    letter_type_id: Optional[UUID] = None
    custom_properties: Optional[Dict[str, Any]] = None
    is_published: Optional[bool] = None
    content_blocks: Optional[List[ContentBlockData]] = None


class ContentBlockResponse(BaseModel):
    """Schema for content block response."""
    id: UUID
    block_type: str
    order: int
    content: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True


class LetterResponse(LetterBase):
    """Schema for letter response."""
    id: UUID
    slug: str
    letter_type: LetterTypeResponse
    is_published: bool
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    content_blocks: List[ContentBlockResponse] = Field(default_factory=list)
    public_url: str

    class Config:
        from_attributes = True


class LetterPublicResponse(BaseModel):
    """Public letter response (no admin fields)."""
    id: UUID
    title: str
    description: str
    recipient_name: str
    slug: str
    letter_type: LetterTypeResponse
    custom_properties: Dict[str, Any]
    content_blocks: List[ContentBlockResponse]
    created_at: datetime

    class Config:
        from_attributes = True


# Auth Schemas
class UserLogin(BaseModel):
    """Login request schema."""
    username: str
    password: str


class UserResponse(BaseModel):
    """User response schema."""
    id: UUID
    username: str
    email: EmailStr
    is_staff: bool
    is_superuser: bool

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    """Login response schema."""
    user: UserResponse
    message: str
