import React from 'react';
import {createStyles,withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import {connect} from "react-redux";
import {Typography, Divider, Button,IconButton,Grid} from "@material-ui/core";
import {Edit as EditIcon} from "@material-ui/icons";
import {setPage,setAction,setTheme} from "../../../Action/pageaction";
import User from '../../../images/user.png';
import Switch from '../../common/Switch/index';
import Slider from '../../common/Slider/index';
import * as Cordova from '../../../utils/cordova';
import {logoutUser} from "../../../Action/authentication"
import {bleModalOpen} from "../../../Action/bluetoothaction"
import * as clsx from "clsx";

class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      'checked': false,
      'value': 0,
      'counter':0
    }
    this.handleCheck    = this.handleCheck.bind(this);
    this.handleChange    = this.handleChange.bind(this);
    this.logout         =   this.logout.bind(this);
  }

  componentWillMount(){
    var me      =   this;
    Cordova.getBrightness(function(value){
      me.setState({value:value});
    },null);
  }
  componentDidMount(){
    this.props.setPage("Profile","profile");
    this.props.setPageAction(null);
    this.setState({"checked":window.localStorage.getItem("app_theme")==="dark"?true:false})
    
  }

  componentWillReceiveProps(newProps){
    if(this.props.bluetooth.open != newProps.bluetooth.open){
      this.setState({counter:this.state.counter++});
    }
  }
  
  handleCheck(){
    this.setState({checked: !this.state.checked},()=>{
      if(this.state.checked){
        this.props.setTheme("dark")
        window.localStorage.setItem("app_theme","dark");
      } else {
        this.props.setTheme("light")
        window.localStorage.setItem("app_theme","light");
      }
    });
  }
  logout(){
    this.props.logoutUser()
    this.props.history.push("/");
  }
  handleChange(e,value){
    e.preventDefault();
    this.setState({value:value},()=>{
      Cordova.setBright(this.state.value/100);
    })
    console.log(value)
  }

  render(){ 
    var {classes }  =   this.props;
    console.log('this.props.network..')
    console.log(this.props.network)
    var printer_name  =   window.localStorage.getItem('printer_name')==null?"BTSPP":window.localStorage.getItem('printer_name')
    var auth          =   JSON.parse(window.localStorage.getItem("auth_user"))
      
    return ( 
      <div className={classes.profile}>
          <div className={classes.user}>
            <img src={User} alt="user" className={classes.userImg} />
            <Typography className={classes.userName}>{auth.user_name} ({auth.airport_code})</Typography>
          </div>
          <Divider />
          <div className={classes.nightMode}>
            <div style={{float: "left"}}>
              <Typography className={classes.nightText}>Night Mode</Typography>
            </div>
            
            <div style={{float: "right"}}>
              <Switch 
                className={classes.nightSwitch}
                checked={this.state.checked}
                onChange={this.handleCheck}
              />

            </div>
          </div>
          <Divider />
          <div className={classes.slider}>
            <Typography className={classes.userName}><i className="far fa-sun" style={{fontSize:"18px",marginRight: "17px",marginTop: "6px"}}></i></Typography>
            <Slider 
              defaultValue={this.state.value}
              value={this.state.value}
              onChange={(e,newValue)=>{this.handleChange(e,newValue)}}
            />
            <Typography className={classes.userName}><i className="fas fa-sun"  style={{fontSize:"18px",marginLeft: "17px",marginTop: "6px"}}></i></Typography>
          </div>
          <Divider />
          <Grid container spacing={1}>
            <Grid item lg={5} sm={5} md={5} xs={5} style={{'textAlign':'left'}}>
                <Typography className={classes.typo}>Printer :</Typography>
            </Grid>
            <Grid item lg={5} sm={5} md={5} xs={5} style={{'textAlign':'left'}}>
                <Typography className={classes.typo}>{printer_name}</Typography>
            </Grid>
            <Grid item lg={2} sm={2} md={2} xs={2}>
              <IconButton aria-label="EDIT" onClick={()=>{
                  this.props.bleModalOpen();
              }}>
                <EditIcon className={classes.icon}/>
              </IconButton>
            </Grid>
          </Grid>

          <Divider />
          {
            this.props.network.status &&<div  className={classes.logoutContainer}>
            <Button color={"primary"} variant="contained" className={classes.logout} onClick={this.logout}> LOGOUT</Button>
          </div>
          }

      </div>
    );
  }
  
} 
const styles = (theme) => {
  return createStyles({
    "profile": {
      paddingTop: theme.spacing(3),
      textAlign: "center"
    },
    "divider": {
      backgroundColor: theme.palette.divider,
    },
    "user": {
      paddingBottom: theme.spacing(2.5)
    },
    "userImg": {
      width: "35%",
      borderRadius: "50%"
    },
    "userName": {
      color: theme.palette.common,
    },
    "nightMode": {
      padding: theme.spacing(2.5),
      display: "flow-root"
    },
    "nightText": {
      fontSize: theme.spacing(4.5),
      marginTop: theme.spacing(1),
      color: theme.palette.common,
    },
    "slider": {
      padding: theme.spacing(2.5),
      display: "flex"
    },
    "logout":{
      textAlign:"center",
      padding: theme.spacing(2.5),
      width:'100%'
    },
    "logoutContainer":{
      width:"80%",
      margin:"0 auto",
      padding:theme.spacing(2),
      marginBottom:"10%"
    },
    "typo":{
      color: theme.palette.common,
      fontSize:'18px','padding':'8px'
    },
    icon:{
      color: theme.palette.common,
    }
  });
};
export default connect((store)=>{
  return {
    bluetooth:store.bluetooth,
    network:store.network,
  }
},{
  setPage:setPage,
  setPageAction:setAction,
  setTheme: setTheme,
  logoutUser:logoutUser,
  bleModalOpen:bleModalOpen
})(compose(withRouter,withStyles(styles))(Profile));
