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

  public activeMenuID: number;
  public users: IUserInfo[] = [];

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

  public async deleteUser(userID: number): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const deleteUserSubscription: Subscription = this.usersState.deleteUser(userID)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Delete, 'User'))
      )
      .subscribe(_ => this.fetchUsers());

    this.dataSubscription.add(deleteUserSubscription);
  }

  public async updateUserPassword(userID: number, password: string): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const updateUserPasswordSubscription: Subscription = this.usersState.updateUserPassword(userID, password)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Update, 'User password'))
      )
      .subscribe(_ => this.fetchUsers());

    this.dataSubscription.add(updateUserPasswordSubscription);
  }

  public async updateUserRole(userID: number, role: UserRole): Promise<void> {
    const toastInstance: HTMLIonToastElement = await getToast(this.toastController);
    const updateUserRoleSubscription: Subscription = this.usersState.updateUserRole(userID, role)
      .pipe(
        filter(res => responseFilter(toastInstance, res.status, ResponseType.Update, 'User role'))
      )
      .subscribe(_ => this.fetchUsers());

    this.dataSubscription.add(updateUserRoleSubscription);
  }

  protected async presentUserCreateModal(): Promise<void> {
    const modal: HTMLIonModalElement = await getModal(
      this.modalController,
      [
        new FormControl(FormControlType.Text, 'username', '', 'Name'),
        new FormControl(FormControlType.Password, 'password', '', 'Password'),
        new FormControl(FormControlType.Select, 'role', UserRole.Guest, 'Role', '', UserRole)
      ],
      'Create an user',
      false,
      'Create'
    );
    
    modal.onWillDismiss().then(event => {
      event.data && this.createUser(event.data);
    });

    await modal.present();
  }
  
  protected async presentUserDeleteModal(userID: number): Promise<void> {
    const modal: HTMLIonModalElement = await getModal(
      this.modalController,
      [],
      'Are you sure?',
      false,
      'Delete',
      'danger'
    );
    
    modal.onWillDismiss().then(event => {
      event.data && this.deleteUser(userID);
    });

    await modal.present();
  }

  protected async presentUserPasswordModal(userID: number): Promise<void> {
    const modal: HTMLIonModalElement = await getModal(
      this.modalController,
      [
        new FormControl(FormControlType.Password, 'password', '', 'Password')
      ],
      'Change a password',
      false,
      'Change'
    );
    
    modal.onWillDismiss().then(event => {
      event.data && this.updateUserPassword(userID, event.data.password);
    });

    await modal.present();
  }

  protected async presentUserRoleModal(userInfo: IUserInfo): Promise<void> {
    const modal: HTMLIonModalElement = await getModal(
      this.modalController,
      [
        new FormControl(FormControlType.Select, 'role', userInfo.role, 'Role', '', UserRole)
      ],
      'Change a role',
      false,
      'Change'
    );
    
    modal.onWillDismiss().then(event => {
      event.data && this.updateUserRole(userInfo.id, event.data.role);
    });

    await modal.present();
  }
  
  private addMenuListener(): void {
    const itemMenuSubscription: Subscription = this.dataState.menuOpened$
      .subscribe(_ => {
        this.presentUserCreateModal()
      });

    this.dataSubscription.add(itemMenuSubscription);
  }

}
