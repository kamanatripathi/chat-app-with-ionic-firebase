import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  email: string ;
  password: string ;
  cpassword: string ;

  passwordType = 'password';
  passwordIcon = 'eye-off';
  constructor(public afr: AngularFireAuth, public rout: Router , 
    public alertController: AlertController,public loading:LoadingController) { }

  ngOnInit() {
  }
  
  async errorpassIguales() {
    const alert = await this.alertController.create({
      message: 'The password dont macth',
      buttons: ['OK']
    });

    await alert.present();
  }

  async errorServ() {
    const alert = await this.alertController.create({
      message: 'Something went wrong try later',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  async error(mensaje: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
moveFocus(nextElement) {
  nextElement.setFocus();
}
  async register() {
    this.presentLoading;
    const { email, password, cpassword } = this;

    if (password !== cpassword) {
      this.errorpassIguales();
      this.loading.dismiss()
      this.rout.navigate(['/registration']);
    } else {
      try {
        await this.afr.createUserWithEmailAndPassword(email, password).then(data => {
          console.log(data);
          setTimeout( () => {
            this.loading.dismiss();
            this.rout.navigate(['/tabs/profile']);
          }, 1000);
        });

      } catch (error) {
        console.log(error);
        if (error.code === 'auth/wrong-password') {
          this.error('Incorrect Password');
        }  if (error.code === 'auth/user-not-found') {
          this.error('User dont found');
        }
        if (error.code === 'auth/email-already-in-use') {
          this.error('User already use');
        }
        if ( error.code === 'auth/argument-error') {
          this.error('Argument error');
         }
         if ( error.code === 'auth/invalid-email') {
          this.error('Invalid email');
         }
      }
    }
  }
  goLogin(){
this.rout.navigateByUrl("/login")
  }


}
