import { Component, OnInit, ViewChild } from '@angular/core';
import{ ServiceService} from '../services/service.service';
import {EventsService} from '../services/events.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import {StorageService}from '../services/storage.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ThrowStmt } from '@angular/compiler';
import { LoadingController, PopoverController } from '@ionic/angular';
import { PreviewPage } from '../preview/preview.page';

 @Component({
  selector: 'app-buddychat',
  templateUrl: './buddychat.page.html',
  styleUrls: ['./buddychat.page.scss'],
})
export class BuddychatPage implements OnInit {
  @ViewChild('content')content:Content;
  public eva = new Subject<any>();

  buddy:any;
  newMessage;
   allMessage: any[];
   photo: any;
   key: any;
   id: any;
   uid: any;
   chat: any[];
   buddymessages=[];
   private itemsCollection: AngularFirestoreCollection<any>;
   bud: any;
   myname: any;
   constructor(
    private aut: AngularFireAuth,public service :ServiceService,
    public event: EventsService,public storage: StorageService,
    public db: AngularFireDatabase,public afs: AngularFirestore,
    public popoverController: PopoverController,public loadingController: LoadingController
    ) {
    this.buddy = this.service.buddy;
    
    this.db.database.app.firestore().collection('user').doc(this.buddy.uid)
      .get().then(snap=>{
        this.buddy.name= snap.data().name;
      })
      this.storage.get('user_uid').then(id=>{
      this.db.database.app.firestore().collection('user').doc(id)
      .get().then(snap=>{
        this.myname= snap.data().name;
        this.id= snap.data().uid;
        sessionStorage.setItem("myname",this.myname)
        sessionStorage.setItem("uid",this.id);
      })
    })

    console.log("buddy id",this.buddy.uid)
      // console.log("buddy uid",this.buddy.uid)

    this.getdata()
   }

   getdata(){
    this.id=sessionStorage.getItem("uid");
     console.log(this.buddy.uid, this.id)
    this.db.database.app.firestore().collection("buddy")
    .doc(this.id).collection(this.buddy.uid).orderBy("timestamp","asc")
    .onSnapshot(snap=>{
     this.chat=[];
     snap.forEach(child=>{
       this.chat.push(child.data());
       console.log("ddd",this.chat)
       
     })
 
    })
   }
   async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  addMessage(){ 
        this.presentLoading();
          this.service.addnewmessage(this.newMessage)
         .then(()=>{
          this.newMessage=''
          this.loadingController.dismiss();
          this.getdata();
        })

  }
 
  ngOnInit() {
    this.getdata()
  }

  //File Upload
  triggerFile(){
    document.getElementById("file").click();
  }
  detectFiles(){
    var files = (<HTMLInputElement>document.getElementById("file")).files;
    var selectedFiles=[];
    for (var i = 0; i<files.length; i++){
      var obj={
        name : files[i].name,
        size : files[i].size,
        type : files[i].type
      
      };

      selectedFiles.push(obj);
    }
    sessionStorage.setItem("previews",JSON.stringify(selectedFiles));
    console.log(selectedFiles)
    this.previewFiles();
  }

  async previewFiles(){
    const popover  = await this.popoverController.create({
        component: PreviewPage
    });
    popover.present();
    popover.onDidDismiss().then(()=>{
        if(sessionStorage.getItem("send")=="true"){
          sessionStorage.setItem("send","false");
          var files= (<HTMLInputElement>document.getElementById("file")).files;
          for (var i = 0; i<files.length; i++){
            var fileId= Date.now();
            this.chat.push({
              fileName: files[i].name,
              fileSize:files[i].size,
              fileType: files[i].type,
              isUploading: true,
              uid:this.uid,
              fileId: fileId+ files[i].name,
              progress: 0,
            });
            this.uploadFile(files[i],fileId,files[i].name,files[i].type)
          }
        }
     })
    }

    uploadFile(file,fileId,fileName,fileType){

      console.log(this.myname,this.id,this.buddy.uid)
      var uploadTask =  this.db.database.app.storage().ref('image').child(fileName).put(file);
      uploadTask.on("state_changed",snap=>{
        var percentage = snap.bytesTransferred / snap.totalBytes;
        var index = this.chat.findIndex(x=> x.fileId== fileId + fileName);
        this.chat[index]['progress']= percentage*100;
      },(err)=>{console.log(err)},
      ()=>{
        var index =this.chat.findIndex(x=> x.fileId== fileId + fileName);
        this.chat[index]['isUploading']=false;
        this.chat[index]['msg']= fileName;
        this.db.database.app.firestore().collection('buddy').doc(this.id).collection(this.buddy.uid)
        .add({
            uid: this.id,
            message: fileName,
            sender_name : this.myname,
            timestamp: Date.now(),
            isUploading : false,
            fileType:fileType
          }).then(()=>{
            this.db.database.app.firestore().collection('buddy').doc(this.buddy.uid).collection(this.id)
            .add({
                uid: this.id,
                message: fileName,
                sender_name : this.myname,
                timestamp: Date.now(),
                isUploading : false,
                fileType:fileType
              })
          })
      })
    }
    openFile(fileName){
      this.db.database.app.storage().ref( ).child('image').child(fileName)
      .getDownloadURL().then(url =>{
        window.open(url,"_blank");
        console.log(fileName)
      })
    }
    bytesToSize(bytes){
      var sizes=['Bytes','KB','MB','GB','TB'];
      for(var i =0; i<sizes.length;i++){
        if(bytes <= 1024){
          return bytes+''+sizes[i];
        }else{
          bytes= parseFloat(String(bytes/1024)).toFixed(2)
        }
      }
    }
  
    getIcon(type:String){
      if(type.startsWith("image")){
        return "image-outline";
      }
      else if(type.startsWith("video")){
        return "videocam-outline";
      }
      else if(type.startsWith("audio")){
        return "musical-note-outline";
      }
      else{
        return "document-outline";
      }
    }
    getIconColor(type:String){
      if(type.startsWith("image")){
        return "primary";
      }
      else if(type.startsWith("video")){
        return "success";
      }
      else if(type.startsWith("audio")){
        return "danger";
      }
      else{
        return "warning";
      }
    }
}
