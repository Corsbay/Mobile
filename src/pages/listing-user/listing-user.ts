import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { BaseService } from '../../providers/base.service';
import { ItemDraftService } from '../../providers/item-draft.service';

import { ItemDraftModel } from '../../models/item-draft-model';

import { ListingFormPage } from '../listing-form/listing-form';

@Component({
  selector: 'page-listing-user',
  templateUrl: 'listing-user.html'
})
export class ListingUserPage {

  public drafts: Array<ItemDraftModel> = [];
	public listings: Array<ItemDraftModel> = [];
	public listing_key: string;
	public loading: any;

  constructor(
  	public nav: NavController,
    public BaseApp: BaseService,
    public listingService: ItemDraftService,
  	public params: NavParams,
  	public loadingCtrl: LoadingController
  ) {
  	this.loading = this.loadingCtrl.create();
  }


  ionViewDidLoad() {
    this.getItems();
  }

  /**
  *
  */
  private getItems(){

    this.loading.present();
    this.listingService.listItemDraft().once('value', (listingSnap) => {

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

      this.loading.dismiss();
    });

  }


  addListing(){
  	this.nav.push(ListingFormPage);
  }

  editListing(key){
  	this.nav.push(ListingFormPage, {key: key});
  }

}
