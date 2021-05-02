import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
//ionic storage
import { IonicStorageModule } from '@ionic/storage-angular';
//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AutosizeModule} from 'ngx-autosize';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const firebaseConfig = {
  apiKey: "AIzaSyCQs5lb5Fd58HZTdOX7HANcMZ6qzumrNl8",
  authDomain: "letsping-98365.firebaseapp.com",
  projectId: "letsping-98365",
  storageBucket: "letsping-98365.appspot.com",
  messagingSenderId: "170634501641",
  appId: "1:170634501641:web:be81976972dd1e14a7a2d8",
  measurementId: "G-93GHKH3669"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(),  
    FormsModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AutosizeModule ,
    FormsModule  ,    
    RoundProgressModule,
  ],
  providers: [SplashScreen,StatusBar,Camera,FormBuilder,
      FileChooser,File,FilePath,DatePipe,
    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, }],
  bootstrap: [AppComponent],
})
export class AppModule {}
