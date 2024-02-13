// import React from 'react';
// import {createStyles,withStyles } from '@material-ui/core/styles';
// import { compose } from "recompose";
// import { withRouter } from "react-router-dom";
// import { Dialog,DialogTitle,DialogContent,DialogActions,Button,Grid,IconButton,TextField, Typography,FormControl} from '@material-ui/core';
// import {connect} from "react-redux";
// import './styles.scss';
// import {AddCircleOutlineSharp as AddIcon,RemoveCircleOutlineSharp as RemoveIcon} from '@material-ui/icons';
// import CssTextField from '../../common/Textfield/index';

// class CargoBaggageModal extends React.Component {
//     constructor(props){
//         super(props);
//         this.state  =   {
//             'cargo_final':{},
//             'baggage_final':{},
//             'cargo':{},
//             'baggage':{},
//             'cargo_show':{},
//             'baggage_show':{},
//             'cargo_error':'',
//             'index':null
//         }
//     }
//     componentWillReceiveProps(nextProps,prevProps){
//         if(nextProps.cargoData !== null ){
//             this.setState({
//                 cargo: nextProps.cargoData,
//                 baggage: nextProps.baggageData,
//                 cargo_final: nextProps.cargoFinal,
//                 baggage_final: nextProps.baggageFinal,
//                 cargo_show: nextProps.cargoShow,
//                 baggage_show: nextProps.baggageShow,
//                 index: nextProps.index,
//                 cargo_error: nextProps.cargoError,
//             });

//             console.log("Car Final: ", nextProps.cargoFinal);
//             console.log("Bag Final: ", nextProps.index);
//         }   
//     }

//     render(){ 
//         var {classes} = this.props;

