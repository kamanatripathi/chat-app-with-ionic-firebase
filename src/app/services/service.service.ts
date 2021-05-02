import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireDatabase, snapshotChanges} from '@angular/fire/database';
import { Event, Route, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {StorageService} from '../services/storage.service';
import { AngularFireAuth } from '@angular/fire/auth';
import {EventsService} from '../services/events.service';
import {Observable, Subject} from 'rxjs';
import * as firebase from 'firebase';
export interface Todo {
tid?: string;
task: string;
priority: number;
createdAt: number;
}
@Injectable({
  providedIn: 'root'
})
  

export class ServiceService {
  anuncios: any[] = [];
  info: any[] = [];
  public eva = new Subject<any>();

  private itemsCollection: AngularFirestoreCollection<any>;
  buddy:any;
  firebuddychats: any;
  uid: string;
  buddymessages: any[];
  img: any;
  mail: string;
  id: any;


  private todosCollection: AngularFirestoreCollection<Todo>;
  private todos: Observable<Todo[]>;
  allMessage: any[];
  myname: any;
  other: any;
  buddy_uid: any;
  polldata: any;
  
  constructor(
    public afs: AngularFirestore, 
    public rout: Router,
    public StorageService:StorageService,
    public db : AngularFireDatabase,
    private aut: AngularFireAuth,
    public event: EventsService
    ) { 
      this.firebuddychats= this.db.database.ref('buddychats');
      this.logueado();
    }

    logueado() {
      this.aut.authState
        .subscribe(
          user => {
            if (user) {
              this.mail = user.email;
              this.StorageService.set("user_uid",user.uid);
              this.uid = user.uid;
              console.log(this.mail);
              this.getProfile1(this.uid);
            }
          });
    }


  goto(id) {
    this.rout.navigateByUrl(id);
  }




  // getProfile(id) {
  //   this.itemsCollection = this.afs.collection<any>('user').doc(id)
  //   return this.itemsCollection.snapshotChanges().pipe(map((info: any[]) => {
  //     this.info = [];
  //     for (const infos of info) {
  //       this.info.unshift(infos);
  //     }
  //     return this.info;
  //   }));
  // }

  createUser(value) {
    this.StorageService.set('uid', value.uid).then(result => {
      console.log('Data is saved');
      }).catch(e => {
      console.log("error: " + e);
      });
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('user').doc(value.uid).set({
        name: value.name,
        phone: value.phone,
        mail: value.mail,
        img: value.img,
        uid: value.uid,
        // adress: value.adress,
        date: Date.now(),
        // username: value.username,
      });
            this.rout.navigateByUrl('/tabs/profile');
    });
  }


  updateUser(value,id?) {
    return this.afs.collection('user').doc(id).set(value);
   }


   // Entry stuff

   async getProfile1(uid) {
    this.db.database.app.firestore().collection('user').doc(uid)
    .get().then((data: any) => {
      this.myname = data.data().name;
      console.log("getprofiel dud",this.myname);

        console.log("ss",this.myname)
       // this.phone = data[0].payload.doc.data().phone;
        console.log('profil full');
    });
  }

   
  initializebuddy(buddy){
    this.buddy = buddy;
    // this.buddy_uid =  buddy.uid;
    //this.buddy_uid = buddy.reciver;
    // this.db.database.app.firestore().collection('user').doc(this.buddy_uid)
    //   .get().then(snap=>{
    //     this.buddy.name= snap.data().name;
    //     this.buddy.uid= snap.data().uid;
    //   })
  }

  addnewmessage(msg){
    console.log(this.myname,this.uid)
    if(this.buddy){
      return new Promise<any>((resolve, reject) => {
       this.db.database.app.firestore().collection('buddy').doc(this.uid).collection(this.buddy.uid).
        add({
          uid: this.uid,
          message: msg,
          sender_name : this.myname,
          reciver: this.buddy.uid,
          reciver_name: this.buddy.name,
          timestamp: Date.now()
        })
        .then(()=>{
         this.afs.collection('buddy').doc(this.buddy.uid).collection(this.uid)
         .add({
            uid: this.uid,
            message: msg,
            sender_name : this.myname,
            reciver: this.buddy.uid,
            reciver_name: this.buddy.name,
            timestamp: Date.now()
          })
          .then(()=>{

            resolve(true);
          }).catch((err)=>{
            reject(err);
          })
        })
        })
      // })
    }
  }
  getbuddymessages(){
    this.buddymessages=[];
    let temp;
    this.aut.authState.subscribe(user => {
      this.uid = user.uid;
      this.db.database.app.firestore().collection('buddy').doc(this.uid).collection(this.buddy.uid)
      .onSnapshot(snapshot=>{  
        snapshot.forEach(child=>{
          this.buddymessages.push(child.data());
          console.log(this.buddymessages)
        })
      let newa = String("newmessage");
      this.eva.next(newa);
      })
  })
  }
  getmessage(): Observable<any>{
    return this.eva.asObservable();
  }


 
  
}
