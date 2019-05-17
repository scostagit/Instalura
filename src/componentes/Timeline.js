import React, {Component} from "react";
import FotoItem from "./FotoItem";
import Pubsub from "pubsub-js";
import  ReactCSSTransitionGroup  from "react/lib/ReactCSSTransitionGroup";


export default class Timeline extends Component{

    constructor(props){      
        super(props);
        this.state = {fotos:[]};
        this.login = this.props.login;
    }

    componentWillMount(){
        Pubsub.subscribe("autalizar-pesquisa", (topic, fotosPesquisa)=>{
           this.setState({fotos:fotosPesquisa});
        });

        Pubsub.subscribe("atualiza-like", (topico, infoLiker)=>{   
            
            const fotoAchada = this.state.fotos.find(foto=> foto.id === infoLiker.fotoId);
            //change the status of likeada propeerty
            fotoAchada.likeada  = !fotoAchada.likeada;
            
            const possivelLinker = fotoAchada.likers.find(liker=> liker.login=== infoLiker.liker.login);
            
            if(possivelLinker === undefined){           
                fotoAchada.likers.push(infoLiker.liker);
                
            }else{
                const novoLikers =  fotoAchada.likers.filter(liker=> liker.login!== infoLiker.liker.login);
                fotoAchada.likers = novoLikers;
            }  

            this.setState({fotos:this.state.fotos});
        });
      
      
        Pubsub.subscribe("autaliza-novo-comentatio", (topico, infoComentario)=>{    
            const fotoAchada = this.state.fotos.find(foto=> foto.id === infoComentario.fotoId); 
            fotoAchada.comentarios.push(infoComentario.novoComentario);  
            this.setState({fotos:this.state.fotos});            
        });
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

    comenta(fotoId, textoComentario){

        const requestInfo = {
            method:'POST',
            body: JSON.stringify({texto:textoComentario}),
            headers: new Headers({
              'Content-type':'application/json'
            })
          };
          
          fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
            .then(response=>{        
                if(response.ok){
                  return response.json();
                }else{
                  throw new Error("Não foi possivel efetar o comentario!");
                }           
            })
            .then(novoComentario=>{
                Pubsub.publish("autaliza-novo-comentatio", {fotoId, novoComentario});            
            })
            .catch(error=>{
              console.log(error);
            });
    }

    like(fotoId){
        fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`,{method:"POST"})
        .then(response=>{
          if(response.ok){
            return response.json();
          }else{
            throw new Error("nao foi possivel realizar o like")
          }
        })
        .then(liker=> {  
             Pubsub.publish("atualiza-like", {fotoId, liker});
        })
        .catch(error=> console.log(error));
    }

    render(){
        return (
            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>                        
                    { 
                        this.state.fotos.map(foto=> <FotoItem key={foto.id} foto={foto} onLikeClick={this.like} onComentaSubmit={this.comenta}/>)
                    } 
                </ReactCSSTransitionGroup>               
            </div>       
        );
    }
}