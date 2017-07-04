import { Component } from '@angular/core';
import { App, NavController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
// import { counterRangeValidator } from '../../components/counter-input/counter-input';
// import { Observable } from 'rxjs/Observable';

import { ProfileService } from '../../providers/profile.service';
import { OrderService } from '../../providers/order.service';

import { OrderCheckoutPage } from '../order-checkout/order-checkout';
import { ProfileFormAddressPage } from '../profile-form-address/profile-form-address';
import { ProfilePaymentMethodPage } from '../profile-payment-method/profile-payment-method';

import { OrderModel } from '../../models/order-model';
import { InvoiceModel } from '../../models/order-model';

@Component({
  selector: 'page-listing-order',
  templateUrl: 'listing-order.html',
  providers: [OrderService]
})
export class ListingOrderPage {

	public formOrder: FormGroup;
	public listing: any;

  public profile: any;
  public primaryAddress: any;
  public order: OrderModel;
  public orderKey: string;
  public invoice: InvoiceModel;

  // Schedule properties
  public availableDays: Array<any> = [];
  public takeToday: any;
  public isAvailableToday: boolean = false;
  public dateMin: string = "2017-04-18";
  public dateMax: string = "2017-05-02";
  public monthValues: Array<string> = [];
  public dayValues: Array<string> = [];
  public timeRange: any = {};


  constructor(
    public appCtrl: App,
  	public nav: NavController, 
  	public viewCtrl: ViewController,
  	public params: NavParams,
    public orderService: OrderService,
    public profileService: ProfileService
  ){

  	this.formOrder = new FormGroup({
      quantity: new FormControl(1, Validators.required),
      total_price: new FormControl(0.00, Validators.required),
      delivery_option: new FormControl('', Validators.required),
      delivery_schedule: new FormControl(''),
      delivery_time: new FormControl(''),
      schedule_day: new FormControl(''),
      schedule_time: new FormControl({value: '', disabled: true})
    });

  }

  ionViewWillLoad() {
    this.listing = this.params.get('listing');
    this.orderKey = this.params.get('order');

    //Set the Invoice model object
    this.invoice = new InvoiceModel();
    this.invoice.currency = this.listing.currency;
    this.invoice.price = this.listing.main_price;

    // Fetch the delivery address if the delivery option requires
    if(this.listing.delivery || this.listing.shipping){
      this.profile = this.profileService.getCurrentProfile();
      if(this.profile.addresses !== undefined ){
        this.primaryAddress = this.profile.addresses.find(function(address){
          return address.primary == true;
        });
      }
    }

    if(this.listing.delivery) {
      this.formOrder.patchValue({delivery_option: "Delivery"});
    }else if(this.listing.carryout){
      this.formOrder.patchValue({delivery_option: "Carryout"});
    }else{
      this.formOrder.patchValue({delivery_option: "Shipping"});
    }

  }

  /**
  *
  */
  ionViewDidLoad() {
    this.setSubtotal(1);
    // Set the date availability to schedule
    this.setItinerary();
  }

  /**
  * Cancel order and save the status log
  */
  cancelOrder() {
    // If order has been created, in case of cancel, set the order as canceled
    if(this.orderKey){
      // Set the order status history
      let order_status = this.orderService.getStatusLabel();
      this.order.status = order_status.canceled;
      this.order.status_history.push(order_status.canceled);
      this.orderService.updateOrder(this.orderKey, this.order)
      .catch((error)=>{
        console.log(error.message);
      });
    }

    this.viewCtrl.dismiss();
	}

  /**
  * Set the price on change of quantity property
  * @param event - the value form the event emiter
  */
  setSubtotal(quantity){
    this.invoice.quantity = quantity;
    this.invoice.subtotal = (this.listing.main_price * quantity);
    // Add delivery fee if there is a delivery fee
    this.setInvoice(this.formOrder.value.delivery_option);
  }

  /**
  * Verify if there is a delivery fee and apply the fee to the total price
  * @param subtotal - the quantity multiplied by the main listing price
  */
  setInvoice(opt: string = ""){
    // Set Tax upon the product
    this.invoice.tax = parseFloat(Number(this.invoice.subtotal * 0.07).toPrecision(4));
    var subtotal: number = this.invoice.subtotal + this.invoice.tax;

    if(opt == "Delivery"){
      this.invoice.total_price = subtotal + parseFloat(this.listing.delivery_fee);
      this.invoice.delivery_fee = parseFloat(this.listing.delivery_fee);
    }else if(opt == "Shipping"){
      this.invoice.total_price = subtotal + parseFloat(this.listing.shipping_fee);
      this.invoice.shipping_fee = parseFloat(this.listing.shipping_fee);
    }else{
      this.invoice.total_price = subtotal;
    }

    console.log("INVOICE ", this.invoice);

    this.formOrder.patchValue({total_price: this.invoice.total_price});
  }

  /**
  * Show the profile shipping address screen
  * Send the user profile object as a parammeter to the target page
  */
  setAddress() {
    this.nav.push(ProfileFormAddressPage, { profile: this.profile });
  }

  /**
  * Show the payment method screen
  * Send the user profile object as a parammeter to the target page
  */
  setPaymentMethod() {
    this.nav.push(ProfilePaymentMethodPage, { profile: this.profile });
  }

  /**
  *
  */
  setScheduleDelivery() {
    console.log("do something dude!");
  }


  /** 
  * Set the available dates and range of time from 
  * the listing schedule with the next 30 days
  */
  setItinerary() {
    // User a service method to return the available days within the next 30 days.
    this.availableDays = this.orderService.setItinerary(this.listing.schedule);

    console.log(this.availableDays);

    //set the minimum date parammeter
    let firstDay = this.availableDays[0].moment;
    this.dateMin = firstDay.format("YYYY-MM-DD");
    //set the maximum date parammeter
    let lastDay = this.availableDays[this.availableDays.length - 1].moment;
    this.dateMax = lastDay.format("YYYY-MM-DD");


    this.availableDays.forEach((day) => {
      // Check if is available for the current day
      // and apply the estimated delivery time
      if(moment().format("YYYY-MM-DD") == day.moment.format("YYYY-MM-DD")){
        this.isAvailableToday = true;
        // Add the avarage ride time
        this.takeToday = moment().add(30, 'm');
        // Add the processing product processing time from the listing object
        this.takeToday.add(this.listing.delivery_processing_time, 'm');
        // Set Today ASAP as default option
        this.formOrder.patchValue({delivery_schedule: 'asap'});
      }

      // set the month range
      let month = day.moment.format("MM");
      if(this.monthValues.indexOf(month) == -1){
        this.monthValues.push(month);
      }
      this.dayValues.push(day.moment.format("DD"));
    });

    // Set schedule option as default if not available for the current day
    if(!this.isAvailableToday){
      this.formOrder.patchValue({delivery_schedule: 'schedule'});
    }
  }

  /**
  * Set the time range based on the range for each weekday from the listing
  */
  setTimeRange() {
    this.formOrder.get('schedule_time').enable();
    let selectedDate = moment(this.formOrder.value.schedule_day);
    let date = this.availableDays.find((day) => {
       if(day.moment.format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD")){
         return day;
       }
    });
    this.timeRange = date.time_range;
    console.log("TIME RANGE - ",date.time_range);
    this.formOrder.get('schedule_time').reset();
  }

  /**
  *
  */
  validOrder(){
    return (this.formOrder.valid);
     // &&  (this.formOrder.value.delivery_time != '' ||   this.formOrder.value.schedule_day != '');
  }

  /** - MOVE THE ORDER OBJECT THE THE ORDER SERVICE PROVIDER!!!!!
  * Set the Order Checkout object
  */
  checkoutOrder(): void {
    if(this.validOrder()){

      this.order = new OrderModel();

      //Set the delivery option to the new Order object
      this.order.delivery_option = this.formOrder.value.delivery_option;

      // Set the delivery schedule based on the delivery option
      if(this.formOrder.value.delivery_option == "Shipping") {
        this.order.delivery_schedule = moment().add(3, 'd').valueOf();
      }else{
        if(this.formOrder.value.delivery_schedule == "asap") {
          this.order.delivery_schedule = this.takeToday.valueOf();
        }else {
          let schedule_date = this.formOrder.value.schedule_day+"T"+this.formOrder.value.schedule_time;
          this.order.delivery_schedule = moment(schedule_date, "YYYY-MM-DDTHH:mm").valueOf();
        }
      }

      // Set a Listing snapshot to the order object
      this.order.listing_snapshot = this.listing;
      this.order.buyer_uid = this.profile.uid;
      this.order.seller_uid = this.listing.seller_uid;

      // Set Order Invoice
      this.order.invoice = this.invoice;

      // Set order delivery address
      if(this.order.delivery_option !== "Carryout"){
        this.order.delivery_address = this.primaryAddress;
      }

      // Set the order status
      let order_labels = this.orderService.getStatusLabel();
      this.order.status = order_labels.open;
      // Set the order status history
      this.order.status_history.push(order_labels.open);

      // Update the order with the given key
      if(this.orderKey){ 

        this.orderService.updateOrder(this.orderKey, this.order).then(()=>{
          console.log(this.order);
          // this.nav.push(OrderCheckoutPage, { order: this.order });

          this.viewCtrl.dismiss();
          this.appCtrl.getRootNav().push(OrderCheckoutPage, { order: this.order });
        })
        .catch((error)=>{
          console.log(error.message);
        });

      }else { // Create a new order
        // Save the data to the database
        this.orderService.createOrder(this.order).then((result)=>{
          this.orderKey = result.key;
          // this.nav.push(OrderCheckoutPage, { orderKey: this.orderKey, order: this.order});

          this.viewCtrl.dismiss();
          this.appCtrl.getRootNav().push(OrderCheckoutPage, { orderKey: this.orderKey, order: this.order});

        }).catch((error)=>{
          console.log(error.message);
        });
      }

    }

  }

}
