import React from 'react';
import {createStyles,withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { Dialog,DialogTitle,DialogContent,DialogActions,Button,TextField, Typography} from '@material-ui/core';
import {connect} from "react-redux";

class Error extends React.Component {

    constructor(props){
        super(props);
        this.state  =   {
        }
    }
  render(){ 
    var {classes} = this.props;

    
    return ( 
        <Dialog open={this.props.open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Error</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>{this.props.message}</Typography>
        </DialogContent>
        <DialogActions>
          {/* <Button color="primary" onClick={this.props.onClose}>
            Cancel
          </Button> */}
          <Button  color="primary" onClick={()=>{
            this.props.onClose()
          }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
} 

const styles = (theme) => {
    return createStyles({
        
    });
  };
  
export default connect((store)=>{
  return {
      page:store.page
  }
},{
})(compose(withRouter,withStyles(styles))(Error))
  

