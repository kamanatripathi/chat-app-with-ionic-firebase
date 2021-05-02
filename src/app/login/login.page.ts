import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string ;
  password: string ;


  passwordType = 'password';
  passwordIcon = 'eye-off';
  constructor(public afs: AngularFireAuth, public rout: Router ,  public alertController: AlertController) { }
  async login() {

    const { username, password } = this;
    console.log(username, password);
    try {
      const res = await this.afs.signInWithEmailAndPassword(username, password);
      console.log(res);
      setTimeout(() => {
        this.rout.navigateByUrl('');
      }, 1000);
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
       } else {
        this.error('Something went wrong try later');
       }
    }
  }


  goRegister() {
    this.rout.navigateByUrl('/registration');
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
    gotoslides() {
      this.login()
      this.rout.navigateByUrl('/login');
    }
 
  ngOnInit() {
  }

}
