import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

import { ProfileService } from './profile.service';
import { SellerService } from './seller.service';
import { DataService } from './data.service';

import { ItemModel } from '../models/item-model';

@Injectable()
export class ItemService {

	private ITEM_REF: string = "listings/";
	public item: ItemModel;
	public profile: any;
  public listings: Array<any> = [];

  constructor(
    private _dataService: DataService,
    public profileService: ProfileService,
    public sellerService: SellerService
  ){

  	// set the current logged profile
    this.profile = this.profileService.getCurrentProfile();
  }

  /**
  * Generate a flat item based on the listing draft to be published
  * @param draft = item object
  */
  publishItem(draft){

    return new Promise((resolve, reject) => {

		  this.item = this.setItem(draft);
      // Publish the item
      if(draft.key == undefined){
        reject("Listing Draft key undefined");
      }else{
        this._dataService.database.child(this.ITEM_REF + draft.key).set(this.item).then( response => {

          // Set GeoFire intance
          if(draft.location !== undefined && draft.location.geolocation !== undefined){ 
            let location = [draft.location.geolocation.lat, draft.location.geolocation.lng];
            this._dataService.setGeolocation({key: draft.key, location: location});
          }
          resolve(response);

        }, (error) => {
          reject(error);
        });
      }

    });
  }

  /**
  *
  */
  unpublishItem(){

  }

  /**
  * Set the item to be published
  * @param draft = object from the listing drafts
  */
  setItem(draft): ItemModel{
  	if(draft !== undefined && draft !== null ){

  		let item = new ItemModel();

  		item.title = draft.title;
	    item.summary = draft.summary;
	    item.description = draft.description;
	    item.privacity = draft.privacity;

	    item.shipping_fee = draft.shipping_fee;
      item.shipping_processing_time = draft.shipping_processing_time;
      item.refund_policies = draft.refund_policies;
      item.cancellation_policies = draft.cancellation_policies;
      item.additional_policies = draft.additional_policies;

	    item.item_measure = draft.item_measure;
	    item.confirmation = draft.confirmation;
	    item.categories = draft.categories;

	    item.main_price = draft.price.main_price;
	    item.promotion_price = draft.price.long_term_price;
	    item.currency = draft.price.currency;

      //set flat schedule for local services
      if(draft.schedule !== undefined){
        item.schedule = draft.schedule;
      }

	    item.total_favorites = 0;
	    item.total_reviews =  0;
	    item.total_rate = 4;

      item.location = draft.location;
	    item.medias = draft.medias;
	    item.reviews = [];

	    item[draft.key] = true;
	    item.seller_uid = this.profile.uid;

      //Set the search tags property for data filtering
      item = this.setSearchTags(item, draft);

      return item;
  	}
  }

  /**
  *  Set the search tags to be indexed in the database
  * @param item = listing item
  * @param draft = listing draft
  */
  setSearchTags(item, draft){
    item['search_tags'] = item.search_tags.concat(" "+draft.title);
    // Set categories tags
    if(draft.categories !== undefined){
      Object.keys(draft.categories).forEach((category) => {
        item.search_tags = item.search_tags.concat(" "+category);
      });
    }

    return item;
  }


  /**
  * List the item to the current user profile based on his database UID
  * @param filter = filter object
  *  {orderByChild: string, limitToLast: number, equalTo: string}
  */
  listItems(filter){
    return new Promise((resolve, reject) => {
      let listings = [];
      this._dataService.database.child(this.ITEM_REF).on('value', (listingSnap) => {

        let data = listingSnap.val();
        Object.keys(data).map(key => {
          // retrive the seller
          this.sellerService.getBasicSeller(data[key].seller_uid).then( (seller) => {
            data[key]['seller_profile'] = seller;
            listings.push(data[key]);
          });
        });

        resolve(listings);

      }, error =>{
        console.log(error);
        reject(error);
      });

    });
  }

  /**
  * Get items based on the user location
  * @param radius = radius in miles
  */
  getLocalItems(radius = 10){
    return new Promise((resolve, reject) => {

      //convert radius from Miles to Kilomaters
      radius = radius * 1.6;

      let listings = [];
      this.profileService.setCurrentLocation().then(position => {

        // this.profile = this.profileService.getCurrentProfile();
        this.profile = position;
        if(this.profile.location !== undefined){

          var geoQuery = this._dataService.geoFire.query({
            center: [this.profile.location.lat, this.profile.location.lng],
            radius: radius
          });

          geoQuery.on("key_entered", (key, location, distance) => {
          console.log(key + " entered query at " + location + " (" + distance + " km from center)");
            this._dataService.database.child(this.ITEM_REF + key).once('value', listingSnap => {

              let listing = listingSnap.val();
              // retrive the seller for the current listing
              this.sellerService.getBasicSeller(listing.seller_uid).then( (seller) => {
                listing['seller_profile'] = seller;
                listing['distance'] = distance;

                listings.push(listing);
              });
              
              resolve(listings);
            }, (error) => {
              reject(error);
            });

          });

        }
        else{
          let filter = {    
            orderByChild: 'search_tags',
            limitToLast: 10
            // equalTo: ('true', 'active')
          }
          return this.listItems(filter);
        }
      });

    });
  }


  /**
  * Return the distance between user and listing
  * location1 and location1 must have the form [latitude, longitude].
  * @param location1 = start point
  * @param location2 = end point
  */
  getItemDistance(location1, location2){
    if(Array.isArray(location1) && Array.isArray(location2)){
      let distance = this._dataService.GeoFireLib.distance(location1, location2);
      return distance;
    }else{
      console.log("Locations provided is not valid");
      return null;
    }
  }


}
