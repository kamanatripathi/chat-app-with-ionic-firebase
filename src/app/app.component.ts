import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HomePage } from './home/home.page';
import{Platform } from '@ionic/angular';
 import { Router, NavigationExtras } from '@angular/router';
import{StorageService}  from '../app/services/storage.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  rootPage:any=HomePage;

  constructor(private storage: Storage,private router:Router,
    private statusBar: StatusBar,   
     private platform: Platform,
    public stoage: StorageService,
    public splashScreen:SplashScreen
        ) {      this.initializeApp();}
  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();
    this.router.navigateByUrl('home')
    
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.stoage.get('user_uid').then((data) => {
        console.log("data from storage", data);
        if (data !== null) {
          this.router.navigateByUrl('/tabs')
          this.splashScreen.hide(); 
        } 
        else {
          this.router.navigateByUrl('/home')
          console.log("Storage");

        }
        this.statusBar.backgroundColorByHexString('#b27409');
        this.statusBar.overlaysWebView(false);
        this.splashScreen.hide();
      });
  });
}
}
