import { Component, OnInit } from '@angular/core';

// importacion del componente del navside
import { NavsideComponent } from './../navside/navside.component';

// importacion del servicio
import { ServicioService } from '../../servicios/servicio.service';

// importacion de los componentes de firestore para su integracion con el componente actual
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

// importacion de la interfaz para el usuario
import { Usuario } from '../../interfaces/usuario';

// importacion de la interfaz para el control
import { ControlTienda } from './../../interfaces/control';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  nuevoUsuario: Usuario;
  primerNombre = '';
  segundoNombre = '';
  primerApellido = '';
  segundoApellido = '';
  username = '';
  correo = '';
  tipo = '';
  cargo = '';
  cedula = '';
  celular: number;
  contrasena = '';
  pertenece = '';
  sexo = '';

  // variable que contendra la cantidad total de usuarios actualmente
  totalUsuarios: number;
  constructor(
    public nav: NavsideComponent,
    public servicio: ServicioService,
    public fs: AngularFirestore,
    public db: AngularFireDatabase
  ) { }

  ngOnInit() {
    // se extrae la cantidad total de usuarios actualmente
    this.fs.doc<ControlTienda>('AC Celulares/Control').snapshotChanges().subscribe(control => {
      this.totalUsuarios = control.payload.data()['Cantidad Total de Usuarios'];
    });
  }

  // se crea la funcion para agregar un nuevo usuario
  agregarUsuario() {
    console.log('Registrando Usuario');
    this.servicio.crearUsuario(this.correo, this.contrasena).then(() => {
      this.servicio.newToast(1, 'Usuario Agregado!', `El Usuario ${this.username} ha sido agregado correctamente.`);
      this.fs.doc(`AC Celulares/Control/Usuarios/${this.correo}`).set({
        Nombres: this.primerNombre + ' ' + this.segundoNombre,
        Apellidos: this.primerApellido + ' ' + this.segundoApellido,
        Correo: this.correo,
        Pertenece1: this.pertenece === 'Pertenece1' ? true : false,
        Pertenece2: this.pertenece === 'Pertenece2' ? true : false,
        Pertenece3: this.pertenece === 'Pertenece3' ? true : false,
        Tipo: this.tipo,
        UID: null,
        Username: this.username,
        Celular: this.celular,
        Cedula: this.cedula,
        EstadoConexion: null,
        FechaUltimaConexion: null,
        HoraUltimaConexion: null,
        Cargo: this.cargo,
        Sexo: this.sexo,
        'Primer Nombre': this.primerNombre,
        'Segundo Nombre': this.segundoNombre,
        'Primer Apellido': this.primerApellido,
        'Segundo Apellido': this.segundoApellido,
        // tslint:disable-next-line:max-line-length
        PhotoURL: this.sexo === 'Masculino' ? 'https://firebasestorage.googleapis.com/v0/b/grupo-ac.appspot.com/o/defaultMasculino.png?alt=media&token=32df9bdc-edf0-4ab4-a896-8d80959aa642' : 'https://firebasestorage.googleapis.com/v0/b/grupo-ac.appspot.com/o/defaultFemenino.png?alt=media&token=6e35821c-007f-4979-b581-9383a9d79b6f'
      }).then(res => {
        const totalUsuarios = this.totalUsuarios + 1;
        console.warn('Datos del usuario agregados a firestore correctamente');
        this.fs.doc<ControlTienda>('AC Celulares/Control').update({ 'Cantidad Total de Usuarios': totalUsuarios }).then(resp => {
          this.db.database.ref('AC Celulares/Control').update({ 'Cantidad Total de Usuarios': totalUsuarios });
        });
        this.reiniciarInputs();
      }).catch(err => {
        console.error('Hubo un error al agregar los dtos del nuevo usuario a firestore: ' + err);
      });

      // integracion con el realtime database
      let id = this.correo;
      id = id.replace('.', '_');
      this.db.database.ref(`AC Celulares/Control/Usuarios/${id}`).set({
        Nombres: this.primerNombre + ' ' + this.segundoNombre,
        Apellidos: this.primerApellido + ' ' + this.segundoApellido,
        Correo: this.correo,
        Pertenece1: this.pertenece === 'Pertenece1' ? true : false,
        Pertenece2: this.pertenece === 'Pertenece2' ? true : false,
        Pertenece3: this.pertenece === 'Pertenece3' ? true : false,
        Tipo: this.tipo,
        UID: null,
        Username: this.username,
        Celular: this.celular,
        Cedula: this.cedula,
        EstadoConexion: null,
        FechaUltimaConexion: null,
        HoraUltimaConexion: null,
        Cargo: this.cargo,
        Sexo: this.sexo,
        'Primer Nombre': this.primerNombre,
        'Segundo Nombre': this.segundoNombre,
        'Primer Apellido': this.primerApellido,
        'Segundo Apellido': this.segundoApellido,
        // tslint:disable-next-line:max-line-length
        PhotoURL: this.sexo === 'Masculino' ? 'https://firebasestorage.googleapis.com/v0/b/grupo-ac.appspot.com/o/defaultMasculino.png?alt=media&token=32df9bdc-edf0-4ab4-a896-8d80959aa642' : 'https://firebasestorage.googleapis.com/v0/b/grupo-ac.appspot.com/o/defaultFemenino.png?alt=media&token=6e35821c-007f-4979-b581-9383a9d79b6f'
      });
    }).catch(err => {
      this.servicio.newToast(0, 'Hubo un Error!', `Error al agregar el usuario ${this.username}: ` + err);
      console.error('Hubo un eror al registrar al nuevo usuario: ' + err);
    });
  }

  // se crea la funcion para crear el username
  crearUsername() {
    this.toUpper();
    let primeraLetra = this.primerNombre.slice(0, 1);
    primeraLetra = primeraLetra.toUpperCase();
    this.username = primeraLetra;
    if (this.primerApellido === null) {
      console.log(this.username);
      return;
    } else {
      this.username += this.primerApellido;
    }
    console.log(this.username);
  }

  // funcion para reiniciar todos los inputs
  reiniciarInputs() {
    this.primerNombre = '';
    this.segundoNombre = '';
    this.primerApellido = '';
    this.segundoApellido = '';
    this.username = '';
    this.correo = '';
    this.tipo = '';
    this.cargo = '';
    this.cedula = '';
    this.celular = null;
    this.contrasena = '';
    this.pertenece = '';
    this.sexo = '';
  }

  // se crea la funcion para pasar todo el texto a mayusculas
  toUpper() {
    this.primerNombre = this.primerNombre.toUpperCase();
    this.segundoNombre = this.segundoNombre.toUpperCase();
    this.primerApellido = this.primerApellido.toUpperCase();
    this.segundoApellido = this.segundoApellido.toUpperCase();
    this.cedula = this.cedula.toUpperCase();
    this.cargo = this.cargo.toUpperCase();
  }
}
