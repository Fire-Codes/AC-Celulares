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
}
