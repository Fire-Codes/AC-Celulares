import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


// se importan las interfaces
import { Usuario } from './../interfaces/usuario';
import { Cliente } from './../interfaces/cliente';
import { Producto } from 'src/app/interfaces/producto';
import { Factura } from '../interfaces/factura';

// importacion del componente para los toast
import { ToastrService, IndividualConfig } from 'ngx-toastr';

// se importa desde rxjs
import { Observable, Subscription } from 'rxjs';

// importaciones de los componente de angularfire
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';


@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  // variable que contendra temporalmente la factura a imprimir
  public facturaImprimir: Factura = null;

  // variable que contendra temporalmente el inventario a imprimir
  public inventarioImprimir: Producto[] = [];

  // variable que contendra al cliente al cual se veran sus compras
  public ClienteVerCompras: Cliente = null;

  // variable que contendra el arreglo de usuarios
  Usuarios: AngularFirestoreCollection<Usuario>;

  // variable que contendra a que tienda direccionar
  public tienda: string;

  // variable que contendra todos los meses del año
  public meses: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];

  // variable que contendra todos los dias de la semana
  public diaSemana: string[] = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viérnes',
    'Sábado',
  ];


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
    // console.warn(Usuarioss);
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

  // funcion para extraer la fecha
  public extraerFecha(): string {
    const tiempo = new Date();
    // tslint:disable-next-line:max-line-length
    return `${tiempo.getDate()}-${this.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`;
  }

  // funcion para registrar un nuevo usuario
  public crearUsuario(email: string, contraseña: string) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.auth.auth.createUserWithEmailAndPassword(email, contraseña)
        .then(datosUsuario => resolve(datosUsuario), err => reject(err))
        .catch((err) => {
          // console.error(err);
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
          // console.error(err);
        });
    });
  }

  // funcion para cerrar sesion y redireccionar a la pagina principal
  public logout() {
    return this.auth.auth.signOut().then((response) => {
      // console.warn('Se ha cerrado Sesion');
      this.tienda = '';
      this.navegar('');
    }).catch((err) => {
      // console.error(err);
    });
  }

  // funcion para enviar un correo de verificacion al usuario
  public enviarEmailVerificacion() {
    const usuario = this.auth.auth.currentUser;

    usuario.sendEmailVerification().then((response) => {
      // console.log('Mensaje de Verificacion de nuevo usuario enviado correctamente');
    }).catch((err) => {
      // console.error(err);
    });
  }

  // funcion que verifica el estado actual del auth de un usuario
  public verificarEstadoUsuario() {
    return this.auth.authState;
  }

  // funcion para extraer el numero de la semana
  public extraerNumeroSemana() {
    const today = new Date();
    const Year = this.tomarAno(today);
    const Month = today.getMonth();
    const Day = today.getDate();
    const now = Date.UTC(Year, Month, Day + 1, 0, 0, 0);
    const Firstday = new Date();
    Firstday.setFullYear(Year);
    Firstday.setMonth(0);
    Firstday.setDate(1);
    const then = Date.UTC(Year, 0, 1, 0, 0, 0);
    let Compensation = Firstday.getDay();
    if (Compensation > 3) {
      Compensation -= 4;
    } else {
      Compensation += 3;
    }
    const NumberOfWeek = Math.round((((now - then) / 86400000) + Compensation) / 7);
    return NumberOfWeek;
  }

  // funcion complementaria para la funcion de extraer el numero de la semana
  tomarAno(theDate) {
    const x = theDate.getYear();
    let y = x % 100;
    y += (y < 38) ? 2000 : 1900;
    return y;
  }

  // funcion para extraer el ano actual
  public extraerAno(): number {
    const tiempo = new Date;
    return tiempo.getFullYear();
  }

  // funcion para extraer el dia de la semana
  public extraerDiaSemana(): string {
    const tiempo = new Date();
    return `${this.diaSemana[tiempo.getDay()]}`;
  }

}
