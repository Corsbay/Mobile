import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';

import { ItemDraftService } from '../../providers/item-draft.service';
import { ListingFormOptionsPage } from '../listing-form-options/listing-form-options';
import { ListingFormSchedulePage } from '../listing-form-schedule/listing-form-schedule';

@Component({
  selector: 'page-listing-form-details',
  templateUrl: 'listing-form-details.html'
})
export class ListingFormDetailsPage {

	public formDetails: FormGroup;
	public data: any;
  public conditions: any;
  public itemOptions: Array<string> = [];

  public default_shipping_policies: any = {
    shipping_processing_time: "1 to 3 days",
    refund_policies: "No refunds, all sales are final.",
    cancellation_policies: "You can cancel your order within 12 hours from the time your order was placed.",
    additional_policies: "If you need to know anything else, feel free to ask, thank you for your business."
  }

  constructor(
  	public nav: NavController,
    public modalCtrl: ModalController,
  	public viewCtrl: ViewController,
  	public alertCtrl: AlertController,
    public listingService: ItemDraftService,
  	public params: NavParams
  ){

  	this.formDetails = new FormGroup({

      shipping_fee: new FormControl(0.00),
      shipping_processing_time: new FormControl(this.default_shipping_policies.shipping_processing_time),
      refund_policies: new FormControl(this.default_shipping_policies.refund_policies),
      cancellation_policies: new FormControl(this.default_shipping_policies.cancellation_policies),
      additional_policies: new FormControl(this.default_shipping_policies.additional_policies),

      condition: new FormControl(''),
      condition_details: new FormControl(''),
      item_measure: new FormControl('', Validators.required),
      confirmation: new FormControl(false)
    });
  }

  ionViewDidLoad() {
    this.data = this.params.get('data');

    this.conditions = this.listingService.getItemConditions();

    // Set item options
    if(this.data.options != undefined){
      Object.keys(this.data.options).map(key => {
        this.itemOptions.push(key);
      });
    }

    this.formDetails.setValue({
      shipping_fee: this.data.shipping_fee,
      shipping_processing_time: this.data.shipping_processing_time,
      refund_policies: this.data.refund_policies,
      cancellation_policies: this.data.cancellation_policies,
      additional_policies: this.data.additional_policies,

      condition: this.data.condition,
      condition_details: this.data.condition_details,
     //  measure_unit: this.data.measure_unit,
    	item_measure: this.data.item_measure,
      confirmation: this.data.confirmation
    });
  }

  /*
  *
  */
  save() {
    //Set shipping data
    this.data.shipping_fee = this.formDetails.value.shipping_fee;
    this.data.shipping_processing_time = this.formDetails.value.shipping_processing_time;
    this.data.refund_policies = this.formDetails.value.refund_policies;
    this.data.cancellation_policies = this.formDetails.value.cancellation_policies;
    this.data.additional_policies = this.formDetails.value.additional_policies;

    this.data.condition = this.formDetails.value.condition;
    this.data.condition_details = this.formDetails.value.condition_details;
    this.data.item_measure = this.formDetails.value.item_measure;
    this.data.confirmation = this.formDetails.value.confirmation;

		if(this.formDetails.valid){
			this.data.form_control.details = true;
		}else{
			this.data.form_control.details = false;
		}
		this.viewCtrl.dismiss(this.data);
	}

  /**
  *
  */
  cancel(){
    this.viewCtrl.dismiss(null);
  }

  /**
  * Handle the Options Modal
  * @param index The option index, if not defined default is 0
  */
  presentOptionsModal(index = 0) {
    let optionsModal = this.modalCtrl.create(ListingFormOptionsPage, { data: this.data, index: index });
    optionsModal.onDidDismiss(data => {
      if(data != null){
        this.data = data.data;
        if(index == 0){
          this.itemOptions.push(data.label);
        }
      }
    });
    optionsModal.present();
  }

  /*
  *
  */
  deleteItemOption(index){
    delete this.data.options[index];
    this.itemOptions.splice(this.itemOptions.indexOf(index), 1);
    console.log(this.data.options, this.itemOptions);
  }

}
