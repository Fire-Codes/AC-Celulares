import { Cliente } from './cliente';
import { Usuario } from './usuario';
import { Servicio } from './servicio';

export interface HistorialServicio {
    Cliente: Cliente;
    Vendedor: Usuario;
    Servicio: Servicio;
    MarcaDispositivo: string;
    ModeloDispositivo: string;
    TipoPago: string;
    Interes: number;
    ManoObra: number;
    Descripcion: string;
}
