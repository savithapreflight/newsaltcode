import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
  FormControl,
} from "@material-ui/core";
import { connect } from "react-redux";
import "./style.scss";
import {
  AddCircleOutlineSharp as AddIcon,
  RemoveCircleOutlineSharp as RemoveIcon,
} from "@material-ui/icons";

class LMCPaxModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adult: 0,
      adult_lmc: "",
      adult_show: "",
      adult_final: 0,
      child: 0,
      child_lmc: "",
      child_show: "",
      child_final: 0,
      infant: 0,
      infant_lmc: "",
      infant_show: "",
      infant_final: 0,
      acm: 0,
      acm_lmc: "",
      acm_show: "",
      acm_final: 0,
      pax_error: "",
      maxCabin: 0,
    };
    this.Submit = this.Submit.bind(this);
  }
  componentWillReceiveProps(nextProps, prevProps) {
    console.log("nextProps", nextProps);
    console.log("prevProps", prevProps);
    if (nextProps.index !== null) {
      var pax = nextProps.pax;
      var paxlmc = nextProps.paxLMC;
      var index = nextProps.index;
      var maxZoneCount = nextProps.Fleetinfo.MaxCabin;
      // console.log("pax[index]",pax[index])
      if (pax[index] !== null && pax[index] !== undefined) {
        // console.log("component pax",pax)
        var itemsArray = pax[index].split("/");
        // var lmcArray  = paxlmc[index].split('/');
        console.log("itemArray", itemsArray);
        this.setState({
          adult: itemsArray[0],
          child: itemsArray[1],
          infant: itemsArray[2],
          acm: itemsArray[3],
          adult_lmc: "0",
          adult_show: "0",
          child_lmc: "0",
          child_show: "0",
          infant_lmc: "0",
          infant_show: "0",
          acm_lmc: "0",
          acm_show: "0",
          adult_final: itemsArray[0],
          child_final: itemsArray[1],
          infant_final: itemsArray[2],
          acm_final: itemsArray[3],
          maxCabin: maxZoneCount,
        });
      }
    }
    console.log("this.satte", this.state);
  }
  Submit() {
    console.log(this.state.adult);
    var adult = parseInt(this.state.adult_final);
    var cabinlim = this.props.Fleetinfo.CabinLimits;
    console.log("cabinlim", cabinlim);
    var cabinLarray = cabinlim.split("$");
    console.log(cabinLarray);
    var infant = parseInt(this.state.infant_final);
    var maxZone = Math.round(cabinLarray[this.props.index] / 3);

    if (Number(adult) < 0) {
      this.setState({ pax_error: "Adult should be positive value" });
      return;
    }
    var child = parseInt(this.state.child_final);
    if (Number(child) < 0) {
      this.setState({ pax_error: "Chlid should be positive value" });
      return;
    }

    if (Number(infant) < 0) {
      this.setState({ pax_error: "Infant should be positive value" });
      return;
    }
    if (Number(infant) > maxZone) {
      this.setState({ pax_error: `Infant should be less than ${maxZone}` });
      return;
    }
    var acm = parseInt(this.state.acm_final);
    if (Number(acm) < 0) {
      this.setState({ pax_error: "Acm should be positive value" });
      return;
    }
    var adultLmc = parseInt(this.state.adult_lmc);
    var childLmc = parseInt(this.state.child_lmc);
    var infantLmc = parseInt(this.state.infant_lmc);
    var acmLmc = parseInt(this.state.acm_lmc);
    if (
      adultLmc === null ||
      adultLmc === undefined ||
      this.state.adult_lmc.trim().length === 0
    ) {
      console.log("inside if");
      adultLmc = 0;
    }

    if (
      childLmc === null ||
      childLmc === undefined ||
      this.state.child_lmc.trim().length === 0
    ) {
      console.log("inside if");
      childLmc = 0;
    }

    if (
      infantLmc === null ||
      infantLmc === undefined ||
      this.state.infant_lmc.trim().length === 0
    ) {
      console.log("inside if");
      infantLmc = 0;
    }

    if (
      acmLmc === null ||
      acmLmc === undefined ||
      this.state.acm_lmc.trim().length === 0
    ) {
      console.log("inside if");
      acmLmc = 0;
    }
    this.setState({ pax_error: "" });
    var Subpax = String(adult + "/" + child + "/" + infant + "/" + acm);
    var paxLmc = String(
      adultLmc + "/" + childLmc + "/" + infantLmc + "/" + acmLmc
    );
    console.log("paxxxxxx", Subpax);

    for (let i = 0; i < cabinLarray.length; i++) {
      var total_p = parseInt(adult) + parseInt(child) + parseInt(acm);
      console.log(total_p);
      if (i === this.props.index) {
        if (parseInt(total_p) > parseInt(cabinLarray[i])) {
          this.setState({
            pax_error: "Pax should be less than " + cabinLarray[i],
          });
          return;
        }
      }
    }

    this.props.onSubmit(this.props.index, Subpax, paxLmc);
  }
  render() {
    var { classes } = this.props;

    const inputClass = `${
      window.localStorage.getItem("app_theme") === "dark"
        ? "form-control-dark"
        : "form-control-light"
    }`;
    console.log("lmcpax model state", this.state);
    return (
      <Dialog open={this.props.open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Pax{"-" + (this.props.index + 1)}
        </DialogTitle>
        <DialogContent>
          <Grid container className={classes.gridContainer}>
            <Grid item xs={3} className={classes.gridContent}>
              <Typography className={classes.label} variant={"body1"}>
                {this.state.adult}
              </Typography>
            </Grid>
            <Grid item xs={1} className={classes.FlightFront}>
              <IconButton
                aria-label="delete"
                className={classes.iconbutton}
                onClick={() => {
                  if (this.state.adult_show.length !== 0) {
                    this.setState({
                      pax_error: "",
                      adult_lmc: this.state.adult_show,
                      adult_final:
                        parseInt(this.state.adult_show) +
                        parseInt(this.state.adult),
                    });
                  }
                }}
              >
                <AddIcon />
              </IconButton>
            </Grid>
            <Grid item xs={3} className={classes.flightInputContainer}>
              <FormControl className={classes.formControl}>
                <Typography>Adult</Typography>
                <input
                  type="number"
                  className={inputClass}
                  maxLength="2"
                  placeholder={this.state.adult_show}
                  value={
                    this.state.adult_show == 0
                      ? ""
                      : this.state.adult_show &&
                        Math.max(0, this.state.adult_show)
                  }
                  onChange={(event) => {
                    if (event.target.value == "") {
                      event.target.value = 0;
                    }
                    if (event.target.value.length > 2) {
                      return;
                    }
                    if (
                      event.target.value === null ||
                      event.target.value === undefined ||
                      event.target.value.trim().length === 0
                    ) {
                      this.setState({
                        adult_show: event.target.value,
                        adult_final: this.state.adult,
                        adult_lmc: "0",
                      });
                      return;
                    }
                    this.setState({
                      adult_show: event.target.value,
                      pax_error: "",
                    });
                  }}
                  onBlur={(event) => {
                    if (event.target.value.includes(".")) {
                      event.target.value = 0;
                    }
                    if (event.target.value.length > 2) {
                      return;
                    }
                    if (
                      event.target.value === null ||
                      event.target.value === undefined ||
                      event.target.value.trim().length === 0
                    ) {
                      this.setState({
                        adult_show: event.target.value,
                        adult_final: this.state.adult,
                        adult_lmc: "0",
                      });
                      return;
                    }
                    this.setState({
                      adult_show: event.target.value,
                      pax_error: "",
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={1} className={classes.FlightFront}>
              <IconButton
                aria-label="delete"
                className={classes.iconbutton}
                onClick={() => {
                  if (this.state.adult_show.length !== 0) {
                    this.setState({
                      pax_error: "",
                      adult_lmc: "-" + this.state.adult_show,
                      adult_final:
                        parseInt(this.state.adult) -
                        parseInt(this.state.adult_show),
                    });
                  }
                }}
              >
                <RemoveIcon />
              </IconButton>
            </Grid>
            <Grid item xs={1} className={classes.gridContent}>
              <Typography className={classes.label} variant={"body1"}>
                &nbsp;=
              </Typography>
            </Grid>
            <Grid item xs={3} className={classes.gridContent}>
              <Typography className={classes.label} variant={"body1"}>
                {this.state.adult_final}
              </Typography>
            </Grid>
          </Grid>

          <Grid container className={classes.gridContainer}>
            <Grid item xs={3} className={classes.gridContent}>
              <Typography className={classes.label} variant={"body1"}>
                {this.state.child}
              </Typography>
            </Grid>
            <Grid item xs={1} className={classes.FlightFront}>
              <IconButton
                aria-label="delete"
                className={classes.iconbutton}
                onClick={() => {
                  if (this.state.child_show.length !== 0) {
                    this.setState({
                      pax_error: "",
                      child_lmc: this.state.child_show,
                      child_final:
                        parseInt(this.state.child_show) +
                        parseInt(this.state.child),
                    });
                  }
                }}
              >
                <AddIcon />
              </IconButton>
            </Grid>
            <Grid item xs={3} className={classes.flightInputContainer}>
              <FormControl className={classes.formControl}>
                <Typography>Child</Typography>
                <input
                  type="number"
                  className={inputClass}
                  maxLength="2"
                  placeholder={this.state.child_show}
                  value={
                    this.state.child_show == 0
                      ? ""
                      : this.state.child_show &&
                        Math.max(0, this.state.child_show)
                  }
                  onChange={(event) => {
                    if (event.target.value == "") {
                      event.target.value = 0;
                    }
                    if (event.target.value.length > 2) {
                      return;
                    }
                    if (
                      event.target.value === null ||
                      event.target.value === undefined ||
                      event.target.value.trim().length === 0
                    ) {
                      this.setState({
                        child_show: event.target.value,
                        child_final: this.state.child,
                        child_lmc: "0",
                      });
                      return;
                    }
                    this.setState({
                      child_show: event.target.value,
                      pax_error: "",
                    });
                  }}
                  onBlur={(event) => {
                    if (event.target.value.includes(".")) {
                      event.target.value = 0;
                    }
                    if (event.target.value.length > 2) {
                      return;
                    }
                    if (
                      event.target.value === null ||
                      event.target.value === undefined ||
                      event.target.value.trim().length === 0
                    ) {
                      this.setState({
                        child_show: event.target.value,
                        child_final: this.state.child,
                        child_lmc: "0",
                      });
                      return;
                    }
                    this.setState({
                      child_show: event.target.value,
                      pax_error: "",
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={1} className={classes.FlightFront}>
              <IconButton
                aria-label="delete"
                className={classes.iconbutton}
                onClick={() => {
                  if (this.state.child_show.length !== 0) {
                    this.setState({
                      pax_error: "",
                      child_lmc: "-" + this.state.child_show,
                      child_final:
                        parseInt(this.state.child) -
                        parseInt(this.state.child_show),
                    });
                  }
                }}
              >
                <RemoveIcon />
              </IconButton>
            </Grid>
            <Grid item xs={1} className={classes.gridContent}>
              <Typography className={classes.label} variant={"body1"}>
                &nbsp;=
              </Typography>
            </Grid>
            <Grid item xs={3} className={classes.gridContent}>
              <Typography className={classes.label} variant={"body1"}>
                {this.state.child_final}
              </Typography>
            </Grid>
          </Grid>

          <Grid container className={classes.gridContainer}>
            <Grid item xs={3} className={classes.gridContent}>
              <Typography className={classes.label} variant={"body1"}>
                {this.state.infant}
              </Typography>
            </Grid>
            <Grid item xs={1} className={classes.FlightFront}>
              <IconButton
                aria-label="delete"
                className={classes.iconbutton}
                onClick={() => {
                  if (this.state.infant_show.length !== 0) {
                    this.setState({
                      pax_error: "",
                      infant_lmc: this.state.infant_show,
                      infant_final:
                        parseInt(this.state.infant_show) +
                        parseInt(this.state.infant),
                    });
                  }
                }}
              >
                <AddIcon />
              </IconButton>
            </Grid>
            <Grid item xs={3} className={classes.flightInputContainer}>
              <FormControl className={classes.formControl}>
                <Typography>Infant</Typography>
                <input
                  type="number"
                  className={inputClass}
                  maxLength="2"
                  placeholder={this.state.infant_show}
                  value={
                    this.state.infant_show == 0
                      ? ""
                      : this.state.infant_show &&
                        Math.max(0, this.state.infant_show)
                  }
                  onChange={(event) => {
                    if (event.target.value == "") {
                      event.target.value = 0;
                    }
                    if (event.target.value.length > 2) {
                      return;
                    }

                    if (
                      event.target.value === null ||
                      event.target.value === undefined ||
                      event.target.value.trim().length === 0
                    ) {
                      this.setState({
                        infant_show: event.target.value,
                        infant_final: this.state.infant,
                        infant_lmc: "0",
                      });
                      return;
                    }
                    this.setState({
                      infant_show: event.target.value,
                      pax_error: "",
                    });
                  }}
                  onBlur={(event) => {
                    if (event.target.value.includes(".")) {
                      event.target.value = 0;
                    }
                    if (event.target.value.length > 2) {
                      return;
                    }
                    if (
                      event.target.value === null ||
                      event.target.value === undefined ||
                      event.target.value.trim().length === 0
                    ) {
                      this.setState({
                        infant_show: event.target.value,
                        infant_final: this.state.infant,
                        infant_lmc: "0",
                      });
                      return;
                    }
                    this.setState({
                      infant_show: event.target.value,
                      pax_error: "",
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={1} className={classes.FlightFront}>
              <IconButton
                aria-label="delete"
                className={classes.iconbutton}
                onClick={() => {
                  if (this.state.infant_show.length !== 0) {
                    this.setState({
                      pax_error: "",
                      infant_lmc: "-" + this.state.infant_show,
                      infant_final:
                        parseInt(this.state.infant) -
                        parseInt(this.state.infant_show),
                    });
                  }
                }}
              >
                <RemoveIcon />
              </IconButton>
            </Grid>
            <Grid item xs={1} className={classes.gridContent}>
              <Typography className={classes.label} variant={"body1"}>
                &nbsp;=
              </Typography>
            </Grid>
            <Grid item xs={3} className={classes.gridContent}>
              <Typography className={classes.label} variant={"body1"}>
                {this.state.infant_final}
              </Typography>
            </Grid>
          </Grid>

          <Grid container className={classes.gridContainer}>
            <Grid item xs={3} className={classes.gridContent}>
              <Typography className={classes.label} variant={"body1"}>
                {this.state.acm}
              </Typography>
            </Grid>
            <Grid item xs={1} className={classes.FlightFront}>
              <IconButton
                aria-label="delete"
                className={classes.iconbutton}
                onClick={() => {
                  if (this.state.acm_show.length !== 0) {
                    this.setState({
                      pax_error: "",
                      acm_lmc: this.state.acm_show,
                      acm_final:
                        parseInt(this.state.acm_show) +
                        parseInt(this.state.acm),
                    });
                  }
                }}
              >
                <AddIcon />
              </IconButton>
            </Grid>
            <Grid item xs={3} className={classes.flightInputContainer}>
              <FormControl className={classes.formControl}>
                <Typography>ACM</Typography>
                <input
                  type="number"
                  className={inputClass}
                  maxLength="2"
                  placeholder={this.state.acm_show}
                  value={
                    this.state.acm_show == 0
                      ? ""
                      : this.state.acm_show && Math.max(0, this.state.acm_show)
                  }
                  onChange={(event) => {
                    if (event.target.value == "") {
                      event.target.value = 0;
                    }
                    if (event.target.value.length > 2) {
                      return;
                    }
                    if (
                      event.target.value === null ||
                      event.target.value === undefined ||
                      event.target.value.trim().length === 0
                    ) {
                      this.setState({
                        acm_show: event.target.value,
                        acm_final: this.state.acm,
                        acm_lmc: "0",
                      });
                      return;
                    }
                    this.setState({
                      acm_show: event.target.value,
                      pax_error: "",
                    });
                  }}
                  onBlur={(event) => {
                    if (event.target.value.includes(".")) {
                      event.target.value = 0;
                    }
                    if (event.target.value.length > 2) {
                      return;
                    }
                    if (
                      event.target.value === null ||
                      event.target.value === undefined ||
                      event.target.value.trim().length === 0
                    ) {
                      this.setState({
                        acm_show: event.target.value,
                        acm_final: this.state.acm,
                        acm_lmc: "0",
                      });
                      return;
                    }
                    this.setState({
                      acm_show: event.target.value,
                      pax_error: "",
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={1} className={classes.FlightFront}>
              <IconButton
                aria-label="delete"
                className={classes.iconbutton}
                onClick={() => {
                  if (this.state.acm_show.length !== 0) {
                    this.setState({
                      pax_error: "",
                      acm_lmc: "-" + this.state.acm_show,
                      acm_final:
                        parseInt(this.state.acm) -
                        parseInt(this.state.acm_show),
                    });
                  }
                }}
              >
                <RemoveIcon />
              </IconButton>
            </Grid>
            <Grid item xs={1} className={classes.gridContent}>
              <Typography className={classes.label} variant={"body1"}>
                &nbsp;=
              </Typography>
            </Grid>
            <Grid item xs={3} className={classes.gridContent}>
              <Typography className={classes.label} variant={"body1"}>
                {this.state.acm_final}
              </Typography>
            </Grid>
          </Grid>

          {this.state.pax_error && (
            <Typography variant={"body2"} className={classes.error}>
              {this.state.pax_error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              this.setState({ pax_error: "" }, function () {
                this.props.onClose();
              });
            }}
          >
            Close
          </Button>
          <Button
            color="primary"
            onClick={() => {
              this.setState({ pax_error: "" }, function () {
                this.Submit();
              });
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = (theme) => {
  return createStyles({
    formControl: {
      width: "100%",
    },
    error: {
      color: "red",
      textAlign: "right",
    },
    label: {
      textTransform: "uppercase",
    },
    gridContainer: {
      minHeight: "80px",
    },
    gridContent: {
      top: 0,
      bottom: 0,
      margin: "auto",
      textAlign: "center",
    },
    iconbutton: {
      padding: "0px",
    },
    FlightFront: {
      top: 0,
      bottom: 0,
      margin: "auto",
      textAlign: "center",
    },
  });
};

export default connect((store) => {
  return {
    page: store.page,
  };
}, {})(compose(withRouter, withStyles(styles))(LMCPaxModel));
