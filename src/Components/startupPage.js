import React from 'react';
import {createStyles,withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import LoginBg from "../images/login_bg.jpg";
import {CircularProgress, Typography} from "@material-ui/core";
import { getDeviceStatus } from '../Action/deviceAction';
import {getDeviceId} from "../utils/device";
import {connect} from 'react-redux';
import {networkOff,networkOn} from "../Action/networkaction"

class StartupPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      'in_prog':false
    }
  }
  componentWillMount(){
   
      this.setState({in_prog:true})
      // var device ="42dd5e24327d336c"
      console.log('Network Status...');
      console.log(this.props.network.status)
      if(!this.props.network.status){
        this.props.history.push('/login');
      } else{
        getDeviceStatus(getDeviceId()).then(result =>{
          this.setState({in_prog:false},()=>{
            this.props.history.push('/login');
          })
        }).catch(error =>{
          console.log(error);
          if(error.error === 'Failed to find device'){
          this.setState({in_prog:false},()=>{
            this.props.history.push('/device_check');
          })
        }else{
          this.setState({in_prog:false},()=>{
            this.props.history.push('/network_issue');
          })
        }
        })  
      }
  }
  //Rendering
  render(){ 
    var {classes }  =   this.props;
    return ( 
      <div className={classes.login_bg}>
        <div className={classes.overlay}></div>
        <div className={classes.loader}>
          {this.state.in_prog && 
            <CircularProgress color="secondary"/>
          }
          <Typography variant="h6" style={{color:"#ffff"}}>Loading...</Typography>
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
    "loader":{
        position: "absolute",
        top: "50%",
        textAlign: "center",
        left: 0,
        right: 0
    },
    "loadingText": {
        color: theme.palette.common.white,
        padding: theme.spacing(2.5)
    },

  })
};

export default connect((store)=>{
  return {
    network:store.network,
  }
},{
  networkOff :networkOff,
  networkOn:networkOn,
})(compose(withRouter,withStyles(styles))(StartupPage));

// export default compose(
//   withRouter,
//   withStyles(styles)
// )(StartupPage)
