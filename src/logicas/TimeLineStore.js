import Pubsub from "pubsub-js";

export default class TimeLineStore{
    constructor(fotos){       
        this.fotos = fotos;
    }

    lista(urlPerfil){
        fetch(urlPerfil)        
        .then(resp=> resp.json())
        .then(fotos=> {
            this.fotos = fotos;
            Pubsub.publish('timeline', this.fotos);              
        });
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
                const fotoAchada = this.fotos.find(foto=> foto.id === fotoId); 
                fotoAchada.comentarios.push(novoComentario);  
                Pubsub.publish('timeline', this.fotos);                   
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
            const fotoAchada = this.fotos.find(foto=> foto.id === fotoId);          
            //change the status of likeada propeerty
            fotoAchada.likeada  = !fotoAchada.likeada;            
            const possivelLinker = fotoAchada.likers.find(likerAtual => likerAtual.login === liker.login);            
            
            if(possivelLinker === undefined){           
                fotoAchada.likers.push(liker);              
                
            }else{
                const novoLikers =  fotoAchada.likers.filter(likerAtual => likerAtual.login !== liker.login);             
                fotoAchada.likers = novoLikers;
            }  
            Pubsub.publish('timeline', this.fotos);          
        })
        .catch(error=> console.log(error));
    }  

    subscribe(callback) {
        Pubsub.subscribe("timeline", (topico, fotos)=>{ 
            callback(fotos);            
        });
    }

}