import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export interface Producto {
    Id: string;
    Nombre: string;
    Marca: string;
    Categoria: string;
    Modelo: string;
    Existencia: number;
    PCompra: number;
    PVenta: number;
    Estado: string;
    Descripcion: string;
    Proveedor: string;
}

/*try {
    admin.initializeApp();
} catch (e) { }*/

/*exports.actualizarProveedores = functions.runWith({
    timeoutSeconds: 300,
    memory: '2GB'
}).https.onRequest((request, response) => {
    admin.firestore().collection('/AC Celulares/Control/Inventario/Tienda Principal/Productos').onSnapshot(documentos => {
        documentos.docs.forEach(documento => {
            admin.firestore().doc(`/AC Celulares/Control/Inventario/Tienda Principal/Productos/${documento.ref.id}`).update({
                Proveedor: 'DigiCell'
            }).then(resp => {
                console.warn(documento.ref.id + ' Actualizado!');
            }).catch(err => {
                console.error(err);
            })
        });
    });
});*/

    // // Start writing Firebase Functions
    // // https://firebase.google.com/docs/functions/typescript
    //
    // export const helloWorld = functions.https.onRequest((request, response) => {
    //  response.send("Hello from Firebase!");
    // });