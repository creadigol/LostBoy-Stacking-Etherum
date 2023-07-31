import React,{Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Admin from './Admin';

class App extends Component { 

  render(){
    return (
      <BrowserRouter basename={'ConstructPanel'}>
        <Switch>
            <Route exact path='/' component={Admin} />
        </Switch>
      </BrowserRouter>
    );
  }

}

export default App;