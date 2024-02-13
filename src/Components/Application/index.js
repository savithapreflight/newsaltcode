import React from 'react';
import {createStyles,withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { Switch, Route, Redirect } from "react-router-dom";
import Appbar from './Appbar';
import BottomNav from './BottomNav';
import {Container } from '@material-ui/core';
import Upcoming from "./Upcoming/index";
import Past from "./Past/index";
import Trimsheet from "./Trimsheet/index";
import FimsTrimsheetLMC from "./TrimsheetLMC/index";
import Profile from "./Profile/index";
import FIMS from "./FIMS/index";
import FimsTrimsheet from "./FimsTrimsheet/index";
import OfflineTrimsheet from "./OfflineTrimsheet/index"

import {connect} from 'react-redux';
import {networkOff,networkOn} from "../../Action/networkaction"
import moment from "moment"
import {fetch as fetchRamp, fetchUpdatedTransactions} from "../../Action/rampaction"
import {joinRoom} from "../../Action/socket"

import {syncNewThread} from "../../Action/syncNew";
import {syncThread} from "../../Action/sync";
import BlueToothPrinter from "../common/BluetoothPrinter/index";
import {deltaSyncing} from "../../Action/deltasyncaction"
class Application extends React.Component {
  constructor(props){ 
    super(props);
    this.state={
      sync_interval:-1
    }
    // this.fetch    = this.fetch.bind(this);
  }


  componentWillMount(){
    var me   = this;
    var user = JSON.parse(
      window.localStorage.getItem("auth_user",null));
    var last_sync = window.localStorage.getItem("last_sync",null);
    // this.props.socket.socket.emit('JOIN_ROOM',{'airport_code':user.airport_code,'user_id':user.id});
    // this.props.socket.socket.on('ROOM_SYNC_NEEDED',function(data){
    //   console.log('Calling....',data);

    var postData  =  {
      'airport_code':user.airport_code,
      'last_sync':last_sync
    }
    
    if(last_sync !== null && user!== null && window.location.pathname==='/'){
      console.log('syhhing 51')
      fetchUpdatedTransactions(postData).then(result => {
        console.log(' transaction data',result.data.data);
        deltaSyncing(result.data.data).then((re)=>{
        })

      }).catch(err =>{
        console.log(err);
      })
    }
    // })
    console.log(me.props.network.status , '...App_Page')
    console.log(window.location.pathname)
    if(me.props.network.status && window.location.pathname==='/'){
      console.log('synching here')
       me.props.syncThread();
    }
   
}
  

  render(){ 
    var {classes}   =    this.props;
    return ( 
      <div className={classes.root}>
        <Appbar />
        <Container className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>

            <Route exact path={`${this.props.match.path}/upcoming`} component={Upcoming}/>
            <Route exact path={`${this.props.match.path}/fims/:fims1/:fims2/:status`} component={FIMS}/>
            <Route exact path={`${this.props.match.path}/fims_trim/:flight_no/:flight_date/:source/:destination/:status`} component={FimsTrimsheet}/>
            <Route exact path={`${this.props.match.path}/offline_trim/:flight_no/:source/:destination/:regno`} component={OfflineTrimsheet}/>
            <Route exact path={`${this.props.match.path}/lmc/:flight_no/:flight_date/:Reg_no/:status/:source/:destination`} component={FimsTrimsheetLMC}/>
            <Route exact path={`${this.props.match.path}/past`} component={Past}/>
            <Route exact path={`${this.props.match.path}/trimsheet`} component={Trimsheet}/>
            <Route exact path={`${this.props.match.path}/profile`} component={Profile}/>

            <Redirect exact path={`${this.props.match.path}`} to={`${this.props.match.path}/upcoming`} />
          </Switch>
        </Container>
        <BottomNav />
        <BlueToothPrinter />
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
    root: {
      display: 'flex',
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: 0,
    },
    toolbar: theme.mixins.toolbar,
  });
};
export default connect((store)=>{
  return {
    network:store.network,
    socket:store.socket
  }
},{
  networkOff :networkOff,
  networkOn:networkOn,
  syncThread:syncThread,
  syncNewThread:syncNewThread,
})(compose(withRouter,withStyles(styles))(Application));


