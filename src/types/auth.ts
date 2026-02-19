import type {UserRole} from "../api/enum/role.ts";

export interface AuthUser {
    id: string;
    email: string;
    role: UserRole;
}