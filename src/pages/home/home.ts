import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geofence, Geolocation, SMS } from 'ionic-native';
import { ActivePage } from '../active/active'
// import { Platform } from ''

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  radius: number = 100;
  error: any;
  success: any;


  constructor(public navCtrl: NavController, private platform: Platform) {
    this.platform.ready().then(()=> {
      Geofence.initialize().then(
        ()=> console.log('Geofence Plugin Ready'),
        (err)=> console.log(err)
      );
    })
  }

  setGeofence(value: number){
    
    // 1. Get the current position
    Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    }).then((resp) => {
      var longitude = resp.coords.longitude;
      var latitude = resp.coords.latitude;
      var radius  = value;

      // 2. Initialize the fence using the current position & radius
      let fence = {
       id: "WifiAlertGeofenceID1",
       latitude: latitude,
       longitude: longitude,
       radius: radius,
       transitionType: 2 // Leaving
      }

      
      // 3. Create or update the fence
      Geofence.addOrUpdate(fence).then(()=>{
        this.success = true,
        (err)=> {
          this.error = "Failed to add or update the fence";
        }
      })

      // 4. Sends an SMS if the user broke out the fence
      Geofence.onTransitionReceived().subscribe(resp => {
        SMS.send('', 'OMG She lied, leave her now!');
      });

      this.navCtrl.push(ActivePage);

    }).catch((error) => {
      this.error = error;
    })
  }
}

