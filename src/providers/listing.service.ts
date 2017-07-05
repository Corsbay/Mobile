import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';
import { DataService } from './data.service';

import { ListingModel } from '../models/listing-model';

import { PriceModel } from '../models/listing-model';


@Injectable()
export class ListingService {

	private LISTING_REF: string = "listing_draft/";
	private profile: any;

	public listing: ListingModel;
	public max_media: number = 6;
	public result: { key: string; listing: any; };

  constructor(
    private _dataService: DataService, 
    private _auth: AuthService,
    public profileService: ProfileService
  ){
    // set the current logged profile
    this.profile = this.profileService.getCurrentProfile();
  }

  /**
  *
  */
  getListing(key){
    if(this.profile !== undefined ){
      let ref = this.LISTING_REF + this.profile.uid + "/";
    	return this._dataService.database.child(ref + key);
    }
  }

  /**
  * List the listing draft to the current user profile based on his database UID
  */
  listListing(){
    if(this.profile !== undefined ){
      return this._dataService.database.child(this.LISTING_REF + this.profile.uid);
    }
  }

  /**
  *
  */
  saveListing(data){
    return this._auth.getCurrentUser().then((currentUser) => {
      return this._dataService.database.child(this.LISTING_REF + currentUser.uid).push(data);
    });
  }

  /**
  *
  */
  updateListing(key, data){
    return this._auth.getCurrentUser().then((currentUser) => {
      let ref = this.LISTING_REF + currentUser.uid + "/";
      return this._dataService.database.child(ref + key).update(data);
    });
  }


  /**
  * Load the listing from the database if there is a Key, if not, create
  * a craft one based on the Listing Model.
  */
  loadListingData(key){

  	return new Promise((resolve, reject) => {
      // If listing has an key, fetch the data
      if(key !== null){

        this.getListing(key).once('value', (listingSnap) => {
          this.result = { key: listingSnap.key, listing: listingSnap.val() };
           resolve(this.result);
        })
        .catch((error) => {
          reject(error);
        });

      }else{ // If is a new listing, define the basic listin object

        let medias = [];
        let i = this.max_media;
        while(i--) {
          medias.push({media_path: './assets/images/default-placeholder.png'});
        }

        // Create a craft to the listing
        var data = new ListingModel();
        data.medias = medias;
        data.price = new PriceModel();
        data.price.currency = this.profile.currency;
        console.log("Currencyyyyyyyyyy",data);

        this.saveListing(data).then((ref) => {
          this.result = { key: ref.key, listing: data};
          resolve(this.result);
        })
        .catch((error) => {
          reject(error);
        });
      }

    });

  }

  /**
  * Summarize a full listing object to be persisted as embeded object
  * @param listing - the regular listing object with full propertires
  */
  // summarizeListing(listing) {
  //   // NOT THE BEST WAY TO CLONE AN OBJECT, BUT WORKS FOR NOW, I HAVE NO TIME FOR BENCHMARK IT
  //   let clone_listing = JSON.parse(JSON.stringify(listing)); //Clone the listing object
  //   clone_listing.form_control = null;
  //   clone_listing.reviews = null;
  //   clone_listing.schedule = null;

  //   return clone_listing;
  // }


  /**
  * Return a promise with the resolved upload task snapshot or reject
  * @param imageBlob - The binary image file to be uploaded to the server
  * @param ref - the listing reference to map the file within the firebase storage
  */
  uploadPicture(imageBlob, ref){
    let imageRef = this.LISTING_REF + ref + "/listing_" + Date.now() + ".jpg";
    return new Promise((resolve, reject) => {

      let upTask = this._dataService.imageRef().child( imageRef ).put(imageBlob);
      upTask.on('state_changed', function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      function(error) {
        reject(error);
      },
      function() {
        // Upload completed successfully, now we can get the download URL
        resolve(upTask.snapshot.downloadURL);
      });
    });
  }

  /**
  * return categories list
  */
  getCategories(){
    return this._dataService.getHttp()
    .get('./assets/domain_data/categories.json')
    .map( ( res ) => res.json().categories );
  }

  /**
  * Provide measure units labels to the UI
  */
  getItemConditions() {
    let conditions = [
      { label: "New", value: "New"},
      { label: "New other", value: "Other"},
      { label: "Manuracturer refurbished", value: "Manuracturer refurbished"},
      { label: "Seller refurbished", value: "Seller refurbished"},
      { label: "Used", value: "Used"}
    ]
    return conditions;
  }

  /**
  * Provide measure units labels to the UI
  */
  getMeasureUnits() {
    let measure_units = [
      { label: "Units", short: "unt", value: "Units"},
      { label: "Pair", short: "pr", value: "Pair"},
      { label: "Kilograms", short: "kg", value: "Kilograms"},
      { label: "Grams", short: "g", value: "Grams"},
      { label: "Pounds", short: "lb", value: "Pounds"},
      { label: "Ounces", short: "oz", value: "Ounces"},
      { label: "Liters", short: "l", value: "Liters"},
      { label: "Milliliters", short: "ml", value: "Milliliters"},
      { label: "Servings", short: "srv", value: "Servings"},
      { label: "Seats", short: "seat", value: "Seats"}
    ]
    return measure_units;
  }


  /**
  *
  */
  getListingCategories(){
    let categories = [
      {label:"Eletronics", value:"Eletronics", checked: false},
      {label:"Mobile", value:"Mobile", checked: false},

    ];

    return categories;
  }


}
