import React from 'react';
import {createStyles,withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { Grid, Typography } from '@material-ui/core';
import {connect} from "react-redux";

class DatePicker extends React.Component {

  render(){ 
    var {classes} = this.props;

    var value   = "- : -";
    if(this.props.value != null){
        value   =   this.props.value;
    }
    return ( 
        <div className={classes.action_item} onClick={this.props.inClick}>
            <div className={classes.icon}>
                <img className={classes.iconImage} src={this.props.image} />
            </div>
            <div className={classes.time_update}>
                <label className={classes.label}>{this.props.label}</label>
                <div class={classes.time} > { value }</div>
            </div>
        </div>
    );
  }
  
} 

const styles = (theme) => {
    return createStyles({
        action_item:{
            border:"solid 1px "+theme.palette.primary.main,
            display: "flex"
        },
        action_item2:{
            border:"solid 1px "+theme.palette.primary.main,
            paddingTop: "15px",
            color: theme.palette.common,
            height: "55px",
            textAlign: "center",
        },
        icon:{
            flex:3,
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            textAlign: "center",
            borderRight:"solid 1px "+theme.palette.primary.main
        },
        iconImage:{
            height: "30px",
            maxWidth:'40px'
        },
        time_update:{
            flex:7,
            color: theme.palette.common,
            fontSize: "17px",
            padding: "5px"
        },
        label:{
            display: "block",
            textAlign: "center",
            fontSize:"12px"
        },
        time:{
            textAlign: "center"
        }
    });
  };
  
export default connect((store)=>{
  return {
      page:store.page
  }
},{
})(compose(withRouter,withStyles(styles))(DatePicker))
  
