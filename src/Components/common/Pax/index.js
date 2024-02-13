import React from 'react';
import {createStyles,withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { Dialog,DialogTitle,DialogContent,DialogActions,Button,TextField, Typography,FormControl} from '@material-ui/core';
import {connect} from "react-redux";
import './style.scss';

class PaxModel extends React.Component {

    constructor(props){
        super(props);
        this.state  =   {
            'adult':"",
            'child':"",
            'infant':"",
            'acm':"",
            'pax_error':''
        }
        this.Submit     =    this.Submit.bind(this);
    }
    componentWillReceiveProps(nextProps,prevProps){
        console.log("nextProps",nextProps)
        console.log("prevProps",prevProps)
        if(nextProps.index !== null ){
            var pax = nextProps.pax;
            var index   =    nextProps.index;
            // console.log("pax[index]",pax[index])
            if(pax[index] !== null && pax[index] !== undefined){
                // console.log("component pax",pax)
                var itemsArray  = pax[index].split('/');
                console.log("itemArray",itemsArray)
                this.setState({adult:itemsArray[0],child:itemsArray[1],infant:itemsArray[2],acm:itemsArray[3]}) 
            }
        }
        console.log("this.satte",this.state)
        
    }
    Submit(){
        this.setState({'pax_error':''})
        console.log(this.state.adult)
        var adult       =   parseInt(this.state.adult);
        if (Number(adult) < 0 ) {
            this.setState({pax_error: "Adult should be positive value" })
            return;
        }
        var child       =   parseInt(this.state.child);
        if (Number(child) < 0 ) {
            this.setState({pax_error: "Chlid should be positive value" })
            return;
        }
        var infant      =   parseInt(this.state.infant);
        if (Number(infant) < 0 ) {
            this.setState({pax_error: "Infant should be positive value" })
            return;
        }
        var acm         =   parseInt(this.state.acm);
        if (Number(acm) < 0 ) {
            this.setState({pax_error: "Acm should be positive value" })
            return;
        }
        if(adult === null || adult === undefined  || this.state.adult.trim().length === 0){
            console.log("inside if")
            adult = 0;
        }

        if(child === null || child === undefined || this.state.child.trim().length === 0){
            console.log("inside if")
            child = 0;
        }

        if(infant === null || infant === undefined || this.state.infant.trim().length === 0 ){
            console.log("inside if")
            infant = 0;
        }

        if(acm === null || acm === undefined || this.state.acm.trim().length === 0 ){
            console.log("inside if")
            acm = 0;
        }
        var Subpax  = String(adult+"/"+child+"/"+infant+"/"+acm)
        console.log("paxxxxxx",Subpax);
        var cabinlim   = this.props.Fleetinfo.CabinLimits;
        console.log("cabinlim",cabinlim);
        var cabinLarray  = cabinlim.split("$");
        console.log(cabinLarray);
      
        for (let i = 0; i < cabinLarray.length; i++) {
            var total_p = parseInt(adult) + parseInt(child) + parseInt(infant) + parseInt(acm);
            console.log(total_p);
            if(i === this.props.index){
                if(parseInt(total_p) > parseInt(cabinLarray[i])) {
                    this.setState({pax_error:"Pax should be less than "+cabinLarray[i]})
                    return;
                }     
            } 
        }
      
        this.props.onSubmit(this.props.index,Subpax)
    }
    render(){ 
        var {classes} = this.props;

        const inputClass = `${window.localStorage.getItem("app_theme") === "dark" ? "form-control-dark" : "form-control-light"}`;
        
        return ( 
            <Dialog open={this.props.open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Pax{"-"+(this.props.index+1)}</DialogTitle>
                <DialogContent>
                    <FormControl className={classes.formControl}>
                        <Typography>Adult</Typography>
                        <input 
                            type="number"  
                            placeholder="Adult" 
                            className={inputClass}
                            maxLength='2'
                            value={this.state.adult}
                            onChange = {(event)=>{
                                if(event.target.value.length > 2){
                                    return ;
                                }
                                
                            this.setState({'adult':event.target.value,'pax_error':''})
                            }}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <Typography>Child</Typography>
                        <input 
                            type="number"  
                            placeholder="Child" 
                            className={inputClass}
                            maxLength='2'
                            value={this.state.child} 
                            onChange = {(event)=>{
                                if(event.target.value.length > 2){
                                    return ;
                                }
                                this.setState({'child':event.target.value,'pax_error':''})
                            }}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <Typography>Infant</Typography>
                        <input 
                            type="number"  
                            placeholder="Infant" 
                            className={inputClass}
                            maxLength='2'
                            value={this.state.infant} 
                            onChange = {(event)=>{
                                if(event.target.value.length > 2){
                                    return ;
                                }
                                this.setState({'infant':event.target.value,'pax_error':''})
                            }}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <Typography>ACM</Typography>
                        <input 
                            type="number"  
                            placeholder="ACM" 
                            className={inputClass}
                            maxLength='2'
                            value={this.state.acm} 
                            onChange = {(event)=>{
                                if(event.target.value.length > 2){
                                    return ;
                                }
                                this.setState({'acm':event.target.value,'pax_error':''})
                            }}
                        />
                    </FormControl>
                    {this.state.pax_error && <Typography variant={"body2"} className={classes.error}>{this.state.pax_error}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button  color="primary" onClick={()=>{
                        this.setState({'pax_error':''},function(){
                            this.props.onClose()

                        })
                    }}>
                        Close
                    </Button>
                    <Button  color="primary" onClick={()=>{
                        this.setState({'pax_error':''},function(){
                            this.Submit()
                        })
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
        formControl:{
            width:'100%'
        },
        error:{
            color:'red',
            textAlign:'right'
        }
    });
  };
  
export default connect((store)=>{
  return {
      page:store.page
  }
},{
})(compose(withRouter,withStyles(styles))(PaxModel))
  

