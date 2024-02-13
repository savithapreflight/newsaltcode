import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Typography, Grid } from "@material-ui/core";
import { setPage, setAction } from "../../../Action/pageaction";
import { fetchFimsById, fetchRampDataById } from "../../../Action/rampaction";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import CommentBox from "./CommentBox";
import Error from "./Error";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";

import InImg from "./images/in.png";
import OutImg from "./images/out.png";
import DoorOpenImg from "./images/dopen.png";
import CargoOpenImg from "./images/copen.png";
import CrewImg from "./images/crew.png";
import FuelStartImg from "./images/fstart.png";
import FuelEndImg from "./images/fend.png";
import TechClearImg from "./images/techclear.png";
import CargoCloseImg from "./images/cclose.png";
import LnTImg from "./images/LnT.png";
import DoorCloseImg from "./images/dclose.png";
import TableTop from "../../common/Tabletop/index";
import clsx from "clsx";
import { addTransaction } from "../../../Action/rampaction";

var fims_mapping = {
  cargo_close: "cargo_close",
  cargo_open: "cargo_open",
  catering_end: "catering_end",
  catering_start: "catering_start",
  crew: "crew",
  door_close: "door_close",
  door_open: "door_open",
  fuel_end: "fuel_end",
  fuel_start: "fuel_start",
  in_time: "in",
  lnt: "lnt",
  out: "out",
  security_end: "security_end",
  security_start: "security_start",
  service_end: "service_end",
  service_start: "service_start",
  tech_clear: "tech_clear",
};

