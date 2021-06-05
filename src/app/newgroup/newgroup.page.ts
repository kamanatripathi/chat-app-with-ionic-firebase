import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/database';
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

  nativepath: any;
  imageSrc: string;
  chat$: Observable<any>;
  newMsg: string;
  uid: string;
  chatRef: any;
  message: any;
  name: string;

  id:string;
  voted ;
  opinion: string = null;

  countoption1:number;
  countoption2:number;


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

      this.db.database.app.firestore().collection('groups').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
        })
      });


    } 

  ngOnInit() {


  }



  opinionClick(result,id) {
    this.opinion = result;
      this.voted = true;
      console.log(id)
  const gr=    this.db.database.app.firestore().collection('groups').doc(id);
    gr.get().then(doc=>{
    console.log ( [doc.data()]);
    this.countoption1 = doc.data().countoption1;
    this.countoption2 = doc.data().countoption2;
    console.log ( this.countoption1);
    console.log ( this.countoption2);
    if(this.opinion === 'yes'){
      this.countoption1++;
      console.log(this.countoption1);

      this.db.database.app.firestore().collection('groups')
      .doc(id).collection(this.uid).
      add({
          voter:{
            voter_id : this.uid,
            voted : 'true'
          }
      })
      
      this.db.database.app.firestore().collection('groups')
      .doc(id).update
      ({
        countoption1: this.countoption1,
      })
      
  
    } 
    else{
        this.countoption2++;
        console.log(this.countoption2);
      this.db.database.app.firestore().collection('groups')
      .doc(id).collection(this.uid).
      add({
          voter:{
            voter_id : this.uid,
            voted : 'true'
          }
      })
      
      this.db.database.app.firestore().collection('groups')
      .doc(id).update
      ({
        countoption2: this.countoption2,
      })
      

      }
  })
  this.db.database.app.firestore().collection('groups')
    .doc(id).collection(this.uid)
    .get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(doc.data());
          this.voted = doc.data().voted;
      })
    });



  }




  sendMessage(){
    if(this.message != ''){
      this.id = this.afs.createId();
      this.afs.collection('groups').doc(this.id)
      .set
      ({
        Name : this.name,
        Message: this.message,
        UserID:  this.uid,
        id:this.id,
        Timestamp:firebase.default.firestore.FieldValue.serverTimestamp(),
      });
      this.message='';
    }

  }






  async  Vote(){
    this.router.navigateByUrl('/poll');
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