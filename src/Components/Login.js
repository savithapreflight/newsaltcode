import React from 'react';
import {createStyles,withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import {connect} from 'react-redux';
import LoginBg from "../images/login_bg.jpg";
import {Card,CardContent, Typography,FormControl,InputLabel, OutlinedInput,InputAdornment,Button, CircularProgress} from "@material-ui/core";
import {Email,Visibility} from "@material-ui/icons";
import { authenticateUser,getAuthenticatedUser } from '../Action/authentication';
import {AES} from "crypto-js";
import * as Enviornment from '../Action/environment';
import {getDeviceId} from "./../utils/device"
import {connectTOServer} from "../Action/socket"
import CssTextField from './common/Textfield/index';
import CssInput from './common/Textfield/Input';
import moment from "moment";
import { openDatabase } from '../Action/SQL';

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      'login_id': '',
      'password': '',
      'login_id_error': '',
      'password_error': '',
    }
    this.login  =   this.login.bind(this);
  }
  componentWillMount(props){
    console.log('ewrerttyy')
    openDatabase()
    this.props.connectTOServer();
    if(window.localStorage.getItem("auth_user") !== null ){
      var auth = JSON.parse(window.localStorage.getItem("auth_user"))
      var session_id    = auth.session_id
      this.props.getAuthenticate({"session_id" :session_id});
    }
    if(this.props.authentication.login_status === true &&
      this.props.authentication.user !== null){
      // this.props.history.push("/app");
    }
  }   

  componentWillUpdate(next_props){
      if(this.props.authentication.login_status !== next_props.authentication.login_status && next_props.authentication.login_status){
          
      }

      if(this.props.authentication.in_prog !== next_props.authentication.in_prog && !next_props.authentication.in_prog){
          if(next_props.authentication.error !== null){
              console.log('error')
          }
      }
  }
  //Login 
  login(){
    console.log('qwertyui')
    this.setState({'error':"",'login_id_error':'','passworderror':''})
    var login_id=this.state.login_id;
    if(login_id === null || login_id ===  undefined || login_id.trim().length === 0){
        this.setState({login_id_error:"Please enter login id"})
        document.getElementById("login_id").focus()
        return;
    }
    var password=this.state.password;
    if(password === null || password === undefined || password.trim().length === 0){
        this.setState({password_error:"Please enter password"})
        document.getElementById("password").focus()
        return;
    }
    var postData = {
      'username': this.state.login_id,
      'password': this.state.password,
      'source': 'ramp',
      'device_id': getDeviceId(),
      // 'device_id': '745da0a679417f93',
      // 'device_id': '123456',
    }
    this.props.authenticate(postData);
this.props.history.push("/app/upcoming");

  }
  showPassword(){
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }


  //Rendering
  render(){ 
    var {classes }  =   this.props;
    console.log("props",this.props)
    return ( 
      <div className={classes.login_bg}>
        <div className={classes.overlay}></div>
        <div className={classes.login_container}>
          <Card className={classes.login_form}>
            <CardContent>
              <div className={classes.logo}>
                <Typography variant={"h5"} color={"primary"}>RAMPCONTROL</Typography>
                <Typography variant={"h6"} color={"secondary"}>DEVICE</Typography><span className={classes.version}>v{Enviornment.version()}</span>
              </div>
              <hr />
              
              <Typography variant={"h6"} className={classes.login_form_title}>Login</Typography>
              {this.props.authentication.error && 
                  <Typography style={{color:'red',float:'right'}} variant="caption">
                     {this.props.authentication.error}
                  </Typography>
              }
              <FormControl fullWidth variant="outlined" className={classes.login_input}>
                {/* <InputLabel htmlFor="login_id">Login ID</InputLabel> */}
                <CssTextField 
                  id="login_id" 
                  name="login_id"
                  type="text"
                  color="primary"
                  label="Login ID"
                  variant="outlined"
                  value={this.state.login_id}
                  onChange = {(event)=>{this.setState({'login_id':event.target.value,'login_id_error':''})}}
                  InputProps={{
                    endAdornment:<InputAdornment position="end"><Email /></InputAdornment>,
                    className: classes.input
                  }} 
                  labelWidth={60}
                ></CssTextField>
                {this.state.login_id_error.length !== 0 && 
                    <Typography className={classes.error} variant="caption">
                        {this.state.login_id_error}
                    </Typography>
                }
              </FormControl>

              <FormControl fullWidth variant="outlined" className={classes.login_input}>
                {/* <InputLabel htmlFor="password">Password</InputLabel> */}
                <CssTextField 
                  id="password" 
                  name="password"
                  type="password"
                  label="Password"
                  variant="outlined"
                  value={this.state.password}
                  onChange = {(event)=>{this.setState({'password':event.target.value,'password_error':''})}}
                  InputProps={{
                    endAdornment:<InputAdornment position="end"><Visibility onClick={this.showPassword}/></InputAdornment>,
                    className: classes.input
                  }} 
                labelWidth={70}>
                </CssTextField>
                {this.state.password_error.length !== 0 && 
                  <Typography className={classes.error} variant="caption">
                      {this.state.password_error}
                  </Typography>
                }
              </FormControl>
              <div className={classes.login_form_Btn}>
                {!this.props.authentication.in_prog && 
                  <Button variant="contained" color="primary" fullWidth className={classes.loginBtn} onClick={()=>{
                    this.login();
                  }}>
                    Login
                  </Button>
                }
                {this.props.authentication.in_prog && <CircularProgress color="primary" />}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
} 

const styles = (theme) => {
  return createStyles({
    "@global": {
      "html,body,#root": {
          margin: 0,
          height: '100%',
          background:theme.palette.background.default
      }
    },
    "login_bg":{
      backgroundImage:`url(${LoginBg})`,
      height: "100vh",
      backgroundSize:"cover",
      backgroundPosition:"center",
      backgroundRepeat:"no-repeat"
    },
    "overlay":{
      position:"absolute",
      top:0,
      bottom:0,
      right:0,
      left:0,
      background:"#20233587",
      zIndex:1
    },
    "login_container":{
      position:"absolute",
      top:0,
      bottom:0,
      right:0,
      left:0,
      zIndex:10
    },
    "login_form":{
      margin:"0 auto",
      maxWidth:'350px',
      marginTop:'20vh',
      backgroundColor:"#0000008a"
    },
    "logo":{
      textAlign:"center"
    },
    "login_form_title":{
      textAlign:"center",
      marginBottom:theme.spacing(1),
      color: "#fff"
    },
    "login_input":{
      marginTop:theme.spacing(1.5),
      marginBottom: theme.spacing(3)
    },
    "loginBtn":{
      marginTop:theme.spacing(1.5)
    },
    "login_form_Btn":{
      textAlign:"center"
    },
    error:{
      textAlign:"right",
      color:"red"
    },
    'input': {
      color: "#fff"
    },
    "version": {
      color: "#4cc1ec",
    }
  })
};

export default connect((store)=>{
  return {
      authentication:store.authentication
  }
},{
  authenticate:authenticateUser,
  getAuthenticate:getAuthenticatedUser,
  connectTOServer:connectTOServer
})(compose(withRouter,withStyles(styles))(Login));
