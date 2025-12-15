export const API_V1 = '/api/v1';

// Auth
export const LOGIN_ENDPOINT = '/auth/login';
export const PROFILE_ENDPOINT = '/auth/me';
export const REFRESH_TOKEN_ENDPOINT = '/auth/refresh';

// Item
export const ITEM_ENDPOINT = '/item';
export const ITEM_REPORT_ENDPOINT = '/item/report';
export const ITEM_FIX_REQUEST_ENDPOINT = '/item/{itemId}/fix-request';
export const ITEM_STATUS_HISTORY_ENDPOINT = '/item/{item_id}/history';
export const ITEM_ACKNOWLEDGE_ENDPOINT = '/item/{item_id}/ack';

// Production Line
export const PRODUCTION_LINE_ENDPOINT = '/production_line';

// Upload
export const IMAGE_PATH_ENDPOINT = '/image/{image_path}';
export const IMAGE_UPLOAD_ENDPOINT = '/image/upload';

// Defect
export const DEFECT_TYPE_ENDPOINT = '/defect_type';

// Review
export const REVIEW_ENDPOINT = '/review';
export const REVIEW_DECISION_ENDPOINT = '/review/{review_id}/decision';

// Change status
export const CHANGE_STATUS_ENDPOINT = '/change_status';
export const DECIDE_STATUS_ENDPOINT = '/change_status/{request_id}/decision';

// Dashboard
export const DASHBOARD_SUMMARY_ENDPOINT = '/dashboard/summary';

// Item Status
export const ITEM_STATUS_ENDPOINT = '/item_status';

// Camera
export const GET_CAMERAS_ENDPOINT = `/camera`;
export const GET_CAMREA_STREAM_ENDPOINT = `/camera/{cameraId}/stream-url`;
export const FOCUS_CAMERA_ENDPOINT = `/camera/rest-focus`;
