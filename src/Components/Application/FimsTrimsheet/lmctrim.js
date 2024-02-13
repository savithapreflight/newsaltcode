import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Typography,
  Button,
  Fab,
  Grid,
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import { Print as PrintIcon } from "@material-ui/icons";
import { setPage, setAction } from "../../../Action/pageaction";
import SelectInput from "../../common/Select/index";
import * as Enviornment from "../../../Action/environment";
import { printtrimSheet } from "../../../Action/trimsheetprintaction";
import momentTZ from "moment-timezone";
import moment from "moment";
class Lmctrim extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      in_prog: false,
      trim_sheet: null,
      error: false,
      is_printing: false,
      totalLoad: null,
      Maxcargo: [],
      Maxpax: [],
      totalAdult: null,
      COMPWT: 0,
      CABBGWT: 0,
      PAXWT: 0,
      CONFIG: "",
      totalChild: null,
      totalInfant: null,
      thrust: 0,
      flap: "",
      stab: 0,
      crew: 0,
      DOW: 0,
      lim1: false,
      lim2: false,
      lim3: false,
    };
    // this.fetchTrimSheet   =   this.fetchTrimSheet.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.sync.ramp_sync == false && newProps.sync.ramp_sync) {
      this.fetchTrimSheet();
    }
  }

  componentWillMount() {
    this.props.setPage("FimsTrimsheet", "FimsTrimsheet");
    this.props.setPageAction(null);
    // this.fetchTrimSheet();
  }

  componentWillReceiveProps(nextProps, prevProps) {
    var me = this;
    me.setState({ in_prog: true, error: false });
    var trim = nextProps.trimSheet;
    console.log("nextProps", nextProps);
    if (trim !== undefined && trim !== null && Object.keys(trim).length !== 0) {
      console.log(trim);
      var count = 0;
      var stdCount = 0;
      var crewArray = trim.ActcrewStr.split("/");
      var stdcrewArray = trim.STDCREW.match(/\d+/g);
      console.log(trim.AdjustStr);
      var cabinArray = trim.AdjustStr.split("$");
      var cabinBagagge = parseInt(cabinArray[12]);
      if (isNaN(cabinBagagge)) {
        cabinBagagge = 0;
      }
      console.log(cabinArray);
      console.log(cabinBagagge);
      var crew = crewArray.map((x) => {
        var c = parseInt(x);
        count = count + c;
        return x;
      });

      stdcrewArray.map((x) => {
        var c = parseInt(x);
        stdCount = stdCount + c;
        return x;
      });
      var ACM = (count - stdCount) * 85;
      var DOW = Math.round(trim.dow);
      console.log("ACM", ACM);
      console.log("DOW", DOW);

      console.log("count", count);
      console.log("stdCount", stdCount);
      var LIM1 = parseInt(trim.MZFW + trim.FOB);
      var LIM2 = parseInt(trim.OTOW);
      var LIM3 = parseInt(trim.OLW + trim.TRIP_FUEL);

      console.log("lim 1", LIM1);
      console.log("lim 2", LIM2);
      console.log("lim 3", LIM3);
      if (LIM1 < LIM2 && LIM1 < LIM3) {
        this.setState({ lim1: true });
      }
      if (LIM2 < LIM1 && LIM2 < LIM3) {
        this.setState({ lim2: true });
      }
      if (LIM3 < LIM1 && LIM3 < LIM2) {
        this.setState({ lim3: true });
      }

      var alpha = trim.CONFIG.match(/[a-zA-Z]/g).join("");
      var digit = trim.CONFIG.match(/\d/g).join("");
      var finalConfig = digit + alpha;

      var totalAdult =
        trim.C1Adult +
        trim.C2Adult +
        trim.C3Adult +
        trim.C4Adult +
        trim.C5Adult +
        trim.C6Adult +
        trim.C7Adult +
        trim.C8Adult;
      var totalChild =
        trim.C1Child +
        trim.C2Child +
        trim.C3Child +
        trim.C4Child +
        trim.C5Child +
        trim.C6Child +
        trim.C7Child +
        trim.C8Child;
      var totalInfant =
        trim.C1Infant +
        trim.C2Infant +
        trim.C3Infant +
        trim.C4Infant +
        trim.C5Infant +
        trim.C6Infant +
        trim.C7Infant +
        trim.C8Infant;
      var COMPWT = trim.cmpt1 + trim.cmpt2 + trim.cmpt3 + trim.cmpt4;
      var CABBGWT = trim.cabinBagagge;
      var PAXWT = totalAdult * 75 + totalChild * 35 + totalInfant * 10;
      var TTLLOAD =
        trim.cmpt1 +
        trim.cmpt2 +
        trim.cmpt3 +
        trim.cmpt4 +
        (trim.C1Adult +
          trim.C2Adult +
          trim.C3Adult +
          trim.C4Adult +
          trim.C5Adult +
          trim.C6Adult +
          trim.C7Adult +
          trim.C8Adult) *
          75 +
        (trim.C1Child +
          trim.C2Child +
          trim.C3Child +
          trim.C4Child +
          trim.C5Child +
          trim.C6Child +
          trim.C7Child +
          trim.C8Child) *
          35 +
        (trim.C1Infant +
          trim.C2Infant +
          trim.C3Infant +
          trim.C4Infant +
          trim.C5Infant +
          trim.C6Infant +
          trim.C7Infant +
          trim.C8Infant) *
          10 +
        CABBGWT;
      var thrust = trim.Thrust1 > 0 ? trim.Thrust1 : 0;
      var flap = thrust > 0 ? trim.T1Flap1 : "";
      var stab = thrust > 0 ? trim.T1Stab1 : 0;
      me.setState({
        in_prog: false,
        CONFIG: finalConfig,
        CABBGWT: CABBGWT,
        COMPWT: COMPWT,
        PAXWT: PAXWT,
        stab: stab,
        flap: flap,
        thrust: thrust,
        error: false,
        trim_sheet: trim,
        crew: count,
        DOW: DOW,
        Maxcargo: trim.MaxCompartment,
        Maxpax: trim.MaxCabin,
        totalLoad: TTLLOAD,
        totalAdult: totalAdult,
        totalChild: totalChild,
        totalInfant: totalInfant,
      });
      console.log("state", this.state);
    }
    // }).catch(err=>{
    //   console.log(err,'error...')
    //   me.setState({'in_prog':false,'error':true,trim_sheet:null});
    // })
  }

  formatTime(str) {
    if (str == null) {
      return "-";
    }
    return momentTZ.tz(str, "UTC").format("HH:mm");
  }

  formatThrust(number) {
    if (number == null) {
      return "-";
    }
    var a = "K";
    var new_number = parseInt(number) / 1000 + a;

    return new_number;
  }

  fixedNumber(number) {
    console.log(number);
    console.log("number...");
    var value = Number(number);
    var res = String(number).split(".");
    if (res.length == 1 || res[1].length >= 1) {
      value = value.toFixed(2);
    }
    return value;

    // console.log(number,"number")
    // return  parseFloat(number.toFixed(2))
  }
  fixed1Number(number) {
    var value = Number(number);
    var res = String(number).split(".");
    if (res.length == 1 || res[1].length >= 1) {
      value = value.toFixed(1);
    }
    return value;
  }

  formatDate(str) {
    if (str == null) {
      return "-";
    }
    return moment(str).format("DDMMMYY").toUpperCase();
  }
  formatDateGetDay(str) {
    if (str == null) {
      return "-";
    }
    return moment(str).format("DD");
  }

  thrustChangeHandle() {
    var me = this;
    if (
      this.state.thrust === this.state.trim_sheet.Thrust1 &&
      this.state.flap === this.state.trim_sheet.T1Flap1
    ) {
      me.setState({ stab: this.state.trim_sheet.T1Stab1 });
    }
    if (
      this.state.thrust === this.state.trim_sheet.Thrust1 &&
      this.state.flap === this.state.trim_sheet.T1Flap2
    ) {
      me.setState({ stab: this.state.trim_sheet.T1Stab2 });
    }
    if (
      this.state.thrust === this.state.trim_sheet.Thrust2 &&
      this.state.flap === this.state.trim_sheet.T2Flap1
    ) {
      me.setState({ stab: this.state.trim_sheet.T2Stab1 });
    }

    if (
      this.state.thrust === this.state.trim_sheet.Thrust2 &&
      this.state.flap === this.state.trim_sheet.T2Flap2
    ) {
      me.setState({ stab: this.state.trim_sheet.T2Stab2 });
    }

    if (
      this.state.thrust === this.state.trim_sheet.Thrust3 &&
      this.state.flap === this.state.trim_sheet.T3Flap1
    ) {
      me.setState({ stab: this.state.trim_sheet.T3Stab1 });
    }

    if (
      this.state.thrust === this.state.trim_sheet.Thrust3 &&
      this.state.flap === this.state.trim_sheet.T3Flap2
    ) {
      me.setState({ stab: this.state.trim_sheet.T3Stab2 });
    }

    if (
      this.state.thrust === this.state.trim_sheet.Thrust4 &&
      this.state.flap === this.state.trim_sheet.T4Flap1
    ) {
      me.setState({ stab: this.state.trim_sheet.T4Stab1 });
    }

    if (
      this.state.thrust === this.state.trim_sheet.Thrust4 &&
      this.state.flap === this.state.trim_sheet.T4Flap2
    ) {
      me.setState({ stab: this.state.trim_sheet.T4Stab2 });
    }
  }

  render() {
    var classes = this.props.classes;
    console.log(
      this.state.in_prog,
      this.props.sync.ramp_sync,
      this.state.error
    );
    console.log("state", this.state);
    console.log("props open", this.props.open);
    if (this.state.trim_sheet !== null) {
      var Acft_Regn = this.state.trim_sheet.Acft_Regn;
    }
    var total_load = 222;
    const inputClass = `${
      window.localStorage.getItem("app_theme") === "dark"
        ? "form-control-dark"
        : "form-control-light"
    }`;
    return (
      <div className={classes.trim_container}>
        {this.state.trim_sheet !== null &&
          this.state.trim_sheet.Acft_Type !== "Q400" && (
            <div className={classes.formField}>
              <Grid container>
                <Grid item xs={6} className={classes.gridItem}>
                  <Typography className={classes.label} variant={"body1"}>
                    Thrust
                  </Typography>
                  <FormControl className={classes.dropdown}>
                    <Select
                      value={this.state.thrust}
                      onChange={(event) => {
                        this.setState(
                          { thrust: event.target.value },
                          function () {
                            this.thrustChangeHandle();
                          }
                        );
                      }}
                      classes={{
                        icon: classes.downIcon,
                        select: classes.selectFocus,
                      }}
                      displayEmpty
                      input={<SelectInput />}
                    >
                      {this.state.trim_sheet.Thrust1 !== undefined &&
                        this.state.trim_sheet.Thrust1 !== null &&
                        this.state.trim_sheet.Thrust1 !== 0 && (
                          <MenuItem value={this.state.trim_sheet.Thrust1}>
                            {this.state.trim_sheet.Thrust1}
                          </MenuItem>
                        )}
                      {this.state.trim_sheet.Thrust2 !== undefined &&
                        this.state.trim_sheet.Thrust2 !== null &&
                        this.state.trim_sheet.Thrust2 !== 0 && (
                          <MenuItem value={this.state.trim_sheet.Thrust2}>
                            {this.state.trim_sheet.Thrust2}
                          </MenuItem>
                        )}
                      {this.state.trim_sheet.Thrust3 !== undefined &&
                        this.state.trim_sheet.Thrust3 !== null &&
                        this.state.trim_sheet.Thrust3 !== 0 && (
                          <MenuItem value={this.state.trim_sheet.Thrust3}>
                            {this.state.trim_sheet.Thrust3}
                          </MenuItem>
                        )}
                      {this.state.trim_sheet.Thrust4 !== undefined &&
                        this.state.trim_sheet.Thrust4 !== null &&
                        this.state.trim_sheet.Thrust4 !== 0 && (
                          <MenuItem value={this.state.trim_sheet.Thrust4}>
                            {this.state.trim_sheet.Thrust4}
                          </MenuItem>
                        )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} className={classes.gridItem}>
                  <Typography className={classes.label} variant={"body1"}>
                    Flap
                  </Typography>
                  <FormControl className={classes.dropdown}>
                    <Select
                      value={this.state.flap}
                      onChange={(event) => {
                        this.setState(
                          { flap: event.target.value },
                          function () {
                            this.thrustChangeHandle();
                          }
                        );
                      }}
                      classes={{
                        icon: classes.downIcon,
                        select: classes.selectFocus,
                      }}
                      displayEmpty
                      input={<SelectInput />}
                    >
                      {this.state.trim_sheet.Thrust1 === this.state.thrust &&
                        this.state.trim_sheet.T1Flap1 !== undefined &&
                        this.state.trim_sheet.T1Flap1 !== null &&
                        this.state.trim_sheet.T1Flap1.length > 0 && (
                          <MenuItem value={this.state.trim_sheet.T1Flap1}>
                            {this.state.trim_sheet.T1Flap1}
                          </MenuItem>
                        )}
                      {this.state.trim_sheet.Thrust1 === this.state.thrust &&
                        this.state.trim_sheet.T1Flap2 !== undefined &&
                        this.state.trim_sheet.T1Flap2 !== null &&
                        this.state.trim_sheet.T1Flap2.length > 0 && (
                          <MenuItem value={this.state.trim_sheet.T1Flap2}>
                            {this.state.trim_sheet.T1Flap2}
                          </MenuItem>
                        )}
                      {this.state.trim_sheet.Thrust2 === this.state.thrust &&
                        this.state.trim_sheet.T2Flap1 !== undefined &&
                        this.state.trim_sheet.T2Flap1 !== null &&
                        this.state.trim_sheet.T2Flap1.length > 0 && (
                          <MenuItem value={this.state.trim_sheet.T2Flap1}>
                            {this.state.trim_sheet.T2Flap1}
                          </MenuItem>
                        )}
                      {this.state.trim_sheet.Thrust2 === this.state.thrust &&
                        this.state.trim_sheet.T2Flap2 !== undefined &&
                        this.state.trim_sheet.T2Flap2 !== null &&
                        this.state.trim_sheet.T2Flap2.length > 0 && (
                          <MenuItem value={this.state.trim_sheet.T2Flap2}>
                            {this.state.trim_sheet.T2Flap2}
                          </MenuItem>
                        )}
                      {this.state.trim_sheet.Thrust3 === this.state.thrust &&
                        this.state.trim_sheet.T3Flap1 !== undefined &&
                        this.state.trim_sheet.T3Flap1 !== null &&
                        this.state.trim_sheet.T3Flap1.length > 0 && (
                          <MenuItem value={this.state.trim_sheet.T3Flap1}>
                            {this.state.trim_sheet.T3Flap1}
                          </MenuItem>
                        )}
                      {this.state.trim_sheet.Thrust3 === this.state.thrust &&
                        this.state.trim_sheet.T3Flap2 !== undefined &&
                        this.state.trim_sheet.T3Flap2 !== null &&
                        this.state.trim_sheet.T3Flap2.length > 0 && (
                          <MenuItem value={this.state.trim_sheet.T3Flap2}>
                            {this.state.trim_sheet.T3Flap2}
                          </MenuItem>
                        )}
                      {this.state.trim_sheet.Thrust4 === this.state.thrust &&
                        this.state.trim_sheet.T4Flap1 !== undefined &&
                        this.state.trim_sheet.T4Flap1 !== null &&
                        this.state.trim_sheet.T4Flap1.length > 0 && (
                          <MenuItem value={this.state.trim_sheet.T4Flap1}>
                            {this.state.trim_sheet.T4Flap1}
                          </MenuItem>
                        )}
                      {this.state.trim_sheet.Thrust4 === this.state.thrust &&
                        this.state.trim_sheet.T4Flap2 !== undefined &&
                        this.state.trim_sheet.T4Flap2 !== null &&
                        this.state.trim_sheet.T4Flap2.length > 0 && (
                          <MenuItem value={this.state.trim_sheet.T4Flap2}>
                            {this.state.trim_sheet.T4Flap2}
                          </MenuItem>
                        )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </div>
          )}
        {this.state.in_prog && this.props.sync.ramp_sync && (
          <div className={classes.progress}>
            <Typography variant={"h6"} className={classes.typo}>
              Loading ....{" "}
            </Typography>
          </div>
        )}
        {this.state.in_prog == false &&
          this.props.sync.ramp_sync == false &&
          this.state.error == true && (
            <div className={classes.error}>
              <Typography variant={"h6"} className={classes.error}>
                Trim Sheet Cannot Be Drawn at This Moment
              </Typography>
              {/* <Button variant={"contained"} color={"primary"} fullWidth>Refresh</Button> */}
            </div>
          )}
        {this.state.in_prog == false &&
          this.props.sync.ramp_sync == false &&
          this.state.error == false && (
            <div className={classes.trimsheet}>
              {this.state.trim_sheet === null && (
                <Typography variant={"h6"} className={classes.typo}>
                  Trim Sheet
                </Typography>
              )}
              {this.state.trim_sheet === null && (
                <Typography variant={"h6"} className={classes.typo}>
                  Not Available
                </Typography>
              )}
              {this.state.trim_sheet != null && (
                <table
                  id="MainContent_Table1"
                  className={classes.trimsheet_papper1}
                  align="center"
                  bgcolor="white"
                  cellpadding="2"
                  cellspacing="2"
                  border="0"
                  width="100%"
                  style={{ color: "#000" }}
                >
                  <tbody>
                    <tr>
                      <td
                        colspan="4"
                        align="center"
                        style={{ fontSize: "medium", letterSpacing: "0.1em" }}
                      >
                        <b>{Enviornment.get("VENDOR")} LOADSHEET</b>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="1" width="25%">
                        <span
                          id="MainContent_lblflightNo"
                          style={{ fontWeight: "normal" }}
                        >
                          {this.state.trim_sheet.Flight_no}/
                          {this.formatDateGetDay(
                            this.state.trim_sheet.Flight_Date
                          )}
                        </span>
                      </td>
                      <td
                        colspan="1"
                        style={{ textAlign: "center" }}
                        width="25%"
                      >
                        <span
                          id="MainContent_lblflightDate"
                          style={{ fontWeight: "normal" }}
                        >
                          {this.formatDate(
                            this.state.trim_sheet.TrimGenTimeUTC
                          )}
                        </span>
                      </td>
                      <td
                        colspan="1"
                        style={{ textAlign: "center" }}
                        width="25%"
                      >
                        <span id="MainContent_lblTrimGenTimeUTC">
                          {this.formatTime(
                            this.state.trim_sheet.TrimGenTimeUTC
                          )}
                        </span>
                      </td>
                      <td
                        colspan="1"
                        style={{ textAlign: "right" }}
                        width="25%"
                      >
                        <span
                          id="MainContent_lblEdNo"
                          style={{ fontWeight: "normal" }}
                        >
                          ED M0{this.state.trim_sheet.EDNO}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="1" width="25%">
                        <span
                          id="MainContent_lblflightFrom"
                          style={{ letterSpacing: "0.0em" }}
                        >
                          {this.state.trim_sheet.Source +
                            "-" +
                            this.state.trim_sheet.Destination}
                        </span>
                        &nbsp;
                      </td>
                      <td
                        colspan="1"
                        style={{ textAlign: "center" }}
                        width="25%"
                      >
                        <span
                          id="MainContent_lblAcft_Tpe"
                          style={{ fontWeight: "normal", textAlign: "center" }}
                        >
                          {this.state.trim_sheet.Acft_Type +
                            "/" +
                            this.state.CONFIG}
                        </span>
                      </td>
                      <td
                        colspan="1"
                        style={{ textAlign: "center" }}
                        width="25%"
                      >
                        <span
                          id="MainContent_lblAcft_Regn"
                          style={{ textAlign: "right" }}
                        >
                          {this.state.trim_sheet.Acft_Regn}
                        </span>
                      </td>
                      <td
                        colspan="1"
                        style={{ textAlign: "right" }}
                        width="25%"
                      >
                        <span
                          id="MainContent_lblActcrewStr"
                          style={{ fontWeight: "normal" }}
                        >
                          {this.state.trim_sheet.ActcrewStr}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
              {this.state.trim_sheet != null && (
                <table
                  id="MainContent_Table2"
                  className={classes.trimsheet_papper1}
                  align="center"
                  bgcolor="white"
                  cellpadding="2"
                  cellspacing="2"
                  border="0"
                  width="100%"
                  style={{ color: "#000" }}
                >
                  <tbody>
                    <tr>
                      <td colspan="1" width="50%" style={{ textAlign: "left" }}>
                        COMP WT{" "}
                        <span
                          style={{ float: "right" }}
                          id="MainContent_totalLoad"
                        >
                          {this.state.COMPWT} &nbsp; &nbsp;
                        </span>
                      </td>
                      {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
                      <td colspan="1" width="50%">
                        &nbsp;{" "}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="1" width="50%" style={{ textAlign: "left" }}>
                        CAB BG WT{" "}
                        <span
                          style={{ float: "right" }}
                          id="MainContent_totalLoad"
                        >
                          {this.state.CABBGWT} &nbsp; &nbsp;
                        </span>
                      </td>
                      {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
                      <td colspan="1" width="50%">
                        &nbsp;{" "}
                      </td>
                    </tr>

                    <tr>
                      <td colspan="1" width="50%" style={{ textAlign: "left" }}>
                        PAX WT2{" "}
                        <span
                          style={{ float: "right" }}
                          id="MainContent_totalLoad"
                        >
                          {this.state.PAXWT} &nbsp; &nbsp;
                        </span>
                      </td>
                      {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
                      <td colspan="1" width="50%">
                        &nbsp;{" "}
                      </td>
                    </tr>

                    <tr>
                      <td colspan="1" width="50%" style={{ textAlign: "left" }}>
                        TTL LOAD2{" "}
                        <span
                          style={{ float: "right" }}
                          id="MainContent_totalLoad"
                        >
                          {this.state.totalLoad} &nbsp; &nbsp;
                        </span>
                      </td>
                      {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
                      <td colspan="1" width="50%">
                        &nbsp;{" "}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="1" width="50%" style={{ textAlign: "left" }}>
                        DOW2{" "}
                        <span
                          style={{ float: "right" }}
                          id="MainContent_lblflightDOW"
                        >
                          {this.state.DOW} &nbsp; &nbsp;
                        </span>{" "}
                      </td>
                      {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_lblflightDOW">{this.state.trim_sheet.OEW}</span> </td> */}
                      <td colspan="1" width="50%">
                        {" "}
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td colspan="1" width="50%" style={{ textAlign: "left" }}>
                        <b>ZFW</b>{" "}
                        <span
                          style={{ float: "right" }}
                          id="MainContent_lblflightZFW"
                        >
                          {this.state.trim_sheet.ZFW} &nbsp; &nbsp;
                        </span>
                      </td>
                      {this.state.lim1 == false && (
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          &nbsp; &nbsp; MAX{" "}
                          <span id="MainContent_lblflightZFWmax">
                            {" "}
                            &nbsp;{this.state.trim_sheet.MZFW}
                          </span>
                        </td>
                      )}
                      {this.state.lim1 == true && (
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          &nbsp; &nbsp; MAX{" "}
                          <span id="MainContent_lblflightZFWmax">
                            {" "}
                            &nbsp;{this.state.trim_sheet.MZFW + " L"}
                          </span>
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td colspan="1" width="50%" style={{ textAlign: "left" }}>
                        TOF
                        <span
                          style={{ float: "right" }}
                          id="MainContent_lblflightTOF"
                        >
                          {this.state.trim_sheet.FOB} &nbsp; &nbsp;
                        </span>{" "}
                      </td>
                      <td colspan="1" width="50%">
                        {" "}
                        &nbsp;
                      </td>
                    </tr>

                    <tr>
                      <td colspan="1" width="50%" style={{ textAlign: "left" }}>
                        <b>TOW</b>{" "}
                        <span
                          style={{ float: "right" }}
                          id="MainContent_lblflightTOW"
                        >
                          {this.state.trim_sheet.TOW} &nbsp; &nbsp;
                        </span>
                      </td>
                      {this.state.lim2 == false && (
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          &nbsp; &nbsp; MAX{" "}
                          <span id="MainContent_lblflightTOWmax">
                            {" "}
                            &nbsp; {this.state.trim_sheet.MTOW}
                          </span>
                        </td>
                      )}
                      {this.state.lim2 == true && (
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          &nbsp; &nbsp; MAX{" "}
                          <span id="MainContent_lblflightTOWmax">
                            {" "}
                            &nbsp; {this.state.trim_sheet.MTOW + " L"}
                          </span>
                        </td>
                      )}
                    </tr>

                    <tr>
                      <td colspan="1" width="50%" style={{ textAlign: "left" }}>
                        TRIP
                        <span
                          style={{ float: "right" }}
                          id="MainContent_lblflightTrip"
                        >
                          {this.state.trim_sheet.TRIP_FUEL} &nbsp; &nbsp;
                        </span>{" "}
                      </td>
                      <td colspan="1" width="50%">
                        {" "}
                        &nbsp;
                      </td>
                    </tr>

                    <tr>
                      <td colspan="1" width="50%" style={{ textAlign: "left" }}>
                        <b>LAW</b>{" "}
                        <span
                          style={{ float: "right" }}
                          id="MainContent_lblflightLW"
                        >
                          {this.state.trim_sheet.LAW} &nbsp; &nbsp;
                        </span>
                      </td>
                      {this.state.lim3 == false && (
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          &nbsp; &nbsp; MAX{" "}
                          <span id="MainContent_lblflightLAWmax">
                            {" "}
                            &nbsp;{this.state.trim_sheet.OLW}
                          </span>
                        </td>
                      )}
                      {this.state.lim3 == true && (
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          &nbsp; &nbsp; MAX{" "}
                          <span id="MainContent_lblflightLAWmax">
                            {" "}
                            &nbsp;{this.state.trim_sheet.OLW + " L"}
                          </span>
                        </td>
                      )}
                    </tr>

                    <tr>
                      <td colspan="1" width="50%" style={{ textAlign: "left" }}>
                        UNDERLOAD
                        <span
                          style={{ float: "right" }}
                          id="MainContent_lblflightUnderLoad"
                        >
                          {this.state.trim_sheet.underLoadLMC} &nbsp; &nbsp;
                        </span>{" "}
                      </td>
                      <td colspan="1" width="50%">
                        {" "}
                        &nbsp;
                      </td>
                    </tr>

                    {/* <tr>
                      <td width="10px"> &nbsp;</td>
                      <td colspan="1" > <b>TOW</b></td>
                      <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_lblflightTOW">{this.state.trim_sheet.TOW}</span> </td>
                      {this.state.lim2 == false &&<td colspan="3" style={{textAlign:"left"}}>MAX <span id="MainContent_lblflightTOWmax">{this.state.trim_sheet.MTOW}</span></td>}
                      {this.state.lim2 == true &&<td colspan="3" style={{textAlign:"left"}}>MAX <span id="MainContent_lblflightTOWmax">{this.state.trim_sheet.MTOW+" L"}</span></td>}
                      <td width="10px"> &nbsp;</td>
                    </tr>
                    <tr>
                      <td width="10px"> &nbsp;</td>
                      <td colspan="1">TRIP</td>
                      <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_lblflightTOW">{this.state.trim_sheet.TRIP_FUEL}</span> </td>
                      <td colspan="3"> &nbsp;</td>
                      <td width="10px"> &nbsp;</td>
                    </tr>
                    <tr>
                      <td width="10px"> &nbsp;</td>
                      <td colspan="1" > <b>LAW </b></td>
                      <td colspan="2" style={{textAlign:"right"}} ><span id="MainContent_lblflightLW">{this.state.trim_sheet.FOB - this.state.trim_sheet.TRIP_FUEL}</span> </td>
                      {this.state.lim3 == false &&<td colspan="3" style={{textAlign:"left"}}>MAX <span id="MainContent_lblflightLAWmax">{this.state.trim_sheet.OLW}</span> </td>}
                      {this.state.lim3 == true &&<td colspan="3" style={{textAlign:"left"}}>MAX <span id="MainContent_lblflightLAWmax">{this.state.trim_sheet.OLW+" L"}</span> </td>}
                      <td width="10px"> &nbsp;</td>
                    </tr>

                    <tr>
                      <td width="10px"> &nbsp;</td>
                      <td colspan="1"> UNDERLOAD</td>
                      <td colspan="2" style={{textAlign:"right"}} ><span id="MainContent_lblflightUnderLoad">{this.state.trim_sheet.underLoadLMC}</span> </td>
                      <td colspan="3"> &nbsp;</td>
                      <td width="10px"> &nbsp;</td>
                    </tr>

                    <tr>
                      <td width="10px"> &nbsp;</td>
                      <td colspan="6" ><b>DOI &nbsp;</b><span id="MainContent_lblflightDOI">{this.state.trim_sheet.OEW_Index}</span> </td>
                      <td width="10px"> &nbsp;</td>
                    </tr> */}
                  </tbody>
                </table>
              )}
              {this.state.trim_sheet != null && (
                <table
                  id="MainContent_Table3"
                  className={classes.trimsheet_papper1}
                  bgcolor="white"
                  cellpadding="2"
                  cellspacing="2"
                  border="0"
                  width="100%"
                  style={{ color: "#000" }}
                >
                  <tbody>
                    <tr>
                      <td colspan="1" width="30%" style={{ textAlign: "left" }}>
                        <b>DOI</b>
                        <span
                          style={{ float: "right" }}
                          id="MainContent_lblflightDOI"
                        >
                          {this.fixedNumber(this.state.trim_sheet.OEW_Index)}
                        </span>{" "}
                      </td>
                      <td
                        colspan="1"
                        width="40%"
                        style={{ textAlign: "left" }}
                      ></td>
                      <td
                        colspan="1"
                        width="30%"
                        style={{ textAlign: "left" }}
                      ></td>
                    </tr>
                    {/* <tr>
                      <td width="10px"> &nbsp;</td>
                      <td colspan="1" > <b>LIZFW </b></td>
                      <td colspan="1"><span id="MainContent_lblflightLIZFWindex" style={{fontWeight: "normal"}}>{this.state.trim_sheet.ZFWindex }</span>
                      </td>
                      <td colspan="1"><b>LITOW </b></td>
                      <td colspan="1"><span id="MainContent_lblflightTOWindex" style={{fontWeight: "normal"}}>{this.state.trim_sheet.TOWindex}</span>
                      </td>
                      <td colspan="1" style={{textAlign:"right"}}><b>LILW </b></td>
                      <td colspan="1"><span id="MainContent_lblflightLWindex" style={{fontWeight: "normal"}}>{this.state.trim_sheet.LWindex}</span></td>
                      <td width="10px"> &nbsp;</td>
                    </tr> */}
                  </tbody>
                </table>
              )}

              {this.state.trim_sheet != null && (
                <table
                  id="MainContent_Table3"
                  className={classes.trimsheet_papper1}
                  bgcolor="white"
                  cellpadding="2"
                  cellspacing="2"
                  border="0"
                  width="100%"
                  style={{ color: "#000" }}
                >
                  <tbody>
                    <tr>
                      <td colspan="1" width="30%" style={{ textAlign: "left" }}>
                        <b>LIZFW</b>
                        <span
                          style={{ float: "right" }}
                          id="MainContent_lblflightLIZFWindex"
                        >
                          {this.fixedNumber(this.state.trim_sheet.ZFWindex)}
                        </span>{" "}
                      </td>
                      <td colspan="1" width="40%" style={{ textAlign: "left" }}>
                        <b>LITOW</b>
                        <span
                          style={{ float: "right" }}
                          id="MainContent_lblflightTOWindex"
                        >
                          {this.fixedNumber(this.state.trim_sheet.TOWindex)}
                        </span>{" "}
                      </td>
                      <td colspan="1" width="30%" style={{ textAlign: "left" }}>
                        <b>LILW</b>
                        <span
                          style={{ float: "right" }}
                          id="MainContent_lblflightLWindex"
                        >
                          {this.fixedNumber(this.state.trim_sheet.LWindex)}
                        </span>{" "}
                      </td>
                    </tr>
                    {/* <tr>
                      <td width="10px"> &nbsp;</td>
                      <td colspan="1" > <b>LIZFW </b></td>
                      <td colspan="1"><span id="MainContent_lblflightLIZFWindex" style={{fontWeight: "normal"}}>{this.state.trim_sheet.ZFWindex }</span>
                      </td>
                      <td colspan="1"><b>LITOW </b></td>
                      <td colspan="1"><span id="MainContent_lblflightTOWindex" style={{fontWeight: "normal"}}>{this.state.trim_sheet.TOWindex}</span>
                      </td>
                      <td colspan="1" style={{textAlign:"right"}}><b>LILW </b></td>
                      <td colspan="1"><span id="MainContent_lblflightLWindex" style={{fontWeight: "normal"}}>{this.state.trim_sheet.LWindex}</span></td>
                      <td width="10px"> &nbsp;</td>
                    </tr> */}
                  </tbody>
                </table>
              )}
              {this.state.trim_sheet != null && (
                <table
                  id="MainContent_Table3"
                  className={classes.trimsheet_papper1}
                  bgcolor="white"
                  cellpadding="2"
                  cellspacing="2"
                  border="0"
                  width="100%"
                  style={{ color: "#000" }}
                >
                  <tbody>
                    <tr>
                      <td colspan="1" width="30%" style={{ textAlign: "left" }}>
                        <b>ZFMAC</b>
                        <span
                          style={{ float: "right" }}
                          id="MainContent_lblflightZFMAC"
                        >
                          {this.fixedNumber(this.state.trim_sheet.ZFWMAC)}
                        </span>{" "}
                      </td>
                      <td colspan="1" width="40%" style={{ textAlign: "left" }}>
                        <b>TOWMAC</b>
                        <span
                          style={{ float: "right" }}
                          id="MainContent_lblflightTOWMAC"
                        >
                          {this.fixedNumber(this.state.trim_sheet.TOWMAC)}
                        </span>{" "}
                      </td>
                      <td colspan="1" width="30%" style={{ textAlign: "left" }}>
                        <b>LWMAC</b>
                        <span
                          style={{ float: "right" }}
                          id="MainContent_lblflightLWMAC"
                        >
                          {this.fixedNumber(this.state.trim_sheet.LWMAC)}
                        </span>{" "}
                      </td>
                    </tr>
                    {/* <tr>
                      <td width="10px">&nbsp;</td>
                      <td colspan="1"><b>ZFMAC</b></td>
                      <td colspan="1"><span id="MainContent_lblflightZFMAC" style={{fontWeight: "normal"}}>{this.state.trim_sheet.ZFWMAC }</span></td>
                      <td colspan="1"><b>TOWMAC</b></td>
                      <td colspan="1"><span id="MainContent_lblflightTOWMAC" style={{fontWeight: "normal"}}>{this.state.trim_sheet.TOWMAC}</span></td>
                      <td colspan="1"><b>LWMAC</b></td>
                      <td colspan="1"><span id="MainContent_lblflightLWMAC" style={{fontWeight: "normal"}}>{this.state.trim_sheet.LWMAC}</span></td>
                    </tr> */}
                  </tbody>
                </table>
              )}
              {this.state.trim_sheet != null && (
                <table
                  id="MainContent_Table3"
                  className={classes.trimsheet_papper1}
                  align="center"
                  bgcolor="white"
                  cellpadding="2"
                  cellspacing="2"
                  border="0"
                  width="100%"
                  style={{ color: "#000" }}
                >
                  <tbody>
                    {/* thrust 1 */}
                    {this.state.trim_sheet.Acft_Type !== "Q400" &&
                      this.state.trust !== 0 && (
                        <tr>
                          <td colspan="1" width="30%">
                            <span
                              id="MainContent_lblThrust1"
                              style={{ fontWeight: "normal" }}
                            >
                              <b>
                                THRUST {this.formatThrust(this.state.thrust)}
                              </b>
                            </span>
                          </td>
                          <td
                            colspan="2"
                            width="40%"
                            style={{ textAlign: "left" }}
                          >
                            <span
                              id="MainContent_lblT1flap1"
                              style={{ fontWeight: "normal" }}
                            >
                              <b>FLAP {this.state.flap}</b>
                            </span>
                          </td>
                          <td colspan="1" width="30%">
                            <span
                              id="MainContent_lblT1stab1"
                              style={{ fontWeight: "normal" }}
                            >
                              <b>STAB</b> {this.fixed1Number(this.state.stab)}
                            </span>
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              )}
              {this.state.trim_sheet != null && (
                <table
                  id="MainContent_Table3"
                  className={classes.trimsheet_papper1}
                  align="center"
                  bgcolor="white"
                  cellpadding="2"
                  cellspacing="2"
                  border="0"
                  width="100%"
                  style={{ color: "#000" }}
                >
                  <tbody>
                    {/* compartment */}
                    <tr>
                      <td colspan="2" width="40%" style={{ textAlign: "left" }}>
                        <b>LOAD IN CPTS</b>
                      </td>
                      {this.state.Maxcargo >= 1 && (
                        <td
                          colspan="1"
                          width="15%"
                          style={{ textAlign: "left" }}
                        >
                          <span id="MainContent_lblflightcmpt1">
                            <b>1/</b>
                            {this.state.trim_sheet.cmpt1}
                          </span>{" "}
                        </td>
                      )}
                      {this.state.Maxcargo >= 2 && (
                        <td
                          colspan="1"
                          width="15%"
                          style={{ textAlign: "left" }}
                        >
                          <span id="MainContent_lblflightcmpt2">
                            <b>2/</b>
                            {this.state.trim_sheet.cmpt2}
                          </span>{" "}
                        </td>
                      )}
                      {this.state.Maxcargo >= 3 && (
                        <td
                          colspan="1"
                          width="15%"
                          style={{ textAlign: "left" }}
                        >
                          <span id="MainContent_lblflightcmpt3">
                            <b>3/</b>
                            {this.state.trim_sheet.cmpt3}
                          </span>{" "}
                        </td>
                      )}
                      {this.state.Maxcargo >= 4 && (
                        <td
                          colspan="1"
                          width="15%"
                          style={{ textAlign: "left" }}
                        >
                          <span id="MainContent_lblflightcmpt4">
                            <b>4/</b>
                            {this.state.trim_sheet.cmpt4}
                          </span>{" "}
                        </td>
                      )}
                    </tr>
                    {/* <tr>
                      <td width="10px"> &nbsp;</td>
                      <td colspan="2" width="120px;"><b>LOAD IN CPTS</b></td>
                      {this.state.Maxcargo >= 1 && <td colspan="1"><span id="MainContent_lblflightcmpt1"><b>1/</b>{this.state.trim_sheet.cmpt1 }</span> </td>}
                      {this.state.Maxcargo >= 2 && <td colspan="1"><span id="MainContent_lblflightcmpt2"><b>2/</b>{this.state.trim_sheet.cmpt2}</span> </td>}
                      {this.state.Maxcargo >= 3 && <td colspan="1"><span id="MainContent_lblflightcmpt3"><b>3/</b>{this.state.trim_sheet.cmpt3}</span> </td>}
                      {this.state.Maxcargo >= 4 && <td colspan="1"><span id="MainContent_lblflightcmpt4"><b>4/</b>{this.state.trim_sheet.cmpt4}</span> </td>}
                      <td width="10px"> &nbsp;</td>
                    </tr> */}

                    {/* ZONE */}
                  </tbody>
                </table>
              )}
              {this.state.trim_sheet != null && (
                <table
                  id="MainContent_Table3"
                  className={classes.trimsheet_papper1}
                  align="center"
                  bgcolor="white"
                  cellpadding="2"
                  cellspacing="2"
                  border="0"
                  width="100%"
                  style={{ color: "#000" }}
                >
                  <tbody>
                    <tr>
                      {this.state.Maxpax >= 1 && (
                        <td
                          colspan="1"
                          width="33.33%"
                          style={{ textAlign: "left" }}
                        >
                          <b>ZONE1 &nbsp;</b>
                          <span id="MainContent_lblflightzone1">
                            {this.state.trim_sheet.C1Adult +
                              this.state.trim_sheet.C1Child +
                              this.state.trim_sheet.AdjustStrv2.split("$")[13]}
                          </span>{" "}
                        </td>
                      )}
                      {this.state.Maxpax >= 2 && (
                        <td
                          colspan="1"
                          width="33.33%"
                          style={{ textAlign: "left" }}
                        >
                          <b>ZONE2 &nbsp;</b>
                          <span id="MainContent_lblflightzone2">
                            {this.state.trim_sheet.C2Adult +
                              this.state.trim_sheet.C2Child +
                              this.state.trim_sheet.AdjustStrv2.split("$")[14]}
                          </span>{" "}
                        </td>
                      )}
                      {this.state.Maxpax >= 3 && (
                        <td
                          colspan="1"
                          width="33.33%"
                          style={{ textAlign: "left" }}
                        >
                          <b>ZONE3 &nbsp;</b>
                          <span id="MainContent_lblflightzone3">
                            {this.state.trim_sheet.C3Adult +
                              this.state.trim_sheet.C3Child +
                              this.state.trim_sheet.AdjustStrv2.split("$")[15]}
                          </span>{" "}
                        </td>
                      )}
                    </tr>
                    {this.state.Maxpax >= 4 && (
                      <tr>
                        {this.state.Maxpax >= 4 && (
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "left" }}
                          >
                            <b>ZONE4 &nbsp;</b>
                            <span id="MainContent_lblflightzone4">
                              {this.state.trim_sheet.C4Adult +
                                this.state.trim_sheet.C4Child}
                            </span>{" "}
                          </td>
                        )}
                        {this.state.Maxpax >= 5 && (
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "left" }}
                          >
                            <b>ZONE5 &nbsp;</b>
                            <span id="MainContent_lblflightzone5">
                              {this.state.trim_sheet.C5Adult +
                                this.state.trim_sheet.C5Child}
                            </span>{" "}
                          </td>
                        )}
                        {this.state.Maxpax >= 6 && (
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "left" }}
                          >
                            <b>ZONE6 &nbsp;</b>
                            <span id="MainContent_lblflightzone6">
                              {this.state.trim_sheet.C6Adult +
                                this.state.trim_sheet.C6Child}
                            </span>{" "}
                          </td>
                        )}
                      </tr>
                    )}
                    {this.state.Maxpax <= 8 && this.state.Maxpax >= 7 && (
                      <tr>
                        {this.state.Maxpax >= 7 && (
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "left" }}
                          >
                            <b>ZONE7 &nbsp;</b>
                            <span id="MainContent_lblflightzone7">
                              {this.state.trim_sheet.C7Adult +
                                this.state.trim_sheet.C7Child}
                            </span>{" "}
                          </td>
                        )}
                        {this.state.Maxpax >= 8 && (
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "left" }}
                          >
                            <b>ZONE8 &nbsp;</b>
                            <span id="MainContent_lblflightzone8">
                              {this.state.trim_sheet.C8Adult +
                                this.state.trim_sheet.C8Child}
                            </span>{" "}
                          </td>
                        )}
                      </tr>
                    )}
                    {/* <tr >
                      <td >&nbsp;</td>
                      {this.state.Maxpax >= 1 && <td><b>ZONE1  &nbsp; </b><span id="MainContent_lblflightcmpt1">{this.state.trim_sheet.C1Adult + this.state.trim_sheet.C1Child }</span> </td>}
                      {this.state.Maxpax >= 2 && <td><b>ZONE2  &nbsp; </b><span id="MainContent_lblflightcmpt2">{this.state.trim_sheet.C2Adult + this.state.trim_sheet.C2Child }</span> </td>}
                      {this.state.Maxpax >= 3 && <td><b>ZONE3  &nbsp; </b><span id="MainContent_lblflightcmpt3">{this.state.trim_sheet.C3Adult + this.state.trim_sheet.C3Child }</span> </td>}
                    </tr> */}

                    {/* {this.state.Maxpax >=4 && <tr >
                      <td >&nbsp;</td>
                      {this.state.Maxpax >= 4 && <td><b>ZONE4  &nbsp; </b><span id="MainContent_lblflightcmpt1">{this.state.trim_sheet.C4Adult + this.state.trim_sheet.C4Child }</span> </td>}
                      {this.state.Maxpax >= 5 && <td><b>ZONE5  &nbsp; </b><span id="MainContent_lblflightcmpt2">{this.state.trim_sheet.C5Adult + this.state.trim_sheet.C5Child }</span> </td>}
                      {this.state.Maxpax >= 6 && <td><b>ZONE6  &nbsp; </b><span id="MainContent_lblflightcmpt3">{this.state.trim_sheet.C6Adult + this.state.trim_sheet.C6Child }</span> </td>}
                    </tr>} */}

                    {/* {this.state.Maxpax <= 8 && this.state.Maxpax >=7 && <tr >
                      <td >&nbsp;</td>
                      {this.state.Maxpax >= 7 && <td><b>ZONE7  &nbsp; </b><span id="MainContent_lblflightcmpt1">{this.state.trim_sheet.C7Adult + this.state.trim_sheet.C7Child }</span> </td>}
                      {this.state.Maxpax >= 8 && <td><b>ZONE8  &nbsp; </b><span id="MainContent_lblflightcmpt2">{this.state.trim_sheet.C8Adult + this.state.trim_sheet.C8Child }</span> </td>}
                    </tr>} */}

                    {/* pax*/}
                  </tbody>
                </table>
              )}
              {this.state.trim_sheet != null && (
                <table
                  id="MainContent_Table3"
                  className={classes.trimsheet_papper1}
                  align="center"
                  bgcolor="white"
                  cellpadding="2"
                  cellspacing="2"
                  border="0"
                  width="100%"
                  style={{ color: "#000" }}
                >
                  <tbody>
                    <tr>
                      <td
                        colspan="1"
                        width="33.33%"
                        style={{ textAlign: "left" }}
                      >
                        <b>PAX &nbsp;</b>
                        <span id="MainContent_lblflightpax">
                          {this.state.totalAdult}
                        </span>
                        /
                        <span id="MainContent_lblflightChild">
                          {this.state.totalChild}
                        </span>
                        /
                        <span id="MainContent_lblflightInfant">
                          {this.state.totalInfant}
                        </span>{" "}
                      </td>
                      <td
                        colspan="1"
                        width="33.33%"
                        style={{ textAlign: "left" }}
                      >
                        <b>TTL &nbsp;</b>
                        <span id="MainContent_lblflightTTL">
                          {this.state.totalAdult +
                            this.state.totalChild +
                            this.state.totalInfant}
                        </span>{" "}
                      </td>
                      <td
                        colspan="1"
                        width="33.33%"
                        style={{ textAlign: "left" }}
                      >
                        <b>POB &nbsp;</b>
                        <span id="MainContent_lblflightSOB">
                          {this.state.totalAdult +
                            this.state.totalChild +
                            this.state.totalInfant +
                            this.state.crew}
                        </span>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="6" width="100%">
                        <b>SI :&nbsp;</b> {this.state.trim_sheet.specialStr}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colspan="6"
                        width="100%"
                        style={{ textAlign: "center" }}
                      >
                        <b>LAST MINUTE CHANGES &nbsp;</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
              {this.state.trim_sheet != null && (
                <table
                  id="MainContent_Table3"
                  className={classes.trimsheet_papper1}
                  align="center"
                  bgcolor="white"
                  cellpadding="2"
                  cellspacing="2"
                  border="0"
                  width="100%"
                  style={{ color: "#000" }}
                >
                  <tbody>
                    <tr>
                      <td colspan="1" width="24%">
                        <b>DEST</b>
                      </td>
                      <td colspan="1" width="24%">
                        <b>SPEC</b>{" "}
                      </td>
                      <td colspan="1" width="24%">
                        <b>CL/CPT</b>
                      </td>
                      <td colspan="2" width="28%">
                        <b>+/- WEIGHT</b>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="6" width="100%">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td colspan="6" width="100%">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td colspan="6" width="100%">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td colspan="6" width="100%">
                        <b>ALL WEIGHTS IN KILOGRAM</b>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="6" width="100%">
                        <b>PREPARED BY&nbsp;</b>
                        {this.state.trim_sheet.Trim_Officer}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
              {this.state.trim_sheet != null && (
                <table
                  id="MainContent_Table3"
                  className={classes.trimsheet_papper1}
                  align="center"
                  bgcolor="white"
                  cellpadding="2"
                  cellspacing="2"
                  border="0"
                  width="100%"
                  style={{ color: "#000" }}
                >
                  <tbody>
                    <tr>
                      <td colspan="1" width="33.33%">
                        <span
                          id="MainContent_lblLTLoginId"
                          style={{ fontWeight: "normal" }}
                        >
                          {this.state.trim_sheet.LTLoginId}
                        </span>
                      </td>
                      <td
                        colspan="1"
                        width="33.33%"
                        style={{ textAlign: "center" }}
                      >
                        <span
                          id="MainContent_lblTrimGenTimeUTC"
                          style={{ fontWeight: "normal" }}
                        >
                          {this.formatDate(
                            this.state.trim_sheet.TrimGenTimeUTC
                          )}
                        </span>
                      </td>
                      <td
                        colspan="1"
                        width="33.33%"
                        style={{ textAlign: "right" }}
                      >
                        <span
                          id="MainContent_lblTrimGenTimeUTC"
                          style={{ fontWeight: "normal" }}
                        >
                          {this.formatTime(
                            this.state.trim_sheet.TrimGenTimeUTC
                          ) + " UTC"}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td colspan="6" width="100%">
                        {" "}
                        I CERTIFY THAT THIS AIRCRAFT HAS BEEN LOADED IN
                        ACCORDANCE WITH THE AFM
                        <span id="MainContent_lblflightPreparedby"></span>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="6">&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              )}
              {this.state.trim_sheet != null && (
                <table
                  id="MainContent_Table3"
                  className={classes.trimsheet_papper2}
                  align="center"
                  bgcolor="white"
                  cellpadding="2"
                  cellspacing="2"
                  border="0"
                  width="100%"
                  style={{ color: "#000" }}
                >
                  <tbody>
                    <tr>
                      <td
                        colspan="1"
                        width="50%"
                        style={{ textAlign: "center" }}
                      >
                        <b>LOAD OFFICER&nbsp;</b>
                      </td>
                      <td
                        colspan="1"
                        width="50%"
                        style={{ textAlign: "center" }}
                      >
                        <b>CAPTAIN / ATPL No.</b>
                      </td>
                    </tr>
                    <tr>
                      <td
                        colspan="1"
                        width="50%"
                        style={{ textAlign: "center" }}
                      >
                        <span id="MainContent_lblflightLoadOfficier">
                          {" "}
                          {this.state.trim_sheet.Load_Officer}
                        </span>
                      </td>
                      <td
                        colspan="1"
                        width="50%"
                        style={{ textAlign: "center" }}
                      >
                        <span id="MainContent_lblflightCaptain">
                          {" "}
                          {this.state.trim_sheet.CAPTAIN}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="6" width="100%">
                        {" "}
                        AUTOMATED LOAD & TRIM SHEET APPROVED BY DELHI
                        <span id="MainContent_lblflightPreparedby"></span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="6" width="100%">
                        {" "}
                        DAW VIDE LETTER NO:SJ/L&T/1167{" "}
                        <span id="MainContent_lblflightPreparedby"></span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="6" width="100%">
                        Dated 06/01/2020
                        <span id="MainContent_lblflightPreparedby"></span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="6" width="100%">
                        END<span id="MainContent_lblflightPreparedby"></span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
              {this.state.trim_sheet != null && (
                <React.Fragment>
                  <Fab
                    disabled={this.state.is_printing}
                    variant="extended"
                    className={classes.printIcon}
                    onClick={() => {
                      this.setState({ is_printing: true });
                      printtrimSheet(
                        this.state.trim_sheet,
                        this.state.thrust,
                        this.state.flap,
                        this.state.stab
                      ).then(() => {
                        this.setState({ is_printing: false });
                      });
                    }}
                  >
                    <PrintIcon className={classes.extendedIcon} />
                    {this.state.is_printing ? "Printing" : "Print"}
                  </Fab>
                  <Fab
                    variant="extended"
                    className={classes.lmcDisabled}
                    onClick={() => {
                      this.setState({ trim_sheet: null }, function () {
                        this.props.onLmc();

                        this.props.history.push(
                          "/app/fims_trim/lmc/" +
                            this.props.match.params.flight_no +
                            "/" +
                            this.props.match.params.flight_date +
                            "/" +
                            Acft_Regn
                        );
                      });
                    }}
                    disabled={true}
                  >
                    LMC
                  </Fab>
                </React.Fragment>
              )}
            </div>
          )}
      </div>
    );
  }
}
const styles = (theme) => {
  return createStyles({
    trim_container: {
      width: "92%",
      margin: "0 auto",
    },
    formField: {
      marginBottom: "15px",
    },
    dropdown: {
      width: "100%",
      background: "transparent",
      color: theme.palette.primary.main,
      outline: "none",
      height: "40px",
      textAlign: "left",
    },
    trimsheet: {
      background: "#ffff",
      border: "solid 1px " + theme.palette.common,
    },
    error: {
      color: theme.palette.common,
      textAlign: "center",
    },
    typo: {
      color: theme.palette.background.default,
      textAlign: "center",
    },
    trimsheet_papper1: {
      background: "#fff",
      border: "solid 1px " + theme.palette.common,
    },
    trimsheet_papper2: {
      background: "#fff",
      border: "solid 1px " + theme.palette.common,
      marginBottom: "60px",
    },
    printIcon: {
      position: "fixed",
      bottom: theme.spacing(4),
      left: "10px",
      // margin : "0 auto",
      width: "40%",
    },
    lmcIcon: {
      position: "fixed",
      bottom: theme.spacing(4),
      right: "10px",
      // margin : "0 auto",
      width: "40%",
    },
    gridItem: {
      paddingRight: "10px",
      "&:last-child": {
        paddingRight: 0,
      },
    },
    extendedIcon: {
      marginRight: theme.spacing(2),
    },
    // zoneRow:{
    //   display:'grid',
    //   gridTemplateColumns:' 10px auto auto auto',
    //   background:"#ffff",
    //   color:theme.palette.background.default
    // },
    "grid-container": {
      display: "grid",
      gridTemplateColumns: " 10px auto auto auto",
    },
    lmcDisabled: {
      position: "fixed",
      bottom: theme.spacing(4),
      right: "10px",
      // margin : "0 auto",
      width: "40%",
      backgroundColor: "#e0e0e0 !important",
      color: "#0000007a !important",
    },
  });
};
export default connect(
  (store) => {
    return {
      sync: store.sync,
    };
  },
  {
    setPage: setPage,
    setPageAction: setAction,
  }
)(compose(withRouter, withStyles(styles))(Lmctrim));
