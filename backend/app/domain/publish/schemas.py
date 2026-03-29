from pydantic import BaseModel


class FailureItem(BaseModel):
    publish_job_id: str
    title: str
    channel: str
    error_code: str
    message: str
    next_action: str
    retryable: bool
