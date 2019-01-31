import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// importaciones para el correcto funcionamiento del codigo
import { promise } from 'protractor';
import { reject } from 'q';
import { map } from 'rxjs/operators';

// importaciones de los componente de angularfire
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(
    public router: Router,
    public auth: AngularFireAuth
  ) { }

  public navegar(ruta: string) {
    this.router.navigate([`/${ruta}`]);
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
  public verificarUsuario() {
    const usuario = this.auth.auth.currentUser;

    usuario.sendEmailVerification().then((response) => {
      console.log('Mensaje de Verificacion de nuevo usuario enviado correctamente');
    }).catch((err) => {
      console.error(err);
    });
  }
}
