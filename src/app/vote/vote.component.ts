import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
})
export class VoteComponent implements OnInit {
  ionicForm: FormGroup;

mail:String;
  constructor(public formBuilder: FormBuilder , public router: Router  
     )  {
      console.log(this.mail);
   }
   Submit(){

    this.router.navigateByUrl('/newgroup')
   }
  ngOnInit() {}

}
