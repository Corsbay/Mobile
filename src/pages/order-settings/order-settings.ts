import { Component } from '@angular/core';
import { App, NavController, ViewController, NavParams } from 'ionic-angular';

import { OrderService } from '../../providers/order.service';

import { ListingPage } from '../listing/listing';
import { ProfileOrdersPage } from '../profile-orders/profile-orders';

@Component({
  selector: 'page-order-settings',
  templateUrl: 'order-settings.html',
  providers: [OrderService]
})
export class OrderSettingsPage {

	public order: any;
	public order_key: string;
  public status_list: Array<string> = [];
  public show_shipping_fee: boolean = false;

  constructor(
    public appCtrl: App,
  	public nav: NavController,
    public viewCtrl: ViewController,
  	public params: NavParams,
    public orderService: OrderService
  ) {}

  ionViewWillLoad() {
  	this.order = this.params.get('order');
  	this.order_key = this.params.get('order_key');

    // Set the status list
    let status_list = this.orderService.getStatusLabel();
    Object.keys(status_list).forEach((key) => {
      this.status_list.push(status_list[key]);
    });

    if(this.order.shipping_option == "Delivery") {
      // this.shipping_address = true;
      this.show_shipping_fee = true;
    }else{
      this.show_shipping_fee = false;
      // this.carryout_address = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPaymentPage');
  }

  /**
  *
  */
  goToMyOrders(){
    this.nav.setRoot(ProfileOrdersPage);
  }

  /**
  *
  */
  goToHome() {
    // this.viewCtrl.dismiss();
    this.nav.setRoot(ListingPage);
  	//this.appCtrl.getRootNav().push(ListingPage);
  }

}
