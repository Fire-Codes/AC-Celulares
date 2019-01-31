import { Component, OnInit, ViewChild } from '@angular/core';
import { NavsideComponent } from '../navside/navside.component';

// importacion del servicio
import { ServicioService } from '../../servicios/servicio.service';

// importacion del componente para los toast
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // variables de email y password
  email: string;
  password: string;

  // variable para verificar si el login fue correcto o no
  loginCorrecto: boolean;
  errorLogin: string;

  constructor(
    public nav: NavsideComponent,
    public servicio: ServicioService,
    public toast: ToastrService
  ) {
    this.nav.mostrarNav = false;
  }

  ngOnInit() {
  }

  // funcion para realizar el login
  private login() {
    this.servicio.login(this.email, this.password)
      .then((usuario) => {
        this.loginCorrecto = true;
        this.servicio.navegar('dashboard');
        console.warn('Inicio de Sesion Correcto');
      }).catch((err) => {
        this.errorLogin = err;
        console.error(err);
        let errMensajeToast: string = null;
        switch (err.code) {
          case 'auth/argument-error':
            errMensajeToast = 'Revise si esta bien su correo y contraseña y/o rellene los campos';
            break;
          case 'auth/network-request-failed':
            errMensajeToast = 'Hubo un error con la conexion a internet, por favor verifiquela';
            break;
          case 'auth/wrong-password':
            errMensajeToast = 'Contraseña Incorrecta, favor ingrese de nuevo';
            break;
          case 'auth/user-not-found':
            errMensajeToast = 'El correo de usuario que ha ingresado no se encuentra en la base de datos';
            break;
          default:
            errMensajeToast = err;
            break;
        }
        this.servicio.newToast(0, 'Inicio de Sesión Erróneo', `${errMensajeToast}`);
      });
  }
}
