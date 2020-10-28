import { UserRole } from '@core/enums/user/user-role.enum';

export interface LoginInfo {
  accessToken: string;
  role: UserRole;
} 