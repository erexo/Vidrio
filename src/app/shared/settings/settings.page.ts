import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ModalController, ToastController, ViewDidEnter, ViewDidLeave } from '@ionic/angular';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { DataState } from '@app/core/states/data.state';
import { UsersState } from '@app/core/states/users.state';

import { FormControlType } from '@app/core/enums/form/form-control-type.enum';
import { ResponseType } from '@app/core/enums/http/response-type.enum';
import { UserRole } from '@app/core/enums/user/user-role.enum';

import { IUserInfo } from '@app/core/interfaces/user/user-info.interface';

import { FormControl } from '@app/core/models/form/form-control.model';
import { User } from '@app/core/models/user/user.model';

import { getModal, getToast, responseFilter } from '@app/core/helpers/response-helpers';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPage implements ViewDidEnter, ViewDidLeave {

  public users: IUserInfo[] = [];
  public menuHidden = true;

  private dataSubscription: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dataState: DataState,
    private modalController: ModalController,
    private toastController: ToastController,
    private usersState: UsersState,
  ) { }

  ionViewDidEnter() {
    this.dataSubscription = new Subscription();
    !this.users.length && this.fetchUsers(true);
    this.addMenuListener();
  }

  ionViewDidLeave() {
    this.dataSubscription.unsubscribe();
  }

  public getUserRoleName(role: UserRole): string {
    return UserRole[role];
  }

  public toggleMenu(): void {
    this.menuHidden = !this.menuHidden;
  }

  public getToggleIconName(): string {
    return this.menuHidden
      ? 'menu-outline'
      : 'close-outline';
  }

  public async fetchUsers(errorOnly = false, event?: any): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const usersSubscription = this.usersState.fetchUsers()
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Read, 'Users', errorOnly))
      )
      .subscribe(users => {
        this.users = users.body;
        this.changeDetectorRef.detectChanges();
        event?.target.complete();
      });

    this.dataSubscription.add(usersSubscription);
  }

  public async createUser(user: User): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const createUserSubscription: Subscription = this.usersState.createUser(user)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Create, 'User'))
      )
      .subscribe(_ => this.fetchUsers());

    this.dataSubscription.add(createUserSubscription);
  }

  protected async presentUserCreateModal(): Promise<void> {
    const modal: HTMLIonModalElement = await getModal(
      this.modalController,
      [
        new  FormControl(FormControlType.Text, 'username', '', 'Name'),
        new  FormControl(FormControlType.Password, 'password', '', 'Password'),
        new  FormControl(FormControlType.Select, 'role', UserRole.Guest, 'Role', '', UserRole)
      ],
      'Create an user'
    );

    await modal.present();
    
    modal.onWillDismiss().then(event => {
      this.createUser(event.data);
    });
  }

  public editUser(): void {

  }
  
  private addMenuListener(): void {
    const itemMenuSubscription: Subscription = this.dataState.menuOpened$
      .subscribe(_ => {
        this.presentUserCreateModal()
      });

    this.dataSubscription.add(itemMenuSubscription);
  }

}
