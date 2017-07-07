/*
* Use under_score pattens to name model properties
*/

// Ajust propertins name patterns!!!!!!!!

export class ProfileModel {
  uid: string = "";
  first_name: string  = "";
  last_name: string  = "";
  gender: string = "" ;
  birthday: string = "";
  about: string  = "I am a good person.";
  image: string  = "./assets/images/profile/default-avatar.png";
  email: string  = "";
  phone: string  = "";

  location: any  = {};
  addresses: Array<ProfileAddressModel> = [];
  short_profile: ShortProfileModel;
  languages: Array<any> = [];
  currency: Array<any> = [];

  balance_account: string;
  favorites: Array<any> = [];
  reviews: Array<any> = [];
  messages: Array<any> = [];
  bookings: Array<any> = [];
  verified_info: Array<any> = [];
  seller_profile: boolean = false;
  created_at: number = Date.now();
}

export class ShortProfileModel{
  fullName: string = "";
  image: string = "./assets/images/profile/default-avatar.png";
  email: string = "";
}

export class ProfileAddressModel {
  full_name: string = "";
  street_1: string = "";
  street_2: string = "";
  city: string = "";
  state: string = "";
  zip_code: string = "";
  phone: string = "";
  country: string = "";
  primary: boolean = false;
}

// export class ProfilePaymentMethods {
  
// }

export class UserModel {
  uid: string;
  first_name: string;
  last_name: string;
  image: string;
  email: string;
  phone: string;
  location: string;
  about: string;
}


export class ProfilePostModel {
  date: Date;
	image: string;
	description: string;
	likes: number = 0;
	comments: number = 0;
	liked: boolean = false;
}

export class UserProfileModel {
  user: ProfileModel = new ProfileModel();
  following: Array<ProfileModel> = [];
  followers: Array<ProfileModel> = [];
  posts: Array<ProfilePostModel> = [];
}
