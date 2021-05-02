import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {StorageService} from '../services/storage.service';
import { EventsService } from './events.service';
import { AngularFireDatabase } from '@angular/fire/database';
 export interface Idea {
  id?: string,
  name: string,
  notes: string,
  field?: any
}

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  message: Idea[];
  private ideas: Observable<Idea[]>;
  private ideaCollection: AngularFirestoreCollection<Idea>;
 
  constructor(private afs: AngularFirestore,public storage:StorageService,
    public firestore : EventsService,public db: AngularFireDatabase
    ) {
    this.ideaCollection = this.afs.collection<Idea>('idea');
    this.ideas = this.ideaCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          console.log(id,data);

          return { id, ...data };
        });
      })
    );
  }
  getIdeas(): Observable<Idea[]> {
    return this.ideas;
  }
   getIdea(id: string):  Observable<Idea>  {
    return this.ideaCollection.doc<Idea>(id).valueChanges().pipe(
      take(1),
      map(idea => {
        idea.id = id;
        return idea
      })
    );    
  }

 get(){
  this.storage.get('user_uid').then((res)=>{
    console.log("ddd",res)
  const db= this.db.database.app.firestore().collection("idea");
  db.where("field","==",res).get().then((querysnapshot)=>{
    let arr: Idea[] = [];

    querysnapshot.forEach((doc)=>{
      const obj: Idea = doc.data().dataObj as unknown as Idea;
       obj.id = doc.id;
      console.log(obj) 
      arr.push(obj)
    });
    this.message = arr;
    console.log(this.message) 
  }).catch((error)=>{
    console.log(error);
  })
})
 }

  addIdea(idea: Idea):Promise<any> {
    return this.storage.get('user_uid').then((res) => {
      return this.ideaCollection.add({ name: idea.name, notes: idea.notes,field: res });    });
  }
 
  updateIdea(idea: Idea):Promise<any>{
    return this.ideaCollection.doc(idea.id).update({ name: idea.name, notes: idea.notes });
  }
 
  deleteIdea(id: string): Promise<void> {
    return this.ideaCollection.doc(id).delete();
  }
}
