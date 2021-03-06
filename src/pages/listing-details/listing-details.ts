import { Component, ViewChild, ElementRef} from '@angular/core';
import { NavController, ModalController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { ProfileService } from '../../providers/profile.service';
import { ItemService } from '../../providers/item.service';

import { GalleryModal } from '../gallery-modal/gallery-modal';

import { ListingOrderPage } from '../listing-order/listing-order';

declare var google;

@Component({
  selector: 'page-listing-details',
  templateUrl: 'listing-details.html'
})
export class ListingDetailsPage {

	public listing: any;
	public listing_ref: string;
  public total_reviews: number;

  @ViewChild('map') mapElement: ElementRef;

  constructor(
  	public nav: NavController,
    public modalCtrl: ModalController,
  	public params: NavParams,
    public alertCtrl: AlertController,
  	public itemService: ItemService,
    public loadingCtrl: LoadingController,
  	private profileService: ProfileService
  ){}

  ionViewWillLoad() {
    // Get the Listing Key Reference form the nav params
    this.listing = this.params.get('listing');

    if(this.listing.reviews !== undefined ){
       this.total_reviews = this.listing.reviews.lenght;
    }else{
      this.total_reviews = 0;
    }

  }


  ionViewDidLoad() {
    if(this.listing.location.geolocation !== undefined ){
      this.createMap(this.listing.location.geolocation);

      let loading = this.loadingCtrl.create();
      loading.present();
      // Get profile location and distance if undefined
      if(this.listing.distance == undefined){
        this.listing['distance'] = 0;
        this.profileService.setCurrentLocation().then((profile) => {
          profile = this.profileService.getCurrentProfile();
          if(profile.location !== undefined){
            let location1 = [ profile.location.lat, profile.location.lng ];
            let location2 = [ this.listing.location.geolocation.lat, this.listing.location.geolocation.lng ];
            this.listing.distance = this.itemService.getItemDistance(location1, location2);
          }
          loading.dismiss();
        });
      }else{
        loading.dismiss();
      }

    }
  }

  // Create an new google maps
  private createMap(position) {

    //let latLng = new google.maps.LatLng(position.lat, position.lng);
    let mapOptions = {
      center: position,
      draggable: false,
      maxZoom: 12,
      minZoom: 10,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    
    let map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    map.setZoom(10);

    // let marker = new google.maps.Marker({
    //   position: position,
    //   map: map,
    //   title: 'Location'
    // });

    var cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 0,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: position,
      radius: 3000
    });

  }

  shareListing(){
    if(!this.isPreview()){
      console.log("share it!");
    }
  }

  setAsFavorite(){
    if(!this.isPreview()){
      console.log("Set as a favorite");
    }
  }

  showReviews(){
    if(!this.isPreview()){
      console.log("Show Reviews");
    }
  }

  /**
  * Handle the Image Modal
  */
  presentOrderModal() {
    if(!this.isPreview()){
      // this.nav.push(ListingOrderPage, { listing: this.listing });
      let orderModal = this.modalCtrl.create(ListingOrderPage, { listing: this.listing });
      orderModal.present();
    }else{
      let alert = this.alertCtrl.create({
        title: 'Listing preview',
        subTitle: 'This is how customers will see your listing',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  /**
  * Handle the Image Modal
  */
  presentImageModal() {
    // let imageModal = this.modalCtrl.create(ImageViewModalPage, { medias: this.listing.medias });
    // imageModal.present();

    let photos = this.listing.medias.map( function(media, index) {
      return { url: media.media_path };
    });

    let imageModal = this.modalCtrl.create(GalleryModal, {
      photos: photos,
      initialSlide: 0
    });
    imageModal.present();
  }

  /** 
  * Check if the current listing object is a preview or production listing
  */
  isPreview(): boolean{
    if(this.listing.preview === true){
      return true;
    }else{
      return false;
    }
  }


}