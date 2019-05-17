import React, {Component} from "react";
import {Link} from "react-router";

class FotoAtualizacoes extends Component{
  
    onLikeClick(event){   
       event.preventDefault();
       this.props.onLikeClick(this.props.foto.id);     
    }
  
    onComentaSubmit(event){   
      event.preventDefault();
      var texto = this.comentario.value;
      this.comentario.value = "";
      this.props.onComentaSubmit(this.props.foto.id, texto);
    }

    render(){
        return (
            <section className="fotoAtualizacoes">             
              <a onClick={this.onLikeClick.bind(this)} className={this.props.foto.likeada ? "fotoAtualizacoes-like-ativo" : "fotoAtualizacoes-like"}>Likar</a>
              <form className="fotoAtualizacoes-form" onSubmit={this.onComentaSubmit.bind(this)}>
                <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" ref={input=> this.comentario = input}/>
                <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit"/>
              </form>
            </section> 
        );
    }
}

class FotoInfo extends Component{ 
    render(){
        return (
            <div className="foto-info">
            <div className="foto-info-likes">
             {
               this.props.foto.likers.map(liker=>{
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
                  this.props.foto.comentarios.map(comenatario=>{
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
                <FotoAtualizacoes {...this.props}/>
          </div>   
        );
    }
}