import { Component, Input } from '@angular/core';
import { NavController, ModalController, LoadingController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { SellerService } from '../../providers/seller.service';
import { ProfileService } from '../../providers/profile.service';

import { SellerModel } from '../../models/seller-model';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

@Component({
  selector: 'seller-form-page',
  templateUrl: 'seller-form.html'
})
export class SellerFormPage {

  public sellerForm: FormGroup;
  public profile: any;
  public seller: SellerModel = new SellerModel();

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public params: NavParams,
    public loadingCtrl: LoadingController,
    public sellerService: SellerService
  ){

    this.sellerForm = new FormGroup({
      com_name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      about: new FormControl(''),
      currency: new FormControl('')
      // street_1: new FormControl('', Validators.required),
      // street_2: new FormControl(''),
      // city: new FormControl('', Validators.required),
      // state: new FormControl('', Validators.required),
      // zip_code: new FormControl('', Validators.required)
    });

  }

  /**
  *
  */
  ionViewWillEnter() {
    this.profile = this.params.get('profile');
    console.log(this.profile);
    
    //Set image
    this.seller.image = this.profile.image;

    this.sellerService.getSeller().then((seller) => {
      if(seller){
        this.setSeller(seller);
      }else{
        this.sellerService.createSeller(this.seller);
      }
    })
    .catch((error)=>{
      console.log(error);
    });
  }

  /** 
  * Set the default profile object
  * @param profile - Profile data to be setted in the profile object
  */
  setSeller(seller){
    if(seller){
      this.sellerForm.patchValue({
        com_name: seller.com_name,
        phone: seller.phone,
        email: seller.email,
        about: seller.about,
        currency: seller.currency
        // street_1: seller.street_1,
        // street_2: seller.street_2,
        // city: seller.city,
        // state: seller.state,
        // zip_code: seller.zip_code
      });
    }
  }

  /**
  *
  */
  saveSeller(){
    let loading = this.loadingCtrl.create();
    loading.present();

    if(this.sellerForm.valid){

      /* set the new data to the seller profile objetct */
      this.seller.com_name =  this.sellerForm.value.com_name;
      this.seller.phone = this.sellerForm.value.phone;
      this.seller.email = this.sellerForm.value.email;

      this.seller.about = this.sellerForm.value.about;
      this.seller.currency = this.sellerForm.value.currency;

      // this.seller.street_1 = this.sellerForm.value.street_1;
      // this.seller.street_2 = this.sellerForm.value.street_2;
      // this.seller.city = this.sellerForm.value.city;
      // this.seller.state = this.sellerForm.value.state;
      // this.seller.zip_code = this.sellerForm.value.zip_code;

      this.sellerService.saveSeller(this.seller).then(()=>{
        loading.dismiss();
      })
      .catch((error) => {
        loading.dismiss();
        console.log(error);
      })
 
    }else{
      loading.dismiss();
      console.log("Invalid data");
      // this.BaseApp.showAlert("Invalid Data", "The seller profile data is invalid");
    }
  }

  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }
}
