import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, NavParams } from 'ionic-angular';
// import { Validators, FormGroup, FormControl } from '@angular/forms';

import { ItemDraftService } from '../../providers/item-draft.service';

@Component({
  selector: 'page-listing-form-categories',
  templateUrl: 'listing-form-categories.html'
})
export class ListingFormCategoriesPage {

	public data: any;
  public categories: Array<any> = [];

  constructor(
  	public nav: NavController, 
  	public viewCtrl: ViewController,
  	public params: NavParams,
  	public listingService: ItemDraftService
  ){

  }

  ionViewDidLoad() {
    this.data = this.params.get('data');

    // Load categories
    this.listingService.getCategories().subscribe((data) => { 
        this.categories = data;

        if(this.data.categories !== undefined ){
          Object.keys(this.data.categories).forEach((category) => {
            for(let i = 0; i < this.categories.length; i++) {
              if(category === this.categories[i].category){
                this.categories[i].checked = true;
                break;
              }
            }
          });
        }

      },
      error => { console.log(error) }
    );
  }

  /*
  * Save the selected categories to tha data object container
  */
  save() {

    this.data.categories = {};
	  this.categories.forEach((category) => {
      if(category.checked){
        this.data.categories[category.category] = true;
      }
    });

 
		if(Object.keys(this.data.categories).length > 0){
			this.data.form_control.categories = true;
		}else{
			this.data.form_control.categories = false;
		}
		this.viewCtrl.dismiss(this.data);
	}

  cancel() {
    this.viewCtrl.dismiss(null);
  }

}
