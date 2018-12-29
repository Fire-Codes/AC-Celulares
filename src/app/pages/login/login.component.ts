import { Component, OnInit } from '@angular/core';
import { NavsideComponent } from '../navside/navside.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    public nav: NavsideComponent
  ) {
    this.nav.mostrarNav = false;
   }

  ngOnInit() {
  }

}
