import { Component, OnInit, ViewChild } from '@angular/core';
import { NavsideComponent } from '../navside/navside.component';

// importacion del servicio
import { ServicioService } from '../../servicios/servicio.service';

// importacion del componente para los toast
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // variables de observacion a la directiva del container de los toast
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

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
    this.toast.overlayContainer = this.toastContainer;
  }

  // funcion para realizar el login
  private login() {
    this.servicio.login(this.email, this.password)
      .then((usuario) => {
        this.loginCorrecto = true;
        this.servicio.navegar('dashboard');
        console.warn('Inicio de Sesion Correcto');
        this.toast.success(`Bienvenido ${this.servicio.auth.auth.currentUser.email}`, 'Inicio de Sesion Correcto');
      }).catch((err) => {
        this.errorLogin = err;
        console.error(err);
        this.toast.error(this.errorLogin, 'Inicio de Sesion Erróneo', {
          closeButton: true,
          timeOut: 3000,
          easing: 'ease-in',
          progressBar: true,
          progressAnimation: 'increasing',
          tapToDismiss: true
        });
      });
  }
}
