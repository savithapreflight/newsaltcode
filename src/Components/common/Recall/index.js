import React from 'react';
import {createStyles,withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { Dialog,DialogTitle,List,ListItem,ListItemText,DialogContent,DialogActions,IconButton,TextField, Typography,FormControl, Divider, ListItemIcon} from '@material-ui/core';
import {connect} from "react-redux";
import CloseIcon from '@material-ui/icons/Close';
import {fetchOfflineTrimSheets} from "../../../Action/rampaction"
class RecallModel extends React.Component {

    constructor(props){
        super(props);
        this.state  =   {
            "trimSheet":[]
           
        }
        this.fetch          =    this.fetch.bind(this);
    }
    componentWillMount(){
        this.fetch();
    }
    fetch(){
        fetchOfflineTrimSheets().then((res)=>{
            console.log("recall resu",res)
            this.setState({"trimSheet":res})
        })
    }
    render(){ 
        var {classes} = this.props;

        return (<div className={classes.root}>
            <Dialog maxWidth={"lg"} open={this.props.open} onClose={this.props.handleClose} classes={{paperWidthLg:classes.dialog}}>
                <DialogTitle>
                    <Typography variant={"h6"} style={{display:"inline"}}>Offline Trimsheets</Typography>
                    <IconButton edge="end" style={{left:"20%"}} color="inherit" onClick={()=>{this.props.onClose()}} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider/>
                <DialogContent>
                    {this.state.trimSheet.length === 0 && <Typography variant="body1" style={{textAlign:"center"}}>No Data</Typography>}
                    {this.state.trimSheet.length !== 0 &&this.state.trimSheet.map((item,i)=>{
                        return <List key={i} onClick={()=>{this.props.onClick(item)}} component="nav" aria-label="main mailbox folders">
                        <ListItem button >
                            <ListItemIcon>{(i+1)}</ListItemIcon>
                            <ListItemText primary={item.flight_no+"    "+item.flight_date}
                                secondary={"Edition No :"+item.edition_no}/>
                        </ListItem>
                    </List>
                    })}
                </DialogContent>
                
            </Dialog>
        </div>);
    }
  
} 

const styles = (theme) => {
    return createStyles({
        root: {
            display: 'flex',
        },
        dialog: {
            width:"100%",
            height:"50%"
        },
    });
  };
  
export default connect((store)=>{
  return {
  }
},{
})(compose(withRouter,withStyles(styles))(RecallModel))
  

