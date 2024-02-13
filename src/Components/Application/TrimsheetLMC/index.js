import React from "react";
import ReactDOM from "react-dom";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Typography,
  TextField,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Button,
  Divider,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import { setPage, setAction } from "../../../Action/pageaction";
import { fetchFimsDataByFlightNo } from "../../../Action/rampaction";
import { getLoadTypes, getSector } from "../../../Action/cargo.action";
import { CalculateLMC, fetchLtAdjustByRegnNo } from "../../../Action/LMCaction";
import CssTextField from "../../common/Textfield/index";
import SelectInput from "../../common/Select/index";
import "./styles.scss";
import Error from "../FIMS/Error";
import moment from "moment";
import {
  fetchTrimSheetforFlight,
  fetchFimsScheduleByFlightNoDate,
} from "../../../Action/fimsTrimsheetaction";
import LMCPaxModel from "../../common/LMCPax/index";
import { fetchFleetinfoByRegnNo } from "../../../Action/rampaction";
import Lmctrim from "../FimsTrimsheet/lmctrim";
import {
  syncNSLntDetail,
  syncFlightEditionNo,
  syncThrustArchive,
} from "../../../Action/sync";
import { LMCArchive } from "../../../Action/LMCupdaeaction";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  AddCircleOutlineSharp as AddIcon,
  RemoveCircleOutlineSharp as RemoveIcon,
} from "@material-ui/icons";
// import CargoBaggageModal from "./cargoBaggage";
import CargoModal from "./cargoBaggageModal";

