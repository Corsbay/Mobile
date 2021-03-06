import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, NavParams } from 'ionic-angular';

import { ScheduleModalPage } from './form-schedule-modal';
import { ScheduleModel } from '../../models/item-draft-model';


@Component({
  selector: 'page-listing-form-schedule',
  templateUrl: 'listing-form-schedule.html'
})
export class ListingFormSchedulePage {

	public schedules: Array<ScheduleModel> = [];
	public data: any;

  constructor(
  	public nav: NavController,
  	public modalCtrl: ModalController,
  	public viewCtrl: ViewController,
  	public params: NavParams
  ){

    
  }

  ionViewDidLoad() {
  	this.data = this.params.get('data');
    if(this.data.schedule !== undefined){
      this.schedules = this.data.schedule;
    }
  }

  dismiss() {
    this.data.schedule = this.schedules;
		this.viewCtrl.dismiss(this.data);
	}


	setSchedule(){
		console.log("set the price");
	}

  deleteScheduleItem(item){
    this.schedules.splice(item, 1);
  }

	/**
  * Handle the Details Modal with the checkbox controle
  */
  presentScheduleModal(schedule?) {
    let scheduleModal = this.modalCtrl.create(ScheduleModalPage, { data: schedule });
    scheduleModal.onDidDismiss(data => {
      if(data){
        this.schedules.splice(data.day_number, 0, data);
        console.log(data);        
      }
    });
    scheduleModal.present();
  }

}