import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { NewgroupPage } from '../newgroup/newgroup.page';
// import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import{ServiceService } from '../services/service.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  chat: any[];
  groups: any[];
  all: any[];
  chats: any[];
  sent: any;
  name: any;
  img: any;
  arr: any[];
  details: any;
 

  mail: any;
  dp: any;

  oid: any;
  users: any[];
  public itemsCollection: AngularFirestoreCollection<any>;

 mygroups=[];
  info: any[];
  constructor(public router: Router,public service: ServiceService,
    public db: AngularFireDatabase,public afs: AngularFirestore,
    public storage: StorageService, public popoverController:PopoverController) 
    { 
      this.ngOnInit();
    //   this.storage.get('user_uid').then(id=>{
    //     this.db.database.app.firestore().collection('user').doc(id).get()
    //     .then(data=>{ 
    //       this.name= data.data()['name'];
    //       this.mail=data.data()['mail'];
    //       this.dp= data.data()['img'];
    //     })

    //   this.db.database.app.firestore().collection('user').get()
    //   .then(data=>{ 
    //     this.chat=[];
    //       data.forEach(childata=>{
    //         if(childata.data().uid != id){
    //           this.chat.push(childata.data());  
    //           console.log(this.chat)
    //         } 
    //     })
    //   })
    // })
    this.ionViewDidEnter();
    }

      ionViewDidEnter(){
        this.ngOnInit();
        this.storage.get('user_uid').then(id=>{
          this.db.database.app.firestore().collection('user').doc(id).get()
          .then(data=>{ 
            this.name= data.data()['name'];
            this.mail=data.data()['mail'];
            this.dp= data.data()['img'];
          })
  
        this.db.database.app.firestore().collection('user').get()
        .then(data=>{ 
          this.chat=[];
            data.forEach(childata=>{
              if(childata.data().uid != id){
                this.chat.push(childata.data());  
                console.log(this.chat)
              } 
          })
        })
      })
      }


    // get(chatId) {
    //   return this.afs
    //     .collection<any>('groups')
    //     .doc(chatId)
    //     .snapshotChanges()
    //     .pipe(
    //       map(doc => {
    //         return { id: doc.payload.id, ...doc.payload.data() };
    //       })
    //     );
    // }


  async ngOnInit() {
    // this.getData()   
    

    }


  //   getData(){
  //     this.storage.get('user_uid').then(id=>{
  //      this.db.database.app.firestore().collection("buddy")
  //      .doc(id).collection
  //      .get()
  //      .then((doc) => {
  //        console.log("dd",doc.data());
  //       // this.chats= [];        
  //       // doc.forEach((doc) => {
  //       //   console.log("gge",doc)
  //       //       // doc.data() is never undefined for query doc snapshots
  //       //       // console.log(doc.id, " => ", doc.data());
  //       //       this.chats.push(doc.data())
  //       //       // console.log(this.chats);
  //       //       for (this.chat of this.chats){
  //       //         console.log(this.chat)
  //       //       }
  //       //     })
  //           }); 
  //       })
  // }

  buddychat(other){
    this.service.initializebuddy(other);
    this.router.navigateByUrl("/buddychat");
  }
    user(){
      this.router.navigateByUrl("/searchuser")
    }
    newgroup()
    {
      this.router.navigateByUrl("/newgroup")
    }
    
}
