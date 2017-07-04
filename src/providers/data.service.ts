/**
* Copyright 2016 Corsbay Inc. All Rights Reserved.
* Provide a single place to connect with the data structure on the application (Firebase 3)
* Version: 1.0.0
* Author: Wagner Borba
* Create data: 12/06/2016
*/

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import firebase from 'firebase';
import GeoFire from 'geofire/dist/geofire';


// const FirebaseAuthConfig = {
//   provider: AuthProviders.Google,
//   method: AuthMethods.Redirect
// }


@Injectable()
export class DataService {

	private ROOT_NODE: string = "/";
	public database: any; 
  public geoFire: any;
  public GeoFireLib: any;

	public auth: any;
  public storage: any;
  public storageRef: any;
  

  constructor( private http: Http) {
  	this.initializeApp();
  }

  private initializeApp(){

  	  firebase.initializeApp({
	      apiKey: "AIzaSyApvYCICez3JDP090tVmBxJepEccQdp0ho",
	      authDomain: "corsbay-98632.firebaseapp.com",
	      databaseURL: "https://corsbay-98632.firebaseio.com",
        projectId: "corsbay-98632",
	      storageBucket: "corsbay-98632.appspot.com",
	      messagingSenderId: "319859057056"
  		});

      // Set the Firebase reference to the root node
  	  this.database = firebase.database().ref(this.ROOT_NODE);

      // Expose GeoFire library
      this.GeoFireLib = GeoFire;
      // GeoFire reference
      this.geoFire = new GeoFire(firebase.database().ref(this.ROOT_NODE + "listings_geofire/"));

	  	// as well as adding a reference to the Firebase
      // authentication method
      this.auth = firebase.auth();
      // Just provide the storage object
      this.storage = firebase.storage();
      // Define a default storage reference
      this.storageRef = firebase.storage().ref(this.ROOT_NODE);

  }

  /**
  * Set Http object and expose it to the caller
  * return the Http object
  */
  getHttp(){
    return this.http;
  }

  /**
  *
  */
  setGeolocation(geoData){
    this.geoFire.set(geoData.key, geoData.location)
    .catch(error => {
      console.log(error);
    });
  }


  /**
  *
  */
  public imageRef() {
    let imageRef = firebase.storage().ref("images/");
    return imageRef;
  }


}
