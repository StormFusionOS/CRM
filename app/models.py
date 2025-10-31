"""SQLAlchemy ORM models for the CRM platform."""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import List, Optional

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.security import RoleEnum
from app.db.session import Base


class TimestampMixin:
    """Mixin providing created and updated timestamp columns."""

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )


class User(TimestampMixin, Base):
    """Application user model supporting role-based access control."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    role: Mapped[RoleEnum] = mapped_column(Enum(RoleEnum), default=RoleEnum.client, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    contacts: Mapped[List["Contact"]] = relationship("Contact", back_populates="owner")
    leads: Mapped[List["Lead"]] = relationship("Lead", back_populates="owner")


class Contact(TimestampMixin, Base):
    """Represents a customer contact record."""

    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(32), unique=True, nullable=True)
    company: Mapped[str | None] = mapped_column(String(255), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    owner: Mapped[Optional[User]] = relationship("User", back_populates="contacts")
    leads: Mapped[List["Lead"]] = relationship("Lead", back_populates="contact")
    interactions: Mapped[List["Interaction"]] = relationship("Interaction", back_populates="contact")
    appointments: Mapped[List["Appointment"]] = relationship("Appointment", back_populates="contact")


class LeadStatusEnum(str, Enum):
    """Enumeration of lead statuses."""

    new = "new"
    contacted = "contacted"
    qualified = "qualified"
    proposal = "proposal"
    won = "won"
    lost = "lost"


class Lead(TimestampMixin, Base):
    """Lead model representing prospective customers."""

    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    contact_id: Mapped[int | None] = mapped_column(ForeignKey("contacts.id"), nullable=True)
    source: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[LeadStatusEnum] = mapped_column(Enum(LeadStatusEnum), default=LeadStatusEnum.new, nullable=False)
    stage: Mapped[str | None] = mapped_column(String(255), nullable=True)
    value: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    owner: Mapped[Optional[User]] = relationship("User", back_populates="leads")
    contact: Mapped[Optional[Contact]] = relationship("Contact", back_populates="leads")
    interactions: Mapped[List["Interaction"]] = relationship("Interaction", back_populates="lead")
    campaigns: Mapped[List["LeadCampaign"]] = relationship("LeadCampaign", back_populates="lead")
    inbox_messages: Mapped[List["InboxMessage"]] = relationship("InboxMessage", back_populates="lead")
    pipeline_entry: Mapped[Optional["LeadPipeline"]] = relationship("LeadPipeline", back_populates="lead", uselist=False)


class InteractionTypeEnum(str, Enum):
    """Interaction types for communications."""

    call = "call"
    email = "email"
    sms = "sms"
    social = "social"
    note = "note"


class Interaction(TimestampMixin, Base):
    """Logs communications with contacts or leads."""

    __tablename__ = "interactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    contact_id: Mapped[int | None] = mapped_column(ForeignKey("contacts.id"), nullable=True)
    lead_id: Mapped[int | None] = mapped_column(ForeignKey("leads.id"), nullable=True)
    type: Mapped[InteractionTypeEnum] = mapped_column(Enum(InteractionTypeEnum), nullable=False)
    channel: Mapped[str | None] = mapped_column(String(255), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    metadata: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    contact: Mapped[Optional[Contact]] = relationship("Contact", back_populates="interactions")
    lead: Mapped[Optional[Lead]] = relationship("Lead", back_populates="interactions")


class AppointmentStatusEnum(str, Enum):
    """Appointment status values."""

    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"


class Appointment(TimestampMixin, Base):
    """Stores scheduled appointments with contacts."""

    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    contact_id: Mapped[int] = mapped_column(ForeignKey("contacts.id"), nullable=False)
    scheduled_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[AppointmentStatusEnum] = mapped_column(Enum(AppointmentStatusEnum), default=AppointmentStatusEnum.scheduled, nullable=False)

    contact: Mapped[Contact] = relationship("Contact", back_populates="appointments")


class Campaign(TimestampMixin, Base):
    """Marketing campaigns."""

    __tablename__ = "campaigns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    start_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    end_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    budget: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)

    leads: Mapped[List["LeadCampaign"]] = relationship("LeadCampaign", back_populates="campaign", cascade="all, delete-orphan")


class LeadCampaign(TimestampMixin, Base):
    """Association table linking leads to campaigns."""

    __tablename__ = "lead_campaigns"
    __table_args__ = (UniqueConstraint("lead_id", "campaign_id", name="uq_lead_campaign"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    lead_id: Mapped[int] = mapped_column(ForeignKey("leads.id"), nullable=False)
    campaign_id: Mapped[int] = mapped_column(ForeignKey("campaigns.id"), nullable=False)
    status: Mapped[str | None] = mapped_column(String(255), nullable=True)

    lead: Mapped[Lead] = relationship("Lead", back_populates="campaigns")
    campaign: Mapped[Campaign] = relationship("Campaign", back_populates="leads")


class InboxMessageDirection(str, Enum):
    """Direction of inbox messages."""

    inbound = "inbound"
    outbound = "outbound"


class InboxMessage(TimestampMixin, Base):
    """Inbox messages aggregated from multiple channels."""

    __tablename__ = "inbox_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    contact_id: Mapped[int | None] = mapped_column(ForeignKey("contacts.id"), nullable=True)
    lead_id: Mapped[int | None] = mapped_column(ForeignKey("leads.id"), nullable=True)
    source: Mapped[str] = mapped_column(String(255), nullable=False)
    direction: Mapped[InboxMessageDirection] = mapped_column(Enum(InboxMessageDirection), nullable=False)
    subject: Mapped[str | None] = mapped_column(String(255), nullable=True)
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    received_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    responded: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    contact: Mapped[Optional[Contact]] = relationship("Contact")
    lead: Mapped[Optional[Lead]] = relationship("Lead", back_populates="inbox_messages")


class PipelineStage(TimestampMixin, Base):
    """Defines stages within the sales pipeline."""

    __tablename__ = "pipeline_stages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    order: Mapped[int] = mapped_column(Integer, nullable=False)

    leads: Mapped[List["LeadPipeline"]] = relationship("LeadPipeline", back_populates="stage")


class LeadPipeline(TimestampMixin, Base):
    """Maps leads to their pipeline stage."""

    __tablename__ = "lead_pipeline"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    lead_id: Mapped[int] = mapped_column(ForeignKey("leads.id"), unique=True, nullable=False)
    stage_id: Mapped[int] = mapped_column(ForeignKey("pipeline_stages.id"), nullable=False)

    lead: Mapped[Lead] = relationship("Lead", back_populates="pipeline_entry")
    stage: Mapped[PipelineStage] = relationship("PipelineStage", back_populates="leads")


class ChangeLogStatus(str, Enum):
    """Possible statuses for change log entries."""

    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class ChangeLog(TimestampMixin, Base):
    """Tracks AI-generated recommendations and approvals."""

    __tablename__ = "change_log"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(255), nullable=False)
    entity_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    change_summary: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[ChangeLogStatus] = mapped_column(Enum(ChangeLogStatus), default=ChangeLogStatus.pending, nullable=False)
    created_by_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    approved_by_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class WebhookLog(TimestampMixin, Base):
    """Audit log of inbound webhook events."""

    __tablename__ = "webhook_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    source: Mapped[str] = mapped_column(String(255), nullable=False)
    headers: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    payload: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    status: Mapped[str | None] = mapped_column(String(255), nullable=True)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)


class TaskLog(TimestampMixin, Base):
    """Logs the execution of Celery tasks."""

    __tablename__ = "task_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    task_name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(64), nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)


class MediaFile(TimestampMixin, Base):
    """Metadata for media files stored by the application."""

    __tablename__ = "media_files"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    original_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    related_model: Mapped[str | None] = mapped_column(String(255), nullable=True)
    related_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    content_type: Mapped[str | None] = mapped_column(String(255), nullable=True)


__all__ = [
    "User",
    "Contact",
    "Lead",
    "Interaction",
    "Appointment",
    "Campaign",
    "LeadCampaign",
    "InboxMessage",
    "PipelineStage",
    "LeadPipeline",
    "ChangeLog",
    "WebhookLog",
    "TaskLog",
    "MediaFile",
    "LeadStatusEnum",
    "InteractionTypeEnum",
    "AppointmentStatusEnum",
    "InboxMessageDirection",
    "ChangeLogStatus",
]
