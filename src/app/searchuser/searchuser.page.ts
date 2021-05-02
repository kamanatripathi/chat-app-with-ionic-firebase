import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {ServiceService} from '../services/service.service';
import { StorageService } from '../services/storage.service';
@Component({
  selector: 'app-searchuser',
  templateUrl: './searchuser.page.html',
  styleUrls: ['./searchuser.page.scss'],
})
export class SearchuserPage implements OnInit {
  searchterm:string;
    userList=[];
  info: any[];
  item: any;
  userList1: any[];
  constructor(
    public afs: AngularFirestore, 
    public service:ServiceService,
    public router: Router,
    public db:AngularFireDatabase,
    public stoage: StorageService
    )  { 
    }

  async initializeItems():Promise <any>{

    var docRef = this.db.database.app.firestore().collection("user").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
         this.userList = [doc.data()]
         console.log(this.userList)

      });
  });
  }


  

async ngOnInit() {

 this.db.database.app.firestore().collection("user").get().then((querySnapshot) => {
  let arr = [];
  querySnapshot.forEach((doc) => {
       const userList= doc.data()
       console.log(userList)
       arr.push(userList)
    });
    this.userList = arr;
  });
  }

async filterList(evt){
  this.db.database.app.firestore().collection("user").get().then((querySnapshot) => {
    let arr = [];
    querySnapshot.forEach((doc) => {
       const userList = [doc.data()]
       arr.push(userList);
      });
      
  this.userList1  = arr;
  const searchTerm = evt.srcElement.value;
  if(!searchTerm){
    return;
  }
  for(var i = 0 , len = this.userList.length;i <len;i++){
    this.userList = arr[i];
    console.log(this.userList)
  this.userList = this.userList.filter(username => {
    if (username.name && searchTerm){
      return (username.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || username.mail.toLowerCase().indexOf(searchTerm.toLowerCase()))    }
  });
  }
  });

  }

  buddychat(buddy){
    this.service.initializebuddy(buddy);
    this.router.navigateByUrl("/buddychat");
    
  }
}
