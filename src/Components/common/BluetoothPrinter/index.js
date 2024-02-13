import React, { Fragment } from 'react';
import {createStyles,withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { Typography,Dialog,DialogTitle,DialogContent,DialogContentText,TextField,DialogActions,Button } from '@material-ui/core';
import {connect} from "react-redux";
import {bleModalClose} from "../../../Action/bluetoothaction";

class BluetoothPrinter extends React.Component {
  constructor(props){
    super(props);
    this.state  =   {
        printer_name:""

    }
}
componentWillMount(){
    this.setState({printer_name:window.localStorage.getItem('printer_name')==null?"":window.localStorage.getItem('printer_name')});
}

componentWillUnmount(){
}

render(){ 
    var {classes }  =   this.props;
    return ( 
        <Dialog onClose={()=>{
            this.props.bleModalClose();
        }} aria-labelledby="Bluetooth-dialog-title" open={this.props.bluetooth.open}>
            <DialogTitle id="simple-dialog-title" classes={{root:classes.title}}>Bluetooth Printer</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Printer Name"
                    type="text"
                    fullWidth
                    value={this.state.printer_name}
                    onChange={(event)=>{
                        this.setState({printer_name:event.target.value})
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>{
                    this.props.bleModalClose();
                }} color="primary">
                    Cancel
                </Button>
                <Button onClick={()=>{
                    window.localStorage.setItem('printer_name',this.state.printer_name);
                    this.props.bleModalClose();
                }} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>

    );
  }
} 
const styles = (theme) => {
  return createStyles({
    title:{
        color:theme.palette.common
    }
  });
};

export default connect((store)=>{
    return {
      bluetooth:store.bluetooth
    }
  },{
    bleModalClose:bleModalClose
  })(compose(withRouter,withStyles(styles))(BluetoothPrinter));

