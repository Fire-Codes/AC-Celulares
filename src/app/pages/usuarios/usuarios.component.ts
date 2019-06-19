import { Component, OnInit } from '@angular/core';

// importacion del modulo para angularBootstrap
import { NgbModal, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

// importacion del servicio
import { ServicioService } from 'src/app/servicios/servicio.service';

// se importan los componentes de la base de datos
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

// se importan las interfaces
import { Usuario } from 'src/app/interfaces/usuario';

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
  public Usuarios: Usuario[] = [];
  public coleccionDeUsuarios: AngularFirestoreCollection<Usuario>;
  constructor(
    public ngbModal: NgbModal,
    public calendar: NgbCalendar,
    public servicio: ServicioService,
    public fs: AngularFirestore,
    public db: AngularFireDatabase
  ) {
    // Se extraen todos los productos ingresados
    this.coleccionDeUsuarios = this.fs.collection<Usuario>(`/AC Celulares/Control/Usuarios`);
    this.coleccionDeUsuarios.valueChanges().subscribe(usuarios => {
      this.Usuarios = [];
      usuarios.forEach(usuario => {
        if ((usuario.Correo === 'coronadodiego411@gmail.com') || (usuario.Correo === 'kevinaguilar9582@gmail.com')) {

        } else {
          this.Usuarios.push(usuario);
        }
      });
    });
  }

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

  // funcion para pagarle al usuario
  pagarleUsuario(usuario: Usuario) {
    this.fs.doc<Usuario>(`/AC Celulares/Control/Usuarios/${usuario.Correo}`).update({
      TotalAcumulado: 0,
      Ventas: 0,
      Flasheos: 0,
      Reparaciones: 0
    }).then(resp => {
      this.servicio.newToast(1, 'Pago Realizado', 'Se ha reiniciado los datos del usuario correctamente');
    }).catch(err => {
      this.servicio.newToast(0, 'Pago no Realizado', err);
    });
  }

}
