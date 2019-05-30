export function timeLineReducer(state=[],action){
    if(action.type ==="LISTAGEM"){  
      return action.fotos;
    }

    if(action.type === "COMENTARIO"){     
        const fotoId = action.fotoId;
        const novoComentario = action.novoComentario;
        const fotoAchada = state.find(foto=> foto.id === fotoId); 

        fotoAchada.comentarios.push(novoComentario); 

        return state;
    }

    if(action.type=== "LIKE"){     
        const fotoId = action.fotoId;
        const liker = action.liker;
        const fotoAchada = state.find(foto=> foto.id === fotoId);          
        //change the status of likeada propeerty
        fotoAchada.likeada  = !fotoAchada.likeada;            
        const possivelLinker = fotoAchada.likers.find(likerAtual => likerAtual.login === liker.login);            
        
        if(possivelLinker === undefined){           
            fotoAchada.likers.push(liker);              
            
        }else{
            const novoLikers =  fotoAchada.likers.filter(likerAtual => likerAtual.login !== liker.login);             
            fotoAchada.likers = novoLikers;
        }  

        return state;
    }

    return state;
  }