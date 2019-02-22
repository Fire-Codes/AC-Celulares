import { ControlTienda } from 'src/app/interfaces/control';
import { Component, OnInit, ViewChild } from '@angular/core';

// importacion del componente navside
import { NavsideComponent } from '../navside/navside.component';

// importacion de los componentes de @angular/material
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

// importacion de los componentes de firestore
// tslint:disable-next-line:max-line-length
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, Action, DocumentSnapshot, DocumentChangeAction } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

// importacion de la interfaz para el producto
import { Producto } from '../../interfaces/producto';

// importacion de la interfaz para los campos de las tiendas
import { CamposTiendas } from '../../interfaces/campos-tiendas';

// importacion de los componentes de ng-bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// importacion del servicio
import { ServicioService } from '../../servicios/servicio.service';

import { Observable } from 'rxjs';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {

  // variable para mostrar, agregar datos, eliminar producto, editar y archivar un producto y se inicializa a null
  producto: Producto = null;

  // varible para la cantidad de productos actuales y las categorias existentes
  totalProductos: number;
  categorias: string[];
  contador: number;

  // variable que contiene la cantidad general de las 3 tiendas de productos
  totalGeneralProductos: number;

  // variable que decide si hay o no datos para mostrar en el data table
  hayDatos: boolean;

  // variables que contendra todos los productos
  coleccionDeProductos: AngularFirestoreCollection<Producto>;

  // variables de tipo observer para paginator y sort
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['Id', 'Nombre', 'Marca', 'Modelo', 'Categoria', 'Existencia', 'pCompra', 'pVenta', 'Acciones'];
  dataSource: MatTableDataSource<Producto>;

  // se declaran las variables para agregar un nuevo producto
  Id = '';
  Nombre = '';
  Marca = '';
  Categoria = '';
  Modelo = '';
  Existencia: number;
  PCompra: number;
  PVenta: number;
  Estado = '';
  Descripcion = '';
  nuevaCategoria = '';


  constructor(
    public nav: NavsideComponent,
    public ngbModal: NgbModal,
    public fs: AngularFirestore,
    public servicio: ServicioService,
    public db: AngularFireDatabase
  ) {
    // se muestra el navside
    this.nav.mostrarNav = true;

    // se extrae la cantidad total de productos almacenados y las categorias
    this.fs.doc(`AC Celulares/Control/Inventario/${this.servicio.tienda}`).snapshotChanges()
      .subscribe((documento: Action<DocumentSnapshot<CamposTiendas>>) => {
        this.totalProductos = documento.payload.data()['Cantidad de Productos'];
        this.categorias = documento.payload.data().Categorias;
        this.hayDatos = this.totalProductos <= 0 ? false : true;
        this.contador = this.totalProductos <= 0 ? 0 : documento.payload.data().Contador;
        console.log(this.contador + 1);
      });

    // se extrae la cantidad general de productos de las 3 tiendas
    this.fs.doc<ControlTienda>('AC Celulares/Control').snapshotChanges().subscribe(control => {
      this.totalGeneralProductos = control.payload.data()['Cantidad Total de Productos'];
    });

    // Se extraen todos los productos ingresados
    this.coleccionDeProductos = this.fs.collection<Producto>(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos`);
    this.coleccionDeProductos.valueChanges().subscribe(documento => {
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(documento);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data.length);
    });
  }

  ngOnInit() {

    // se extraen la cantidad de productos actual y las categorias actualmente existentes
    // tslint:disable-next-line:max-line-length
    this.fs.doc(`AC Celulares/Control/Inventario/${this.servicio.tienda}`).snapshotChanges()
      .subscribe((campos: Action<DocumentSnapshot<CamposTiendas>>) => {
        this.totalProductos = campos.payload.data()['Cantidad de Productos'];
        this.categorias = campos.payload.data().Categorias;
        this.reiniciarId();
      });

    // se extrae la cantidad general de productos de las 3 tiendas
    this.fs.doc<ControlTienda>('AC Celulares/Control').snapshotChanges().subscribe(control => {
      this.totalGeneralProductos = control.payload.data()['Cantidad Total de Productos'];
    });
  }

  // funcion para buscar producto en la tabla
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // funcion para abrir los modales de manera centrada
  openVerticallyCentered(content: string, producto: Producto) {
    this.ngbModal.open(content, { centered: true });
    this.producto = producto;
    this.reiniciarInputs();
  }

  // funcion para editar los datos de un producto
  editarProductos() {
    this.fs.doc(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.producto.Id}`).update(this.producto)
      .then(response => {
        this.servicio.newToast(1, 'Modificacion Correcta', `El Producto ${this.producto.Id} se ha modificado con éxito`);
      }).catch(err => {
        this.servicio.newToast(0, 'Modificacion Incorrecta', err);
      });

    // integracion con el realtime database
    this.db.database.ref(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.producto.Id}`).update(this.producto);
  }

  // funcion para eliminar un producto
  eliminarProductos() {
    const totalproductos = this.totalProductos - 1;
    const totalGeneralProductos = this.totalGeneralProductos - 1;
    this.fs.doc(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.producto.Id}`).delete()
      .then(response => {
        this.servicio.newToast(1, 'Eliminación Correcta', `El producto ${this.producto.Id} se ha eliminado correctamente`);

        // se actualizan la cantidad total de productos de dicha tienda
        this.fs.doc(`AC Celulares/Control/Inventario/${this.servicio.tienda}`).update({
          'Cantidad de Productos': totalproductos,
          Contador: totalproductos <= 0 ? 0 : this.contador
        }).then(resp => {
          console.warn('Cantidad de productos actualizada correctamente' + resp);
        }).catch(err => {
          console.error('Hubo un error al actualizar la cantidad de productos: ' + err);
        });

        // se actualizan los productos generales de las 3 tiendas
        this.fs.doc<ControlTienda>('AC Celulares/Control').update({
          'Cantidad Total de Productos': totalGeneralProductos
        }).then(resp => {
          console.warn('Cantidad de productos actualizada correctamente' + resp);
        }).catch(err => {
          console.error('Hubo un error al actualizar la cantidad de productos: ' + err);
        });

      }).catch(err => {
        this.servicio.newToast(1, 'Eliminación Incorrecta', err);
      });

    // integracion con el realtime database
    // tslint:disable-next-line:max-line-length
    this.db.database.ref(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.producto.Id}`)
      .remove().then(response => {

        // se actualizan la cantidad total de productos de dicha tienda
        this.db.database.ref(`AC Celulares/Control/Inventario/${this.servicio.tienda}`).update({
          'Cantidad de Productos': totalproductos,
          Contador: totalproductos <= 0 ? 0 : this.contador
        });

        // se actualizan los productos generales de las 3 tiendas
        this.db.database.ref(`AC Celulares/Control`).update({
          'Cantidad Total de Productos': totalGeneralProductos
        });
      });
  }

  // funcion para agregar un nuevo producto
  agregarProductos() {
    this.fs.doc(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.Id}`).set({
      Id: this.Id,
      Nombre: this.Nombre,
      Marca: this.Marca,
      Categoria: this.Categoria,
      Modelo: this.Modelo,
      Existencia: this.Existencia,
      PCompra: this.PCompra,
      PVenta: this.PVenta,
      Estado: 'Disponible',
      Descripcion: this.Descripcion
    }).then(response => {
      const totalproductos = this.totalProductos + 1;
      const contador = this.contador + 1;
      const totalGeneralProductos = this.totalGeneralProductos + 1;
      this.servicio.newToast(1, 'Insercción Correcta', 'El producto se agregó correctamente.');

      // se actualiza el total de productos de dicha tienda
      this.fs.doc(`AC Celulares/Control/Inventario/${this.servicio.tienda}`).update({
        'Cantidad de Productos': totalproductos,
        Contador: contador
      }).then(resp => {
        console.warn('Cantidad de productos actualizada correctamente' + resp);
        this.reiniciarInputs();
      }).catch(err => {
        console.error('Hubo un error al actualizar la cantidad de productos: ' + err);
      });

      // se actualiza el total general de productos de las 3 tiendas
      this.fs.doc<ControlTienda>('AC Celulares/Control').update({
        'Cantidad Total de Productos': totalGeneralProductos
      }).then(resp => {
        console.warn('Cantidad de productos actualizada correctamente' + resp);
      }).catch(err => {
        console.error('Hubo un error al actualizar la cantidad de productos: ' + err);
      });

    }).catch(err => {
      this.servicio.newToast(0, 'Insercción Incorrecta', err);
    });

    // integracion con el realtime database
    this.db.database.ref(`AC Celulares/Control/Inventario/${this.servicio.tienda}/Productos/${this.Id}`).set({
      Id: this.Id,
      Nombre: this.Nombre,
      Marca: this.Marca,
      Categoria: this.Categoria,
      Modelo: this.Modelo,
      Existencia: this.Existencia,
      PCompra: this.PCompra,
      PVenta: this.PVenta,
      Estado: 'Disponible',
      Descripcion: this.Descripcion
    }).then(response => {
      const totalproductos = this.totalProductos + 1;
      const contador = this.contador + 1;
      const totalGeneralProductos = this.totalGeneralProductos + 1;
      this.servicio.newToast(1, 'Insercción Correcta', 'El producto se agregó correctamente.');

      // se actualiza el total de productos de dicha tienda
      this.db.database.ref(`AC Celulares/Control/Inventario/${this.servicio.tienda}`).update({
        'Cantidad de Productos': totalproductos,
        Contador: contador
      }).then(resp => {
        console.warn('Cantidad de productos actualizada correctamente' + resp);
        this.reiniciarInputs();
      }).catch(err => {
        console.error('Hubo un error al actualizar la cantidad de productos: ' + err);
      });

      // se actualiza el total general de productos de las 3 tiendas
      this.db.database.ref(`AC Celulares/Control`).update({
        'Cantidad Total de Productos': totalGeneralProductos
      });

    }).catch(err => {
      console.error('Hubo un error al actualizar la cantidad de productos: ' + err);
    });
  }

  // funcion para agregar una nueva categoria de productos
  agregarCategoria() {
    // tslint:disable-next-line:prefer-const
    let nuevoArray = this.categorias;
    let parecidas = 0;
    nuevoArray.forEach(categoria => {
      if (categoria.toLowerCase() === this.nuevaCategoria.toLowerCase()) {
        parecidas = parecidas + 1;
      }
    });
    if (parecidas > 0) {
      this.servicio.newToast(0, 'Inserccion Incorrecta', 'Ya existe una categoria con este nombre');
    } else {
      nuevoArray.push(this.nuevaCategoria);
      this.fs.doc(`AC Celulares/Control/Inventario/${this.servicio.tienda}`).update({
        Categorias: nuevoArray
      }).then(response => {
        this.servicio.newToast(1, 'Inserccion Correcta', 'La nueva categoria de productos se agrego correctamente');
      }).catch(err => {
        this.servicio.newToast(0, 'Inserccion Incorrecta', err);
      });

      // integracion con el realtime database
      this.db.database.ref(`AC Celulares/Control/Inventario/${this.servicio.tienda}`).update({
        Categorias: nuevoArray
      });
    }
    this.nuevaCategoria = '';
  }

  // funcion para reiniciar todos los inputs
  reiniciarInputs() {
    this.Id = '';
    this.Id += 'PROD';
    this.Id += this.contador + 1;
    this.Categoria = '';
    this.Descripcion = '';
    this.Estado = 'Disponible';
    this.Existencia = 0;
    this.Marca = '';
    this.Modelo = '';
    this.Nombre = '';
    this.PCompra = 0;
    this.PVenta = 0;
    this.nuevaCategoria = '';
  }

  // funcion para agregar un nuevo id
  reiniciarId() {
    this.Id = '';
    this.Id += 'PROD';
    this.Id += this.contador + 1;
  }
}
