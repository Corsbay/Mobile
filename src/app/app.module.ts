/**
* Copyright 2016 Corsbay Inc. All Rights Reserved.
* Root component for the application
* Version: 1.0.0
* Author: Wagner Borba
* Create data: 11/13/2016
*/

/*
    Import dependencies
*/
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

/*
    Import Pages
*/
import { ListingPage } from '../pages/listing/listing';
import { ListingFilterPage } from '../pages/listing-filter/listing-filter';
import { ListingDetailsPage } from '../pages/listing-details/listing-details';
import { ListingUserPage } from '../pages/listing-user/listing-user';
import { ListingFormPage } from '../pages/listing-form/listing-form';

import { ListingFormCategoriesPage } from '../pages/listing-form-categories/listing-form-categories';
import { ListingFormDescPage } from '../pages/listing-form-desc/listing-form-desc';
import { ListingFormPricePage } from '../pages/listing-form-price/listing-form-price';
import { ListingFormSchedulePage } from '../pages/listing-form-schedule/listing-form-schedule';
import { ScheduleModalPage } from '../pages/listing-form-schedule/form-schedule-modal';
import { ListingFormDetailsPage } from '../pages/listing-form-details/listing-form-details';
import { ListingFormOptionsPage } from '../pages/listing-form-options/listing-form-options';
import { ListingOrderPage } from '../pages/listing-order/listing-order';
import { ListingImagesPage } from '../pages/listing-images/listing-images';

import { ImageViewModalPage } from '../pages/image-view-modal/image-view-modal';
import { LocationModalPage} from '../pages/location-modal/location-modal';
import { GalleryModal } from '../pages/gallery-modal/gallery-modal';
import { ProfilePage } from '../pages/profile/profile';
import { ProfileFormPage } from '../pages/profile-form/profile-form';
import { ProfileFormAddressPage } from '../pages/profile-form-address/profile-form-address';
import { ProfilePaymentMethodPage } from '../pages/profile-payment-method/profile-payment-method';
import { ProfileOrdersPage } from '../pages/profile-orders/profile-orders';
import { ProfileFavoritesPage } from '../pages/profile-favorites/profile-favorites';
import { AddressFormModal } from '../pages/profile-form-address/address-form-modal';
import { LoginPage } from '../pages/login/login';
import { OrderCheckoutPage } from '../pages/order-checkout/order-checkout';
import { OrderPaymentPage } from '../pages/order-payment/order-payment';
import { OrderSettingsPage } from '../pages/order-settings/order-settings';
import { SignupPage } from '../pages/signup/signup';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';

import { SellerPage } from '../pages/seller/seller';
// import { SellerFormPage } from '../pages/seller-form/seller-form';

import { CardFormPage } from '../pages/card-form/card-form';

import { TermsOfServicePage } from '../pages/terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';

/*
 Import components directives
*/
import { PreloadImage } from '../components/preload-image/preload-image';
import { BackgroundImage } from '../components/background-image/background-image';
import { ShowHideContainer } from '../components/show-hide-password/show-hide-container';
import { ShowHideInput } from '../components/show-hide-password/show-hide-input';
import { ColorRadio } from '../components/color-radio/color-radio';
import { CounterInput } from '../components/counter-input/counter-input';
import { Rating } from '../components/rating/rating';
import { ZoomableImage } from '../components/zoomable-image/zoomable-image';

/*
 Pipes
*/
import { MomentPipe } from './pipes/moment-pipe';
import { DistancePipe } from './pipes/distance-pipe';

/*
    Import providers
*/
import { DataService } from '../providers/data.service';
import { AuthService } from '../providers/auth.service';
import { BaseService } from '../providers/base.service';
import { MediaService } from '../providers/media.service';
import { ItemDraftService } from '../providers/item-draft.service';
import { ItemService } from '../providers/item.service';
import { OrderService } from '../providers/order.service';
import { ProfileService } from '../providers/profile.service';
import { SellerService } from '../providers/seller.service';

import { MapProvider } from '../providers/map-provider';


declare var cordova: any;

@NgModule({  
  declarations: [
    MyApp,
    ListingPage,
    ListingFilterPage,
    ListingDetailsPage,
    ListingFormOptionsPage,
    ListingOrderPage,
    ListingUserPage,
    ListingFormPage,
    ListingFormCategoriesPage,
    ListingFormDescPage,
    ListingFormPricePage,
    ListingFormSchedulePage,
    ScheduleModalPage,
    ListingFormDetailsPage,
    ListingImagesPage,
    ImageViewModalPage,
    LocationModalPage,
    LoginPage,

    ProfilePage,
    ProfileFormPage,
    ProfileFormAddressPage,
    ProfilePaymentMethodPage,
    ProfileOrdersPage,
    ProfileFavoritesPage,
    AddressFormModal,

    OrderCheckoutPage,
    OrderPaymentPage,
    OrderSettingsPage,
    CardFormPage,

    WalkthroughPage,

    SellerPage,
    // SellerFormPage,

    SignupPage,
    ForgotPasswordPage,

    TermsOfServicePage,
    PrivacyPolicyPage,
    PreloadImage,
    BackgroundImage,
    ShowHideContainer,
    ShowHideInput,
    ColorRadio,
    CounterInput,
    Rating,
    GalleryModal,
    ZoomableImage,

    MomentPipe,
    DistancePipe
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
        menuType: 'overlay',
        spinner: 'dots',
        tabsPlacement: 'bottom',
        platforms: {
            ios: {
              statusbarPadding: true,
              scrollAssist: false, 
              autoFocusAssist: false 
            }
        },
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayShortNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListingPage,
    ListingFilterPage,
    ListingDetailsPage,
    ListingOrderPage,
    ListingUserPage,
    ListingFormPage,
    ListingFormCategoriesPage,
    ListingFormDescPage,
    ListingFormPricePage,
    ListingFormSchedulePage,
    ScheduleModalPage,
    ListingFormDetailsPage,
    ListingFormOptionsPage,
    ListingImagesPage,
    ImageViewModalPage,
    LocationModalPage,
    LoginPage,
    ProfilePage,
    ProfileFormPage,
    ProfileFormAddressPage,
    ProfilePaymentMethodPage,
    ProfileOrdersPage,
    ProfileFavoritesPage,
    AddressFormModal,

    OrderCheckoutPage,
    OrderPaymentPage,
    OrderSettingsPage,
    CardFormPage,

    WalkthroughPage,

    SellerPage,
    // SellerFormPage,

    ForgotPasswordPage,
    SignupPage,


    TermsOfServicePage,
    PrivacyPolicyPage,
    GalleryModal
  ],
  providers: [
    DataService,
    AuthService,
    ProfileService,
    SellerService,
    BaseService,
    MediaService,
    ItemDraftService,
    ItemService,
    MapProvider
    // OrderService,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
