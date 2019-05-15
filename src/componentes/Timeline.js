import React, {Component} from "react";
import FotoItem from "./FotoItem";

export default class Timeline extends Component{

    constructor(props){
        debugger;
        super(props);
        this.state = {fotos:[]};
        this.login = this.props.login;
    }

    carregaFotos(){      
        let urlPerfil;
        if(this.login === undefined) {
            urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        } else {
            urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`;
        }

        fetch(urlPerfil)        
        .then(resp=> resp.json())
        .then(fotos=> {
            this.setState({fotos:fotos})
        });
    }

    componentDidMount(){       
      this.carregaFotos();
    }

    //it will receive the next props. is not the this
    /*
    O método componentWillReceiveProps serve justamente para sermos 
    notificados quando um componente receber novos parâmetros. 
    A ideia é que em função das novas propriedades, possamos tomar 
    alguma decisão, por exemplo alterando o estado e disparando uma 
    nova renderização.
     */  
    componentWillReceiveProps(nextProps){       
        if(nextProps.login !== undefined){
            this.login = nextProps.login;
            this.carregaFotos();
        }
    }

    render(){
        return (
            <div className="fotos container">
                { this.state.fotos.map(foto=> <FotoItem key={foto.id} foto={foto}/>) }  
            </div>       
        );
    }
}