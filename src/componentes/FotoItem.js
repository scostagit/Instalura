import React, {Component} from "react";
import {Link} from "react-router";
import Pubsub from "pubsub-js";


class FotoAtualizacoes extends Component{
  constructor(props){
    super(props);
    this.state = {likeada: props.foto.likeada};
  }

  like(event){
      event.preventDefault();

       fetch(`https://instalura-api.herokuapp.com/api/fotos/${this.props.foto.id}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`,{method:"POST"})
       .then(response=>{
         if(response.ok){
           return response.json();
         }else{
           throw new Error("nao foi possivel realizar o like")
         }
       })
       .then(liker=> {           
            this.setState({likeada : !this.state.likeada});           
            Pubsub.publish("atualiza-like", {fotoId:this.props.foto.id, liker});
       })
       .catch(error=> console.log(error));
    }
  
    comenta(event){
      event.preventDefault();
      var texto = this.comentario.value;
      this.comentario.value = "";

      const requestInfo = {
        method:'POST',
        body: JSON.stringify({texto}),
        headers: new Headers({
          'Content-type':'application/json'
        })
      };
      
      fetch(`https://instalura-api.herokuapp.com/api/fotos/${this.props.foto.id}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
        .then(response=>{        
            if(response.ok){
              return response.json();
            }else{
              throw new Error("Não foi possivel efetar o comentario!");
            }           
        })
        .then(novoComentario=>{
            Pubsub.publish("autaliza-novo-comentatio", {fotoId: this.props.foto.id, novoComentario});            
        })
        .catch(error=>{
          console.log(error);
        });
    }

    render(){
        return (
            <section className="fotoAtualizacoes">             
              <a onClick={this.like.bind(this)} className={this.state.likeada ? "fotoAtualizacoes-like-ativo" : "fotoAtualizacoes-like"}>Likar</a>
              <form className="fotoAtualizacoes-form" onSubmit={this.comenta.bind(this)}>
                <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" ref={input=> this.comentario = input}/>
                <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit"/>
              </form>
            </section> 
        );
    }
}

class FotoInfo extends Component{

  constructor(props){  
    super(props);  
    this.state = {likers: props.foto.likers, comentarios: props.foto.comentarios};
  }

   componentWillMount(){
     Pubsub.subscribe("atualiza-like", (topico, infoLiker)=>{     
      if(this.props.foto.id === infoLiker.fotoId){
          
          const possivelLinker = this.state.likers.find(liker=> liker.login=== infoLiker.liker.login);
          
          if(possivelLinker === undefined){           
              const novoLikes = this.state.likers.concat(infoLiker.liker);
              this.setState({likers:novoLikes});
          }else{
             const removeLikes =  this.state.likers.filter(liker=> liker.login!== infoLiker.liker.login);
             this.setState({likers:removeLikes});
          }   
        }       
     });


     Pubsub.subscribe("autaliza-novo-comentatio", (topico, infoComentario)=>{       
       if(this.props.foto.id === infoComentario.fotoId){
          const novosComentarios = this.state.comentarios.concat(infoComentario.novoComentario);
          this.setState({comentarios:novosComentarios});
        }
     });
   }

    render(){
        return (
            <div className="foto-info">
            <div className="foto-info-likes">
             {
               this.state.likers.map(liker=>{
                 return  <Link to={`/timeline?${liker.login}`} key={liker.login}>{liker.login},</Link>
               })
             }            
                <span> curtiram</span>

            </div>

            <p className="foto-info-legenda">
              <a className="foto-info-autor">autor </a>
               {this.props.foto.comentario}
            </p>

            <ul className="foto-info-comentarios">
              {
                  this.state.comentarios.map(comenatario=>{
                    return(
                      <li key={comenatario.id} className="comentario">
                        <Link to={`/timeline/${comenatario.login}`} className="foto-info-autor">{comenatario.login} </Link>
                        {comenatario.texto}
                      </li>
                    );
                  }                  
                )
              }           
            </ul>
          </div>     
        );
    }
}

class FotoHeader extends Component{
    render(){
        return (
            <header className="foto-header">
              <figure className="foto-usuario">
                <img src={this.props.foto.urlPerfil} alt="foto do usuario"/>
                <figcaption className="foto-usuario">
                  <Link to={`/timeline/${this.props.foto.loginUsuario}`}>
                    {this.props.foto.loginUsuario}
                  </Link>  
                </figcaption>
              </figure>
              <time className="foto-data">{this.props.foto.horario}</time>
            </header>   
        );
    }
}   

export default class FotoItem extends Component{
    render(){
        return(
            <div className="foto">
                <FotoHeader foto={this.props.foto}/>
                <img alt="foto" className="foto-src" src={this.props.foto.urlFoto}/>
                <FotoInfo foto={this.props.foto}/>
                <FotoAtualizacoes foto={this.props.foto}/>
          </div>   
        );
    }
}