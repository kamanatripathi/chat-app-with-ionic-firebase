import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ServiceService } from '../services/service.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoadingController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit {

  uid: any;
  item: any;
  anuncios: any;
  empty: Boolean;
  constructor(private rout: Router, private services: ServiceService, 
    private aut: AngularFireAuth,public afs:AngularFirestore,
    public storages: StorageService,
    public db :AngularFireDatabase , public loading:LoadingController) {
      this.ionViewWillEnter();
  }
  ionViewWillEnter	(){
    this.getLogueado();
  } 

   ngOnInit() {
    this.getLogueado();
   }
  
  getLogueado() {
    this.aut.authState
      .subscribe(
        user => {
          if (user) {
            console.log('logeado');
            this.uid = user.uid;
            console.log(this.uid);
            this.getProfile(this.uid);
          } else {
            this.rout.navigateByUrl('/login');
          }
        },
        () => {
          this.rout.navigateByUrl('/login');
        }
      );
  }
  async presentLoading() {
    const loading = await this.loading.create({
      message: 'Loading Data.. Please Wait',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }
  async getProfile(id) {
    this.presentLoading();
    var docRef = this.db.database.app.firestore().collection("user").doc(id);
    docRef.get().then((data) => {
        if (data.exists) {
            this.loading.dismiss()
            console.log("Document data:", data.data());
            this.empty = true;
          this.item = data.data();
          console.log(this.item)
        }  
       else{  
        this.loading.dismiss()

        this.empty = false;
          console.log('empty');
       }
      }).catch((error) => {
        console.log("Error getting document:", error);
    });
  }
  
  
  
  goedit() {
    this.rout.navigateByUrl('/tabs/profile');
  }
  todo(){
    this.rout.navigateByUrl('/todo');
  }
  notes(){
    this.rout.navigateByUrl('/notes')
  }
  
  async signOut() {
    
    const res = await this.aut.signOut();
    console.log(res);
    this.storages.remove("user_uid")
    this.rout.navigateByUrl('/login');
    
  }

}
