import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import {ServiceService} from '../services/service.service';
import{ EventsService} from '../services/events.service';
import { StorageService } from '../services/storage.service';
interface Todo {
  id: string;
  text: string;
  checked: boolean;
} 


@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {
  messages: Todo[];
  model: Todo;
  isEditing: boolean = false;
  showForm: boolean;
  uid:any;
  @ViewChild('slidingList', {static: false}) slidingList;
  todo_id: string;
  todos: firebase.default.firestore.DocumentData[];
  
  constructor(public todoService: ServiceService,
    private aut: AngularFireAuth,
    public afs: AngularFirestore,
    public db:AngularFireDatabase,
    public router: Router,
    public firestore : EventsService,
    public storage:StorageService
    ) {     
      // this.loadData();
      this.loadData1();
          this.model = {
            id: '',
            text: '',
            checked: false,
          }
    }

  ngOnInit(): void {
    this.getLogueado()
  }
  getLogueado() {
    this.aut.authState
      .subscribe(
        user => {
            console.log('logeado');
            this.uid = user.uid;
            this.storage.set("user_uid",user.uid);
            console.log(this.uid);
            // this.getotdo()
        })
      }

      
      loadData1(){
        this.storage.get('user_uid').then((res)=>{
          console.log("ddd",res)
        const db= this.db.database.app.firestore().collection("task");
        db.where("field","==",res).get().then((querysnapshot)=>{
          let arr: Todo[] = [];

          querysnapshot.forEach((doc)=>{
            const obj: Todo = doc.data().dataObj as unknown as Todo;
             obj.id = doc.id;
            console.log(obj) 
            arr.push(obj)
          });
          this.messages = arr;
          console.log(this.messages) 
        }).catch((error)=>{
          console.log(error);
        })
      })
         
      }
      
      toggleCheck(item): void {
        this.isEditing = true;
        item.checked = !item.checked;
        this.model = item;
        this.addMessage();
      }
    
      addMessage(): void {

        if (!this.model.text) {
          return;
        }
        if (!this.isEditing) {
          
          this.firestore.addDocument("task",this.model,this.uid).then(() => {
            this.loadData1();//refresh view
          });
        } else {
          this.firestore.updateDocument("task", this.model.id, this.model).then(() => {
            this.loadData1();//refresh view
          });
        }
        this.isEditing = false;
        //clear form
        this.model.checked = false;
        this.model.text = '';
        this.showForm = false;

      }
    
      updateMessage(obj) {
        this.showForm = true;
        this.model = obj;
        this.isEditing = true;
        this.slidingList.closeSlidingItems();
      }
    
      deleteMessage(id: string) {
        this.slidingList.closeSlidingItems();
        this.firestore.deleteDocument("task", id).then(() => {
          this.loadData1();//refresh view
          this.isEditing = false;
        });
      }
    
    
      addItem(): void {
        this.slidingList.closeSlidingItems();
        this.showForm = !this.showForm;
      }
    
      trackByFn(index: number, item: any): number {
        return index; // or item.id
      }
    
    
}