var infant_count = 0;
var infant_Exist = false;
const acmIndexes = {
  pax1: 2,
  pax2: 3,
  pax3: 6,
  pax4: 7,
  pax5: 13,
  pax6: 14,
  pax7: 15,
  pax8: 16,
};
class TrimsheetLmc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      message: "",
      pax1: 0,
      pax2: 0,
      pax3: 0,
      cargo1: 0,
      cargo2: 0,
      cargo3: 0,
      cargo4: 0,
      fuel_in: 0,
      Aftrjump: 0,
      Midjump: 0,
      Fwdjump: 0,
      Aftrgalley: 0,
      Fwdgalley: 0,
      cockpit: 0,
      fims_data: {},
      pax1_error: "",
      pax2_error: "",
      pax3_error: "",

      cargo1_error: "",
      cargo2_error: "",
      cargo3_error: "",
      cargo4_error: "",
      fuel_in_error: "",
      Aftrjump_error: "",
      Midjump_error: "",
      Fwdjump_error: "",
      Aftrgalley_error: "",
      Fwdgalley_error: "",
      cockpit_error: "",
      trim_sheet: {},
      ac_type: "",
      mlw: 0,
      mtow: 0,
      pax: {},
      paxlmc: {},
      paxShow: {},
      paxAcm: {},
      cargo: {},
      cargo_lmc: {},
      cargo_show: {},
      cargo_final: [],
      paxOpen: false,
      currentPax: null,
      fleetinfo: {},
      take_of_fuel: 0,
      take_of_fuel_lmc: 0,
      take_of_fuel_show: 0,
      take_of_fuel_final: 0,
      trip_fuel: 0,
      trip_fuel_lmc: 0,
      trip_fuel_show: 0,
      trip_fuel_final: 0,
      olw: 0,
      olw_lmc: 0,
      olw_show: 0,
      olw_final: 0,
      otow: 0,
      otow_lmc: 0,
      otow_show: 0,
      otow_final: 0,
      rtow: 0,
      rtow_lmc: 0,
      rtow_final: 0,
      tob: 0,
      tob_lmc: 0,
      tob_final: 0,
      pob: 0,
      pob_lmc: 0,
      pob_final: 0,
      cabin_baggage: 0,
      cabin_baggage_lmc: 0,
      cabin_baggage_show: 0,
      cabin_baggage_final: 0,
      trim_officer: "",
      load_officer: "",
      captain: "",
      si: "",
      cabin_crew: 0,
      crew: 0,
      crew_lmc: 0,
      crew_final: 0,
      cockpitnew: 0,
      cockpit: 0,
      Aftrjump: 0,
      fwd_cab: 0,
      fwd_cab_lmc: 0,
      fwd_cab_final: 0,
      mid_cab: 0,
      mid_cab_lmc: 0,
      mid_cab_final: 0,
      aft_cab: 0,
      aft_cab_lmc: 0,
      aft_cab_final: 0,
      aft_jump: 0,
      aft_jump_lmc: 0,
      aft_jump_show: 0,
      aft_jump_final: 0,
      fwd_jump: 0,
      fwd_jump_lmc: 0,
      fwd_jump_show: 0,
      fwd_jump_final: 0,
      mid_jump: 0,
      mid_jump_lmc: 0,
      mid_jump_show: 0,
      mid_jump_final: 0,
      fwd_galley: 0,
      fwd_galley_lmc: 0,
      fwd_galley_show: 0,
      fwd_galley_final: 0,
      aft_galley: 0,
      aft_galley_lmc: 0,
      aft_galley_show: 0,
      aft_galley_final: 0,
      cockpitOccupent: 0,
      cockpitOccupent_lmc: 0,
      cockpitOccupent_show: 0,
      cockpitOccupent_final: 0,
      acm: 0,
      acm_final: 0,
      paxAcmCount: 0,
      mzfw: 0,
      trimSheetOpen: false,
      lmctrimSheet: {},
      ActcrewStr: "",
      AdjustStr: "",
      Maxpax: 0,
      Maxcargo: 0,
      lmc_prog: false,
      LTAdjust: {},
      AdjustStrv2: [],
      cargoOpen: false,
      maxCompartment: 0,
      baggageLDMArray: [],
      cargoLDMArray: [],
      currentCargo: null,
      baggageShow: {},
      baggage_final: [],
      regex: /^[0-9\b]+$/,
      TOWindex: 0,
      TOWMAC: 0,
      ZFWindex: 0,
      ZFWMAC: 0,
      LWMAC: 0,
      LWindex: 0,
      compLimits: {},
      cargoBaggageError: "",
      first_observer: 0,
      first_observer_show: 0,
      first_observer_final: 0,
      first_observer_lmc: 0,
      first_observer_error: "",
      second_observer: 0,
      second_observer_show: 0,
      second_observer_final: 0,
      second_observer_lmc: 0,
      second_observerr_error: "",
      super_numeraries: 0,
      super_numeraries_show: 0,
      super_numeraries_final: 0,
      super_numeraries_lmc: 0,
      super_numerariesr_error: "",
      portable_water: 0,
      portable_water_show: 0,
      portable_water_final: 0,
      portable_water_lmc: 0,
      portable_water_error: "",
      spare_wheels: 0,
      spare_wheels_show: 0,
      spare_wheels_final: 0,
      spare_wheels_lmc: 0,
      spare_wheels_error: "",
      ETOP_equipments: 0,
      ETOP_equipments_show: 0,
      ETOP_equipments_final: 0,
      ETOP_equipments_lmc: 0,
      ETOP_equipments_error: "",
      cargoData: "",
      cargoActLoadData: "",
      prevCmptWt: "",
      prevCmptWtArray: "",
    };
    this.fetchFims = this.fetchFims.bind(this);
    this.submitLmc = this.submitLmc.bind(this);
    this.inputOnChange = this.inputOnChange.bind(this);
    this.handleFocusOut = this.handleFocusOut.bind(this);
    // this.againLmc = this.againLmc.bind(this);
    this.cargoAdd = this.cargoAdd.bind(this);
    this.cargoSubtract = this.cargoSubtract.bind(this);
  }
  componentWillMount() {
    console.log("compnent will mount trimsheet lmc");
    this.fetchFims();
    this.fetchMaxCabCamp();
  }
  async componentDidMount() {
    this.props.setPage("LmcLMC", "TrimsheetLMC");
    this.props.setPageAction(null);
    this.props.getLoadTypes();
    const Source = this.props.match.params.source;
    const Destination = this.props.match.params.destination;
    const Flight_Date = this.props.match.params.flight_date;
    const Flight_no = this.props.match.params.flight_no;
    const { STD } = await fetchFimsScheduleByFlightNoDate(
      Flight_no,
      Flight_Date,
      Source,
      Destination
    );
    const { Acft_Regn } = await fetchTrimSheetforFlight(
      Flight_no,
      Flight_Date,
      Source,
      Destination
    );
    this.props.getSector({
      Acft_Regn,
      Flight_Date,
      Flight_no,
      Source,
      Destination,
      STD,
    });
  }
  submitLmc() {
    var me = this;
    console.log("start of submitlmc  me state", me.state);
    console.log("start of submitlmc this state", this.state);
    console.log("start of submitlmc this state cargo 0", this.state.cargo[0]);
    var paxLmc = {};
    var paxShow = {};
    var cargolmc = {};
    var cargoShow = {};
    for (var i = 0; i < this.state.Maxpax; i++) {
      paxLmc[i] = "0/0/0/0";
      paxShow[i] = "0/0/0/0";
    }
    for (var i = 0; i < this.state.Maxcargo; i++) {
      cargolmc[i] = "0";
      cargoShow[i] = "0";
    }
    this.setState({
      pax1_error: "",
      pax2_error: "",
      pax3_error: "",
      cargo1_error: "",
      cargo2_error: "",
      cargo3_error: "",
      cargo4_error: "",
      fuel_in_error: "",
      Aftrjump_error: "",
      Midjump_error: "",
      Fwdjump_error: "",
      Aftrgalley_error: "",
      Fwdgalley_error: "",
      cockpit_error: "",
      rtow_error: "",
      otow_error: "",
      olw_error: "",
      trip_fuel_in_error: "",
      take_of_fuel_in_error: "",
    });
    var take_of_fuel_in = parseInt(this.state.take_of_fuel_final);
    if (take_of_fuel_in === null || take_of_fuel_in === undefined) {
      this.setState({ take_of_fuel_in_error: "Please enter take of fuel" });
      ReactDOM.findDOMNode(this.refs.take_of_fuel_final).focus();
      return;
    }

    if (Number(take_of_fuel_in) < 0) {
      this.setState({
        take_of_fuel_in_error: "Take of fuel should be positive value",
      });
      ReactDOM.findDOMNode(this.refs.take_of_fuel_final).focus();
      return;
    }

    if (take_of_fuel_in > parseInt(this.state.fleetinfo.MAxFuel)) {
      this.setState({
        take_of_fuel_in_error:
          "Take of fuel should be less than MAxFuel(" +
          parseInt(this.state.fleetinfo.MAxFuel) +
          ")",
      });
      ReactDOM.findDOMNode(this.refs.take_of_fuel_final).focus();
      return;
    }

    // if ((this.state.ac_type === 'B737' || this.state.ac_type === 'B738' || this.state.ac_type === 'B739') && take_of_fuel_in < 2000) {
    //   this.setState({ take_of_fuel_in_error: "Take of fuel can’t be less than 1999 for B737/B738/B739" });
    //   return;
    // }

    // if (this.state.ac_type === 'Q400' && take_of_fuel_in < 1000) {
    //   this.setState({ take_of_fuel_in_error: "Take of fuel can’t be less than 999 for Q400" });
    //   return;
    // }

    console.log("Min Take of Fuel: ", this.state.fleetinfo.MinFOB);
    console.log("Take of Fuel: ", take_of_fuel_in);
    console.log(take_of_fuel_in < parseInt(this.state.fleetinfo.MinFOB));
    if (take_of_fuel_in < parseInt(this.state.fleetinfo.MinFOB)) {
      this.setState({
        take_of_fuel_in_error: `Take of fuel can’t be less than ${this.state.fleetinfo.MinFOB} for ${this.state.fleetinfo.AC_REGN}`,
      });
      ReactDOM.findDOMNode(this.refs.take_of_fuel_final).focus();
      return;
    }

    var trip_fuel_in = parseInt(this.state.trip_fuel_final);
    console.log(trip_fuel_in)
    if (trip_fuel_in === null || trip_fuel_in === undefined) {
      this.setState({ trip_fuel_in_error: "Please enter trip fuel" });
      ReactDOM.findDOMNode(this.refs.trip_fuel_final).focus();
      return;
    }
    if (Number(trip_fuel_in) < 0) {
      this.setState({
        trip_fuel_in_error: "Trip Fuel should be positive value",
      });
      ReactDOM.findDOMNode(this.refs.trip_fuel_final).focus();
      return;
    }

    if (trip_fuel_in > take_of_fuel_in) {
      this.setState({
        trip_fuel_in_error: "Trip Fuel should be less then Take of fuel",
      });
      ReactDOM.findDOMNode(this.refs.trip_fuel_final).focus();
      return;
    }

    // if ((this.state.ac_type === 'B737' || this.state.ac_type === 'B738' || this.state.ac_type === 'B739') && trip_fuel_in < 500) {
    //   this.setState({ trip_fuel_in_error: "TripFuel can’t be less than 499 for B737/B738/B739" });
    //   return;
    // }

    // if (this.state.ac_type === 'Q400' && trip_fuel_in < 200) {
    //   this.setState({ trip_fuel_in_error: "Trip should be grethen than 199 for Q400" });
    //   return;
    // }
    console.log(trip_fuel_in,parseInt(this.state.fleetinfo.MinTripFuel))
    if (trip_fuel_in > parseInt(this.state.fleetinfo.MinTripFuel)) {
      this.setState({
        trip_fuel_in_error: `Trip Fuel should be greater than ${this.state.fleetinfo.MinTripFuel} for ${this.state.fleetinfo.AC_REGN}`,
      });
      ReactDOM.findDOMNode(this.refs.trip_fuel_final).focus();
      return;
    }

    var olw = this.state.olw_final;
    if (olw === null || olw === undefined) {
      this.setState({ olw_error: "Please enter OLW" });
      ReactDOM.findDOMNode(this.refs.olw_final).focus();
      return;
    }
    if (Number(olw) < 0) {
      this.setState({ olw_error: "OLW should be positive value" });
      ReactDOM.findDOMNode(this.refs.olw_final).focus();
      return;
    }
    if (olw > parseInt(this.state.mlw)) {
      this.setState({
        olw_error: "OLW cannot be greater than MLW(maximum Landing Weight) ",
      });
      ReactDOM.findDOMNode(this.refs.olw_final).focus();
      return;
    }

    // if (this.state.ac_type === 'Q400' && olw < 18000) {
    //   this.setState({ olw_error: "OLW cannot be less than 18000 for Q400" });
    //   return;
    // }

    // if (this.state.ac_type === 'B737' && olw < 45000) {
    //   this.setState({ olw_error: "OLW cannot be less than 45000 for B737" });
    //   return;
    // }

    // if ((this.state.ac_type === 'B738' || this.state.ac_type === 'B739') && olw < 50000) {
    //   this.setState({ olw_error: "OLW cannot be less than 50000 for B738/B739" });
    //   return;
    // }

    if (olw < parseInt(this.state.fleetinfo.MinLW)) {
      this.setState({
        olw_error: `OLW cannot be less than ${this.state.fleetinfo.MinLW} for ${this.state.ac_type}`,
      });
      ReactDOM.findDOMNode(this.refs.olw_final).focus();
      return;
    }

    var otow = this.state.otow_final;
    if (otow === null || otow === undefined) {
      this.setState({ otow_error: "Please enter OTOW" });
      ReactDOM.findDOMNode(this.refs.otow_final).focus();
      return;
    }
    if (Number(otow) < 0) {
      this.setState({ otow_error: "OTOW should be positive value" });
      ReactDOM.findDOMNode(this.refs.otow_final).focus();
      return;
    }

    if (otow > parseInt(this.state.mtow)) {
      this.setState({
        otow_error: "OTOW cannot be greater than MLW(maximum Landing Weight) ",
      });
      ReactDOM.findDOMNode(this.refs.otow_final).focus();
      return;
    }

    // if (this.state.ac_type === 'Q400' && otow < 18000) {
    //   this.setState({ otow_error: "OTOW cannot be less than 18000 for Q400" });
    //   return;
    // }

    // if ((this.state.ac_type === 'B737' || this.state.ac_type === 'B738' || this.state.ac_type === 'B739') && otow < 50000) {
    //   this.setState({ otow_error: "OTOW cannot be less than 50000 for B737/B738/B739" });
    //   return;
    // }

    if (otow < parseInt(this.state.fleetinfo.MinTOW)) {
      this.setState({
        otow_error: `OTOW cannot be less than ${this.state.fleetinfo.MinTOW} for ${this.state.ac_type}`,
      });
      ReactDOM.findDOMNode(this.refs.otow_final).focus();
      return;
    }

    var rtow = this.state.rtow;
    if (rtow === null || rtow === undefined) {
      this.setState({ rtow_error: "Please enter RTOW" });
      ReactDOM.findDOMNode(this.refs.rtow).focus();
      return;
    }
    if (Number(rtow) < 0) {
      this.setState({ rtow_error: "RTOW should be positive value" });
      ReactDOM.findDOMNode(this.refs.rtow).focus();
      return;
    }

    if (rtow > parseInt(this.state.mtow)) {
      this.setState({ rtow_error: "RTOW cant be greater than MTOW." });
      ReactDOM.findDOMNode(this.refs.rtow).focus();
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
        ReactDOM.findDOMNode(this.refs.pax).focus();
        // break;
        return;
      }

      if (pax[paxKeys[y]] == null || pax[paxKeys[y]] == undefined) {
        var count = parseInt(paxKeys[y]) + 1;
        this.setState({ pax1_error: "Please enter pax" + count });
        ReactDOM.findDOMNode(this.refs.pax).focus();
        // break;
        return;
      }
    }
    var cabinLarray =
      this.state.fleetinfo.CabinLimits &&
      this.state.fleetinfo.CabinLimits.split("$");
    console.log(cabinLarray);

    if (cabinLarray.length === Object.keys(pax).length) {
      for (let i = 0; i < cabinLarray.length; i++) {
        var pxArray = pax[i].split("/");
        console.log(pxArray);
        var total_p =
          parseInt(pxArray[0]) + parseInt(pxArray[1]) + parseInt(pxArray[3]);
        console.log(total_p);
        if (parseInt(total_p) > parseInt(cabinLarray[i])) {
          var count = parseInt(i) + 1;
          this.setState({
            pax1_error:
              "Limit exceed in Cabin_" +
              count +
              " should be <=" +
              cabinLarray[i],
          });
          // ReactDOM.findDOMNode(this.refs.CabinLimits).focus();
          // break;
          return;
        }
      }
    }

    var cargo = this.state.cargo_lmc;
    var cargoKeys = Object.keys(cargo);
    for (var z = 0; z < cargoKeys.length; z++) {
      if (cargo[cargoKeys[z]] == null || cargo[cargoKeys[z]] == undefined) {
        var count = parseInt(cargoKeys[z]) + 1;
        this.setState({ cargo1_error: "Please enter cargo" + count });
        ReactDOM.findDOMNode(this.refs.cargo_lmc).focus();
        // break;
        return;
      }
      // if (cargo[cargoKeys[z]] < 0) {
      //   var count = parseInt(cargoKeys[z]) + 1
      //   this.setState({ cargo1_error: "Cargo"+count+" should be positive value" })
      //   return;
      // }
    }
    var compLarray = this.state.fleetinfo.CompLimits.split("$");
    console.log(compLarray);

    if (compLarray.length === Object.keys(cargo).length) {
      for (let i = 0; i < compLarray.length; i++) {
        if (compLarray[i] == null || compLarray[i] == undefined) {
          compLarray[i] = 0;
        }
        if (parseInt(cargo[i]) > parseInt(compLarray[i])) {
          var count = parseInt(i) + 1;
          this.setState({
            cargo1_error:
              "Limit exceed in Comp_" + count + " should be <=" + compLarray[i],
          });
          // ReactDOM.findDOMNode(this.refs.fleetinfo).focus();
          // break;
          return;
        }
      }
    }
    var officierRegx = /^[a-zA-Z0-9_\s-]+$/;
    var trim_officer = this.state.trim_officer;
    if (
      trim_officer === null ||
      trim_officer === undefined ||
      trim_officer.trim().length === 0
    ) {
      this.setState({ trim_officer_error: "Please enter trim officer name" });
      ReactDOM.findDOMNode(this.refs.trim_officer).focus();
      return;
    }

    if (trim_officer.trim().length > 0 && !officierRegx.test(trim_officer)) {
      this.setState({
        trim_officer_error: "Please enter valid Trim Officier name",
      });
      ReactDOM.findDOMNode(this.refs.trim_officer).focus();
      return;
    }

    var load_officer = this.state.load_officer;
    if (
      load_officer === null ||
      load_officer === undefined ||
      load_officer.trim().length === 0
    ) {
      this.setState({ load_officer_error: "Please enter load officer name" });
      ReactDOM.findDOMNode(this.refs.load_officer).focus();
      return;
    }

    if (load_officer.trim().length > 0 && !officierRegx.test(load_officer)) {
      this.setState({
        load_officer_error: "Please enter valid Load Officier name",
      });
      ReactDOM.findDOMNode(this.refs.load_officer).focus();
      return;
    }

    var captain = this.state.captain;
    if (
      captain === null ||
      captain === undefined ||
      captain.trim().length === 0
    ) {
      this.setState({ captain_error: "Please enter captain name" });
      ReactDOM.findDOMNode(this.refs.captain).focus();
      return;
    }
    if (captain.trim().length > 0 && !officierRegx.test(captain)) {
      this.setState({ captain_error: "Please enter valid Captain name" });
      ReactDOM.findDOMNode(this.refs.captain).focus();
      return;
    }

    var si = this.state.si;

    var cockpitnew = this.state.cockpitOccupent_final;
    if (cockpitnew === null || cockpitnew === undefined) {
      this.setState({ cockpit_error: "Please enter cockpit" });
      ReactDOM.findDOMNode(this.refs.cockpitOccupent).focus();
      return;
    }
    if (Number(cockpitnew) < 0) {
      this.setState({ cockpit_error: "cockpit should be positive value" });
      ReactDOM.findDOMNode(this.refs.cockpitOccupent).focus();
      return;
    }
    // if (this.state.ac_type === 'B738' && cockpitnew > this.state.fleetinfo.MaxCockpitOccupant ) {
    //   this.setState({ cockpit_error: `Max value is ${this.state.fleetinfo.MaxCockpitOccupant} for B738` })
    //   return;
    // }
    // if ((this.state.ac_type === 'Q400' || this.state.ac_type === 'B737' || this.state.ac_type === 'B739') && cockpitnew > this.state.fleetinfo.MaxCockpitOccupant) {
    //   this.setState({ cockpit_error: `Max value is ${this.state.fleetinfo.MaxCockpitOccupant} for Q400/B737/B739` })
    //   return;
    // }
    if (cockpitnew > this.state.fleetinfo.MaxCockpitOccupant) {
      this.setState({
        cockpit_error: `Max value is ${this.state.fleetinfo.MaxCockpitOccupant} for ${this.state.ac_type}`,
      });
      ReactDOM.findDOMNode(this.refs.cockpitOccupent).focus();
      return;
    }
    if (
      this.state.fleetinfo.MaxFirstObserver &&
      Number(this.state.first_observer_final) < 0
    ) {
      this.setState({
        first_observer_error: "First Observer should be positive value",
      });
      ReactDOM.findDOMNode(this.refs.first_observer).focus();
      return;
    }
    if (
      this.state.fleetinfo.MaxFirstObserver &&
      this.state.first_observer_final > this.state.fleetinfo.MaxFirstObserver
    ) {
      this.setState({
        first_observer_error: `First Observer should be Max ${this.state.fleetinfo.MaxFirstObserver}`,
      });
      ReactDOM.findDOMNode(this.refs.first_observer).focus();
      return;
    }
    if (
      this.state.fleetinfo.MaxSecondObserver &&
      Number(this.state.second_observer_final) < 0
    ) {
      this.setState({
        second_observer_error: "Second Observer should be positive value",
      });
      ReactDOM.findDOMNode(this.refs.second_observer).focus();
      return;
    }

    if (
      this.state.fleetinfo.MaxSecondObserver &&
      this.state.second_observer_final > this.state.fleetinfo.MaxSecondObserver
    ) {
      this.setState({
        second_observer_error: `Second Observer should be Max ${this.state.fleetinfo.MaxSecondObserver}`,
      });
      ReactDOM.findDOMNode(this.refs.second_observer).focus();
      return;
    }
    if (
      this.state.fleetinfo.MaxSupernumerary &&
      Number(this.state.super_numeraries_final) < 0
    ) {
      this.setState({
        super_numeraries_error: "Super Numeraries should be positive value",
      });
      ReactDOM.findDOMNode(this.refs.super_numeraries).focus();
      return;
    }
    if (
      this.state.fleetinfo.MaxSupernumerary &&
      this.state.super_numeraries_final > this.state.fleetinfo.MaxSupernumerary
    ) {
      this.setState({
        super_numeraries_error: `Super Numeraries should be Max ${this.state.fleetinfo.MaxSupernumerary}`,
      });
      ReactDOM.findDOMNode(this.refs.super_numeraries).focus();
      return;
    }

    var Aftrgalley = this.state.aft_galley_final;
    if (Aftrgalley === null || Aftrgalley === undefined || Aftrgalley === "") {
      this.setState({ Aftrgalley_error: "Please enter Aftrgalley" });
      ReactDOM.findDOMNode(this.refs.aft_galley_final).focus();
      return;
    }
    if (Number(Aftrgalley) < 0) {
      this.setState({
        Aftrgalley_error: "Aftrgalley should be positive value",
      });
      ReactDOM.findDOMNode(this.refs.aft_galley_final).focus();
      return;
    }

    // if (this.state.ac_type === 'Q400' && Aftrgalley > this.state.fleetinfo.MaxAftGalley) {
    //   this.setState({ Aftrgalley_error: `Aftrgalley should be Max ${this.state.fleetinfo.MaxAftGalley} for Q400,` })
    //   return;
    // }

    // if ((this.state.ac_type === 'B738' || this.state.ac_type === 'B737' || this.state.ac_type === 'B739') && Aftrgalley > this.state.fleetinfo.MaxAftGalley) {
    //   this.setState({ Aftrgalley_error: `Aftrgalley should be Max ${this.state.fleetinfo.MaxAftGalley} for B737/B738/B739` })
    //   return;
    // }
    if (Aftrgalley > this.state.fleetinfo.MaxAftGalley) {
      this.setState({
        Aftrgalley_error: `Aftrgalley should be Max ${this.state.fleetinfo.MaxAftGalley} for ${this.state.ac_type}.`,
      });
      ReactDOM.findDOMNode(this.refs.aft_galley_final).focus();
      return;
    }

    var Fwdgalley = this.state.fwd_galley_final;
    if (Fwdgalley === null || Fwdgalley === undefined || Fwdgalley === "") {
      this.setState({ Fwdgalley_error: "Please enter Fwdgalley" });
      ReactDOM.findDOMNode(this.refs.fwd_galley_final).focus();
      return;
    }
    if (Number(Fwdgalley) < 0) {
      this.setState({ Fwdgalley_error: "Fwdgalley should be positive value" });
      ReactDOM.findDOMNode(this.refs.fwd_galley_final).focus();
      return;
    }

    // if (this.state.ac_type === 'Q400' && Fwdgalley > this.state.fleetinfo.MaxFwdGalley) {
    //   this.setState({ Fwdgalley_error: `Fwd galley should be Max ${this.state.fleetinfo.MaxFwdGalley} for Q400` })
    //   return;
    // }

    // if ((this.state.ac_type === 'B738' || this.state.ac_type === 'B737' || this.state.ac_type === 'B739') && Fwdgalley > this.state.fleetinfo.MaxFwdGalley) {
    //   this.setState({ Fwdgalley_error: `Fwd galley should be Max ${this.state.fleetinfo.MaxFwdGalley} for B737/B738/B739` })
    //   return;
    // }

    if (Fwdgalley > this.state.fleetinfo.MaxFwdGalley) {
      this.setState({
        Fwdgalley_error: `Fwd galley should be Max ${this.state.fleetinfo.MaxFwdGalley} for ${this.state.ac_type}.`,
      });
      ReactDOM.findDOMNode(this.refs.fwd_galley_final).focus();
      return;
    }
    var cabin_baggage = this.state.cabin_baggage_final;
    if (
      cabin_baggage === null ||
      cabin_baggage === undefined ||
      cabin_baggage === ""
    ) {
      this.setState({ cabin_baggage_error: "Please enter cabin baggage" });
      ReactDOM.findDOMNode(this.refs.cabin_baggage_final).focus();
      return;
    }

    if (Number(cabin_baggage) < 0) {
      this.setState({
        cabin_baggage_error: "Cabin baggage should be positive value",
      });
      ReactDOM.findDOMNode(this.refs.cabin_baggage_final).focus();
      return;
    }
    if (Number(cabin_baggage) > this.state.fleetinfo.MaxCabinBaggage) {
      this.setState({
        cabin_baggage_error: `Cabin baggage should be max ${this.state.fleetinfo.MaxCabinBaggage}`,
      });
      ReactDOM.findDOMNode(this.refs.cabin_baggage_final).focus();
      return;
    }

    var Aftrjump = this.state.aft_jump_final;
    if (Aftrjump === null || Aftrjump === undefined) {
      this.setState({ Aftrjump_error: "Please enter Aftrjump" });
      ReactDOM.findDOMNode(this.refs.aft_jump).focus();
      return;
    }

    var Fwdjump = this.state.fwd_jump_final;
    if (Fwdjump === null || Fwdjump === undefined) {
      this.setState({ Fwdjump_error: "Please enter Fwd jump" });
      ReactDOM.findDOMNode(this.refs.fwd_jump).focus();
      return;
    }
    var Midjump = this.state.mid_jump_final;
    if (Midjump === null || Midjump === undefined) {
      this.setState({ Midjump_error: "Please enter Mid jump" });
      ReactDOM.findDOMNode(this.refs.mid_jump).focus();
      return;
    }
    if (Number(Aftrjump) < 0) {
      this.setState({ Aftrjump_error: "After Jump should be positive value" });
      ReactDOM.findDOMNode(this.refs.aft_jump).focus();
      return;
    }
    if (Number(Midjump) < 0) {
      this.setState({ Midjump_error: "Mid Jump should be positive value" });
      ReactDOM.findDOMNode(this.refs.mid_jump).focus();
      return;
    }
    if (Number(Fwdjump) < 0) {
      this.setState({ Fwdjump_error: "Forward Jump should be positive value" });
      ReactDOM.findDOMNode(this.refs.fwd_jump).focus();
      return;
    }

    if (Number(Fwdjump) > this.state.fleetinfo.MaxFwdJump) {
      this.setState({
        Fwdjump_error: `Max value is ${this.state.fleetinfo.MaxFwdJump} for ${this.state.ac_type}`,
      });
      ReactDOM.findDOMNode(this.refs.fwd_jump).focus();
      return;
    }
    if (Number(Midjump) > this.state.fleetinfo.MaxMidJump) {
      this.setState({
        Midjump_error: `Max value is ${this.state.fleetinfo.MaxMidJump} for ${this.state.ac_type}`,
      });
      ReactDOM.findDOMNode(this.refs.mid_jump).focus();
      return;
    }
    if (Number(Aftrjump) > this.state.fleetinfo.MaxAftJump) {
      this.setState({
        Aftrjump_error: `Max value is ${this.state.fleetinfo.MaxAftJump} for ${this.state.ac_type}`,
      });
      ReactDOM.findDOMNode(this.refs.aft_jump).focus();
      return;
    }
    if (
      this.state.fleetinfo.MaxPortableWater &&
      Number(this.state.portable_water_final) < 0
    ) {
      this.setState({
        portable_water_error: "Portable Watershould be positive value",
      });
      ReactDOM.findDOMNode(this.refs.portable_water).focus();
      return;
    }
    if (
      this.state.fleetinfo.MaxPortableWater &&
      this.state.portable_water_final > this.state.fleetinfo.MaxPortableWater
    ) {
      this.setState({
        portable_water_error: `Portable Water should be Max ${this.state.fleetinfo.MaxPortableWater}`,
      });
      ReactDOM.findDOMNode(this.refs.portable_water).focus();
      return;
    }

    if (
      this.state.fleetinfo.MaxSpareWheels &&
      Number(this.state.spare_wheels_final) < 0
    ) {
      this.setState({
        spare_wheels_error: "Spare Wheels should be positive value",
      });
      ReactDOM.findDOMNode(this.refs.spare_wheels).focus();
      return;
    }
    if (
      this.state.fleetinfo.MaxSpareWheels &&
      this.state.spare_wheels_final > this.state.fleetinfo.MaxSpareWheels
    ) {
      this.setState({
        spare_wheels_error: `Spare Wheels should be Max ${this.state.fleetinfo.MaxSpareWheels}`,
      });
      ReactDOM.findDOMNode(this.refs.spare_wheels).focus();
      return;
    }

    if (
      this.state.fleetinfo.MaxETOPEquipments &&
      Number(this.state.ETOP_equipments_final) < 0
    ) {
      this.setState({
        ETOP_equipments_error: "ETOP Equipments should be positive value",
      });
      ReactDOM.findDOMNode(this.refs.ETOP_equipments).focus();
      return;
    }
    if (
      this.state.fleetinfo.MaxETOPEquipments &&
      this.state.ETOP_equipments_final > this.state.fleetinfo.MaxETOPEquipments
    ) {
      this.setState({
        ETOP_equipments_error: `ETOP Equipments should be Max ${this.state.fleetinfo.MaxETOPEquipments}`,
      });
      ReactDOM.findDOMNode(this.refs.ETOP_equipments).focus();
      return;
    }
    var jumpSum = Number(Aftrjump) + Number(Midjump) + Number(Fwdjump);
    console.log("jumpSum ", jumpSum);

    var post = {
      regno: this.props.match.params.Reg_no,
      ac_type: this.state.ac_type,
      trip_fuel_in: this.state.trip_fuel_final,
      take_of_fuel_in: this.state.take_of_fuel_final,
      olw: this.state.olw_final,
      otow: this.state.otow_final,
      rtow: this.state.rtow,
      pax: this.state.paxlmc,
      acm: parseInt(
        this.state.acm +
          this.state.cockpitOccupent_final +
          this.state.aft_jump_lmc +
          this.state.paxAcmCount
      ),
      Aftrcab: this.state.aft_cab,
      Midcab: this.state.mid_cab,
      Fwdcab: this.state.fwd_cab,
      crew: this.state.crew,
      trim_officer: this.state.trim_officer,
      load_officer: this.state.load_officer,
      captain: this.state.captain,
      si: this.state.si,
      // si: si_final.toUpperCase(),
      cargo: this.state.cargo_lmc,

      tob: this.state.tob_final,
      pob: this.state.pob_final,
      fleetinfo: this.state.fleetinfo,
      trimSheet: { ...this.state.trim_sheet },
      ActcrewStr: this.state.ActcrewStr,
      cabin_crew: this.state.cabin_crew,
      AdjustStr: this.state.AdjustStr,
      paxAcm: this.state.paxAcm,

      cockpit: parseInt(this.state.cockpitOccupent_lmc),
      cockpitnew: parseInt(this.state.cockpitOccupent_lmc),
      cockpitOccupent_final: parseInt(this.state.cockpitOccupent_final),

      cabin_baggage: parseInt(this.state.cabin_baggage_lmc),
      cabin_baggage_final: this.state.cabin_baggage_final,

      Aftrgalley: parseInt(this.state.aft_galley_lmc),
      Aftrgalley_final: parseInt(this.state.aft_galley_final),

      Fwdgalley: parseInt(this.state.fwd_galley_lmc),
      Fwdgalley_final: parseInt(this.state.fwd_galley_final),

      Aftrjump: parseInt(this.state.aft_jump_lmc),
      Aftrjump_final: parseInt(this.state.aft_jump_final),

      Fwdjump: parseInt(this.state.fwd_jump_lmc),
      Fwdjump_final: parseInt(this.state.fwd_jump_final),

      Midjump: parseInt(this.state.mid_jump_lmc),
      Midjump_final: parseInt(this.state.mid_jump_final),

      FirstObserver: parseInt(this.state.first_observer_lmc),
      FirstObserver_final: parseInt(this.state.first_observer_final),

      SecondObserver: parseInt(this.state.second_observer_lmc),
      SecondObserver_final: parseInt(this.state.second_observer_final),

      SuperNumeraries: parseInt(this.state.super_numeraries_lmc),
      SuperNumeraries_final: parseFloat(this.state.super_numeraries_final),
      PortableWater: parseInt(this.state.portable_water_lmc),
      PortableWater_final: parseFloat(this.state.portable_water_final),

      SpareWheels: parseInt(this.state.spare_wheels_lmc),
      SpareWheels_final: parseInt(this.state.spare_wheels_final),

      ETOPEquipments: parseInt(this.state.ETOP_equipments_lmc),
      ETOPEquipments_final: parseInt(this.state.ETOP_equipments_final),

      rtow: this.state.rtow,
      BagLDM: this.state.baggageLDMArray.join("$") + "$^",
      CargoLDM: this.state.cargoLDMArray.join("$") + "$^",
      ActcrewStrJump: jumpSum,
      ActLoadDistStrV2: this.state.cargoData,
      ActLoadDistStr: this.state.cargoActLoadData,
      totalLoad: this.state.totalLoad,
      prevCmptWt: this.state.prevCmptWt,
      prevCmptWtArray: this.state.prevCmptWtArray,
      presentCmptWtArray: [
        this.state.trim_sheet.cmpt1,
        this.state.trim_sheet.cmpt2,
        this.state.trim_sheet.cmpt3,
        this.state.trim_sheet.cmpt4,
      ],
      presentCmptWt:
        this.state.trim_sheet.cmpt1 +
        this.state.trim_sheet.cmpt2 +
        this.state.trim_sheet.cmpt3 +
        this.state.trim_sheet.cmpt4,
    };
    console.log("end of submitlmc  me state", me.state);
    console.log("end of submitlmc this state", this.state);
    console.log("lmc state", this.state);
    console.log("Post: ", post);
    this.setState({
      lmc_prog: true,
    });
    CalculateLMC({ ...post }, { ...this.state.trim_sheet })
      .then((res) => {
        console.log(res)
        this.setState({
          cargo_lmc: cargolmc,
          cargo_show: cargoShow,
          paxlmc: paxLmc,
          paxShow: paxShow,
          lmc_prog: false,
        });
        console.log("result i trimsheet lmc ", res);
        if (res.isSync === false && me.props.network.status === true) {
          // this.props.history.goBack();
          LMCArchive()
            .then(() => {
             
              this.props.history.goBack();
              //this.props.history.push("/app/fims_trim/"+this.props.match.params.flight_no+"/"+this.props.match.params.flight_date+"/"+res.Source+"/"+res.Destination+"/"+this.props.match.params.status);
            })
            .catch((er) => {
              console.log(er);
              this.setState({ error: true, message: er });
            });
        } else {
          this.props.history.goBack();
          //this.props.history.push("/app/fims_trim/"+this.props.match.params.flight_no+"/"+this.props.match.params.flight_date+"/"+res.Source+"/"+res.Destination+"/"+this.props.match.params.status);
        }
        //this.props.history.push("/app/fims_trim/"+this.props.match.params.flight_no+"/"+this.props.match.params.flight_date+"/"+this.props.match.params.status);
        // this.props.history.push("/app/fims_trim/"+this.props.match.params.flight_no+"/"+this.props.match.params.flight_date)
      })
      .catch((er) => {
        console.log(er);
        this.setState({ error: true, message: er, lmc_prog: false });
      });
  
  
  
    }
  fetchFims() {
    var flightNo = this.props.match.params.flight_no;
    fetchFimsDataByFlightNo(flightNo)
      .then((res) => {
        console.log(res);
        this.setState({ fims_data: res });
      })
      .catch((er) => {
        console.log(er);
      });
  }

  fetchMaxCabCamp() {
    var me = this;
    console.log("compnent will mount trimsheet lmc fetchMaxCabCamp");

    fetchFleetinfoByRegnNo(this.props.match.params.Reg_no)
      .then((res) => {
        console.log("FleetInfo: ", res);
        let compLimitsArray = res.CompLimits && res.CompLimits.split("$");
        this.setState({
          fleetinfo: res,
          ac_type: res.AC_TYPE,
          mlw: res.MLW,
          mtow: res.MTOW,
          compLimits: compLimitsArray,
        });
        return fetchLtAdjustByRegnNo(res.AC_REGN);
      })
      .then((LTAdjust) => {
        console.log("LTAdjust: ", LTAdjust);
        this.setState({ LTAdjust: LTAdjust });
        var source = this.props.match.params.source;
        var destination = this.props.match.params.destination;
        var flight_date = this.props.match.params.flight_date;
        return fetchTrimSheetforFlight(
          this.props.match.params.flight_no,
          flight_date,
          source,
          destination
        );
      })
      .then((trim) => {
        console.log("trimtrimtrimtrimtrimtrimtrimtrimtrim", trim);

        var pax = {};
        var paxLmc = {};
        var paxShow = {};
        var cargo = {};
        var cargolmc = {};
        var cargoShow = {};
        var cargofinal = [];
        var paxAcm = {};
        var cargoDisplay = "";
        let baggageLDM = [];
        let cargoLDMArray = [];
        let baggageShow = {};
        var baggagefinal = [];

        let bagLDM = trim.BagLDM;
        if (bagLDM != null) {
          //bagLDM = bagLDM.replace('T', '');
          let bagLDMS = bagLDM.replace("T", "").split("^");

          bagLDMS.forEach((bagLDMSVal) => {
            let bagLDMArray = bagLDMSVal.split("$");
            console.log("ARRRRR: ", bagLDMArray);
            bagLDMArray.map((bag, index) => {
              if (bag != "") {
                baggageShow[index] = 0;
                if (baggageLDM[index]) {
                  baggageLDM[index] = baggageLDM[index] + parseInt(bag);
                  baggagefinal[index] = baggagefinal[index] + +parseInt(bag);
                } else {
                  baggageLDM[index] = parseInt(bag);
                  baggagefinal[index] = parseInt(bag);
                }
              }
            });
          });

          console.log("BAG LDM: ", baggageLDM);
        }

        let cargoLDM = trim.CargoLDM; //"0$300$T907$200$^1$310$917$210$^";
        if (cargoLDM != null) {
          //cargoLDM = cargoLDM.replace('T', '');
          let cargoLDMS = cargoLDM.replace("T", "").split("^");

          cargoLDMS.forEach((cargo) => {
            let cargoLDMSArray = cargo.split("$");
            console.log("BRRRRR: ", cargoLDMSArray);
            cargoLDMSArray.map((bag, index) => {
              if (bag != "") {
                cargoShow[index] = 0;
                if (cargoLDMArray[index]) {
                  cargoLDMArray[index] = cargoLDMArray[index] + parseInt(bag);
                  cargofinal[index] = cargofinal[index] + parseInt(bag);
                } else {
                  cargoLDMArray[index] = parseInt(bag);
                  cargofinal[index] = parseInt(bag);
                }
              }
            });
          });

          console.log("CARGO LDM: ", cargoLDMArray);
        }

        // for (var i = 0; i < trim.MaxCompartment; i++) {
        //   //console.log("1234566", trim["cmpt" + (0 + 1)])
        //   cargo[i] = trim["cmpt" + (1 + i)];
        //   if(trim["cmpt" + (1 + i)] != undefined){
        //     if(i+1 == trim.MaxCompartment) {
        //       cargoDisplay = cargoDisplay + trim["cmpt" + (1 + i)];
        //     } else {
        //       cargoDisplay = cargoDisplay + trim["cmpt" + (1 + i)] + "/";
        //     }
        //   }

        //   cargolmc[i] = "0";
        //   //cargoShow[i] = "0";
        //   cargofinal[i] = trim["cmpt" + (1 + i)];
        // }

        //console.log("Cargo display: ", cargofinal);
        var count = 0;
        var stdCount = 0;
        var crewArray = trim.ActcrewStr.split("/");
        var adjustStrv2 = trim.AdjustStrv2.split("$");
        console.log("crewArray ", crewArray);
        var stdcrewArray = trim.STDCREW.match(/\d+/g);
        console.log(trim.AdjustStr);
        var cabinArray = trim.AdjustStr.split("$");
        var cockpitOccup = parseInt(adjustStrv2[0]);
        var acmCount = 0;
        for (var i = 0; i < trim.MaxCabin; i++) {
          paxAcm[i] = adjustStrv2[13 + i];
          acmCount = parseInt(acmCount + parseInt(adjustStrv2[13 + i]));
        }
        for (var i = 0; i < trim.MaxCabin; i++) {
          pax[i] =
            trim["C" + (i + 1) + "Adult"] +
            "/" +
            trim["C" + (i + 1) + "Child"] +
            "/" +
            trim["C" + (i + 1) + "Infant"] +
            "/" +
            paxAcm[i];
          paxLmc[i] = "0/0/0/0";
          paxShow[i] = "0/0/0/0";
        }
        if (isNaN(cockpitOccup)) {
          cockpitOccup = 0;
        }
        var cabinBagagge = parseInt(adjustStrv2[3]);
        if (isNaN(cabinBagagge)) {
          cabinBagagge = 0;
        }

        var fwdGalley = parseInt(adjustStrv2[1]);
        if (isNaN(fwdGalley)) {
          fwdGalley = 0;
        }

        var aftGalley = parseInt(adjustStrv2[2]);
        if (isNaN(aftGalley)) {
          aftGalley = 0;
        }

        var aftJump = parseInt(adjustStrv2[4]);
        if (isNaN(aftJump)) {
          aftJump = 0;
        }

        var fwdJump = parseInt(adjustStrv2[5]);
        if (isNaN(fwdJump)) {
          fwdJump = 0;
        }

        var midJump = parseInt(adjustStrv2[6]);
        if (isNaN(midJump)) {
          midJump = 0;
        }

        var firstObserver = parseInt(adjustStrv2[7]);
        if (isNaN(firstObserver)) {
          firstObserver = 0;
        }

        var secondObserver = parseInt(adjustStrv2[8]);
        if (isNaN(secondObserver)) {
          secondObserver = 0;
        }

        var superNumeraries = parseInt(adjustStrv2[9]);
        if (isNaN(superNumeraries)) {
          superNumeraries = 0;
        }

        var portableWater = parseInt(adjustStrv2[10]);
        if (isNaN(portableWater)) {
          portableWater = 0;
        }

        var spareWheels = parseInt(adjustStrv2[11]);
        if (isNaN(spareWheels)) {
          spareWheels = 0;
        }

        var ETOPEquipments = parseInt(adjustStrv2[12]);
        if (isNaN(ETOPEquipments)) {
          ETOPEquipments = 0;
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

        console.log("count", count);
        console.log("stdCount", stdCount);
        var tobCount = 0;
        console.log("paxxxxxx", pax);
        infant_count = 0;
        Object.values(pax).forEach((item) => {
          console.log(item);
          var itemsArray = item.split("/");
          console.log("itemsArray", itemsArray);
          tobCount =
            tobCount + parseInt(itemsArray[0]) + parseInt(itemsArray[1]);
          infant_Exist = true;
          infant_count = infant_count + parseInt(itemsArray[2]);
        });
        console.log("infantCount infantCount ", infant_count);
        var stdCrewArray = trim.STDCREW.match(/\d+/g);
        console.log("stdCrewArray", stdCrewArray);
        var cockpit = parseInt(stdCrewArray[0]);
        var fwdcab = parseInt(stdCrewArray[1]);
        console.log(fwdcab)
        var midcab = parseInt(stdCrewArray[2]);
        var aftcab = parseInt(stdCrewArray[3]);
        // var crewcount = cockpit + fwdcab + midcab + aftcab;
        var cabin_crew = parseInt(crewArray[1]);

        var pobCount = 0;
        var stdcrewPobArray = trim.STDCREW.replace("P", "").split("$");
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
        pobCount = parseInt(stdCrewArray[0]) + acmCount; //parseInt(stdCrewArray[0]) + fwdcab + midcab + aftcab + firstObserver + secondObserver + superNumeraries ;//tobCount + parseInt(stdCrewArray[0]) + cockpitOccup + fwdcab + midcab + aftcab
        //+ acmCount + firstObserver + secondObserver + superNumeraries  ;
        var user = JSON.parse(window.localStorage.getItem("auth_user"));
        var cabinBagagge = 0;

        if (trim["IsCargoOnSeatStr"] == true || trim["IsFreighter"] == 1) {
          cabinArray = trim.AdjustStrv2.split("$");
          cabinBagagge = parseInt(cabinArray[3]);
          if (isNaN(cabinBagagge)) {
            cabinBagagge = 0;
          }
        } else {
          cabinArray = trim.AdjustStrv2.split("$");
          cabinBagagge = parseInt(cabinArray[3]);
          if (isNaN(cabinBagagge)) {
            cabinBagagge = 0;
          }
        }

        var TTLLOAD = 0;

        if (trim["IsCargoOnSeatStr"] == true || trim["IsFreighter"] == 1) {
          TTLLOAD = cabinBagagge; //; + totalLoadLowerDeck + totalLoadUpperDeck;
        } else {
          TTLLOAD =
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
            cabinBagagge;
        }
        me.setState(
          {
            cargo: cargo,
            cargo_lmc: cargolmc,
            cargo_show: cargoShow,
            cargo_final: cargofinal,
            pax: pax,
            paxlmc: paxLmc,
            paxShow: paxShow,
            paxAcm: paxAcm,
            cabin_baggage: cabinBagagge,
            cabin_baggage_final:
              cabinBagagge +
              (this.state.fleetinfo.StdCabinBaggage
                ? parseInt(this.state.fleetinfo.StdCabinBaggage)
                : 0),
            trip_fuel: trim.TRIP_FUEL,
            trip_fuel_final: trim.TRIP_FUEL,
            take_of_fuel: trim.FOB,
            take_of_fuel_final: trim.FOB,
            olw: trim.MLW,
            olw_final: trim.MLW,
            otow: trim.MTOW,
            otow_final: trim.MTOW,
            load_officer: trim.Load_Officer,
            captain: trim.CAPTAIN,
            trim_officer: user.name,
            si: trim.specialStr,
            in_prog: false,
            error: false,
            trim_sheet: trim,
            acmCountRead: acmCount,
            crew: parseInt(count),
            Maxcargo: trim.MaxCompartment,
            Maxpax: trim.MaxCabin,
            acm: parseInt(acmCount + cockpitOccup + aftJump),
            tob: tobCount,
            tob_final: tobCount,
            pob: pobCount,
            pob_final: pobCount,
            cockpit: cockpit,
            cabin_crew: cabin_crew,
            fwd_cab: fwdcab,
            fwd_cab_final: fwdcab,
            mid_cab: midcab,
            mid_cab_final: midcab,
            aft_cab: aftcab,
            aft_cab_final: aftcab,
            aft_galley: aftGalley,
            aft_galley_final:
              aftGalley +
              (this.state.fleetinfo.StdAftGalley
                ? parseInt(this.state.fleetinfo.StdAftGalley)
                : 0),
            fwd_galley: fwdGalley,
            fwd_galley_final:
              fwdGalley +
              (this.state.fleetinfo.StdFwdGalley
                ? parseInt(this.state.fleetinfo.StdFwdGalley)
                : 0),
            aft_jump: aftJump,
            aft_jump_final:
              aftJump +
              (this.state.fleetinfo.StdAftJump
                ? parseInt(this.state.fleetinfo.StdAftJump)
                : 0),
            fwd_jump: fwdJump,
            fwd_jump_final:
              fwdJump +
              (this.state.fleetinfo.StdFwdJump
                ? parseInt(this.state.fleetinfo.StdFwdJump)
                : 0),
            mid_jump: midJump,
            mid_jump_final:
              midJump +
              (this.state.fleetinfo.StdMidJump
                ? parseInt(this.state.fleetinfo.StdMidJump)
                : 0),
            cockpitOccupent: cockpitOccup,
            cockpitOccupent_final: cockpitOccup,
            mzfw: trim.MZFW,
            AdjustStr: trim.AdjustStr,
            ActcrewStr: trim.ActcrewStr,
            paxAcmCount: 0,
            AdjustStrv2: trim.AdjustStrv2.split("$"),
            cargoDisplay: cargoDisplay,
            maxCompartment: trim.MaxCompartment,
            baggageLDMArray: baggageLDM,
            prevCmptWt: trim.cmpt1 + trim.cmpt2 + trim.cmpt3 + trim.cmpt4,
            prevCmptWtArray: [trim.cmpt1, trim.cmpt2, trim.cmpt3, trim.cmpt4],
            cargoLDMArray: cargoLDMArray,
            baggage_final: baggagefinal,
            baggageShow: baggageShow,
            TOWindex: trim.TOWindex,
            TOWMAC: trim.TOWMAC,
            ZFWindex: trim.ZFWindex,
            ZFWMAC: trim.ZFWMAC,
            LWMAC: trim.LWMAC,
            LWindex: trim.LWindex,
            first_observer: firstObserver,
            first_observer_final: firstObserver,
            second_observer: secondObserver,
            second_observer_final: secondObserver,
            super_numeraries: superNumeraries,
            super_numeraries_final: superNumeraries,
            portable_water: portableWater,
            portable_water_final:
              portableWater +
              (this.state.fleetinfo.StdPortableWater
                ? parseInt(this.state.fleetinfo.StdPortableWater)
                : 0),
            spare_wheels: spareWheels,
            spare_wheels_final:
              spareWheels +
              (this.state.fleetinfo.StdSpareWheels
                ? parseInt(this.state.fleetinfo.StdSpareWheels)
                : 0),
            ETOP_equipments: ETOPEquipments,
            ETOP_equipments_final:
              ETOPEquipments +
              (this.state.fleetinfo.StdETOPEquipments
                ? parseInt(this.state.fleetinfo.StdETOPEquipments)
                : 0),
            cargoData: trim.ActLoadDistStrV2,
            cargoActLoadData: trim.ActLoadDistStr,
            totalLoad: TTLLOAD,
          },
          function () {
            this.inputOnChange();
          }
        );

        console.log("state", this.state);
      })
      .catch((err) => {
        me.setState({ in_prog: false, error: true, trim_sheet: null });

        console.log(err);
      });
  }

  //   fetchLTAdjustWeightByAcftType(this.state.ac_type).then((result)=>{

  //     console.log("LTAdjust",result);
  //     if(result === null || result === undefined){
  //         //defer.reject()
  //     }
  //     //ltadjust  = result;

  //   }).catch((er)=>{
  //     //defer.reject(er)
  //     console.log(er)
  //   })
  // }
  // againLmc() {
  //   this.setState({
  //     'take_of_fuel_lmc': 0,
  //     'trip_fuel_lmc': 0,
  //     'olw_lmc': 0,
  //     'otow_lmc': 0,
  //     'rtow_lmc': 0,
  //     'tob_lmc': 0,
  //     'cabin_baggage_lmc': 0,
  //     'crew_lmc': 0,
  //     'fwd_cab_lmc': 0,
  //     'mid_cab_lmc': 0,
  //     'aft_cab_lmc': 0,
  //     'aft_jump_lmc': 0,
  //     'fwd_galley_lmc': 0,
  //     'aft_galley_lmc': 0,
  //     'cockpitOccupent_lmc': 0,
  //   })
  // }
  handlepax(item, value, lmc) {
    var me = this;
    console.log("item value", item, value);
    me.state.pax[parseInt(item)] = value;

    var paxlmc = me.state.paxlmc[parseInt(item)].split("/");
    var ilmc = lmc.split("/");
    for (var i = 0; i < 4; i++) {
      paxlmc[i] = parseInt(paxlmc[i]) + parseInt(ilmc[i]);
    }
    me.state.paxlmc[parseInt(item)] = paxlmc.join("/");
    me.setState({ pax: me.state.pax, paxlmc: me.state.paxlmc }, () => {
      var count = 0;
      var acm_count = 0;
      infant_count = 0;
      Object.values(this.state.pax).forEach((item) => {
        console.log(item);
        var itemsArray = item.split("/");
        count = count + parseInt(itemsArray[0]) + parseInt(itemsArray[1]);
        infant_Exist = true;
        infant_count = infant_count + parseInt(itemsArray[2]);
      });
      console.log("this.state.paxlmc", this.state.paxlmc);
      Object.values(this.state.paxlmc).forEach((item) => {
        console.log(item);
        var itemsArray = item.split("/");
        acm_count = acm_count + parseInt(itemsArray[3]);
      });
      console.log("infant_count.infant_count", infant_count);
      me.setState({ tob_final: count, paxAcmCount: acm_count });
    });
    console.log("state.pax", me.state);
  }

  // handleCargo(item, value) {
  //   console.log("Carg: ", item, value);
  //   var temp = {};
  //   if (this.state.cargo_show[parseInt(item)] == undefined) {
  //     this.state.cargo_show[parseInt(item)] = 0;
  //   }
  //   this.state.cargo_show[parseInt(item)] = value;
  //   this.setState({ cargo_show: this.state.cargo_show });
  //   console.log("this.state", this.state);
  // }

  handleCargo(item, value) {
    console.log("Carg: ", item, value);
    var temp = {};
    if (this.state.cargo_show[parseInt(item)] == undefined) {
      this.state.cargo_show[parseInt(item)] = 0;
    }
    this.state.cargo_show[parseInt(item)] = value;
    this.state.cargo_lmc[parseInt(item)] =
      this.state.cargo_show[parseInt(item)];
    this.setState({ cargo_lmc: this.state.cargo_lmc });
    console.log("this.state.cargo_lmc", this.state.cargo_lmc);
    this.setState({ cargo_show: this.state.cargo_show });
    console.log("this.state", this.state);
  }

  handleBaggage(item, value) {
    console.log("Bag: ", item, value);
    var temp = {};
    if (this.state.baggageShow[parseInt(item)] == undefined) {
      this.state.baggageShow[parseInt(item)] = 0;
    }
    this.state.baggageShow[parseInt(item)] = value;
    this.setState({ baggageShow: this.state.baggageShow });
    console.log("Baggage: ", this.state);
  }

  cargoAdd(item) {
    var me = this;
    var cargo_final = this.state.cargo_final;
    cargo_final[parseInt(item)] = parseInt(
      parseInt(me.state.cargoLDMArray[parseInt(item)]) +
        parseInt(me.state.cargo_show[parseInt(item)])
    );
    me.state.cargo_lmc[parseInt(item)] = me.state.cargo_show[parseInt(item)];
    me.setState({ cargo_final: cargo_final, cargo_lmc: me.state.cargo_lmc });
    console.log("this.state", this.state);
  }
  cargoSubtract(item) {
    var me = this;
    var cargo_final = this.state.cargo_final;
    cargo_final[parseInt(item)] = parseInt(
      parseInt(me.state.cargoLDMArray[parseInt(item)]) -
        parseInt(me.state.cargo_show[parseInt(item)])
    );
    me.state.cargo_lmc[parseInt(item)] =
      "-" + me.state.cargo_show[parseInt(item)];
    me.setState({ cargo_final: cargo_final, cargo_lmc: me.state.cargo_lmc });
    console.log("this.state", this.state);
  }

  baggageAdd(item) {
    var me = this;
    var baggage_final = this.state.baggage_final;
    baggage_final[parseInt(item)] = parseInt(
      parseInt(me.state.baggageLDMArray[parseInt(item)]) +
        parseInt(me.state.baggageShow[parseInt(item)])
    );
    //me.state.cargo_lmc[parseInt(item)]  =   me.state.cargo_show[parseInt(item)];
    me.setState({ baggage_final: baggage_final });
    console.log("this.state", this.state);
  }

  baggageSubtract(item) {
    var me = this;
    var baggage_final = this.state.baggage_final;
    baggage_final[parseInt(item)] = parseInt(
      parseInt(me.state.baggageLDMArray[parseInt(item)]) -
        parseInt(me.state.baggageShow[parseInt(item)])
    );
    //me.state.cargo_lmc[parseInt(item)] = "-"+me.state.cargo_show[parseInt(item)]
    me.setState({ baggage_final: baggage_final });
    console.log("this.state", this.state);
  }

  handleFocusOut(item, value) {
    var me = this;
    console.log("item handleFocusOut value", item, value);
    if (value === null || value === undefined || value.trim().length === 0) {
      me.state.cargo_show[parseInt(item)] = "0";
      me.state.cargo_lmc[parseInt(item)] = "0";
    } else {
      me.state.cargo_show[parseInt(item)] = value;
    }
    me.setState({
      cargo_show: me.state.cargo_show,
      cargo_lmc: me.state.cargo_lmc,
    });
  }

  handleCargoSubmit(index, bagageWt, cargoWt) {
    let cargo_final = [...this.state.cargo_final];
    let baggage_final = [...this.state.baggage_final];
    console.log(cargo_final, " CMK cargo_final ", baggage_final);
    cargo_final[index] = cargoWt;
    baggage_final[index] = bagageWt;
    let total = cargo_final[index] + baggage_final[index];
    // [...this.state.cargo_show];
    //  console.log( [...this.state.cargo_show[parseInt(index)]]," CMK cargo_final ayer ", [...this.state.cargo_show]);
    //[...this.state.cargo_show[parseInt(index)]] = cargoWt;
    //console.log( [...this.state.cargo_show[parseInt(index)]]," CMK cargo_final afffer ", [...this.state.cargo_show]);
    //   let cargoShow = [...this.state.cargo_show];
    //  let baggageShow = [...this.state.baggage_show];
    //    console.log(cargoShow[index]," CMK baggageShow ayer ",cargoShow);
    //    cargoShow[index]=cargoWt;
    //    baggageShow[index] = bagageWt;
    //    console.log(baggageShow," CMK baggageShow ayer ",cargoShow);
    this.setState({
      cargo_final: [...cargo_final],
      baggage_final: [...baggage_final],
    });
    if (index == 0)
      this.state.trim_sheet.cmpt1 =
        Number(baggage_final[0]) + Number(cargo_final[0]);
    if (index == 1)
      this.state.trim_sheet.cmpt2 =
        Number(baggage_final[1]) + Number(cargo_final[1]);
    if (index == 2)
      this.state.trim_sheet.cmpt3 =
        Number(baggage_final[2]) + Number(cargo_final[2]);
    if (index == 3)
      this.state.trim_sheet.cmpt4 =
        Number(baggage_final[3]) + Number(cargo_final[3]);

    if (Number(cargo_final[index]) < 0 || Number(baggage_final[index]) < 0) {
      let message = `For C-${
        index + 1
      } Cargo & Baggage should be positive value`;
      //console.log("Errror: ", message);
      this.setState({ cargoBaggageError: message });
    } else if (total > this.state.compLimits[index]) {
      let message = `For C-${
        index + 1
      } total of Cargo & Baggage should be less then Max limit ${
        this.state.compLimits[index]
      }`;
      //console.log("Errror: ", message);
      this.setState({ cargoBaggageError: message });
    } else {
      this.setState({
        cargoLDMArray: cargo_final,
        baggageLDMArray: baggage_final,
        cargoOpen: false,
        cargoBaggageError: "",
      });
    }
  }

  actLoadDistStrToString(actloadDistStr) {
    var data = actloadDistStr;
    var si_final = "";
    if (data) {
      var split1 = data.split("#");
      split1.forEach((item, index) => {
        const val = item.split("$");
        const position = val[4];
        const loadType = val[6] && val[6];
        const remarks = val[7] && ` ${val[7]}`;
        if (loadType !== "") {
          si_final =
            index === 0
              ? `CPT(${position}) ${loadType}${remarks}`
              : `${si_final}${
                  (loadType || remarks) && ", "
                }CPT(${position}) ${loadType}${remarks}`;
        } else if (remarks !== "") {
          si_final =
            index === 0
              ? `${val[7]}`
              : `${si_final}${(loadType || remarks) && ","}${remarks}`;
        } else {
          si_final = si_final;
        }
      });
    }
    console.log(si_final, "si final");
    return si_final.toUpperCase();
  }

  ConvertActloadDistStrV2ToActloadDistStrV1(actloadDistStrV2) {
    var finalActLoadDistStrV1 = "";
    var actLoadDistStrV1 = "";
    var actStr = "";
    var rowArry = [];
    var rowCnt = 0;
    var loadDistStrV2Arry = actloadDistStrV2.split("#");
    //loadDistStrV2Arry.forEach(rowStr => {
    for (var i = 0; i < loadDistStrV2Arry.length; i++) {
      var rowStr = loadDistStrV2Arry[i];
      console.log("Split data by / ", rowStr);
      if (rowStr) {
        rowArry = rowStr.split("$");
        if (rowArry.length < 1) break;
        if (actLoadDistStrV1 == "") {
          actLoadDistStrV1 =
            actLoadDistStrV1 +
            "$" +
            rowArry[0] +
            "$" +
            rowArry[2] +
            "$" +
            rowArry[3] +
            "$" +
            rowArry[4] +
            "$" +
            rowArry[5];
        } else {
          actLoadDistStrV1 =
            actLoadDistStrV1 +
            "$$" +
            rowArry[0] +
            "$" +
            rowArry[2] +
            "$" +
            rowArry[3] +
            "$" +
            rowArry[4] +
            "$" +
            rowArry[5];
        }
        actStr = actStr + "$" + rowArry[1];
        rowCnt++;
      }
      if (rowCnt > 12) {
        break;
      }
    }
    if (rowCnt < 12) {
      for (var i = rowCnt; i <= 12; i++) {
        actLoadDistStrV1 = actLoadDistStrV1 + "$$0$$0$$";
        actStr = actStr + "$0";
      }
    }
    finalActLoadDistStrV1 = actLoadDistStrV1 + actStr;
    console.log("cargoActLoadData value ", finalActLoadDistStrV1);
    this.setState({
      cargoActLoadData: finalActLoadDistStrV1,
      cargoData: actloadDistStrV2,
      si: this.actLoadDistStrToString(actloadDistStrV2),
    });
  }
  inputOnChange() {
    console.log("Changed...");
    var rtow1 = parseInt(
      parseInt(this.state.olw_final) + parseInt(this.state.trip_fuel_final)
    );
    var rtow2 = parseInt(
      parseInt(this.state.mzfw) + parseInt(this.state.take_of_fuel_final)
    );
    var rtow3 = parseInt(this.state.otow_final);

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
  getSTA(fims) {
    if (fims.ETA == null || fims.ETA === undefined) {
      return fims.STA;
    }
    return fims.STA;
  }
  getSTD(fims) {
    if (fims.ETD == null) {
      return fims.STD;
    }
    return fims.STD;
  }
  formatDate(str) {
    if (str == null) {
      return "-";
    }
    return moment(str).format("YYYY-MM-DD");
  }
  formatTime(str) {
    if (str == null) {
      return "-";
    }
    return moment(str).format("HH:mm");
  }




  render() {
    var classes = this.props.classes;
    var fims = this.state.fims_data;
    var theme = window.localStorage.getItem("app_theme");
    var maxCabin = [];
    const formInputClass = `${
      theme === "dark" ? "form-control-dark" : "form-control-light"
    }`;
    const SIInputClass = `${theme === "dark" ? "si-dark" : "si-light"}`;
    const flightInputNoLabelClass = `${
      theme === "dark"
        ? "flight-input-no-label-lmc-dark"
        : "flight-input-no-label-lmc-light"
    }`;
    const flightInputWithLabelClass = `${
      theme === "dark"
        ? "flight-input-with-label-lmc-dark"
        : "flight-input-with-label-lmc-light"
    }`;
    const flightLabel = `${
      theme === "dark" ? classes.flightLabelDark : classes.flightLabelLight
    }`;
    console.log("state in trimsheetlmc", this.state);

    // for(var i=0;i<this.state.fleetinfo.MaxCabin;i++){
    //   maxCabin.push(<div className={classes.formField}>
    //     <Typography className={classes.label} variant={'body1'}>Cabin Max Vlaue - {this.state.fleetinfo.MaxCabin - (i+1)}</Typography>
    //     <input
    //       type="number"
    //       className={formInputClass}
    //       value={this.state.AdjustStrv2[13+i]}
    //       disabled
    //     />
    //   </div>);
    // }

    return (
      <div className={classes.root}>
        {this.state.trimSheetOpen === false && (
          <div className={classes.maindiv}>
            <div className={classes.passenger}>
              <Typography
                className={classes.typo}
                variant="body1"
                style={{ textAlign: "center" }}
              >
                {fims.Flight_no}
              </Typography>
              <Typography
                className={classes.typo}
                variant="body1"
                style={{ textAlign: "center" }}
              >
                {this.formatDate(fims.Flight_Date)}
              </Typography>
              <Typography
                className={classes.typo}
                variant="body1"
                style={{ textAlign: "center" }}
              >
                {this.formatTime(fims.STA)}
              </Typography>
            </div>
            <div className={classes.passenger}>
              <Typography variant="body1" className={classes.typo}>
                {fims.Source}
              </Typography>
              <Typography variant="body1" className={classes.typo}>
                {this.props.match.params.Reg_no}
              </Typography>
              <Typography variant="body1" className={classes.typo}>
                {fims.Destination}
              </Typography>
            </div>
            <Divider></Divider>
            <div className={classes.form}>
              {/* Total Fuel */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  Take of Fuel (kg)
                </Typography>
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={3} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      {this.state.take_of_fuel}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <IconButton
                      aria-label="delete"
                      className={classes.iconbutton}
                      onClick={() => {
                        if (this.state.take_of_fuel_show.length !== 0) {
                          this.setState(
                            {
                              take_of_fuel_in_error: "",
                              take_of_fuel_lmc: this.state.take_of_fuel_show,
                              take_of_fuel_final:
                                parseInt(this.state.take_of_fuel_show) +
                                parseInt(this.state.take_of_fuel),
                            },
                            () => {
                              this.inputOnChange();
                            }
                          );
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={3} className={classes.flightInputContainer}>
                    <input
                      type="number"
                      className={flightInputNoLabelClass}
                      min="0"
                      maxLength="5"
                      ref="take_of_fuel_final"
                      placeholder={this.state.take_of_fuel_show}
                      value={
                        this.state.take_of_fuel_show == 0
                          ? ""
                          : this.state.take_of_fuel_show &&
                            Math.max("", this.state.take_of_fuel_show)
                      }
                      onChange={(event) => {
                        if (event.target.value == "") {
                          event.target.value = 0;
                        }
                        if (event.target.value.length > 5) {
                          return;
                        }
                        if (
                          event.target.value === null ||
                          event.target.value === undefined ||
                          event.target.value.trim().length === 0
                        ) {
                          this.setState(
                            {
                              take_of_fuel_show: event.target.value,
                              take_of_fuel_final: this.state.take_of_fuel,
                              take_of_fuel_lmc: "0",
                            },
                            function () {
                              this.inputOnChange();
                            }
                          );
                          return;
                        }
                        this.setState({
                          take_of_fuel_show: event.target.value,
                          take_of_fuel_in_error: "",
                        });
                      }}
                      onBlur={(event) => {
                        if (event.target.value.includes(".")) {
                          event.target.value = 0;
                        }
                        if (event.target.value.length > 5) {
                          return;
                        }
                        if (
                          event.target.value === null ||
                          event.target.value === undefined ||
                          event.target.value.trim().length === 0
                        ) {
                          this.setState(
                            {
                              take_of_fuel_show: event.target.value,
                              take_of_fuel_final: this.state.take_of_fuel,
                              take_of_fuel_lmc: "0",
                            },
                            function () {
                              this.inputOnChange();
                            }
                          );
                          return;
                        }
                        this.setState({
                          take_of_fuel_show: event.target.value,
                          take_of_fuel_in_error: "",
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <IconButton
                      aria-label="delete"
                      className={classes.iconbutton}
                      onClick={() => {
                        if (this.state.take_of_fuel_show.length !== 0) {
                          this.setState(
                            {
                              take_of_fuel_in_error: "",
                              take_of_fuel_lmc:
                                "-" + this.state.take_of_fuel_show,
                              take_of_fuel_final:
                                parseInt(this.state.take_of_fuel) -
                                parseInt(this.state.take_of_fuel_show),
                            },
                            () => {
                              this.inputOnChange();
                            }
                          );
                        }
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      &nbsp;=
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      {this.state.take_of_fuel_final}
                    </Typography>
                  </Grid>
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
                  <Grid item xs={3} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      {this.state.trip_fuel}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <IconButton
                      aria-label="delete"
                      className={classes.iconbutton}
                      onClick={() => {
                        if (this.state.trip_fuel_show.length !== 0) {
                          this.setState(
                            {
                              trip_fuel_in_error: "",
                              trip_fuel_lmc: this.state.trip_fuel_show,
                              trip_fuel_final:
                                parseInt(this.state.trip_fuel_show) +
                                parseInt(this.state.trip_fuel),
                            },
                            () => {
                              this.inputOnChange();
                            }
                          );
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={3} className={classes.flightInputContainer}>
                    <input
                      type="number"
                      className={flightInputNoLabelClass}
                      maxLength="5"
                      ref="trip_fuel_final"
                      placeholder={this.state.trip_fuel_show}
                      value={
                        this.state.trip_fuel_show == 0
                          ? ""
                          : this.state.trip_fuel_show &&
                            Math.max(0, this.state.trip_fuel_show)
                      }
                      onChange={(event) => {
                        if (event.target.value == "") {
                          event.target.value = 0;
                        }
                        if (event.target.value.length > 5) {
                          return;
                        }
                        if (
                          event.target.value === null ||
                          event.target.value === undefined ||
                          event.target.value.trim().length === 0
                        ) {
                          this.setState(
                            {
                              trip_fuel_show: event.target.value,
                              trip_fuel_final: this.state.trip_fuel,
                              trip_fuel_lmc: "0",
                            },
                            function () {
                              this.inputOnChange();
                            }
                          );
                          return;
                        }
                        this.setState({
                          trip_fuel_show: event.target.value,
                          trip_fuel_in_error: "",
                        });
                      }}
                      onBlur={(event) => {
                        if (event.target.value.includes(".")) {
                          event.target.value = 0;
                        }
                        if (event.target.value.length > 5) {
                          return;
                        }
                        if (
                          event.target.value === null ||
                          event.target.value === undefined ||
                          event.target.value.trim().length === 0
                        ) {
                          this.setState(
                            {
                              trip_fuel_show: event.target.value,
                              trip_fuel_final: this.state.trip_fuel,
                              trip_fuel_lmc: "0",
                            },
                            function () {
                              this.inputOnChange();
                            }
                          );
                          return;
                        }
                        this.setState({
                          trip_fuel_show: event.target.value,
                          trip_fuel_in_error: "",
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <IconButton
                      aria-label="delete"
                      className={classes.iconbutton}
                      onClick={() => {
                        if (this.state.trip_fuel_show.length !== 0) {
                          this.setState(
                            {
                              trip_fuel_in_error: "",
                              trip_fuel_lmc: "-" + this.state.trip_fuel_show,
                              trip_fuel_final:
                                parseInt(this.state.trip_fuel) -
                                parseInt(this.state.trip_fuel_show),
                            },
                            () => {
                              this.inputOnChange();
                            }
                          );
                        }
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      &nbsp;=
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      {this.state.trip_fuel_final}
                    </Typography>
                  </Grid>
                </Grid>
                {this.state.trip_fuel_in_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.trip_fuel_in_error}
                  </Typography>
                )}
              </div>
              {/* {--------OLW-------} */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  OLW
                </Typography>
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={3} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      {this.state.olw}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <IconButton
                      aria-label="delete"
                      className={classes.iconbutton}
                      onClick={() => {
                        if (this.state.olw_show.length !== 0) {
                          this.setState(
                            {
                              olw_error: "",
                              olw_lmc: this.state.olw_show,
                              olw_final:
                                parseInt(this.state.olw) +
                                parseInt(this.state.olw_show),
                            },
                            () => {
                              this.inputOnChange();
                            }
                          );
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={3} className={classes.flightInputContainer}>
                    <input
                      type="number"
                      className={flightInputNoLabelClass}
                      maxLength="5"
                      ref="olw_final"
                      placeholder={this.state.olw_show}
                      value={
                        this.state.olw_show == 0
                          ? ""
                          : this.state.olw_show &&
                            Math.max(0, this.state.olw_show)
                      }
                      onChange={(event) => {
                        if (event.target.value == "") {
                          event.target.value = 0;
                        }
                        if (event.target.value.length > 5) {
                          return;
                        }
                        if (
                          event.target.value === null ||
                          event.target.value === undefined ||
                          event.target.value.trim().length === 0
                        ) {
                          this.setState(
                            {
                              olw_show: event.target.value,
                              olw_final: this.state.olw,
                              olw_lmc: "0",
                            },
                            function () {
                              this.inputOnChange();
                            }
                          );
                          return;
                        }
                        this.setState({
                          olw_show: event.target.value,
                          olw_error: "",
                        });
                      }}
                      onBlur={(event) => {
                        if (event.target.value.includes(".")) {
                          event.target.value = 0;
                        }
                        if (event.target.value.length > 5) {
                          return;
                        }
                        if (
                          event.target.value === null ||
                          event.target.value === undefined ||
                          event.target.value.trim().length === 0
                        ) {
                          this.setState(
                            {
                              olw_show: event.target.value,
                              olw_final: this.state.olw,
                              olw_lmc: "0",
                            },
                            function () {
                              this.inputOnChange();
                            }
                          );
                          return;
                        }
                        this.setState({
                          olw_show: event.target.value,
                          olw_error: "",
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <IconButton
                      aria-label="delete"
                      className={classes.iconbutton}
                      onClick={() => {
                        if (this.state.olw_show.length !== 0) {
                          this.setState(
                            {
                              olw_error: "",
                              olw_lmc: "-" + this.state.olw_show,
                              olw_final:
                                parseInt(this.state.olw) -
                                parseInt(this.state.olw_show),
                            },
                            () => {
                              this.inputOnChange();
                            }
                          );
                        }
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      &nbsp;=
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      {this.state.olw_final}
                    </Typography>
                  </Grid>
                </Grid>
                {this.state.olw_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.olw_error}
                  </Typography>
                )}
              </div>
              {/* {----------OTOW------------} */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  OTOW
                </Typography>
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={3} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      {this.state.otow}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <IconButton
                      aria-label="delete"
                      className={classes.iconbutton}
                      onClick={() => {
                        if (this.state.otow_show.length !== 0) {
                          this.setState(
                            {
                              otow_error: "",
                              otow_lmc: this.state.otow_show,
                              otow_final:
                                parseInt(this.state.otow) +
                                parseInt(this.state.otow_show),
                            },
                            () => {
                              this.inputOnChange();
                            }
                          );
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={3} className={classes.flightInputContainer}>
                    <input
                      type="number"
                      className={flightInputNoLabelClass}
                      maxLength="5"
                      ref="otow_final"
                      placeholder={this.state.otow_show}
                      value={
                        this.state.otow_show == 0
                          ? ""
                          : this.state.otow_show &&
                            Math.max(0, this.state.otow_show)
                      }
                      onChange={(event) => {
                        if (event.target.value == "") {
                          event.target.value = 0;
                        }
                        if (event.target.value.length > 5) {
                          return;
                        }
                        if (
                          event.target.value === null ||
                          event.target.value === undefined ||
                          event.target.value.trim().length === 0
                        ) {
                          this.setState(
                            {
                              otow_show: event.target.value,
                              otow_final: this.state.otow,
                              otow_lmc: "0",
                            },
                            function () {
                              this.inputOnChange();
                            }
                          );
                          return;
                        }
                        this.setState({
                          otow_show: event.target.value,
                          otow_error: "",
                        });
                      }}
                      onBlur={(event) => {
                        if (event.target.value.includes(".")) {
                          event.target.value = 0;
                        }
                        if (event.target.value.length > 5) {
                          return;
                        }
                        if (
                          event.target.value === null ||
                          event.target.value === undefined ||
                          event.target.value.trim().length === 0
                        ) {
                          this.setState(
                            {
                              otow_show: event.target.value,
                              otow_final: this.state.otow,
                              otow_lmc: "0",
                            },
                            function () {
                              this.inputOnChange();
                            }
                          );
                          return;
                        }
                        this.setState({
                          otow_show: event.target.value,
                          otow_error: "",
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <IconButton
                      aria-label="delete"
                      className={classes.iconbutton}
                      onClick={() => {
                        if (this.state.otow_show.length !== 0) {
                          this.setState(
                            {
                              otow_error: "",
                              otow_lmc: "-" + this.state.otow_show,
                              otow_final:
                                parseInt(this.state.otow) -
                                parseInt(this.state.otow_show),
                            },
                            () => {
                              this.inputOnChange();
                            }
                          );
                        }
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      &nbsp;=
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      {this.state.otow_final}
                    </Typography>
                  </Grid>
                </Grid>
                {this.state.otow_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.otow_error}
                  </Typography>
                )}
              </div>
              {/* {------------RTOW------------} */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  RTOW
                </Typography>
                <Grid container className={classes.flightContainer}>
                  {/* <Grid item xs={3} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>{this.state.rtow}</Typography>
                        </Grid>
                        <Grid item xs={1} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>+</Typography>
                        </Grid> */}
                  <Grid
                    item
                    xs={12}
                    container
                    className={classes.flightInputContainer}
                  >
                    <input
                      disabled
                      type="number"
                      className={formInputClass}
                      ref="rtow"
                      value={this.state.rtow && Math.max(0, this.state.rtow)}
                      onChange={(event) => {
                        if (event.target.value == "") {
                          event.target.value = 0;
                        }
                        this.setState({
                          rtow_lmc: event.target.value,
                          rtow_error: "",
                        });
                      }}
                      onBlur={(event) => {
                        if (event.target.value.includes(".")) {
                          event.target.value = 0;
                        }
                        this.setState({
                          rtow_lmc: event.target.value,
                          rtow_error: "",
                        });
                      }}
                    />
                  </Grid>
                  {/* <Grid item xs={1} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>&nbsp;=</Typography>
                        </Grid>
                        <Grid item xs={3} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>{this.state.rtow_final}</Typography>
                        </Grid> */}
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
                          ref="pax"
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
              {/* Cargo */}
              <div className={classes.formField}>
                {Object.keys(this.state.baggageLDMArray).length > 0 && (
                  <Typography className={classes.label} variant={"body1"}>
                    CARGO/BAGGAGE
                  </Typography>
                )}
                <Grid container>
                  {Object.keys(this.state.baggageLDMArray).map((item, i) => {
                    return (
                      <Grid item xs={6} key={i}>
                        <CssTextField
                          id="outlined-number"
                          label={"C-" + (i + 1)}
                          type="text"
                          className={classes.textfield}
                          variant="outlined"
                          ref="cargo_lmc"
                          InputProps={{
                            className: classes.input,
                          }}
                          inputProps={{
                            dataIndex: i,
                          }}
                          value={
                            this.state.cargoLDMArray[item] +
                            "/" +
                            this.state.baggageLDMArray[item]
                          }
                          onClick={() => {
                            this.setState({ cargoOpen: true, currentCargo: i });
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

              {/* <div className={classes.formField}>
            {Object.keys(this.state.cargo).length > 0 && <Typography className={classes.label} variant={'body1'}>CARGO/BAGGAGE</Typography>}
              <Grid container className={classes.flightContainer}>
                <Grid item xs={12} className={classes.flightInputContainer}>
                    <CssTextField
                      id="outlined-number"
                      type="text"
                      className={formInputClass}
                      variant="outlined"
                      InputProps={{
                        className: classes.input,
                      }}
                      value={this.state.cargoDisplay}
                      onClick={() => {
                        this.setState({ 'pax1_error': '', 'cargoOpen': true });
                      }}
                    />
                  </Grid>
              </Grid>
              {this.state.pax1_error && <Typography variant={"body2"} className={classes.error}>{this.state.cargo1_error}</Typography>}
            </div> */}

              {/* Cargo commented on 05/07/2021 */}
              {/* <div className={classes.formField}>
              {Object.keys(this.state.cargo).length > 0 && <Typography className={classes.label} variant={'body1'}>CARGO/BAGGAGE</Typography>}
              {Object.keys(this.state.cargo).map((item, i) => {
                console.log("state in cargo",this.state)
                return <Grid container key={i}>
                  <Grid item xs={3} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={'body1'}>{this.state.cargo[i]}</Typography>
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                  <IconButton aria-label="delete" className={classes.iconbutton} onClick={()=>{
                    console.log("add button event",i)
                    this.cargoAdd(i)
                  }}>
                    <AddIcon />
                  </IconButton>
                </Grid>
                  <Grid item xs={3} >
                    <CssTextField
                      id="cargo"
                      label={"C-" + (i + 1)}
                      type="number"
                      className={classes.textfield}
                      variant="outlined"
                      InputProps={{
                        className: classes.input
                      }}
                      inputProps={{
                        dataIndex: i
                      }}
                      onBlur={(event) => {
                        this.handleFocusOut(event.target.getAttribute('dataindex'), event.target.value)
                        this.setState({ 'cargo1_error': '' });
                      }}
                      value={this.state.cargo_show[item] && Math.max(0, this.state.cargo_show[item])}
                      onChange={(event) => {
                        if (event.target.value.length > 4) {
                          return;
                        }
                        this.handleCargo(event.target.getAttribute('dataindex'), event.target.value)
                        this.setState({ 'cargo1_error': '' });
                      }}
                    />
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                  <IconButton aria-label="delete" className={classes.iconbutton}onClick={()=>{
                    console.log("remove button event",i)
                    this.cargoSubtract(i)
                  }}>
                    <RemoveIcon />
                  </IconButton>
                </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={'body1'}>&nbsp;=</Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={'body1'}>{this.state.cargo_final[item]}</Typography>
                  </Grid>
                </Grid>

              })}
              {this.state.cargo1_error && <Typography variant={"body2"} className={classes.error}>{this.state.cargo1_error}</Typography>}
            </div> */}

              {/* Cockpit occu. */}
              {this.state.LTAdjust.CockpitOccupantPerKG && (
                <div className={classes.formField}>
                  <Typography className={classes.label}>
                    Cockpit Occuptant
                  </Typography>
                  <Grid container className={classes.flightContainer}>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.cockpitOccupent}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          this.setState({
                            cockpit_error: "",
                            cockpitOccupent_lmc:
                              this.state.cockpitOccupent_show,
                            cockpitOccupent_final:
                              parseInt(this.state.cockpitOccupent_show) +
                              parseInt(this.state.cockpitOccupent),
                          });
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={3} className={classes.flightInputContainer}>
                      <input
                        type="number"
                        className={flightInputNoLabelClass}
                        ref="cockpitOccupent"
                        placeholder={this.state.cockpitOccupent_show}
                        value={
                          this.state.cockpitOccupent_show == 0
                            ? ""
                            : this.state.cockpitOccupent_show &&
                              Math.max(0, this.state.cockpitOccupent_show)
                        }
                        onChange={(event) => {
                          if (event.target.value == "") {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              cockpitOccupent_show: event.target.value,
                              cockpitOccupent_final: this.state.first_observer,
                              cockpitOccupent_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            cockpitOccupent_show: event.target.value,
                            cockpit_error: "",
                          });
                        }}
                        onBlur={(event) => {
                          if (event.target.value.includes(".")) {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              cockpitOccupent_show: event.target.value,
                              cockpitOccupent_final: this.state.first_observer,
                              cockpitOccupent_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            cockpitOccupent_show: event.target.value,
                            cockpit_error: "",
                          });
                        }}
                      />
                    </Grid>
                    {/* <Grid item xs={3} className={classes.flightInputContainer} >
                  <FormControl className={classes.flightDropdown}>
                    <Select
                      value={this.state.cockpitOccupent_show}
                      onChange={(event) => {

                        this.setState({ 'cockpitOccupent_show': event.target.value, 'cockpit_error': '' })
                      }}
                      classes={{
                        'icon': classes.downIcon,
                        'select': classes.selectFocus,
                      }}
                      displayEmpty
                      input={<SelectInput />} ref ="cockpitOccupent_final_ref"
                    >
                      <MenuItem value={0}>0</MenuItem>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          this.setState({
                            cockpit_error: "",
                            cockpitOccupent_lmc: Number(
                              "-" + this.state.cockpitOccupent_show
                            ),
                            cockpitOccupent_final:
                              parseInt(this.state.cockpitOccupent) -
                              parseInt(this.state.cockpitOccupent_show),
                          });
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        &nbsp;=
                      </Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.cockpitOccupent_final}
                      </Typography>
                    </Grid>
                  </Grid>
                  {this.state.cockpit_error && (
                    <Typography variant={"body2"} className={classes.error}>
                      {this.state.cockpit_error}
                    </Typography>
                  )}
                </div>
              )}
              {/* {First Observer} */}
              {this.state.LTAdjust.FirstObserver && (
                <div className={classes.formField}>
                  <Typography className={classes.label} variant={"body1"}>
                    First Observer
                  </Typography>
                  <Grid container className={classes.flightContainer}>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.first_observer}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          if (this.state.first_observer_show.length !== 0) {
                            this.setState({
                              first_observer_error: "",
                              first_observer_lmc:
                                this.state.first_observer_show,
                              first_observer_final:
                                parseInt(this.state.first_observer_show) +
                                parseInt(this.state.first_observer),
                            });
                          }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={3} className={classes.flightInputContainer}>
                      <input
                        type="number"
                        className={flightInputNoLabelClass}
                        ref="first_observer"
                        placeholder={this.state.first_observer_show}
                        value={
                          this.state.first_observer_show == 0
                            ? ""
                            : this.state.first_observer_show &&
                              Math.max(0, this.state.first_observer_show)
                        }
                        onChange={(event) => {
                          if (event.target.value == "") {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              first_observer_show: event.target.value,
                              first_observer_final: this.state.first_observer,
                              first_observer_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            first_observer_show: event.target.value,
                            first_observer_error: "",
                          });
                        }}
                        onBlur={(event) => {
                          if (event.target.value.includes(".")) {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              first_observer_show: event.target.value,
                              first_observer_final: this.state.first_observer,
                              first_observer_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            first_observer_show: event.target.value,
                            first_observer_error: "",
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          if (this.state.first_observer_show.length !== 0) {
                            this.setState({
                              first_observer_error: "",
                              first_observer_lmc:
                                "-" + this.state.first_observer_show,
                              first_observer_final:
                                parseInt(this.state.first_observer) -
                                parseInt(this.state.first_observer_show),
                            });
                          }
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        &nbsp;=
                      </Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.first_observer_final}
                      </Typography>
                    </Grid>
                  </Grid>
                  {this.state.first_observer_error && (
                    <Typography variant={"body2"} className={classes.error}>
                      {this.state.first_observer_error}
                    </Typography>
                  )}
                </div>
              )}

              {/* Second Observer*/}
              {this.state.LTAdjust.SecondObserver && (
                <div className={classes.formField}>
                  <Typography className={classes.label} variant={"body1"}>
                    Second Observer
                  </Typography>
                  <Grid container className={classes.flightContainer}>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.second_observer}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          if (this.state.second_observer_show.length !== 0) {
                            this.setState({
                              second_observer_error: "",
                              second_observer_lmc:
                                this.state.second_observer_show,
                              second_observer_final:
                                parseInt(this.state.second_observer_show) +
                                parseInt(this.state.second_observer),
                            });
                          }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={3} className={classes.flightInputContainer}>
                      <input
                        type="number"
                        className={flightInputNoLabelClass}
                        ref="second_observer"
                        placeholder={this.state.second_observer_show}
                        value={
                          this.state.second_observer_show == 0
                            ? ""
                            : this.state.second_observer_show &&
                              Math.max(0, this.state.second_observer_show)
                        }
                        onChange={(event) => {
                          if (event.target.value == "") {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              second_observer_show: event.target.value,
                              second_observer_final: this.state.second_observer,
                              second_observer_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            second_observer_show: event.target.value,
                            second_observer_error: "",
                          });
                        }}
                        onBlur={(event) => {
                          if (event.target.value.includes(".")) {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              second_observer_show: event.target.value,
                              second_observer_final: this.state.second_observer,
                              second_observer_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            second_observer_show: event.target.value,
                            second_observer_error: "",
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          if (this.state.second_observer_show.length !== 0) {
                            this.setState({
                              second_observer_error: "",
                              second_observer_lmc:
                                "-" + this.state.second_observer_show,
                              second_observer_final:
                                parseInt(this.state.second_observer) -
                                parseInt(this.state.second_observer_show),
                            });
                          }
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        &nbsp;=
                      </Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.second_observer_final}
                      </Typography>
                    </Grid>
                  </Grid>
                  {this.state.second_observer_error && (
                    <Typography variant={"body2"} className={classes.error}>
                      {this.state.second_observer_error}
                    </Typography>
                  )}
                </div>
              )}

              {/* {Super numeraries} */}
              {this.state.LTAdjust.Supernumeraries && (
                <div className={classes.formField}>
                  <Typography className={classes.label} variant={"body1"}>
                    Super numeraries
                  </Typography>
                  <Grid container className={classes.flightContainer}>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.super_numeraries}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          if (this.state.super_numeraries_show.length !== 0) {
                            this.setState({
                              super_numeraries_error: "",
                              super_numeraries_lmc:
                                this.state.super_numeraries_show,
                              super_numeraries_final:
                                parseInt(this.state.super_numeraries_show) +
                                parseInt(this.state.super_numeraries),
                            });
                          }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={3} className={classes.flightInputContainer}>
                      <input
                        type="number"
                        className={flightInputNoLabelClass}
                        ref="super_numeraries"
                        placeholder={this.state.super_numeraries_show}
                        value={
                          this.state.super_numeraries_show == 0
                            ? ""
                            : this.state.super_numeraries_show &&
                              Math.max(0, this.state.super_numeraries_show)
                        }
                        onChange={(event) => {
                          if (event.target.value == "") {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              super_numeraries_show: event.target.value,
                              super_numeraries_final:
                                this.state.super_numeraries,
                              super_numeraries_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            super_numeraries_show: event.target.value,
                            super_numeraries_error: "",
                          });
                        }}
                        onBlur={(event) => {
                          if (event.target.value.includes(".")) {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              super_numeraries_show: event.target.value,
                              super_numeraries_final:
                                this.state.super_numeraries,
                              super_numeraries_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            super_numeraries_show: event.target.value,
                            super_numeraries_error: "",
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          if (this.state.super_numeraries_show.length !== 0) {
                            this.setState({
                              super_numeraries_error: "",
                              super_numeraries_lmc:
                                "-" + this.state.super_numeraries_show,
                              super_numeraries_final:
                                parseInt(this.state.super_numeraries) -
                                parseInt(this.state.super_numeraries_show),
                            });
                          }
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        &nbsp;=
                      </Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.super_numeraries_final}
                      </Typography>
                    </Grid>
                  </Grid>
                  {this.state.super_numeraries_error && (
                    <Typography variant={"body2"} className={classes.error}>
                      {this.state.super_numeraries_error}
                    </Typography>
                  )}
                </div>
              )}

              {/* Galley */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  Galley (Kg)
                </Typography>
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={3} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      {parseInt(this.state.fwd_galley) +
                        (this.state.fleetinfo.StdFwdGalley
                          ? parseInt(this.state.fleetinfo.StdFwdGalley)
                          : 0)}
                      {/* {parseInt(this.state.fwd_galley)} */}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <IconButton
                      aria-label="delete"
                      className={classes.iconbutton}
                      onClick={() => {
                        if (this.state.fwd_galley_show.length !== 0) {
                          this.setState({
                            Fwdgalley_error: "",
                            fwd_galley_lmc: this.state.fwd_galley_show,
                            fwd_galley_final:
                              parseInt(this.state.fwd_galley_show) +
                              parseInt(this.state.fwd_galley) +
                              (this.state.fleetinfo.StdFwdGalley
                                ? parseInt(this.state.fleetinfo.StdFwdGalley)
                                : 0),
                          });
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography className={flightLabel} variant={"body1"}>
                      FWD
                    </Typography>
                    {/* <FormControl > */}
                    <input
                      type="number"
                      ref="fwd_galley_final"
                      className={flightInputWithLabelClass}
                      placeholder={this.state.fwd_galley_show}
                      value={
                        this.state.fwd_galley_show == 0
                          ? ""
                          : this.state.fwd_galley_show &&
                            Math.max(0, this.state.fwd_galley_show)
                      }
                      onChange={(event) => {
                        if (event.target.value == "") {
                          event.target.value = 0;
                        }
                        if (event.target.value.length > 3) {
                          return;
                        }
                        if (
                          event.target.value === null ||
                          event.target.value === undefined ||
                          event.target.value.trim().length === 0
                        ) {
                          this.setState({
                            fwd_galley_show: event.target.value,
                            fwd_galley_lmc: 0,
                          });
                          return;
                        }
                        this.setState({
                          fwd_galley_show: event.target.value,
                          Fwdgalley_error: "",
                        });
                      }}
                      onBlur={(event) => {
                        if (event.target.value.includes(".")) {
                          event.target.value = 0;
                        }
                        if (event.target.value.length > 3) {
                          return;
                        }
                        if (
                          event.target.value === null ||
                          event.target.value === undefined ||
                          event.target.value.trim().length === 0
                        ) {
                          this.setState({
                            fwd_galley_show: event.target.value,
                            fwd_galley_lmc: 0,
                          });
                          return;
                        }
                        this.setState({
                          fwd_galley_show: event.target.value,
                          Fwdgalley_error: "",
                        });
                      }}
                    />
                    {/* </FormControl> */}
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <IconButton
                      aria-label="delete"
                      className={classes.iconbutton}
                      onClick={() => {
                        if (this.state.fwd_galley_show.length !== 0) {
                          this.setState({
                            Fwdgalley_error: "",
                            fwd_galley_lmc: "-" + this.state.fwd_galley_show,
                            fwd_galley_final:
                              parseInt(this.state.fwd_galley) +
                              (this.state.fleetinfo.StdFwdGalley
                                ? parseInt(this.state.fleetinfo.StdFwdGalley)
                                : 0) -
                              parseInt(this.state.fwd_galley_show),
                          });
                        }
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      &nbsp;=
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      {this.state.fwd_galley_final}
                    </Typography>
                  </Grid>
                </Grid>
                {this.state.Fwdgalley_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.Fwdgalley_error}
                  </Typography>
                )}
                <Grid container className={classes.flightContainer}>
                  <Grid item xs={3} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      {parseInt(this.state.aft_galley) +
                        (this.state.fleetinfo.StdAftGalley
                          ? parseInt(this.state.fleetinfo.StdAftGalley)
                          : 0)}
                      {/* {parseInt(this.state.fleetinfo.StdAftGalley)} */}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <IconButton
                      aria-label="delete"
                      className={classes.iconbutton}
                      onClick={() => {
                        if (this.state.aft_galley_show.length !== 0) {
                          this.setState({
                            Aftrgalley_error: "",
                            aft_galley_lmc: this.state.aft_galley_show,
                            aft_galley_final:
                              parseInt(this.state.aft_galley_show) +
                              parseInt(this.state.aft_galley) +
                              (this.state.fleetinfo.StdAftGalley
                                ? parseInt(this.state.fleetinfo.StdAftGalley)
                                : 0),
                          });
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography className={flightLabel} variant={"body1"}>
                      AFT
                    </Typography>
                    {/* <FormControl > */}
                    <input
                      type="number"
                      className={flightInputWithLabelClass}
                      ref="aft_galley_final"
                      placeholder={this.state.aft_galley_show}
                      value={
                        this.state.aft_galley_show == 0
                          ? ""
                          : this.state.aft_galley_show &&
                            Math.max(0, this.state.aft_galley_show)
                      }
                      onChange={(event) => {
                        if (event.target.value == "") {
                          event.target.value = 0;
                        }
                        if (event.target.value.length > 3) {
                          return;
                        }
                        if (
                          event.target.value === null ||
                          event.target.value === undefined ||
                          event.target.value.trim().length === 0
                        ) {
                          this.setState({
                            aft_galley_show: event.target.value,
                            aft_galley_lmc: 0,
                          });
                          return;
                        }
                        this.setState({
                          aft_galley_show: event.target.value,
                          Aftrgalley_error: "",
                        });
                      }}
                      onBlur={(event) => {
                        if (event.target.value.includes(".")) {
                          event.target.value = 0;
                        }
                        if (event.target.value.length > 3) {
                          return;
                        }
                        if (
                          event.target.value === null ||
                          event.target.value === undefined ||
                          event.target.value.trim().length === 0
                        ) {
                          this.setState({
                            aft_galley_show: event.target.value,
                            aft_galley_lmc: 0,
                          });
                          return;
                        }
                        this.setState({
                          aft_galley_show: event.target.value,
                          Aftrgalley_error: "",
                        });
                      }}
                    />
                    {/* </FormControl> */}
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <IconButton
                      aria-label="delete"
                      className={classes.iconbutton}
                      onClick={() => {
                        if (this.state.aft_galley_show.length !== 0) {
                          this.setState({
                            Aftrgalley_error: "",
                            aft_galley_lmc: "-" + this.state.aft_galley_show,
                            aft_galley_final:
                              parseInt(this.state.aft_galley) +
                              (this.state.fleetinfo.StdAftGalley
                                ? parseInt(this.state.fleetinfo.StdAftGalley)
                                : 0) -
                              parseInt(this.state.aft_galley_show),
                          });
                        }
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      &nbsp;=
                    </Typography>
                  </Grid>
                  <Grid item xs={3} className={classes.FlightFront}>
                    <Typography className={classes.label} variant={"body1"}>
                      {this.state.aft_galley_final}
                    </Typography>
                  </Grid>
                </Grid>
                {this.state.Aftrgalley_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.Aftrgalley_error}
                  </Typography>
                )}
              </div>

              {/* Cabin Baggage */}
              {this.state.LTAdjust.CabinBaggagePerKg != null && (
                <div className={classes.formField}>
                  <Typography className={classes.label} variant={"body1"}>
                    CABIN BAGGAGE (kg)
                  </Typography>
                  <Grid container className={classes.flightContainer}>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.cabin_baggage +
                          (this.state.fleetinfo.StdCabinBaggage
                            ? parseInt(this.state.fleetinfo.StdCabinBaggage)
                            : 0)}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          if (this.state.cabin_baggage_show.length !== 0) {
                            this.setState({
                              cabin_baggage_error: "",
                              cabin_baggage_lmc: this.state.cabin_baggage_show,
                              cabin_baggage_final:
                                parseInt(this.state.cabin_baggage_show) +
                                parseInt(this.state.cabin_baggage) +
                                (this.state.fleetinfo.StdCabinBaggage
                                  ? parseInt(
                                      this.state.fleetinfo.StdCabinBaggage
                                    )
                                  : 0),
                            });
                          }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={3} className={classes.flightInputContainer}>
                      <input
                        type="number"
                        className={flightInputNoLabelClass}
                        ref="cabin_baggage_final"
                        placeholder={this.state.cabin_baggage_show}
                        value={
                          this.state.cabin_baggage_show == 0
                            ? ""
                            : this.state.cabin_baggage_show &&
                              Math.max(0, this.state.cabin_baggage_show)
                        }
                        onChange={(event) => {
                          if (event.target.value == "") {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              cabin_baggage_show: event.target.value,
                              cabin_baggage_final: this.state.cabin_baggage,
                              cabin_baggage_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            cabin_baggage_show: event.target.value,
                            cabin_baggage_error: "",
                          });
                        }}
                        onBlur={(event) => {
                          if (event.target.value.includes(".")) {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              cabin_baggage_show: event.target.value,
                              cabin_baggage_final: this.state.cabin_baggage,
                              cabin_baggage_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            cabin_baggage_show: event.target.value,
                            cabin_baggage_error: "",
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          if (this.state.cabin_baggage_show.length !== 0) {
                            this.setState({
                              cabin_baggage_error: "",
                              cabin_baggage_lmc:
                                "-" + this.state.cabin_baggage_show,
                              cabin_baggage_final:
                                parseInt(this.state.cabin_baggage) +
                                (this.state.fleetinfo.StdCabinBaggage
                                  ? parseInt(
                                      this.state.fleetinfo.StdCabinBaggage
                                    )
                                  : 0) -
                                parseInt(this.state.cabin_baggage_show),
                            });
                          }
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        &nbsp;=
                      </Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.cabin_baggage_final}
                      </Typography>
                    </Grid>
                  </Grid>
                  {this.state.cabin_baggage_error && (
                    <Typography variant={"body2"} className={classes.error}>
                      {this.state.cabin_baggage_error}
                    </Typography>
                  )}
                </div>
              )}

              {/* Jump */}
              {
                <div className={classes.formField}>
                  <Typography className={classes.label} variant={"body1"}>
                    Jump
                  </Typography>
                  {this.state.LTAdjust.FwdJumpPerKg != null && (
                    <Grid container className={classes.flightContainer}>
                      <Grid item xs={3} className={classes.FlightFront}>
                        <Typography className={classes.label} variant={"body1"}>
                          {parseInt(this.state.fwd_jump) +
                            (this.state.fleetinfo.StdFwdJump
                              ? parseInt(this.state.fleetinfo.StdFwdJump)
                              : 0)}
                          {/* {parseInt(this.state.fwd_jump)} */}
                        </Typography>
                      </Grid>
                      <Grid item xs={1} className={classes.FlightFront}>
                        <IconButton
                          aria-label="delete"
                          className={classes.iconbutton}
                          onClick={() => {
                            this.setState({
                              Fwdjump_error: "",
                              fwd_jump_lmc: this.state.fwd_jump_show,
                              fwd_jump_final:
                                parseInt(this.state.fwd_jump_show) +
                                parseInt(this.state.fwd_jump) +
                                (this.state.fleetinfo.StdFwdJump
                                  ? parseInt(this.state.fleetinfo.StdFwdJump)
                                  : 0),
                            });
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography className={flightLabel} variant={"body1"}>
                          FWD
                        </Typography>
                        <input
                          type="number"
                          className={flightInputNoLabelClass}
                          ref="fwd_jump"
                          placeholder={this.state.fwd_jump_show}
                          value={
                            this.state.fwd_jump_show == 0
                              ? ""
                              : this.state.fwd_jump_show &&
                                Math.max(0, this.state.fwd_jump_show)
                          }
                          onChange={(event) => {
                            if (event.target.value == "") {
                              event.target.value = 0;
                            }
                            if (event.target.value.length > 3) {
                              return;
                            }
                            if (
                              event.target.value === null ||
                              event.target.value === undefined ||
                              event.target.value.trim().length === 0
                            ) {
                              this.setState({
                                fwd_jump_show: event.target.value,
                                fwd_jump_final: this.state.fwd_jump,
                                fwd_jump_lmc: 0,
                              });
                              return;
                            }
                            this.setState({
                              fwd_jump_show: event.target.value,
                              Fwdjump_error: "",
                            });
                          }}
                          onBlur={(event) => {
                            if (event.target.value.includes(".")) {
                              event.target.value = 0;
                            }
                            if (event.target.value.length > 3) {
                              return;
                            }
                            if (
                              event.target.value === null ||
                              event.target.value === undefined ||
                              event.target.value.trim().length === 0
                            ) {
                              this.setState({
                                fwd_jump_show: event.target.value,
                                fwd_jump_final: this.state.fwd_jump,
                                fwd_jump_lmc: 0,
                              });
                              return;
                            }
                            this.setState({
                              fwd_jump_show: event.target.value,
                              Fwdjump_error: "",
                            });
                          }}
                        />
                        {/* <FormControl className={classes.flightDropdown}>
                    <Select
                      value={this.state.fwd_jump_show}
                      onChange={(event) => {
                        this.setState({ 'fwd_jump_show': event.target.value, 'Fwdjump_error': ''})
                      }}
                      classes={{
                        'icon': classes.FlightdownIcon,
                        'select': classes.selectFocus,
                      }}
                      displayEmpty
                      input={<SelectInput />} ref="fwd_jump_final"
                    >
                      <MenuItem value={0}>0</MenuItem>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                    </Select>
                  </FormControl> */}
                      </Grid>

                      <Grid item xs={1} className={classes.FlightFront}>
                        <IconButton
                          aria-label="delete"
                          className={classes.iconbutton}
                          onClick={() => {
                            this.setState({
                              Fwdjump_error: "",
                              fwd_jump_lmc: Number(
                                "-" + this.state.fwd_jump_show
                              ),
                              fwd_jump_final:
                                parseInt(this.state.fwd_jump) +
                                (this.state.fleetinfo.StdFwdJump
                                  ? parseInt(this.state.fleetinfo.StdFwdJump)
                                  : 0) -
                                parseInt(this.state.fwd_jump_show),
                            });
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={1} className={classes.FlightFront}>
                        <Typography className={classes.label} variant={"body1"}>
                          &nbsp;=
                        </Typography>
                      </Grid>
                      <Grid item xs={3} className={classes.FlightFront}>
                        <Typography className={classes.label} variant={"body1"}>
                          {this.state.fwd_jump_final}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  {this.state.Fwdjump_error && (
                    <Typography variant={"body2"} className={classes.error}>
                      {this.state.Fwdjump_error}
                    </Typography>
                  )}
                  {this.state.LTAdjust.MidJumpPerKg != null && (
                    <Grid container className={classes.flightContainer}>
                      <Grid item xs={3} className={classes.FlightFront}>
                        <Typography className={classes.label} variant={"body1"}>
                          {parseInt(this.state.mid_jump) +
                            (this.state.fleetinfo.StdMidJump
                              ? parseInt(this.state.fleetinfo.StdMidJump)
                              : 0)}
                          {/* {parseInt(this.state.mid_jump)} */}
                        </Typography>
                      </Grid>
                      <Grid item xs={1} className={classes.FlightFront}>
                        <IconButton
                          aria-label="delete"
                          className={classes.iconbutton}
                          onClick={() => {
                            this.setState({
                              Midjump_error: "",
                              mid_jump_lmc: this.state.mid_jump_show,
                              mid_jump_final:
                                parseInt(this.state.mid_jump_show) +
                                parseInt(this.state.mid_jump) +
                                (this.state.fleetinfo.StdMidJump
                                  ? parseInt(this.state.fleetinfo.StdMidJump)
                                  : 0),
                            });
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography className={flightLabel} variant={"body1"}>
                          MID
                        </Typography>
                        <input
                          type="number"
                          className={flightInputNoLabelClass}
                          ref="mid_jump"
                          placeholder={this.state.mid_jump_show}
                          value={
                            this.state.mid_jump_show == 0
                              ? ""
                              : this.state.mid_jump_show &&
                                Math.max(0, this.state.mid_jump_show)
                          }
                          onChange={(event) => {
                            if (event.target.value == "") {
                              event.target.value = 0;
                            }
                            if (event.target.value.length > 3) {
                              return;
                            }
                            if (
                              event.target.value === null ||
                              event.target.value === undefined ||
                              event.target.value.trim().length === 0
                            ) {
                              this.setState({
                                mid_jump_show: event.target.value,
                                mid_jump_final: this.state.mid_jump,
                                mid_jump_lmc: 0,
                              });
                              return;
                            }
                            this.setState({
                              mid_jump_show: event.target.value,
                              Midjump_error: "",
                            });
                          }}
                          onBlur={(event) => {
                            if (event.target.value.includes(".")) {
                              event.target.value = 0;
                            }
                            if (event.target.value.length > 3) {
                              return;
                            }
                            if (
                              event.target.value === null ||
                              event.target.value === undefined ||
                              event.target.value.trim().length === 0
                            ) {
                              this.setState({
                                mid_jump_show: event.target.value,
                                mid_jump_final: this.state.mid_jump,
                                mid_jump_lmc: 0,
                              });
                              return;
                            }
                            this.setState({
                              mid_jump_show: event.target.value,
                              Midjump_error: "",
                            });
                          }}
                        />
                        {/* <FormControl className={classes.flightDropdown}>
                    <Select
                      value={this.state.mid_jump_show}
                      onChange={(event) => {
                        this.setState({ 'mid_jump_show': event.target.value, 'Midjump_error': ''})
                      }}
                      classes={{
                        'icon': classes.FlightdownIcon,
                        'select': classes.selectFocus,
                      }}
                      displayEmpty
                      input={<SelectInput />} ref="mid_jump_final"
                    >
                      <MenuItem value={0}>0</MenuItem>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                    </Select>
                  </FormControl> */}
                      </Grid>
                      <Grid item xs={1} className={classes.FlightFront}>
                        <IconButton
                          aria-label="delete"
                          className={classes.iconbutton}
                          onClick={() => {
                            this.setState({
                              Midjump_error: "",
                              mid_jump_lmc: Number(
                                "-" + this.state.mid_jump_show
                              ),
                              mid_jump_final:
                                parseInt(this.state.mid_jump) +
                                (this.state.fleetinfo.StdMidJump
                                  ? parseInt(this.state.fleetinfo.StdMidJump)
                                  : 0) -
                                parseInt(this.state.mid_jump_show),
                            });
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={1} className={classes.FlightFront}>
                        <Typography className={classes.label} variant={"body1"}>
                          &nbsp;=
                        </Typography>
                      </Grid>
                      <Grid item xs={3} className={classes.FlightFront}>
                        <Typography className={classes.label} variant={"body1"}>
                          {this.state.mid_jump_final}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  {this.state.Midjump_error && (
                    <Typography variant={"body2"} className={classes.error}>
                      {this.state.Midjump_error}
                    </Typography>
                  )}
                  {this.state.LTAdjust.AftJumpPerKG && (
                    <Grid container className={classes.flightContainer}>
                      <Grid item xs={3} className={classes.FlightFront}>
                        <Typography className={classes.label} variant={"body1"}>
                          {parseInt(this.state.aft_jump) +
                            (this.state.fleetinfo.StdAftJump
                              ? parseInt(this.state.fleetinfo.StdAftJump)
                              : 0)}
                          {/* {parseInt(this.state.aft_jump)} */}
                        </Typography>
                      </Grid>
                      <Grid item xs={1} className={classes.FlightFront}>
                        <IconButton
                          aria-label="delete"
                          className={classes.iconbutton}
                          onClick={() => {
                            this.setState({
                              Aftrjump_error: "",
                              aft_jump_lmc: this.state.aft_jump_show,
                              aft_jump_final:
                                parseInt(this.state.aft_jump_show) +
                                parseInt(this.state.aft_jump) +
                                (this.state.fleetinfo.StdAftJump
                                  ? parseInt(this.state.fleetinfo.StdAftJump)
                                  : 0),
                            });
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography className={flightLabel} variant={"body1"}>
                          AFT
                        </Typography>
                        <input
                          type="number"
                          className={flightInputNoLabelClass}
                          ref="aft_jump"
                          placeholder={this.state.aft_jump_show}
                          value={
                            this.state.aft_jump_show == 0
                              ? ""
                              : this.state.aft_jump_show &&
                                Math.max(0, this.state.aft_jump_show)
                          }
                          onChange={(event) => {
                            if (event.target.value == "") {
                              event.target.value = 0;
                            }
                            if (event.target.value.length > 3) {
                              return;
                            }
                            if (
                              event.target.value === null ||
                              event.target.value === undefined ||
                              event.target.value.trim().length === 0
                            ) {
                              this.setState({
                                aft_jump_show: event.target.value,
                                aft_jump_final: this.state.aft_jump,
                                aft_jump_lmc: 0,
                              });
                              return;
                            }
                            this.setState({
                              aft_jump_show: event.target.value,
                              Aftrjump_error: "",
                            });
                          }}
                          onBlur={(event) => {
                            if (event.target.value.includes(".")) {
                              event.target.value = 0;
                            }
                            if (event.target.value.length > 3) {
                              return;
                            }
                            if (
                              event.target.value === null ||
                              event.target.value === undefined ||
                              event.target.value.trim().length === 0
                            ) {
                              this.setState({
                                aft_jump_show: event.target.value,
                                aft_jump_final: this.state.portable_water,
                                aft_jump_lmc: 0,
                              });
                              return;
                            }
                            this.setState({
                              aft_jump_show: event.target.value,
                              Aftrjump_error: "",
                            });
                          }}
                        />
                        {/* <FormControl className={classes.flightDropdown}>
                    <Select
                      value={this.state.aft_jump_show}
                      onChange={(event) => {
                        this.setState({ 'aft_jump_show': event.target.value, 'Aftrjump_error': ''})
                      }}
                      classes={{
                        'icon': classes.FlightdownIcon,
                        'select': classes.selectFocus,
                      }}
                      displayEmpty
                      input={<SelectInput />} ref="aft_jump_final"
                    >
                      <MenuItem value={0}>0</MenuItem>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                    </Select>
                  </FormControl> */}
                      </Grid>
                      <Grid item xs={1} className={classes.FlightFront}>
                        <IconButton
                          aria-label="delete"
                          className={classes.iconbutton}
                          onClick={() => {
                            this.setState({
                              Aftrjump_error: "",
                              aft_jump_lmc: Number(
                                "-" + this.state.aft_jump_show
                              ),
                              aft_jump_final:
                                parseInt(this.state.aft_jump) +
                                (this.state.fleetinfo.StdAftJump
                                  ? parseInt(this.state.fleetinfo.StdAftJump)
                                  : 0) -
                                parseInt(this.state.aft_jump_show),
                            });
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={1} className={classes.FlightFront}>
                        <Typography className={classes.label} variant={"body1"}>
                          &nbsp;=
                        </Typography>
                      </Grid>
                      <Grid item xs={3} className={classes.FlightFront}>
                        <Typography className={classes.label} variant={"body1"}>
                          {this.state.aft_jump_final}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  {this.state.Aftrjump_error && (
                    <Typography variant={"body2"} className={classes.error}>
                      {this.state.Aftrjump_error}
                    </Typography>
                  )}
                </div>
              }

              {/* {Portable Water} */}
              {this.state.fleetinfo.MaxPortableWater && (
                <div className={classes.formField}>
                  <Typography className={classes.label} variant={"body1"}>
                    Portable Water
                  </Typography>
                  <Grid container className={classes.flightContainer}>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.portable_water +
                          (this.state.fleetinfo.StdPortableWater
                            ? parseInt(this.state.fleetinfo.StdPortableWater)
                            : 0)}
                        {/* {parseFloat(this.state.portable_water)} */}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          if (this.state.portable_water_show.length !== 0) {
                            this.setState({
                              portable_water_error: "",
                              portable_water_lmc:
                                this.state.portable_water_show,
                              portable_water_final:
                                parseInt(this.state.portable_water_show) +
                                parseInt(this.state.portable_water) +
                                (this.state.fleetinfo.StdPortableWater
                                  ? parseInt(
                                      this.state.fleetinfo.StdPortableWater
                                    )
                                  : 0),
                            });
                          }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={3} className={classes.flightInputContainer}>
                      <input
                        type="number"
                        className={flightInputNoLabelClass}
                        ref="portable_water"
                        placeholder={this.state.portable_water_show}
                        value={
                          this.state.portable_water_show == 0
                            ? ""
                            : this.state.portable_water_show &&
                              Math.max(0, this.state.portable_water_show)
                        }
                        onChange={(event) => {
                          if (event.target.value == "") {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              portable_water_show: event.target.value,
                              portable_water_final: this.state.portable_water,
                              portable_water_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            portable_water_show: event.target.value,
                            portable_water_error: "",
                          });
                        }}
                        onBlur={(event) => {
                          if (event.target.value.includes(".")) {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              portable_water_show: event.target.value,
                              portable_water_final: this.state.portable_water,
                              portable_water_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            portable_water_show: event.target.value,
                            portable_water_error: "",
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          if (this.state.portable_water_show.length !== 0) {
                            this.setState({
                              portable_water_error: "",
                              portable_water_lmc:
                                "-" + this.state.portable_water_show,
                              portable_water_final:
                                parseInt(this.state.portable_water) +
                                (this.state.fleetinfo.StdPortableWater
                                  ? parseInt(
                                      this.state.fleetinfo.StdPortableWater
                                    )
                                  : 0) -
                                parseInt(this.state.portable_water_show),
                            });
                          }
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        &nbsp;=
                      </Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.portable_water_final}
                      </Typography>
                    </Grid>
                  </Grid>
                  {this.state.portable_water_error && (
                    <Typography variant={"body2"} className={classes.error}>
                      {this.state.portable_water_error}
                    </Typography>
                  )}
                </div>
              )}

              {/* {Spare Wheels} */}
              {this.state.fleetinfo.MaxSpareWheels && (
                <div className={classes.formField}>
                  <Typography className={classes.label} variant={"body1"}>
                    Spare Wheels
                  </Typography>
                  <Grid container className={classes.flightContainer}>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.spare_wheels +
                          (this.state.fleetinfo.StdSpareWheels
                            ? parseInt(this.state.fleetinfo.StdSpareWheels)
                            : 0)}
                        {/* {this.state.fleetinfo.StdSpareWheels} */}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          if (this.state.spare_wheels_show.length !== 0) {
                            this.setState({
                              spare_wheels_error: "",
                              spare_wheels_lmc: this.state.spare_wheels_show,
                              spare_wheels_final:
                                parseInt(this.state.spare_wheels_show) +
                                (parseInt(this.state.spare_wheels) +
                                  (this.state.fleetinfo.StdSpareWheels
                                    ? parseInt(
                                        this.state.fleetinfo.StdSpareWheels
                                      )
                                    : 0)),
                            });
                          }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={3} className={classes.flightInputContainer}>
                      <input
                        type="number"
                        className={flightInputNoLabelClass}
                        ref="spare_wheels"
                        placeholder={this.state.spare_wheels_show}
                        value={
                          this.state.spare_wheels_show == 0
                            ? ""
                            : this.state.spare_wheels_show &&
                              Math.max(0, this.state.spare_wheels_show)
                        }
                        onChange={(event) => {
                          if (event.target.value == "") {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              spare_wheels_show: event.target.value,
                              spare_wheels_final: this.state.spare_wheels,
                              spare_wheels_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            spare_wheels_show: event.target.value,
                            spare_wheels_error: "",
                          });
                        }}
                        onBlur={(event) => {
                          if (event.target.value.includes(".")) {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              spare_wheels_show: event.target.value,
                              spare_wheels_final: this.state.spare_wheels,
                              spare_wheels_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            spare_wheels_show: event.target.value,
                            spare_wheels_error: "",
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          if (this.state.spare_wheels_show.length !== 0) {
                            this.setState({
                              spare_wheels_error: "",
                              spare_wheels_lmc:
                                "-" + this.state.spare_wheels_show,
                              spare_wheels_final:
                                parseInt(this.state.spare_wheels) +
                                (this.state.fleetinfo.StdSpareWheels
                                  ? parseInt(
                                      this.state.fleetinfo.StdSpareWheels
                                    )
                                  : 0) -
                                parseInt(this.state.spare_wheels_show),
                            });
                          }
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        &nbsp;=
                      </Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.spare_wheels_final}
                      </Typography>
                    </Grid>
                  </Grid>
                  {this.state.spare_wheels_error && (
                    <Typography variant={"body2"} className={classes.error}>
                      {this.state.spare_wheels_error}
                    </Typography>
                  )}
                </div>
              )}

              {/* {ETOP Equipments} */}
              {this.state.fleetinfo.MaxETOPEquipments && (
                <div className={classes.formField}>
                  <Typography className={classes.label} variant={"body1"}>
                    ETOP Equipments
                  </Typography>
                  <Grid container className={classes.flightContainer}>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.ETOP_equipments +
                          (this.state.fleetinfo.StdETOPEquipments
                            ? parseInt(this.state.fleetinfo.StdETOPEquipments)
                            : 0)}
                        {/* {this.state.ETOP_equipments} */}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          if (this.state.ETOP_equipments_show.length !== 0) {
                            this.setState({
                              ETOP_equipments_error: "",
                              ETOP_equipments_lmc:
                                this.state.ETOP_equipments_show,
                              ETOP_equipments_final:
                                parseInt(this.state.ETOP_equipments_show) +
                                parseInt(this.state.ETOP_equipments) +
                                (this.state.fleetinfo.StdETOPEquipments
                                  ? parseInt(
                                      this.state.fleetinfo.StdETOPEquipments
                                    )
                                  : 0),
                            });
                          }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={3} className={classes.flightInputContainer}>
                      <input
                        type="number"
                        className={flightInputNoLabelClass}
                        ref="ETOP_equipments"
                        placeholder={this.state.ETOP_equipments_show}
                        value={
                          this.state.ETOP_equipments_show == 0
                            ? ""
                            : this.state.ETOP_equipments_show &&
                              Math.max(0, this.state.ETOP_equipments_show)
                        }
                        onChange={(event) => {
                          if (event.target.value == "") {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              ETOP_equipments_show: event.target.value,
                              ETOP_equipments_final: this.state.ETOP_equipments,
                              ETOP_equipments_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            ETOP_equipments_show: event.target.value,
                            ETOP_equipments_error: "",
                          });
                        }}
                        onBlur={(event) => {
                          if (event.target.value.includes(".")) {
                            event.target.value = 0;
                          }
                          if (event.target.value.length > 3) {
                            return;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              ETOP_equipments_show: event.target.value,
                              ETOP_equipments_final: this.state.ETOP_equipments,
                              ETOP_equipments_lmc: 0,
                            });
                            return;
                          }
                          this.setState({
                            ETOP_equipments_show: event.target.value,
                            ETOP_equipments_error: "",
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <IconButton
                        aria-label="delete"
                        className={classes.iconbutton}
                        onClick={() => {
                          if (this.state.ETOP_equipments_show.length !== 0) {
                            this.setState({
                              ETOP_equipments_error: "",
                              ETOP_equipments_lmc:
                                "-" + this.state.ETOP_equipments_show,
                              ETOP_equipments_final:
                                parseInt(this.state.ETOP_equipments) +
                                (this.state.fleetinfo.StdETOPEquipments
                                  ? parseInt(
                                      this.state.fleetinfo.StdETOPEquipments
                                    )
                                  : 0) -
                                parseInt(this.state.ETOP_equipments_show),
                            });
                          }
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={1} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        &nbsp;=
                      </Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.FlightFront}>
                      <Typography className={classes.label} variant={"body1"}>
                        {this.state.ETOP_equipments_final}
                      </Typography>
                    </Grid>
                  </Grid>
                  {this.state.ETOP_equipments_error && (
                    <Typography variant={"body2"} className={classes.error}>
                      {this.state.ETOP_equipments_error}
                    </Typography>
                  )}
                </div>
              )}

              {/* CREW CABIN */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  CREW CABIN
                </Typography>
                <Grid container className={classes.flightContainer}>
                  {/* <Grid item xs={3} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>{this.state.fwd_cab}</Typography>
                        </Grid>
                        <Grid item xs={1} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>+</Typography>
                        </Grid> */}
                  {this.state.LTAdjust.FwdJumpPerKg != null && (
                    <Grid item xs={4} className={classes.textfield}>
                      <Typography className={flightLabel} variant={"body1"}>
                        FWD
                      </Typography>
                      {/* <FormControl > */}
                      <input
                        type="number"
                        className={flightInputWithLabelClass}
                        ref="fwd_jump_final"
                        value={
                          this.state.fwd_jump_final &&
                          Math.max(0, this.state.fwd_jump_final)
                        }
                        disabled
                        onChange={(event) => {
                          if (event.target.value == "") {
                            event.target.value = 0;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              fwd_cab_lmc: event.target.value,
                              fwd_cab_final: this.state.fwd_jump_final,
                            });
                            return;
                          }
                          this.setState({
                            fwd_cab_lmc: event.target.value,
                            Fwdcab_error: "",
                            fwd_cab_final:
                              parseInt(event.target.value) +
                              parseInt(this.state.fwd_jump_final),
                          });
                        }}
                        onBlur={(event) => {
                          if (event.target.value.includes(".")) {
                            event.target.value = 0;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              fwd_cab_lmc: event.target.value,
                              fwd_cab_final: this.state.fwd_jump_final,
                            });
                            return;
                          }
                          this.setState({
                            fwd_cab_lmc: event.target.value,
                            Fwdcab_error: "",
                            fwd_cab_final:
                              parseInt(event.target.value) +
                              parseInt(this.state.fwd_jump_final),
                          });
                        }}
                      />
                      {/* </FormControl> */}
                    </Grid>
                  )}
                  {/* <Grid item xs={1} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>&nbsp;=</Typography>
                        </Grid>
                        <Grid item xs={3} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>{this.state.fwd_cab_final}</Typography>
                        </Grid> */}
                  {/* </Grid> */}
                  {this.state.Aftrcab_error && (
                    <Typography variant={"body2"} className={classes.error}>
                      {this.state.Aftrcab_error}
                    </Typography>
                  )}
                  {/* <Grid container className={classes.flightContainer}> */}
                  {/* <Grid item xs={3} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>{this.state.mid_cab}</Typography>
                        </Grid>
                        <Grid item xs={1} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>+</Typography>
                        </Grid> */}
                  {this.state.LTAdjust.MidJumpPerKg != null && (
                    <Grid item xs={4} className={classes.textfield}>
                      <Typography className={flightLabel} variant={"body1"}>
                        MID
                      </Typography>
                      {/* <FormControl > */}
                      <input
                        type="number"
                        ref="mid_jump_final"
                        className={flightInputWithLabelClass}
                        value={
                          this.state.mid_jump_final &&
                          Math.max(0, this.state.mid_jump_final)
                        }
                        disabled
                        onChange={(event) => {
                          if (event.target.value == "") {
                            event.target.value = 0;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              mid_cab_lmc: event.target.value,
                              mid_cab_final: this.state.mid_jump_final,
                            });
                            return;
                          }
                          this.setState({
                            mid_cab_lmc: event.target.value,
                            Midcab_error: "",
                            mid_cab_final:
                              parseInt(event.target.value) +
                              parseInt(this.state.mid_jump_final),
                          });
                        }}
                        onBlur={(event) => {
                          if (event.target.value.includes(".")) {
                            event.target.value = 0;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              mid_cab_lmc: event.target.value,
                              mid_cab_final: this.state.mid_jump_final,
                            });
                            return;
                          }
                          this.setState({
                            mid_cab_lmc: event.target.value,
                            Midcab_error: "",
                            mid_cab_final:
                              parseInt(event.target.value) +
                              parseInt(this.state.mid_jump_final),
                          });
                        }}
                      />
                      {/* </FormControl> */}
                    </Grid>
                  )}
                  {/* <Grid item xs={1} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>&nbsp;=</Typography>
                        </Grid>
                        <Grid item xs={3} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>{this.state.mid_cab_final}</Typography>
                        </Grid> */}
                  {/* </Grid> */}
                  {this.state.Midcab_error && (
                    <Typography variant={"body2"} className={classes.error}>
                      {this.state.Midcab_error}
                    </Typography>
                  )}
                  {/* <Grid container className={classes.flightContainer}> */}
                  {/* <Grid item xs={3} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>{this.state.aft_cab}</Typography>
                        </Grid>
                        <Grid item xs={1} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>+</Typography>
                        </Grid> */}
                  {this.state.LTAdjust.AftJumpPerKG != null && (
                    <Grid item xs={4} className={classes.textfield}>
                      <Typography className={flightLabel} variant={"body1"}>
                        AFT
                      </Typography>
                      {/* <FormControl > */}
                      <input
                        type="number"
                        ref="aft_jump_final"
                        className={flightInputWithLabelClass}
                        value={
                          this.state.aft_jump_final &&
                          Math.max(0, this.state.aft_jump_final)
                        }
                        disabled
                        onChange={(event) => {
                          if (event.target.value == "") {
                            event.target.value = 0;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              aft_cab_lmc: event.target.value,
                              aft_cab_final: this.state.aft_jump_final,
                            });
                            return;
                          }
                          this.setState({
                            aft_cab_lmc: event.target.value,
                            Aftrcab_error: "",
                            aft_cab_final:
                              parseInt(event.target.value) +
                              parseInt(this.state.aft_jump_final),
                          });
                        }}
                        onBlur={(event) => {
                          if (event.target.value.includes(".")) {
                            event.target.value = 0;
                          }
                          if (
                            event.target.value === null ||
                            event.target.value === undefined ||
                            event.target.value.trim().length === 0
                          ) {
                            this.setState({
                              aft_cab_lmc: event.target.value,
                              aft_cab_final: this.state.aft_jump_final,
                            });
                            return;
                          }
                          this.setState({
                            aft_cab_lmc: event.target.value,
                            Aftrcab_error: "",
                            aft_cab_final:
                              parseInt(event.target.value) +
                              parseInt(this.state.aft_jump_final),
                          });
                        }}
                      />
                      {/* </FormControl> */}
                    </Grid>
                  )}
                  {/* <Grid item xs={1} className={classes.FlightFront}>
                            <Typography className={classes.label} variant={'body1'}>&nbsp;=</Typography>
                          </Grid> */}
                  {/* <Grid item xs={3} className={classes.FlightFront}>
                            <Typography className={classes.label} variant={'body1'}>{this.state.aft_cab_final}</Typography>
                          </Grid> */}
                </Grid>
                {this.state.Fwdcab_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.Fwdcab_error}
                  </Typography>
                )}
              </div>

              {/* {--------------ACM-------} */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  ACM
                </Typography>
                {/* <Grid container className={classes.flightContainer}>
                        <Grid item xs={3} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>{this.state.acm}</Typography>
                        </Grid>
                        <Grid item xs={1} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>+</Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.flightInputContainer}> */}
                <input
                  type="number"
                  className={formInputClass}
                  value={
                    parseInt(this.state.acmCountRead) +
                    parseInt(this.state.paxAcmCount)
                  }
                  disabled
                />
                {/* </Grid>
                        <Grid item xs={1} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>&nbsp;=</Typography>
                        </Grid>
                        <Grid item xs={3} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>{parseInt(this.state.acm+this.state.cockpitOccupent_lmc+this.state.aft_jump_lmc+this.state.paxAcmCount)} </Typography>
                        </Grid>
                      </Grid> */}
                {this.state.acm_error && (
                  <Typography variant={"body2"} className={classes.error}>
                    {this.state.acm_error}
                  </Typography>
                )}
              </div>
              {/* TOB */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  TOB
                </Typography>
                <Grid container className={classes.flightContainer}>
                  {/* <Grid item xs={3} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>{this.state.tob}</Typography>
                        </Grid>
                        <Grid item xs={1} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>+</Typography>
                        </Grid> */}
                  <Grid item xs={12} className={classes.flightInputContainer}>
                    <input
                      disabled
                      type="text"
                      className={formInputClass}
                      value={
                        (this.state.tob_final &&
                          Math.max(0, this.state.tob_final)) +
                        (infant_Exist ? "+" + infant_count : "")
                      }
                      // onChange = {(event)=>{this.setState({'tob_lmc':event.target.value})}}
                    />
                  </Grid>
                  {/* <Grid item xs={1} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>&nbsp;=</Typography>
                        </Grid>
                        <Grid item xs={3} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>{this.state.tob_final}</Typography>
                        </Grid> */}
                </Grid>
              </div>
              {/* POB */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  POB
                </Typography>
                <Grid container className={classes.flightContainer}>
                  {/* <Grid item xs={3} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>{this.state.tob}</Typography>
                        </Grid>
                        <Grid item xs={1} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>+</Typography>
                        </Grid> */}
                  <Grid item xs={12} className={classes.flightInputContainer}>
                    <input
                      disabled
                      type="text"
                      className={formInputClass}
                      value={
                        this.state.pob_final +
                        this.state.tob_final +
                        this.state.fwd_jump_final +
                        this.state.mid_jump_final +
                        this.state.aft_jump_final +
                        this.state.cockpitOccupent_final +
                        parseInt(this.state.paxAcmCount) +
                        this.state.first_observer_final +
                        this.state.second_observer_final +
                        this.state.super_numeraries_final +
                        (infant_Exist ? "+" + infant_count : "")
                      }
                      // onChange = {(event)=>{this.setState({'tob_lmc':event.target.value})}}
                    />
                  </Grid>
                  {/* <Grid item xs={1} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>&nbsp;=</Typography>
                        </Grid>
                        <Grid item xs={3} className={classes.FlightFront}>
                          <Typography className={classes.label} variant={'body1'}>{this.state.tob_final}</Typography>
                        </Grid> */}
                </Grid>
              </div>
              {/* {-----------SI-------------} */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  SI
                </Typography>
                <input
                  disabled={true}
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
              {/* {-----------TRIM OFFICER-------------} */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  TRIM OFFICER
                </Typography>
                <input
                  type="text"
                  ref="trim_officer"
                  className={formInputClass}
                  placeholder="ENTER NAME"
                  value={this.state.trim_officer}
                  readOnly={true}
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
              {/* {-----------LOAD OFFICER-------------} */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  LOAD OFFICER
                </Typography>
                <input
                  type="text"
                  className={formInputClass}
                  ref="load_officer"
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
              {/* {-----------CAPTAIN-------------} */}
              <div className={classes.formField}>
                <Typography className={classes.label} variant={"body1"}>
                  CAPTAIN
                </Typography>
                <input
                  type="text"
                  ref="captain"
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
              {/* {--------------maxCabin -------} */}
              {/* <div className={classes.formField}>
              <Typography className={classes.label} variant={'body1'}>Cabin Max Vlaue</Typography>
              <input
                type="number"
                className={formInputClass}
                value={parseInt(this.state.acm + this.state.cockpitOccupent_lmc + this.state.aft_jump_lmc + this.state.paxAcmCount)}
                disabled
              />
           </div> */}
              {/* Crew. */}
              {/* <div className={classes.formField}>
              <Typography className={classes.label}>Crew.</Typography>
              <input
                type="text"
                className={formInputClass}
                value={this.state.cockpitnew + this.state.crew + this.state.Aftrjump + this.state.cockpitOccupent_lmc + this.state.aft_jump_lmc + this.state.paxAcmCount}
                disabled
              />
              {this.state.crew_error && <Typography variant={"body2"} className={classes.error}>{this.state.crew_error}</Typography>}
            </div> */}
            </div>
            <div className={classes.form}>
              {!this.state.lmc_prog && (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={this.submitLmc}
                >
                  Submit
                </Button>
              )}
              {this.state.lmc_prog && <CircularProgress />}
            </div>
          </div>
        )}
        <Error
          message={this.state.message}
          open={this.state.error}
          onClose={() => {
            this.setState({ error: false });
          }}
        />
        <LMCPaxModel
          open={this.state.paxOpen}
          index={this.state.currentPax}
          pax={this.state.pax}
          // paxLMC={this.state.paxlmc}
          Fleetinfo={this.state.fleetinfo}
          onSubmit={(index, value, lmc) => {
            this.handlepax(index, value, lmc);

            this.setState({ paxOpen: false });
          }}
          onClose={() => {
            this.setState({ paxOpen: false });
          }}
        />

        <CargoModal
          onClose={() => {
            this.setState({ cargoOpen: false, cargoBaggageError: "" });
          }}
          onSubmit={(val, index, baggageWt, cargoWt) => {
            if (val.startsWith("#")) {
              val = val.substring(1);
              console.log("new val: ", val);
            }
            this.handleCargo(index, cargoWt + "/" + baggageWt);
            this.handleBaggage(index, baggageWt);
            this.handleCargoSubmit(this.state.currentCargo, baggageWt, cargoWt);
            this.ConvertActloadDistStrV2ToActloadDistStrV1(val);
          }}
          open={this.state.cargoOpen}
          currentCargo={this.state.currentCargo}
          limits={this.state.compLimits[this.state.currentCargo]}
          cargoData={this.state.cargoData}
          cargoActLoadData={this.state.cargoActLoadData}
          cargo={this.props.cargo}
        />

        {/* <CargoBaggageModal 
          open={this.state.cargoOpen} 
          cargoShow={this.state.cargo_show} 
          baggageShow={this.state.baggageShow}
          index={this.state.currentCargo}
          cargoData={this.state.cargoLDMArray}
          baggageData={this.state.baggageLDMArray}
          cargoFinal={this.state.cargo_final}
          baggageFinal={this.state.baggage_final}
          cargoError={this.state.cargoBaggageError}
          onSubmit={() => {
            this.handleCargoSubmit(this.state.currentCargo);
          }}
          onClose={() => {
            this.setState({ "cargoOpen": false, cargoBaggageError:'' })
          }}
          handleCargo={(index, value)=>{
            this.handleCargo(index, value);
          }}
          handleBaggage={(index, value)=>{
            this.handleBaggage(index, value);
          }}
          handleFocusOut={(index, value)=>{
            this.handleFocusOut(index, value);
          }}
          cargoSubtract={(index)=>{
            this.cargoSubtract(index);
          }}
          cargoAdd={(index)=>{
            this.cargoAdd(index);
          }}
          baggageSubtract={(index)=>{
            this.baggageSubtract(index);
          }}
          baggageAdd={(index)=>{
            this.baggageAdd(index);
          }}
        /> */}
        {/* <Lmctrim
          open={this.state.trimSheetOpen}
          trimSheet={this.state.lmctrimSheet}
          onLmc={() => {
            this.setState({ trimSheetOpen: false, lmctrimSheet: {} }, function () {
              this.againLmc();
              this.fetchFims();
              this.fetchMaxCabCamp();
            })
          }}
        /> */}
      </div>
    );
  }
}
const styles = (theme) => {
  return createStyles({
    formContainer: {
      paddingBottom: theme.spacing(20),
    },
    form: {
      width: "90%",
      margin: "auto",
      paddingTop: "10px",
      paddingBottom: "20px",
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
      color: "#ffffff",
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
      marginTop: "21px",
      padding: "1px",
      paddingLeft: "5px",
      paddingRight: "5px",
    },
    flightLabelDark: {
      fontSize: "11px",
      textTransform: "uppercase",
      color: "#ffffff",
    },
    flightLabelLight: {
      fontSize: "11px",
      textTransform: "uppercase",
      color: "#000",
    },
    FlightBack: {},
    FlightFront: {
      top: 0,
      bottom: 0,
      margin: "auto",
      textAlign: "center",
    },
    FlightdownIcon: {
      color: "#ffffff",
    },
    picker: {
      border: "1px solid",
      borderRadius: "4px",
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
    select: {
      textTransform: "uppercase",
    },
    maindiv: {},
    passenger: {
      display: "flex",
    },
    textfield: {
      flex: "1",
      margin: "4px",
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
    typo: {
      flex: "1",
      textAlign: "center",
    },
    error: {
      color: "red",
      textAlign: "right",
    },
    iconbutton: {
      padding: "0px",
    },
  });
};
export default connect(
  (store) => {
    return {
      network: store.network,
      cargo: store.cargo,
    };
  },
  {
    setPage: setPage,
    setPageAction: setAction,
    getLoadTypes: getLoadTypes,
    getSector: getSector,
  }
)(compose(withRouter, withStyles(styles))(TrimsheetLmc));
