import { UserRole } from "@app/core/enums/user/user-role.enum";

export interface IUserInfo {
  id: number,
  role: UserRole;
  username: string;
}