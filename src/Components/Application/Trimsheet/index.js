import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { compose } from "recompose";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Typography,
  MenuItem,
  Select,
  FormControl,
  Button,
  Grid,
} from "@material-ui/core";
import { setPage, setAction } from "../../../Action/pageaction";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { OfflineCalculateLMC } from "../../../Action/LMCaction";
import CssTextField from "../../common/Textfield/index";
import SelectInput from "../../common/Select/index";
import SelectInputFlight from "../../common/Select/flightSelect";
import { fetchACRegInFleetInfo } from "../../../Action/rampaction";
import Error from "../FIMS/Error";
import "./style.scss";
import FlightBack from "../../../images/FlightBack.png";
import FlightFront from "../../../images/FlightFront.png";
import { fetchFleetinfoByRegnNo } from "../../../Action/rampaction";
// import {fetchOfflineTrimSheetforFlight} from "../../../Action/fimsTrimsheetaction"
import PaxModel from "../../common/Pax/index";
import RecallModel from "../../common/Recall/index";
// momentTZ.tz.setDefault('UTC');
// class UTCUtils extends DateFnsUtils {
//   format(value, formatString) {
//   return momentTZ(value)
//     .utc()
//     .format(formatString);
//   }
// }

class Trimsheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      message: "",
      fleetinfo: null,
      pax1: 0,
      pax2: 0,
      pax3: 0,
      tob: 0,
      pob: 0,
      cargo1: 0,
      cargo2: 0,
      cargo3: 0,
      cargo4: 0,
      trip_fuel_in: 0,
      olw: 0,
      otow: 0,
      mtow: 0,
      rtow: 0,
      mlw: 0,
      mzfw: 0,
      acm: 0,
      take_of_fuel_in: 0,
      cabin_baggage: 0,
      Aftrcab: 0,
      Midcab: 0,
      Fwdcab: 0,
      Aftrjump: 0,
      Midjump: 0,
      Fwdjump: 0,
      Aftrgalley: 0,
      Fwdgalley: 0,
      cockpit: 0,
      cockpitnew: 0,
      crew: 0,
      crew_count: 0,
      flight_no: "SG",
      flight_date: new Date(),
      source: "",
      destination: "",
      regno: "",
      ac_type: "",
      captain: "",
      trim_officer: "",
      load_officer: "",
      si: "",
      AC_REGN: [],
      maxCabinArray: [],
      maxCompartmentArray: [],

      pax: {},
      cargo: {},
      pax1_error: "",
      pax2_error: "",
      pax3_error: "",
      cargo1_error: "",
      cargo2_error: "",
      cargo3_error: "",
      cargo4_error: "",
      trip_fuel_in_error: "",
      olw_error: "",
      otow_error: "",
      rtow_error: "",
      acm_error: "",
      take_of_fuel_in_error: "",
      cabin_baggage_error: "",
      Aftrcab_error: "",
      Midcab_error: "",
      Fwdcab_error: "",
      Aftrjump_error: "",
      Midjump_error: "",
      Fwdjump_error: "",
      Aftrgalley_error: "",
      Fwdgalley_error: "",
      cockpit_error: "",
      crew_error: "",
      flight_no_error: "",
      regno_error: "",
      source_error: "",
      destination_error: "",
      captain_error: "",
      trim_officer_error: "",
      load_error: "",
      si_error: "",
      etadate_error: "",
      // 'etddate':new Date(),
      // 'etadate':new Date(),
      cabin_crew: 0,
      paxOpen: false,
      currentPax: null,
      recallOpen: false,
    };
    this.submitLmc = this.submitLmc.bind(this);
    this.fetchArcft = this.fetchArcft.bind(this);
    this.fetchMaxCabCamp = this.fetchMaxCabCamp.bind(this);
    this.handlepax = this.handlepax.bind(this);
    this.handlecago = this.handlecago.bind(this);
    this.inputOnChange = this.inputOnChange.bind(this);
  }
  componentDidMount() {
    console.log("offline component did mount");
    this.props.setPage("TrimsheetLMC", "OfflineTrimsheet");
    this.props.setPageAction(null);
    this.fetchArcft();
  }

  handlepax(item, value) {
    var me = this;
    console.log("item value", item, value);
    if (me.state.pax[parseInt(item)] === undefined) {
      me.state.pax[parseInt(item)] = "0/0/0/0";
    }
    me.state.pax[parseInt(item)] = value;

    me.setState({ pax: me.state.pax }, () => {
      var count = 0;
      var countAcm = 0;
      Object.values(this.state.pax).forEach((item) => {
        console.log(item);
        var itemsArray = item.split("/");
        count = count + parseInt(itemsArray[0]) + parseInt(itemsArray[1]);
        countAcm = countAcm + parseInt(itemsArray[3]);
      });
      console.log("countAcm value", countAcm);
      me.setState({ tob: count });
      me.setState({ acm: countAcm });
    });
  }
  handlecago(item, value) {
    var me = this;
    console.log("item value", item, value);
    if (me.state.cargo[parseInt(item)] === undefined) {
      me.state.cargo[parseInt(item)] = 0;
    }
    me.state.cargo[parseInt(item)] = value;
    me.setState({ cargo: me.state.cargo });
  }

  inputOnChange() {
    console.log("Changed...");
    var rtow1 = parseInt(
      parseInt(this.state.olw) + parseInt(this.state.trip_fuel_in)
    );
    var rtow2 = parseInt(
      parseInt(this.state.mzfw) + parseInt(this.state.take_of_fuel_in)
    );
    var rtow3 = parseInt(this.state.otow);

    if (rtow1 < rtow2 && rtow1 < rtow3) {
      this.setState({ rtow: rtow1 });
    }
    if (rtow2 < rtow1 && rtow2 < rtow3) {
      this.setState({ rtow: rtow2 });
    }
    if (rtow3 < rtow1 && rtow3 < rtow2) {
      this.setState({ rtow: rtow3 });
    }
    console.log(rtow1, "....RTOW1");
    console.log(rtow2, "....RTOW2");
    console.log(rtow3, "....RTOW3");
  }

  fetchMaxCabCamp(regNo) {
    fetchFleetinfoByRegnNo(regNo)
      .then((res) => {
        console.log(res);
        var pax = {};
        var cargo = {};
        for (var i = 0; i < res.MaxCabin; i++) {
          pax[i] = "0/0/0/0";
        }
        for (var i = 0; i < res.MaxCompartment; i++) {
          cargo[i] = "0";
        }
        console.log(res.STDCREW);
        var stdCrewArray = res.STDCREW.match(/\d+/g);
        console.log(stdCrewArray);
        var cockpit = parseInt(stdCrewArray[0]);
        var fwdcab = parseInt(stdCrewArray[1]);
        var midcab = parseInt(stdCrewArray[2]);
        var aftcab = parseInt(stdCrewArray[3]);
        var crewcount = cockpit + fwdcab + midcab + aftcab;
        var cabin_crew = fwdcab + midcab + aftcab;
        this.setState(
          {
            cockpit: cockpit,
            cabin_crew: cabin_crew,
            fleetinfo: res,
            crew_count: crewcount,
            crew: cabin_crew,
            Fwdcab: fwdcab,
            Midcab: midcab,
            Aftrcab: aftcab,
            cargo: cargo,
            mzfw: res.MZFW,
            pax: pax,
            ac_type: res.AC_TYPE,
            mlw: res.MLW,
            olw: res.MLW,
            mtow: res.MTOW,
            otow: res.MTOW,
          },
          () => {
            var rtow1 = parseInt(
              parseInt(this.state.olw) + parseInt(this.state.trip_fuel_in)
            );
            var rtow2 = parseInt(
              parseInt(this.state.mzfw) + parseInt(this.state.take_of_fuel_in)
            );
            var rtow3 = parseInt(this.state.otow);

            if (rtow1 < rtow2 && rtow1 < rtow3) {
              this.setState({ rtow: rtow1 });
            }
            if (rtow2 < rtow1 && rtow2 < rtow3) {
              this.setState({ rtow: rtow2 });
            }
            if (rtow3 < rtow1 && rtow3 < rtow2) {
              this.setState({ rtow: rtow3 });
            }
            console.log(rtow1, "....RTOW1");
            console.log(rtow2, "....RTOW2");
            console.log(rtow3, "....RTOW3");
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  fetchArcft() {
    fetchACRegInFleetInfo()
      .then((res) => {
        console.log("result", res);
        var temp_array = [];
        res.forEach((i) => {
          var res = i.AC_REGN.substr(0, 2);
          if (res !== "OK") {
            temp_array.push({
              AC_REGN: i.AC_REGN,
              AC_TYPE: i.AC_TYPE,
            });
          }
        });
        this.setState({ AC_REGN: temp_array });
        console.log("res", res);
      })
      .catch((er) => {
        console.log(er);
      });
  }
  submitLmc() {
    console.log(".....");
    this.setState({
      flight_date_error: "",
      pax1_error: "",
      pax2_error: "",
      pax3_error: "",
      cargo1_error: "",
      cargo2_error: "",
      cargo3_error: "",
      cargo4_error: "",
      trip_fuel_in_error: "",
      olw_error: "",
      otow_error: "",
      rtow_error: "",
      acm_error: "",
      take_of_fuel_in_error: "",
      Aftrcab_error: "",
      Midcab_error: "",
      Fwdcab_error: "",
      Aftrjump_error: "",
      Midjump_error: "",
      Fwdjump_error: "",
      Aftrgalley_error: "",
      Fwdgalley_error: "",
      cockpit_error: "",
      crew_error: "",
      flight_no_error: "",
      source_error: "",
      destination_error: "",
      captain_error: "",
      trim_officer_error: "",
      load_officer_error: "",
      cabin_baggage_error: "",
      etadate_error: "",
      regno_error: "",
    });

    var flight_date = this.state.flight_date;
    if (flight_date === null || flight_date === undefined) {
      this.setState({ flight_date_error: "Please enter flight date" });
      return;
    }

    var flight_no = this.state.flight_no;
    var subflight_no = flight_no.trim().substring(0, 2).toUpperCase();
    var subflight_noInt = flight_no.trim().substring(2, 11).toUpperCase();
    console.log(subflight_no);
    console.log(subflight_noInt);
    if (subflight_no !== "SG") {
      this.setState({
        flight_no_error: "Flight no should always start with SG",
      });
      return;
    }
    var number1 = /^[A-Za-z0-9]+$/;
    if (!number1.test(subflight_noInt)) {
      this.setState({ flight_no_error: "Flight no should number After SG" });
      return;
    }
    console.log("flight_no.trim().length", flight_no.trim().length);
    if (
      flight_no === null ||
      flight_no === undefined ||
      flight_no.trim().length > 10
    ) {
      this.setState({ flight_no_error: "Please enter valid flight no" });
      return;
    }

    var source = this.state.source;
    if (source === null || source === undefined || source.trim().length === 0) {
      this.setState({ source_error: "Please enter source" });
      return;
    }
    if (source.trim().length !== 3) {
      this.setState({
        source_error: "Please enter 3 letter iata code for source",
      });
      return;
    }

    var destination = this.state.destination;
    if (
      destination === null ||
      destination === undefined ||
      destination.trim().length === 0
    ) {
      this.setState({ source_error: "Please enter destination" });
      return;
    }
    if (destination.trim().length !== 3) {
      this.setState({
        source_error: "Please enter 3 letter iata code for destination",
      });
      return;
    }
    // var eta  = moment(this.state.etadate).toString();
    // var etd  = moment(this.state.etddate).toString();
    // if(eta <= etd){
    //   this.setState({etadate_error:"ETA should be greater than ETD"})
    //   return;
    // }

    var regno = this.state.regno;
    if (regno === null || regno === undefined || regno.trim().length === 0) {
      this.setState({ regno_error: "Please select Reg No" });
      return;
    }

    var take_of_fuel_in = parseInt(this.state.take_of_fuel_in);
    if (take_of_fuel_in === null || take_of_fuel_in === undefined) {
      this.setState({ take_of_fuel_in_error: "Please enter take of fuel" });
      return;
    }

    if (take_of_fuel_in > parseInt(this.state.fleetinfo.MAxFuel)) {
      this.setState({
        take_of_fuel_in_error:
          "Take of fuel should be less than MAxFuel(" +
          parseInt(this.state.fleetinfo.MAxFuel) +
          ")",
      });
      return;
    }

    if (
      (this.state.ac_type === "B737" ||
        this.state.ac_type === "B738" ||
        this.state.ac_type === "B739") &&
      take_of_fuel_in < 2000
    ) {
      this.setState({
        take_of_fuel_in_error:
          "Take of fuel should be grethen than 1999 for B737/B738/B739",
      });
      return;
    }

    if (this.state.ac_type === "Q400" && take_of_fuel_in < 1000) {
      this.setState({
        take_of_fuel_in_error:
          "Take of fuel should be grethen than 999 for Q400",
      });
      return;
    }

    var trip_fuel_in = parseInt(this.state.trip_fuel_in);
    if (trip_fuel_in === null || trip_fuel_in === undefined) {
      this.setState({ trip_fuel_in_error: "Please enter trip fuel" });
      return;
    }

    if (trip_fuel_in > take_of_fuel_in) {
      this.setState({
        trip_fuel_in_error: "Trip Fuel should be less then Take of fuel",
      });
      return;
    }

    if (
      (this.state.ac_type === "B737" ||
        this.state.ac_type === "B738" ||
        this.state.ac_type === "B739") &&
      trip_fuel_in < 500
    ) {
      this.setState({
        trip_fuel_in_error:
          "Trip fuel should be grethen than 499 for B737/B738/B739",
      });
      return;
    }

    if (this.state.ac_type === "Q400" && trip_fuel_in < 200) {
      this.setState({
        trip_fuel_in_error: "Trip should be grethen than 199 for Q400",
      });
      return;
    }

    var olw = this.state.olw;
    if (olw === null || olw === undefined) {
      this.setState({ olw_error: "Please enter olw" });
      return;
    }

    if (olw > parseInt(this.state.mlw)) {
      this.setState({
        olw_error: "OLW cannot be greater than MLW(maximum Landing Weight) ",
      });
      return;
    }

    if (this.state.ac_type === "Q400" && olw < 18000) {
      this.setState({ olw_error: "OLW cannot be less than 18000 for Q400" });
      return;
    }

    if (this.state.ac_type === "B737" && olw < 45000) {
      this.setState({ olw_error: "OLW cannot be less than 45000 for B737" });
      return;
    }

    if (
      (this.state.ac_type === "B738" || this.state.ac_type === "B739") &&
      olw < 50000
    ) {
      this.setState({
        olw_error: "OLW cannot be less than 50000 for B738/B739",
      });
      return;
    }

    var otow = this.state.otow;
    if (otow === null || otow === undefined) {
      this.setState({ otow_error: "Please enter otow" });
      return;
    }

    if (otow > parseInt(this.state.mtow)) {
      this.setState({
        otow_error: "OTOW cannot be greater than MLW(maximum Landing Weight) ",
      });
      return;
    }

    if (this.state.ac_type === "Q400" && otow < 18000) {
      this.setState({ otow_error: "OTOW cannot be less than 18000 for Q400" });
      return;
    }

    if (
      (this.state.ac_type === "B737" ||
        this.state.ac_type === "B738" ||
        this.state.ac_type === "B739") &&
      otow < 50000
    ) {
      this.setState({
        otow_error: "OTOW cannot be less than 50000 for B737/B738/B739",
      });
      return;
    }

    var rtow = this.state.rtow;
    if (rtow === null || rtow === undefined) {
      this.setState({ rtow_error: "Please enter rtow" });
      return;
    }

    if (rtow > parseInt(this.state.mtow)) {
      this.setState({ rtow_error: "RTOW cant be greater than MTOW." });
      return;
    }

    var pax = this.state.pax;
    var paxKeys = Object.keys(pax);
    for (var y = 0; y < paxKeys.length; y++) {
      var regex = /^[0-9]{1,3}[/][0-9]{1,3}[/][0-9]{1,3}[/][0-9]{1,3}$/;
      console.log(regex.test(pax[paxKeys[y]]));
      if (!regex.test(pax[paxKeys[y]])) {
        var count = parseInt(paxKeys[y]) + 1;
        this.setState({
          pax1_error: "Please enter correct format for pax" + count,
        });
        // break;
        return;
      }

      if (pax[paxKeys[y]] === null || pax[paxKeys[y]] === undefined) {
        var pcount = parseInt(paxKeys[y]) + 1;
        this.setState({ pax1_error: "Please enter pax" + pcount });
        // break;
        return;
      }
    }

    // for(var z=0;z<paxKeys.length;z++){

    // }
    // Object.keys(pax).forEach((x)=>{
    //   var regex  = /^[0-9]{1,3}[/][0-9]{1,3}[/][0-9]{1,3}$/;
    //   console.log(regex.test(pax[x]));
    //   if(!regex.test(pax[x])){
    //     var count = parseInt(x) + 1;
    //     this.setState({pax1_error:"Please enter correct format for pax"+count})
    //     return;
    //   }

    //   if(pax[x] == null || pax[x] == undefined || pax[x] === '0/0/0') {
    //     var count = parseInt(x) + 1;
    //     this.setState({pax1_error:"Please enter pax"+count});
    //     return;
    //   }
    // })

    var cabinLarray = this.state.fleetinfo.CabinLimits.split("$");
    console.log(cabinLarray);

    if (cabinLarray.length === Object.keys(pax).length) {
      for (let i = 0; i < cabinLarray.length; i++) {
        var pxArray = pax[i].split("/");
        console.log(pxArray);
        var total_p =
          parseInt(pxArray[0]) + parseInt(pxArray[1]) + parseInt(pxArray[3]);
        console.log(total_p);
        if (parseInt(total_p) > parseInt(cabinLarray[i])) {
          var ccount = parseInt(i) + 1;
          this.setState({
            pax1_error:
              "Limit exceed in Cabin_" +
              ccount +
              " should be <=" +
              cabinLarray[i],
          });
          // break;
          return;
        }
      }
    }

    var cargo = this.state.cargo;
    var cargoKeys = Object.keys(cargo);
    for (var z = 0; z < cargoKeys.length; z++) {
      if (cargo[cargoKeys[z]] === null || cargo[cargoKeys[z]] === undefined) {
        var cacount = parseInt(cargoKeys[z]) + 1;
        this.setState({ cargo1_error: "Please enter cargo" + cacount });
        // break;
        return;
      }
    }

    // Object.keys(cargo).forEach((x)=>{
    //   if(cargo[x] == null || cargo[x] == undefined || cargo[x] === 0) {
    //     var count = parseInt(x) + 1
    //     this.setState({cargo1_error:"Please enter cargo"+count})
    //     return;
    //   }
    // })

    var compLarray = this.state.fleetinfo.CompLimits.split("$");
    console.log(compLarray);

    if (compLarray.length === Object.keys(cargo).length) {
      for (let i = 0; i < compLarray.length; i++) {
        if (compLarray[i] === null || compLarray[i] === undefined) {
          compLarray[i] = 0;
        }
        if (parseInt(cargo[i]) > parseInt(compLarray[i])) {
          var coun = parseInt(i) + 1;
          this.setState({
            cargo1_error:
              "Limit exceed in Comp_" + coun + " should be <=" + compLarray[i],
          });
          // break;
          return;
        }
      }
    }

    var acm = this.state.acm;
    if (acm === null || acm === undefined || acm === "") {
      this.setState({ acm_error: "Please enter acm" });
      return;
    }

    var crew = this.state.crew;
    if (crew === null || crew === undefined) {
      this.setState({ crew_error: "Please enter crew" });
      return;
    }

    var officierRegx = /^[a-zA-Z0-9_\s-]+$/;

    var trim_officer = this.state.trim_officer;
    if (
      trim_officer === null ||
      trim_officer === undefined ||
      trim_officer.trim().length === 0
    ) {
      this.setState({ trim_officer_error: "Please enter trim officer name" });
      return;
    }
    if (trim_officer.trim().length > 0 && !officierRegx.test(trim_officer)) {
      this.setState({
        trim_officer_error: "Please enter valid Trim Officier name",
      });
      return;
    }

    var load_officer = this.state.load_officer;
    if (
      load_officer === null ||
      load_officer === undefined ||
      load_officer.trim().length === 0
    ) {
      this.setState({ load_officer_error: "Please enter load officer name" });
      return;
    }
    if (load_officer.trim().length > 0 && !officierRegx.test(load_officer)) {
      this.setState({
        load_officer_error: "Please enter valid Load Officier name",
      });
      return;
    }

    var captain = this.state.captain;
    if (
      captain === null ||
      captain === undefined ||
      captain.trim().length === 0
    ) {
      this.setState({ captain_error: "Please enter captain name" });
      return;
    }
    if (captain.trim().length > 0 && !officierRegx.test(captain)) {
      this.setState({ captain_error: "Please enter valid Captain name" });
      return;
    }

    // var si=this.state.si;
    // if(si === null || si ===  undefined || si.trim().length === 0){
    //     this.setState({si_error:"Please enter si name"})
    //     return;
    // }

    var cockpitnew = this.state.cockpitnew;
    if (cockpitnew === null || cockpitnew === undefined) {
      this.setState({ cockpit_error: "Please enter cockpit" });
      return;
    }

    if (this.state.ac_type === "B738" && cockpitnew > 2) {
      this.setState({ cockpit_error: "Max value is 2 for B738" });
      return;
    }

    if (
      (this.state.ac_type === "Q400" ||
        this.state.ac_type === "B737" ||
        this.state.ac_type === "B739") &&
      cockpitnew > 1
    ) {
      this.setState({ cockpit_error: "Max value is 1 for Q400/B737/B739" });
      return;
    }

    var Aftrgalley = this.state.Aftrgalley;
    if (Aftrgalley === null || Aftrgalley === undefined || Aftrgalley === "") {
      this.setState({ Aftrgalley_error: "Please enter Aftrgalley" });
      return;
    }

    if (this.state.ac_type === "Q400" && Aftrgalley > 250) {
      this.setState({
        Aftrgalley_error: "Aftrgalley shiold be Max 250 for Q400,",
      });
      return;
    }

    if (
      (this.state.ac_type === "B738" ||
        this.state.ac_type === "B737" ||
        this.state.ac_type === "B739") &&
      Aftrgalley > 350
    ) {
      this.setState({
        Aftrgalley_error: "Aftrgalley shiold be Max 350 for B737/B738/B739",
      });
      return;
    }

    var Fwdgalley = this.state.Fwdgalley;
    if (Fwdgalley === null || Fwdgalley === undefined || Fwdgalley === "") {
      this.setState({ Fwdgalley_error: "Please enter Fwdgalley" });
      return;
    }

    if (this.state.ac_type === "Q400" && Fwdgalley > 50) {
      this.setState({ Fwdgalley_error: "Fwdgalley should be Max 50 for Q400" });
      return;
    }

    if (
      (this.state.ac_type === "B738" ||
        this.state.ac_type === "B737" ||
        this.state.ac_type === "B739") &&
      Fwdgalley > 100
    ) {
      this.setState({
        Fwdgalley_error: "Fwdgalley should be Max 100 for B737/B738/B739",
      });
      return;
    }

    var cabin_baggage = this.state.cabin_baggage;
    if (
      cabin_baggage === null ||
      cabin_baggage === undefined ||
      cabin_baggage === ""
    ) {
      this.setState({ cabin_baggage_error: "Please enter cabin baggage" });
      return;
    }

    if (cabin_baggage > 500) {
      this.setState({ cabin_baggage_error: "Cabin baggage should be max 500" });
      return;
    }

    var Aftrjump = this.state.Aftrjump;
    if (Aftrjump === null || Aftrjump === undefined) {
      this.setState({ A_error: "Please enter Aftrjump" });
      return;
    }

    if (this.state.ac_type !== "Q400" && Aftrjump > 2) {
      this.setState({ cabin_baggage_error: "Aftrjump  max 2 Crew Members" });
      return;
    }

    if (Aftrjump === null || Aftrjump === undefined) {
      this.setState({ Aftrjump_error: "Please enter Aftrjump" });
      return;
    }
    var Midjump = this.state.Midjump;
    if (Midjump === null || Midjump === undefined) {
      this.setState({ Midjump_error: "Please enter Midjump" });
      return;
    }
    var Fwdjump = this.state.Fwdjump;
    if (Fwdjump === null || Fwdjump === undefined) {
      this.setState({ Fwdjump_error: "Please enter Fwdjump" });
      return;
    }

    var post = {
      flight_date: this.state.flight_date,
      flight_no: this.state.flight_no,
      source: this.state.source,
      destination: this.state.destination,
      // 'stddate':this.state.etddate,
      // 'stadate':this.state.etadate,
      regno: regno,
      ac_type: this.state.ac_type,
      trip_fuel_in: this.state.trip_fuel_in,
      take_of_fuel_in: this.state.take_of_fuel_in,
      olw: this.state.olw,
      otow: this.state.otow,
      rtow: this.state.rtow,
      pax: this.state.pax,
      acm: this.state.acm,
      Aftrcab: this.state.Aftrcab,
      Midcab: this.state.Midcab,
      Fwdcab: this.state.Fwdcab,
      crew: this.state.crew,
      trim_officer: this.state.trim_officer,
      load_officer: this.state.load_officer,
      captain: this.state.captain,
      si: this.state.si,
      cargo: this.state.cargo,
      cabin_baggage: this.state.cabin_baggage,
      mzfw: this.state.mzfw,
      Aftrjump: this.state.Aftrjump,
      Midjump: this.state.Midjump,
      Fwdjump: this.state.Fwdjump,
      Aftrgalley: this.state.Aftrgalley,
      Fwdgalley: this.state.Fwdgalley,
      cockpit: this.state.cockpit,
      cockpitnew: this.state.cockpitnew,
      tob: this.state.tob,
      pob: this.state.pob,
      fleetinfo: this.state.fleetinfo,
    };
    console.log("postData", post);

    OfflineCalculateLMC(post)
      .then((res) => {
        console.log("Trimsheet.....");
        console.log(res);
        this.props.history.push(
          "/app/offline_trim/" +
            this.state.flight_no.toUpperCase() +
            "/" +
            this.state.source.toUpperCase() +
            "/" +
            this.state.destination.toUpperCase() +
            "/" +
            this.state.regno
        );
      })
      .catch((er) => {
        console.log(er);
        this.setState({ error: true, message: er });
      });
  }
  formatTime(str) {
    if (str == null) {
      return "-";
    }
    return moment(str).format();
  }

  onChangeSD(event) {
    const regex = /^[a-zA-Z]+$/;

    console.log(this.state.source);
    if (this.state.source.trim().length > 0 && !regex.test(this.state.source)) {
      this.setState({ source_error: "Please enter valid source" });
      return;
    }

    if (
      this.state.destination.trim().length > 0 &&
      !regex.test(this.state.destination)
    ) {
      this.setState({ source_error: "Please enter valid destination" });
      return;
    }
  }
  onChangeFlightNo() {
    var flight_no = this.state.flight_no;
    var subflight_no = flight_no.trim().substring(0, 2).toUpperCase();
    var subflight_noInt = flight_no.trim().substring(2, 11).toUpperCase();
    console.log(subflight_no);
    console.log(subflight_noInt);
    if (subflight_no !== "SG") {
      this.setState({
        flight_no_error: "Flight no should always start with SG",
      });
      return;
    }
    var number1 = /^[A-Za-z0-9]+$/;
    if (!number1.test(subflight_noInt)) {
      this.setState({ flight_no_error: "Flight no should number After SG" });
      return;
    }
  }

  formatDate(str) {
    if (str == null) {
      return "-";
    }
    return moment(str).format("YYYY-MM-DD");
  }

  render() {
    var classes = this.props.classes;
    // console.log(this.formatTime(this.state.etddate))
    var me = this;
    console.log("this.state", this.state);
    var last_sync = window.localStorage.getItem("last_sync");
    last_sync = moment(last_sync).format("DD-MM-YYYY HH.mm.ss");

    console.log("last", last_sync);
    var theme = window.localStorage.getItem("app_theme");
    const formInputClass = `${
      theme === "dark" ? "form-control-dark" : "form-control-light"
    }`;
    const SIInputClass = `${theme === "dark" ? "si-dark" : "si-light"}`;
    // const flightInputNoLabelClass = `${window.localStorage.getItem("app_theme") === "dark" ? "flight-input-no-label-lmc-dark" : "flight-input-no-label-lmc-light"}`;
    // const flightInputWithLabelClass = `${window.localStorage.getItem("app_theme") === "dark" ? "flight-input-with-label-lmc-dark" : "flight-input-with-label-lmc-light"}`;
    return (
      <div className={classes.root}>
        {last_sync !== null && this.props.sync.ramp_sync === true && (
          <Typography className={classes.cellH} colSpan={8}>
            Last Sync :{last_sync}
          </Typography>
        )}
        {this.props.network.status && (
          <Typography className={classes.cellH} colSpan={8}>
            Offline Trim Sheet Cannot Be Drawn when Internet is On
          </Typography>
        )}

        {!this.props.network.status && this.props.sync.ramp_sync === true && (
          <Typography className={classes.cellH} colSpan={8}>
            Syncing...
          </Typography>
        )}

        {!this.props.network.status && this.props.sync.ramp_sync === false && (
          <div className={classes.formContainer}>
            <div className={classes.form}>
              {/* Flight Date */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  Flight Date
                </Typography>
                {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    clearable
                    className={classes.Datepicker}
                    format="yyyy-MM-dd"
                    disablePast
                    InputProps={{
                      className: classes.timeInput,
                      disableUnderline: true,
                    }}
                    value={this.formatTime(me.state.flight_date)}
                    onChange={(date) => {
                      this.setState({ flight_date: date });
                    }}
                  />
                </MuiPickersUtilsProvider> */}
                {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
  <DatePicker
    clearable
    className={classes.Datepicker}
    format="yyyy-MM-dd"
    disablePast
    InputProps={{
      className: classes.timeInput,
      disableUnderline: true,
    }}
    value={this.state.flight_date}
    onChange={(date) => {
      this.setState({ flight_date: date });
    }}
  />
</MuiPickersUtilsProvider> */}

                {this.state.flight_date_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.flight_date_error}
                  </Typography>
                )}
              </div>
              {/* Flight No */}
              <div className={classes.formField}>
                <Grid container>
                  <Grid item xs={8}>
                    <Typography className={classes.label} variant={"body1"}>
                      Flight No
                    </Typography>
                    <input
                      type="text"
                      className={formInputClass}
                      placeholder="ENTER FLIGHT NO"
                      value={this.state.flight_no}
                      maxLength="10"
                      onChange={(event) => {
                        if (event.target.value.length > 10) {
                          return;
                        }
                        this.setState(
                          {
                            flight_no: event.target.value,
                            flight_no_error: "",
                          },
                          () => {
                            this.onChangeFlightNo();
                          }
                        );
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      className={classes.recallButton}
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        this.setState({ recallOpen: true });
                      }}
                    >
                      Recall
                    </Button>
                  </Grid>
                </Grid>

                {this.state.flight_no_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.flight_no_error}
                  </Typography>
                )}
              </div>
              {/* Source and Destination */}
              <div className={classes.formField}>
                <Grid container>
                  <Grid item xs={6} className={classes.gridItem}>
                    <Typography className={classes.label} variant={"body1"}>
                      Source
                    </Typography>
                    <input
                      type="text"
                      pattern="[A-Za-z]"
                      className={formInputClass}
                      placeholder="ENTER SOURCE"
                      value={this.state.source}
                      maxLength="3"
                      onChange={(event) => {
                        if (event.target.value.length > 3) {
                          return;
                        }
                        this.setState(
                          { source: event.target.value, source_error: "" },
                          () => {
                            this.onChangeSD();
                          }
                        );
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.gridItem}>
                    <Typography className={classes.label} variant={"body1"}>
                      Destination
                    </Typography>
                    <input
                      type="text"
                      className={formInputClass}
                      placeholder="ENTER DESTINATION"
                      value={this.state.destination}
                      maxLength="3"
                      onChange={(event) => {
                        if (event.target.value.length > 3) {
                          return;
                        }
                        this.setState(
                          { destination: event.target.value, source_error: "" },
                          () => {
                            this.onChangeSD();
                          }
                        );
                      }}
                    />
                  </Grid>
                </Grid>
                {this.state.source_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.source_error}
                  </Typography>
                )}
              </div>
              {/* ETD and ETA */}
              {/* <div className={classes.formField}>
                        <Grid container>
                          <Grid item xs={6} className={classes.gridItem}>
                            <Typography className={classes.label} variant={'body1'}>ETD</Typography>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} >
                              <TimePicker
                                clearable
                                className={classes.picker}
                                ampm={false}
                                format="HH:mm"
                                InputProps={{
                                  className: classes.timeInput,
                                  disableUnderline: true,
                                }}
                                value={this.formatTime(me.state.etddate)}
                                onChange={(date)=>{
                                  this.setState({"etddate":date})
                                }}
                              />
                            </MuiPickersUtilsProvider>
                          </Grid>
                          <Grid item xs={6} className={classes.gridItem}>
                            <Typography className={classes.label} variant={'body1'}>ETA</Typography>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} >
                              <TimePicker
                                clearable
                                className={classes.picker}
                                ampm={false}
                                format="HH:mm"
                                InputProps={{
                                  className: classes.timeInput,
                                  disableUnderline: true,
                                }}
                                value={this.formatTime(this.state.etadate)}
                                onChange={(date)=>{
                                  this.setState({"etadate":date})
                                }}
                              />
                            </MuiPickersUtilsProvider>
                          </Grid>
                        </Grid>
                        {this.state.etadate_error && <Typography variant={"body2"} className={classes.error}>{this.state.etadate_error}</Typography>}
                    </div> */}
              {/* Artiftact Type */}
              <div className={classes.formField}>
                <Typography className={classes.label}>Reg No</Typography>
                <FormControl className={classes.dropdown}>
                  <Select
                    value={this.state.regno}
                    onChange={(event) => {
                      this.setState(
                        { regno: event.target.value, regno_error: "" },
                        function () {
                          this.fetchMaxCabCamp(event.target.value);
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
                    <MenuItem
                      value=""
                       disabled
                      classes={{ root: classes.disabledMenuItem }}
                    >
                      SELECT REG NO
                    </MenuItem>
                    {this.state.AC_REGN.map((item, i) => {
                      
                      return (
                        <MenuItem key={i} value={item.AC_REGN}>
                          {item.AC_REGN} - {item.AC_TYPE}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {this.state.regno_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.regno_error}
                  </Typography>
                )}
              </div>
            </div>

            {/* <Divider style={{marginTop: "5px", marginBottom: "5px"}}/> */}
            <div className={classes.form}>
              {/* Total Fuel */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  Take of Fuel (kg)
                </Typography>
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={2} className={classes.FlightFront}></Grid>
                  <Grid item xs={8}>
                    <Grid container className={classes.flightInputContainer}>
                      <Grid item xs={12}>
                        <input
                          type="number"
                          className={"flight-input-no-label"}
                          placeholder="ENTER TAKE OF FUEL"
                          // min='1'
                          // max='5'
                          maxLength="5"
                          // pattern="\d{5}"
                          value={this.state.take_of_fuel_in}
                          onChange={(event) => {
                            if (event.target.value.length > 5) {
                              return;
                            }
                            this.setState(
                              {
                                take_of_fuel_in: event.target.value,
                                take_of_fuel_in_error: "",
                              },
                              () => {
                                this.inputOnChange();
                              }
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} className={classes.FlightBack}></Grid>
                </Grid>
                {this.state.take_of_fuel_in_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.take_of_fuel_in_error}
                  </Typography>
                )}
              </div>
              {/* Fuel */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  Trip Fuel In (kg)
                </Typography>
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={2} className={classes.FlightFront}></Grid>
                  <Grid item xs={8}>
                    <Grid container className={classes.flightInputContainer}>
                      <Grid item xs={12}>
                        <input
                          type="number"
                          className={"flight-input-no-label"}
                          placeholder="ENTER TRIP FUEL IN"
                          maxLength="5"
                          value={this.state.trip_fuel_in}
                          onChange={(event) => {
                            if (event.target.value.length > 5) {
                              return;
                            }
                            this.setState(
                              {
                                trip_fuel_in: event.target.value,
                                trip_fuel_in_error: "",
                              },
                              () => {
                                this.inputOnChange();
                              }
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} className={classes.FlightBack}></Grid>
                </Grid>
                {this.state.trip_fuel_in_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.trip_fuel_in_error}
                  </Typography>
                )}
              </div>

              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  OLW
                </Typography>
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={2} className={classes.FlightFront}></Grid>
                  <Grid item xs={8}>
                    <Grid container className={classes.flightInputContainer}>
                      <Grid item xs={12}>
                        <input
                          type="number"
                          className={"flight-input-no-label"}
                          placeholder="ENTER OLW"
                          maxLength="5"
                          value={this.state.olw}
                          onChange={(event) => {
                            if (event.target.value.length > 5) {
                              return;
                            }
                            this.setState(
                              { olw: event.target.value, olw_error: "" },
                              () => {
                                this.inputOnChange();
                              }
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} className={classes.FlightBack}></Grid>
                </Grid>
                {this.state.olw_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.olw_error}
                  </Typography>
                )}
              </div>

              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  OTOW
                </Typography>
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={2} className={classes.FlightFront}></Grid>
                  <Grid item xs={8}>
                    <Grid container className={classes.flightInputContainer}>
                      <Grid item xs={12}>
                        <input
                          type="number"
                          className={"flight-input-no-label"}
                          placeholder="ENTER OTOW"
                          maxLength="5"
                          value={this.state.otow}
                          onChange={(event) => {
                            if (event.target.value.length > 5) {
                              return;
                            }
                            this.setState(
                              { otow: event.target.value, otow_error: "" },
                              () => {
                                this.inputOnChange();
                              }
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} className={classes.FlightBack}></Grid>
                </Grid>
                {this.state.otow_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.otow_error}
                  </Typography>
                )}
              </div>

              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  RTOW
                </Typography>
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={2} className={classes.FlightFront}></Grid>
                  <Grid item xs={8}>
                    <Grid container className={classes.flightInputContainer}>
                      <Grid item xs={12}>
                        <input
                          disabled
                          type="number"
                          className={"flight-input-no-label"}
                          placeholder="ENTER RTOW"
                          value={this.state.rtow}
                          onChange={(event) => {
                            this.setState({
                              rtow: event.target.value,
                              rtow_error: "",
                            });
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} className={classes.FlightBack}></Grid>
                </Grid>
                {this.state.rtow_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.rtow_error}
                  </Typography>
                )}
              </div>

              {/* Passenger */}
              <div className={classes.formField}>
                {Object.keys(this.state.pax).length > 0 && (
                  <Typography className={classes.label} variant={"body1"}>
                    Passenger
                  </Typography>
                )}
                <Grid container>
                  {Object.keys(this.state.pax).map((item, i) => {
                    return (
                      <Grid item xs={6} key={i}>
                        <CssTextField
                          id="outlined-number"
                          label={"Pax-" + (i + 1)}
                          type="text"
                          className={classes.textfield}
                          variant="outlined"
                          InputProps={{
                            className: classes.input,
                          }}
                          inputProps={{
                            dataIndex: i,
                          }}
                          value={this.state.pax[item]}
                          onClick={() => {
                            this.setState({
                              pax1_error: "",
                              currentPax: i,
                              paxOpen: true,
                            });
                          }}
                          // onChange = {(event)=>{
                          //   // console.log();
                          //   this.handlepax(event.target.getAttribute('dataindex'),event.target.value)
                          //   this.setState({'pax1_error':'','currentPax':i,'paxOpen':true});
                          // }}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
                {this.state.pax1_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.pax1_error}
                  </Typography>
                )}
              </div>
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  TOB
                </Typography>
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={2} className={classes.FlightFront}></Grid>
                  <Grid item xs={8}>
                    <Grid container className={classes.flightInputContainer}>
                      <Grid item xs={12}>
                        <input
                          disabled
                          type="number"
                          className={"flight-input-no-label"}
                          placeholder="ENTER TOB"
                          value={this.state.tob}
                          onChange={(event) => {
                            this.setState({ tob: event.target.value });
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} className={classes.FlightBack}></Grid>
                </Grid>
              </div>
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  POB
                </Typography>
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={2} className={classes.FlightFront}></Grid>
                  <Grid item xs={8}>
                    <Grid container className={classes.flightInputContainer}>
                      <Grid item xs={12}>
                        <input
                          disabled
                          type="number"
                          className={"flight-input-no-label"}
                          placeholder="ENTER POB"
                          value={this.state.pob}
                          onChange={(event) => {
                            this.setState({ pob: event.target.value });
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} className={classes.FlightBack}></Grid>
                </Grid>
              </div>
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  ACM
                </Typography>
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={2} className={classes.FlightFront}></Grid>
                  <Grid item xs={8}>
                    <Grid container className={classes.flightInputContainer}>
                      <Grid item xs={12}>
                        <input
                          type="number"
                          className={"flight-input-no-label"}
                          placeholder="ENTER ACM"
                          value={this.state.acm}
                          disabled
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} className={classes.FlightBack}></Grid>
                </Grid>
                {this.state.acm_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.acm_error}
                  </Typography>
                )}
              </div>

              {/* Cargo */}
              <div className={classes.formField}>
                {Object.keys(this.state.cargo).length > 0 && (
                  <Typography className={classes.label} variant={"body1"}>
                    Cargo
                  </Typography>
                )}
                <Grid container>
                  {Object.keys(this.state.cargo).map((item, i) => {
                    return (
                      <Grid item xs={4} key={i}>
                        <CssTextField
                          id="outlined-number"
                          label={"C-" + (i + 1)}
                          type="number"
                          className={classes.textfield}
                          variant="outlined"
                          InputProps={{
                            className: classes.input,
                          }}
                          inputProps={{
                            dataIndex: i,
                          }}
                          value={this.state.cargo[item]}
                          onChange={(event) => {
                            if (event.target.value.length > 4) {
                              return;
                            }
                            this.handlecago(
                              event.target.getAttribute("dataindex"),
                              event.target.value
                            );
                            this.setState({ cargo1_error: "" });
                          }}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
                {this.state.cargo1_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.cargo1_error}
                  </Typography>
                )}
              </div>

              {/* CREW CABIN */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  CREW CABIN
                </Typography>
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={2} className={classes.FlightFront}>
                    {/* <img src={FlightFront} /> */}
                  </Grid>
                  <Grid item xs={8}>
                    <Grid container className={classes.flightInputContainer}>
                      <Grid item xs={4} className={classes.gridItem}>
                        <Typography
                          className={classes.flightLabel}
                          variant={"body1"}
                        >
                          FWD
                        </Typography>
                        <FormControl className={classes.flightDropdown}>
                          <input
                            disabled
                            type="number"
                            className={"flight-input-with-label"}
                            placeholder="ENTER FWD CAB"
                            value={this.state.Fwdcab}
                            onChange={(event) => {
                              this.setState({
                                Fwdcab: event.target.value,
                                Fwdcab_error: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={4} className={classes.gridItem}>
                        <Typography
                          className={classes.flightLabel}
                          variant={"body1"}
                        >
                          MID
                        </Typography>
                        <FormControl className={classes.flightDropdown}>
                          <input
                            disabled
                            type="number"
                            className={"flight-input-with-label"}
                            placeholder="ENTER MID CAB"
                            value={this.state.Midcab}
                            onChange={(event) => {
                              this.setState({
                                Midcab: event.target.value,
                                Midcab_error: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={classes.gridItem}>
                        <Typography
                          className={classes.flightLabel}
                          variant={"body1"}
                        >
                          AFT
                        </Typography>
                        <FormControl className={classes.flightDropdown}>
                          <input
                            disabled
                            type="number"
                            className={"flight-input-with-label"}
                            placeholder="ENTER AFTER CAB"
                            value={this.state.Aftrcab}
                            onChange={(event) => {
                              this.setState({
                                Aftrcab: event.target.value,
                                Aftrcab_error: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} className={classes.FlightBack}></Grid>
                </Grid>
                {this.state.Aftrcab_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.Aftrcab_error}
                  </Typography>
                )}
                {this.state.Midcab_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.Midcab_error}
                  </Typography>
                )}
                {this.state.Fwdcab_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.Fwdcab_error}
                  </Typography>
                )}
              </div>
              {/* Crew. */}
              <div className={classes.formField}>
                <Typography className={classes.label}>Crew.</Typography>
                <input
                  type="text"
                  className={formInputClass}
                  value={
                    this.state.cockpitnew +
                    this.state.crew +
                    this.state.cockpit +
                    this.state.Aftrjump
                  }
                  disabled
                />
                {this.state.crew_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.crew_error}
                  </Typography>
                )}
              </div>
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  TRIM OFFICER
                </Typography>
                <input
                  type="text"
                  className={formInputClass}
                  placeholder="ENTER NAME"
                  value={this.state.trim_officer}
                  onChange={(event) => {
                    this.setState({
                      trim_officer: event.target.value,
                      trim_officer_error: "",
                    });
                  }}
                />
                {this.state.trim_officer_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.trim_officer_error}
                  </Typography>
                )}
              </div>
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  LOAD OFFICER
                </Typography>
                <input
                  type="text"
                  className={formInputClass}
                  placeholder="ENTER NAME"
                  value={this.state.load_officer}
                  onChange={(event) => {
                    this.setState({
                      load_officer: event.target.value,
                      load_officer_error: "",
                    });
                  }}
                />
                {this.state.load_officer_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.load_officer_error}
                  </Typography>
                )}
              </div>
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  CAPTAIN
                </Typography>
                <input
                  type="text"
                  className={formInputClass}
                  placeholder="ENTER NAME"
                  value={this.state.captain}
                  onChange={(event) => {
                    this.setState({
                      captain: event.target.value,
                      captain_error: "",
                    });
                  }}
                />
                {this.state.captain_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.captain_error}
                  </Typography>
                )}
              </div>
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  SI
                </Typography>
                <input
                  type="text"
                  className={SIInputClass}
                  placeholder="ENTER SI NAME"
                  value={this.state.si}
                  onChange={(event) => {
                    this.setState({ si: event.target.value, si_error: "" });
                  }}
                />
                {this.state.si_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.si_error}
                  </Typography>
                )}
              </div>

              {/* Jump */}
              {this.state.ac_type !== "Q400" && (
                <div className={classes.formField}>
                  <Typography className={classes.label} variant={"body1"}>
                    Jump
                  </Typography>
                  <Grid container className={classes.flightContainer}>
                    <Grid item xs={2} className={classes.FlightFront}>
                      {/* <img src={FlightFront} /> */}
                    </Grid>
                    <Grid item xs={8}>
                      <Grid container className={classes.flightInputContainer}>
                        <Grid item xs={12} className={classes.gridItem}>
                          <Typography
                            className={classes.flightLabel}
                            variant={"body1"}
                          >
                            AFT
                          </Typography>
                          <FormControl className={classes.flightDropdown}>
                            <Select
                              value={this.state.Aftrjump}
                              onChange={(event) => {
                                this.setState({
                                  Aftrjump: event.target.value,
                                  Aftrjump_error: "",
                                  acm:
                                    event.target.value + this.state.cockpitnew,
                                });
                              }}
                              classes={{
                                icon: classes.FlightdownIcon,
                                select: classes.selectFocus,
                              }}
                              displayEmpty
                              input={<SelectInputFlight />}
                            >
                              <MenuItem value={0}>0</MenuItem>
                              <MenuItem value={1}>1</MenuItem>
                              <MenuItem value={2}>2</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        {/* <Grid item xs={4} className={classes.gridItem}>
                              <Typography className={classes.flightLabel} variant={'body1'}>Mid</Typography>
                              <FormControl className={classes.flightDropdown}>
                                <Select
                                  value={this.state.Midjump}
                                  onChange = {(event)=>{this.setState({'Midjump':event.target.value,'Midjump_error':''})}}
                                  classes={{ 
                                    'icon': classes.FlightdownIcon,
                                    'select': classes.selectFocus,
                                  }}
                                  displayEmpty
                                  input={<SelectInputFlight />}
                                >
                                  <MenuItem value={0}>0</MenuItem>
                                  <MenuItem value={1}>1</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={4} className={classes.gridItem}>
                              <Typography className={classes.flightLabel} variant={'body1'}>Fwd</Typography>
                              <FormControl className={classes.flightDropdown}>
                                <Select
                                  value={this.state.Fwdjump}
                                  onChange = {(event)=>{this.setState({'Fwdjump':event.target.value,'Fwdjump_error':''})}}
                                  classes={{ 
                                    'icon': classes.FlightdownIcon,
                                    'select': classes.selectFocus,
                                  }}
                                  displayEmpty
                                  input={<SelectInputFlight />}
                                >
                                  <MenuItem value={0}>0</MenuItem>
                                  <MenuItem value={1}>1</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid> */}
                      </Grid>
                    </Grid>
                    <Grid item xs={2} className={classes.FlightBack}></Grid>
                  </Grid>
                  {this.state.Aftrjump_error && (
                    <Typography variant={"body2"} className={classes.error}>
                      {this.state.Aftrjump_error}
                    </Typography>
                  )}
                  {/* {this.state.Midjump_error && <Typography variant={"body2"} className={classes.error}>{this.state.Midjump_error}</Typography>}
                      {this.state.Fwdjump_error && <Typography variant={"body2"} className={classes.error}>{this.state.Fwdjump_error}</Typography>} */}
                </div>
              )}
              {/* Galley */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  Galley (Kg)
                </Typography>
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={2} className={classes.FlightFront}>
                    {/* <img src={FlightFront} /> */}
                  </Grid>
                  <Grid item xs={8}>
                    <Grid container className={classes.flightInputContainer}>
                      <Grid item xs={6} className={classes.gridItem}>
                        <Typography
                          className={classes.flightLabel}
                          variant={"body1"}
                        >
                          FWD
                        </Typography>
                        <FormControl className={classes.flightDropdown}>
                          <input
                            type="number"
                            className={"flight-input-with-label"}
                            placeholder="ENTER Fwd Gally"
                            value={this.state.Fwdgalley}
                            onChange={(event) => {
                              if (event.target.value.length > 3) {
                                return;
                              }
                              this.setState({
                                Fwdgalley: event.target.value,
                                Fwdgalley_error: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={6} className={classes.gridItem}>
                        <Typography
                          className={classes.flightLabel}
                          variant={"body1"}
                        >
                          AFT
                        </Typography>
                        <FormControl className={classes.flightDropdown}>
                          <input
                            type="number"
                            className={"flight-input-with-label"}
                            placeholder="ENTER After Gally"
                            value={this.state.Aftrgalley}
                            onChange={(event) => {
                              if (event.target.value.length > 3) {
                                return;
                              }
                              this.setState({
                                Aftrgalley: event.target.value,
                                Aftrgalley_error: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} className={classes.FlightBack}></Grid>
                </Grid>
                {this.state.Aftrgalley_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.Aftrgalley_error}
                  </Typography>
                )}
                {this.state.Fwdgalley_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.Fwdgalley_error}
                  </Typography>
                )}
              </div>
              {/* Cabin Baggage */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  CABIN BAGGAGE (kg)
                </Typography>
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={2} className={classes.FlightFront}></Grid>
                  <Grid item xs={8}>
                    <Grid container className={classes.flightInputContainer}>
                      <Grid item xs={12}>
                        <input
                          type="number"
                          className={"flight-input-no-label"}
                          placeholder="ENTER CABIN BAGGAGE"
                          value={this.state.cabin_baggage}
                          onChange={(event) => {
                            if (event.target.value.length > 3) {
                              return;
                            }
                            this.setState({
                              cabin_baggage: event.target.value,
                              cabin_baggage_error: "",
                            });
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} className={classes.FlightBack}></Grid>
                </Grid>
                {this.state.cabin_baggage_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.cabin_baggage_error}
                  </Typography>
                )}
              </div>

              {/* Cockpit occu. */}
              <div className={classes.formField}>
                <Typography className={classes.label}>Cockpit occu.</Typography>
                <FormControl className={classes.dropdown}>
                  <Select
                    value={this.state.cockpitnew}
                    onChange={(event) => {
                      this.setState({
                        cockpitnew: event.target.value,
                        cockpit_error: "",
                        acm: event.target.value + this.state.Aftrjump,
                      });
                    }}
                    classes={{
                      icon: classes.downIcon,
                      select: classes.selectFocus,
                    }}
                    displayEmpty
                    input={<SelectInput />}
                  >
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                  </Select>
                </FormControl>
                {this.state.cockpit_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.cockpit_error}
                  </Typography>
                )}
              </div>
            </div>
            <div className={classes.form}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => {
                  this.submitLmc();
                }}
              >
                Submit local
              </Button>
            </div>
          </div>
        )}
        {/* <Error
          message={this.state.message}
          open={this.state.error}
          onClose={() => {
            this.setState({ error: false });
          }}
        /> */}
        {/* <PaxModel
          open={this.state.paxOpen}
          index={this.state.currentPax}
          pax={this.state.pax}
          Fleetinfo={this.state.fleetinfo}
          onSubmit={(index, value) => {
            this.handlepax(index, value);
            this.setState({ paxOpen: false });
          }}
          onClose={() => {
            this.setState({ paxOpen: false });
          }}
        /> */}
        {/* <RecallModel
          open={this.state.recallOpen}
          onClose={() => {
            this.setState({ recallOpen: false });
          }}
          onClick={(item) => {
            fetchFleetinfoByRegnNo(item.regno).then((res) => {
              console.log("select item", item);
              var pax = JSON.parse(item.pax);
              var cargo = JSON.parse(item.cargo);
              var tobCount = 0;
              console.log("paxxxxxx", pax);
              Object.values(pax).forEach((item) => {
                console.log(item);
                var itemsArray = item.split("/");
                console.log("itemsArray", itemsArray);
                tobCount =
                  tobCount + parseInt(itemsArray[0]) + parseInt(itemsArray[1]);
              });
              var stdCrewArray = res.STDCREW.match(/\d+/g);
              console.log(stdCrewArray);
              var cockpit = parseInt(stdCrewArray[0]);
              var fwdcab = parseInt(stdCrewArray[1]);
              var midcab = parseInt(stdCrewArray[2]);
              var aftcab = parseInt(stdCrewArray[3]);
              var crewcount = cockpit + fwdcab + midcab + aftcab;
              var cabin_crew = fwdcab + midcab + aftcab;
              var cabinArray = item.AdjustStr.split("$");
              var cockpitOccup = parseInt(cabinArray[0]);
              if (isNaN(cockpitOccup)) {
                cockpitOccup = 0;
              }
              var fwdGalley = parseInt(cabinArray[1]);
              if (isNaN(fwdGalley)) {
                fwdGalley = 0;
              }
              var aftGalley = parseInt(cabinArray[10]);
              if (isNaN(aftGalley)) {
                aftGalley = 0;
              }
              var aftJump = parseInt(cabinArray[11]);
              if (isNaN(aftJump)) {
                aftJump = 0;
              }
              var pobCount = 0;
              var stdcrewPobArray = res.STDCREW.replace("P", "").split("$");
              console.log(
                "tobCount ",
                tobCount,
                " parseInt(stdCrewArray[0])  ",
                parseInt(stdCrewArray[0])
              );
              console.log(
                "this.state.paxAcmCount  ",
                this.state.paxAcmCount,
                " this.state.first_observer_final  ",
                this.state.first_observer_final
              );
              pobCount =
                tobCount +
                parseInt(stdCrewArray[0]) +
                cockpitOccup +
                fwdcab +
                midcab +
                aftcab;
              // + acmCount + firstObserver + secondObserver + superNumeraries  ;
              this.setState({
                recallOpen: false,
                flight_no: item.flight_no,
                source: item.source,
                destination: item.destination,
                regno: item.regno,
                ac_type: item.ac_type,
                take_of_fuel_in: item.take_of_fuel,
                trip_fuel_in: item.trip_fuel,
                olw: item.olw,
                otow: item.otow,
                pax: pax,
                cargo: cargo,
                tob: tobCount,
                pob: pobCount,
                trim_officer: item.trim_officer,
                load_officer: item.load_officer,
                captain: item.captain,
                si: item.si,
                fleetinfo: res,
                mzfw: res.MZFW,
                mlw: res.MLW,
                mtow: res.MTOW,
                cabin_baggage: item.CABBGWT,
                cockpit: cockpit,
                cabin_crew: cabin_crew,
                crew_count: crewcount,
                crew: cabin_crew,
                Fwdcab: fwdcab,
                Midcab: midcab,
                Aftrcab: aftcab,
                Aftrjump: aftJump,
                Fwdgalley: fwdGalley,
                Aftrgalley: aftGalley,
                cockpitnew: cockpitOccup,
              });
              this.inputOnChange();
            });
          }}
        /> */}
      </div>
    );
  }
}
const styles = (theme) => {
  const { breakpoints } = theme;
  return createStyles({
    formContainer: {
      paddingBottom: theme.spacing(20),
    },
    form: {
      width: "50%",
      margin: "auto",
      [breakpoints.down("xs")]: {
        width: "90%",
        margin: "auto",
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
    flightDropdown: {
      width: "100%",
      background: "transparent",
      color: "#2c305f",
      outline: "none",
      height: "25px",
      textAlign: "left",
    },
    gridItem: {
      paddingRight: "10px",
      "&:last-child": {
        paddingRight: 0,
      },
    },
    flightContainer: {
      minHeight: "80px",
    },
    flightInputContainer: {
      marginTop: "34px",
      padding: "1px",
      background: "#b0d0d8",
      paddingLeft: "5px",
      paddingRight: "5px",
      [breakpoints.down("xs")]: {
        marginTop: "21px",
        padding: "1px",
        background: "#b0d0d8",
        paddingLeft: "5px",
        paddingRight: "5px",
      },
      [breakpoints.between("sm", "md")]: {
        marginTop: "21px",
        padding: "1px",
        background: "#b0d0d8",
        paddingLeft: "5px",
        paddingRight: "5px",
      },
    },
    flightLabel: {
      fontSize: "11px",
      textTransform: "uppercase",
      color: "#2c305f",
    },
    FlightBack: {
      backgroundImage: `url(${FlightBack})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      [breakpoints.down("xs")]: {
        backgroundImage: `url(${FlightBack})`,
        backgroundPosition: "bottom",
        backgroundSize: "140%",
        backgroundPositionX: "right",
      },
      [breakpoints.between("sm", "md")]: {
        backgroundImage: `url(${FlightBack})`,
        backgroundPosition: "bottom",
        backgroundSize: "138%",
        backgroundPositionX: "right",
      },
      [breakpoints.up("md")]: {
        backgroundImage: `url(${FlightBack})`,
        backgroundPosition: "bottom",
        backgroundSize: "cover",
        backgroundPositionX: "right",
      },
      [breakpoints.up("lg")]: {
        backgroundImage: `url(${FlightBack})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundPositionX: "right",
      },
    },
    FlightFront: {
      backgroundImage: `url(${FlightFront})`,
      // backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundPositionX: "inherit",
      [breakpoints.down("xs")]: {
        backgroundImage: `url(${FlightFront})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundPositionX: "inherit",
      },
    },
    FlightdownIcon: {
      color: "#2c305f",
    },
    picker: {
      border: "1px solid",
      borderRadius: "4px",
    },
    Datepicker: {
      border: "1px solid",
      borderRadius: "4px",
      width: "100%",
    },
    timeInput: {
      paddingLeft: "10px",
    },
    label: {
      textTransform: "uppercase",
    },
    input: {
      textTransform: "uppercase",
    },
    // 'select': {
    //   textTransform: "uppercase",
    // },
    maindiv: {
      padding: "8px",
    },
    passenger: {
      display: "flex",
      // backgroundImage: `url(${FlightBg})`,
      // backgroundSize: "118%",
      // backgroundPosition: "center",
      // paddingLeft: "10px",
      // paddingRight: "10px",
    },
    textfield: {
      // width:"20%",
      flex: "1",
      margin: "4px",
      // background: "#2b3144bd",
      width: "95%",
    },
    formControl: {
      width: "33%",
      margin: "4px",
    },
    button: {
      width: "100%",
      marginTop: "10px",
    },
    error: {
      color: "red",
      textAlign: "right",
    },
    cellH: {
      fontWeight: "bold",
      textAlign: "center",
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      margin: "auto",
      padding: theme.spacing(2, 0),
      color: theme.palette.common,
    },

    recallButton: {
      marginTop: "26px",
      marginLeft: "5px",
    },
  });
};
export default connect(
  (store) => {
    return {
      sync: store.sync,
      network: store.network,
    };
  },
  {
    setPage: setPage,
    setPageAction: setAction,
  }
)(compose(withRouter, withStyles(styles))(Trimsheet));
