import React, { Component } from "react";
import {
  Route,
  HashRouter
} from "react-router-dom";
import Home from "./Home";
import Stuff from "./Stuff";
import Search from "./Search";
import Admin from "./Admin";
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class Main extends Component {
  
  render() {
    return (
      <HashRouter>
         
        <div>

          <h1>Material-UI</h1>
          <div className="flex">
            <Paper style={{ background: '#335075' }}>
              <Button><a href='#/' style={{ color:'#FFFFFF', textDecoration:'none' }}>Account</a></Button>
              <Button><a href='#/search' style={{ color:'#FFFFFF', textDecoration:'none' }}>Search</a></Button>
              <Button><a href='#/stuff' style={{ color:'#FFFFFF', textDecoration:'none' }}>Logout</a></Button>
              <Button><a href='#/admin' style={{ color:'#FFFFFF', textDecoration:'none' }}>Admin</a></Button>
            </Paper>
          </div>

          <div className="content">
            <Route exact path="/" component={Home}/>
            <Route path="/stuff" component={Stuff}/>
            <Route path="/search" component={Search}/>
            <Route path="/admin" component={Admin}/>
          </div>

        </div>

      </HashRouter>
    );
  }
}
 
export default Main;