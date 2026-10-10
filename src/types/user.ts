// Postponed past v1 — types for deferred recipe/social UI; see docs/v2_backlog.md
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
