import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// importacion de los modulos de ng-bootstrap
import { NgBootstrapModule } from './modulos/ng-bootstrap/ng-bootstrap.module';

// importacion de todos los modulos de @angular/material
import { AngularMaterialModule } from './modulos/angular-material/angular-material.module';

// importacion de las variables de produccion
import { environment } from './../environments/environment';

// importacion de los servicios
import { ServicioService } from './servicios/servicio.service';

// importaciones de los modulos de firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

// importacion para el modulo de los toast
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';

// imprtaciones de los componentes de cada pagina
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SeleccionarPlataformaComponent } from './pages/seleccionar-plataforma/seleccionar-plataforma.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NavsideComponent } from './pages/navside/navside.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { FacturarComponent } from './pages/facturar/facturar.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { CreditosComponent } from './pages/creditos/creditos.component';
import { DetallesCreditoComponent } from './pages/detalles-credito/detalles-credito.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { PagoServiciosComponent } from './pages/pago-servicios/pago-servicios.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AgregarClienteComponent } from './pages/modales/agregar-cliente/agregar-cliente.component';
import { TablaClientesComponent } from './pages/tablas/tabla-clientes/tabla-clientes.component';
import { SeleccionarProductoComponent } from './pages/modales/seleccionar-producto/seleccionar-producto.component';
// tslint:disable-next-line:max-line-length
import { SeleccionarProductoDescuentoComponent } from './pages/modales/seleccionar-producto-descuento/seleccionar-producto-descuento.component';
import { VentaRapidaComponent } from './pages/modales/venta-rapida/venta-rapida.component';
import { ReservarProductoComponent } from './pages/modales/reservar-producto/reservar-producto.component';
import { SistemaApartadoComponent } from './pages/tablas/sistema-apartado/sistema-apartado.component';
import { ProductosReservadosComponent } from './pages/productos-reservados/productos-reservados.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    SeleccionarPlataformaComponent,
    DashboardComponent,
    NavsideComponent,
    InventarioComponent,
    UsuariosComponent,
    ClientesComponent,
    FacturarComponent,
    PageNotFoundComponent,
    CreditosComponent,
    DetallesCreditoComponent,
    ServiciosComponent,
    PagoServiciosComponent,
    PerfilComponent,
    AgregarClienteComponent,
    TablaClientesComponent,
    SeleccionarProductoComponent,
    SeleccionarProductoDescuentoComponent,
    VentaRapidaComponent,
    ReservarProductoComponent,
    SistemaApartadoComponent,
    ProductosReservadosComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,

    AngularMaterialModule,

    ToastrModule.forRoot(),
    ToastContainerModule,

    FormsModule,
    ReactiveFormsModule,

    NgBootstrapModule
  ],
  providers: [ServicioService, NavsideComponent, FacturarComponent, SeleccionarProductoComponent, VentaRapidaComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
