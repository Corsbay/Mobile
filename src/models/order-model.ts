/*
* Use under_score pattens to name model properties
*/

export class OrderModel{
  listing_snapshot: any;

  shipping_option: string = "";
  shipping_address: any;

  quantity: number = 1;
  subtotal: number = 0.00;
  total_price: number = 0.00;
  shipping_fee: number = 0.00;
  shipping_schedule: number;

  invoice: InvoiceModel;

  confirmed: boolean = false;
  buyer_uid: string = "";
  seller_uid: string = "";

  buyer_note: string = "";

  order_options: Array<OrderOption> = [];
  order_optional_items: Array<OptionalOrderItem> = [];

  status: string = "";
  status_history: Array<any> = []; 
  created_at: number = Date.now();
  update_at: number = Date.now();

}

// Define the object model for Invoice objects
export class InvoiceModel {
  currency: string = "USD";
  price: number = 0.00;
  quantity: number = 1;
  subtotal: number = 0.00;
  tax: number = 0.00;
  shipping_fee: number;
  total_price: number = 0.00;
}

// Define the object model for Order Options objects
export class OrderOption {
  description: string = "";
  value: string = "";
}

// Define the object model for Optional items objects
export class OptionalOrderItem {
  title: string = "";
  item_note: string = "";
  price: number = 0.00;
}

// { Open, Confirmed, Payed, Shipped, Delivered, Finished, Canceled}
// export class OrderStatus {
//   status: string = "Open";
//   current: boolean = true;
//   created_at: number = Date.now();
// }