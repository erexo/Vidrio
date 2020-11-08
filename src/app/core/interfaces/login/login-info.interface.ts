import { UserRole } from '@core/enums/user/user-role.enum';

export interface ILoginInfo {
  accessToken: string;
  role: UserRole;
} 