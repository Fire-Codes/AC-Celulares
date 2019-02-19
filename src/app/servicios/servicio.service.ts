import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// importaciones para el correcto funcionamiento del codigo
import { promise } from 'protractor';
import { reject } from 'q';
import { map } from 'rxjs/operators';

// se importa la interfaz del usuario
import { Usuario } from './../interfaces/usuario';

// se importa la interfaz del cliente
import { Cliente } from './../interfaces/cliente';

// importacion del componente para los toast
import { ToastrService, IndividualConfig } from 'ngx-toastr';

// importaciones de los componente de angularfire
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  Usuarios: AngularFirestoreCollection<Usuario>;
  constructor(
    public router: Router,
    public auth: AngularFireAuth,
    public toast: ToastrService,
    public fs: AngularFirestore
  ) { }

  // funcion para extraer todos los usuarios de la base de datos
  public extraerUsuarios() {
    let Usuarioss: Usuario[];
    this.Usuarios = this.fs.collection<Usuario>('AC Celulares/Control/Clientes');
    this.Usuarios.valueChanges().subscribe(usuario => {
      // Assign the data to the data source for the table to render
      Usuarioss = usuario;
    });
    console.warn(Usuarioss);
    return Usuarioss;
  }

  // funcion para navegar entre las paginas con el angular router
  public navegar(ruta: string) {
    this.router.navigate([`/${ruta}`]);
  }

  // funcion para mostrar los toast desde cualquier pagina que tenga acceso al servicio
  public newToast(tipo: number, titulo: string, mensaje: string) {
    const toastSettings: Partial<IndividualConfig> = {
      timeOut: 7000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing'
    };
    if (tipo === 1) {
      this.toast.success(`${mensaje}`, `${titulo}`, toastSettings);
    } else {
      this.toast.error(`${mensaje}`, `${titulo}`, toastSettings);
    }
  }

  // funcion para registrar un nuevo usuario
  public crearUsuario(email: string, contraseña: string) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.auth.auth.createUserWithEmailAndPassword(email, contraseña)
        .then(datosUsuario => resolve(datosUsuario), err => reject(err))
        .catch((err) => {
          console.error(err);
        });
    });
  }

  // funcion para iniciar sesion con los usuarios ya registrados
  public login(email: string, contraseña: string) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.auth.auth.signInWithEmailAndPassword(email, contraseña)
        .then(datosUsuario => resolve(datosUsuario), err => reject(err))
        .catch((err) => {
          console.error(err);
        });
    });
  }

  // funcion para cerrar sesion y redireccionar a la pagina principal
  public logout() {
    return this.auth.auth.signOut().then((response) => {
      console.warn('Se ha cerrado Sesion');
      this.navegar('');
    }).catch((err) => {
      console.error(err);
    });
  }

  // funcion para enviar un correo de verificacion al usuario
  public enviarEmailVerificacion() {
    const usuario = this.auth.auth.currentUser;

    usuario.sendEmailVerification().then((response) => {
      console.log('Mensaje de Verificacion de nuevo usuario enviado correctamente');
    }).catch((err) => {
      console.error(err);
    });
  }

  // funcion que verifica el estado actual del auth de un usuario
  public verificarEstadoUsuario() {
    return this.auth.authState;
  }

}
