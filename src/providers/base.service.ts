import { Injectable } from '@angular/core';
import { AlertController} from 'ionic-angular';

@Injectable()
export class BaseService {

  constructor(public alert: AlertController){}


  public showAlert(title: string, msg: string): void {
    let alert = this.alert.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

}