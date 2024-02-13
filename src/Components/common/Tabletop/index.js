import React, { Fragment } from 'react';
import {createStyles,withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { Typography } from '@material-ui/core';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ScheduleIcon from '@material-ui/icons/Schedule';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import moment from "moment";

class TableTop extends React.Component {
  constructor(props){
    super(props);
    this.state  =   {
      'date':null,
      'time':null,
      'airport_code':null,
      sync_interval:-1
    }
    
}
componentWillMount(){
    // var date    = moment().format("YYYY-MM-DD")
    var date    = moment().format("DD-MM-YYYY")
    var auth    = JSON.parse(window.localStorage.getItem("auth_user"))
    var interval  =   setInterval(()=>{
      var d =  moment().format("HH:mm")
      var time   =    moment(d)
      this.setState({"time":time._i})
    },1000);
    var d =  moment().format("HH:mm")
    var time   =    moment(d)
    this.setState({"time":time._i})

    this.setState({"date":date,"airport_code":auth.airport_code,sync_interval:interval})
}
componentWillUnmount(){
  if(this.state.sync_interval != -1){
    clearInterval(this.state.sync_interval);
    this.setState({sync_interval:-1});
  }
}

  render(){ 
    var {classes }  =   this.props;
    return ( 
          <div className={classes.divContainer}>
              <div className={classes.date}>  
                <Typography className={classes.typo}><DateRangeIcon color="primary" className={classes.icon}/> {this.state.date}</Typography>
                <Typography className={classes.typo}> <ScheduleIcon color="primary" className={classes.icon}/> {this.state.time}</Typography>
                <Typography className={classes.typo}><LocationOnIcon color="primary" className={classes.icon}/>
                  {this.state.airport_code}
                </Typography>
              </div>
          </div>
    );
  }
} 
const styles = (theme) => {
  return createStyles({
    divContainer:{
      padding:theme.spacing(2),
       borderCollapse: "collapse",
      width:"100%"
    },
    date:{
      display:"flex"
    },
    typo:{
      flex:'1',
      textAlign:'center',
      color:theme.palette.common,
      whiteSpace:'nowrap'
    },
    icon:{
      verticalAlign:'bottom',
      // color:"primary",
    }
  });
};
export default compose(withRouter,withStyles(styles))(TableTop);
