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
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import { setPage, setAction } from "../../../Action/pageaction";
import SelectInput from "../../common/Select/index";
import {
  fetchFleetinfoByRegnNo,
  fetchOfflineTrimSheetforFlight,
} from "../../../Action/rampaction";
import * as Enviornment from "../../../Action/environment";
import { printtrimSheetOffline } from "../../../Action/trimsheetprintaction";

import momentTZ from "moment-timezone";
import moment from "moment";




class OfflineTrimsheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      in_prog: false,
      trim_sheet: null,
      fleetinfo: null,
      thrustArray: [],
      thrust: 0,
      flapArray: [],
      CONFIG: "",
      flap: "",
      stab: 0,
      pax: {},
      cargo: {},
      error: false,
      is_printing: false,
      lim1: false,
      lim2: false,
      lim3: false,
      resSubStr: "",
      zoom: 130,
    };
    this.fetchTrimSheet = this.fetchTrimSheet.bind(this);
    this.fetchFleetInfo = this.fetchFleetInfo.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.sync.ramp_sync === false && newProps.sync.ramp_sync) {
      this.fetchTrimSheet();
    }
  }

  componentWillMount() {
    this.props.setPage("FimsTrimsheet", "FimsTrimsheet");
    this.props.setPageAction(null);
    this.fetchFleetInfo();
  }

  fetchFleetInfo() {
    var me = this;
    me.setState({ in_prog: true, error: false });
    fetchFleetinfoByRegnNo(this.props.match.params.regno)
      .then((fleetinfo) => {
        console.log(fleetinfo);
        me.setState({ in_prog: false, error: false, fleetinfo: fleetinfo });
        this.fetchTrimSheet();
      })
      .catch((err) => {
        me.setState({ in_prog: false, error: true, fleetinfo: null });
      });
  }

  

  thrustChangeHandle() {
    var me = this;
    var thrustNewArray = JSON.parse(me.state.trim_sheet.thrust);
    var stab = 0;
    for (var i = 0; i < thrustNewArray.length; i++) {
      if (
        parseInt(thrustNewArray[i].Thrust) == parseInt(this.state.thrust) &&
        thrustNewArray[i].Flap === this.state.flap
      ) {
        stab = thrustNewArray[i].Stab;
        break;
      }
    }
    me.setState({ stab: stab });
  }

  fetchTrimSheet() {
    var me = this;
    var data = {
      flight_no: this.props.match.params.flight_no,
      source: this.props.match.params.source,
      destination: this.props.match.params.destination,
      regno: this.props.match.params.regno,
    };
    me.setState({ in_prog: true, error: false });
    fetchOfflineTrimSheetforFlight(data)
      .then((trim) => {
        console.log(trim);

        var LIM1 = parseInt(trim.mzfw + parseInt(trim.take_of_fuel));
        var LIM2 = parseInt(trim.otow);
        var LIM3 = parseInt(trim.olw + parseInt(trim.trip_fuel));

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

        var pax = JSON.parse(trim.pax);
        var thrustnew = JSON.parse(trim.thrust);
        console.log(thrustnew);
        var thrustArray = [];
        var flapArray = [];
        var regSubStr = trim.regno.substr(0, 5);
        console.log("split regSubStr 1", regSubStr);
        if (trim.ac_type !== "Q400" && regSubStr !== "VT-MX") {
          thrustnew.forEach((t) => {
            if (thrustArray.indexOf(t.Thrust) === -1) {
              thrustArray.push(t.Thrust);
            }
            if (flapArray.indexOf(t.Flap) === -1) {
              flapArray.push(t.Flap);
            }
          });
          console.log("thrustArray...");
          console.log(thrustArray);
          console.log(flapArray);
          var flap = thrustnew[0].Flap;
          var thrust = parseInt(thrustnew[0].Thrust);
          var stab = thrustnew[0].Stab;
        }
        console.log("..Pax.....");
        console.log(pax);
        var newPax = {};
        for (var i = 0; i < this.state.fleetinfo.MaxCabin; i++) {
          var newPaxarray = pax[i].split("/");
          newPax[i] = parseInt(newPaxarray[0]) + parseInt(newPaxarray[1]);
        }
        var alpha = trim.config.match(/[a-zA-Z]/g).join("");
        var digit = trim.config.match(/\d/g).join("");
        var finalConfig = digit + alpha;

        var cargo = JSON.parse(trim.cargo);
        me.setState({
          thrustArray: thrustArray,
          CONFIG: finalConfig,
          flapArray: flapArray,
          thrust: thrust,
          flap: flap,
          stab: stab,
          in_prog: false,
          error: false,
          trim_sheet: trim,
          pax: newPax,
          cargo: cargo,
          resSubStr: regSubStr,
        });
      })
      .catch((err) => {
        me.setState({ in_prog: false, error: true, trim_sheet: null });
      });
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
    var value = Number(number);
    var res = String(number).split(".");
    if (res.length === 1 || res[1].length >= 1) {
      value = value.toFixed(2);
    }
    return value;
  }

  fixed1Number(number) {
    var value = Number(number);
    var res = String(number).split(".");
    if (res.length === 1 || res[1].length >= 1) {
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
  handleZoom(type) {
    var me = this;
    console.log("type", type);
    if (type === "zoomOut") {
      if (me.state.zoom > 50) {
        me.state.zoom = parseInt(me.state.zoom - 10);
        this.setState({ zoom: me.state.zoom });
      }
    } else {
      if (me.state.zoom < 200) {
        me.state.zoom = parseInt(me.state.zoom + 10);
        this.setState({ zoom: me.state.zoom });
      }
    }
  }
  
  render() {
    var classes = this.props.classes;
    console.log("state", this.state);
    var theme = window.localStorage.getItem("app_theme");

    console.log(
      this.state.in_prog,
      this.props.sync.ramp_sync,
      this.state.error
    );

    console.log("...this.state.thrustArray");
    console.log(this.state.thrustArray);
    console.log("....this.state.flapArray");
    console.log(this.state.flapArray);
    const zoomTypo = `${
      theme === "dark" ? classes.zoomTypoDark : classes.zoomTypoLight
    }`;
    const plusIcon = `${
      theme === "dark" ? classes.plusIconDark : classes.plusIconLight
    }`;
    const minusIcon = `${
      theme === "dark" ? classes.minusIconDark : classes.minusIconLight
    }`;
    return (
      <div id="trimsheetDisplay">
        <div
          className={classes.trim_container}
          style={{ zoom: this.state.zoom + "%" }}
        >
          {this.state.trim_sheet != null &&
            this.state.trim_sheet.ac_type !== "Q400" &&
            this.state.resSubStr !== "VT-MX" && (
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
                        {this.state.thrustArray.map((t) => {
                          return (
                            <MenuItem value={parseInt(t)}>
                              {parseInt(t)}
                            </MenuItem>
                          );
                        })}
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
                        {this.state.flapArray.map((f) => {
                          return <MenuItem value={f}>{f}</MenuItem>;
                        })}
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
          {this.state.in_prog === false &&
            this.props.sync.ramp_sync === false &&
            this.state.error && (
              <div className={classes.error}>
                <Typography variant={"h6"} className={classes.typo}>
                  Error Occurred
                </Typography>
                <Button variant={"contained"} color={"primary"} fullWidth>
                  Refresh
                </Button>
              </div>
            )}
          {this.state.in_prog === false &&
            this.props.sync.ramp_sync === false &&
            this.state.error === false && (
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
                            {this.state.trim_sheet.flight_no}/
                            {this.formatDateGetDay(
                              this.state.trim_sheet.flight_date
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
                              this.state.trim_sheet.trim_gen_time
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
                              this.state.trim_sheet.trim_gen_time
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
                            ED-M0{this.state.trim_sheet.edition_no}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="1" width="25%">
                          <span
                            id="MainContent_lblflightFrom"
                            style={{ letterSpacing: "0.0em" }}
                          >
                            {this.state.trim_sheet.source +
                              "-" +
                              this.state.trim_sheet.destination}
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
                            style={{
                              fontWeight: "normal",
                              textAlign: "center",
                            }}
                          >
                            {this.state.trim_sheet.ac_type +
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
                            {this.state.trim_sheet.regno}
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
                            {this.state.trim_sheet.crew}
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
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          COMP WT{" "}
                          <span
                            style={{ float: "right" }}
                            id="MainContent_totalLoad"
                          >
                            {this.state.trim_sheet.COMPWT} &nbsp; &nbsp;
                          </span>
                        </td>
                        {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
                        <td colspan="1" width="50%">
                          &nbsp;{" "}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          CAB BG WT{" "}
                          <span
                            style={{ float: "right" }}
                            id="MainContent_totalLoad"
                          >
                            {this.state.trim_sheet.CABBGWT} &nbsp; &nbsp;
                          </span>
                        </td>
                        {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
                        <td colspan="1" width="50%">
                          &nbsp;{" "}
                        </td>
                      </tr>

                      <tr>
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          PAX WT{" "}
                          <span
                            style={{ float: "right" }}
                            id="MainContent_totalLoad"
                          >
                            {this.state.trim_sheet.PAXWT} &nbsp; &nbsp;
                          </span>
                        </td>
                        {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
                        <td colspan="1" width="50%">
                          &nbsp;{" "}
                        </td>
                      </tr>

                      <tr>
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          TTL LOAD{" "}
                          <span
                            style={{ float: "right" }}
                            id="MainContent_totalLoad"
                          >
                            {this.state.trim_sheet.total_load} &nbsp; &nbsp;
                          </span>
                        </td>
                        {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
                        <td colspan="1" width="50%">
                          &nbsp;{" "}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          DOW{" "}
                          <span
                            style={{ float: "right" }}
                            id="MainContent_lblflightDOW"
                          >
                            {this.state.trim_sheet.dow} &nbsp; &nbsp;
                          </span>{" "}
                        </td>
                        {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_lblflightDOW">{this.state.trim_sheet.OEW}</span> </td> */}
                        <td colspan="1" width="50%">
                          {" "}
                          &nbsp;
                        </td>
                      </tr>
                      <tr>
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          <b>ZFW</b>{" "}
                          <span
                            style={{ float: "right" }}
                            id="MainContent_lblflightZFW"
                          >
                            {this.state.trim_sheet.zfw} &nbsp; &nbsp;
                          </span>
                        </td>
                        {this.state.lim1 === false && (
                          <td
                            colspan="1"
                            width="50%"
                            style={{ textAlign: "left" }}
                          >
                            &nbsp; &nbsp; MAX{" "}
                            <span id="MainContent_lblflightZFWmax">
                              {" "}
                              &nbsp;{this.state.trim_sheet.mzfw}
                            </span>
                          </td>
                        )}
                        {this.state.lim1 === true && (
                          <td
                            colspan="1"
                            width="50%"
                            style={{ textAlign: "left" }}
                          >
                            &nbsp; &nbsp; MAX{" "}
                            <span id="MainContent_lblflightZFWmax">
                              {" "}
                              &nbsp;{this.state.trim_sheet.mzfw + " L"}
                            </span>
                          </td>
                        )}
                      </tr>
                      <tr>
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          TOF
                          <span
                            style={{ float: "right" }}
                            id="MainContent_lblflightTOF"
                          >
                            {this.state.trim_sheet.take_of_fuel} &nbsp; &nbsp;
                          </span>{" "}
                        </td>
                        <td colspan="1" width="50%">
                          {" "}
                          &nbsp;
                        </td>
                      </tr>

                      <tr>
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          <b>TOW</b>{" "}
                          <span
                            style={{ float: "right" }}
                            id="MainContent_lblflightTOW"
                          >
                            {this.state.trim_sheet.tow} &nbsp; &nbsp;
                          </span>
                        </td>
                        {this.state.lim2 === false && (
                          <td
                            colspan="1"
                            width="50%"
                            style={{ textAlign: "left" }}
                          >
                            &nbsp; &nbsp; MAX{" "}
                            <span id="MainContent_lblflightTOWmax">
                              {" "}
                              &nbsp; {this.state.trim_sheet.otow}
                            </span>
                          </td>
                        )}
                        {this.state.lim2 === true && (
                          <td
                            colspan="1"
                            width="50%"
                            style={{ textAlign: "left" }}
                          >
                            &nbsp; &nbsp; MAX{" "}
                            <span id="MainContent_lblflightTOWmax">
                              {" "}
                              &nbsp; {this.state.trim_sheet.otow + " L"}
                            </span>
                          </td>
                        )}
                      </tr>

                      <tr>
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          TRIP
                          <span
                            style={{ float: "right" }}
                            id="MainContent_lblflightTrip"
                          >
                            {this.state.trim_sheet.trip_fuel} &nbsp; &nbsp;
                          </span>{" "}
                        </td>
                        <td colspan="1" width="50%">
                          {" "}
                          &nbsp;
                        </td>
                      </tr>

                      <tr>
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          <b>LAW</b>{" "}
                          <span
                            style={{ float: "right" }}
                            id="MainContent_lblflightLW"
                          >
                            {this.state.trim_sheet.law} &nbsp; &nbsp;
                          </span>
                        </td>
                        {this.state.lim3 === false && (
                          <td
                            colspan="1"
                            width="50%"
                            style={{ textAlign: "left" }}
                          >
                            &nbsp; &nbsp; MAX{" "}
                            <span id="MainContent_lblflightLAWmax">
                              {" "}
                              &nbsp;{this.state.trim_sheet.olw}
                            </span>
                          </td>
                        )}
                        {this.state.lim3 === true && (
                          <td
                            colspan="1"
                            width="50%"
                            style={{ textAlign: "left" }}
                          >
                            &nbsp; &nbsp; MAX{" "}
                            <span id="MainContent_lblflightLAWmax">
                              {" "}
                              &nbsp;{this.state.trim_sheet.olw + " L"}
                            </span>
                          </td>
                        )}
                      </tr>

                      <tr>
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          UNDERLOAD
                          <span
                            style={{ float: "right" }}
                            id="MainContent_lblflightUnderLoad"
                          >
                            {this.state.trim_sheet.underload} &nbsp; &nbsp;
                          </span>{" "}
                        </td>
                        <td colspan="1" width="50%">
                          {" "}
                          &nbsp;
                        </td>
                      </tr>

                      {/* <tr>
                      <td colspan="1" width="50%" style={{textAlign:"left"}}><b>DOI</b>  &nbsp;
                        <span  id="MainContent_lblflightDOI" >{ this.fixedNumber(this.state.trim_sheet.doi)} &nbsp; &nbsp;</span> </td>
                      <td colspan="1" width="50%"> &nbsp;</td>
                    </tr> */}
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
                        <td
                          colspan="1"
                          width="25%"
                          style={{ textAlign: "left" }}
                        >
                          <b>DOI</b>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <span id="MainContent_lblflightDOI">
                            {this.fixedNumber(this.state.trim_sheet.doi)}
                          </span>{" "}
                        </td>
                        <td
                          colspan="1"
                          width="25%"
                          style={{ textAlign: "left" }}
                        ></td>
                      </tr>
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
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          <b>LIZFW</b> &nbsp; &nbsp;&nbsp;
                          <span id="MainContent_lblflightLIZFWindex">
                            {this.fixedNumber(this.state.trim_sheet.lizfw)}
                          </span>{" "}
                        </td>
                        {/* <td colspan="1" width="50%" style={{ textAlign: "left" }}><b>ZFMAC</b>&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span  id="MainContent_lblflightZFMAC" >{this.fixedNumber(this.state.trim_sheet.zfmac)}</span> </td> */}
                      </tr>

                      <tr>
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          <b>LITOW</b> &nbsp; &nbsp;
                          <span id="MainContent_lblflightTOWindex">
                            {this.fixedNumber(this.state.trim_sheet.litow)}
                          </span>{" "}
                        </td>
                        {/* <td colspan="1" width="50%" style={{ textAlign: "left" }}><b>TOWMAC</b>&nbsp; &nbsp;
                    <span  id="MainContent_lblflightTOWMAC" >{this.fixedNumber(this.state.trim_sheet.towmac)}</span> </td> */}
                      </tr>

                      <tr>
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "left" }}
                        >
                          <b>LILW</b> &nbsp; &nbsp; &nbsp;&nbsp;
                          <span id="MainContent_lblflightLWindex">
                            {this.fixedNumber(this.state.trim_sheet.lilw)}
                          </span>{" "}
                        </td>
                        {/* <td colspan="1" width="50%" style={{ textAlign: "left" }}><b>LWMAC</b>&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;
                    <span  id="MainContent_lblflightLWMAC" >{this.fixedNumber(this.state.trim_sheet.lwmac)}</span> </td> */}
                      </tr>

                      {/* <tr>
                      <td colspan="1" width="30%" style={{textAlign:"left"}}><b>LIZFW</b>
                        <span style={{float:'right'}} id="MainContent_lblflightLIZFWindex" >{this.fixedNumber(this.state.trim_sheet.lizfw)}</span> </td>
                      <td colspan="1" width="40%" style={{textAlign:"left"}}><b>LITOW</b>
                        <span style={{float:'right'}} id="MainContent_lblflightTOWindex" >{this.fixedNumber(this.state.trim_sheet.litow)}</span> </td>
                      <td colspan="1" width="30%" style={{textAlign:"left"}}><b>LILW</b>
                        <span style={{float:'right'}} id="MainContent_lblflightLWindex" >{this.fixedNumber(this.state.trim_sheet.lilw)}</span> </td>
                    </tr> */}
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
                      {/* </tbody>
                </table>} */}
                      {/* {this.state.trim_sheet != null && 
                <table id="MainContent_Table3" className={classes.trimsheet_papper1}  bgcolor="white" cellpadding="2" cellspacing="2" border="0" width="100%" style={{color:"#000"}}>
                  <tbody>
                    <tr>
                      <td colspan="1" width="30%" style={{textAlign:"left"}}><b>ZFMAC</b>
                        <span style={{float:'right'}} id="MainContent_lblflightZFMAC" >{this.fixedNumber(this.state.trim_sheet.zfmac)}</span> </td>
                      <td colspan="1" width="40%" style={{textAlign:"left"}}><b>TOWMAC</b>
                        <span style={{float:'right'}} id="MainContent_lblflightTOWMAC" >{this.fixedNumber(this.state.trim_sheet.towmac)}</span> </td>
                      <td colspan="1" width="30%" style={{textAlign:"left"}}><b>LWMAC</b>
                        <span style={{float:'right'}} id="MainContent_lblflightLWMAC" >{this.fixedNumber(this.state.trim_sheet.lwmac)}</span> </td>
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
                  <React.Fragment>
                    <br />
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
                            style={{ textAlign: "center" }}
                          >
                            <b>FWD LMT</b>
                          </td>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            <b>ZFWMAC</b>
                          </td>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            <b>AFT LMT</b>
                          </td>
                        </tr>
                        <tr>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            {this.fixedNumber(this.state.trim_sheet.ZFWMACFWD)}
                          </td>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            {this.fixedNumber(this.state.trim_sheet.zfmac)}
                          </td>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            {this.fixedNumber(this.state.trim_sheet.ZFWMACAFT)}
                          </td>
                        </tr>

                        <tr>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            <b>FWD LMT</b>
                          </td>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            <b>TOWMAC</b>
                          </td>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            <b>AFT LMT</b>
                          </td>
                        </tr>
                        <tr>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            {this.fixedNumber(this.state.trim_sheet.TOWMACFWD)}
                          </td>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            {this.fixedNumber(this.state.trim_sheet.towmac)}
                          </td>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            {this.fixedNumber(this.state.trim_sheet.TOWMACAFT)}
                          </td>
                        </tr>

                        <tr>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            <b>FWD LMT</b>
                          </td>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            <b>LWTMAC</b>
                          </td>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            <b>AFT LMT</b>
                          </td>
                        </tr>
                        <tr>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            {this.fixedNumber(this.state.trim_sheet.LWMACFWD)}
                          </td>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            {this.fixedNumber(this.state.trim_sheet.lwmac)}
                          </td>
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "center" }}
                          >
                            {this.fixedNumber(this.state.trim_sheet.LWMACAFT)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                  </React.Fragment>
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
                      {this.state.trim_sheet.ac_type !== "Q400" &&
                        this.state.trust !== 0 &&
                        this.state.resSubStr !== "VT-MX" && (
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
                        <td
                          colspan="2"
                          width="40%"
                          style={{ textAlign: "left" }}
                        >
                          <b>LOAD IN CPTS</b>
                        </td>
                        {this.state.fleetinfo.MaxCompartment >= 1 && (
                          <td
                            colspan="1"
                            width="15%"
                            style={{ textAlign: "left" }}
                          >
                            <span id="MainContent_lblflightcmpt1">
                              <b>1/</b>
                              {this.state.cargo[0]}
                            </span>{" "}
                          </td>
                        )}
                        {this.state.fleetinfo.MaxCompartment >= 2 && (
                          <td
                            colspan="1"
                            width="15%"
                            style={{ textAlign: "left" }}
                          >
                            <span id="MainContent_lblflightcmpt2">
                              <b>2/</b>
                              {this.state.cargo[1]}
                            </span>{" "}
                          </td>
                        )}
                        {this.state.fleetinfo.MaxCompartment >= 3 && (
                          <td
                            colspan="1"
                            width="15%"
                            style={{ textAlign: "left" }}
                          >
                            <span id="MainContent_lblflightcmpt3">
                              <b>3/</b>
                              {this.state.cargo[2]}
                            </span>{" "}
                          </td>
                        )}
                        {this.state.fleetinfo.MaxCompartment >= 4 && (
                          <td
                            colspan="1"
                            width="15%"
                            style={{ textAlign: "left" }}
                          >
                            <span id="MainContent_lblflightcmpt4">
                              <b>4/</b>
                              {this.state.cargo[3]}
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
                        {this.state.fleetinfo.MaxCabin >= 1 && (
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "left" }}
                          >
                            <b>ZONE1 &nbsp;</b>
                            <span id="MainContent_lblflightzone1">
                              {this.state.pax[0]}
                            </span>{" "}
                          </td>
                        )}
                        {this.state.fleetinfo.MaxCabin >= 2 && (
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "left" }}
                          >
                            <b>ZONE2 &nbsp;</b>
                            <span id="MainContent_lblflightzone2">
                              {this.state.pax[1]}
                            </span>{" "}
                          </td>
                        )}
                        {this.state.fleetinfo.MaxCabin >= 3 && (
                          <td
                            colspan="1"
                            width="33.33%"
                            style={{ textAlign: "left" }}
                          >
                            <b>ZONE3 &nbsp;</b>
                            <span id="MainContent_lblflightzone3">
                              {this.state.pax[2]}
                            </span>{" "}
                          </td>
                        )}
                      </tr>
                      {this.state.fleetinfo.MaxCabin >= 4 && (
                        <tr>
                          {this.state.fleetinfo.MaxCabin >= 4 && (
                            <td
                              colspan="1"
                              width="33.33%"
                              style={{ textAlign: "left" }}
                            >
                              <b>ZONE4 &nbsp;</b>
                              <span id="MainContent_lblflightzone4">
                                {this.state.pax[3]}
                              </span>{" "}
                            </td>
                          )}
                          {this.state.fleetinfo.MaxCabin >= 5 && (
                            <td
                              colspan="1"
                              width="33.33%"
                              style={{ textAlign: "left" }}
                            >
                              <b>ZONE5 &nbsp;</b>
                              <span id="MainContent_lblflightzone5">
                                {this.state.pax[4]}
                              </span>{" "}
                            </td>
                          )}
                          {this.state.fleetinfo.MaxCabin >= 6 && (
                            <td
                              colspan="1"
                              width="33.33%"
                              style={{ textAlign: "left" }}
                            >
                              <b>ZONE6 &nbsp;</b>
                              <span id="MainContent_lblflightzone6">
                                {this.state.pax[5]}
                              </span>{" "}
                            </td>
                          )}
                        </tr>
                      )}
                      {this.state.fleetinfo.MaxCabin <= 8 &&
                        this.state.fleetinfo.MaxCabin >= 7 && (
                          <tr>
                            {this.state.fleetinfo.MaxCabin >= 7 && (
                              <td
                                colspan="1"
                                width="33.33%"
                                style={{ textAlign: "left" }}
                              >
                                <b>ZONE7 &nbsp;</b>
                                <span id="MainContent_lblflightzone7">
                                  {this.state.pax[6]}
                                </span>{" "}
                              </td>
                            )}
                            {this.state.fleetinfo.MaxCabin >= 8 && (
                              <td
                                colspan="1"
                                width="33.33%"
                                style={{ textAlign: "left" }}
                              >
                                <b>ZONE8 &nbsp;</b>
                                <span id="MainContent_lblflightzone8">
                                  {this.state.pax[7]}
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
                            {this.state.trim_sheet.adult}
                          </span>
                          /
                          <span id="MainContent_lblflightChild">
                            {this.state.trim_sheet.child}
                          </span>
                          /
                          <span id="MainContent_lblflightInfant">
                            {this.state.trim_sheet.infant}
                          </span>{" "}
                        </td>
                        <td
                          colspan="1"
                          width="33.33%"
                          style={{ textAlign: "left" }}
                        >
                          <b>TTL &nbsp;</b>
                          <span id="MainContent_lblflightTTL">
                            {this.state.trim_sheet.ttl}
                          </span>{" "}
                        </td>
                        <td
                          colspan="1"
                          width="33.33%"
                          style={{ textAlign: "left" }}
                        >
                          <b>POB &nbsp;</b>
                          <span id="MainContent_lblflightSOB">
                            {this.state.trim_sheet.sob}
                          </span>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="6" width="100%">
                          <b>SI :&nbsp;</b> {this.state.trim_sheet.si}
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
                            {this.state.trim_sheet.loginId}
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
                              this.state.trim_sheet.trim_gen_time
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
                              this.state.trim_sheet.trim_gen_time
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
                            {this.state.trim_sheet.load_officer}
                          </span>
                        </td>
                        <td
                          colspan="1"
                          width="50%"
                          style={{ textAlign: "center" }}
                        >
                          <span id="MainContent_lblflightCaptain">
                            {" "}
                            {this.state.trim_sheet.captain}
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
                        printtrimSheetOffline(
                          this.state.trim_sheet,
                          this.state.fleetinfo,
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
                  </React.Fragment>
                )}
              </div>
            )}
        </div>
        {this.state.trim_sheet !== null && (
          <div>
            <Fab
              className={plusIcon}
              onClick={() => {
                this.handleZoom("zoomIn");
              }}
            >
              <ZoomInIcon />
            </Fab>
            <Fab
              className={minusIcon}
              onClick={() => {
                this.handleZoom("zoomOut");
              }}
            >
              <ZoomOutIcon />
            </Fab>
            <Typography variant={"h6"} className={zoomTypo}>
              {this.state.zoom + "%"}
            </Typography>
          </div>
        )}
      </div>
    );
  }
}
const styles = (theme) => {
  const { breakpoints } = theme;
  return createStyles({
    trim_container: {
      width: "92%",
      margin: "0 auto",
      [breakpoints.up("sm")]: {
        width: "380px",
        margin: "0 auto",
      },
      [breakpoints.up("md")]: {
        width: "380px",
        margin: "0 auto",
      },
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
      color: theme.palette.common,
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
      left: 0,
      right: 0,
      margin: "auto",
      width: "40%",
      // [breakpoints.up("sm")]:{
      //   left: "23%",
      //   width: "23%",
      // },
      // [breakpoints.up("md")]:{
      //   width: "16%",
      //   left: "32%",
      // },
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
    "grid-container": {
      display: "grid",
      gridTemplateColumns: " 10px auto auto auto",
    },
    plusIconDark: {
      position: "fixed",
      bottom: "auto",
      top: "52px",
      right: "25px",
      [breakpoints.down("sm")]: {
        display: "none",
      },
    },
    plusIconLight: {
      position: "fixed",
      bottom: "auto",
      top: "52px",
      right: "25px",
      color: "#ffffff",
      backgroundColor: "#003042",
      [breakpoints.down("sm")]: {
        display: "none",
      },
    },
    minusIconDark: {
      position: "fixed",
      bottom: "auto",
      top: "115px",
      right: "25px",
      [breakpoints.down("sm")]: {
        display: "none",
      },
    },
    minusIconLight: {
      position: "fixed",
      bottom: "auto",
      top: "115px",
      right: "25px",
      color: "#ffffff",
      backgroundColor: "#003042",
      [breakpoints.down("sm")]: {
        display: "none",
      },
    },
    zoomTypoDark: {
      color: "#ffffff",
      textAlign: "center",
      position: "fixed",
      bottom: "auto",
      top: "170px",
      right: "25px",
      [breakpoints.down("sm")]: {
        display: "none",
      },
    },
    zoomTypoLight: {
      color: "#2b3144",
      textAlign: "center",
      position: "fixed",
      bottom: "auto",
      top: "170px",
      right: "25px",
      [breakpoints.down("sm")]: {
        display: "none",
      },
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
)(compose(withRouter, withStyles(styles))(OfflineTrimsheet));
