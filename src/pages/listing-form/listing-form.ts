import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { ActionSheetController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { ListingPage } from '../listing/listing';

// import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { BaseService } from '../../providers/base.service';
import { ItemDraftService } from '../../providers/item-draft.service';
import { MediaService } from '../../providers/media.service';

import { ItemService } from '../../providers/item.service';

/* Pages */
import { ListingFormCategoriesPage } from '../listing-form-categories/listing-form-categories';
import { ListingFormDescPage } from '../listing-form-desc/listing-form-desc';
import { ListingFormPricePage } from '../listing-form-price/listing-form-price';
import { ListingFormDetailsPage } from '../listing-form-details/listing-form-details';
import { LocationModalPage, } from '../location-modal/location-modal';
import { ListingImagesPage } from '../listing-images/listing-images';

import { ListingDetailsPage } from '../listing-details/listing-details';

@Component({
  selector: 'listing-form-page',
  templateUrl: 'listing-form.html',
  providers: [ItemDraftService]
})
export class ListingFormPage {

  public listing: any;
  public categories: Array<any>;
  public startForm: FormGroup;
  public new_listing: boolean = true;

  public legalStatement: string = "By tapping Publish Item, you agree to pay the fees above, accept the listing conditions above, and assume full responsability for the content of the listing and item offred.";

  public steps_validation: number = 0;
  public publish_disabled: boolean = true;
  public formControlRadio: any = {
    categories: "radio-button-off",
    description:"radio-button-off",
    description_label: "Set a title and summary",
    location: "radio-button-off",
    price: "radio-button-off",
    details: "radio-button-off"
  }

  public listing_ref: string = null;
  public max_media: number = 6;
  public temp_medias: Array<any> = [];
  public loading: any;

  constructor(
    public nav: NavController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public params: NavParams,
    public BaseApp: BaseService,
    public profileService: ProfileService,
    public draftService: ItemDraftService,
    public mediaService: MediaService,
    public itemService: ItemService
  ){

    this.startForm = new FormGroup({
      category: new FormControl('', Validators.required)
    });

    this.loading = this.loadingCtrl.create();
  }

  ionViewWillEnter(){

    // Get the Listing Key Reference form the nav params
    this.listing_ref = this.params.get('key');

    // Load categories
    this.draftService.getCategories().subscribe((data) => { 
        this.categories = data;
      },
      error => { console.log(error) }
    );

    // Set the temporary media holder
    this.setTempMedia();

    // test if the form is an new entry
    if(this.listing_ref !== undefined){
      this.new_listing = false;
      // Load the listing data from the database and set into the view
      this.loadItemDraft();
    }

  }

  /*
  * Set the temporary media holder
  */
  setTempMedia() {
    let i = this.max_media;
    while(i--) {
      this.temp_medias.push({media_path: this.mediaService.DEFAULT_PICTURE, holder: true});
    }
  }

  /**
  * Save the listing type and show the next listing form
  */
  nextListingForm() {
    if(this.startForm.valid){      
      this.draftService.loadItemDraft(null).then((result) => {

        if(result["listing"] !== null) { 

          this.listing_ref = result["key"];
          this.listing = result["listing"];

          this.listing.categories[this.startForm.value.category] = true;

          this.draftService.updateItemDraft(this.listing_ref, this.listing.categories)
          .then(()=>{
            this.new_listing = false;
            this.formControlRadio.categories = "checkmark-circle-outline";
          });


        }else{
          console.log("Listing is null - ", result);
        }
        
      })
      .catch(error => {
        console.log(error);
      });
      
    }
  }


  /**
  * Load the listing data
  */
  loadItemDraft() {

    this.draftService.loadItemDraft(this.listing_ref).then((result) => {

      this.listing = result["listing"];
      if(!this.listing_ref){
        this.listing_ref = result["key"];
      }
      this.listing['key'] = this.listing_ref;

      // Set the UI Form values on into the view
      this.listing.medias.forEach((media, key) => {
        this.temp_medias.splice(key,0,media);
        this.temp_medias.pop();
      });

      // setup the radio boxies when the form have been saved
      if(this.listing.form_control !== undefined){
        Object.keys(this.listing.form_control).map(key => {
          if(this.listing.form_control[key] === true){
            this.formControlRadio[key] = "checkmark-circle-outline";
            this.steps_validation++;
          }
        });
      }

      this.checkPublishValidation();
    });

  }

  /**
  * Check if all the steps are true and enable the 
  * publishing toggle
  */
  checkPublishValidation(){
    if(this.listing.medias.length > 1 && this.steps_validation === 5){
      this.publish_disabled = false;
    }else{
      this.publish_disabled = true;
    }
  }

  /**
  * Save each step of the form
  */
  saveStep(){
    if(this.listing !== undefined && this.listing_ref){

      let check = 5;
      Object.keys(this.listing.form_control).map( ctrl_key => {
        if(this.listing.form_control[ctrl_key] === true){
          if(this.steps_validation < check){
            this.steps_validation++;
          }
        }else{
          if(this.steps_validation > 0){
            this.steps_validation--;
            check--;
          }
        }
      });

      this.checkPublishValidation();

      this.draftService.updateItemDraft(this.listing_ref, this.listing).catch((error) => {
        console.log(error);
        let title = "Ops! Sorry about that";
        this.BaseApp.showAlert(title, error.message);
      });

    }
  }

  /**
  * Set the listing draft as an item to be published
  */
  publishListing(){
    this.loading.present();
    if(this.listing.medias.length > 1 && this.steps_validation === 5){
      this.itemService.publishItem(this.listing).then( response => {

        this.listing['published'] = true;
        this.saveStep();

        this.loading.dismiss();

      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  /**
  * Handle the Images Modal
  */
  presentImagesModal() {
    let imagesModal = this.modalCtrl.create(ListingImagesPage, { data: this.listing });
    imagesModal.onDidDismiss(data => {

      this.setTempMedia();
      data.medias.forEach((media, key) => {
        this.temp_medias.splice(key,1,media);
      });
      
      this.listing = data;
      //this.saveStep();
    });
    imagesModal.present();
  }

  /**
  * Handle the Categories Modal with the checkbox controle
  */
  presentCategoriesModal() {
    let catModal = this.modalCtrl.create(ListingFormCategoriesPage, { data: this.listing });
    catModal.onDidDismiss(data => {
      // Check if data return valid Listing Object
      if(data !== null){
        if(data.form_control.categories === true){
          this.formControlRadio.categories = "checkmark-circle-outline";
        }else{
          this.formControlRadio.categories = "radio-button-off";
        }
        this.listing = data;
        this.saveStep();
      }
    });
    catModal.present();
  }


  /**
  * Handle the Description Modal with the checkbox controle
  */
  presentDescriptionModal() {
    let descModal = this.modalCtrl.create(ListingFormDescPage, { data: this.listing });
    descModal.onDidDismiss(data => {
      // Check if data return valid Listing Object
      if(data !== null){
        if(data.form_control.description === true){
          this.formControlRadio.description = "checkmark-circle-outline";
        }else{
          this.formControlRadio.description = "radio-button-off";
        }
        this.listing = data;
        this.saveStep();
      }
    });
    descModal.present();
  }

  /**
  * Handle the Location Modal with the checkbox controle
  */
  presentLocationModal() {
    let locationModal = this.modalCtrl.create(LocationModalPage, { data: this.listing });
    locationModal.onDidDismiss(data => {
      if(data.location.geolocation){ 

        if(data.form_control.location === true){
          this.formControlRadio.location = "checkmark-circle-outline";
        }else{
          this.formControlRadio.location = "radio-button-off";
        }
        this.listing = data;
        this.saveStep();
      }
    });
    locationModal.present();
  }

  /**
  * Handle the Price Modal with the checkbox controle
  */
  presentPriceModal() {
    let priceModal = this.modalCtrl.create(ListingFormPricePage, { data: this.listing });
    priceModal.onDidDismiss(data => {
      // Check if data return valid Listing Object
      if(data !== null){
        if(data.form_control.price === true){
          this.formControlRadio.price = "checkmark-circle-outline";
        }else{
          this.formControlRadio.price = "radio-button-off";
        }
        this.listing = data;
        this.saveStep();
      }
    });
    priceModal.present();
  }

  /**
  * Handle the Details Modal with the checkbox controle
  */
  presentDetailsModal() {
    let detailsModal = this.modalCtrl.create(ListingFormDetailsPage, { data: this.listing });
    detailsModal.onDidDismiss(data => {
      // Check if data return valid Listing Object
      if(data !== null){
        if(data.form_control.details === true){
          this.formControlRadio.details = "checkmark-circle-outline";
        }else{
          this.formControlRadio.details = "radio-button-off";
        }
        this.listing = data;
        this.saveStep();
      }
    });
    detailsModal.present();
  }

  closeForm(){
    this.nav.setRoot(ListingPage);
  }

  /**
  * Show the listing preview details of a item
  */
  listingPreview(): void{
    let preview_listing = this.itemService.setItem(this.listing);
    preview_listing['preview'] = true;
    this.nav.push(ListingDetailsPage, { listing: preview_listing});
  }


}
