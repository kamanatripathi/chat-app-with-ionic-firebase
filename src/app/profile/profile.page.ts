import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { ServiceService } from '../services/service.service';
import { StorageService } from '../services/storage.service';
import { AngularFireDatabase } from '@angular/fire/database';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('imageProd') inputimageProd: ElementRef;
  id: any;
  uid: string;
  name: any;
  phone: string;
  // adress: string;
  img: any;
  mail: string;
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  item: any;
  // username: string;
  cp: Boolean;
  constructor(private rout: Router,
    private route: ActivatedRoute,
    private services: ServiceService,
    private afs: AngularFireStorage,
    private loadingController: LoadingController,
    private aut: AngularFireAuth,
    public storages: StorageService,
    public db: AngularFireDatabase) {
  
  }
  async signOut() {
    const res = await this.aut.signOut();
    console.log(res);
    this.storages.remove("user_uid")
    this.rout.navigateByUrl('/login');
    
  }
  ngOnInit() {
    this.logueado();
  }

  logueado() {
    this.aut.authState
      .subscribe(
        user => {
          if (user) {
            this.mail = user.email;
            this.uid = user.uid;
            sessionStorage.setItem('user_uid',this.uid);
            console.log(this.mail);
            this.getProfile(this.uid);
          }
        });
  }
  async getProfile(id) {
    var docRef = this.db.database.app.firestore().collection("user").doc(id);
    docRef.get().then((data) => {
        if (data.exists) {
            // console.log("Document data:", data.data());
          this.item = data.data();
          this.name =this.item.name;
          sessionStorage.setItem('user_name',this.name);
          this.mail = this.item.mail;
          this.phone= this.item.phone;
          this.img = this.item.img;
          console.log(this.item)
        }  
       else{  
          console.log('empty');
       }
      }).catch((error) => {
        console.log("Error getting document:", error);
    });
  }

  onUpload(e) {
    console.log(e.target.files[0]);

    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `image/pic_${id}`;
    const ref = this.afs.ref(filePath);
    const task = this.afs.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    this.presentLoading();
    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();
  }
  save(name, phone) {
    console.log(this.cp);
    const image = this.inputimageProd.nativeElement.value;
    const data = {
      name: name,
      phone: phone,
      mail: this.mail,
      img: image || this.img,
      uid: this.uid
    };
    console.log(data);
    if (this.cp === false) {
      this.services.createUser(data).then(
        res => {
          console.log('Upload' + res);
          this.rout.navigateByUrl('/tabs/profile-details');
        });
    } else {
      this.services.updateUser(data, this.uid).then(
        res => {
          console.log('Upload' + res);
          this.rout.navigateByUrl('/tabs/profile-details');
        });
    }

  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading image',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }
  moveFocus(nextElement) {
    nextElement.setFocus();
  }
}
