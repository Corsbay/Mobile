import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

import { ProfileService } from '../../providers/profile.service';
import { OrderService } from '../../providers/order.service';

import { OrderPaymentPage } from '../order-payment/order-payment';

@Component({
  selector: 'page-order-checkout',
  templateUrl: 'order-checkout.html',
  // pipes: [FullDateFormat],
  providers: [OrderService]
})
export class OrderCheckoutPage {

	public order: any;
	public orderKey: string;
  public showDeliveryFee: boolean = false;
	public shippingAddress: boolean = false;
	public carryoutAddress: boolean = false;

  constructor(
  	public nav: NavController, 
  	public viewCtrl: ViewController,
  	public alertCtrl: AlertController,
  	public params: NavParams,
    public orderService: OrderService,
    public profileService: ProfileService
  ){

  }

  ionViewWillLoad(){
  	this.order = this.params.get('order');
  	this.orderKey = this.params.get('orderKey');

  	console.log(this.order);

  	// Set the shipping address - if for delivery
  	if(this.order.delivery_option == "Delivery") {
  		this.shippingAddress = true;
      this.showDeliveryFee = true;
  	}else{
  		this.carryoutAddress = true;
  	}

  }

  ionViewDidLoad() {

  }

  /**
  * Set the order as canceled
  */
  cancelOrder(){
    if( this.order !== undefined ){
      // Set the order status history
      let order_labels = this.orderService.getStatusLabel();
      this.order.status = order_labels.canceled;
      this.order.status_history.push(order_labels.canceled);
      this.orderService.updateOrder(this.orderKey, this.order).then(()=>{
      	this.nav.removeView(this.nav.getPrevious());
      	this.viewCtrl.dismiss();
      })
      .catch((error)=>{
        console.log(error.message);
      });
    }
  }
  /**
  * Show a alert confirm before cancel the order
  */ 
  cancelOrderConfirmation() {
    let confirm = this.alertCtrl.create({
      title: 'Cancel My Order',
      message: 'Are you sure you want to cancel your order?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.cancelOrder();
          }
        },{
          text: 'No',
          handler: () => {
            console.log('Cancel the action');
          }
        }
      ]
    });
    confirm.present();
  }

  /**
  *
  */
  editOrder() {

  }

  /**
  *
  */
  holdOrder(){

  }

  /**
  *
  */
  proceedPayment() {
    this.nav.setRoot(OrderPaymentPage, { order: this.order, orderKey: this.orderKey });
  }
  

  /**
  * Show the profile shipping address screen
  * Send the user profile data as a parammeter to the target page
  */
  setPaymentMethod() {
    
  }

}
