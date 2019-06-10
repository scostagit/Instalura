import {listagem , comentario, like, notifica} from "../actions/actionCreator";

export default class TimeLineApi{ 

   /*
   ===================================================================================================
    -- redux-thunk -----------------------------------------------------------------------------------
   ===================================================================================================
   O redux-thunk faz com que a gente possa passar como argumento uma função, em vez de um objeto literal 
   representando uma Action. A ideia é que essa função retorne uma Promise ou qualquer outro tipo de valor. 
   Para possibilitar essa funcionalidade, ele traz um middleware integrado com o Redux.
    */
    static lista(urlPerfil){        
        return dispatch => {
            fetch(urlPerfil)        
                .then(resp=> resp.json())
                .then(fotos=> {                   
                    dispatch(listagem(fotos));
                    return fotos;
                });
        }       
    }

    static comenta(fotoId, textoComentario){
        return dispatch =>{
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
                   dispatch(comentario(fotoId, novoComentario));   
                })
                .catch(error=>{
                    console.log(error);
                });
        }
    }

    static like(fotoId){     
        
        return dispatch=>{
            fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`,{method:"POST"})
            .then(response=>{
                if(response.ok){
                return response.json();
                }else{
                throw new Error("nao foi possivel realizar o like")
                }
            })
            .then(liker=> {                 
                dispatch(like(fotoId, liker));
            })
            .catch(error=> console.log(error));
        }   
    }  

    static pesquisa(login){    
        return dispatch =>{
            fetch(`https://instalura-api.herokuapp.com/api/public/fotos/${login}`)
            .then(response=> response.json())
            .then(fotos=> { 
                if(fotos.length === 0){
                    dispatch(notifica('usuario não encontrado!'));
                }else{
                    dispatch(notifica(''));
                }

                dispatch(listagem(fotos));          
                return fotos;
            });
        }       
    }
}