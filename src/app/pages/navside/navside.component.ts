import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-navside',
  templateUrl: './navside.component.html',
  styleUrls: ['./navside.component.scss']
})
export class NavsideComponent implements OnInit {
  mostrarNav = true;
  constructor(
    public router: Router
  ) {
    console.log(this.router.url);
    /*if ((this.router.url === '/') || (this.router.url === '/ingresar') || this.router.url === '/plataforma') {
      this.mostrarNav = false;
    } else if ((this.router.url === 'dashboard')) {
      this.mostrarNav = true;
    }*/
  }

  ngOnInit() {
  }


  imprimir() {
    // window.print();
  }
}
