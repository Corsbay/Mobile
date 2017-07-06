import { Component } from '@angular/core';
import { ViewController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';


import { OptionsModalPage } from './form-options-modal';


@Component({
  selector: 'page-listing-form-options',
  templateUrl: 'listing-form-options.html'
})
export class ListingFormOptionsPage {

  public formOptions: FormGroup;
  public options: Array<string> = [];
	public data: any;

  constructor(
  	public viewCtrl: ViewController,
  	public params: NavParams,
    public alertCtrl: AlertController
  ){
    this.formOptions = new FormGroup({
      label: new FormControl('', Validators.required)
    });
  }

  ionViewDidLoad() {
  	this.data = this.params.get('data');
    let index = this.params.get('index');

    if(this.data.options !== undefined){
      if(index != 0) {
        this.options = this.data.options[index];
        this.formOptions.setValue({label: index});
      }
    }else{
      this.data['options'] = {};
    }
  }

  /*
  */
  save() {
    let label = this.formOptions.value.label;
    this.data.options[label] = this.options;
    if(this.formOptions.valid && this.options.length > 0){
		  this.viewCtrl.dismiss({label: label, data: this.data});
    }
	}

  /*
  */
  cancel() {
    this.viewCtrl.dismiss(null);
  }

  /*
  */
  deleteOptionsItem(item){
    this.options.splice(item, 1);
  }

	/**
  * Handle the option pronpt alert
  */
  optionsPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Option',
      inputs: [
        {
          name: 'option'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            if (data.option) {
              this.options.splice(0, 0, data.option);  
            } else {
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

    // presentOptionsModal(schedule?) {
  //   let optionsModal = this.modalCtrl.create(OptionsModalPage, { data: schedule });
  //   optionsModal.onDidDismiss(data => {
  //     if(data){
  //       this.options.splice(data.day_number, 0, data);
  //       console.log(data);        
  //     }
  //   });
  //   optionsModal.present();
  // }

}