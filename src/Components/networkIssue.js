import React from 'react';
import {createStyles,withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import LoginBg from "../images/login_bg.jpg";
import {Card,CardContent, Typography,Button, CircularProgress} from "@material-ui/core";
import { getDeviceStatus } from '../Action/deviceAction';
import {getDeviceId} from "./../utils/device"
import * as Enviornment from '../../src/Action/environment'
class NetworkIssue extends React.Component {

  constructor(props){
    console.log('app1',Enviornment.get("DB_NAME"))
    super(props);
    this.state = {
        in_prog: false
    }
    this.login  =   this.login.bind(this);
  }
  //Login 

  login(){
    console.log('app1',Enviornment.get("DB_NAME"))
    this.setState({in_prog: true});
    getDeviceStatus(getDeviceId()).then(result =>{
      this.setState({in_prog:false},()=>{
        this.props.history.push('/login');
      })
    }).catch(error =>{
      console.log('app2',Enviornment.get("DB_NAME"))
      console.log(error);
      this.setState({in_prog:false})
    })
    
  }


  //Rendering
  render(){ 
    
    var {classes }  =   this.props;
    return ( 
      <div className={classes.login_bg}>
        <div className={classes.overlay}></div>
        <div className={classes.login_container}>
          <Card className={classes.login_form}>
            <CardContent>
                <div className={classes.logo}>
                    <Typography variant={"h5"} color={"primary"}>RAMPCONTROL</Typography>
                    <Typography variant={"h6"} color={"secondary"}>DEVICE</Typography>
                </div>
                <hr />
                
                <Typography variant={"h6"} className={classes.login_form_title}>Please check your network connection or SALT server is down.</Typography>
    <Typography variant={"h6"} className={classes.login_form_title}>Please try after sometime or contact IT admin.</Typography>
                <div className={classes.login_form_Btn}>
                    {!this.state.in_prog && <Button variant="contained" color="primary" fullWidth className={classes.loginBtn} onClick={()=>{
                        this.login();
                    }}>
                        Refresh
                    </Button>}
                    {this.state.in_prog && <CircularProgress className={classes.progress} color="secondary" />}
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
      color: "#fff",
      marginBottom:theme.spacing(1)
    },
    "login_input":{
      marginTop:theme.spacing(1.5)
    },
    "login_form_Btn":{
        textAlign:"center"
    },
    "loginBtn":{
      marginTop:theme.spacing(1.5)
    }

  })
};

export default compose(
  withRouter,
  withStyles(styles)
)(NetworkIssue)
