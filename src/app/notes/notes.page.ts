import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IdeaService, Idea} from '../services/idea.service';
import { ToastController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
  idea: Idea = {
    name: '',
    notes: ''
  };
  // ideas: any;
  ideas: Idea[];
  id: string;

  private ideass: Observable<Idea[]>;

  constructor(private activatedRoute: ActivatedRoute,
    private toastCtrl: ToastController, private router: Router,
    private afs: AngularFirestore,public storage:StorageService,
    public db: AngularFireDatabase
    )
   { }

  ngOnInit() {
    this.get()
  } 
  get(){
    this.storage.get('user_uid').then((res)=>{
      console.log("ddd",res)
    const db= this.db.database.app.firestore().collection("idea");
    db.where("field","==",res).get().then((querysnapshot)=>{

      let arr: Idea[] = [];
  
      querysnapshot.forEach((doc)=>{
        const obj: Idea = doc.data() as unknown as Idea;
         obj.id = doc.id;
         this.id = doc.id;
        console.log(obj) 
        arr.push(obj)
      });
      this.ideas = arr;
      console.log(this.ideas) 
    }).catch((error)=>{
      console.log(error);
    })
  })
   }

  
   trackByFn(index: number, item: any): number {
    return index; // or item.id
  }

}
