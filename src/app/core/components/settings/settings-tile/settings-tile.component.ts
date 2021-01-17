import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import { IUserInfo } from '@app/core/interfaces/user/user-info.interface';

import { UserRole } from '@app/core/enums/user/user-role.enum';

@Component({
  selector: 'app-settings-tile',
  templateUrl: './settings-tile.component.html',
  styleUrls: ['./settings-tile.component.scss'],
})
export class SettingsTileComponent {

  @Input() set menuHidden(value: boolean) {
    this._menuHidden = value;
    this.changeDetectorRef.markForCheck();
  }

  get menuHidden(): boolean {
    return this._menuHidden;
  }

  @Input() user: IUserInfo;

  @Output() menuOpened: EventEmitter<number> = new EventEmitter<number>();
  @Output() userDeleted: EventEmitter<number> = new EventEmitter<number>();
  @Output() userPasswordEdited: EventEmitter<number> = new EventEmitter<number>();
  @Output() userRoleEdited: EventEmitter<IUserInfo> = new EventEmitter<IUserInfo>();

  public _menuHidden = true;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  public getUserRoleName(role: UserRole): string {
    return UserRole[role];
  }

  public toggleMenu(): void {
    this._menuHidden = !this._menuHidden;
    this.menuOpened.emit(this.user.id);
    this.changeDetectorRef.markForCheck();
  }

  public getToggleIconName(): string {
    return this._menuHidden
      ? 'close-outline'
      : 'menu-outline';
  }

  public updateUserPassword(): void {
    this.userPasswordEdited.emit(this.user.id);
  }

  public updateUserRole(): void {
    this.userRoleEdited.emit(this.user);
  }

  public deleteUser(): void {
    this.userDeleted.emit(this.user.id);
  }

}
