import React, {Component} from "react";
import FotoItem from "./FotoItem";
import  ReactCSSTransitionGroup  from "react/lib/ReactCSSTransitionGroup";

export default class Timeline extends Component{

    constructor(props){      
        super(props);
        this.state = {fotos:[]};
        this.login = this.props.login;       
    }

    componentWillMount(){
        this.props.store.subscribe(fotos=>{
            this.setState({fotos:fotos});
        });               
    }

    carregaFotos(){      
        let urlPerfil;
        if(this.login === undefined) {
            urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        } else {
            urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`;
        }

        this.props.store.lista(urlPerfil);
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

    comenta(fotoId, textoComentario){
        this.props.store.comenta(fotoId, textoComentario);
    }

    like(fotoId){
        this.props.store.like(fotoId);
    }

    render(){
        return (
            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>                        
                    { 
                        this.state.fotos.map(foto=> 
                            <FotoItem key={foto.id} 
                                foto={foto} 
                                onLikeClick={this.like.bind(this)} 
                                onComentaSubmit={this.comenta.bind(this)}/>
                        )
                    } 
                </ReactCSSTransitionGroup>               
            </div>       
        );
    }
}