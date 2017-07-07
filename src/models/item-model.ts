/*
* Use under_score pattens to name model properties
*/

export class ItemModel {
  active: boolean = true;
  title: string = "";
  summary: string = "";
  description: string = "";
  privacity: string = "public";

  // Shipping data
  shipping_fee: number = 0.00;
  shipping_processing_time: string = "";
  refund_policies: string = "";
  cancellation_policies: string = "";
  additional_policies: string = "";

  condition: string = "";
  condition_details: string = "";
  item_measure: string = "";
  confirmation: boolean = false;
  categories: any = {};

  search_tags: string = "";

  main_price: number = 14.00;
  promotion_price: number = 0.00;
  currency: string = "USD";

  schedule: Array<any> = [];

  total_favorites: number = 0;
  total_reviews: number =  0;
  total_rate: number = 4.5;

  location: any = {};
  medias: Array<any> = [];
  reviews: Array<ReviewModel> = [];

  seller_uid: string = "";
}


export class SimpleItemModel {
  title: string = "";
  description: string = "";
  privacity: string = "public";
  media: string = "";
  total_favorites: number = 0;
  total_reviews: number =  0;
}


export class RecentItemsModel {
  items: Array<SimpleItemModel>;
  populars: Array<SimpleItemModel>;
  categories: Array<SimpleItemModel>;
  banner_title: string;
  banner_image: string;
}

export class ReviewModel {
  comment: string = "";
  user_uid: string = "";
  user_name: string = "";
  user_image: string = "";
  item_uid: string = "";
  evaluation: Array<any> = [];
  media: Array<any> = [];
  active: boolean = true;
  created_at: number = Date.now();
  updated_at: number = Date.now();
}