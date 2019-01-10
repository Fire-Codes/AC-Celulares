import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

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
    ClientesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,

    AngularMaterialModule,

    NgBootstrapModule
  ],
  providers: [ServicioService, NavsideComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
