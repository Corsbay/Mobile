import { Component, Input } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import 'rxjs/Rx';

import { ProfileService } from '../../providers/profile.service';
import { BaseService } from '../../providers/base.service';
import { MediaService } from '../../providers/media.service';

import { ProfileModel } from '../../models/profile-model';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { WalkthroughPage } from '../walkthrough/walkthrough';

@Component({
  selector: 'profile-form-page',
  templateUrl: 'profile-form.html'
})
export class ProfileFormPage {

  @Input()  src: string;

  public ProfileForm: FormGroup;
  // make WalkthroughPage the root (or first) page
  public rootPage: any = WalkthroughPage;
  public profile: ProfileModel = new ProfileModel();
  public tempImage: any;

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    public BaseApp: BaseService,
    public profileService: ProfileService,
    public mediaService: MediaService,
    public actionSheetCtrl: ActionSheetController
  ){

    this.ProfileForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      gender: new FormControl(),
      birthday: new FormControl(),
      about: new FormControl(),
      currency: new FormControl(),
      weather: new FormControl(),
      notifications: new FormControl()
    });
  }

  /**
  *
  */
  ionViewWillEnter() {
    this.profile = this.profileService.getCurrentProfile();
    
    if(this.profile.uid !== undefined){
      this.setProfile(this.profile);
    }
  }

  /** 
  * Set the default profile object
  * @param profile - Profile data to be setted in the profile object
  */
  setProfile(profile){
    if(profile){
      this.ProfileForm.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          gender: profile.gender,
          birthday: profile.birthday,
          about: profile.about,
          currency: 'USD',
          weather: 'fahrenheit',
          notifications: true
        });
     }
  }

  saveProfile(){
    let loading = this.loadingCtrl.create();
    loading.present();
    if(this.ProfileForm.valid){

      var saveTask: Promise<any>;

      /* set the new data to the profile objetct */
      this.profile.firstName = this.ProfileForm.value.firstName;
      this.profile.lastName = this.ProfileForm.value.lastName;
      this.profile.gender = this.ProfileForm.value.gender;
      this.profile.birthday = this.ProfileForm.value.birthday;
      this.profile.about = this.ProfileForm.value.about;
      this.profile.currency = this.ProfileForm.value.currency;

      /**
      * If there is a temp image create a new Blob file and chain 
      * the promises to upload the file and save the profile
      */
      if(this.tempImage){

        let blobFilePromise = this.mediaService.createBlobFile(this.tempImage);
        let uploadTask = blobFilePromise.then((blobFile) =>{
          return this.profileService.uploadPicutre(blobFile, this.profile.uid);
        });

        saveTask = Promise.all([blobFilePromise, uploadTask]).then((results) => {
          console.log('Promises Results',results);
          this.profile.image = results[1];
          return this.profileService.saveProfile(this.profile);
        });

      }else{
        saveTask = this.profileService.saveProfile(this.profile);
      }

      saveTask.then((prom) => {

        /* Set the simple Profile */
        let fullName = this.profile.firstName +" "+ this.profile.lastName;
        let shortProfile = {
            fullName: fullName,
            image: this.profile.image,
            email: this.profile.email
          }
        this.profileService.saveShortProfile(this.profile.uid, shortProfile)
        .catch((error) => {
          console.log("Erro Saving Short Profile ", error.message);
        });

        loading.dismiss();
        // Go back to profile page
        if(this.nav.canGoBack()){
          
          this.nav.pop();
        }
      });
      
      saveTask.catch((error) => {
        loading.dismiss();
        let title = "Ops! Sorry about that";
        let msg = "We couldn't save the profile information, please check your connection" ;
        this.BaseApp.showAlert(title, error.message);
      });

    }else{
      loading.dismiss();
      this.BaseApp.showAlert("Invalid Data", "The profile data is invalid");
    }
  }

  /**
  * Open the device camera or image labrary
  */
  doGetPicture(source){
    if(this.profile.uid){
      this.mediaService.getProfilePicture(source).then((imageURI) => {
        if(imageURI) {
          this.profile.image = imageURI;
          this.tempImage = imageURI;
        }
      });
    }
  }

  /**
  * Show the options to the device camera or image library 
  */
  cameraActionSheet(){
    let actionSheet = this.actionSheetCtrl.create({
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Take Picture',
          icon: 'camera',
          handler: () => {
            this.doGetPicture("CAMERA");
          }
        },
        {
          text: 'Choose from Library',
          icon: 'images',
          handler: () => {
            this.doGetPicture("LIBRARY");
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            actionSheet.dismiss();
          }
        },

      ]
    });
    actionSheet.present();
  }

  /**
  * Log out the current user
  */
  logout() {
    // navigate to the new page if it is not the current page
    console.log("Implement the logout methos from here");
    //this.nav.setRoot(this.rootPage);
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
