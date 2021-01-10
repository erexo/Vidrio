import { ModalController, ToastController } from '@ionic/angular';

import { ModalPage } from '@app/shared/modal/modal.page';

import { HTTPStatusCode } from '@core/enums/http/http-status-code.enum';
import { ResponseType } from '@core/enums/http/response-type.enum';

import { FormControl } from '@core/models/form/form-control.model';

export const responseFilter = (
  toast: HTMLIonToastElement,
  status: HTTPStatusCode,
  responseType: ResponseType,
  dataType: string,
  errorOnly = false
): boolean => {
  const statusCode: boolean = status === HTTPStatusCode.OK || status === HTTPStatusCode.Accepted;

  if (statusCode && !errorOnly) {
    toast.message = `${dataType} ${responseType}`;
    toast.present();
  } else if (!statusCode) {
    toast.message = `${dataType} could not be ${responseType} (Status Code: ${status})`;
    toast.present();
  }
  
  return statusCode;
}

export const getToast = async (toastController: ToastController, message?: string): Promise<HTMLIonToastElement> => {
  const toast: Promise<HTMLIonToastElement> = toastController.create({
    color: 'light',
    cssClass: 'toast-container',
    duration: 2000,
    message,
    translucent: true
  });

  return toast;
}

export const getModal = async (
    modalController: ModalController,
    controls: FormControl[],
    title?: string,
    submitTitle?: string,
    submitColor?: string
  ): Promise<HTMLIonModalElement> => {
    const modal: Promise<HTMLIonModalElement> = modalController.create({
      component: ModalPage,
      cssClass: 'modal-container',
      componentProps: {
        controls,
        title,
        ...(submitTitle && {submitTitle}),
        ...(submitColor && {submitColor})
      }
    });

    return modal;
}