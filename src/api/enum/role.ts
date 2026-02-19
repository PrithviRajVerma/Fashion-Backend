
export const User_Roles = ["USER","STAFF","ADMIN"] as const;
export type UserRole = typeof User_Roles[number];