//         const inputClass = `${window.localStorage.getItem("app_theme") === "dark" ? "form-control-dark" : "form-control-light"}`;
//         //console.log("Cargo state",this.props.cargoData);
//         return ( 
//             <Dialog open={this.props.open} aria-labelledby="form-dialog-title">
//                 <DialogTitle id="form-dialog-title">C-{parseInt(this.state.index) + 1}</DialogTitle>
//                 <DialogContent>
//                     <Grid container className={classes.gridContainer}>
//                         <Grid item xs={3} className={classes.gridContent}>
//                             <Typography className={classes.label} variant={'body1'}>{this.state.cargo[this.state.index]}</Typography>
//                         </Grid>
//                         <Grid item xs={1} className={classes.FlightFront}>
//                             <IconButton aria-label="delete" className={classes.iconbutton} onClick={()=>{
//                             //console.log("add button event",i);
//                             this.props.cargoAdd(this.state.index);
//                             }}>
//                             <AddIcon />
//                             </IconButton>
//                     </Grid>
//                     <Grid item xs={3} className={classes.flightInputContainer}>
//                         <FormControl className={classes.formControl}>
//                             <Typography>CARGO</Typography>
//                             <input 
//                                 type="number"  
//                                 className={inputClass}
//                                 maxLength='2'
//                                 value={this.state.cargo_show[this.state.index] && Math.max(0, this.state.cargo_show[this.state.index])}
//                                 onChange = {(event) => {
//                                   if (event.target.value == ''){
//                                     event.target.value = 0;
//                                   }
//                                     if (event.target.value.length > 4) {
//                                       return;
//                                     }
//                                     this.props.handleCargo(this.state.index, event.target.value)
//                                     //this.setState({ 'cargo1_error': '' });
//                                   }}
//                                   onBlur={(event) => {
//                                     if (event.target.value.includes(".")){
//                                       event.target.value = 0;
//                                     }
//                                     if (event.target.value.length > 5) {
//                                       return;
//                                     }                                  
//                                     this.props.handleCargo(this.state.index, event.target.value)
//                                     //this.setState({ 'cargo1_error': '' });
//                                   }}
//                             />
//                         </FormControl>
//                       {/* <CssTextField
//                         id="cargo"
//                         label={"CARGO"}
//                         type="number"
//                         className={classes.textfield}
//                         variant="outlined"
//                         InputProps={{
//                           className: classes.input
//                         }}
//                         inputProps={{
//                           dataIndex: this.state.index
//                         }}
//                         onBlur={(event) => {
//                           this.props.handleFocusOut(event.target.getAttribute('dataindex'), event.target.value)
//                           //this.setState({ 'cargo1_error': '' });
//                         }}
//                         value={this.state.cargo_show[this.state.index] && Math.max(0, this.state.cargo_show[this.state.index])}
//                         onChange={(event) => {
//                           if (event.target.value.length > 4) {
//                             return;
//                           }
//                           this.props.handleCargo(event.target.getAttribute('dataindex'), event.target.value)
//                           //this.setState({ 'cargo1_error': '' });
//                         }}
//                       /> */}
//                     </Grid>
//                     <Grid item xs={1} className={classes.FlightFront}>
//                     <IconButton aria-label="delete" className={classes.iconbutton}onClick={()=>{
//                       //console.log("remove button event",i)
//                       this.props.cargoSubtract(this.state.index);
//                     }}>
//                       <RemoveIcon />
//                     </IconButton>
//                   </Grid>
//                     <Grid item xs={1} className={classes.FlightFront}>
//                       <Typography className={classes.label} variant={'body1'}>&nbsp;=</Typography>
//                     </Grid>
//                     <Grid item xs={3} className={classes.FlightFront}>
//                       <Typography className={classes.label} variant={'body1'}>{this.state.cargo_final && this.state.cargo_final[this.state.index]}</Typography>
//                     </Grid>
//                   </Grid>
//                 {/* {this.state.pax_error && <Typography variant={"body2"} className={classes.error}>{this.state.cargo_error}</Typography>} */}
//                 <Grid container className={classes.gridContainer}>
//                         <Grid item xs={3} className={classes.gridContent}>
//                             <Typography className={classes.label} variant={'body1'}>{this.state.baggage[this.state.index]}</Typography>
//                         </Grid>
//                         <Grid item xs={1} className={classes.FlightFront}>
//                             <IconButton aria-label="delete" className={classes.iconbutton} onClick={()=>{
//                             //console.log("add button event",i);
//                             this.props.baggageAdd(this.state.index);
//                             }}>
//                             <AddIcon />
//                             </IconButton>
//                     </Grid>
//                     <Grid item xs={3} className={classes.flightInputContainer} >
//                         <FormControl className={classes.formControl}>
//                             <Typography>BAGGAGE</Typography>
//                             <input 
//                                 type="number"  
//                                 className={inputClass}
//                                 maxLength='2'
//                                 value={this.state.baggage_show[this.state.index] && Math.max(0, this.state.baggage_show[this.state.index])}
//                                 onChange = {(event) => {
//                                   if (event.target.value == ''){
//                                     event.target.value = 0;
//                                   }
//                                     if (event.target.value.length > 4) {
//                                       return;
//                                     }
//                                     this.props.handleBaggage(this.state.index, event.target.value)
//                                     //this.setState({ 'cargo1_error': '' });
//                                   }}
//                                   onBlur={(event) => {
//                                     if (event.target.value.includes(".")){
//                                       event.target.value = 0;
//                                     }
//                                     if (event.target.value.length > 5) {
//                                       return;
//                                     }
//                                     this.props.handleBaggage(this.state.index, event.target.value)
//                                     //this.setState({ 'cargo1_error': '' });
//                                   }}                                  
//                             />
//                         </FormControl>
//                       {/* <CssTextField
//                         id="cargo"
//                         label={"BAGGAGE"}
//                         type="number"
//                         className={classes.textfield}
//                         variant="outlined"
//                         InputProps={{
//                           className: classes.input
//                         }}
//                         inputProps={{
//                           dataIndex: this.state.index
//                         }}
//                         onBlur={(event) => {
//                           this.props.handleFocusOut(event.target.getAttribute('dataindex'), event.target.value)
//                           //this.setState({ 'cargo1_error': '' });
//                         }}
//                         value={this.state.cargo_show[this.state.index] && Math.max(0, this.state.cargo_show[this.state.index])}
//                         onChange={(event) => {
//                           if (event.target.value.length > 4) {
//                             return;
//                           }
//                           this.props.handleCargo(event.target.getAttribute('dataindex'), event.target.value)
//                           //this.setState({ 'cargo1_error': '' });
//                         }}
//                       /> */}
//                     </Grid>
//                     <Grid item xs={1} className={classes.FlightFront}>
//                     <IconButton aria-label="delete" className={classes.iconbutton}onClick={()=>{
//                       //console.log("remove button event",i)
//                       this.props.baggageSubtract(this.state.index);
//                     }}>
//                       <RemoveIcon />
//                     </IconButton>
//                   </Grid>
//                     <Grid item xs={1} className={classes.FlightFront}>
//                       <Typography className={classes.label} variant={'body1'}>&nbsp;=</Typography>
//                     </Grid>
//                     <Grid item xs={3} className={classes.FlightFront}>
//                       <Typography className={classes.label} variant={'body1'}>{this.state.baggage_final && this.state.baggage_final[this.state.index]}</Typography>
//                     </Grid>
//                   </Grid>
//                   {this.state.cargo_error && <Typography variant={"body2"} className={classes.error}>{this.state.cargo_error}</Typography>}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button  color="primary" onClick={()=>{
//                         this.setState({'cargo_error':''},function(){
//                             this.props.onClose()
//                         })
//                     }}>
//                         Close
//                     </Button>
//                     <Button  color="primary" onClick={()=>{
//                         this.setState({'cargo_error':''},function(){
//                             this.props.onSubmit()
//                         })
//                     }}>
//                         Submit
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         );
//     }
  
// } 

// const styles = (theme) => {
//     return createStyles({
//         formControl:{
//             width:'100%'
//         },
//         error:{
//             color:'red',
//             textAlign:'right'
//         },
//         'label': {
//             textTransform: "uppercase"
//         },
//         gridContainer:{
//             minHeight:'80px'
//         },
//         'gridContent': {
//             top:0,
//             bottom:0,
//             margin:'auto',
//             textAlign:'center'
//         },
//         iconbutton:{
//             padding:"0px"
//         },
//         'FlightFront': {
//             top: 0,
//             bottom: 0,
//             margin: 'auto',
//             textAlign: 'center'
//         },
//         textfield: {
//             flex: '1',
//             margin: '4px',
//             width:"95%"
//         },
//     });
//   };
  
// export default connect((store)=>{
//   return {
//       page:store.page
//   }
// },{
// })(compose(withRouter,withStyles(styles))(CargoBaggageModal))
  

