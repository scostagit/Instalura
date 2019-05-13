import React, {Component} from "react";
import { copyFile } from "fs";

class FotoAtualizacoes extends Component{
    render(){
        return (
            <section className="fotoAtualizacoes">
              <a href="#" className="fotoAtualizacoes-like">Likar</a>
              <form className="fotoAtualizacoes-form">
                <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo"/>
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

              <a href="#">
                alots_ssa
              </a>

              ,

              <a href="#">
                rafael_rollo
              </a> 

               curtiram

            </div>

            <p className="foto-info-legenda">
              <a className="foto-info-autor">autor </a>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, illo?
            </p>

            <ul className="foto-info-comentarios">
              <li className="comentario">
                <a className="foto-info-autor">seguidor </a>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem ad, molestiae.
              </li>
              <li className="comentario">
                <a className="foto-info-autor">seguidor </a>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt cumque earum molestias voluptatem modi nihil sit magnam ratione eveniet distinctio magni error asperiores dignissimos tempora expedita, laborum ex soluta hic maiores veritatis deserunt.
              </li>
              <li className="comentario">
                <a className="foto-info-autor">seguidor </a>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum laudantium quae ab fuga odio delectus maiores voluptatibus sit commodi quidem.
              </li>
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
                <img src="https://instagram.fdub3-1.fna.fbcdn.net/vp/b4867bd8601fe6ccc99769c960fa12f2/5D74B938/t51.2885-19/s150x150/54512390_826563157708838_4787735310551220224_n.jpg?_nc_ht=instagram.fdub3-1.fna.fbcdn.net" alt="foto do usuario"/>
                <figcaption className="foto-usuario">
                  <a href="#">
                    tvolpi
                  </a>  
                </figcaption>
              </figure>
              <time className="foto-data">03/10/2016 20:13</time>
            </header>   
        );
    }
}   

export default class FotoItem extends Component{
    render(){
        return(
            <div className="foto">
                <FotoHeader/>
                <img alt="foto" className="foto-src" src="https://media-cdn.tripadvisor.com/media/photo-w/01/f4/fc/fc/temple-bar.jpg"/>
                <FotoInfo/>
                <FotoAtualizacoes/>
          </div>   
        );
    }
}