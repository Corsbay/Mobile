import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { ProfileModel } from '../models/profile-model';

import { ProfileService } from './profile.service';

@Injectable()
export class SellerService {

	private SELLER_REF = "seller_profiles/";

  constructor(
  	private _dataService: DataService, 
    private _auth: AuthService,
    public profileService: ProfileService
  ) {
  }

  /**
  *
  */
  createSeller(data){
  	return new Promise((resolve, reject) => {
	    this._auth.getCurrentUser().then((currentUser) => {
	      data.uid = currentUser.uid;
	      this._dataService.database.child(this.SELLER_REF + currentUser.uid).set(data, (error) => {
	 				console.log(error);
	      	reject(error);
	      })
	      .then((complete)=>{
	      	// Update the seller profile property in the profile
	      	// let profile_ref = currentUser.uid + "/seller_profile";

	      	this.profileService.saveProfile({seller_profile: true }).then(()=>{
						resolve(complete);
	      	});

	      });
	    });
	  });
  }


  /**
  * Save the seller profile
  * @param data - seller profile data to be stored
  */
  saveSeller(data){
  	return new Promise((resolve, reject) => {
	    this._auth.getCurrentUser().then((currentUser) => {
	      data.uid = currentUser.uid;
	      this._dataService.database.child(this.SELLER_REF + currentUser.uid).update(data, (error) => {
	      	reject(error);
	      })
	      .then((complete)=>{
	      	resolve(complete);
	      });
	    });
	  });
  }

  /**
  *
  */
  getSeller(){
  	return new Promise((resolve, reject) => {
  		this._auth.getCurrentUser().then((currentUser) => {

  			let seller_ref = this.SELLER_REF + currentUser.uid;
  			this._dataService.database.child(seller_ref).once('value', (sellerSnap) => {

  				if(sellerSnap.exists()){
  					resolve(sellerSnap.val());
  				}else{
  					resolve(false);
  				}
  				
  			}, (error) =>{
  				reject(error);
  			});

  		});
  	});
  }

  /**
  * Get a basic object from the seller profile
  * @param seller_uid = Seller UID to be returned
  */
  getBasicSeller(seller_uid){
    return new Promise((resolve, reject) => {

      let com_name_ref = this.SELLER_REF + seller_uid + "/com_name";
      this._dataService.database.child(com_name_ref).once('value', (sellerSnap) => {

        if(sellerSnap.exists()){
          let image_ref = this.SELLER_REF + seller_uid + "/image";
          this._dataService.database.child(image_ref).once('value', (imageSnap) => {
            if(imageSnap.exists()){
              resolve({com_name: sellerSnap.val(), image: imageSnap.val()});
            }else{
              resolve(false);
            }
          }, (error) => {
            reject(error);
          });
        }else{
          resolve(false);
        }
        
      }, (error) =>{
        reject(error);
      });

    });
  }



  

}