class FIMS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: {
        message: null,
        state: null,
        open: false,
      },
      fims1: null,
      fims2: null,
      bay_no: null,
      comment_box: {
        label: null,
        state: null,
        open: false,
        value: "",
      },
      in: {
        datepicker: false,
        message: "",
        date: null,
      },
      door_open: {
        datepicker: false,
        message: "",
        date: null,
      },
      cargo_open: {
        datepicker: false,
        message: "",
        date: null,
      },
      crew: {
        datepicker: false,
        message: "",
        date: null,
      },
      fuel_start: {
        datepicker: false,
        message: "",
        date: null,
      },
      fuel_end: {
        datepicker: false,
        message: "",
        date: null,
      },
      tech_clear: {
        datepicker: false,
        message: "",
        date: null,
      },
      cargo_close: {
        datepicker: false,
        message: "",
        date: null,
      },
      lnt: {
        datepicker: false,
        message: "",
        date: null,
      },
      door_close: {
        datepicker: false,
        message: "",
        date: null,
      },
      catering_start: {
        datepicker: false,
        message: "",
        date: null,
      },
      catering_end: {
        datepicker: false,
        message: "",
        date: null,
      },
      security_start: {
        datepicker: false,
        message: "",
        date: null,
      },
      security_end: {
        datepicker: false,
        message: "",
        date: null,
      },
      service_start: {
        datepicker: false,
        message: "",
        date: null,
      },
      service_end: {
        datepicker: false,
        message: "",
        date: null,
      },
      out: {
        datepicker: false,
        message: "",
        date: null,
      },
      is_view: false,
    };
    this.fetchFIMS = this.fetchFIMS.bind(this);
    this.addTrans = this.addTrans.bind(this);
    this.fetchRamp = this.fetchRamp.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    localStorage.removeItem('name') // Added
    this.props.setPage("FIMS", "FIMS");
    this.props.setPageAction(null);
    this.fetchFIMS();
    this.fetchRamp();
  }
  handleChange(type, time) {
    var me = this;
    console.log("type", type);
    if (type !== "in") {
      if (me.state.in.date === undefined || me.state.in.date == null) {
        var message = "Please update the IN time first.";
        this.state.error.open = true;
        this.state.error.message = message;
        this.state.error.state = type;
        this.setState({ error: this.state.error });
        return;
      }
    }
    if (type === "out") {
      if (me.state.in.date === undefined || me.state.in.date == null) {
        var message = "Please update the IN time first.";
        this.state.error.open = true;
        this.state.error.message = message;
        this.state.error.state = type;
        this.setState({ error: this.state.error });
      }
    }

    if (type === "door_close") {
      if (
        me.state.door_open.date === undefined ||
        me.state.door_open.date == null
      ) {
        var message = "Please update the DOOR OPEN time first.";
        this.state.error.open = true;
        this.state.error.message = message;
        this.state.error.state = type;
        this.setState({ error: this.state.error });
        return;
      }
    }

    if (type === "cargo_close") {
      if (
        me.state.cargo_open.date === undefined ||
        me.state.cargo_open.date == null
      ) {
        var message = "Please update the CARGO OPEN time first.";
        this.state.error.open = true;
        this.state.error.message = message;
        this.state.error.state = type;
        this.setState({ error: this.state.error });
        return;
      }
    }

    if (type === "fuel_end") {
      if (
        me.state.fuel_start.date === undefined ||
        me.state.fuel_start.date == null
      ) {
        var message = "Please update the FUEL START time first.";
        this.state.error.open = true;
        this.state.error.message = message;
        this.state.error.state = type;
        this.setState({ error: this.state.error });
        return;
      }
    }
    var date = this.formatDate(time);
    console.log(date, "date");
    console.log(this.formatDate(moment()), "now date");
    if (date < this.formatDate(moment())) {
      console.log("1111");
      if (type === "door_open") {
        var in_time = this.formatDate(me.state.in.date);
        console.log(in_time, "in time");
        if (in_time === undefined || in_time > date) {
          var message = "DOOR OPEN should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }

        var out_time = this.formatDate(me.state.out.time);
        console.log(out_time, "out_time");

        if (out_time !== undefined) {
          if (out_time < date) {
            var message = "DOOR OPEN should be before OUT time.";
            this.state.error.open = true;
            this.state.error.message = message;
            this.state.error.state = type;
            this.setState({ error: this.state.error });
            return;
          }
        }
      }
      if (type === "cargo_open") {
        var in_time = this.formatDate(me.state.in.date);
        console.log(in_time, "in time");
        console.log(date, "date");

        if (in_time === undefined || in_time > date) {
          var message = "CARGO OPEN should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }
        var out_time = this.formatDate(me.state.out.time);
        console.log(out_time, "out_time");
        console.log(date, "date");

        if (out_time !== undefined) {
          if (out_time < date) {
            var message = "CARGO OPEN should be before OUT time.";
            this.state.error.open = true;
            this.state.error.message = message;
            this.state.error.state = type;
            this.setState({ error: this.state.error });
            return;
          }
        }
      }
      if (type === "catering_start") {
        var in_time = this.formatDate(me.state.in.date);
        if (in_time === undefined || in_time > date) {
          var message = "CATERING START should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }
        var out_time = this.formatDate(me.state.out.time);
        if (out_time !== undefined) {
          if (out_time < date) {
            var message = "CATERING START should be before OUT time.";
            this.state.error.open = true;
            this.state.error.message = message;
            this.state.error.state = type;
            this.setState({ error: this.state.error });
            return;
          }
        }
      }
      if (type === "service_start") {
        var in_time = this.formatDate(me.state.in.date);
        if (in_time === undefined || in_time > date) {
          var message = "SERVICE START should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }
        var out_time = this.formatDate(me.state.out.time);
        if (out_time !== undefined) {
          if (out_time < date) {
            var message = "SERVICE START should be before OUT time.";
            this.state.error.open = true;
            this.state.error.message = message;
            this.state.error.state = type;
            this.setState({ error: this.state.error });
            return;
          }
        }
      }
      if (type === "security_start") {
        var in_time = this.formatDate(me.state.in.date);
        if (in_time === undefined || in_time > date) {
          var message = "SECURITY START should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }

        var out_time = this.formatDate(me.state.out.time);
        if (out_time !== undefined) {
          if (out_time < date) {
            var message = "SECURITY START should be before OUT time.";
            this.state.error.open = true;
            this.state.error.message = message;
            this.state.error.state = type;
            this.setState({ error: this.state.error });
            return;
          }
        }
      }

      if (type === "crew") {
        var in_time = this.formatDate(me.state.in.date);
        if (in_time === undefined || in_time > date) {
          var message = "CREW should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }
        var out_time = this.formatDate(me.state.out.time);
        if (out_time !== undefined) {
          if (out_time < date) {
            var message = "CREW should be before OUT time.";
            this.state.error.open = true;
            this.state.error.message = message;
            this.state.error.state = type;
            this.setState({ error: this.state.error });
            return;
          }
        }
      }
      if (type === "fuel_start") {
        var in_time = this.formatDate(me.state.in.date);
        if (in_time === undefined || in_time > date) {
          var message = "FUEL START should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }

        var out_time = this.formatDate(me.state.out.time);
        if (out_time !== undefined) {
          if (out_time < date) {
            var message = "FUEL START should be before OUT time.";
            this.state.error.open = true;
            this.state.error.message = message;
            this.state.error.state = type;
            this.setState({ error: this.state.error });
            return;
          }
        }
      }

      if (type === "tech_clear") {
        var in_time = this.formatDate(me.state.in.date);
        if (in_time === undefined || in_time > date) {
          var message = "TECH CLEAR should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }

        var out_time = this.formatDate(me.state.out.time);
        if (out_time !== undefined) {
          if (out_time < date) {
            var message = "TECH CLEAR should be before OUT time.";
            this.state.error.open = true;
            this.state.error.message = message;
            this.state.error.state = type;
            this.setState({ error: this.state.error });
            return;
          }
        }
      }
      if (type === "lnt") {
        var in_time = this.formatDate(me.state.in.date);
        if (in_time === undefined || in_time > date) {
          var message = "L&T should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }

        var out_time = this.formatDate(me.state.out.time);
        if (out_time !== undefined) {
          if (out_time < date) {
            var message = "L&T should be before OUT time.";
            this.state.error.open = true;
            this.state.error.message = message;
            this.state.error.state = type;
            this.setState({ error: this.state.error });
            return;
          }
        }
      }

      if (type === "fuel_end") {
        var in_time = this.formatDate(me.state.in.date);
        if (in_time === undefined || in_time > date) {
          var message = "FUEL END should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }

        var out_time = this.formatDate(me.state.out.time);
        if (out_time !== undefined) {
          if (out_time < date) {
            var message = "FUEL END should be before OUT time.";
            this.state.error.open = true;
            this.state.error.message = message;
            this.state.error.state = type;
            this.setState({ error: this.state.error });
            return;
          }
        }
        var fule_start_time = this.formatDate(me.state.fuel_start.date);
        if (fule_start_time === undefined || fule_start_time > date) {
          var message = "FUEL END should be after FUEL START time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }
      }

      if (type === "cargo_close") {
        var in_time = this.formatDate(me.state.in.date);
        if (in_time === undefined || in_time > date) {
          var message = "CARGO CLOSE should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }

        var out_time = this.formatDate(me.state.out.time);
        if (out_time !== undefined) {
          if (out_time < date) {
            var message = "CARGO CLOSE should be before OUT time.";
            this.state.error.open = true;
            this.state.error.message = message;
            this.state.error.state = type;
            this.setState({ error: this.state.error });
            return;
          }
        }

        var cargoopen_time = this.formatDate(me.state.cargo_open.date);
        if (cargoopen_time === undefined || cargoopen_time > date) {
          var message = "CARGO CLOSE should be after CARGO OPEN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }
      }

      if (type === "catering_end") {
        var in_time = this.formatDate(me.state.in.date);
        if (in_time === undefined || in_time > date) {
          var message = "CATERING END should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }

        var out_time = this.formatDate(me.state.out.time);
        if (out_time !== undefined) {
          if (out_time < date) {
            var message = "CATERING END should be before OUT time.";
            this.state.error.open = true;
            this.state.error.message = message;
            this.state.error.state = type;
            this.setState({ error: this.state.error });
            return;
          }
        }

        var cateringopen_time = this.formatDate(me.state.catering_start.date);
        console.log("catering start", cateringopen_time);
        console.log("time", date);
        if (cateringopen_time == undefined || cateringopen_time > date) {
          var message = "CATERING END should be after CATERING START time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }
      }
      if (type === "service_end") {
        var in_time = this.formatDate(me.state.in.date);
        if (in_time === undefined || in_time > date) {
          var message = "SERVICE END should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }

        var out_time = this.formatDate(me.state.out.time);
        if (out_time !== undefined) {
          if (out_time < date) {
            var message = "SERVICE END should be before OUT time.";
            this.state.error.open = true;
            this.state.error.message = message;
            this.state.error.state = type;
            this.setState({ error: this.state.error });
            return;
          }
        }

        var serviceopen_time = this.formatDate(me.state.service_start.date);
        console.log("serviceopen_time start", serviceopen_time);
        console.log("time", date);
        if (serviceopen_time === undefined || serviceopen_time > date) {
          var message = "SERVICE END should be after SERVICE START time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }
      }

      if (type === "security_end") {
        var in_time = this.formatDate(me.state.in.date);
        if (in_time === undefined || in_time > date) {
          var message = "SECURITY END should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }

        var out_time = this.formatDate(me.state.out.time);
        if (out_time !== undefined) {
          if (out_time < date) {
            var message = "SECURITY END should be before OUT time.";
            this.state.error.open = true;
            this.state.error.message = message;
            this.state.error.state = type;
            this.setState({ error: this.state.error });
            return;
          }
        }

        var securityopen_time = this.formatDate(me.state.security_start.date);
        if (securityopen_time == undefined || securityopen_time > date) {
          var message = "SECURITY END should be after SECURITY START time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }
      }

      if (type === "door_close") {
        var in_time = this.formatDate(me.state.in.date);
        if (in_time === undefined || in_time > date) {
          var message = "DOOR CLOSE should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }

        var out_time = this.formatDate(me.state.out.time);
        if (out_time !== undefined) {
          if (out_time < date) {
            var message = "DOOR CLOSE should be before OUT time.";
            this.state.error.open = true;
            this.state.error.message = message;
            this.state.error.state = type;
            this.setState({ error: this.state.error });
            return;
          }
        }

        var dooropen_time = this.formatDate(me.state.door_open.date);
        if (dooropen_time === undefined || dooropen_time > date) {
          var message = "DOOR CLOSE should be after DOOR OPEN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }
      }
      if (type === "out") {
        var in_time = this.formatDate(me.state.in.date);
        if (in_time === undefined || in_time > date) {
          var message = "OUT should be after IN time.";
          this.state.error.open = true;
          this.state.error.message = message;
          this.state.error.state = type;
          this.setState({ error: this.state.error });
          return;
        }
      }
    } else {
      var message = "Please select the time before current time.";
      this.state.error.open = true;
      this.state.error.message = message;
      this.state.error.state = type;
      this.setState({ error: this.state.error });
      return;
    }
  }
  addTrans() {
    console.log(this.state.comment_box);
    var isSync = false;
    var auth = JSON.parse(window.localStorage.getItem("auth_user"));
    var fims_id1 = this.props.match.params.fims1;
    var fims_id2 = this.props.match.params.fims2;
    var postData = {
      fims_id: fims_id1,
      transaction_type: this.state.comment_box.state,
      user_id: auth.id,
      time: moment(this.state[this.state.comment_box.state].date).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      isSync: isSync,
      message: this.state[this.state.comment_box.state].message,
    };
    addTransaction(postData)
      .then((res) => {
        var post = {
          fims_id: fims_id2,
          transaction_type: this.state.comment_box.state,
          user_id: auth.id,
          time: moment(this.state[this.state.comment_box.state].date).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          isSync: isSync,
          message: this.state[this.state.comment_box.state].message,
        };
        return addTransaction(post);
      })
      .then((res2) => {
        console.log(res2);
      })
      .catch((er) => {
        console.log(er);
      });
  }
  
  fetchFIMS() {
    var user = window.localStorage.getItem("auth_user");
    if (user === null || user === undefined) {
      return;
    }

    user = JSON.parse(user);
    this.setState({is_view:user.is_view});
    var me = this;
    var fims_ids = [];
    if (this.props.match.params.fims1 !== "NULL") {
      fims_ids.push(this.props.match.params.fims1);
    }

    if (this.props.match.params.fims2 !== "NULL") {
      fims_ids.push(this.props.match.params.fims2);
    }
    console.log(fims_ids);

    if (fims_ids.length === 0) {
      return;
    }

    fetchFimsById(fims_ids).then((results) => {
      console.log(results);
      window.localStorage.setItem("selected_flight", JSON.stringify(results[0]));
      if (results.length == 1) {
        var fims = results[0];
        if (fims.Source == user.airport_code) {
          me.setState({ fims1: null, fims2: fims, bay_no: fims.BAYNO });
        } else if (fims.Destination == user.airport_code) {
          me.setState({ fims2: null, fims1: fims, bay_no: fims.BAYNO });
        }
      } else if (results.length == 2) {
        var fims1 = results[0];
        var fims2 = results[1];
        if (fims1.Source == user.airport_code) {
          me.setState({ fims1: fims2, fims2: fims1, bay_no: fims1.BAYNO });
        } else if (fims1.Destination == user.airport_code) {
          me.setState({ fims2: fims2, fims1: fims1, bay_no: fims2.BAYNO });
        }
      }
    });
  }
  fetchRamp() {
    var fims_id = this.props.match.params.fims1;
    var me = this;
    fetchRampDataById(fims_id)
      .then((ramp_res) => {
        for (var col in fims_mapping) {
          this.state[fims_mapping[col]].date = ramp_res[col];
          me.setState({ [fims_mapping[col]]: this.state[fims_mapping[col]] });
        }
      })
      .catch((er) => {
        console.log(er);
      });
  }
  formatTime(str) {
    if (str == null) {
      return "-";
    }
    return moment(str).format("HH:mm");
  }
  formatDate(str) {
    if (str == null) {
      return null;
    }
    return moment(str).format("HH:mm");
  }
  getETA(fims) {
    if (fims.ETA == null || fims.ETA === undefined) {
      return fims.STA;
    }
    return fims.STA;
  }

  getETD(fims) {
    if (fims.ETD == null) {
      return fims.STD;
    }
    return fims.STD;
  }

  render() {
    var classes = this.props.classes;

    var user = window.localStorage.getItem("auth_user");
    if (user == null || user == undefined) {
      return;
    }
    console.log(this.state.comment_box, "cojjjj");

    user = JSON.parse(user);

    var me = this;
    console.log(this.state, "fims state");
    return (
      <div>
        <TableTop className={classes.topBar}></TableTop>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div className={classes.flightMeta}>
            <Grid container spacing={2}>
              {this.state.fims1 != null && (
                <Grid
                  item
                  lg={2}
                  md={2}
                  sm={2}
                  xs={2}
                  className={clsx(classes.alignCenter)}
                >
                  <Typography variant={"h6"} className={clsx(classes.tcolor)}>
                    {this.state.fims1.Source}
                  </Typography>
                  <Typography
                    variant={"body1"}
                    className={clsx(classes.tcolor)}
                  >
                    {this.formatTime(this.getETA(this.state.fims1))}
                  </Typography>
                </Grid>
              )}
              {this.state.fims1 != null && (
                <Grid
                  item
                  lg={3}
                  md={3}
                  sm={3}
                  xs={3}
                  className={clsx(classes.alignCenter)}
                >
                  <Typography
                    variant={"body1"}
                    className={clsx(classes.flighNo, classes.tcolor)}
                  >
                    {this.state.fims1.Flight_no}
                  </Typography>
                </Grid>
              )}
              {(this.state.fims2 != null || this.state.fims1 != null) && (
                <Grid
                  item
                  lg={2}
                  md={2}
                  sm={2}
                  xs={2}
                  className={clsx(classes.alignCenter)}
                >
                  <Typography variant={"h6"} className={clsx(classes.tcolor)}>
                    {user.airport_code}
                  </Typography>
                  <Typography
                    variant={"body1"}
                    className={clsx(classes.tcolor)}
                  >
                    Bay : -
                  </Typography>
                </Grid>
              )}
              {this.state.fims2 != null && (
                <Grid
                  item
                  lg={3}
                  md={3}
                  sm={3}
                  xs={3}
                  className={clsx(classes.alignCenter)}
                >
                  <Typography
                    variant={"body1"}
                    className={clsx(classes.flighNo, classes.tcolor)}
                  >
                    {this.state.fims2.Flight_no}
                  </Typography>
                </Grid>
              )}
              {this.state.fims2 != null && (
                <Grid
                  item
                 
                  lg={2}
                  md={2}
                  sm={2}
                  xs={2}
                  className={clsx(classes.alignCenter)}
                >
                  <Typography variant={"h6"} className={clsx(classes.tcolor)}>
                    {this.state.fims2.Destination}
                  </Typography>
                  <Typography
                    variant={"body1"}
                    className={clsx(classes.tcolor)}
                  >
                    {this.formatTime(this.getETD(this.state.fims2))}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </div>
          <div className={classes.container}>
            <Grid container className="fims_action" spacing={4}>
              {this.state.fims2 != null && (
                <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                  <div
                    className={ this.state.is_view ? classes.action_item2 : classes.action_item2_disabled} 
                    onClick={() => {
                      this.props.history.push(
                        "/app/fims_trim/" +
                          this.state.fims2.Flight_no +
                          "/" +
                          this.state.fims2.Flight_Date +
                          "/" +
                          this.state.fims2.Source +
                          "/" +
                          this.state.fims2.Destination +
                          "/" +
                          this.props.match.params.status
                      );
                    }}
                  >
                    <label className={classes.label2}>Trim Sheet</label>
                  </div>
                </Grid>
              )}
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.in.date}
                  style={{ display: "none" }}
                  open={this.state.in.datepicker}
                  onChange={(date) => {
                    me.handleChange("in", date);
                    this.state.in.datepicker = false;
                    this.state.in.date = date;
                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "in";
                      this.state.comment_box.label =
                        "In " + this.formatTime(this.state.in.date);
                      this.state.comment_box.value = this.state.in.message;
                      me.setState({
                        in: this.state.in,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({ in: this.state.in });
                    }
                  }}
                  onClose={() => {
                    this.state.in.datepicker = false;
                    me.setState({ in: this.state.in });
                  }}
                  okLabel={"In"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.in.datepicker = true;
                    me.setState({ in: this.state.in });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={InImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>In</label>
                    <div class={classes.time}>
                      {" "}
                      {this.state.in.date == null
                        ? "- : -"
                        : this.formatTime(this.state.in.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.door_open.date}
                  style={{ display: "none" }}
                  open={this.state.door_open.datepicker}
                  onChange={(date) => {
                    me.handleChange("door_open", date);
                    this.state.door_open.datepicker = false;
                    this.state.door_open.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "door_open";
                      this.state.comment_box.label =
                        "Door Open " +
                        this.formatTime(this.state.door_open.date);
                      this.state.comment_box.value = this.state.door_open.message;
                      me.setState({
                        door_open: this.state.door_open,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({ door_open: this.state.door_open });
                    }
                  }}
                  onClose={() => {
                    this.state.door_open.datepicker = false;
                    me.setState({ door_open: this.state.door_open });
                  }}
                  okLabel={"Door Open"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.door_open.datepicker = true;
                    me.setState({ door_open: this.state.door_open });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={DoorOpenImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>Door Open</label>
                    <div class={classes.time}>
                      {" "}
                      {this.state.door_open.date == null
                        ? "- : -"
                        : this.formatTime(this.state.door_open.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.cargo_open.date}
                  style={{ display: "none" }}
                  open={this.state.cargo_open.datepicker}
                  onChange={(date) => {
                    me.handleChange("cargo_open", date);
                    this.state.cargo_open.datepicker = false;
                    this.state.cargo_open.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "cargo_open";
                      this.state.comment_box.label =
                        "Cargo Open " +
                        this.formatTime(this.state.cargo_open.date);
                      this.state.comment_box.value = this.state.cargo_open.message;
                      me.setState({
                        cargo_open: this.state.cargo_open,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({ cargo_open: this.state.cargo_open });
                    }
                  }}
                  onClose={() => {
                    this.state.cargo_open.datepicker = false;
                    me.setState({ cargo_open: this.state.cargo_open });
                  }}
                  okLabel={"Cargo Open"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.cargo_open.datepicker = true;
                    me.setState({ cargo_open: this.state.cargo_open });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={CargoOpenImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>Cargo Open</label>
                    <div class={classes.time}>
                      {" "}
                      {this.state.cargo_open.date == null
                        ? "- : -"
                        : this.formatTime(this.state.cargo_open.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.crew.date}
                  style={{ display: "none" }}
                  open={this.state.crew.datepicker}
                  onChange={(date) => {
                    me.handleChange("crew", date);

                    this.state.crew.datepicker = false;
                    this.state.crew.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "crew";
                      this.state.comment_box.label =
                        "Crew " + this.formatTime(this.state.crew.date);
                      this.state.comment_box.value = this.state.crew.message;
                      me.setState({
                        crew: this.state.crew,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({ crew: this.state.crew });
                    }
                  }}
                  onClose={() => {
                    this.state.crew.datepicker = false;
                    me.setState({ crew: this.state.crew });
                  }}
                  okLabel={"Crew"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.crew.datepicker = true;
                    me.setState({ crew: this.state.crew });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={CrewImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>Crew</label>
                    <div class={classes.time}>
                      {this.state.crew.date == null
                        ? "- : -"
                        : this.formatTime(this.state.crew.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.fuel_start.date}
                  style={{ display: "none" }}
                  open={this.state.fuel_start.datepicker}
                  onChange={(date) => {
                    me.handleChange("fuel_start", date);

                    this.state.fuel_start.datepicker = false;
                    this.state.fuel_start.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "fuel_start";
                      this.state.comment_box.label =
                        "fuel_start " +
                        this.formatTime(this.state.fuel_start.date);
                      this.state.comment_box.value = this.state.fuel_start.message;
                      me.setState({
                        fuel_start: this.state.fuel_start,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({ fuel_start: this.state.fuel_start });
                    }
                  }}
                  onClose={() => {
                    this.state.fuel_start.datepicker = false;
                    me.setState({ fuel_start: this.state.fuel_start });
                  }}
                  okLabel={"Fuel Start"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.fuel_start.datepicker = true;
                    me.setState({ fuel_start: this.state.fuel_start });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={FuelStartImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>Fuel Start</label>
                    <div class={classes.time}>
                      {this.state.fuel_start.date == null
                        ? "- : -"
                        : this.formatTime(this.state.fuel_start.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.fuel_end.date}
                  style={{ display: "none" }}
                  open={this.state.fuel_end.datepicker}
                  onChange={(date) => {
                    me.handleChange("fuel_end", date);
                    this.state.fuel_end.datepicker = false;
                    this.state.fuel_end.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "fuel_end";
                      this.state.comment_box.label =
                        "fuel_end " + this.formatTime(this.state.fuel_end.date);
                      this.state.comment_box.value = this.state.fuel_end.message;
                      me.setState({
                        fuel_end: this.state.fuel_end,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({ fuel_end: this.state.fuel_end });
                    }
                  }}
                  onClose={() => {
                    this.state.fuel_end.datepicker = false;
                    me.setState({ fuel_end: this.state.fuel_end });
                  }}
                  okLabel={"Fuel End"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.fuel_end.datepicker = true;
                    me.setState({ fuel_end: this.state.fuel_end });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={FuelEndImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>Fuel End</label>
                    <div class={classes.time}>
                      {this.state.fuel_end.date == null
                        ? "- : -"
                        : this.formatTime(this.state.fuel_end.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.tech_clear.date}
                  style={{ display: "none" }}
                  open={this.state.tech_clear.datepicker}
                  onChange={(date) => {
                    me.handleChange("tech_clear", date);
                    this.state.tech_clear.datepicker = false;
                    this.state.tech_clear.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "tech_clear";
                      this.state.comment_box.label =
                        "tech_clear " +
                        this.formatTime(this.state.tech_clear.date);
                      this.state.comment_box.value = this.state.tech_clear.message;
                      me.setState({
                        tech_clear: this.state.tech_clear,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({ tech_clear: this.state.tech_clear });
                    }
                  }}
                  onClose={() => {
                    this.state.tech_clear.datepicker = false;
                    me.setState({ tech_clear: this.state.tech_clear });
                  }}
                  okLabel={"Tech Clear"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.tech_clear.datepicker = true;
                    me.setState({ tech_clear: this.state.tech_clear });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={TechClearImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>Tech Clear</label>
                    <div class={classes.time}>
                      {this.state.tech_clear.date == null
                        ? "- : -"
                        : this.formatTime(this.state.tech_clear.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.cargo_close.date}
                  style={{ display: "none" }}
                  open={this.state.cargo_close.datepicker}
                  onChange={(date) => {
                    me.handleChange("cargo_close", date);
                    this.state.cargo_close.datepicker = false;
                    this.state.cargo_close.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "cargo_close";
                      this.state.comment_box.label =
                        "cargo_close " +
                        this.formatTime(this.state.cargo_close.date);
                      this.state.comment_box.value = this.state.cargo_close.message;
                      me.setState({
                        cargo_close: this.state.cargo_close,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({ cargo_close: this.state.cargo_close });
                    }
                  }}
                  onClose={() => {
                    this.state.cargo_close.datepicker = false;
                    me.setState({ cargo_close: this.state.cargo_close });
                  }}
                  okLabel={"Crago Close"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.cargo_close.datepicker = true;
                    me.setState({ cargo_close: this.state.cargo_close });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={CargoCloseImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>Cargo Close</label>
                    <div class={classes.time}>
                      {this.state.cargo_close.date == null
                        ? "- : -"
                        : this.formatTime(this.state.cargo_close.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.lnt.date}
                  style={{ display: "none" }}
                  open={this.state.lnt.datepicker}
                  onChange={(date) => {
                    me.handleChange("lnt", date);
                    this.state.lnt.datepicker = false;
                    this.state.lnt.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "lnt";
                      this.state.comment_box.label =
                        "lnt " + this.formatTime(this.state.lnt.date);
                      this.state.comment_box.value = this.state.lnt.message;
                      me.setState({
                        lnt: this.state.lnt,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({ lnt: this.state.lnt });
                    }
                  }}
                  onClose={() => {
                    this.state.lnt.datepicker = false;
                    me.setState({ lnt: this.state.lnt });
                  }}
                  okLabel={"LnT"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.lnt.datepicker = true;
                    me.setState({ lnt: this.state.lnt });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={LnTImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>LnT</label>
                    <div class={classes.time}>
                      {this.state.lnt.date == null
                        ? "- : -"
                        : this.formatTime(this.state.lnt.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.door_close.date}
                  style={{ display: "none" }}
                  open={this.state.door_close.datepicker}
                  onChange={(date) => {
                    me.handleChange("door_close", date);
                    this.state.door_close.datepicker = false;
                    this.state.door_close.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "door_close";
                      this.state.comment_box.label =
                        "door_close " +
                        this.formatTime(this.state.door_close.date);
                      this.state.comment_box.value = this.state.door_close.message;
                      me.setState({
                        door_close: this.state.door_close,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({ door_close: this.state.door_close });
                    }
                  }}
                  onClose={() => {
                    this.state.door_close.datepicker = false;
                    me.setState({ door_close: this.state.door_close });
                  }}
                  okLabel={"Door Close"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.door_close.datepicker = true;
                    me.setState({ door_close: this.state.door_close });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={DoorCloseImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>Door Close</label>
                    <div class={classes.time}>
                      {this.state.door_close.date == null
                        ? "- : -"
                        : this.formatTime(this.state.door_close.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.catering_start.date}
                  style={{ display: "none" }}
                  open={this.state.catering_start.datepicker}
                  onChange={(date) => {
                    me.handleChange("catering_start", date);
                    this.state.catering_start.datepicker = false;
                    this.state.catering_start.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "catering_start";
                      this.state.comment_box.label =
                        "catering_start " +
                        this.formatTime(this.state.catering_start.date);
                      this.state.comment_box.value = this.state.catering_start.message;
                      me.setState({
                        catering_start: this.state.catering_start,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({
                        catering_start: this.state.catering_start,
                      });
                    }
                  }}
                  onClose={() => {
                    this.state.catering_start.datepicker = false;
                    me.setState({ catering_start: this.state.catering_start });
                  }}
                  okLabel={"Catering Start"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.catering_start.datepicker = true;
                    me.setState({ catering_start: this.state.catering_start });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={DoorOpenImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>Catering Start</label>
                    <div class={classes.time}>
                      {this.state.catering_start.date == null
                        ? "- : -"
                        : this.formatTime(this.state.catering_start.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.catering_end.date}
                  style={{ display: "none" }}
                  open={this.state.catering_end.datepicker}
                  onChange={(date) => {
                    me.handleChange("catering_end", date);
                    this.state.catering_end.datepicker = false;
                    this.state.catering_end.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "catering_end";
                      this.state.comment_box.label =
                        "catering_end " +
                        this.formatTime(this.state.catering_end.date);
                      this.state.comment_box.value = this.state.catering_end.message;
                      me.setState({
                        catering_end: this.state.catering_end,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({ catering_end: this.state.catering_end });
                    }
                  }}
                  onClose={() => {
                    this.state.catering_end.datepicker = false;
                    me.setState({ catering_end: this.state.catering_end });
                  }}
                  okLabel={"Catering End"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.catering_end.datepicker = true;
                    me.setState({ catering_end: this.state.catering_end });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={DoorCloseImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>Catering End</label>
                    <div class={classes.time}>
                      {this.state.catering_end.date == null
                        ? "- : -"
                        : this.formatTime(this.state.catering_end.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.security_start.date}
                  style={{ display: "none" }}
                  open={this.state.security_start.datepicker}
                  onChange={(date) => {
                    me.handleChange("security_start", date);
                    this.state.security_start.datepicker = false;
                    this.state.security_start.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "security_start";
                      this.state.comment_box.label =
                        "security_start " +
                        this.formatTime(this.state.security_start.date);
                      this.state.comment_box.value = this.state.security_start.message;
                      me.setState({
                        security_start: this.state.security_start,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({
                        security_start: this.state.security_start,
                      });
                    }
                  }}
                  onClose={() => {
                    this.state.security_start.datepicker = false;
                    me.setState({ security_start: this.state.security_start });
                  }}
                  okLabel={"Security Start"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.security_start.datepicker = true;
                    me.setState({ security_start: this.state.security_start });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={DoorOpenImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>Security Start</label>
                    <div class={classes.time}>
                      {this.state.security_start.date == null
                        ? "- : -"
                        : this.formatTime(this.state.security_start.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.security_end.date}
                  style={{ display: "none" }}
                  open={this.state.security_end.datepicker}
                  onChange={(date) => {
                    me.handleChange("security_end", date);
                    this.state.security_end.datepicker = false;
                    this.state.security_end.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "security_end";
                      this.state.comment_box.label =
                        "security_end " +
                        this.formatTime(this.state.security_end.date);
                      this.state.comment_box.value = this.state.security_end.message;
                      me.setState({
                        security_end: this.state.security_end,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({ security_end: this.state.security_end });
                    }
                  }}
                  onClose={() => {
                    this.state.security_end.datepicker = false;
                    me.setState({ security_end: this.state.security_end });
                  }}
                  okLabel={"Security End"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.security_end.datepicker = true;
                    me.setState({ security_end: this.state.security_end });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={DoorCloseImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>Security End</label>
                    <div class={classes.time}>
                      {this.state.security_end.date == null
                        ? "- : -"
                        : this.formatTime(this.state.security_end.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.service_start.date}
                  style={{ display: "none" }}
                  open={this.state.service_start.datepicker}
                  onChange={(date) => {
                    me.handleChange("service_start", date);
                    this.state.service_start.datepicker = false;
                    this.state.service_start.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "service_start";
                      this.state.comment_box.label =
                        "service_start " +
                        this.formatTime(this.state.service_start.date);
                      this.state.comment_box.value = this.state.service_start.message;
                      me.setState({
                        service_start: this.state.service_start,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({ service_start: this.state.service_start });
                    }
                  }}
                  onClose={() => {
                    this.state.service_start.datepicker = false;
                    me.setState({ service_start: this.state.service_start });
                  }}
                  okLabel={"Service Start"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.service_start.datepicker = true;
                    me.setState({ service_start: this.state.service_start });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={DoorOpenImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>Service Start</label>
                    <div class={classes.time}>
                      {this.state.service_start.date == null
                        ? "- : -"
                        : this.formatTime(this.state.service_start.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.service_end.date}
                  style={{ display: "none" }}
                  open={this.state.service_end.datepicker}
                  onChange={(date) => {
                    me.handleChange("service_end", date);
                    this.state.service_end.datepicker = false;
                    this.state.service_end.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "service_end";
                      this.state.comment_box.label =
                        "service_end " +
                        this.formatTime(this.state.service_end.date);
                      this.state.comment_box.value = this.state.service_end.message;
                      me.setState({
                        service_end: this.state.service_end,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({ service_end: this.state.service_end });
                    }
                  }}
                  onClose={() => {
                    this.state.service_end.datepicker = false;
                    me.setState({ service_end: this.state.service_end });
                  }}
                  okLabel={"Service End"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.service_end.datepicker = true;
                    me.setState({ service_end: this.state.service_end });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={DoorCloseImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>Service End</label>
                    <div class={classes.time}>
                      {this.state.service_end.date == null
                        ? "- : -"
                        : this.formatTime(this.state.service_end.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={6} className="action">
                <TimePicker
                  clearable
                  ampm={false}
                  label="24 hours"
                  value={this.state.out.date}
                  style={{ display: "none" }}
                  open={this.state.out.datepicker}
                  onChange={(date) => {
                    me.handleChange("out", date);
                    this.state.out.datepicker = false;
                    this.state.out.date = date;

                    if (date != null) {
                      this.state.comment_box.open = true;
                      this.state.comment_box.state = "out";
                      this.state.comment_box.label =
                        "out " + this.formatTime(this.state.out.date);
                      this.state.comment_box.value = this.state.out.message;
                      me.setState({
                        out: this.state.out,
                        comment_box: this.state.comment_box,
                      });
                    } else {
                      me.setState({ out: this.state.out });
                    }
                  }}
                  onClose={() => {
                    this.state.out.datepicker = false;
                    me.setState({ out: this.state.out });
                  }}
                  okLabel={"Out"}
                />
                <div
                  className={classes.action_item}
                  onClick={() => {
                    this.state.out.datepicker = true;
                    me.setState({ out: this.state.out });
                  }}
                >
                  <div className={classes.icon}>
                    <img className={classes.iconImage} src={OutImg} />
                  </div>
                  <div className={classes.time_update}>
                    <label className={classes.label}>Out</label>
                    <div class={classes.time}>
                      {this.state.out.date == null
                        ? "- : -"
                        : this.formatTime(this.state.out.date)}{" "}
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </MuiPickersUtilsProvider>
        <CommentBox
          options={this.state.comment_box}
          onClose={() => {
            this.state.comment_box.open = false;
            this.setState({ comment_box: this.state.comment_box });
          }}
          onSubmit={(message) => {
            this.state.comment_box.open = false;
            this.state[this.state.comment_box.state]["message"] = message;
            this.setState(
              {
                comment_box: this.state.comment_box,
                [this.state.comment_box.state]: this.state[
                  this.state.comment_box.state
                ],
              },
              function () {
                this.addTrans();
              }
            );
          }}
        />
        <Error
          message={this.state.error.message}
          open={this.state.error.open}
          onClose={() => {
            this.state.error.open = false;
            this.state[this.state.error.state].date = null;
            this.state.comment_box.open = false;
            this.setState({
              error: this.state.error,
              [this.state[this.state.error.state]]: [
                this.state[this.state.error.state].date,
              ],
              comment_box: this.state.comment_box,
            });
          }}
        />
      </div>
    );
  }
}
const styles = (theme) => {
  return createStyles({
    container: {
      padding: theme.spacing(4),
    },
    action_item: {
      border: "solid 1px " + theme.palette.primary.main,
      display: "flex",
    },
    action_item2: {
      border: "solid 1px " + theme.palette.primary.main,
      paddingTop: "15px",
      color: theme.palette.common,
      height: "55px",
      textAlign: "center",
    },
    action_item2_disabled: {
      border: "solid 1px " + theme.palette.disabled,
      paddingTop: "15px",
      color: theme.palette.common,
      height: "55px",
      textAlign: "center",
      pointerEvents: "none",
      opacity: 0.4,
    },
    icon: {
      flex: 3,
      alignItems: "center",
      justifyContent: "center",
      padding: "10px",
      textAlign: "center",
      borderRight: "solid 1px " + theme.palette.primary.main,
    },
    iconImage: {
      height: "30px",
      maxWidth: "40px",
    },
    time_update: {
      flex: 7,
      color: theme.palette.common,
      fontSize: "17px",
      padding: "5px",
    },
    label: {
      display: "block",
      textAlign: "center",
      fontSize: "12px",
    },
    time: {
      textAlign: "center",
    },
    topBar: {
      borderCollapse: "collapse",
      width: "100%",
    },
    flightMeta: {
      width: "90%",
      margin: "0 auto",
    },
    alignCenter: {
      textAlign: "center",
    },
    flighNo: {
      marginTop: theme.spacing(4),
    },
    tcolor: {
      color: theme.palette.common,
    },
  });
};
export default connect(
  (store) => {
    return {};
  },
  {
    setPage: setPage,
    setPageAction: setAction,
  }
)(compose(withRouter, withStyles(styles))(FIMS));
