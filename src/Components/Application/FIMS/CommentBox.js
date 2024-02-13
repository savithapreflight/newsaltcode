import React from 'react';
import {createStyles,withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { Dialog,DialogTitle,DialogContent,DialogActions,Button,TextField} from '@material-ui/core';
import {connect} from "react-redux";

class CommentBox extends React.Component {

    constructor(props){
        super(props);
        this.state  =   {
            value:''
        }
    }

    componentWillReceiveProps(props){
        if(this.props.options.open != props.options.open && props.options.open){
            this.setState({'value':this.props.options.value});
        }
    }
  render(){ 
    var {classes} = this.props;

    
    return ( 
        <Dialog open={this.props.options.open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Comment [{this.props.options.label}]</DialogTitle>
        <DialogContent>
          
            <TextField
                id="outlined-multiline-static"
                label="Message"
                multiline
                rows="4"
                value={this.state.value}
                variant="outlined"
                fullWidth
                onChange={(event)=>{
                    this.setState({'value':event.target.value})
                }}
                />
        </DialogContent>
        <DialogActions>
          {/* <Button color="primary" onClick={this.props.onClose}>
            Cancel
          </Button> */}
          <Button  color="primary" onClick={()=>{
              this.props.onSubmit(this.state.value)
          }}>
            Submit
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
})(compose(withRouter,withStyles(styles))(CommentBox))
  

