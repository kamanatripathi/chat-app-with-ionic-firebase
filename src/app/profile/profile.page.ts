import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AlertController, LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { ServiceService } from '../services/service.service';
import { StorageService } from '../services/storage.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import{FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';

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


  nativepath: any;
  imageSrc: string;
  base64Image: string;
  downloadURL: Observable<any>;
 
  constructor(private rout: Router,
    private route: ActivatedRoute,
    private services: ServiceService,
    private afs: AngularFireStorage,public storage: StorageService,public filechooser: FileChooser,
    private loadingController: LoadingController,public alertCtrl: AlertController,
    private aut: AngularFireAuth,private camera: Camera,private file: File,
    public storages: StorageService, public aio  : FingerprintAIO,
    public db: AngularFireDatabase) {
  
  }
  async signOut() {
    const res = await this.aut.signOut();
    console.log(res);
    this.storages.remove("user_uid")
    this.rout.navigateByUrl('/login');
    
  }
  ionViewWillEnter(){
    this.logueado();
  }
  ngOnInit() {
    this.logueado();
    this.subscreibe();
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
    this.presentLoading();
    var docRef = this.db.database.app.firestore().collection("user").doc(id);
    docRef.get().then((data) => {
        if (data.exists) {
          this.loadingController.dismiss();
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
        this.loadingController.dismiss();
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



  async photos(name,phone) {

    let cameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 100,
      targetHeight:100
}
      this.camera.getPicture(cameraOptions)
 
      .then((file_uri) => {
        this.presentLoading();
        this.base64Image = 'data:image/jpeg;base64,' + file_uri;       
       this.upload(name,phone);
  })
}
upload(name,phone){
  var currentDate = Date.now();
  const file: any = this.base64ToImage(this.base64Image);
  const filePath = `image/pic_${currentDate}`;
  const fileRef = this.afs.ref(filePath);

  const task = this.afs.upload(`image/pic_${currentDate}`, file);
    task.snapshotChanges()
      .pipe(finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(downloadURL => {
          if (downloadURL) {
            this.showSuccesfulUploadAlert();

          }
          console.log("downloaddddURL",downloadURL);
          this.save(name,phone,downloadURL)
        });
      })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
}

async showSuccesfulUploadAlert() {
  const alert = await this.alertCtrl.create({
    cssClass: 'basic-alert',
    header: 'Uploaded',
    subHeader: 'Image uploaded successful',
    message: 'Check Firebase storage.',
    buttons: ['OK']
  });

  await alert.present();
}

base64ToImage(dataURI) {
  const fileDate = dataURI.split(',');
  // const mime = fileDate[0].match(/:(.*?);/)[1];
  const byteString = atob(fileDate[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([arrayBuffer], { type: 'image/png' });
  return blob;
}

  save(name, phone,downloadURL) {
    this.presentLoading();
    console.log(this.cp);
  // const image = this.inputimageProd.nativeElement.value;
  console.log("downloaddddURL in save",downloadURL);
   
    const data = {
      name: name,
      phone: phone,
      mail: this.mail,
      img: downloadURL || this.img,
      uid: this.uid
    };
    console.log(data,"DATAAAA");
    if (this.cp === false) {
      this.loadingController.dismiss();
      this.services.createUser(data).then(
        res => {
          console.log('Upload' + res);
          this.loadingController.dismiss();
        });
    } else {
      this.loadingController.dismiss();
      this.services.updateUser(data, this.uid).then(
        res => {
          console.log('Upload' + res);
          this.loadingController.dismiss();
        });
    }

  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading Data.. Please Wait',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }
  moveFocus(nextElement) {
    nextElement.setFocus();
  }

    subscreibe(){
      this.aio.isAvailable().then(()=>{
        this.aio.show({}).then((val)=>{
          alert(JSON.stringify(val));
        },(err)=>{
          alert(JSON.stringify(err));
        })
      },(err)=>{
        alert("fingerprint not available");
      })
    }
}

