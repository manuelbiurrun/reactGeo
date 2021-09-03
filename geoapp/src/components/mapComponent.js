import react, {Component} from "react";
import coordenadaService from "../services/coordenadaService";

class mapComponent extends Component {//en este componente es que uso GoogleApi
    constructor(props) {
        super(props)

        this.state = {
            coordenadas: []
        }
    }

    componentDidMount() {
        coordenadaService.getCoordenadas().then((res) => {
            this.setState({coordenadas: res});
        });
    }
//la key deberia ser el id del restaurante
//en el return se muestra el mapa
    render() {
        return (
            <div> {this.state.coordenadas.map(coordenada => <p key = {}>
                    {coordenada.lat} , {coordenada.lng}
            </p>)}
            </div>
        )
    }
}

export default mapComponent