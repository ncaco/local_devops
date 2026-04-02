export type AuthUser = {
  id: string;
  email: string;
};

export type IntegrationSummary = {
  id: string;
  provider: string;
  provider_user_id: string;
  username: string | null;
  status: string;
  permissions: string[];
  connected_at: string;
  updated_at: string;
};

export type PostExecutionSummary = {
  id: string;
  attempt_no: number;
  status: string;
  error_message: string | null;
  created_at: string;
  finished_at: string | null;
};

export type ScheduledPostListItem = {
  id: string;
  provider: string;
  post_type: string;
  caption: string;
  media_url: string;
  scheduled_for: string;
  status: string;
  provider_post_id: string | null;
  last_error: string | null;
  published_at: string | null;
  social_account_id: string;
  social_username: string | null;
  executions: PostExecutionSummary[];
};

export type ScheduledPostInput = {
  social_account_id: string;
  caption: string;
  media_url: string;
  scheduled_for: string;
};
