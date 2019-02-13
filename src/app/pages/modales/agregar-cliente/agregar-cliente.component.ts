import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';



@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.scss']
})
export class AgregarClienteComponent implements OnInit {

  // variables para los ngModel de cada input
  primerNombre = '';
  segundoNombre = '';
  primerApellido = '';
  segundoApellido = '';
  tipoUsuario = '';
  celular: number;
  cedula = '';
  sexo = '';
  email = '';
  departamento = '';
  municipio = '';
  direccion = '';
  id = '';
  nombreCompleto = '';
  nombres = '';
  apellidos = '';


  // variables para emision de eventos
  @Output() cerrarModalEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  // funcion para emitir el evento para cerrar el modal
  cerrarModal() {
    this.cerrarModalEvent.emit();
  }

  // funcion para hacer mayusculas el texto ingresado
  toUpper() {
    this.primerNombre = this.primerNombre.toUpperCase();
    this.segundoNombre = this.segundoNombre.toUpperCase();
    this.primerApellido = this.primerApellido.toUpperCase();
    this.segundoApellido = this.segundoApellido.toUpperCase();
    this.cedula = this.cedula.toUpperCase();
  }
}
