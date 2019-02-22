import { ProductoFactura } from './producto-factura';
export interface HistorialCompra {
    'Articulos Comprados': ProductoFactura[];
    'Tipo de Pago': string;
    'Total Cordoba': number;
    'Total Dolar': number;
    Hora: number;
    Minuto: number;
    Segundo: number;
    Dia: number;
    Mes: string;
    Ano: number;
    Fecha: string;
    Tiempo: string;
    Id: string;
}
