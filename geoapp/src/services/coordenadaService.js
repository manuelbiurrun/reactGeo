import axios from "axios";

const COORDENADAS_GETAPI_URL = "http://localhost:8080/api/v1/coordenadas";
const COORDENADAS_POSTAPI_URL = "http://localhost:8080/api/v1/agregar";

class coordenadaService {

    getCoordenadas() {
        return axios.get(COORDENADAS_GETAPI_URL);
    }

    addCoordenadas(coordenada) {
        return axios.post(COORDENADAS_POSTAPI_URL, coordenada);
    }
}

export default new coordenadaService()