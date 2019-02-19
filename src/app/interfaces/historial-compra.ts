import { ArticulosComprados } from './articulos-comprados';
export interface HistorialCompra {
    'Articulos Comprados': ArticulosComprados[];
    'Tipo de Pago': string;
    'Total Cordoba': number;
    'Total Dolar': number;
    Fecha: Date;
}
