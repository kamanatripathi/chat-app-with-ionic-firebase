import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AlertController, LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { PopoverController } from '@ionic/angular';
import {VoteComponent} from '../vote/vote.component';
import { PollPageModule } from '../poll/poll.module';

@Component({
  selector: 'app-newgroup',
  templateUrl: './newgroup.page.html',
  styleUrls: ['./newgroup.page.scss'],
})
export class NewgroupPage implements OnInit {

  @ViewChild('imageProd') inputimageProd: ElementRef;
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  newgroup={
    groupName: 'GroupName',
    groupPic:''
  };
  nativepath: any;
  id: any;
  imageSrc: string;
  chat$: Observable<any>;
  newMsg: string;
  uid: string;
  chatRef: any;
  message: any;
  name: string;


  voted = false;
  opinion: string = null;



   poll = [{
    poll :'name',
    option1 : 'yes',
    option3: 'no'
  }];
score=0;
  constructor(public loadingController: LoadingController,public afs: AngularFirestore,private route: ActivatedRoute,
    public alerCtrl: AlertController,public db: AngularFireDatabase,public storage: StorageService,public filechooser: FileChooser
    ,public file: File,public FilePath: FilePath,public camera: Camera,    private afstorage: AngularFireStorage,
    public router: Router,public popover: PopoverController



    ) {
      this.uid= sessionStorage.getItem('user_uid');
     this.name=  sessionStorage.getItem('user_name');
      this.chatRef= this.afs.collection('groups',ref=>
      ref.orderBy('Timestamp')).valueChanges();
      console.log(this.chatRef);


    }

  ngOnInit() {


  }



  opinionClick(result) {
    this.opinion = result;
    this.voted = true;
  }

  option1(){
    this.score++;
    console.log(this.score);

  }
  option2(){
    this.score++;
    console.log(this.score);

  }
  sendMessage(){
    if(this.message != ''){
      this.afs.collection('groups').add({
        Name : this.name,
        Message: this.message,
        UserID:  this.uid,
        Timestamp:firebase.default.firestore.FieldValue.serverTimestamp(),
      });
      this.message='';
    }

  }






  async  Vote(){
    this.router.navigateByUrl('/poll');
    }



        grouppicstore(groupname) {
          const promise = new Promise((resolve, reject) => {
              this.filechooser.open().then((url) => {
                (<any>window).FilePath.resolveNativePath(url, (result) => {
                  this.nativepath = result;
                  (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
                    res.file((resFile) => {
                      const reader = new FileReader();
                      reader.readAsArrayBuffer(resFile);
                      reader.onloadend = (evt: any) => {

                        const imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                        this.storage.get('user_uid').then(uid=>{

                          const filePath = '/groupimages/';
                          console.log(filePath);
                          const imageStore = this.afstorage.ref(filePath).child(uid).child(groupname);
                        imageStore.upload(imgBlob).then((res) => {
                          console.log('dd',res);

                          this.afstorage.ref('/groupimages/').child(uid).child(groupname).getDownloadURL().then((url) => {
                            console.log('Done');
                            resolve(url);
                          }).catch((err) => {
                              reject(err);
                          });
                        }).catch((err) => {
                          reject(err);
                        });
                      });
                      };
                  });
                  });
                });
            });
          });
           return promise;
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

}
