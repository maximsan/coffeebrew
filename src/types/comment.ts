// Postponed past v1 — types for deferred recipe/community UI; see docs/v2_backlog.md
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: Date;
}
