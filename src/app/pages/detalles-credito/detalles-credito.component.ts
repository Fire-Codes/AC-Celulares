import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServicioService } from '../../servicios/servicio.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
// importacion del componente para los modals
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// declaracion de la interfaz del cliente
export interface UserData {
  id: string;
  Nombre: string;
  Telefono: string;
  Tipo: string;
  Cedula: String;
}

export interface Section {
  name: string;
  updated: Date;
}


@Component({
  selector: 'app-detalles-credito',
  templateUrl: './detalles-credito.component.html',
  styleUrls: ['./detalles-credito.component.scss']
})
export class DetallesCreditoComponent implements OnInit {
  // variables de input, output y eventemitter
  // variable que contendra los datos del cliente que se pasaron desde el router
  @Input() cliente: UserData = null;
  @Input() mostrarDetallesCliente = false;
  @Output() cerrarDetalles = new EventEmitter();

  // variable que establece el tipo de cliente ingresado 'Premium' || 'Estándar'
  esClientePremium = false;

  // variable que almacena los tipos de zapatos en el caso para el historial de abonos
  folders: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    }
  ];
  notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];

  // variable que contendra los datos del cliente que se pasaron desde el router
  // cliente: any;

  constructor(
    public servicio: ServicioService,
    public ngbModal: NgbModal,
    public router: Router,
    public route: ActivatedRoute
  ) {
    // inyeccion del cliente llamado desde el router
    /*this.route.queryParams.subscribe((parametro: any) => {
      // se asigna el valor del parametro a la variable cliente
      this.cliente = parametro;
    });*/
  }

  ngOnInit() {
    // console.log(this.cliente);
    // console.log(typeof (this.cliente));
    // console.log(this.cliente.Cedula.toString());
    if (this.cliente.Tipo === 'Premium') {
      this.esClientePremium = true;
    } else {
      this.esClientePremium = false;
    }
  }

  navegar(ruta: string) {
    this.servicio.navegar(ruta);
  }

  // funcion para abrir los modales de manera centrada
  openVerticallyCentered(content: string) {
    this.ngbModal.open(content, { centered: true });
  }

  // onCerrarDetalles fn
  onCerrarDetalles() {
    this.cerrarDetalles.emit();
  }
}
