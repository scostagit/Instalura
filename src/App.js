import React, {Component}from 'react';
import Header from "./componentes/Header";
import Timeline from "./componentes/Timeline";
import { createStore, applyMiddleware, combineReducers} from "redux";
import { timeLineReducer } from "./reducers/timelineReducer";
import thunkMiddleware from 'redux-thunk';
import { notificacao } from "./reducers/headerReducer";

const reducers = combineReducers({timeLineReducer,notificacao});
const store = createStore(reducers, applyMiddleware(thunkMiddleware));
//console.log(store.getState());

class  App extends Component { 

  render(){
    return (
      <div id="root">        
        <div className="main">
          <Header store={store}/>
          <Timeline login={this.props.params.login} store={store}/>
        </div>
      </div>
    );
  }  
}

export default App;
