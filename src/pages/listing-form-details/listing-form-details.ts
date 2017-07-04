import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';

import { ListingService } from '../../providers/listing.service';
import { ListingFormSchedulePage } from '../listing-form-schedule/listing-form-schedule';

@Component({
  selector: 'page-listing-form-details',
  templateUrl: 'listing-form-details.html'
})
export class ListingFormDetailsPage {

	public formDetails: FormGroup;
	public data: any;
  public conditions: any;
  public measureUnits: any;

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
    public listingService: ListingService,
  	public params: NavParams
  ){

  	this.formDetails = new FormGroup({

      shipping: new FormControl(false),
      shipping_fee: new FormControl(0.00),
      shipping_processing_time: new FormControl(this.default_shipping_policies.shipping_processing_time),
      refund_policies: new FormControl(this.default_shipping_policies.refund_policies),
      cancellation_policies: new FormControl(this.default_shipping_policies.cancellation_policies),
      additional_policies: new FormControl(this.default_shipping_policies.additional_policies),

      condition: new FormControl(''),
      condition_details: new FormControl(''),
      measure_unit: new FormControl('', Validators.required),
      unit_value: new FormControl(1, Validators.required),
      confirmation: new FormControl(false)
    });
  }

  ionViewDidLoad() {
    this.data = this.params.get('data');

    console.log(this.data);
    this.conditions = this.listingService.getItemConditions();
    this.measureUnits = this.listingService.getMeasureUnits();

    this.formDetails.setValue({

      shipping: this.data.shipping,
      shipping_fee: this.data.shipping_fee,
      shipping_processing_time: this.data.shipping_processing_time,
      refund_policies: this.data.refund_policies,
      cancellation_policies: this.data.cancellation_policies,
      additional_policies: this.data.additional_policies,

      measure_unit: this.data.measure_unit,
    	unit_value: this.data.unit_value,
      confirmation: this.data.confirmation
    });
  }

  save() {

    //Set shipping data
    this.data.shipping = this.formDetails.value.shipping;
    this.data.shipping_fee = this.formDetails.value.shipping_fee;
    this.data.shipping_processing_time = this.formDetails.value.shipping_processing_time;
    this.data.refund_policies = this.formDetails.value.refund_policies;
    this.data.cancellation_policies = this.formDetails.value.cancellation_policies;
    this.data.additional_policies = this.formDetails.value.additional_policies;

    this.data.measure_unit = this.formDetails.value.measure_unit;
    this.data.unit_value = this.formDetails.value.unit_value;
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
  * Handle the Schedule Modal with the checkbox controle
  */
  presentScheduleModal() {
    let scheduleModal = this.modalCtrl.create(ListingFormSchedulePage, { data: this.data });
    scheduleModal.onDidDismiss(data => {
      this.data = data;
    });
    scheduleModal.present();
  }

}
