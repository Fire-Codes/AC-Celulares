import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// se importan los componentes para firebase
// tslint:disable-next-line:max-line-length
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshot, Action, DocumentChangeAction } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

// se importa el servicio
import { ServicioService } from '../../../servicios/servicio.service';

// se importa la interfaz del control para la tienda accelulares
import { ControlTienda } from 'src/app/interfaces/control';
import { CamposTiendas } from 'src/app/interfaces/campos-tiendas';
import { Cliente } from 'src/app/interfaces/cliente';
import { DepartamentosMunicipios } from 'src/app/interfaces/departamentos-municipios';
import { Producto } from 'src/app/interfaces/producto';

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
  departamento = 'Chinandega';
  departamentos: string[] = [
    'Managua',
    'Boaco',
    'Carazo',
    'Chinandega',
    'Chontales',
    'Esteli',
    'Granada',
    'Jinotega',
    'Leon',
    'Madriz',
    'Masaya',
    'Matagalpa',
    'Nueva Segovia',
    'Rio San Juan',
    'Rivas',
    'Región Autónoma de la Costa Caribe Norte (RAAN)',
    'Región Autónoma de la Costa Caribe Sur (RAAS)'
  ];
  departamentosMunicipios: DepartamentosMunicipios[];
  municipio = 'Chichigalpa';
  direccion = '';
  id = '';
  nombreCompleto = '';
  nombres = '';
  apellidos = '';

  // variables que contendran la cantidad de cliente
  cantidadClientes: number;

  contadorErrores = 0;

  // variables para emision de eventos
  @Output() cerrarModalEvent = new EventEmitter();

  constructor(
    public fs: AngularFirestore,
    public servicio: ServicioService,
    public db: AngularFireDatabase
  ) {
    this.fs.doc('AC Celulares/Control').snapshotChanges().subscribe((controles: Action<DocumentSnapshot<ControlTienda>>) => {
      this.cantidadClientes = controles.payload.data()['Cantidad de Clientes'];
      this.departamentosMunicipios = controles.payload.data()['Departamentos y Municipios'];
    });
  }

  ngOnInit() {
  }

  // funcion para agregar el cliente al sistema
  agregarCliente() {

    // condicional que verifica que todos los inputs esten correctamente rellenados
    // tslint:disable-next-line:max-line-length
    if ((this.primerNombre === '') || (this.segundoNombre === '') || (this.primerApellido === '') || (this.segundoApellido === '') || (this.tipoUsuario === '') || (this.sexo === '') || (this.departamento === '') || (this.municipio === '') || (this.direccion === '')) {
      this.servicio.newToast(0, 'Faltan Datos!', 'Ingrese todos los campos que son requeridos para proceder');
      console.error('datos incorrectos');
    } else {

      // condicional que verifica que el cliente que se va a agregar no coincida con los datos de otro ya agregado a la base de datos
      this.fs.collection('AC Celulares/Control/Clientes').snapshotChanges().subscribe((documentos: DocumentChangeAction<Cliente>[]) => {
        documentos.map((documento: DocumentChangeAction<Cliente>) => {
          if (documento.payload.doc.data().Cedula === this.cedula) {
            this.servicio.newToast(0, 'Error de Insercción', 'Ya hay otro cliente registrado con este numero de Cédula.');
            this.contadorErrores = this.contadorErrores + 1;
            console.error('Error en la cedula=' + this.contadorErrores);
          } else if (documento.payload.doc.data().Correo === this.email) {
            this.servicio.newToast(0, 'Error de Insercción', 'Ya hay otro cliente registrado con este coreo eletrónico.');
            this.contadorErrores = this.contadorErrores + 1;
            console.error('Error en el correo=' + this.contadorErrores);
          } else if (documento.payload.doc.data().Id === this.nombreCompleto) {
            this.servicio.newToast(0, 'Error de Insercción', 'Ya hay otro cliente registrado con este Id.');
            this.contadorErrores = this.contadorErrores + 1;
            console.error('Error en el id=' + this.contadorErrores);
          } else if (documento.payload.doc.data().Telefono === this.celular) {
            this.servicio.newToast(0, 'Error de Insercción', 'Ya hay otro cliente registrado con este número telefónico.');
            this.contadorErrores = this.contadorErrores + 1;
            console.error('Error en el telefono=' + this.contadorErrores);
          }
        });
      });
      setTimeout(() => {
        // condicional que verifica la cantidad de errores que se produjeron al verificar los datos de otro cliente
        if (this.contadorErrores > 0) {
          console.error('Hubieron errores en la verificacion');
          return;
        } else {
          console.warn('No hubieron errores en la verificacion');
          // funcion que se ejecuta a un dado caso que el contador de errores sea igual  0
          this.fs.doc<Cliente>(`AC Celulares/Control/Clientes/${this.nombreCompleto}`).set({
            Id: this.nombreCompleto,
            'Primer Nombre': this.primerNombre,
            'Primer Apellido': this.primerApellido,
            'Segundo Nombre': this.segundoNombre,
            'Segundo Apellido': this.segundoApellido,
            Tipo: this.tipoUsuario,
            Telefono: this.celular,
            Cedula: this.cedula === '' ? null : this.cedula,
            Sexo: this.sexo,
            Correo: this.email === '' ? null : this.email,
            Departamento: this.departamento,
            Ciudad: this.municipio,
            Direccion: this.direccion,
            NombreCompleto: this.nombreCompleto,
            // tslint:disable-next-line:max-line-length
            PhotoURL: this.sexo === 'Masculino' ? 'https://firebasestorage.googleapis.com/v0/b/grupo-ac.appspot.com/o/defaultMasculino.png?alt=media&token=32df9bdc-edf0-4ab4-a896-8d80959aa642' : 'https://firebasestorage.googleapis.com/v0/b/grupo-ac.appspot.com/o/defaultFemenino.png?alt=media&token=6e35821c-007f-4979-b581-9383a9d79b6f',
            Apellidos: this.primerApellido + ' ' + this.segundoApellido,
            Nombres: this.primerNombre + ' ' + this.segundoNombre,
            'Cantidad de Compras': 0
          }).then((resp) => {
            this.servicio.newToast(1, 'Insercción Correcta', `El Cliente ${this.nombreCompleto} se agregó al sistema correctamente`);
            this.fs.doc<ControlTienda>('AC Celulares/Control').update({
              'Cantidad de Clientes': this.cantidadClientes + 1,
              'Contador de Clientes': this.cantidadClientes + 1
            });
          }).catch((err) => {
            this.servicio.newToast(0, 'Error de Insercción', err);
          });

          // integracion con el realtime database
          this.db.database.ref(`AC Celulares/Control/Clientes/${this.nombreCompleto}`).set({
            Id: this.nombreCompleto,
            'Primer Nombre': this.primerNombre,
            'Primer Apellido': this.primerApellido,
            'Segundo Nombre': this.segundoNombre,
            'Segundo Apellido': this.segundoApellido,
            Tipo: this.tipoUsuario,
            Telefono: this.celular,
            Cedula: this.cedula === '' ? null : this.cedula,
            Sexo: this.sexo,
            Correo: this.email === '' ? null : this.email,
            Departamento: this.departamento,
            Ciudad: this.municipio,
            Direccion: this.direccion,
            NombreCompleto: this.nombreCompleto,
            // tslint:disable-next-line:max-line-length
            PhotoURL: this.sexo === 'Masculino' ? 'https://firebasestorage.googleapis.com/v0/b/grupo-ac.appspot.com/o/defaultMasculino.png?alt=media&token=32df9bdc-edf0-4ab4-a896-8d80959aa642' : 'https://firebasestorage.googleapis.com/v0/b/grupo-ac.appspot.com/o/defaultFemenino.png?alt=media&token=6e35821c-007f-4979-b581-9383a9d79b6f',
            Apellidos: this.primerApellido + ' ' + this.segundoApellido,
            Nombres: this.primerNombre + ' ' + this.segundoNombre,
            'Cantidad de Compras': 0
          }).then((resp) => {
            this.db.database.ref('AC Celulares/Control').update({
              'Cantidad de Clientes': this.cantidadClientes + 1,
              'Contador de Clientes': this.cantidadClientes + 1
            });
          }).catch((err) => {
            console.error('Error al realizar la copia de seguridad al realtime database: ' + err);
          });

          // se manda a llamar a la funcion para limpar todos los inputs antes de cerrar el modal
          this.reiniciarInputs();


          // se manda a llamar al cerrar el modal solamente a un dado caso que todas las otras funciones hayan sido correctas
          this.cerrarModal();
        }
      }, 1500);
    }
  }

  // funcion para emitir el evento para cerrar el modal
  cerrarModal() {
    this.reiniciarInputs();
    this.cerrarModalEvent.emit();
  }

  // funcion para hacer mayusculas el texto ingresado
  toUpper() {
    this.primerNombre = this.primerNombre.toUpperCase();
    this.segundoNombre = this.segundoNombre.toUpperCase();
    this.primerApellido = this.primerApellido.toUpperCase();
    this.segundoApellido = this.segundoApellido.toUpperCase();
    this.cedula = this.cedula.toUpperCase();
    this.nombreCompleto = `${this.primerNombre} ${this.segundoNombre} ${this.primerApellido} ${this.segundoApellido}`;
  }

  // funcion para reiniciar todos los inputs
  reiniciarInputs() {
    this.primerNombre = '';
    this.segundoNombre = '';
    this.primerApellido = '';
    this.segundoApellido = '';
    this.tipoUsuario = '';
    this.celular = null;
    this.cedula = '';
    this.sexo = '';
    this.email = '';
    this.departamento = '';
    this.municipio = '';
    this.direccion = '';
    this.id = '';
    this.nombreCompleto = '';
    this.nombres = '';
    this.apellidos = '';
  }
}
