import { Component, Input } from '@angular/core';
import { NavController, MenuController, SegmentButton, NavParams, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';

import { ProfileFormPage } from '../profile-form/profile-form';
import { ProfileFormAddressPage } from '../profile-form-address/profile-form-address';

import { SellerService } from '../../providers/seller.service';
import { SellerFormPage } from '../seller-form/seller-form';

import { ListingUserPage } from '../listing-user/listing-user';
import { FollowersPage } from '../followers/followers';

import 'rxjs/Rx';

import { ProfileModel } from '../../models/profile-model';
import { BaseService } from '../../providers/base.service';
import { ProfileService } from '../../providers/profile.service';

@Component({
  selector: 'profile-page',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  @Input()  src: string;

  public display: string;
  public profile: ProfileModel = new ProfileModel();
  // public seller: any;

  public primaryAddress: any;

  constructor(
    public menu: MenuController,
    public nav: NavController,
    public navParams: NavParams,
    public BaseApp: BaseService,
    public profileService: ProfileService,
    public sellerService: SellerService,
    public loadingCtrl: LoadingController
  ){

    this.display = "list";
  }

  ionViewWillLoad() {

    let loading = this.loadingCtrl.create();
    loading.present();
    // Set a observabole to fecth the updated profile object
    this.profileService.fetchProfile().on("value", (profileSnap) =>{

      if(profileSnap.val()){
        this.profile = profileSnap.val();

        if(this.profile.addresses !== undefined ){
          this.primaryAddress = this.profile.addresses.find(function(address){
            return address.primary == true;
          });
        }

        // if(this.profile.seller_profile){
        //   this.sellerService.getSeller().then((seller) => {
        //     this.seller = seller;
        //   });
        // }

        loading.dismiss();
      }

    }, (error) => {
      console.log(error.message);
    });
  
  }

  goToFollowersList() {
    // close the menu when clicking a link from the menu
    // this.menu.close();
    // this.app.getRootNav().push(FollowersPage, {
    //   list: this.profile.followers
    // });
  }

  goToFollowingList() {
    // close the menu when clicking a link from the menu
    // this.menu.close();
    // this.app.getRootNav().push(FollowersPage, {
    //   list: this.profile.following
    // });
  }

  /**
  *
  */
  setSeller() {
    this.nav.push(SellerFormPage, { profile: this.profile });
  }

  goToUserListing(){
    this.nav.push(ListingUserPage);
  }

  editProfile() {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.nav.push(ProfileFormPage);
  }

  /**
  * Show the profile shipping address screen
  */
  profileAddress() {
    this.nav.push(ProfileFormAddressPage, { profile: this.profile });
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    // console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // console.log('Segment selected', segmentButton.value);
  }
}
