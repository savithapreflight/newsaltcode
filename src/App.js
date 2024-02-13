import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {createTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import {lightTheme,darkTheme} from "./theme";
import {connect} from "react-redux";
import StartupPage from './Components/startupPage';
import Login from "./Components/Login";
import Device from "./Components/device";
import NetworkIssue from "./Components/networkIssue";
import Application from "./Components/Application";
import {setTheme} from "./Action/pageaction";
import {isNetworkUp,networkOn,networkOff} from "./Action/networkaction";
// import {initializeDatabaseStructure} from "./Action/SQL";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRScanner from './Components/Application/FimsTrimsheet/QrScanner';
import { openDatabase } from './Action/SQL';
import * as Enviornment  from './Action/environment'
class App extends React.Component {
  
  componentWillMount(){
    
    // openDatabase()
    // initializeDatabaseStructure()


    var me = this;
    var app_theme   =  window.localStorage.getItem("app_theme");
    if(app_theme === null){
      window.localStorage.setItem("app_theme","dark");
      this.props.setTheme("dark")

    } else {
      this.props.setTheme(app_theme)

    }

    if(navigator != undefined && navigator.connection != undefined){
      if(isNetworkUp()){
        me.props.networkOn();
      } else {
        me.props.networkOff();
      }
    }
  }

  componentDidMount(){
// openDatabase()
    var me    =   this;
    if(navigator != undefined && navigator.connection != undefined){
      navigator.connection.onchange   =   function(conection_stauts){
        if(isNetworkUp()){
          me.props.networkOn();
        } else {
          me.props.networkOff();
        }
      }

      if(isNetworkUp()){
        me.props.networkOn();
      } else {
        me.props.networkOff();
      }
      
      document.addEventListener("offline", function(){
        me.props.networkOff();
      }, false);

      document.addEventListener("online", function(){
        me.props.networkOn();        
      }, false);

    
    }
  }

  render(){ 
    var app_theme_mode = null;
    if(this.props.page.theme === "light"){
      app_theme_mode   =   createTheme(lightTheme);
    } else {
      app_theme_mode   =   createTheme(darkTheme);
    }

    return ( 
      <ThemeProvider theme={app_theme_mode}>
        <ToastContainer />
        <Switch>
        <Route exact path = '/login' component={Login} />
          <Route exact path = '/' component={StartupPage} />
          <Route exact path = '/device_check' component={Device} />
          <Route exact path = '/network_issue' component={NetworkIssue} />
          <Route exact path = '/login' component={Login} />
          <Route path = '/app' component={Application} />
          <Route path = '/scanner' component={QRScanner} />
        </Switch>
      </ThemeProvider>
    );
  }
  
} 
export default connect((store)=>{
  return {
    page: store.page
  }
},{
  setTheme: setTheme,
  networkOn:networkOn,
  networkOff:networkOff
})(App);