import axios from "axios";
import react, {Component} from "react";
import coordenadaService from "../services/coordenadaService";

class mapComponent extends Component {//en este componente es que uso GoogleApi
    constructor(props) {
        super(props)

        this.state = {
            coordenadas: [],
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8080/api/v1/todas').then((res) => {
            this.setState({coordenadas: res});
        });
    }

    enviarDatos = (event) => {
        console.log(event)
        //post con axios y coordenadas hardcodeadas
        axios.post('http://localhost:8080/api/v1/agregar', {
            latitud: 1,
            longitud: 2
        })
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    }

//cada coordenada deberia tener un id para poder iterar
//en el return se muestra el mapa
    render() {
        return (
            <form onSubmit={this.enviarDatos}>
                <div> {this.state.coordenadas.map(coordenada => <p key = {coordenada.id}>
                        {coordenada.lat} , {coordenada.lng}
                </p>)}
                </div>
                <br />
                <div>
                    <button type="submit"> Agregar </button>
                </div>
            </form>
        )
    }
}

export default mapComponent