import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { BaseProvider } from '../../app/base.provider';
import { ListingService } from '../../providers/listing.service';
import { OrderService } from '../../providers/order.service';

import { SellerFormPage } from '../seller-form/seller-form';
import { OrderSettingsPage } from '../order-settings/order-settings';

import { ListingModel } from '../../models/listing-model';
import { ListingFormPage } from '../listing-form/listing-form';


@Component({
  selector: 'page-seller',
  templateUrl: 'seller.html',
  providers: [OrderService]
})
export class SellerPage {

	public segment_list: string = "orders";

	public drafts: Array<ListingModel> = [];
	public listings: Array<ListingModel> = [];
	public listing_key: string;

	public orders: any;

  constructor(
  	public nav: NavController,
  	public params: NavParams,
  	public loadingCtrl: LoadingController,
    public BaseApp: BaseProvider,
    public listingService: ListingService,
    public orderService: OrderService
  ) {}

  ionViewDidLoad() {
    //this.getItems();
    this.getOrders();
  }

  /**
  *
  *
  */
  showList(list): void {
  	if(list == 'listing'){
  		this.segment_list = 'listing';
      this.getItems();
  	}
  	else if(list == 'orders') {
  		this.segment_list = 'orders';
  		// this.getOrders();
  	}
  }


	/**
  *
  */
  private getItems(){

  	let loading = this.loadingCtrl.create();
    loading.present();
    this.listingService.listListing().once('value', (listingSnap) => {

      let objects = listingSnap.val();
      if(objects !== undefined && objects !== null ){

	      Object.keys(objects).map((key)=>{
	      	objects[key].key = key;

          if(objects[key].published == true){
            this.listings.push(objects[key]);
          }else{
            this.drafts.push(objects[key]);
          }
	      });

        this.listings.reverse();

	    }

      loading.dismiss();
    });

  }

  /**
  *
  */
  private getOrders(){
		this.orderService.getSellerOrders().then((orderSnap) => {
			this.orders = orderSnap;
      //Sort orders by created date
      this.orders.sort((a, b) => {
        a.created_at - b.created_at;
      });
		})
		.catch((error) => {
			console.log(error);
		});
  }

  /**
  *
  */
  setSeller() {
    this.nav.push(SellerFormPage);
  }

  /**
  *
  */
  orderSettings(key){
    console.log(this.orders);

    this.nav.push(OrderSettingsPage, {order: this.orders[key]});
  }


  addListing(){
  	this.nav.push(ListingFormPage);
  }

  editListing(key){
  	this.nav.push(ListingFormPage, {key: key});
  }

}
