import { Component, OnInit } from '@angular/core';

// importacion del componente del navside
import { NavsideComponent } from './../navside/navside.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    public nav: NavsideComponent
  ) {
    this.nav.mostrarNav = false;
  }

  ngOnInit() {
  }

}
