import { DepartamentosMunicipios } from './departamentos-municipios';
export interface ControlTienda {
    'Cantidad de Clientes': number;
    'Cantidad Total de Productos': number;
    'Cantidad Total de Usuarios': number;
    'Contador de Clientes': number;
    'Departamentos y Municipios': DepartamentosMunicipios[];
    'Tipo de Cambio': number;
    'Cantidad Total de Facturas': number;
    'Cantidad Total de Servicios': number;
    Proveedores: string[];
}
