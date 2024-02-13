import React from 'react';
import {createStyles,withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { Dialog,DialogTitle,DialogContent,DialogActions,Button,Grid,IconButton,TextField, Typography,FormControl} from '@material-ui/core';
import {connect} from "react-redux";
import './style.scss';
import {AddCircleOutlineSharp as AddIcon,RemoveCircleOutlineSharp as RemoveIcon} from '@material-ui/icons';

const QRCode = require('qrcode.react');

class QRPopupModel extends React.Component {

    constructor(props){
        super(props);
        this.state  =   {
            'trimsheetStr':''
        }
    }
    componentWillReceiveProps(prop){
        console.log("prop",prop)
        this.setState({
            'trimsheetStr': prop.trimStr
        })    
    }
    
    render(){ 
        var {classes} = this.props;

        // const inputClass = `${window.localStorage.getItem("app_theme") === "dark" ? "form-control-dark" : "form-control-light"}`;

        return ( 
            <Dialog open={this.props.open} aria-labelledby="form-dialog-title">
                <DialogTitle>Trimsheet QR Display</DialogTitle>
                <DialogContent>
                    <Grid container className={classes.gridContainer}> 
                    <div style={{display: 'flex', flexDirection: 'column',  justifyContent:'center', alignItems: 'center'}}>
                        <QRCode value={this.state.trimsheetStr} 
                        size = {250}
                        includeMargin = {true}/>
                        </div>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button  color="primary" onClick={()=>{
                        this.setState({'pax_error':''},function(){
                            this.props.onClose()

                        })
                    }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
  
} 

const styles = (theme) => {
    return createStyles({
        formControl:{
            width:'100%'
        },
        error:{
            color:'red',
            textAlign:'right'
        },
        'label': {
            textTransform: "uppercase"
        },
        gridContainer:{
            minHeight:'80px'
        },
        'gridContent': {
            top:0,
            bottom:0,
            margin:'auto',
            textAlign:'center'
        },
        iconbutton:{
            padding:"0px"
        },
        'FlightFront': {
            top: 0,
            bottom: 0,
            margin: 'auto',
            textAlign: 'center'
        },
        
    });
  };
  
export default connect((store)=>{
  return {
      page:store.page
  }
},{
})(compose(withRouter,withStyles(styles))(QRPopupModel))
  

