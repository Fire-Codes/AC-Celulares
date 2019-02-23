import { Component, OnInit } from '@angular/core';

// importacion del modulo para angularBootstrap
import { NgbModal, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

// importacion del servicio
import { ServicioService } from 'src/app/servicios/servicio.service';

// cracion de la interfaz para los usuarios
export interface UserData {
  id: string;
  Nombre: string;
  Telefono: string;
  Tipo: string;
  Cedula: String;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  model: NgbDateStruct;
  date: { year: number, month: number };
  constructor(
    public ngbModal: NgbModal,
    public calendar: NgbCalendar,
    public servicio: ServicioService
  ) { }

  ngOnInit() {
  }
  // funcion para abrir los modales de manera centrada
  openVerticallyCentered(content: string) {
    this.ngbModal.open(content, { centered: true });
  }

  // funcion para navegar al agregar usuarios
  agregarUsuario() {
    this.servicio.navegar('registrar');
  }

}
