import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as $ from 'jquery';

// importacion del servicio
import { ServicioService } from '../../servicios/servicio.service';


@Component({
  selector: 'app-navside',
  templateUrl: './navside.component.html',
  styleUrls: ['./navside.component.scss']
})
export class NavsideComponent implements OnInit {
  mostrarNav = true;
  abierto = false;
  panel: any;
  constructor(
    public router: Router,
    private servicio: ServicioService
  ) {
    console.log(this.router.url);
    /*if ((this.router.url === '/') || (this.router.url === '/ingresar') || this.router.url === '/plataforma') {
      this.mostrarNav = false;
    } else if ((this.router.url === 'dashboard')) {
      this.mostrarNav = true;
    }*/
  }

  ngOnInit() {
    this.panel = document.getElementById('sidenavPanel');
  }

  navegar(ruta: string) {
    this.servicio.navegar(ruta);
  }
  imprimir() {
    // window.print();
  }
  abrirCerrar() {
    if (this.abierto) {
      /*$('#sidenavPanel').removeClass('sidePanelAbierto');
      $('#sidenavPanel').addClass('sidePanelCerrado');*/
      this.panel.classList.remove('sidePanelAbierto');
      this.panel.classList.add('sidePanelCerrado');
      this.abierto = false;
    } else {
      /*$('#sidenavPanel').removeClass('sidePanelCerrado');
      $('#sidenavPanel').addClass('sidePanelAbierto');*/
      this.panel.classList.remove('sidePanelCerrado');
      this.panel.classList.add('sidePanelAbierto');
      this.abierto = true;
    }
  }
}
