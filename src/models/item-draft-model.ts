/*
* Use under_score pattens to name model properties
*/

export class ItemDraftModel {
  published: boolean = false;
  title: string = "";
  summary: string = "";
  description: string = "";

  // Shipping information
  shipping_fee: number = 0.00;
  shipping_processing_time: string = "";
  refund_policies: string = "";
  cancellation_policies: string = "";
  additional_policies: string = "";

  condition: string = "";
  condition_details: string = "";
  item_measure: string = "";
  confirmation: boolean = false;

  location: LocationModel = {
      address: "",
      geolocation: { lat: 38.046386, lng: -87.551769 }
    }

  categories: Array<any> = [];
  price: PriceModel;
  medias: Array<any> = [];
  options: any = {};

  privacity: string = "public";
  created_at: number = Date.now();
  update_at: number = Date.now();
  form_control: FormControlModel = new FormControlModel();

}

export class FormControlModel {
  categories: boolean =  false;
  description: boolean = false;
  location: boolean = false;
  price: boolean = false;
  details: boolean = false;
}

export class LocationModel{
  address: string = "";
  geolocation: any = {};
}


export class MediaModel{
  media_name: string =  "";
  media_path: string = "";
  media_type: string = "image/jpg";
  // created_at: number = Date.now();
  // updated_at: number = Date.now();
}

export class PriceModel{
  main_price: number = 18.46;
  long_term_price: number = 0.00;
  currency: string = "USD";
}

export class ScheduleModel{
  day: string = "";
  day_number: number;
  from_time: string = "";
  to_time: string = "";
  status: boolean = true;
  promo_price: boolean = false;
}
