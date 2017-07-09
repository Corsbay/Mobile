import { Component, Input } from '@angular/core';
import { ActionSheetController, LoadingController, ViewController, NavParams, AlertController } from 'ionic-angular';

import { DataService } from '../../providers/data.service';
import { MediaService } from '../../providers/media.service';
import { ItemDraftService } from '../../providers/item-draft.service';
import { BaseService } from '../../providers/base.service';

@Component({
  selector: 'page-listing-images',
  templateUrl: 'listing-images.html'
})
export class ListingImagesPage {

  public data: any;
	public medias: Array<any> = [];
  public max_media: number;
	public orderState: boolean = false;
	public orderActionLabel: string = "Reorder";

  @Input() reorder: boolean = this.orderState;

  constructor(
  	public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public dataService: DataService,
    public mediaService: MediaService,
    public draftService: ItemDraftService,
    public actionSheetCtrl: ActionSheetController,
    public BaseApp: BaseService,
  	public params: NavParams
  ) {}

  ionViewDidLoad() {
    this.data = this.params.get('data');
    this.medias = this.data.medias;
    this.max_media = 6 - this.medias.length;
  }

  /*
  *
  */
  dismiss() {
    this.updateMediasRef(this.medias);
    this.data.medias = this.medias;
    this.viewCtrl.dismiss(this.data);
  }

  reorderList(){
  	if(this.orderState){
  		this.orderState = false;
  		this.orderActionLabel = "Reorder";
  	}else{
  		this.orderState = true;
  		this.orderActionLabel = "Done";
  	}
  }

  reorderItems(indexes) {
    let element = this.medias[indexes.from];
    this.medias.splice(indexes.from, 1);
    this.medias.splice(indexes.to, 0, element);
  }

  /*
  * Get picture with the media service
  * @param source The source to the picture, Library or Camera
  */
  getPicture(source){ 
    this.mediaService.getListingPicture(source).then((imageURI) => {
      if(imageURI) {
        let media = {media_path: imageURI};
        this.uploadPicture(media);
      }
    });
  }

  /*
  * Show the action sheet to the user set the source
  */
  cameraActionSheet(){
    if(this.max_media >= 1){
      let actionSheet = this.actionSheetCtrl.create({
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'Take Picture',
            icon: 'camera',
            handler: () => {
              this.getPicture("CAMERA");
            }
          },
          {
            text: 'Choose from Library',
            icon: 'images',
            handler: () => {
              this.getPicture("LIBRARY");
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
    }else{
      let title = "Limit Reached";
      let message = "Sorry! You reach your limit of 6 pictures";
      this.BaseApp.showAlert(title, message);
    }
  }

  /*
  * Update the database with the new set of medias
  */
  updateMediasRef(medias) {
      let medias_object = {medias: medias};
      this.draftService.updateItemDraft(this.data.key, medias_object)
      .catch((error) => {
        console.log(error);
        let title = "Ops! Sorry about that";
        this.BaseApp.showAlert(title, error.message);
      });
  }

  /**
  * Upload the picture to the database - Move this to listing.service!!!
  * @param media = media object with the picture path
  */
  uploadPicture(media){
    // this.loading.present();
    // Read the media to Blob file
    let blobFilePromise = this.mediaService.createBlobFile(media.media_path);
    // Upload the Blob file to the storate server
    let uploadTask = blobFilePromise.then((blobFile) =>{
      return this.draftService.uploadPicture(blobFile, this.data.key);
    }).catch((error) => {
      console.log(error.message);
    });

    Promise.all([blobFilePromise, uploadTask]).then((results) => {
      // Index 1 contein a firebase URI to download the image
      media.media_path = results[1]; 
      this.medias = this.medias[0].holder ? [] : this.medias;
      this.medias.splice(0,0,media);
      this.max_media--;

      this.updateMediasRef(this.medias);
    })
    .catch((error) => {
      console.log(error.message);
      let title = "Ops! Sorry about that";
      this.BaseApp.showAlert(title, error.message);
    });
  }


  /**
  * Delete a image from the storage and its reference from the database
  * @param index - Image position within the media array
  */
  deleteImage(index) {
    let image_url = this.medias[index].media_path;
    let image_ref = this.medias[index].holder ? false : this.dataService.storage.refFromURL(image_url);

    if(image_ref){
      let bkp_medias = this.medias;
      this.medias.splice(index, 1);
      // Delete the item from the stoage and wipe it out of the database 
      image_ref.delete().then(() => {
        bkp_medias = null;
        this.updateMediasRef(this.medias);
      }).catch((error) => {
        console.log(error.message);
        this.medias = bkp_medias;
      });
    }else{
      if(this.medias.length > 1) {
        this.medias.splice(index, 1);
        this.updateMediasRef(this.medias);
      }
    }

    // If all pictures has ben deleted, set the holder again
    if(this.medias.length < 1) {
      this.medias.push({media_path: this.mediaService.DEFAULT_PICTURE, holder: true});
      this.updateMediasRef(this.medias);
    }
  }

  /**
  * Show a alert confirm before delete the image
  * @param index - Image position within the media array
  */ 
  confirmDeleteImage(index) {
    let confirm = this.alertCtrl.create({
      title: 'Delete Image',
      message: 'Are you sure you want to delete this image?',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.deleteImage(index);
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel the action');
          }
        }
      ]
    });
    confirm.present();
  }

  /**
  *
  */
	showPicture() {
		
	}

}
