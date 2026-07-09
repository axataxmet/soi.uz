import { Role } from '@prisma/client';

// Roles allowed to manage editorial content (reviews, news, cases, ...).
export const CONTENT_ROLES = [Role.ADMIN, Role.EDITOR, Role.CONTENT_MANAGER];
