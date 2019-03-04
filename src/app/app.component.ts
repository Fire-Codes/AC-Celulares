import { Component, OnInit } from '@angular/core';
import { NavsideComponent } from './pages/navside/navside.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ACCELULARES';

  constructor(
    public nav: NavsideComponent
  ) {
    this.nav.mostrarNav = false;
  }

  ngOnInit() {
    /*window.addEventListener('beforeunload', function (e) {
      const confirmationMessage = '\o/';
      console.log(e);
      (e || window.event).returnValue = confirmationMessage; // Gecko + IE
      return confirmationMessage;                            // Webkit, Safari, Chrome
    });*/
  }
}
