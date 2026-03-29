INSERT INTO organizations (
    organization_id,
    organization_name,
    organization_code,
    status,
    created_at,
    updated_at
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Marketing HQ',
    'marketing-hq',
    'ACTIVE',
    now(),
    now()
);

INSERT INTO brands (
    brand_id,
    organization_id,
    brand_name,
    brand_code,
    status,
    created_at,
    updated_at
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Brand A',
    'brand-a',
    'ACTIVE',
    now(),
    now()
);

INSERT INTO users (
    user_id,
    organization_id,
    email,
    display_name,
    password_hash,
    status,
    created_at,
    updated_at
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'admin@example.com',
    'Admin User',
    '$2b$12$placeholder.placeholder.placeholder.placeholderplaceholderpl',
    'ACTIVE',
    now(),
    now()
);

INSERT INTO channel_accounts (
    channel_account_id,
    organization_id,
    brand_id,
    channel_type,
    channel_name,
    external_account_id,
    access_token_enc,
    refresh_token_enc,
    token_expires_at,
    health_status,
    status,
    created_at,
    updated_at
) VALUES (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'instagram',
    'Brand A Instagram',
    'ig-brand-a',
    'encrypted-access-token',
    'encrypted-refresh-token',
    now() + interval '30 days',
    'HEALTHY',
    'ACTIVE',
    now(),
    now()
);

INSERT INTO content_items (
    content_item_id,
    organization_id,
    brand_id,
    created_by_user_id,
    title,
    body_text,
    planned_publish_at,
    content_status,
    approval_status,
    priority_cd,
    created_at,
    updated_at
) VALUES (
    '55555555-5555-5555-5555-555555555551',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    'Draft campaign',
    'Draft copy for the first campaign.',
    null,
    'DRAFT',
    'NOT_REQUESTED',
    'NORMAL',
    now(),
    now()
),
(
    '55555555-5555-5555-5555-555555555552',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    'Approved campaign',
    'Approved copy ready for scheduling.',
    now() + interval '1 day',
    'APPROVED',
    'REQUESTED',
    'HIGH',
    now(),
    now()
);

INSERT INTO approval_requests (
    approval_request_id,
    content_item_id,
    requested_by_user_id,
    current_status,
    requested_at,
    created_at,
    updated_at
) VALUES (
    '66666666-6666-6666-6666-666666666662',
    '55555555-5555-5555-5555-555555555552',
    '33333333-3333-3333-3333-333333333333',
    'REQUESTED',
    now(),
    now(),
    now()
);

INSERT INTO publish_jobs (
    publish_job_id,
    organization_id,
    content_item_id,
    brand_id,
    channel_account_id,
    scheduled_at,
    job_status,
    idempotency_key,
    last_attempt_at,
    succeeded_at,
    failed_at,
    created_at,
    updated_at
) VALUES (
    '77777777-7777-7777-7777-777777777771',
    '11111111-1111-1111-1111-111111111111',
    '55555555-5555-5555-5555-555555555552',
    '22222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    now() + interval '2 hours',
    'QUEUED',
    'seed-job-queued',
    null,
    null,
    null,
    now(),
    now()
),
(
    '77777777-7777-7777-7777-777777777772',
    '11111111-1111-1111-1111-111111111111',
    '55555555-5555-5555-5555-555555555551',
    '22222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    now() - interval '1 hour',
    'FAILED',
    'seed-job-failed',
    now() - interval '1 hour',
    null,
    now() - interval '55 minutes',
    now(),
    now()
);

INSERT INTO audit_logs (
    audit_log_id,
    organization_id,
    actor_user_id,
    entity_type,
    entity_id,
    action_type,
    before_data,
    after_data,
    ip_address,
    user_agent,
    occurred_at,
    created_at
) VALUES (
    '88888888-8888-8888-8888-888888888881',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'publish_jobs',
    '77777777-7777-7777-7777-777777777772',
    'CREATE',
    null,
    '{"status": "FAILED"}',
    null,
    'seed-script',
    now(),
    now()
);

