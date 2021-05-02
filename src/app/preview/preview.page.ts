import { Component, OnInit } from '@angular/core';
import { PopoverController} from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
})
export class PreviewPage implements OnInit {
previews= []
  constructor(public popoverController: PopoverController,public storage:StorageService) {
   this.previews = JSON.parse(sessionStorage.getItem("previews"));
   console.log(this.previews);
   }

  ngOnInit() {
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
  send(){
    sessionStorage.setItem("send","true");
    this.popoverController.dismiss();
  }
}
