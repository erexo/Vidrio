import { UserRole } from '@core/enums/user/user-role.enum';

export class User {
  constructor(
    public password: string,
    public role: UserRole,
    public username: string
  ) {}
}