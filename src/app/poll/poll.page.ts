import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.page.html',
  styleUrls: ['./poll.page.scss'],
})
export class PollPage implements OnInit {
  uid: string;
  name: string;
  id: string;

  constructor(public router:Router , public service: ServiceService
    ,public afs:AngularFirestore) { }

  ngOnInit() {
  }
  Submit(mail,mail1,mail2){
    this.id = this.afs.createId();

    this.uid= sessionStorage.getItem('user_uid');
    this.name=  sessionStorage.getItem('user_name');
    this.afs.collection('groups').doc(this.id).set({
      Name : this.name,
      poll: mail,
      option1: mail1,
      option2:mail2,
      UserID:  this.uid,
      countoption1 :0,
      countoption2: 0,
      Message: 'POLL',
      id : this.id,
      Timestamp:firebase.default.firestore.FieldValue.serverTimestamp(),
    })
    const data = {
      poll :mail,
      option1 : mail1,
      option3: mail2
    }
    let humanStringify=JSON.stringify(data);
    console.log(humanStringify)
    this.router.navigate(['/newgroup',humanStringify]);
  }
}
