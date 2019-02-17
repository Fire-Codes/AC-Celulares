export interface Municipios {
    'IdMunicipio': number;
    'NombreMunicipio': string;
}
export interface DepartamentosMunicipios {
    NombreDepartamento: string;
    MunicipiosDepartamento: Municipios[];
}
