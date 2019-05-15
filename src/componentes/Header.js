import React, {Component} from "react";
import { browserHistory} from "react-router"

export default class Header extends Component{

    logout(){      
        browserHistory.push("/logout");
    }
    
    render(){
        return (
            <header className="header container">
                <h1 className="header-logo">
                    Instalura
                </h1>

                <form className="header-busca">
                    <input type="text" name="search" placeholder="Pesquisa" className="header-busca-campo"/>
                    <input type="submit" value="Buscar" className="header-busca-submit"/>
                </form>


                <nav>
                    <ul className="header-nav">
                    <li className="header-nav-item">
                        <a href="#">
                        ♡                        
                        </a>
                    </li>                  
                    </ul>
                </nav>
                <nav>
                    <ul className="header-nav">
                    <li className="header-nav-item" onClick={this.logout}>
                        <a href="#">
                        ➜                        
                        </a>
                    </li>                  
                    </ul>
                </nav>
            </header>  
        );
    }
}