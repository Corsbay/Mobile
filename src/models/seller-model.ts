export class SellerModel {
  com_name: string  = "";
  email: string  = "";
  phone: string  = "";
  about: string  = "";
  image: string  = "./assets/images/profile/default-avatar.png";

  currency: string = "";

  // street_1: string = "";
  // street_2: string = "";
  // city: string = "";
  // state: string = "";
  // zip_code: string = "";
  // country: string = "";

  favorites: Array<any> = [];
  reviews: Array<any> = [];

  location: any  = {};

  seller_type: string = "Basic";
  license_number: string = "";
  verified_info: Array<any> = [];
  created_at: number = Date.now();
}


export class BusinessAddressModel {
  street_1: string = "";
  street_2: string = "";
  city: string = "";
  state: string = "";
  zip_code: string = "";
  phone: string = "";
  country: string = "";
  primary: boolean = false;
}


export class SellerType {
  type: Array<string> = [
    'Basic',
    'Restaurant',
    'Farmer',
    'Licensed chef'
  ]
}