// import React from "react";
// import { createStyles, withStyles } from "@material-ui/core/styles";
// import { compose } from "recompose";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import {
//   Typography,
  
//   Fab,
//   Grid,
//   MenuItem,
//   FormControl,
//   Select,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Tooltip,
// } from "@material-ui/core";
// import { Print as PrintIcon } from "@material-ui/icons";
// import ZoomInIcon from "@material-ui/icons/ZoomIn";
// import ZoomOutIcon from "@material-ui/icons/ZoomOut";
// import { setPage, setAction } from "../../../Action/pageaction";
// import SelectInput from "../../common/Select/index";
// import { get } from "lodash";
// import * as Enviornment from "../../../Action/environment";
// import { printtrimSheet } from "../../../Action/trimsheetprintaction";
// import { fetchTrimSheetforFlight } from "../../../Action/fimsTrimsheetaction";
// import momentTZ from "moment-timezone";
// import moment from "moment";
// import html2canvas from "html2canvas";
// import { jsPDF } from "jspdf";
// import { checkLmcStatus } from "../../../Action/rampaction";
// import { UpdateCaptEmpId } from "../../../Action/LMCupdaeaction";
// import "./style.scss";
// import QRPopupModel from "../../common/QRPopup/index";

// var QRCode = require("qrcode.react");

// class Trimsheet extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       in_prog: false,
//       trim_sheet: null,
//       error: false,
//       is_printing: false,
//       totalLoad: null,
//       Maxcargo: [],
//       Maxpax: [],
//       totalAdult: null,
//       COMPWT: 0,
//       CABBGWT: 0,
//       PAXWT: 0,
//       CONFIG: "",
//       totalChild: null,
//       totalInfant: null,
//       thrust: 0,
//       flap: "",
//       stab: 0,
//       crew: 0,
//       DOW: 0,
//       lim1: false,
//       lim2: false,
//       lim3: false,
//       hideLmc: false,
//       hideTrimsheet: false,
//       zoom: 130,
//       totalLoadUpperDeck: 0,
//       loadUpperdeckRows: [],
//       totalLoadLowerDeck: 0,
//       loadLowerdeckRows: [],
//       TTL_CREW: 0,
//       TTL_SUB: 0,
//       POB: 0,
//       toleranceLimits: "NO LMC LIMITS APPROVED FOR FREIGHTER AIRCRAFT",
//       is_lmc: false,
//       isScan: false,
//       isDownloading: false,
//       isDownloaded: false,
//       displayQrCode: false,
//       qrcodeData: "",
//       sharebutton:false,
//       trimAccepted: false,
//       Dialogopen: false,
//     };
//     this.fetchTrimSheet = this.fetchTrimSheet.bind(this);
//     this.checkLmc = this.checkLmc.bind(this);
//     this.handleZoom = this.handleZoom.bind(this);
//   }

//   gogingBack = false;

//   componentDidUpdate() {
//     if (
//       !this.state.in_prog &&
//       !this.props.sync.ramp_sync &&
//       !this.state.isDownloaded &&
//       !this.state.isDownloading
//     ) {
//       const capName = localStorage.getItem("name");
//       if (capName && !this.gogingBack) {
//         this.gogingBack = false;
//         setTimeout(() => {
//           this.gogingBack = true;
//           // this.cordovaPdfDownload()
//           this.generateJson();
//           this.setState({
//             trimAccepted: true,
//           });
//         }, 1 * 1000);
//       }
//     }
//   }

//   componentWillReceiveProps(newProps) {
//     console.log(newProps);
//     console.log("props================", newProps.location.state);
//     if (newProps.location.state !== undefined) {
//       const shareButton = newProps.location.state.sharebutton;
//       this.setState({ sharebutton: shareButton });
//     }

    


//     // if (
//     //   this.props.sync.ramp_sync == false &&
//     //   newProps.sync.ramp_sync &&
//     //   this.state.isScan == false
//     // ) {
//     //   this.fetchTrimSheet();
//     // }
//   }

//   componentWillMount() {
//     this.props.setPage("FimsTrimsheet", "FimsTrimsheet");
//     this.props.setPageAction(null);
//     this.checkLmc();
//     if (this.state.isScan == false) {
//       this.fetchTrimSheet();
//     }
//   }

//   showTrimsheet() {
//     // this.gogingBack = true;
//     this.setState({
//       displayQrCode: false,
//     });
//   }

//   checkLmc() {
//     var me = this;
//     var flightNo = this.props.match.params.flight_no;
//     var flightDate = this.props.match.params.flight_date;
//     var source = this.props.match.params.source;
//     var destination = this.props.match.params.destination;
//     var status = this.props.match.params.status;
//     if (status === "past") {
//       this.setState({ hideLmc: true });
//     } else {
//       var data = {
//         FlightNo: flightNo,
//         Flight_Date: moment(flightDate).format("YYYY-MM-DD"),
//         Source: source,
//         Destination: destination,
//       };
//       console.log("post data", data);
//       checkLmcStatus(data)
//         .then((res) => {
//           console.log("result", res);
//           if (res.data.status === "Open") {
//             this.setState({ hideTrimsheet: true });
//           }
//         })
//         .catch((err) => {
//           // me.setState({ in_prog: false, error: true });
//           me.setState({ in_prog: false, error: false });
//         });
//     }
//   }
//   fetchTrimSheet() {
//     var me = this;
//     var user = JSON.parse(window.localStorage.getItem("auth_user"));
//     me.setState({ in_prog: true, error: false, is_lmc: user.is_lmc });
//     var source = this.props.match.params.source;
//     var destination = this.props.match.params.destination;
//     var flight_date = this.props.match.params.flight_date;

//     fetchTrimSheetforFlight(
//       this.props.match.params.flight_no,
//       flight_date,
//       source,
//       destination
//     )
//       .then((trim) => {
//         console.log(trim);
//         var count = 0;
//         var stdCount = 0;
//         var crewArray = trim.ActcrewStr.split("/");
//         var stdcrewArray = trim.STDCREW.match(/\d+/g);
//         console.log(trim.AdjustStr);
//         var cabinArray = [];
//         var cabinBagagge = 0;

//         var TTL_CREW = 0;
//         var TTL_SUB = 0;
//         var POB = 0;

//         if (trim["IsCargoOnSeatStr"] == true || trim["IsFreighter"] == 1) {
//           cabinArray = trim.AdjustStrv2.split("$");
//           cabinBagagge = parseInt(cabinArray[3]);
//           if (isNaN(cabinBagagge)) {
//             cabinBagagge = 0;
//           }

//           var crewSplit = trim.ActcrewStr.split("/");

//           POB = parseInt(crewSplit[0]) + parseInt(crewSplit[1]);
//           TTL_CREW = parseInt(crewSplit[0]);
//           TTL_SUB = parseInt(crewSplit[1]);
//         } else {
//           cabinArray = trim.AdjustStrv2.split("$");
//           cabinBagagge = parseInt(cabinArray[3]);
//           if (isNaN(cabinBagagge)) {
//             cabinBagagge = 0;
//           }
//         }

//         // if(trim['IsFreighter'] == 0){
//         //   cabinArray = trim.AdjustStr.split("$");
//         //   cabinBagagge = parseInt(cabinArray[12]);
//         //   if (isNaN(cabinBagagge)) {
//         //     cabinBagagge = 0;
//         //   }
//         // } else {
//         //   cabinArray = trim.AdjustStrv2.split("$");
//         //   cabinBagagge = parseInt(cabinArray[3]);
//         //   if (isNaN(cabinBagagge)) {
//         //     cabinBagagge = 0;
//         //   }

//         //   var crewSplit   =   trim.ActcrewStr.split("/");

//         //   POB = parseInt(crewSplit[0]) + parseInt(crewSplit[1]);

//         //   TTL_CREW = POB - parseInt(cabinArray[9]);
//         //     // TTL_CREW = parseInt(crewSplit[0]) + parseInt(crewSplit[1]) + parseInt(cabinArray[0]) +  parseInt(cabinArray[4])  +  parseInt(cabinArray[5]) +  parseInt(cabinArray[5]);
//         //     TTL_SUB = parseInt(cabinArray[9])
//         //     // POB = TTL_CREW +  TTL_SUB;

//         //   if(trim.IsCargoOnSeatStr == true){
//         //     TTL_CREW = parseInt(crewSplit[0])
//         //     TTL_SUB = parseInt(crewSplit[1])
//         //   }else{

//         //   }

//         // }

//         console.log(cabinArray);
//         console.log(cabinBagagge);
//         var crew = crewArray.map((x) => {
//           var c = parseInt(x);
//           count = count + c;
//           return x;
//         });

//         stdcrewArray.map((x) => {
//           var c = parseInt(x);
//           stdCount = stdCount + c;
//           return x;
//         });
//         var ACM = (count - stdCount) * 85;
//         var DOW = Math.round(trim.OEW);
//         console.log("ACM", ACM);
//         console.log("DOW", DOW);

//         //Uper deck calculation for frieght aircraft
//         var loadUpperdeck = [];
//         var totalLoadUpperDeck = 0;
//         if (trim.IsFreighter == 1) {
//           var loadUpperdeckCabin = trim.PalletsStr.split("#");
//           loadUpperdeckCabin.forEach((deck) => {
//             var deckValues = deck.split("$");
//             if (deckValues[1] == undefined) {
//               return;
//             }
//             var load = 0;
//             if (!isNaN(deckValues[6])) {
//               load = parseInt(deckValues[6]);
//             }

//             if (isNaN(load)) {
//               load = 0;
//             }

//             loadUpperdeck.push({
//               name: deckValues[1],
//               load: isNaN(load) ? 0 : load,
//             });
//             totalLoadUpperDeck += load;
//           });
//         }

//         if (trim.IsCargoOnSeatStr == true) {
//           var loadUpperdeckCabin = trim.CargoOnSeatStr.split("#");
//           loadUpperdeckCabin.forEach((zone) => {
//             var name = "";
//             var load = 0;

//             var zoneSplit = zone.split("*");
//             zoneSplit.forEach((deck) => {
//               var deckValues = deck.split("$");
//               if (
//                 deckValues[0] == undefined ||
//                 String(deckValues[0]).trim().length == 0
//               ) {
//                 return;
//               }
//               name = String(deckValues[0]).trim();
//               var deckLoad = 0;
//               if (!isNaN(deckValues[2])) {
//                 deckLoad = parseInt(deckValues[2]);
//               }

//               if (isNaN(deckLoad)) {
//                 deckLoad = 0;
//               }
//               load += deckLoad;
//             });
//             if (String(name).trim() == 0) {
//               return;
//             }
//             loadUpperdeck.push({
//               name: name,
//               load: isNaN(load) ? 0 : load,
//             });
//             totalLoadUpperDeck += load;
//           });
//         }

//         var loadUpperdeckRows = [];
//         var upperDectRowItemCount = 4;
//         var tempArrayForUpperDeck = [];
//         for (var i = 0; i < loadUpperdeck.length; i++) {
//           tempArrayForUpperDeck.push(loadUpperdeck[i]);
//           if (i % upperDectRowItemCount == 3) {
//             loadUpperdeckRows.push([...tempArrayForUpperDeck]);
//             tempArrayForUpperDeck = [];
//           }
//         }
//         if (tempArrayForUpperDeck.length > 0) {
//           loadUpperdeckRows.push([...tempArrayForUpperDeck]);
//         }
//         console.log(loadUpperdeckRows, totalLoadUpperDeck, "Upper Deck");

//         //Lower deck calculation for frieght aircraft
//         var loadLowerdeck = [];
//         var totalLoadLowerDeck = 0;
//         if (trim.IsFreighter == 1 || trim.IsCargoOnSeatStr == true) {
//           var loadUpperdeckCabin = trim.ActCompStr.split("$");
//           loadUpperdeckCabin.forEach((deck, i) => {
//             if (deck.length == 0) {
//               return;
//             }
//             var deckValue = 0;
//             if (!isNaN(deck)) {
//               deckValue = parseInt(deck);
//             }
//             if (isNaN(deckValue)) {
//               deckValue = 0;
//             }
//             loadLowerdeck.push({
//               name: "C" + (i + 1),
//               load: isNaN(deckValue) ? 0 : deckValue,
//             });
//             totalLoadLowerDeck += deckValue;
//           });
//         }

//         var loadLowerdeckRows = [];
//         var lowerDectRowItemCount = 5;
//         var tempArrayForLowerDeck = [];
//         for (var i = 0; i < loadLowerdeck.length; i++) {
//           tempArrayForLowerDeck.push(loadLowerdeck[i]);
//           if (i % lowerDectRowItemCount == 4) {
//             loadLowerdeckRows.push([...tempArrayForLowerDeck]);
//             tempArrayForLowerDeck = [];
//           }
//         }
//         if (tempArrayForLowerDeck.length > 0) {
//           loadLowerdeckRows.push([...tempArrayForLowerDeck]);
//         }
//         console.log(loadLowerdeckRows, totalLoadLowerDeck, "Lower Deck");

//         console.log("count", count);
//         console.log("stdCount", stdCount);
//         var LIM1 = parseInt(trim.MZFW + trim.FOB);
//         var LIM2 = parseInt(trim.OTOW);
//         var LIM3 = parseInt(trim.OLW + trim.TRIP_FUEL);

//         console.log("lim 1", LIM1);
//         console.log("lim 2", LIM2);
//         console.log("lim 3", LIM3);
//         if (LIM1 < LIM2 && LIM1 < LIM3) {
//           this.setState({ lim1: true });
//         }
//         if (LIM2 < LIM1 && LIM2 < LIM3) {
//           this.setState({ lim2: true });
//         }
//         if (LIM3 < LIM1 && LIM3 < LIM2) {
//           this.setState({ lim3: true });
//         }
//         var finalConfig = "";
//         if (trim["IsFreighter"] == 1) {
//           finalConfig = trim.CONFIG;
//         } else if (trim["IsCargoOnSeatStr"] == 1) {
//           finalConfig = trim.CONFIG.replace("Y", "CIC");
//         } else {
//           var alpha = trim.CONFIG.match(/[a-zA-Z]/g).join("");
//           var digit = trim.CONFIG.match(/\d/g).join("");
//           finalConfig = digit + alpha;
//         }

//         var totalAdult =
//           trim.C1Adult +
//           trim.C2Adult +
//           trim.C3Adult +
//           trim.C4Adult +
//           trim.C5Adult +
//           trim.C6Adult +
//           trim.C7Adult +
//           trim.C8Adult;
//         var totalChild =
//           trim.C1Child +
//           trim.C2Child +
//           trim.C3Child +
//           trim.C4Child +
//           trim.C5Child +
//           trim.C6Child +
//           trim.C7Child +
//           trim.C8Child;
//         var totalInfant =
//           trim.C1Infant +
//           trim.C2Infant +
//           trim.C3Infant +
//           trim.C4Infant +
//           trim.C5Infant +
//           trim.C6Infant +
//           trim.C7Infant +
//           trim.C8Infant;
//         var COMPWT = trim.cmpt1 + trim.cmpt2 + trim.cmpt3 + trim.cmpt4;
//         var CABBGWT = cabinBagagge;
//         var PAXWT = totalAdult * 75 + totalChild * 35 + totalInfant * 10;
//         var TTLLOAD = 0;

//         if (trim["IsCargoOnSeatStr"] == true || trim["IsFreighter"] == 1) {
//           TTLLOAD = cabinBagagge + totalLoadLowerDeck + totalLoadUpperDeck;
//         } else {
//           TTLLOAD =
//             trim.cmpt1 +
//             trim.cmpt2 +
//             trim.cmpt3 +
//             trim.cmpt4 +
//             (trim.C1Adult +
//               trim.C2Adult +
//               trim.C3Adult +
//               trim.C4Adult +
//               trim.C5Adult +
//               trim.C6Adult +
//               trim.C7Adult +
//               trim.C8Adult) *
//               75 +
//             (trim.C1Child +
//               trim.C2Child +
//               trim.C3Child +
//               trim.C4Child +
//               trim.C5Child +
//               trim.C6Child +
//               trim.C7Child +
//               trim.C8Child) *
//               35 +
//             (trim.C1Infant +
//               trim.C2Infant +
//               trim.C3Infant +
//               trim.C4Infant +
//               trim.C5Infant +
//               trim.C6Infant +
//               trim.C7Infant +
//               trim.C8Infant) *
//               10 +
//             cabinBagagge;
//         }

//         var thrust = trim.Thrust1 > 0 ? trim.Thrust1 : 0;
//         var flap = thrust > 0 ? trim.T1Flap1 : "";
//         var stab = thrust > 0 ? trim.T1Stab1 : 0;

//         var toleranceLimits = "NO LMC LIMITS APPROVED FOR FREIGHTER AIRCRAFT";
//         if (trim["IsCargoOnSeatStr"] == true) {
//           if (trim["Acft_Type"] == "Q400") {
//             toleranceLimits =
//               "+ / - 200 KG OF ACM / SNY / CARGO IN COMPARTMENT AND + / - 500 KG FUEL.";
//           } else {
//             toleranceLimits =
//               "+ / - 400 KG OF ACM / SNY / CARGO IN LOWER DECK AND + / - 1000 KG FUEL.";
//           }
//         } else if (trim["IsFreighter"] == 1) {
//           if (trim["Acft_Type"] == "Q400") {
//             toleranceLimits =
//               "+ / - 200 KG OF ACM / SNY / CARGO IN COMPARTMENT AND + / - 500 KG FUEL.";
//           } else {
//             toleranceLimits =
//               "+ / - 400 KG OF ACM / SNY / CARGO IN LOWER DECK AND + / - 1000 KG FUEL.";
//           }
//         } else {
//           if (trim["Acft_Type"] == "Q400") {
//             toleranceLimits =
//               "+ / - 200 KG OF PERSON ON BOARD / BAGGAGE / CARGO AND + / - 500 KG. FUEL.";
//           } else {
//             toleranceLimits =
//               "+ / - 400 KG OF PERSON ON BOARD / BAGGAGE / CARGO AND + / - 1000 KG FUEL.";
//           }
//         }
//         me.setState({
//           in_prog: false,
//           CONFIG: finalConfig,
//           CABBGWT: CABBGWT,
//           COMPWT: COMPWT,
//           PAXWT: PAXWT,
//           stab: stab,
//           flap: flap,
//           thrust: thrust,
//           error: false,
//           trim_sheet: trim,
//           crew: count,
//           DOW: DOW,
//           Maxcargo: trim.MaxCompartment,
//           Maxpax: trim.MaxCabin,
//           totalLoad: TTLLOAD,
//           totalAdult: totalAdult,
//           totalChild: totalChild,
//           totalInfant: totalInfant,
//           loadUpperdeckRows: loadUpperdeckRows,
//           totalLoadUpperDeck: totalLoadUpperDeck,
//           totalLoadLowerDeck: totalLoadLowerDeck,
//           loadLowerdeckRows: loadLowerdeckRows,
//           TTL_CREW: TTL_CREW,
//           TTL_SUB: TTL_SUB,
//           POB: POB,
//           toleranceLimits: toleranceLimits,
//         });
//         console.log("state", this.state);
//       })
//       .catch((err) => {
//         console.log(err, "error...");
//         me.setState({ in_prog: false, error: true, trim_sheet: null });
//       });
//   }

//   formatTime(str) {
//     if (str == null) {
//       return "-";
//     }
//     return moment(str).format("HH:mm");
//   }

//   formatThrust(number) {
//     if (number == null) {
//       return "-";
//     }
//     var a = "K";
//     var new_number = parseInt(number) / 1000 + a;

//     return new_number;
//   }

//   fixedNumber(number) {
//     console.log(number);
//     console.log("number...");
//     var value = Number(number);
//     var res = String(number).split(".");
//     if (res.length == 1 || res[1].length >= 1) {
//       value = value.toFixed(2);
//     }
//     return value;
//   }
//   fixed1Number(number) {
//     var value = Number(number);
//     var res = String(number).split(".");
//     if (res.length == 1 || res[1].length >= 1) {
//       value = value.toFixed(1);
//     }
//     return value;
//   }

//   formatDate(str) {
//     if (str == null) {
//       return "-";
//     }
//     return moment(str).format("DDMMMYY").toUpperCase();
//   }
//   formatDateGetDay(str) {
//     if (str == null) {
//       return "-";
//     }
//     return moment(str).format("DD");
//   }

//   thrustChangeHandle() {
//     var me = this;
//     if (
//       this.state.thrust === this.state.trim_sheet.Thrust1 &&
//       this.state.flap === this.state.trim_sheet.T1Flap1
//     ) {
//       me.setState({ stab: this.state.trim_sheet.T1Stab1 });
//     }
//     if (
//       this.state.thrust === this.state.trim_sheet.Thrust1 &&
//       this.state.flap === this.state.trim_sheet.T1Flap2
//     ) {
//       me.setState({ stab: this.state.trim_sheet.T1Stab2 });
//     }
//     if (
//       this.state.thrust === this.state.trim_sheet.Thrust2 &&
//       this.state.flap === this.state.trim_sheet.T2Flap1
//     ) {
//       me.setState({ stab: this.state.trim_sheet.T2Stab1 });
//     }

//     if (
//       this.state.thrust === this.state.trim_sheet.Thrust2 &&
//       this.state.flap === this.state.trim_sheet.T2Flap2
//     ) {
//       me.setState({ stab: this.state.trim_sheet.T2Stab2 });
//     }

//     if (
//       this.state.thrust === this.state.trim_sheet.Thrust3 &&
//       this.state.flap === this.state.trim_sheet.T3Flap1
//     ) {
//       me.setState({ stab: this.state.trim_sheet.T3Stab1 });
//     }

//     if (
//       this.state.thrust === this.state.trim_sheet.Thrust3 &&
//       this.state.flap === this.state.trim_sheet.T3Flap2
//     ) {
//       me.setState({ stab: this.state.trim_sheet.T3Stab2 });
//     }

//     if (
//       this.state.thrust === this.state.trim_sheet.Thrust4 &&
//       this.state.flap === this.state.trim_sheet.T4Flap1
//     ) {
//       me.setState({ stab: this.state.trim_sheet.T4Stab1 });
//     }

//     if (
//       this.state.thrust === this.state.trim_sheet.Thrust4 &&
//       this.state.flap === this.state.trim_sheet.T4Flap2
//     ) {
//       me.setState({ stab: this.state.trim_sheet.T4Stab2 });
//     }
//   }

//   handleZoom(type) {
//     var me = this;
//     console.log("type", type);
//     if (type === "zoomOut") {
//       if (me.state.zoom > 50) {
//         me.state.zoom = parseInt(me.state.zoom - 10);
//         this.setState({ zoom: me.state.zoom });
//       }
//     } else {
//       if (me.state.zoom < 200) {
//         me.state.zoom = parseInt(me.state.zoom + 10);
//         this.setState({ zoom: me.state.zoom });
//       }
//     }
//   }

//   savebase64AsPDF = (folderpath, filename, blob) => {
//     // Convert the base64 string in a Blob
//     try {
//       window.resolveLocalFileSystemURL(
//         folderpath,
//         function (dir) {
//           dir.getFile(
//             filename,
//             { create: true },
//             function (file) {
//               file.createWriter(
//                 function (fileWriter) {
//                   fileWriter.write(blob);
//                 },
//                 function () {
//                   alert("Unable to save file in path " + folderpath);
//                 }
//               );
//             },
//             (err) => alert(JSON.stringify(err))
//           );
//         },
//         (err) => alert(JSON.stringify(err))
//       );
//     } catch (err) {
//       alert(err);
//     }
//   };

//   createFolder = () => {
//     return new Promise((res, rej) => {
//       try {
//         window.resolveLocalFileSystemURL(
//           window.cordova.file.externalRootDirectory,
//           function (dir) {
//             dir.getDirectory(
//               "SALTArchive",
//               { create: true },
//               () => {
//                 res(true);
//               },
//               (err) => res(true)
//             );
//           },
//           (err) => res(true)
//         );
//       } catch (err) {
//         rej(err);
//       }
//     });
//   };

//   cordovaPdfDownload = () => {
//     this.setState(
//       {
//         isDownloading: true,
//       },
//       () => {
//         const input = document.getElementById("trimsheet");
//         const [fix, name] = get(this.state, "trim_sheet.Flight_no", "").split(
//           "SG"
//         );
//         const dest = get(this.state, "trim_sheet.Destination", "");
//         const source = get(this.state, "trim_sheet.Source", "");
//         const date = new Date(get(this.state, "trim_sheet.Flight_Date", ""));
//         const fileName = `${name}${source}${dest}${moment(date).format(
//           "DDMMMYYYY"
//         )}.pdf`;
//         html2canvas(input).then(async (canvas) => {
//           const imgData = canvas.toDataURL("image/jpeg", 0.1);
//           const imgWidth = 210;
//           const pageHeight = 1300;
//           const imgHeight = (canvas.height * imgWidth) / canvas.width;
//           let heightLeft = imgHeight;
//           const pdf = new jsPDF("p", "mm", [1300, 210]);
//           let position = 0;
//           pdf.addImage(
//             imgData,
//             "jpeg",
//             0,
//             position,
//             imgWidth,
//             imgHeight + 10,
//             "FAST",
//             "FAST"
//           );
//           heightLeft -= pageHeight;
//           // pdf.output('dataurlnewwindow');
//           while (heightLeft >= 0) {
//             position = heightLeft - imgHeight;
//             pdf.addPage();
//             pdf.addImage(
//               imgData,
//               "jpeg",
//               0,
//               position,
//               imgWidth,
//               imgHeight + 10
//             );
//             heightLeft -= pageHeight;
//           }
//           const blob = pdf.output("blob");
//           var folderpath =
//             window.cordova.file.externalRootDirectory + "SALTArchive/"; //you can select other folders
//           await this.createFolder();
//           this.savebase64AsPDF(folderpath, fileName, blob);
//           this.setState({
//             isDownloading: false,
//             isDownloaded: true,
//             isScan: false,
//           });
//         });
//       }
//     );
//   };

//   generateJson() {
//     var ED = "ED-0";
//     if (this.state.trim_sheet.AppType !== null) {
//       ED = "ED-M0";
//     }
//     var lim1 = "";
//     var lim2 = "";
//     var lim3 = "";
//     if (this.state.lim1 == true) {
//       lim1 = "L";
//     }
//     if (this.state.lim3 == true) {
//       lim3 = "L";
//     }
//     if (this.state.lim2 == true) {
//       lim2 = "L";
//     }
//     var JSONData = {
//       fl_no:
//         this.state.trim_sheet.Flight_no +
//         "/" +
//         this.formatDateGetDay(this.state.trim_sheet.Flight_Date),
//       date: this.formatDate(this.state.trim_sheet.TrimGenTimeUTC),
//       time: this.formatTime(this.state.trim_sheet.TrimGenTimeUTC),
//       ED: ED + "" + this.state.trim_sheet.EDNO,
//       src:
//         this.state.trim_sheet.Source + "-" + this.state.trim_sheet.Destination,
//       acftT: this.state.trim_sheet.Acft_Type + "/" + this.state.CONFIG,
//       Acft_Regn: this.state.trim_sheet.Acft_Regn,
//       ActcrewStr: this.state.trim_sheet.ActcrewStr,
//       TTLLoad: this.state.totalLoad,
//       CABBGWT: this.state.CABBGWT,
//       DOW: this.state.DOW,
//       ZFW: this.state.trim_sheet.ZFW,
//       MZFW: this.state.trim_sheet.MZFW + lim1,
//       TOF: this.state.trim_sheet.FOB,
//       TOW: this.state.trim_sheet.TOW,
//       MTOW: this.state.trim_sheet.OTOW + lim2,
//       TRIP: this.state.trim_sheet.TRIP_FUEL,
//       LAW: this.state.trim_sheet.LAW,
//       MLAW: this.state.trim_sheet.OLW + lim3,
//       UNDERLOAD: this.state.trim_sheet.underLoadLMC,
//       DOI: this.fixedNumber(this.state.trim_sheet.OEW_Index),
//       LIZFW: this.fixedNumber(this.state.trim_sheet.ZFWindex),
//       LITOW: this.fixedNumber(this.state.trim_sheet.TOWindex),
//       LILW: this.fixedNumber(this.state.trim_sheet.LWindex),
//       FWD_LMT: this.fixedNumber(this.state.trim_sheet.ZFWMACFWD),
//       ZFWMAC: this.fixedNumber(this.state.trim_sheet.ZFWMAC),
//       AFT_LMT: this.fixedNumber(this.state.trim_sheet.ZFWMACAFT),
//       TOWFWD_LMT: this.fixedNumber(this.state.trim_sheet.TOWMACFWD),
//       TOWMAC: this.fixedNumber(this.state.trim_sheet.TOWMAC),
//       TOWAFT_LMT: this.fixedNumber(this.state.trim_sheet.TOWMACAFT),
//       LWMFWD_LMT: this.fixedNumber(this.state.trim_sheet.LWMACFWD),
//       LWMAC: this.fixedNumber(this.state.trim_sheet.LWMAC),
//       LWMAFT_LMT: this.fixedNumber(this.state.trim_sheet.LWMACAFT),
//       SI: this.state.trim_sheet.specialStr,
//       Trim_Officer: this.state.trim_sheet.Trim_Officer,
//       LTLoginId: this.state.trim_sheet.LTLoginId,
//       TrimGenTimeUTC: this.formatDate(this.state.trim_sheet.TrimGenTimeUTC),
//       TrimGenTimeUTCUTC:
//         this.formatTime(this.state.trim_sheet.TrimGenTimeUTC) + " UTC",
//       Load_Officer: this.state.trim_sheet.Load_Officer,
//       CAPTAIN: localStorage.getItem("name") || this.state.trim_sheet.CAPTAIN,
//       CPTID: localStorage.getItem("CaptEmpId"),
//       LETTER_NO:
//         "AUTOMATED LOAD & TRIM SHEET APPROVED BY DELHI DAW VIDE LETTER NO. DEL-11011(13)/9/2019-DAW-NR/1348 DATED 30-12-2020",
//       toleranceLimits: this.state.toleranceLimits,
//     };
//     console.log("generatedJson Data \n ", JSONData);
//     if (
//       this.state.trim_sheet.IsFreighter == 0 &&
//       this.state.trim_sheet.IsCargoOnSeatStr == false
//     ) {
//       JSONData["COMPWT"] = this.state.COMPWT;
//       JSONData["PAXWT"] = this.state.PAXWT;
//     }
//     if (this.state.trim_sheet.Thrust1) {
//       JSONData["THRUST"] = this.formatThrust(this.state.thrust);
//       JSONData["FLAP"] = this.state.flap;
//       JSONData["STAB"] = this.fixed1Number(this.state.stab);
//       var thrustValuesArry = String(this.state.trim_sheet.ThrustValues).split(
//         "$"
//       );
//       var stabValuesValuesArry = String(this.state.trim_sheet.StabValues).split(
//         "$"
//       );
//       var flapValues = String(this.state.trim_sheet.FlapValues).split("$");
//       var flapData = [];
//       for (var i = 0; i < thrustValuesArry.length - 1; i++) {
//         flapData.push({
//           FLAP: flapValues[i],
//           Thrust: thrustValuesArry[i],
//           STAB: stabValuesValuesArry[i],
//         });
//       }
//       JSONData["StabTbl"] = flapData;
//     }
//     var count = 0;
//     var crewArray = this.state.trim_sheet.ActcrewStr.split("/");
//     var crew = crewArray.map((x) => {
//       var c = parseInt(x);
//       count = count + c;
//       return count;
//     });

//     var cabinArray = [];
//     var cabinBagagge = 0;

//     var TTL_CREW = 0;
//     var TTL_SUB = 0;
//     var POB = 0;
//     if (
//       this.state.trim_sheet["IsCargoOnSeatStr"] == true ||
//       this.state.trim_sheet["IsFreighter"] == 1
//     ) {
//       cabinArray = this.state.trim_sheet.AdjustStrv2.split("$");
//       cabinBagagge = parseInt(cabinArray[3]);
//       if (isNaN(cabinBagagge)) {
//         cabinBagagge = 0;
//       }

//       var crewSplit = this.state.trim_sheet.ActcrewStr.split("/");

//       POB = parseInt(crewSplit[0]) + parseInt(crewSplit[1]);
//       TTL_CREW = parseInt(crewSplit[0]);
//       TTL_SUB = parseInt(crewSplit[1]);
//     } else {
//       cabinArray = this.state.trim_sheet.AdjustStrv2.split("$");
//       cabinBagagge = parseInt(cabinArray[3]);
//       if (isNaN(cabinBagagge)) {
//         cabinBagagge = 0;
//       }
//     }
//     var loadUpperdeck = [];
//     var totalLoadUpperDeck = 0;
//     if (this.state.trim_sheet.IsFreighter == 1) {
//       var loadUpperdeckCabin = this.state.trim_sheet.PalletsStr.split("#");
//       loadUpperdeckCabin.forEach((deck) => {
//         var deckValues = deck.split("$");
//         if (deckValues[1] == undefined) {
//           return;
//         }
//         var load = 0;
//         if (!isNaN(deckValues[6])) {
//           load = parseInt(deckValues[6]);
//         }

//         if (isNaN(load)) {
//           load = 0;
//         }

//         loadUpperdeck.push({
//           name: deckValues[1],
//           load: isNaN(load) ? 0 : load,
//         });
//         totalLoadUpperDeck += load;
//       });
//     }

//     if (this.state.trim_sheet.IsCargoOnSeatStr == true) {
//       var loadUpperdeckCabin = this.state.trim_sheet.CargoOnSeatStr.split("#");
//       loadUpperdeckCabin.forEach((zone) => {
//         var name = "";
//         var load = 0;

//         var zoneSplit = zone.split("*");
//         zoneSplit.forEach((deck) => {
//           var deckValues = deck.split("$");
//           if (
//             deckValues[0] == undefined ||
//             String(deckValues[0]).trim().length == 0
//           ) {
//             return;
//           }
//           name = String(deckValues[0]).trim();
//           var deckLoad = 0;
//           if (!isNaN(deckValues[2])) {
//             deckLoad = parseInt(deckValues[2]);
//           }

//           if (isNaN(deckLoad)) {
//             deckLoad = 0;
//           }
//           load += deckLoad;
//         });
//         if (String(name).trim() == 0) {
//           return;
//         }
//         loadUpperdeck.push({
//           name: name,
//           load: isNaN(load) ? 0 : load,
//         });
//         totalLoadUpperDeck += load;
//       });
//     }

//     var loadUpperdeckRows = [];
//     var upperDectRowItemCount = 4;
//     var tempArrayForUpperDeck = [];
//     for (var i = 0; i < loadUpperdeck.length; i++) {
//       tempArrayForUpperDeck.push(loadUpperdeck[i]);
//       if (i % upperDectRowItemCount == 3) {
//         loadUpperdeckRows.push([...tempArrayForUpperDeck]);
//         tempArrayForUpperDeck = [];
//       }
//     }
//     if (tempArrayForUpperDeck.length > 0) {
//       loadUpperdeckRows.push([...tempArrayForUpperDeck]);
//     }
//     console.log(loadUpperdeckRows, totalLoadUpperDeck, "Upper Deck");

//     //Lower deck calculation for frieght aircraft
//     var loadLowerdeck = [];
//     var totalLoadLowerDeck = 0;
//     if (
//       this.state.trim_sheet.IsFreighter == 1 ||
//       this.state.trim_sheet.IsCargoOnSeatStr == true
//     ) {
//       var loadUpperdeckCabin = this.state.trim_sheet.ActCompStr.split("$");
//       loadUpperdeckCabin.forEach((deck, i) => {
//         if (deck.length == 0) {
//           return;
//         }
//         var deckValue = 0;
//         if (!isNaN(deck)) {
//           deckValue = parseInt(deck);
//         }
//         if (isNaN(deckValue)) {
//           deckValue = 0;
//         }
//         loadLowerdeck.push({
//           name: "C" + (i + 1),
//           load: isNaN(deckValue) ? 0 : deckValue,
//         });
//         totalLoadLowerDeck += deckValue;
//       });
//     }

//     var loadLowerdeckRows = [];
//     var lowerDectRowItemCount = 5;
//     var tempArrayForLowerDeck = [];
//     for (var i = 0; i < loadLowerdeck.length; i++) {
//       tempArrayForLowerDeck.push(loadLowerdeck[i]);
//       if (i % lowerDectRowItemCount == 4) {
//         loadLowerdeckRows.push([...tempArrayForLowerDeck]);
//         tempArrayForLowerDeck = [];
//       }
//     }
//     if (tempArrayForLowerDeck.length > 0) {
//       loadLowerdeckRows.push([...tempArrayForLowerDeck]);
//     }
//     console.log(loadLowerdeckRows, totalLoadLowerDeck, "Lower Deck");

//     console.log("count", count);
//     var Maxcarg = this.state.trim_sheet.MaxCompartment;
//     var Maxpax = this.state.trim_sheet.MaxCabin;
//     var loadUpperdeckArr = [];
//     var loadLowerdeckArr = [];
//     var loadUpperdeckJson = {};
//     var loadLowerdeckJson = {};
//     if (
//       this.state.trim_sheet.IsFreighter === 1 ||
//       this.state.trim_sheet.IsCargoOnSeatStr === true
//     ) {
//       loadUpperdeckRows.forEach((row) => {
//         row.forEach((item, i) => {
//           loadUpperdeckJson[item.name] = item.load;
//         });
//       });
//       loadUpperdeckArr.push(loadUpperdeckJson);
//       JSONData["LOAD IN UPPER DECK"] = loadUpperdeckArr;
//       loadLowerdeckRows.forEach((row) => {
//         row.forEach((item, i) => {
//           loadLowerdeckJson[item.name] = item.load;
//         });
//       });
//       loadLowerdeckArr.push(loadLowerdeckJson);
//       JSONData["LOAD IN LOWER DECK"] = loadLowerdeckArr;
//       JSONData["TTLLOADUPPERDECK"] = this.state.totalLoadUpperDeck;
//       JSONData["TTLLOADLOWERDECK"] = this.state.totalLoadLowerDeck;
//       JSONData["TTLDEADLOADONFLT"] =
//         this.state.totalLoadUpperDeck + this.state.totalLoadLowerDeck;
//       JSONData["TTL_CREW"] = TTL_CREW;
//       JSONData["TTL_SUB"] = TTL_SUB;
//       JSONData["POB"] = POB;
//     } else {
//       var cmptData = [];
//       if (Maxcarg >= 1) {
//         cmptData.push({ 1: this.state.trim_sheet.cmpt1 });
//       }
//       if (Maxcarg >= 2) {
//         cmptData.push({ 2: this.state.trim_sheet.cmpt2 });
//       }
//       if (Maxcarg >= 3) {
//         cmptData.push({ 3: this.state.trim_sheet.cmpt3 });
//       }
//       if (Maxcarg >= 4) {
//         cmptData.push({ 4: this.state.trim_sheet.cmpt4 });
//       }
//       JSONData["LOAD IN CPTS"] = cmptData;
//       var zoneData = [];
//       zoneData.push({
//         ZONE1:
//           this.state.trim_sheet.C1Adult +
//           this.state.trim_sheet.C1Child +
//           parseInt(this.state.trim_sheet.AdjustStrv2.split("$")[13]),
//       });
//       zoneData.push({
//         ZONE2:
//           this.state.trim_sheet.C2Adult +
//           this.state.trim_sheet.C2Child +
//           parseInt(this.state.trim_sheet.AdjustStrv2.split("$")[14]),
//       });
//       zoneData.push({
//         ZONE3:
//           this.state.trim_sheet.C3Adult +
//           this.state.trim_sheet.C3Child +
//           parseInt(this.state.trim_sheet.AdjustStrv2.split("$")[15]),
//       });
//       if (Maxpax >= 4) {
//         zoneData.push({
//           ZONE4: parseInt(
//             this.state.trim_sheet.C4Adult + this.state.trim_sheet.C4Child
//           ),
//         });
//         if (Maxpax >= 5) {
//           zoneData.push({
//             ZONE5: parseInt(
//               this.state.trim_sheet.C5Adult + this.state.trim_sheet.C5Child
//             ),
//           });
//         }
//         if (Maxpax >= 6) {
//           zoneData.push({
//             ZONE6: parseInt(
//               this.state.trim_sheet.C6Adult + this.state.trim_sheet.C6Child
//             ),
//           });
//         }
//         if (Maxpax >= 7) {
//           zoneData.push({
//             ZONE7: parseInt(
//               this.state.trim_sheet.C7Adult + this.state.trim_sheet.C7Child
//             ),
//           });
//         }
//         if (Maxpax >= 8) {
//           zoneData.push({
//             ZONE8: parseInt(
//               this.state.trim_sheet.C8Adult + this.state.trim_sheet.C8Child
//             ),
//           });
//         }
//       }
//       JSONData["ZONE"] = zoneData;
//       JSONData["PAX"] =
//         this.state.totalAdult +
//         "/" +
//         this.state.totalChild +
//         "/" +
//         this.state.totalInfant;
//       JSONData["TTL"] =
//         this.state.totalAdult + this.state.totalChild + this.state.totalInfant;
//       JSONData["POB"] =
//         this.state.totalAdult +
//         this.state.totalChild +
//         this.state.totalInfant +
//         this.state.crew;
//     }
//     console.log("generatedJson Final Data \n ", JSONData);
//     this.setState({
//       qrcodeData: JSON.stringify(JSONData),
//     });
//   }

//   displayQrCodeFn = () => {
//     console.log("QRCode Data \n ", this.state.qrcodeData);
//     this.setState({
//       displayQrCode: true,
//     });
//   };

//   onAccept = () => {
//     //this.generateJson();
//     this.props.history.push({
//       pathname: "/scanner",
//       state: {
//         hist: this.props.history,
//         onScan: async (data) => {
//           const empId = data
//             .split("Emp. Code")[1]
//             .split("Location")[0]
//             .replace(":", "")
//             ?.trim();
//           const name = data
//             .split("Name")[1]
//             .split("Designation")[0]
//             .replace(":", "")
//             ?.trim();
//           localStorage.setItem("name", name);
//           var CaptEmpId = "DEFAULT";
//           if (empId && empId) {
//             CaptEmpId = empId;
//           }
//           localStorage.setItem("CaptEmpId", CaptEmpId);
//           console.log("CaptEmpId ", CaptEmpId);
//           this.setState({ isScan: true });
//           var postData = {
//             Flight_Date: this.props.match.params.flight_date,
//             Flight_no: this.props.match.params.flight_no,
//             source: this.props.match.params.source,
//             Destination: this.props.match.params.destination,
//             CaptEmpId: CaptEmpId,
//             CAPTAIN: name,
//           };
//           console.log("postData for updating CaptEmpId ", CaptEmpId);
//           UpdateCaptEmpId(postData);
//           // this.generateJson();
//         },
//       },
//     });

//     // this.generateJson(); // Used for testing
//   };

//   onSuccess = (result) => {
//     console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
//     console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
//   };

//   onError = (msg) => {
//     console.log("Sharing failed with message: " + msg);
//     alert("Sharing failed with message:" + msg);
//   };

//   onShare = () => {
//     const [fix, name] = get(this.state, "trim_sheet.Flight_no", "").split("SG");
//     const dest = get(this.state, "trim_sheet.Destination", "");
//     const source = get(this.state, "trim_sheet.Source", "");
//     const date = new Date(get(this.state, "trim_sheet.Flight_Date", ""));
//     const fileName = `${name}${source}${dest}${moment(date).format(
//       "DDMMMYYYY"
//     )}.pdf`;
//     var folderpath = `${window.cordova.file.externalRootDirectory}SALTArchive/${fileName}`;
//     const options = {
//       message: "share this", // not supported on some apps (Facebook, Instagram)
//       // subject: 'the subject', // fi. for email
//       files: [folderpath], // an array of filenames either locally or remotely
//       // url: 'https://www.website.com/foo/#bar?a=b',
//       chooserTitle: "Pick an app", // Android only, you can override the default share sheet title
//       // iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
//     };
//     window.plugins.socialsharing.shareWithOptions(
//       options,
//       this.onSuccess,
//       this.onError
//     );
//   };
//   close() {
//     console.log("needed data1", this.state.Dialogopen);
//     this.setState({
//       Dialogopen: false,
//     });
//     console.log("needed data", this.state.Dialogopen);
//   }
//   open() {
//     console.log("needed data1", this.state.Dialogopen);
//     this.setState({
//       Dialogopen: true,
//     });
//     console.log("needed data1", this.state.Dialogopen);
//   }
//   componentWillUnmount() {
//     localStorage.removeItem("name");
//   }

//   render() {
//     var classes = this.props.classes;
//     var flightNo = this.props.match.params.flight_no;
//     var flightDate = this.props.match.params.flight_date;
//     var source = this.props.match.params.source;
//     var destination = this.props.match.params.destination;
//     var status = this.props.match.params.status;

//     console.log("state", this.state);
//     var theme = window.localStorage.getItem("app_theme");
//     const disableAccept = window.location.href.includes("past");
//     // console.log("appbar trimshett",document.getElementsByClassName("trimsheetContainer"))
//     // console.log("appbar trimshett",document.getElementById("trimsheetDisplay"))
//     // style={{zoom:this.state.zoom}}

//     const printIcon = `${
//       theme === "dark" ? classes.printIconDark : classes.printIconLight
//     }`;
//     const addText = `${theme === "dark" ? classes.addLight : classes.addLight}`;
//     const plusIcon = `${
//       theme === "dark" ? classes.plusIconDark : classes.plusIconLight
//     }`;
//     const minusIcon = `${
//       theme === "dark" ? classes.minusIconDark : classes.minusIconLight
//     }`;
//     const lmcIcon = `${
//       theme === "dark" ? classes.lmcIconDark : classes.lmcIconLight
//     }`;
//     const zoomTypo = `${
//       theme === "dark" ? classes.zoomTypoDark : classes.zoomTypoLight
//     }`;

//     return (
//       <div id="trimsheetDisplay">
//         {/* {this.state.displayQrCode ? 
//         <div style={{display: 'flex', flexDirection: 'column',  justifyContent:'center', alignItems: 'center', height: '100vh'}}>
//           <QRCode value={this.state.qrcodeData} 
//           size = {300}
//           includeMargin = {true}/>
//           <button onClick={this.showTrimsheet.bind(this)} style={{marginTop: 50}}>Show Trimsheet</button>
//         </div> : */}
//         <React.Fragment>
//           <div
//             className={classes.trim_container}
//             style={{ zoom: this.state.zoom + "%" }}
//           >
//             {this.state.trim_sheet !== null &&
//               this.state.trim_sheet.Acft_Type !== "Q400" &&
//               this.state.hideTrimsheet === false && (
//                 <div className={classes.formField}>
//                   {((this.state.trim_sheet.Thrust1 !== undefined &&
//                     this.state.trim_sheet.Thrust1 !== null &&
//                     this.state.trim_sheet.Thrust1 !== 0) ||
//                     (this.state.trim_sheet.Thrust2 !== undefined &&
//                       this.state.trim_sheet.Thrust2 !== null &&
//                       this.state.trim_sheet.Thrust2 !== 0) ||
//                     (this.state.trim_sheet.Thrust3 !== undefined &&
//                       this.state.trim_sheet.Thrust3 !== null &&
//                       this.state.trim_sheet.Thrust3 !== 0) ||
//                     (this.state.trim_sheet.Thrust4 !== undefined &&
//                       this.state.trim_sheet.Thrust4 !== null &&
//                       this.state.trim_sheet.Thrust4 !== 0)) && (
//                     <Grid container>
//                       <Grid item xs={6} className={classes.gridItem}>
//                         <Typography className={classes.label} variant={"body1"}>
//                           Thrust1
//                         </Typography>
//                         <FormControl className={classes.dropdown}>
//                           <Select
//                             value={this.state.thrust}
//                             onChange={(event) => {
//                               this.setState(
//                                 { thrust: event.target.value },
//                                 function () {
//                                   this.thrustChangeHandle();
//                                 }
//                               );
//                             }}
//                             classes={{
//                               icon: classes.downIcon,
//                               select: classes.selectFocus,
//                             }}
//                             displayEmpty
//                             input={<SelectInput />}
//                           >
//                             {this.state.trim_sheet.Thrust1 !== undefined &&
//                               this.state.trim_sheet.Thrust1 !== null &&
//                               this.state.trim_sheet.Thrust1 !== 0 && (
//                                 <MenuItem value={this.state.trim_sheet.Thrust1}>
//                                   {this.state.trim_sheet.Thrust1}
//                                 </MenuItem>
//                               )}
//                             {this.state.trim_sheet.Thrust2 !== undefined &&
//                               this.state.trim_sheet.Thrust2 !== null &&
//                               this.state.trim_sheet.Thrust2 !== 0 && (
//                                 <MenuItem value={this.state.trim_sheet.Thrust2}>
//                                   {this.state.trim_sheet.Thrust2}
//                                 </MenuItem>
//                               )}
//                             {this.state.trim_sheet.Thrust3 !== undefined &&
//                               this.state.trim_sheet.Thrust3 !== null &&
//                               this.state.trim_sheet.Thrust3 !== 0 && (
//                                 <MenuItem value={this.state.trim_sheet.Thrust3}>
//                                   {this.state.trim_sheet.Thrust3}
//                                 </MenuItem>
//                               )}
//                             {this.state.trim_sheet.Thrust4 !== undefined &&
//                               this.state.trim_sheet.Thrust4 !== null &&
//                               this.state.trim_sheet.Thrust4 !== 0 && (
//                                 <MenuItem value={this.state.trim_sheet.Thrust4}>
//                                   {this.state.trim_sheet.Thrust4}
//                                 </MenuItem>
//                               )}
//                           </Select>
//                         </FormControl>
//                       </Grid>
//                       <Grid item xs={6} className={classes.gridItem}>
//                         <Typography className={classes.label} variant={"body1"}>
//                           Flap
//                         </Typography>
//                         <FormControl className={classes.dropdown}>
//                           <Select
//                             value={this.state.flap}
//                             onChange={(event) => {
//                               this.setState(
//                                 { flap: event.target.value },
//                                 function () {
//                                   this.thrustChangeHandle();
//                                 }
//                               );
//                             }}
//                             classes={{
//                               icon: classes.downIcon,
//                               select: classes.selectFocus,
//                             }}
//                             displayEmpty
//                             input={<SelectInput />}
//                           >
//                             {this.state.trim_sheet.Thrust1 ===
//                               this.state.thrust &&
//                               this.state.trim_sheet.T1Flap1 !== undefined &&
//                               this.state.trim_sheet.T1Flap1 !== null &&
//                               this.state.trim_sheet.T1Flap1.length > 0 && (
//                                 <MenuItem value={this.state.trim_sheet.T1Flap1}>
//                                   {this.state.trim_sheet.T1Flap1}
//                                 </MenuItem>
//                               )}
//                             {this.state.trim_sheet.Thrust1 ===
//                               this.state.thrust &&
//                               this.state.trim_sheet.T1Flap2 !== undefined &&
//                               this.state.trim_sheet.T1Flap2 !== null &&
//                               this.state.trim_sheet.T1Flap2.length > 0 && (
//                                 <MenuItem value={this.state.trim_sheet.T1Flap2}>
//                                   {this.state.trim_sheet.T1Flap2}
//                                 </MenuItem>
//                               )}
//                             {this.state.trim_sheet.Thrust2 ===
//                               this.state.thrust &&
//                               this.state.trim_sheet.T2Flap1 !== undefined &&
//                               this.state.trim_sheet.T2Flap1 !== null &&
//                               this.state.trim_sheet.T2Flap1.length > 0 && (
//                                 <MenuItem value={this.state.trim_sheet.T2Flap1}>
//                                   {this.state.trim_sheet.T2Flap1}
//                                 </MenuItem>
//                               )}
//                             {this.state.trim_sheet.Thrust2 ===
//                               this.state.thrust &&
//                               this.state.trim_sheet.T2Flap2 !== undefined &&
//                               this.state.trim_sheet.T2Flap2 !== null &&
//                               this.state.trim_sheet.T2Flap2.length > 0 && (
//                                 <MenuItem value={this.state.trim_sheet.T2Flap2}>
//                                   {this.state.trim_sheet.T2Flap2}
//                                 </MenuItem>
//                               )}
//                             {this.state.trim_sheet.Thrust3 ===
//                               this.state.thrust &&
//                               this.state.trim_sheet.T3Flap1 !== undefined &&
//                               this.state.trim_sheet.T3Flap1 !== null &&
//                               this.state.trim_sheet.T3Flap1.length > 0 && (
//                                 <MenuItem value={this.state.trim_sheet.T3Flap1}>
//                                   {this.state.trim_sheet.T3Flap1}
//                                 </MenuItem>
//                               )}
//                             {this.state.trim_sheet.Thrust3 ===
//                               this.state.thrust &&
//                               this.state.trim_sheet.T3Flap2 !== undefined &&
//                               this.state.trim_sheet.T3Flap2 !== null &&
//                               this.state.trim_sheet.T3Flap2.length > 0 && (
//                                 <MenuItem value={this.state.trim_sheet.T3Flap2}>
//                                   {this.state.trim_sheet.T3Flap2}
//                                 </MenuItem>
//                               )}
//                             {this.state.trim_sheet.Thrust4 ===
//                               this.state.thrust &&
//                               this.state.trim_sheet.T4Flap1 !== undefined &&
//                               this.state.trim_sheet.T4Flap1 !== null &&
//                               this.state.trim_sheet.T4Flap1.length > 0 && (
//                                 <MenuItem value={this.state.trim_sheet.T4Flap1}>
//                                   {this.state.trim_sheet.T4Flap1}
//                                 </MenuItem>
//                               )}
//                             {this.state.trim_sheet.Thrust4 ===
//                               this.state.thrust &&
//                               this.state.trim_sheet.T4Flap2 !== undefined &&
//                               this.state.trim_sheet.T4Flap2 !== null &&
//                               this.state.trim_sheet.T4Flap2.length > 0 && (
//                                 <MenuItem value={this.state.trim_sheet.T4Flap2}>
//                                   {this.state.trim_sheet.T4Flap2}
//                                 </MenuItem>
//                               )}
//                           </Select>
//                         </FormControl>
//                       </Grid>
//                     </Grid>
//                   )}
//                 </div>
//               )}
//             {this.state.in_prog && this.props.sync.ramp_sync && (
//               <div className={classes.progress}>
//                 <Typography variant={"h6"} className={classes.error}>
//                   Loading ....{" "}
//                 </Typography>
//               </div>
//             )}
//             {this.props.sync.ramp_sync && (
//               <div className={classes.progress}>
//                 <Typography variant={"h6"} className={classes.error}>
//                   Loading ....{" "}
//                 </Typography>
//               </div>
//             )}
//             {this.state.in_prog === false &&
//               this.props.sync.ramp_sync === false &&
//               this.state.error === true && (
//                 <div className={classes.error}>
//                   <Typography variant={"h6"} className={classes.error}>
//                     Trim Sheet Cannot Be Drawn at This Moment
//                   </Typography>
//                   {/* <Button variant={"contained"} color={"primary"} fullWidth>Refresh</Button> */}
//                 </div>
//               )}
//             {this.state.hideTrimsheet === true &&
//               this.state.error === false &&
//               this.state.in_prog === false &&
//               this.props.sync.ramp_sync === false && (
//                 <div className={classes.error}>
//                   <Typography variant={"h6"} className={classes.error}>
//                     Load & Trim Sheet being edited, Please wait or contact Load
//                     Control
//                   </Typography>
//                 </div>
//               )}
//             {this.state.in_prog === false &&
//               this.props.sync.ramp_sync === false &&
//               this.state.error === false &&
//               this.state.hideTrimsheet === false && (
//                 <div className={"trimsheet"} id="trimsheet">
//                   {this.state.trim_sheet === null && (
//                     <Typography variant={"h6"} className={classes.typo}>
//                       Trim Sheet
//                     </Typography>
//                   )}
//                   {this.state.trim_sheet === null && (
//                     <Typography variant={"h6"} className={classes.typo}>
//                       Not Available
//                     </Typography>
//                   )}
//                   {this.state.trim_sheet !== null &&
//                     this.state.hideTrimsheet === false && (
//                       <table
//                         id="MainContent_Table1"
//                         className={classes.trimsheet_papper1}
//                         align="center"
//                         bgcolor="white"
//                         cellpadding="2"
//                         cellspacing="2"
//                         border="0"
//                         width="100%"
//                         style={{ color: "#000" }}
//                       >
//                         <tbody>
//                           <tr>
//                             <td
//                               colspan="4"
//                               align="center"
//                               style={{
//                                 fontSize: "medium",
//                                 letterSpacing: "0.1em",
//                               }}
//                             >
//                               <b>{Enviornment.get("VENDOR")} LOADSHEET</b>
//                             </td>
//                           </tr>
//                           <tr>
//                             <td colspan="1" width="25%">
//                               <span
//                                 id="MainContent_lblflightNo"
//                                 style={{ fontWeight: "normal" }}
//                               >
//                                 {this.state.trim_sheet.Flight_no}/
//                                 {this.formatDateGetDay(
//                                   this.state.trim_sheet.Flight_Date
//                                 )}
//                               </span>
//                             </td>
//                             <td
//                               colspan="1"
//                               style={{ textAlign: "center" }}
//                               width="25%"
//                             >
//                               <span
//                                 id="MainContent_lblflightDate"
//                                 style={{ fontWeight: "normal" }}
//                               >
//                                 {this.formatDate(
//                                   this.state.trim_sheet.TrimGenTimeUTC
//                                 )}
//                               </span>
//                             </td>
//                             <td
//                               colspan="1"
//                               style={{ textAlign: "center" }}
//                               width="25%"
//                             >
//                               <span id="MainContent_lblTrimGenTimeUTC">
//                                 {this.formatTime(
//                                   this.state.trim_sheet.TrimGenTimeUTC
//                                 )}
//                               </span>
//                             </td>
//                             {this.state.trim_sheet.AppType !== null && (
//                               <td
//                                 colspan="1"
//                                 style={{ textAlign: "center" }}
//                                 width="25%"
//                               >
//                                 <span
//                                   id="MainContent_lblEdNo"
//                                   style={{ fontWeight: "normal" }}
//                                 >
//                                   ED-M0{this.state.trim_sheet.EDNO}
//                                 </span>
//                               </td>
//                             )}
//                             {this.state.trim_sheet.AppType == null && (
//                               <td
//                                 colspan="1"
//                                 style={{ textAlign: "center" }}
//                                 width="25%"
//                               >
//                                 <span
//                                   id="MainContent_lblEdNo"
//                                   style={{ fontWeight: "normal" }}
//                                 >
//                                   ED-0{this.state.trim_sheet.EDNO}
//                                 </span>
//                               </td>
//                             )}
//                           </tr>
//                           <tr>
//                             <td colspan="1" width="25%">
//                               <span
//                                 id="MainContent_lblflightFrom"
//                                 style={{ letterSpacing: "0.0em" }}
//                               >
//                                 {this.state.trim_sheet.Source +
//                                   "-" +
//                                   this.state.trim_sheet.Destination}
//                               </span>
//                               &nbsp;
//                             </td>
//                             <td
//                               colspan="1"
//                               style={{ textAlign: "center" }}
//                               width="25%"
//                             >
//                               {this.state.trim_sheet.IsFreighter == 0 &&
//                                 this.state.trim_sheet.IsCargoOnSeatStr == 0 && (
//                                   <span
//                                     id="MainContent_lblAcft_Tpe"
//                                     style={{
//                                       fontWeight: "normal",
//                                       textAlign: "center",
//                                     }}
//                                   >
//                                     {this.state.trim_sheet.Acft_Type +
//                                       "/" +
//                                       this.state.CONFIG}
//                                   </span>
//                                 )}
//                               {this.state.trim_sheet.IsFreighter == 0 &&
//                                 this.state.trim_sheet.IsCargoOnSeatStr == 1 && (
//                                   <span
//                                     id="MainContent_lblAcft_Tpe"
//                                     style={{
//                                       fontWeight: "normal",
//                                       textAlign: "center",
//                                     }}
//                                   >
//                                     {this.state.trim_sheet.Acft_Type +
//                                       "/" +
//                                       this.state.CONFIG}
//                                   </span>
//                                 )}
//                               {this.state.trim_sheet.IsFreighter == 1 && (
//                                 <span
//                                   id="MainContent_lblAcft_Tpe"
//                                   style={{
//                                     fontWeight: "normal",
//                                     textAlign: "center",
//                                   }}
//                                 >
//                                   {this.state.trim_sheet.Acft_Type +
//                                     this.state.CONFIG}
//                                 </span>
//                               )}
//                             </td>
//                             <td
//                               colspan="1"
//                               style={{ textAlign: "center" }}
//                               width="25%"
//                             >
//                               <span
//                                 id="MainContent_lblAcft_Regn"
//                                 style={{ textAlign: "right" }}
//                               >
//                                 {this.state.trim_sheet.Acft_Regn}
//                               </span>
//                             </td>
//                             <td
//                               colspan="1"
//                               style={{ textAlign: "center" }}
//                               width="25%"
//                             >
//                               <span
//                                 id="MainContent_lblActcrewStr"
//                                 style={{ fontWeight: "normal" }}
//                               >
//                                 {this.state.trim_sheet.ActcrewStr}
//                               </span>
//                             </td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     )}
//                   {this.state.trim_sheet != null && (
//                     <table
//                       id="MainContent_Table2"
//                       className={classes.trimsheet_papper1}
//                       align="center"
//                       bgcolor="white"
//                       cellpadding="2"
//                       cellspacing="2"
//                       border="0"
//                       width="100%"
//                       style={{ color: "#000" }}
//                     >
//                       <tbody>
//                         <tr>
//                           <td
//                             colspan="1"
//                             width="50%"
//                             style={{ textAlign: "left" }}
//                           >
//                             TTL LOAD{" "}
//                             <span
//                               style={{ float: "right" }}
//                               id="MainContent_totalLoad"
//                             >
//                               {this.state.totalLoad} &nbsp; &nbsp;
//                             </span>
//                           </td>
//                           {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
//                           <td colspan="1" width="50%">
//                             &nbsp;{" "}
//                           </td>
//                         </tr>
//                         {this.state.trim_sheet.IsFreighter == 0 &&
//                           this.state.trim_sheet.IsCargoOnSeatStr == false && (
//                             <tr>
//                               <td
//                                 colspan="1"
//                                 width="50%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 COMP WT{" "}
//                                 <span
//                                   style={{ float: "right" }}
//                                   id="MainContent_totalLoad"
//                                 >
//                                   {this.state.COMPWT} &nbsp; &nbsp;
//                                 </span>
//                               </td>
//                               {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
//                               <td colspan="1" width="50%">
//                                 &nbsp;{" "}
//                               </td>
//                             </tr>
//                           )}
//                         <tr>
//                           <td
//                             colspan="1"
//                             width="50%"
//                             style={{ textAlign: "left" }}
//                           >
//                             CAB BG WT{" "}
//                             <span
//                               style={{ float: "right" }}
//                               id="MainContent_totalLoad"
//                             >
//                               {this.state.CABBGWT} &nbsp; &nbsp;
//                             </span>
//                           </td>
//                           {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
//                           <td colspan="1" width="50%">
//                             &nbsp;{" "}
//                           </td>
//                         </tr>

//                         {this.state.trim_sheet.IsFreighter == 0 &&
//                           this.state.trim_sheet.IsCargoOnSeatStr == false && (
//                             <tr>
//                               <td
//                                 colspan="1"
//                                 width="50%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 PAX WT{" "}
//                                 <span
//                                   style={{ float: "right" }}
//                                   id="MainContent_totalLoad"
//                                 >
//                                   {this.state.PAXWT} &nbsp; &nbsp;
//                                 </span>
//                               </td>
//                               {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
//                               <td colspan="1" width="50%">
//                                 &nbsp;{" "}
//                               </td>
//                             </tr>
//                           )}

//                         <tr>
//                           <td
//                             colspan="1"
//                             width="50%"
//                             style={{ textAlign: "left" }}
//                           >
//                             DOW{" "}
//                             <span
//                               style={{ float: "right" }}
//                               id="MainContent_lblflightDOW"
//                             >
//                               {this.state.DOW} &nbsp; &nbsp;
//                             </span>{" "}
//                           </td>
//                           {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_lblflightDOW">{this.state.trim_sheet.OEW}</span> </td> */}
//                           <td colspan="1" width="50%">
//                             {" "}
//                             &nbsp;
//                           </td>
//                         </tr>
//                         <tr>
//                           <td
//                             colspan="1"
//                             width="50%"
//                             style={{ textAlign: "left" }}
//                           >
//                             <b>ZFW</b>{" "}
//                             <span
//                               style={{ float: "right" }}
//                               id="MainContent_lblflightZFW"
//                             >
//                               {this.state.trim_sheet.ZFW} &nbsp; &nbsp;
//                             </span>
//                           </td>
//                           {this.state.lim1 == false && (
//                             <td
//                               colspan="1"
//                               width="50%"
//                               style={{ textAlign: "left" }}
//                             >
//                               &nbsp; &nbsp; MAX{" "}
//                               <span id="MainContent_lblflightZFWmax">
//                                 {" "}
//                                 &nbsp;{this.state.trim_sheet.MZFW}&nbsp;&nbsp;
//                               </span>
//                             </td>
//                           )}
//                           {this.state.lim1 == true && (
//                             <td
//                               colspan="1"
//                               width="50%"
//                               style={{ textAlign: "left" }}
//                             >
//                               &nbsp; &nbsp; MAX{" "}
//                               <span id="MainContent_lblflightZFWmax">
//                                 {" "}
//                                 &nbsp;{this.state.trim_sheet.MZFW + " L"}
//                               </span>
//                             </td>
//                           )}
//                         </tr>
//                         <tr>
//                           <td
//                             colspan="1"
//                             width="50%"
//                             style={{ textAlign: "left" }}
//                           >
//                             TOF
//                             <span
//                               style={{ float: "right" }}
//                               id="MainContent_lblflightTOF"
//                             >
//                               {this.state.trim_sheet.FOB} &nbsp; &nbsp;
//                             </span>{" "}
//                           </td>
//                           <td colspan="1" width="50%">
//                             {" "}
//                             &nbsp;
//                           </td>
//                         </tr>

//                         <tr>
//                           <td
//                             colspan="1"
//                             width="50%"
//                             style={{ textAlign: "left" }}
//                           >
//                             <b>TOW</b>{" "}
//                             <span
//                               style={{ float: "right" }}
//                               id="MainContent_lblflightTOW"
//                             >
//                               {this.state.trim_sheet.TOW} &nbsp; &nbsp;
//                             </span>
//                           </td>
//                           {this.state.lim2 == false && (
//                             <td
//                               colspan="1"
//                               width="50%"
//                               style={{ textAlign: "left" }}
//                             >
//                               &nbsp; &nbsp; MAX{" "}
//                               <span id="MainContent_lblflightTOWmax">
//                                 {" "}
//                                 &nbsp; {this.state.trim_sheet.OTOW}&nbsp;&nbsp;
//                               </span>
//                             </td>
//                           )}
//                           {this.state.lim2 == true && (
//                             <td
//                               colspan="1"
//                               width="50%"
//                               style={{ textAlign: "left" }}
//                             >
//                               &nbsp; &nbsp; MAX{" "}
//                               <span id="MainContent_lblflightTOWmax">
//                                 {" "}
//                                 &nbsp; {this.state.trim_sheet.OTOW + " L"}
//                               </span>
//                             </td>
//                           )}
//                         </tr>

//                         <tr>
//                           <td
//                             colspan="1"
//                             width="50%"
//                             style={{ textAlign: "left" }}
//                           >
//                             TRIP
//                             <span
//                               style={{ float: "right" }}
//                               id="MainContent_lblflightTrip"
//                             >
//                               {this.state.trim_sheet.TRIP_FUEL} &nbsp; &nbsp;
//                             </span>{" "}
//                           </td>
//                           <td colspan="1" width="50%">
//                             {" "}
//                             &nbsp;
//                           </td>
//                         </tr>

//                         <tr>
//                           <td
//                             colspan="1"
//                             width="50%"
//                             style={{ textAlign: "left" }}
//                           >
//                             <b>LAW</b>{" "}
//                             <span
//                               style={{ float: "right" }}
//                               id="MainContent_lblflightLW"
//                             >
//                               {this.state.trim_sheet.LAW} &nbsp; &nbsp;
//                             </span>
//                           </td>
//                           {this.state.lim3 == false && (
//                             <td
//                               colspan="1"
//                               width="50%"
//                               style={{ textAlign: "left" }}
//                             >
//                               &nbsp; &nbsp; MAX{" "}
//                               <span id="MainContent_lblflightLAWmax">
//                                 {" "}
//                                 &nbsp;{this.state.trim_sheet.OLW}&nbsp;&nbsp;
//                               </span>
//                             </td>
//                           )}
//                           {this.state.lim3 == true && (
//                             <td
//                               colspan="1"
//                               width="50%"
//                               style={{ textAlign: "left" }}
//                             >
//                               &nbsp; &nbsp; MAX{" "}
//                               <span id="MainContent_lblflightLAWmax">
//                                 {" "}
//                                 &nbsp;{this.state.trim_sheet.OLW + " L"}
//                               </span>
//                             </td>
//                           )}
//                         </tr>

//                         <tr>
//                           <td
//                             colspan="1"
//                             width="50%"
//                             style={{ textAlign: "left" }}
//                           >
//                             UNDERLOAD
//                             <span
//                               style={{ float: "right" }}
//                               id="MainContent_lblflightUnderLoad"
//                             >
//                               {this.state.trim_sheet.underLoadLMC} &nbsp; &nbsp;
//                             </span>{" "}
//                           </td>
//                           <td colspan="1" width="50%">
//                             {" "}
//                             &nbsp;
//                           </td>
//                         </tr>

//                         {/* <tr>
//                       <td width="10px"> &nbsp;</td>
//                       <td colspan="1" > <b>TOW</b></td>
//                       <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_lblflightTOW">{this.state.trim_sheet.TOW}</span> </td>
//                       {this.state.lim2 == false &&<td colspan="3" style={{textAlign:"left"}}>MAX <span id="MainContent_lblflightTOWmax">{this.state.trim_sheet.MTOW}</span></td>}
//                       {this.state.lim2 == true &&<td colspan="3" style={{textAlign:"left"}}>MAX <span id="MainContent_lblflightTOWmax">{this.state.trim_sheet.MTOW+" L"}</span></td>}
//                       <td width="10px"> &nbsp;</td>
//                     </tr>
//                     <tr>
//                       <td width="10px"> &nbsp;</td>
//                       <td colspan="1">TRIP</td>
//                       <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_lblflightTOW">{this.state.trim_sheet.TRIP_FUEL}</span> </td>
//                       <td colspan="3"> &nbsp;</td>
//                       <td width="10px"> &nbsp;</td>
//                     </tr>
//                     <tr>
//                       <td width="10px"> &nbsp;</td>
//                       <td colspan="1" > <b>LAW </b></td>
//                       <td colspan="2" style={{textAlign:"right"}} ><span id="MainContent_lblflightLW">{this.state.trim_sheet.FOB - this.state.trim_sheet.TRIP_FUEL}</span> </td>
//                       {this.state.lim3 == false &&<td colspan="3" style={{textAlign:"left"}}>MAX <span id="MainContent_lblflightLAWmax">{this.state.trim_sheet.OLW}</span> </td>}
//                       {this.state.lim3 == true &&<td colspan="3" style={{textAlign:"left"}}>MAX <span id="MainContent_lblflightLAWmax">{this.state.trim_sheet.OLW+" L"}</span> </td>}
//                       <td width="10px"> &nbsp;</td>
//                     </tr>

//                     <tr>
//                       <td width="10px"> &nbsp;</td>
//                       <td colspan="1"> UNDERLOAD</td>
//                       <td colspan="2" style={{textAlign:"right"}} ><span id="MainContent_lblflightUnderLoad">{this.state.trim_sheet.underLoadLMC}</span> </td>
//                       <td colspan="3"> &nbsp;</td>
//                       <td width="10px"> &nbsp;</td>
//                     </tr>

//                     <tr>
//                       <td width="10px"> &nbsp;</td>
//                       <td colspan="6" ><b>DOI &nbsp;</b><span id="MainContent_lblflightDOI">{this.state.trim_sheet.OEW_Index}</span> </td>
//                       <td width="10px"> &nbsp;</td>
//                     </tr> */}
//                       </tbody>
//                     </table>
//                   )}
//                   {this.state.trim_sheet != null && (
//                     <table
//                       id="MainContent_Table3"
//                       className={classes.trimsheet_papper1}
//                       bgcolor="white"
//                       cellpadding="2"
//                       cellspacing="2"
//                       border="0"
//                       width="100%"
//                       style={{ color: "#000" }}
//                     >
//                       <tbody>
//                         <tr>
//                           <td
//                             colspan="1"
//                             width="25%"
//                             style={{ textAlign: "left" }}
//                           >
//                             <b>DOI</b>
//                             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                             <span id="MainContent_lblflightDOI">
//                               {this.fixedNumber(
//                                 this.state.trim_sheet.OEW_Index
//                               )}
//                             </span>{" "}
//                           </td>
//                           <td
//                             colspan="1"
//                             width="25%"
//                             style={{ textAlign: "left" }}
//                           ></td>
//                         </tr>
//                         {/* <tr>
//                       <td width="10px"> &nbsp;</td>
//                       <td colspan="1" > <b>LIZFW </b></td>
//                       <td colspan="1"><span id="MainContent_lblflightLIZFWindex" style={{fontWeight: "normal"}}>{this.state.trim_sheet.ZFWindex }</span>
//                       </td>
//                       <td colspan="1"><b>LITOW </b></td>
//                       <td colspan="1"><span id="MainContent_lblflightTOWindex" style={{fontWeight: "normal"}}>{this.state.trim_sheet.TOWindex}</span>
//                       </td>
//                       <td colspan="1" style={{textAlign:"right"}}><b>LILW </b></td>
//                       <td colspan="1"><span id="MainContent_lblflightLWindex" style={{fontWeight: "normal"}}>{this.state.trim_sheet.LWindex}</span></td>
//                       <td width="10px"> &nbsp;</td>
//                     </tr> */}
//                       </tbody>
//                     </table>
//                   )}

//                   {this.state.trim_sheet != null && (
//                     <table
//                       id="MainContent_Table3"
//                       className={classes.trimsheet_papper1}
//                       bgcolor="white"
//                       cellpadding="2"
//                       cellspacing="2"
//                       border="0"
//                       width="100%"
//                       style={{ color: "#000" }}
//                     >
//                       <tbody>
//                         <tr>
//                           <td
//                             colspan="1"
//                             width="25%"
//                             style={{ textAlign: "left" }}
//                           >
//                             <b>LIZFW</b> &nbsp; &nbsp;&nbsp;
//                             <span id="MainContent_lblflightLIZFWindex">
//                               {this.fixedNumber(this.state.trim_sheet.ZFWindex)}
//                             </span>{" "}
//                           </td>
//                           {/* {this.state.trim_sheet != null && this.state.trim_sheet.IsFreighter == 0 && <td colspan="1" width="25%" style={{ textAlign: "left" }}><b>ZFMAC</b> &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                     <span  id="MainContent_lblflightZFMAC" >{this.fixedNumber(this.state.trim_sheet.ZFWMAC)}</span> </td>} */}
//                         </tr>

//                         <tr>
//                           <td
//                             colspan="1"
//                             width="25%"
//                             style={{ textAlign: "left" }}
//                           >
//                             <b>LITOW</b> &nbsp; &nbsp;
//                             <span id="MainContent_lblflightTOWindex">
//                               {this.fixedNumber(this.state.trim_sheet.TOWindex)}
//                             </span>{" "}
//                           </td>
//                           {/* {this.state.trim_sheet != null && this.state.trim_sheet.IsFreighter == 0 && <td colspan="1" width="25%" style={{ textAlign: "left" }}><b>TOWMAC</b> &nbsp; &nbsp;
//                     <span  id="MainContent_lblflightTOWMAC" >{this.fixedNumber(this.state.trim_sheet.TOWMAC)}</span> </td>} */}
//                         </tr>

//                         <tr>
//                           <td
//                             colspan="1"
//                             width="25%"
//                             style={{ textAlign: "left" }}
//                           >
//                             <b>LILW</b> &nbsp; &nbsp; &nbsp;&nbsp;
//                             <span id="MainContent_lblflightLWindex">
//                               {this.fixedNumber(this.state.trim_sheet.LWindex)}
//                             </span>{" "}
//                           </td>
//                           {/* {this.state.trim_sheet != null && this.state.trim_sheet.IsFreighter == 0 && <td colspan="1" width="25%" style={{ textAlign: "left" }}><b>LWMAC</b> &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
//                     <span id="MainContent_lblflightLWMAC" >{this.fixedNumber(this.state.trim_sheet.LWMAC)}</span> </td>} */}
//                         </tr>

//                         {/* <tr>
//                   <td colspan="1" width="30%" style={{ textAlign: "left" }}><b>LIZFW</b>
//                     <span style={{ float: 'right' }} id="MainContent_lblflightLIZFWindex" >{this.fixedNumber(this.state.trim_sheet.ZFWindex)}</span> </td>
//                   <td colspan="1" width="40%" style={{ textAlign: "left" }}><b>LITOW</b>
//                     <span style={{ float: 'right' }} id="MainContent_lblflightTOWindex" >{this.fixedNumber(this.state.trim_sheet.TOWindex)}</span> </td>
//                   <td colspan="1" width="30%" style={{ textAlign: "left" }}><b>LILW</b>
//                     <span style={{ float: 'right' }} id="MainContent_lblflightLWindex" >{this.fixedNumber(this.state.trim_sheet.LWindex)}</span> </td>
//                 </tr> */}
//                         {/* <tr>
//                       <td width="10px"> &nbsp;</td>
//                       <td colspan="1" > <b>LIZFW </b></td>
//                       <td colspan="1"><span id="MainContent_lblflightLIZFWindex" style={{fontWeight: "normal"}}>{this.state.trim_sheet.ZFWindex }</span>
//                       </td>
//                       <td colspan="1"><b>LITOW </b></td>
//                       <td colspan="1"><span id="MainContent_lblflightTOWindex" style={{fontWeight: "normal"}}>{this.state.trim_sheet.TOWindex}</span>
//                       </td>
//                       <td colspan="1" style={{textAlign:"right"}}><b>LILW </b></td>
//                       <td colspan="1"><span id="MainContent_lblflightLWindex" style={{fontWeight: "normal"}}>{this.state.trim_sheet.LWindex}</span></td>
//                       <td width="10px"> &nbsp;</td>
//                     </tr> */}
//                       </tbody>
//                     </table>
//                   )}
//                   {/* {this.state.trim_sheet != null &&
//             <table id="MainContent_Table3" className={classes.trimsheet_papper1} bgcolor="white" cellpadding="2" cellspacing="2" border="0" width="100%" style={{ color: "#000" }}>
//               <tbody>
//                 <tr>
//                   <td colspan="1" width="30%" style={{ textAlign: "left" }}><b>ZFMAC</b>
//                     <span style={{ float: 'right' }} id="MainContent_lblflightZFMAC" >{this.fixedNumber(this.state.trim_sheet.ZFWMAC)}</span> </td>
//                   <td colspan="1" width="40%" style={{ textAlign: "left" }}><b>TOWMAC</b>
//                     <span style={{ float: 'right' }} id="MainContent_lblflightTOWMAC" >{this.fixedNumber(this.state.trim_sheet.TOWMAC)}</span> </td>
//                   <td colspan="1" width="30%" style={{ textAlign: "left" }}><b>LWMAC</b>
//                     <span style={{ float: 'right' }} id="MainContent_lblflightLWMAC" >{this.fixedNumber(this.state.trim_sheet.LWMAC)}</span> </td>
//                 </tr> */}
//                   {/* <tr>
//                       <td width="10px">&nbsp;</td>
//                       <td colspan="1"><b>ZFMAC</b></td>
//                       <td colspan="1"><span id="MainContent_lblflightZFMAC" style={{fontWeight: "normal"}}>{this.state.trim_sheet.ZFWMAC }</span></td>
//                       <td colspan="1"><b>TOWMAC</b></td>
//                       <td colspan="1"><span id="MainContent_lblflightTOWMAC" style={{fontWeight: "normal"}}>{this.state.trim_sheet.TOWMAC}</span></td>
//                       <td colspan="1"><b>LWMAC</b></td>
//                       <td colspan="1"><span id="MainContent_lblflightLWMAC" style={{fontWeight: "normal"}}>{this.state.trim_sheet.LWMAC}</span></td>
//                     </tr> */}
//                   {/* </tbody>
//             </table>} */}
//                   {this.state.trim_sheet != null && (
//                     <React.Fragment>
//                       <br />
//                       <table
//                         id="MainContent_Table3"
//                         className={classes.trimsheet_papper1}
//                         align="center"
//                         bgcolor="white"
//                         cellpadding="2"
//                         cellspacing="2"
//                         border="0"
//                         width="100%"
//                         style={{ color: "#000" }}
//                       >
//                         <tbody>
//                           <tr>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               <b>FWD LMT</b>
//                             </td>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               <b>ZFWMAC</b>
//                             </td>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               <b>AFT LMT</b>
//                             </td>
//                           </tr>
//                           <tr>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               {this.fixedNumber(
//                                 this.state.trim_sheet.ZFWMACFWD
//                               )}
//                             </td>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               {this.fixedNumber(this.state.trim_sheet.ZFWMAC)}
//                             </td>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               {this.fixedNumber(
//                                 this.state.trim_sheet.ZFWMACAFT
//                               )}
//                             </td>
//                           </tr>

//                           <tr>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               <b>FWD LMT</b>
//                             </td>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               <b>TOWMAC</b>
//                             </td>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               <b>AFT LMT</b>
//                             </td>
//                           </tr>
//                           <tr>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               {this.fixedNumber(
//                                 this.state.trim_sheet.TOWMACFWD
//                               )}
//                             </td>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               {this.fixedNumber(this.state.trim_sheet.TOWMAC)}
//                             </td>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               {this.fixedNumber(
//                                 this.state.trim_sheet.TOWMACAFT
//                               )}
//                             </td>
//                           </tr>

//                           <tr>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               <b>FWD LMT</b>
//                             </td>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               <b>LWTMAC</b>
//                             </td>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               <b>AFT LMT</b>
//                             </td>
//                           </tr>
//                           <tr>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               {this.fixedNumber(this.state.trim_sheet.LWMACFWD)}
//                             </td>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               {this.fixedNumber(this.state.trim_sheet.LWMAC)}
//                             </td>
//                             <td
//                               colspan="1"
//                               width="33.33%"
//                               style={{ textAlign: "center" }}
//                             >
//                               {this.fixedNumber(this.state.trim_sheet.LWMACAFT)}
//                             </td>
//                           </tr>
//                         </tbody>
//                       </table>
//                       <br />
//                     </React.Fragment>
//                   )}
//                   {this.state.trim_sheet != null && (
//                     <table
//                       id="MainContent_Table3"
//                       className={classes.trimsheet_papper1}
//                       align="center"
//                       bgcolor="white"
//                       cellpadding="2"
//                       cellspacing="2"
//                       border="0"
//                       width="100%"
//                       style={{ color: "#000" }}
//                     >
//                       <tbody>
//                         {/* thrust 1 */}
//                         {this.state.trim_sheet.Acft_Type !== "Q400" &&
//                           this.state.trust !== 0 &&
//                           ((this.state.trim_sheet.Thrust1 !== undefined &&
//                             this.state.trim_sheet.Thrust1 !== null &&
//                             this.state.trim_sheet.Thrust1 !== 0) ||
//                             (this.state.trim_sheet.Thrust2 !== undefined &&
//                               this.state.trim_sheet.Thrust2 !== null &&
//                               this.state.trim_sheet.Thrust2 !== 0) ||
//                             (this.state.trim_sheet.Thrust3 !== undefined &&
//                               this.state.trim_sheet.Thrust3 !== null &&
//                               this.state.trim_sheet.Thrust3 !== 0) ||
//                             (this.state.trim_sheet.Thrust4 !== undefined &&
//                               this.state.trim_sheet.Thrust4 !== null &&
//                               this.state.trim_sheet.Thrust4 !== 0)) && (
//                             <tr>
//                               <td colspan="1" width="30%">
//                                 <span
//                                   id="MainContent_lblThrust1"
//                                   style={{ fontWeight: "normal" }}
//                                 >
//                                   <b>
//                                     THRUST{" "}
//                                     {this.formatThrust(this.state.thrust)}
//                                   </b>
//                                 </span>
//                               </td>
//                               <td
//                                 colspan="2"
//                                 width="40%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <span
//                                   id="MainContent_lblT1flap1"
//                                   style={{ fontWeight: "normal" }}
//                                 >
//                                   <b>FLAP {this.state.flap}</b>
//                                 </span>
//                               </td>
//                               <td colspan="1" width="30%">
//                                 <span
//                                   id="MainContent_lblT1stab1"
//                                   style={{ fontWeight: "normal" }}
//                                 >
//                                   <b>STAB</b>{" "}
//                                   {this.fixed1Number(this.state.stab)}
//                                 </span>
//                               </td>
//                             </tr>
//                           )}
//                       </tbody>
//                     </table>
//                   )}
//                   {this.state.trim_sheet != null &&
//                     this.state.trim_sheet.IsFreighter == 0 &&
//                     this.state.trim_sheet.IsCargoOnSeatStr == false && (
//                       <React.Fragment>
//                         {this.state.trim_sheet != null && (
//                           <table
//                             id="MainContent_Table3"
//                             className={classes.trimsheet_papper1}
//                             align="center"
//                             bgcolor="white"
//                             cellpadding="2"
//                             cellspacing="2"
//                             border="0"
//                             width="100%"
//                             style={{ color: "#000" }}
//                           >
//                             <tbody>
//                               {/* compartment */}
//                               <tr>
//                                 <td
//                                   colspan="2"
//                                   width="40%"
//                                   style={{ textAlign: "left" }}
//                                 >
//                                   <b>LOAD IN CPTS</b>
//                                 </td>
//                                 {this.state.Maxcargo >= 1 && (
//                                   <td
//                                     colspan="1"
//                                     width="15%"
//                                     style={{ textAlign: "left" }}
//                                   >
//                                     <span id="MainContent_lblflightcmpt1">
//                                       <b>1/</b>
//                                       {this.state.trim_sheet.cmpt1}
//                                     </span>{" "}
//                                   </td>
//                                 )}
//                                 {this.state.Maxcargo >= 2 && (
//                                   <td
//                                     colspan="1"
//                                     width="15%"
//                                     style={{ textAlign: "left" }}
//                                   >
//                                     <span id="MainContent_lblflightcmpt2">
//                                       <b>2/</b>
//                                       {this.state.trim_sheet.cmpt2}
//                                     </span>{" "}
//                                   </td>
//                                 )}
//                                 {this.state.Maxcargo >= 3 && (
//                                   <td
//                                     colspan="1"
//                                     width="15%"
//                                     style={{ textAlign: "left" }}
//                                   >
//                                     <span id="MainContent_lblflightcmpt3">
//                                       <b>3/</b>
//                                       {this.state.trim_sheet.cmpt3}
//                                     </span>{" "}
//                                   </td>
//                                 )}
//                                 {this.state.Maxcargo >= 4 && (
//                                   <td
//                                     colspan="1"
//                                     width="15%"
//                                     style={{ textAlign: "left" }}
//                                   >
//                                     <span id="MainContent_lblflightcmpt4">
//                                       <b>4/</b>
//                                       {this.state.trim_sheet.cmpt4}
//                                     </span>{" "}
//                                   </td>
//                                 )}
//                               </tr>
//                               {/* <tr>
//                       <td width="10px"> &nbsp;</td>
//                       <td colspan="2" width="120px;"><b>LOAD IN CPTS</b></td>
//                       {this.state.Maxcargo >= 1 && <td colspan="1"><span id="MainContent_lblflightcmpt1"><b>1/</b>{this.state.trim_sheet.cmpt1 }</span> </td>}
//                       {this.state.Maxcargo >= 2 && <td colspan="1"><span id="MainContent_lblflightcmpt2"><b>2/</b>{this.state.trim_sheet.cmpt2}</span> </td>}
//                       {this.state.Maxcargo >= 3 && <td colspan="1"><span id="MainContent_lblflightcmpt3"><b>3/</b>{this.state.trim_sheet.cmpt3}</span> </td>}
//                       {this.state.Maxcargo >= 4 && <td colspan="1"><span id="MainContent_lblflightcmpt4"><b>4/</b>{this.state.trim_sheet.cmpt4}</span> </td>}
//                       <td width="10px"> &nbsp;</td>
//                     </tr> */}

//                               {/* ZONE */}
//                             </tbody>
//                           </table>
//                         )}
//                         {this.state.trim_sheet != null && (
//                           <table
//                             id="MainContent_Table3"
//                             className={classes.trimsheet_papper1}
//                             align="center"
//                             bgcolor="white"
//                             cellpadding="2"
//                             cellspacing="2"
//                             border="0"
//                             width="100%"
//                             style={{ color: "#000" }}
//                           >
//                             <tbody>
//                               <tr>
//                                 {this.state.Maxpax >= 1 && (
//                                   <td
//                                     colspan="1"
//                                     width="33.33%"
//                                     style={{ textAlign: "left" }}
//                                   >
//                                     <b>ZONE1 &nbsp;</b>
//                                     <span id="MainContent_lblflightzone1">
//                                       {this.state.trim_sheet.C1Adult +
//                                         this.state.trim_sheet.C1Child +
//                                         parseInt(
//                                           this.state.trim_sheet.AdjustStrv2.split(
//                                             "$"
//                                           )[13]
//                                         )}
//                                     </span>{" "}
//                                   </td>
//                                 )}
//                                 {this.state.Maxpax >= 2 && (
//                                   <td
//                                     colspan="1"
//                                     width="33.33%"
//                                     style={{ textAlign: "left" }}
//                                   >
//                                     <b>ZONE2 &nbsp;</b>
//                                     <span id="MainContent_lblflightzone2">
//                                       {this.state.trim_sheet.C2Adult +
//                                         this.state.trim_sheet.C2Child +
//                                         parseInt(
//                                           this.state.trim_sheet.AdjustStrv2.split(
//                                             "$"
//                                           )[14]
//                                         )}
//                                     </span>{" "}
//                                   </td>
//                                 )}
//                                 {this.state.Maxpax >= 3 && (
//                                   <td
//                                     colspan="1"
//                                     width="33.33%"
//                                     style={{ textAlign: "left" }}
//                                   >
//                                     <b>ZONE3 &nbsp;</b>
//                                     <span id="MainContent_lblflightzone3">
//                                       {this.state.trim_sheet.C3Adult +
//                                         this.state.trim_sheet.C3Child +
//                                         parseInt(
//                                           this.state.trim_sheet.AdjustStrv2.split(
//                                             "$"
//                                           )[15]
//                                         )}
//                                     </span>{" "}
//                                   </td>
//                                 )}
//                               </tr>
//                               {this.state.Maxpax >= 4 && (
//                                 <tr>
//                                   {this.state.Maxpax >= 4 && (
//                                     <td
//                                       colspan="1"
//                                       width="33.33%"
//                                       style={{ textAlign: "left" }}
//                                     >
//                                       <b>ZONE4 &nbsp;</b>
//                                       <span id="MainContent_lblflightzone4">
//                                         {this.state.trim_sheet.C4Adult +
//                                           this.state.trim_sheet.C4Child}
//                                       </span>{" "}
//                                     </td>
//                                   )}
//                                   {this.state.Maxpax >= 5 && (
//                                     <td
//                                       colspan="1"
//                                       width="33.33%"
//                                       style={{ textAlign: "left" }}
//                                     >
//                                       <b>ZONE5 &nbsp;</b>
//                                       <span id="MainContent_lblflightzone5">
//                                         {this.state.trim_sheet.C5Adult +
//                                           this.state.trim_sheet.C5Child}
//                                       </span>{" "}
//                                     </td>
//                                   )}
//                                   {this.state.Maxpax >= 6 && (
//                                     <td
//                                       colspan="1"
//                                       width="33.33%"
//                                       style={{ textAlign: "left" }}
//                                     >
//                                       <b>ZONE6 &nbsp;</b>
//                                       <span id="MainContent_lblflightzone6">
//                                         {this.state.trim_sheet.C6Adult +
//                                           this.state.trim_sheet.C6Child}
//                                       </span>{" "}
//                                     </td>
//                                   )}
//                                 </tr>
//                               )}
//                               {this.state.Maxpax <= 8 &&
//                                 this.state.Maxpax >= 7 && (
//                                   <tr>
//                                     {this.state.Maxpax >= 7 && (
//                                       <td
//                                         colspan="1"
//                                         width="33.33%"
//                                         style={{ textAlign: "left" }}
//                                       >
//                                         <b>ZONE7 &nbsp;</b>
//                                         <span id="MainContent_lblflightzone7">
//                                           {this.state.trim_sheet.C7Adult +
//                                             this.state.trim_sheet.C7Child}
//                                         </span>{" "}
//                                       </td>
//                                     )}
//                                     {this.state.Maxpax >= 8 && (
//                                       <td
//                                         colspan="1"
//                                         width="33.33%"
//                                         style={{ textAlign: "left" }}
//                                       >
//                                         <b>ZONE8 &nbsp;</b>
//                                         <span id="MainContent_lblflightzone8">
//                                           {this.state.trim_sheet.C8Adult +
//                                             this.state.trim_sheet.C8Child}
//                                         </span>{" "}
//                                       </td>
//                                     )}
//                                   </tr>
//                                 )}
//                               {/* <tr >
//                       <td >&nbsp;</td>
//                       {this.state.Maxpax >= 1 && <td><b>ZONE1  &nbsp; </b><span id="MainContent_lblflightcmpt1">{this.state.trim_sheet.C1Adult + this.state.trim_sheet.C1Child }</span> </td>}
//                       {this.state.Maxpax >= 2 && <td><b>ZONE2  &nbsp; </b><span id="MainContent_lblflightcmpt2">{this.state.trim_sheet.C2Adult + this.state.trim_sheet.C2Child }</span> </td>}
//                       {this.state.Maxpax >= 3 && <td><b>ZONE3  &nbsp; </b><span id="MainContent_lblflightcmpt3">{this.state.trim_sheet.C3Adult + this.state.trim_sheet.C3Child }</span> </td>}
//                     </tr> */}

//                               {/* {this.state.Maxpax >=4 && <tr >
//                       <td >&nbsp;</td>
//                       {this.state.Maxpax >= 4 && <td><b>ZONE4  &nbsp; </b><span id="MainContent_lblflightcmpt1">{this.state.trim_sheet.C4Adult + this.state.trim_sheet.C4Child }</span> </td>}
//                       {this.state.Maxpax >= 5 && <td><b>ZONE5  &nbsp; </b><span id="MainContent_lblflightcmpt2">{this.state.trim_sheet.C5Adult + this.state.trim_sheet.C5Child }</span> </td>}
//                       {this.state.Maxpax >= 6 && <td><b>ZONE6  &nbsp; </b><span id="MainContent_lblflightcmpt3">{this.state.trim_sheet.C6Adult + this.state.trim_sheet.C6Child }</span> </td>}
//                     </tr>} */}

//                               {/* {this.state.Maxpax <= 8 && this.state.Maxpax >=7 && <tr >
//                       <td >&nbsp;</td>
//                       {this.state.Maxpax >= 7 && <td><b>ZONE7  &nbsp; </b><span id="MainContent_lblflightcmpt1">{this.state.trim_sheet.C7Adult + this.state.trim_sheet.C7Child }</span> </td>}
//                       {this.state.Maxpax >= 8 && <td><b>ZONE8  &nbsp; </b><span id="MainContent_lblflightcmpt2">{this.state.trim_sheet.C8Adult + this.state.trim_sheet.C8Child }</span> </td>}
//                     </tr>} */}

//                               {/* pax*/}
//                             </tbody>
//                           </table>
//                         )}
//                         {this.state.trim_sheet != null && (
//                           <table
//                             id="MainContent_Table3"
//                             className={classes.trimsheet_papper1}
//                             align="center"
//                             bgcolor="white"
//                             cellpadding="2"
//                             cellspacing="2"
//                             border="0"
//                             width="100%"
//                             style={{ color: "#000" }}
//                           >
//                             <tbody>
//                               <tr>
//                                 <td
//                                   colspan="1"
//                                   width="33.33%"
//                                   style={{ textAlign: "left" }}
//                                 >
//                                   <b>PAX &nbsp;</b>
//                                   <span id="MainContent_lblflightpax">
//                                     {this.state.totalAdult}
//                                   </span>
//                                   /
//                                   <span id="MainContent_lblflightChild">
//                                     {this.state.totalChild}
//                                   </span>
//                                   /
//                                   <span id="MainContent_lblflightInfant">
//                                     {this.state.totalInfant}
//                                   </span>{" "}
//                                 </td>
//                                 <td
//                                   colspan="1"
//                                   width="33.33%"
//                                   style={{ textAlign: "left" }}
//                                 >
//                                   <b>TTL &nbsp;</b>
//                                   <span id="MainContent_lblflightTTL">
//                                     {this.state.totalAdult +
//                                       this.state.totalChild +
//                                       this.state.totalInfant}
//                                   </span>{" "}
//                                 </td>
//                                 <td
//                                   colspan="1"
//                                   width="33.33%"
//                                   style={{ textAlign: "left" }}
//                                 >
//                                   <b>POB &nbsp;</b>
//                                   <span id="MainContent_lblflightSOB">
//                                     {this.state.totalAdult +
//                                       this.state.totalChild +
//                                       this.state.totalInfant +
//                                       this.state.crew}
//                                   </span>{" "}
//                                 </td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         )}
//                       </React.Fragment>
//                     )}
//                   {this.state.trim_sheet != null &&
//                     this.state.trim_sheet.IsFreighter == 1 && (
//                       <React.Fragment>
//                         <br />
//                         <table
//                           id="MainContent_Table3"
//                           className={classes.trimsheet_papper1}
//                           align="center"
//                           bgcolor="white"
//                           cellpadding="2"
//                           cellspacing="2"
//                           border="0"
//                           width="100%"
//                           style={{ color: "#000" }}
//                         >
//                           <tbody>
//                             <tr>
//                               <td
//                                 colspan="1"
//                                 width="100%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>LOAD IN UPPER DECK &nbsp;</b>
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                         <table
//                           id="MainContent_Table3"
//                           className={classes.trimsheet_papper1}
//                           align="center"
//                           bgcolor="white"
//                           cellpadding="2"
//                           cellspacing="2"
//                           border="0"
//                           width="100%"
//                           style={{ color: "#000" }}
//                         >
//                           <tbody>
//                             {this.state.loadUpperdeckRows.map((item, i) => {
//                               return (
//                                 <tr>
//                                   {item.map((p) => {
//                                     return (
//                                       <td
//                                         colspan="1"
//                                         width="25%"
//                                         style={{ textAlign: "left" }}
//                                       >
//                                         <b>{p.name}/</b>
//                                         {p.load}
//                                       </td>
//                                     );
//                                   })}
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                         <br />
//                         <table
//                           id="MainContent_Table3"
//                           className={classes.trimsheet_papper1}
//                           align="center"
//                           bgcolor="white"
//                           cellpadding="2"
//                           cellspacing="2"
//                           border="0"
//                           width="100%"
//                           style={{ color: "#000" }}
//                         >
//                           <tbody>
//                             <tr>
//                               <td
//                                 colspan="1"
//                                 width="100%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>LOAD IN LOWER DECK &nbsp;</b>
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                         <table
//                           id="MainContent_Table3"
//                           className={classes.trimsheet_papper1}
//                           align="center"
//                           bgcolor="white"
//                           cellpadding="2"
//                           cellspacing="2"
//                           border="0"
//                           width="100%"
//                           style={{ color: "#000" }}
//                         >
//                           <tbody>
//                             {this.state.loadLowerdeckRows.map((item, i) => {
//                               return (
//                                 <tr>
//                                   {item.map((p) => {
//                                     return (
//                                       <td
//                                         colspan="1"
//                                         width="20%"
//                                         style={{ textAlign: "left" }}
//                                       >
//                                         <b>{p.name}/</b>
//                                         {p.load}
//                                       </td>
//                                     );
//                                   })}
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                         <br />
//                         <table
//                           id="MainContent_Table3"
//                           className={classes.trimsheet_papper1}
//                           align="center"
//                           bgcolor="white"
//                           cellpadding="2"
//                           cellspacing="2"
//                           border="0"
//                           width="100%"
//                           style={{ color: "#000" }}
//                         >
//                           <tbody>
//                             <tr>
//                               <td
//                                 colspan="1"
//                                 width="100%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>TTL LOAD UPPER DECK &nbsp;</b>
//                                 {this.state.totalLoadUpperDeck}
//                               </td>
//                             </tr>
//                             <tr>
//                               <td
//                                 colspan="1"
//                                 width="100%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>TTL LOAD LOWER DECK &nbsp;</b>
//                                 {this.state.totalLoadLowerDeck}
//                               </td>
//                             </tr>
//                             <tr>
//                               <td
//                                 colspan="1"
//                                 width="100%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>TTL DEADLOAD ON FLT &nbsp;</b>
//                                 {this.state.totalLoadUpperDeck +
//                                   this.state.totalLoadLowerDeck}
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                         <br />
//                         <table
//                           id="MainContent_Table3"
//                           className={classes.trimsheet_papper1}
//                           align="center"
//                           bgcolor="white"
//                           cellpadding="2"
//                           cellspacing="2"
//                           border="0"
//                           width="100%"
//                           style={{ color: "#000" }}
//                         >
//                           <tbody>
//                             <tr>
//                               <td
//                                 colspan="1"
//                                 width="33.33%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>TTL CREW &nbsp;</b>
//                                 <span id="MainContent_lblflightpax">
//                                   {this.state.TTL_CREW}
//                                 </span>
//                               </td>
//                               <td
//                                 colspan="1"
//                                 width="33.33%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>TTL SUP &nbsp;</b>
//                                 <span id="MainContent_lblflightpax">
//                                   {this.state.TTL_SUB}
//                                 </span>
//                               </td>
//                               <td
//                                 colspan="1"
//                                 width="33.33%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>POB &nbsp;</b>
//                                 <span id="MainContent_lblflightpax">
//                                   {this.state.POB}
//                                 </span>
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                       </React.Fragment>
//                     )}
//                   {this.state.trim_sheet != null &&
//                     this.state.trim_sheet.IsCargoOnSeatStr == true && (
//                       <React.Fragment>
//                         <br />
//                         <table
//                           id="MainContent_Table3"
//                           className={classes.trimsheet_papper1}
//                           align="center"
//                           bgcolor="white"
//                           cellpadding="2"
//                           cellspacing="2"
//                           border="0"
//                           width="100%"
//                           style={{ color: "#000" }}
//                         >
//                           <tbody>
//                             <tr>
//                               <td
//                                 colspan="1"
//                                 width="100%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>LOAD IN UPPER DECK &nbsp;</b>
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                         <table
//                           id="MainContent_Table3"
//                           className={classes.trimsheet_papper1}
//                           align="center"
//                           bgcolor="white"
//                           cellpadding="2"
//                           cellspacing="2"
//                           border="0"
//                           width="100%"
//                           style={{ color: "#000" }}
//                         >
//                           <tbody>
//                             {this.state.loadUpperdeckRows.map((item, i) => {
//                               return (
//                                 <tr>
//                                   {item.map((p) => {
//                                     return (
//                                       <td
//                                         colspan="1"
//                                         width="25%"
//                                         style={{ textAlign: "left" }}
//                                       >
//                                         <b>{p.name}/</b>
//                                         {p.load}
//                                       </td>
//                                     );
//                                   })}
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                         <br />
//                         <table
//                           id="MainContent_Table3"
//                           className={classes.trimsheet_papper1}
//                           align="center"
//                           bgcolor="white"
//                           cellpadding="2"
//                           cellspacing="2"
//                           border="0"
//                           width="100%"
//                           style={{ color: "#000" }}
//                         >
//                           <tbody>
//                             <tr>
//                               <td
//                                 colspan="1"
//                                 width="100%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>LOAD IN LOWER DECK &nbsp;</b>
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                         <table
//                           id="MainContent_Table3"
//                           className={classes.trimsheet_papper1}
//                           align="center"
//                           bgcolor="white"
//                           cellpadding="2"
//                           cellspacing="2"
//                           border="0"
//                           width="100%"
//                           style={{ color: "#000" }}
//                         >
//                           <tbody>
//                             {this.state.loadLowerdeckRows.map((item, i) => {
//                               return (
//                                 <tr>
//                                   {item.map((p) => {
//                                     return (
//                                       <td
//                                         colspan="1"
//                                         width="20%"
//                                         style={{ textAlign: "left" }}
//                                       >
//                                         <b>{p.name}/</b>
//                                         {p.load}
//                                       </td>
//                                     );
//                                   })}
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                         <br />
//                         <table
//                           id="MainContent_Table3"
//                           className={classes.trimsheet_papper1}
//                           align="center"
//                           bgcolor="white"
//                           cellpadding="2"
//                           cellspacing="2"
//                           border="0"
//                           width="100%"
//                           style={{ color: "#000" }}
//                         >
//                           <tbody>
//                             <tr>
//                               <td
//                                 colspan="1"
//                                 width="100%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>TTL LOAD UPPER DECK &nbsp;</b>
//                                 {this.state.totalLoadUpperDeck}
//                               </td>
//                             </tr>
//                             <tr>
//                               <td
//                                 colspan="1"
//                                 width="100%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>TTL LOAD LOWER DECK &nbsp;</b>
//                                 {this.state.totalLoadLowerDeck}
//                               </td>
//                             </tr>
//                             <tr>
//                               <td
//                                 colspan="1"
//                                 width="100%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>TTL DEADLOAD ON FLT &nbsp;</b>
//                                 {this.state.totalLoadUpperDeck +
//                                   this.state.totalLoadLowerDeck}
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                         <br />
//                         <table
//                           id="MainContent_Table3"
//                           className={classes.trimsheet_papper1}
//                           align="center"
//                           bgcolor="white"
//                           cellpadding="2"
//                           cellspacing="2"
//                           border="0"
//                           width="100%"
//                           style={{ color: "#000" }}
//                         >
//                           <tbody>
//                             <tr>
//                               <td
//                                 colspan="1"
//                                 width="33.33%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>TTL CREW &nbsp;</b>
//                                 <span id="MainContent_lblflightpax">
//                                   {this.state.TTL_CREW}
//                                 </span>
//                               </td>
//                               <td
//                                 colspan="1"
//                                 width="33.33%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>TTL SUP &nbsp;</b>
//                                 <span id="MainContent_lblflightpax">
//                                   {this.state.TTL_SUB}
//                                 </span>
//                               </td>
//                               <td
//                                 colspan="1"
//                                 width="33.33%"
//                                 style={{ textAlign: "left" }}
//                               >
//                                 <b>POB &nbsp;</b>
//                                 <span id="MainContent_lblflightpax">
//                                   {this.state.POB}
//                                 </span>
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                       </React.Fragment>
//                     )}
//                   {this.state.trim_sheet != null && (
//                     <table
//                       id="MainContent_Table3"
//                       className={classes.trimsheet_papper1}
//                       align="center"
//                       bgcolor="white"
//                       cellpadding="2"
//                       cellspacing="2"
//                       border="0"
//                       width="100%"
//                       style={{ color: "#000" }}
//                     >
//                       <tbody>
//                         <tr>
//                           <td colspan="6" width="100%">
//                             <b>SI :&nbsp;</b> {this.state.trim_sheet.specialStr}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td
//                             colspan="6"
//                             width="100%"
//                             style={{ textAlign: "center" }}
//                           >
//                             <b>LAST MINUTE CHANGES &nbsp;</b>
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   )}
//                   {this.state.trim_sheet != null && (
//                     <table
//                       id="MainContent_Table3"
//                       className={classes.trimsheet_papper1}
//                       align="center"
//                       bgcolor="white"
//                       cellpadding="2"
//                       cellspacing="2"
//                       border="0"
//                       width="100%"
//                       style={{ color: "#000" }}
//                     >
//                       <tbody>
//                         <tr>
//                           <td colspan="1" width="24%">
//                             <b>DEST</b>
//                           </td>
//                           <td colspan="1" width="24%">
//                             <b>SPEC</b>{" "}
//                           </td>
//                           <td colspan="1" width="24%">
//                             <b>CL/CPT</b>
//                           </td>
//                           <td colspan="2" width="28%">
//                             <b>+/- WEIGHT</b>
//                           </td>
//                         </tr>
//                         <tr>
//                           <td colspan="6" width="100%">
//                             &nbsp;
//                           </td>
//                         </tr>
//                         <tr>
//                           <td colspan="6" width="100%">
//                             &nbsp;
//                           </td>
//                         </tr>
//                         <tr>
//                           <td colspan="6" width="100%">
//                             &nbsp;
//                           </td>
//                         </tr>
//                         <tr>
//                           <td colspan="6" width="100%">
//                             <b>ALL WEIGHTS IN KILOGRAM</b>
//                           </td>
//                         </tr>
//                         <tr>
//                           <td colspan="6" width="100%">
//                             <b>PREPARED BY&nbsp;</b>
//                             {this.state.trim_sheet.Trim_Officer}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   )}
//                   {this.state.trim_sheet != null && (
//                     <table
//                       id="MainContent_Table3"
//                       className={classes.trimsheet_papper1}
//                       align="center"
//                       bgcolor="white"
//                       cellpadding="2"
//                       cellspacing="2"
//                       border="0"
//                       width="100%"
//                       style={{ color: "#000" }}
//                     >
//                       <tbody>
//                         <tr>
//                           <td colspan="1" width="33.33%">
//                             <span
//                               id="MainContent_lblLTLoginId"
//                               style={{ fontWeight: "normal" }}
//                             >
//                               {this.state.trim_sheet.LTLoginId}
//                             </span>
//                           </td>
//                           <td
//                             colspan="1"
//                             width="33.33%"
//                             style={{ textAlign: "center" }}
//                           >
//                             <span
//                               id="MainContent_lblTrimGenTimeUTC"
//                               style={{ fontWeight: "normal" }}
//                             >
//                               {this.formatDate(
//                                 this.state.trim_sheet.TrimGenTimeUTC
//                               )}
//                             </span>
//                           </td>
//                           <td
//                             colspan="1"
//                             width="33.33%"
//                             style={{ textAlign: "right" }}
//                           >
//                             <span
//                               id="MainContent_lblTrimGenTimeUTC"
//                               style={{ fontWeight: "normal" }}
//                             >
//                               {this.formatTime(
//                                 this.state.trim_sheet.TrimGenTimeUTC
//                               ) + " UTC"}
//                             </span>
//                           </td>
//                         </tr>

//                         <tr>
//                           <td colspan="6" width="100%">
//                             {" "}
//                             I CERTIFY THAT THIS AIRCRAFT HAS BEEN LOADED IN
//                             ACCORDANCE WITH THE AFM
//                             <span id="MainContent_lblflightPreparedby"></span>
//                           </td>
//                         </tr>
//                         <tr>
//                           <td colSpan="6">&nbsp;</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   )}
//                   {this.state.trim_sheet != null && (
//                     <table
//                       id="MainContent_Table3"
//                       className={classes.trimsheet_papper2}
//                       align="center"
//                       bgcolor="white"
//                       cellpadding="2"
//                       cellspacing="2"
//                       border="0"
//                       width="100%"
//                       style={{ color: "#000" }}
//                     >
//                       <tbody>
//                         {/* <tr> */}
//                         <tr colspan="1" style={{ textAlign: "left" }}>
//                           <b>LOAD OFFICER&nbsp;</b>
//                         </tr>
//                         {/* </tr>
//                 <tr> */}
//                         <tr colspan="1" style={{ textAlign: "left" }}>
//                           <span id="MainContent_lblflightLoadOfficier">
//                             {" "}
//                             {this.state.trim_sheet.Load_Officer}&nbsp;
//                           </span>
//                         </tr>
//                         <tr colspan="1" style={{ textAlign: "left" }}>
//                           <b>CAPTAIN / ATPL No.</b>
//                         </tr>
//                         <tr colspan="1" style={{ textAlign: "left" }}>
//                           <span id="MainContent_lblflightCaptain">
//                             {" "}
//                             {localStorage.getItem("name") ||
//                               this.state.trim_sheet.CAPTAIN}
//                             &nbsp;
//                           </span>
//                         </tr>
//                         {/* </tr> */}
//                         <tr>
//                           <td colspan="6" width="100%">
//                             {" "}
//                             APPROVED LMC LIMITS: {this.state.toleranceLimits}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td colspan="6" width="100%">
//                             {" "}
//                             AUTOMATED LOAD & TRIM SHEET APPROVED BY DELHI DAW
//                             VIDE LETTER NO. DEL-11011(13)/9/2019-DAW-NR/1348
//                             DATED 30-12-2020
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   )}
//                   {this.state.trim_sheet != null && (
//                     <>
//                       <React.Fragment>
//                         {!this.state.isDownloading && (
//                           <Fab
//                             id="printButton"
//                             disabled={this.state.is_printing}
//                             variant="extended"
//                             className={printIcon}
//                             onClick={() => {
//                               this.setState({ is_printing: true });
//                               let ts = this.state.trim_sheet;
//                               ts.CAPTAIN =
//                                 localStorage.getItem("name") ||
//                                 this.state.trim_sheet.CAPTAIN;
//                               printtrimSheet(
//                                 ts,
//                                 this.state.thrust,
//                                 this.state.flap,
//                                 this.state.stab
//                               ).then(() => {
//                                 this.setState({ is_printing: false });
//                               });
//                             }}
//                           >
//                             <PrintIcon className={classes.extendedIcon} />
//                             {this.state.is_printing ? "Printing" : "Print"}
//                           </Fab>
//                         )}
//                         {!this.state.isDownloading && (
//                           <Fab
//                             variant="extended"
//                             id="lmcButton"
//                             className={
//                               this.state.trim_sheet.IsFreighter === 0 &&
//                               this.state.trim_sheet.IsCargoOnSeatStr ===
//                                 false &&
//                               !this.state.hideLmc &&
//                               this.state.is_lmc
//                                 ? lmcIcon
//                                 : classes.lmcDisabled
//                             }
//                             onClick={() => {
//                               //  this.cordovaPdfDownload()
//                               this.props.history.push(
//                                 "/app/lmc/" +
//                                   this.props.match.params.flight_no +
//                                   "/" +
//                                   this.props.match.params.flight_date +
//                                   "/" +
//                                   this.state.trim_sheet.Acft_Regn +
//                                   "/" +
//                                   this.props.match.params.status +
//                                   "/" +
//                                   this.props.match.params.source +
//                                   "/" +
//                                   this.props.match.params.destination
//                               );
//                             }} // disabled={(this.state.trim_sheet.IsFreighter === 1 || this.state.trim_sheet.IsCargoOnSeatStr === true) || (this.state.trim_sheet.IsFreighter === 0 && this.state.trim_sheet.IsCargoOnSeatStr === false && !this.state.hideLmc && this.state.is_lmc) ? false: true}>
//                             disabled={
//                               this.state.trim_sheet.IsFreighter === 0 &&
//                               this.state.trim_sheet.IsCargoOnSeatStr ===
//                                 false &&
//                               !this.state.hideLmc &&
//                               this.state.is_lmc
//                                 ? false
//                                 : true
//                             }
//                           >
//                             LMC
//                           </Fab>
//                         )}
//                       </React.Fragment>
//                       <React.Fragment>
//                         {!this.state.isDownloading && (
//                           <Fab
//                             variant="extended"
//                             id="acceptButton"
//                             // className={
//                             //   disableAccept ? classes.addDisbaled : addText
//                             // }
//                             //  disabled={disableAccept}
//                             onClick={() =>
//                               this.state.sharebutton == true
//                                 ? this.open()
//                                 : // (

//                                   // this.props.history.push({
//                                   //   pathname: "/popup",
//                                   //   state: {
//                                   //     dataneeded: this.state.qrcodeData
//                                   //   },

//                                   // })
//                                   // )
//                                   this.props.history.push({
//                                     pathname: "/scanner",
//                                     state: {
//                                       flightDate,
//                                       flightNo,
//                                       status,
//                                       source,
//                                       destination,
//                                     },
//                                   })
//                                 }
//                                   disabled={
//                                     this.state.trim_sheet.IsFreighter === 1 ||
//                                     this.state.trim_sheet.IsCargoOnSeatStr === true ||
//                                     (this.state.trim_sheet.IsFreighter === 0 &&
//                                       this.state.trim_sheet.IsCargoOnSeatStr ===
//                                         false &&
//                                       !this.state.hideLmc &&
//                                       this.state.is_lmc)
//                                       ? false
//                                       : true
//                                   }
                           
//                             // onClick={
//                             //   this.state.trimAccepted
//                             //     ? this.displayQrCodeFn
//                             //     : this.onAccept
//                             // }
//                           >
//                             {this.state.sharebutton? "Share" : "Accept"}
//                           </Fab>
//                         )}
//                       </React.Fragment>
//                     </>
//                   )}
//                 </div>
//               )}
//           </div>
//           {this.state.trim_sheet !== null && (
//             <div>
//               <Fab
//                 className={plusIcon}
//                 onClick={() => {
//                   this.handleZoom("zoomIn");
//                 }}
//               >
//                 <ZoomInIcon />
//               </Fab>
//               <Fab
//                 className={minusIcon}
//                 onClick={() => {
//                   this.handleZoom("zoomOut");
//                 }}
//               >
//                 <ZoomOutIcon />
//               </Fab>
//               <Typography variant={"h6"} className={zoomTypo}>
//                 {this.state.zoom + "%"}
//               </Typography>
//             </div>
//           )}
//         </React.Fragment>
//         {/* } */}
//         <Dialog
//           open={this.state.Dialogopen}
//           aria-labelledby="form-dialog-title"
//           onClose={this.props.Dialogopen}
//         >
//           <DialogTitle style={{ color: "white" }}>
//             Trimsheet QR Display
//           </DialogTitle>
//           <DialogContent>
//             <Grid container className={classes.gridContainer}>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <QRCode
//                   value={this.state.qrcodeData}
//                   renderAs="canvas"
//                   size={200}
//                   includeMargin={true}
//                 />
//               </div>
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button color="primary" onClick={() => this.close()}>
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>


//         {/* <QRPopupModel
//           open={this.state.displayQrCode}
//           trimStr={this.state.qrcodeData}
//           onClose={() => {
//             this.setState({ displayQrCode: false });
//           }}
//         /> */}
//       </div>
//     );
//   }
// }
// const styles = (theme) => {
//   const { breakpoints } = theme;
//   return createStyles({
//     trim_container: {
//       width: "92%",
//       margin: "0 auto",
//       [breakpoints.up("sm")]: {
//         width: "380px",
//         margin: "0 auto",
//       },
//       [breakpoints.up("md")]: {
//         width: "380px",
//         margin: "0 auto",
//       },
//     },
//     formField: {
//       marginBottom: "15px",
//     },
//     dropdown: {
//       width: "100%",
//       background: "transparent",
//       color: theme.palette.primary.main,
//       outline: "none",
//       height: "40px",
//       textAlign: "left",
//     },
//     trimsheet: {
//       background: "#ffff",
//       border: "solid 1px " + theme.palette.common,
//     },
//     error: {
//       color: theme.palette.common,
//       textAlign: "center",
//     },
//     typo: {
//       color: theme.palette.background.default,
//       textAlign: "center",
//     },
//     trimsheet_papper1: {
//       background: "#fff",
//       border: "solid 1px " + theme.palette.common,
//     },
//     trimsheet_papper2: {
//       background: "#fff",
//       border: "solid 1px " + theme.palette.common,
//       marginBottom: "60px",
//     },
//     printIconDark: {
//       position: "fixed",
//       bottom: theme.spacing(4),
//       left: "10px",
//       // margin : "0 auto",
//       width: "95px",
//       [breakpoints.up("sm")]: {
//         left: "23%",
//         width: "95px",
//       },
//       [breakpoints.up("md")]: {
//         width: "95px",
//         left: "32%",
//       },
//     },
//     printIconLight: {
//       position: "fixed",
//       bottom: theme.spacing(4),
//       left: "10px",
//       // margin : "0 auto",
//       width: "95px",
//       color: "#ffffff",
//       backgroundColor: "#003042",
//       [breakpoints.up("sm")]: {
//         left: "23%",
//         width: "95px",
//       },
//       [breakpoints.up("md")]: {
//         width: "16%",
//         left: "95px",
//       },
//     },
//     lmcIconLight: {
//       position: "fixed",
//       bottom: theme.spacing(4),
//       right: "10px",
//       // margin : "0 auto",
//       width: "70px",
//       color: "#ffffff",
//       backgroundColor: "#003042",
//       [breakpoints.up("sm")]: {
//         right: "23%",
//         width: "70px",
//       },
//       [breakpoints.up("md")]: {
//         width: "70px",
//         right: "32%",
//       },
//     },
//     lmcIconDark: {
//       position: "fixed",
//       bottom: theme.spacing(4),
//       right: "10px",
//       // margin : "0 auto",
//       width: "70px",
//       [breakpoints.up("sm")]: {
//         right: "23%",
//         width: "70px",
//       },
//       [breakpoints.up("md")]: {
//         width: "70px",
//         right: "32%",
//       },
//     },
//     addLight: {
//       position: "fixed",
//       bottom: theme.spacing(4),
//       left: "42%",
//       // margin : "0 auto",
//       width: "70px",
//       color: "#ffffff",
//       backgroundColor: "#003042",
//       [breakpoints.up("sm")]: {
//         left: "42%",
//         width: "70px",
//       },
//       [breakpoints.up("md")]: {
//         width: "70px",
//         left: "42%",
//       },
//     },
//     addDark: {
//       position: "fixed",
//       bottom: theme.spacing(4),
//       left: "42%",
//       // margin : "0 auto",
//       width: "70px",
//       [breakpoints.up("sm")]: {
//         left: "42%",
//         width: "70px",
//       },
//       [breakpoints.up("md")]: {
//         width: "70px",
//         left: "42%",
//       },
//     },
//     gridItem: {
//       paddingRight: "10px",
//       "&:last-child": {
//         paddingRight: 0,
//       },
//     },
//     extendedIcon: {
//       marginRight: theme.spacing(2),
//     },
//     // zoneRow:{
//     //   display:'grid',
//     //   gridTemplateColumns:' 10px auto auto auto',
//     //   background:"#ffff",
//     //   color:theme.palette.background.default
//     // },
//     "grid-container": {
//       display: "grid",
//       gridTemplateColumns: " 10px auto auto auto",
//     },
//     plusIconDark: {
//       position: "fixed",
//       bottom: "auto",
//       top: "52px",
//       right: "25px",
//       [breakpoints.down("sm")]: {
//         display: "none",
//       },
//     },
//     plusIconLight: {
//       position: "fixed",
//       bottom: "auto",
//       top: "52px",
//       right: "25px",
//       color: "#ffffff",
//       backgroundColor: "#003042",
//       [breakpoints.down("sm")]: {
//         display: "none",
//       },
//     },
//     minusIconDark: {
//       position: "fixed",
//       bottom: "auto",
//       top: "115px",
//       right: "25px",
//       [breakpoints.down("sm")]: {
//         display: "none",
//       },
//     },
//     minusIconLight: {
//       position: "fixed",
//       bottom: "auto",
//       top: "115px",
//       right: "25px",
//       color: "#ffffff",
//       backgroundColor: "#003042",
//       [breakpoints.down("sm")]: {
//         display: "none",
//       },
//     },
//     zoomTypoDark: {
//       color: "#ffffff",
//       textAlign: "center",
//       position: "fixed",
//       bottom: "auto",
//       top: "170px",
//       right: "25px",
//       [breakpoints.down("sm")]: {
//         display: "none",
//       },
//     },
//     zoomTypoLight: {
//       color: "#2b3144",
//       textAlign: "center",
//       position: "fixed",
//       bottom: "auto",
//       top: "170px",
//       right: "25px",
//       [breakpoints.down("sm")]: {
//         display: "none",
//       },
//     },
//     lmcDisabled: {
//       position: "fixed",
//       bottom: theme.spacing(4),
//       right: "10px",
//       // margin : "0 auto",
//       width: "70px",
//       [breakpoints.up("sm")]: {
//         right: "23%",
//         width: "70px",
//       },
//       [breakpoints.up("md")]: {
//         width: "70px",
//         right: "32%",
//       },
//       backgroundColor: "#e0e0e0 !important",
//       color: "#0000007a !important",
//     },
//     addDisbaled: {
//       position: "fixed",
//       bottom: theme.spacing(4),
//       left: "42%",
//       // margin : "0 auto",
//       width: "70px",
//       color: "#0000007a !important",
//       backgroundColor: "#e0e0e0 !important",
//       [breakpoints.up("sm")]: {
//         left: "42%",
//         width: "70px",
//       },
//       [breakpoints.up("md")]: {
//         width: "70px",
//         left: "42%",
//       },
//     },
//   });
// };
// export default connect(
//   (store) => {
//     return {
//       sync: store.sync,
//     };
//   },
//   {
//     setPage: setPage,
//     setPageAction: setAction,
//   }
// )(compose(withRouter, withStyles(styles))(Trimsheet));

import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Typography,
  Fab,
  Grid,
  MenuItem,
  FormControl,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import { Print as PrintIcon } from "@material-ui/icons";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import { setPage, setAction } from "../../../Action/pageaction";
import SelectInput from "../../common/Select/index";
import { get } from "lodash";
import * as Enviornment from "../../../Action/environment";
import { printtrimSheet } from "../../../Action/trimsheetprintaction";
import { fetchTrimSheetforFlight } from "../../../Action/fimsTrimsheetaction";

import moment from "moment";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { checkLmcStatus } from "../../../Action/rampaction";
import { UpdateCaptEmpId } from "../../../Action/LMCupdaeaction";
import "./style.scss";
import QRCode from "qrcode.react";

class Trimsheet extends React.Component {
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
      hideLmc: false,
      hideTrimsheet: false,
      zoom: 130,
      totalLoadUpperDeck: 0,
      loadUpperdeckRows: [],
      totalLoadLowerDeck: 0,
      loadLowerdeckRows: [],
      TTL_CREW: 0,
      TTL_SUB: 0,
      POB: 0,
      toleranceLimits: "NO LMC LIMITS APPROVED FOR FREIGHTER AIRCRAFT",
      is_lmc: false,
      isScan: false,
      isDownloading: false,
      isDownloaded: false,
      displayQrCode: false,
      qrcodeData: "",
      trimAccepted: false,
      sharebutton: false,
      Dialogopen: false,
    };
    this.fetchTrimSheet = this.fetchTrimSheet.bind(this);
    this.checkLmc = this.checkLmc.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
  }

  gogingBack = false;

  componentDidUpdate() {
    console.log("LOGING LOGGING LOGGING");
    if (
      !this.state.in_prog &&
      !this.props.sync.ramp_sync &&
      !this.state.isDownloaded &&
      !this.state.isDownloading
    ) {
      const capName = localStorage.getItem("name");
      if (capName && !this.gogingBack) {
        this.gogingBack = false;
        setTimeout(() => {
          this.gogingBack = true;
          // this.cordovaPdfDownload()
          this.generateJson();
          this.setState({
            trimAccepted: true,
          });
        }, 1 * 1000);
      }
    }
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps);
    console.log("props================", newProps.location.state);
    if (newProps.location.state !== undefined) {
      const shareButton = newProps.location.state.sharebutton;
      this.setState({ sharebutton: shareButton });
    }

    // if (
    //   this.props.sync.ramp_sync == false &&
    //   newProps.sync.ramp_sync

    // ) {
    //   this.fetchTrimSheet();
    //   this.generateJson()
    // }
  }

  componentDidMount() {
    console.log(this.state.trim_sheet ,
      this.state.hideTrimsheet )
    this.props.setPage("FimsTrimsheet", "FimsTrimsheet");
    this.props.setPageAction(null);

    this.checkLmc();
    if (this.state.isScan == false) {
      this.fetchTrimSheet();
      console.log(this.state.trim_sheet ,
        this.state.hideTrimsheet )
    }

    console.log(this.state.in_prog,
      this.props.sync.ramp_sync ,
      this.state.error === true)
  }

  showTrimsheet() {
    // this.gogingBack = true;
    this.setState({
      displayQrCode: false,
    });
  }

  checkLmc() {
    var me = this;
    console.log("props neded to dosplay=====", this.props);
    var flightNo = this.props.match.params.flight_no;
    var flightDate = this.props.match.params.flight_date;
    var source = this.props.match.params.source;
    var destination = this.props.match.params.destination;
    var status = this.props.match.params.status;

    if (status === "past") {
      this.setState({ hideLmc: true });
    } else {
      var data = {
        FlightNo: flightNo,
        Flight_Date: moment(flightDate).format("YYYY-MM-DD"),
        Source: source,
        Destination: destination,
      };
      console.log("post data", data);
      checkLmcStatus(data)
        .then((res) => {
          console.log("result", res);
          console.log(this.state.hideTrimsheet ,this.state.trim_sheet)
          if (res.data.status === "Open") {
            this.setState({ hideTrimsheet: true });
          }
        })
        .catch((err) => {
          // me.setState({ in_prog: false, error: true });
          me.setState({ in_prog: false, error: false });
        });
    }
  }
  fetchTrimSheet() {
    var me = this;
    var user = JSON.parse(window.localStorage.getItem("auth_user"));
    me.setState({ in_prog: true, error: false, is_lmc: user.is_lmc });
    var source = this.props.match.params.source;

    var destination = this.props.match.params.destination;
    var flight_date = this.props.match.params.flight_date;
    console.log(flight_date, destination);
    fetchTrimSheetforFlight(
      this.props.match.params.flight_no,
      flight_date,
      source,
      destination
    )
      .then((trim) => {
        console.log("=======needed trim======", trim);
        var count = 0;
        var stdCount = 0;
        var crewArray = trim.ActcrewStr.split("/");
        var stdcrewArray = trim.STDCREW.match(/\d+/g);
        console.log(trim.AdjustStr);
        var cabinArray = [];
        var cabinBagagge = 0;

        var TTL_CREW = 0;
        var TTL_SUB = 0;
        var POB = 0;

        if (trim["IsCargoOnSeatStr"] == true || trim["IsFreighter"] == 1) {
          cabinArray = trim.AdjustStrv2.split("$");
          cabinBagagge = parseInt(cabinArray[3]);
          if (isNaN(cabinBagagge)) {
            cabinBagagge = 0;
          }

          var crewSplit = trim.ActcrewStr.split("/");

          POB = parseInt(crewSplit[0]) + parseInt(crewSplit[1]);
          TTL_CREW = parseInt(crewSplit[0]);
          TTL_SUB = parseInt(crewSplit[1]);
        } else {
          cabinArray = trim.AdjustStrv2.split("$");
          cabinBagagge = parseInt(cabinArray[3]);
          if (isNaN(cabinBagagge)) {
            cabinBagagge = 0;
          }
        }

       

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
        var DOW = Math.round(trim.OEW);
        console.log("ACM", ACM);
        console.log("DOW", DOW);

        //Uper deck calculation for frieght aircraft
        var loadUpperdeck = [];
        var totalLoadUpperDeck = 0;
        if (trim.IsFreighter == 1) {
          var loadUpperdeckCabin = trim.PalletsStr.split("#");
          loadUpperdeckCabin.forEach((deck) => {
            var deckValues = deck.split("$");
            if (deckValues[1] == undefined) {
              return;
            }
            var load = 0;
            if (!isNaN(deckValues[6])) {
              load = parseInt(deckValues[6]);
            }

            if (isNaN(load)) {
              load = 0;
            }

            loadUpperdeck.push({
              name: deckValues[1],
              load: isNaN(load) ? 0 : load,
            });
            totalLoadUpperDeck += load;
          });
        }

        if (trim.IsCargoOnSeatStr == true) {
          var loadUpperdeckCabin = trim.CargoOnSeatStr.split("#");
          loadUpperdeckCabin.forEach((zone) => {
            var name = "";
            var load = 0;

            var zoneSplit = zone.split("*");
            zoneSplit.forEach((deck) => {
              var deckValues = deck.split("$");
              if (
                deckValues[0] == undefined ||
                String(deckValues[0]).trim().length == 0
              ) {
                return;
              }
              name = String(deckValues[0]).trim();
              var deckLoad = 0;
              if (!isNaN(deckValues[2])) {
                deckLoad = parseInt(deckValues[2]);
              }

              if (isNaN(deckLoad)) {
                deckLoad = 0;
              }
              load += deckLoad;
            });
            if (String(name).trim() == 0) {
              return;
            }
            loadUpperdeck.push({
              name: name,
              load: isNaN(load) ? 0 : load,
            });
            totalLoadUpperDeck += load;
          });
        }

        var loadUpperdeckRows = [];
        var upperDectRowItemCount = 4;
        var tempArrayForUpperDeck = [];
        for (var i = 0; i < loadUpperdeck.length; i++) {
          tempArrayForUpperDeck.push(loadUpperdeck[i]);
          if (i % upperDectRowItemCount == 3) {
            loadUpperdeckRows.push([...tempArrayForUpperDeck]);
            tempArrayForUpperDeck = [];
          }
        }
        if (tempArrayForUpperDeck.length > 0) {
          loadUpperdeckRows.push([...tempArrayForUpperDeck]);
        }
        console.log(loadUpperdeckRows, totalLoadUpperDeck, "Upper Deck");

        //Lower deck calculation for frieght aircraft
        var loadLowerdeck = [];
        var totalLoadLowerDeck = 0;
        if (trim.IsFreighter == 1 || trim.IsCargoOnSeatStr == true) {
          var loadUpperdeckCabin = trim.ActCompStr.split("$");
          loadUpperdeckCabin.forEach((deck, i) => {
            if (deck.length == 0) {
              return;
            }
            var deckValue = 0;
            if (!isNaN(deck)) {
              deckValue = parseInt(deck);
            }
            if (isNaN(deckValue)) {
              deckValue = 0;
            }
            loadLowerdeck.push({
              name: "C" + (i + 1),
              load: isNaN(deckValue) ? 0 : deckValue,
            });
            totalLoadLowerDeck += deckValue;
          });
        }

        var loadLowerdeckRows = [];
        var lowerDectRowItemCount = 5;
        var tempArrayForLowerDeck = [];
        for (var i = 0; i < loadLowerdeck.length; i++) {
          tempArrayForLowerDeck.push(loadLowerdeck[i]);
          if (i % lowerDectRowItemCount == 4) {
            loadLowerdeckRows.push([...tempArrayForLowerDeck]);
            tempArrayForLowerDeck = [];
          }
        }
        if (tempArrayForLowerDeck.length > 0) {
          loadLowerdeckRows.push([...tempArrayForLowerDeck]);
        }

        var LIM1 = parseInt(trim.MZFW + trim.FOB);
        var LIM2 = parseInt(trim.OTOW);
        var LIM3 = parseInt(trim.OLW + trim.TRIP_FUEL);

        if (LIM1 < LIM2 && LIM1 < LIM3) {
          this.setState({ lim1: true });
        }
        if (LIM2 < LIM1 && LIM2 < LIM3) {
          this.setState({ lim2: true });
        }
        if (LIM3 < LIM1 && LIM3 < LIM2) {
          this.setState({ lim3: true });
        }
        var finalConfig = "";
        if (trim["IsFreighter"] == 1) {
          finalConfig = trim.CONFIG;
        } else if (trim["IsCargoOnSeatStr"] == 1) {
          finalConfig = trim.CONFIG.replace("Y", "CIC");
        } else {
          var alpha = trim.CONFIG.match(/[a-zA-Z]/g).join("");
          var digit = trim.CONFIG.match(/\d/g).join("");
          finalConfig = digit + alpha;
        }

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
        var CABBGWT = cabinBagagge;
        var PAXWT = totalAdult * 75 + totalChild * 35 + totalInfant * 10;
        var TTLLOAD = 0;

        if (trim["IsCargoOnSeatStr"] == true || trim["IsFreighter"] == 1) {
          TTLLOAD = cabinBagagge + totalLoadLowerDeck + totalLoadUpperDeck;
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

        var thrust = trim.Thrust1 > 0 ? trim.Thrust1 : 0;
        var flap = thrust > 0 ? trim.T1Flap1 : "";
        var stab = thrust > 0 ? trim.T1Stab1 : 0;

        var toleranceLimits = "NO LMC LIMITS APPROVED FOR FREIGHTER AIRCRAFT";
        if (trim["IsCargoOnSeatStr"] == true) {
          if (trim["Acft_Type"] == "Q400") {
            toleranceLimits =
              "+ / - 200 KG OF ACM / SNY / CARGO IN COMPARTMENT AND + / - 500 KG FUEL.";
          } else {
            toleranceLimits =
              "+ / - 400 KG OF ACM / SNY / CARGO IN LOWER DECK AND + / - 1000 KG FUEL.";
          }
        } else if (trim["IsFreighter"] == 1) {
          if (trim["Acft_Type"] == "Q400") {
            toleranceLimits =
              "+ / - 200 KG OF ACM / SNY / CARGO IN COMPARTMENT AND + / - 500 KG FUEL.";
          } else {
            toleranceLimits =
              "+ / - 400 KG OF ACM / SNY / CARGO IN LOWER DECK AND + / - 1000 KG FUEL.";
          }
        } else {
          if (trim["Acft_Type"] == "Q400") {
            toleranceLimits =
              "+ / - 200 KG OF PERSON ON BOARD / BAGGAGE / CARGO AND + / - 500 KG. FUEL.";
          } else {
            toleranceLimits =
              "+ / - 400 KG OF PERSON ON BOARD / BAGGAGE / CARGO AND + / - 1000 KG FUEL.";
          }
        }
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
          trim_sheet:trim,
          crew: count,
          DOW: DOW,
          Maxcargo: trim.MaxCompartment,
          Maxpax: trim.MaxCabin,
          totalLoad: TTLLOAD,
          totalAdult: totalAdult,
          totalChild: totalChild,
          totalInfant: totalInfant,
          loadUpperdeckRows: loadUpperdeckRows,
          totalLoadUpperDeck: totalLoadUpperDeck,
          totalLoadLowerDeck: totalLoadLowerDeck,
          loadLowerdeckRows: loadLowerdeckRows,
          TTL_CREW: TTL_CREW,
          TTL_SUB: TTL_SUB,
          POB: POB,
          toleranceLimits: toleranceLimits,
        });
        this.generateJson();
        
      })
      .catch((err) => {
        console.log(err, "error...");
        me.setState({ in_prog: false, error: true, trim_sheet: null });
      });
  }

  formatTime(str) {
    if (str == null) {
      return "-";
    }
    return moment(str).format("HH:mm");
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
    if (res.length == 1 || res[1].length >= 1) {
      value = value.toFixed(2);
    }
    return value;
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

  savebase64AsPDF = (folderpath, filename, blob) => {
    // Convert the base64 string in a Blob
    try {
      window.resolveLocalFileSystemURL(
        folderpath,
        function (dir) {
          dir.getFile(
            filename,
            { create: true },
            function (file) {
              file.createWriter(
                function (fileWriter) {
                  fileWriter.write(blob);
                },
                function () {
                  alert("Unable to save file in path " + folderpath);
                }
              );
            },
            (err) => alert(JSON.stringify(err))
          );
        },
        (err) => alert(JSON.stringify(err))
      );
    } catch (err) {
      alert(err);
    }
  };

  createFolder = () => {
    return new Promise((res, rej) => {
      try {
        window.resolveLocalFileSystemURL(
          window.cordova.file.externalRootDirectory,
          function (dir) {
            dir.getDirectory(
              "SALTArchive",
              { create: true },
              () => {
                res(true);
              },
              (err) => res(true)
            );
          },
          (err) => res(true)
        );
      } catch (err) {
        rej(err);
      }
    });
  };

  cordovaPdfDownload = () => {
    this.setState(
      {
        isDownloading: true,
      },
      () => {
        const input = document.getElementById("trimsheet");
        const [fix, name] = get(this.state, "trim_sheet.Flight_no", "").split(
          "SG"
        );
        const dest = get(this.state, "trim_sheet.Destination", "");
        const source = get(this.state, "trim_sheet.Source", "");
        const date = new Date(get(this.state, "trim_sheet.Flight_Date", ""));
        const fileName = `${name}${source}${dest}${moment(date).format(
          "DDMMMYYYY"
        )}.pdf`;
        html2canvas(input).then(async (canvas) => {
          const imgData = canvas.toDataURL("image/jpeg", 0.1);
          const imgWidth = 210;
          const pageHeight = 1300;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          const pdf = new jsPDF("p", "mm", [1300, 210]);
          let position = 0;
          pdf.addImage(
            imgData,
            "jpeg",
            0,
            position,
            imgWidth,
            imgHeight + 10,
            "FAST",
            "FAST"
          );
          heightLeft -= pageHeight;
          // pdf.output('dataurlnewwindow');
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(
              imgData,
              "jpeg",
              0,
              position,
              imgWidth,
              imgHeight + 10
            );
            heightLeft -= pageHeight;
          }
          const blob = pdf.output("blob");
          var folderpath =
            window.cordova.file.externalRootDirectory + "SALTArchive/"; //you can select other folders
          await this.createFolder();
          this.savebase64AsPDF(folderpath, fileName, blob);
          this.setState({
            isDownloading: false,
            isDownloaded: true,
            isScan: false,
          });
        });
      }
    );
  };

  generateJson() {
    var ED = "ED-0";
    // if (this.state.trim_sheet.AppType !== null) {
    //   ED = "ED-M0";
    // }
    var lim1 = "";
    var lim2 = "";
    var lim3 = "";
    if (this.state.lim1 == true) {
      lim1 = "L";
    }
    if (this.state.lim3 == true) {
      lim3 = "L";
    }
    if (this.state.lim2 == true) {
      lim2 = "L";
    }
    console.log(this.state.trim_sheet);
    var JSONData = {
      fl_no:
        this.state.trim_sheet.Flight_no +
        "/" +
        this.formatDateGetDay(this.state.trim_sheet.Flight_Date),
      date: this.formatDate(this.state.trim_sheet.TrimGenTimeUTC),
      time: this.formatTime(this.state.trim_sheet.TrimGenTimeUTC),
      ED: ED + "" + this.state.trim_sheet.EDNO,
      src:
        this.state.trim_sheet.Source + "-" + this.state.trim_sheet.Destination,
      acftT: this.state.trim_sheet.Acft_Type + "/" + this.state.CONFIG,
      Acft_Regn: this.state.trim_sheet.Acft_Regn,
      ActcrewStr: this.state.trim_sheet.ActcrewStr,
      TTLLoad: this.state.totalLoad,
      CABBGWT: this.state.CABBGWT,
      DOW: this.state.DOW,
      ZFW: this.state.trim_sheet.ZFW,
      MZFW: this.state.trim_sheet.MZFW + lim1,
      TOF: this.state.trim_sheet.FOB,
      TOW: this.state.trim_sheet.TOW,
      MTOW: this.state.trim_sheet.OTOW + lim2,
      TRIP: this.state.trim_sheet.TRIP_FUEL,
      LAW: this.state.trim_sheet.LAW,
      MLAW: this.state.trim_sheet.MLW + lim3,
      UNDERLOAD: this.state.trim_sheet.underLoadLMC,
      DOI: this.fixedNumber(this.state.trim_sheet.OEW_Index),
      LIZFW: this.fixedNumber(this.state.trim_sheet.ZFWindex),
      LITOW: this.fixedNumber(this.state.trim_sheet.TOWindex),
      LILW: this.fixedNumber(this.state.trim_sheet.LWindex),
      FWD_LMT: this.fixedNumber(this.state.trim_sheet.ZFWMACFWD),
      ZFWMAC: this.fixedNumber(this.state.trim_sheet.ZFWMAC),
      AFT_LMT: this.fixedNumber(this.state.trim_sheet.ZFWMACAFT),
      TOWFWD_LMT: this.fixedNumber(this.state.trim_sheet.TOWMACFWD),
      TOWMAC: this.fixedNumber(this.state.trim_sheet.TOWMAC),
      TOWAFT_LMT: this.fixedNumber(this.state.trim_sheet.TOWMACAFT),
      LWMFWD_LMT: this.fixedNumber(this.state.trim_sheet.LWMACFWD),
      LWMAC: this.fixedNumber(this.state.trim_sheet.LWMAC),
      LWMAFT_LMT: this.fixedNumber(this.state.trim_sheet.LWMACAFT),
      SI: this.state.trim_sheet.specialStr,
      Trim_Officer: this.state.trim_sheet.Trim_Officer,
      LTLoginId: this.state.trim_sheet.LTLoginId,
      TrimGenTimeUTC: this.formatDate(this.state.trim_sheet.TrimGenTimeUTC),
      TrimGenTimeUTCUTC:
        this.formatTime(this.state.trim_sheet.TrimGenTimeUTC) + " UTC",
      Load_Officer: this.state.trim_sheet.Load_Officer,
      CAPTAIN: localStorage.getItem("name") || this.state.trim_sheet.CAPTAIN,
      CPTID: localStorage.getItem("CaptEmpId"),
      LETTER_NO:
        "AUTOMATED LOAD & TRIM SHEET APPROVED BY DELHI DAW VIDE LETTER NO. DEL-11011(13)/9/2019-DAW-NR/1348 DATED 30-12-2020",
      toleranceLimits: this.state.toleranceLimits,
    };

    // this.setState({
    //  qrcodeData: JSON.stringify(JSONData),

    // });
    console.log("generatedJson Data \n\n\n", JSONData);
    if (
      this.state.trim_sheet.IsFreighter == 0 &&
      this.state.trim_sheet.IsCargoOnSeatStr == false
    ) {
      JSONData["COMPWT"] = this.state.COMPWT;
      JSONData["PAXWT"] = this.state.PAXWT;
    }
    if (this.state.trim_sheet.Thrust1) {
      JSONData["THRUST"] = this.formatThrust(this.state.thrust);
      JSONData["FLAP"] = this.state.flap;
      JSONData["STAB"] = this.fixed1Number(this.state.stab);
      var thrustValuesArry = String(this.state.trim_sheet.ThrustValues).split(
        "$"
      );
      var stabValuesValuesArry = String(this.state.trim_sheet.StabValues).split(
        "$"
      );
      var flapValues = String(this.state.trim_sheet.FlapValues).split("$");
      var flapData = [];
      for (var i = 0; i < thrustValuesArry.length - 1; i++) {
        flapData.push({
          FLAP: flapValues[i],
          Thrust: thrustValuesArry[i],
          STAB: stabValuesValuesArry[i],
        });
      }
      JSONData["StabTbl"] = flapData;
    }
    var count = 0;
    var crewArray = this.state.trim_sheet.ActcrewStr.split("/");
    var crew = crewArray.map((x) => {
      var c = parseInt(x);
      count = count + c;
      return count;
    });

    var cabinArray = [];
    var cabinBagagge = 0;

    var TTL_CREW = 0;
    var TTL_SUB = 0;
    var POB = 0;
    if (
      this.state.trim_sheet["IsCargoOnSeatStr"] == true ||
      this.state.trim_sheet["IsFreighter"] == 1
    ) {
      cabinArray = this.state.trim_sheet.AdjustStrv2.split("$");
      cabinBagagge = parseInt(cabinArray[3]);
      if (isNaN(cabinBagagge)) {
        cabinBagagge = 0;
      }

      var crewSplit = this.state.trim_sheet.ActcrewStr.split("/");

      POB = parseInt(crewSplit[0]) + parseInt(crewSplit[1]);
      TTL_CREW = parseInt(crewSplit[0]);
      TTL_SUB = parseInt(crewSplit[1]);
    } else {
      cabinArray = this.state.trim_sheet.AdjustStrv2.split("$");
      cabinBagagge = parseInt(cabinArray[3]);
      if (isNaN(cabinBagagge)) {
        cabinBagagge = 0;
      }
    }
    var loadUpperdeck = [];
    var totalLoadUpperDeck = 0;
    if (this.state.trim_sheet.IsFreighter == 1) {
      var loadUpperdeckCabin = this.state.trim_sheet.PalletsStr.split("#");
      loadUpperdeckCabin.forEach((deck) => {
        var deckValues = deck.split("$");
        if (deckValues[1] == undefined) {
          return;
        }
        var load = 0;
        if (!isNaN(deckValues[6])) {
          load = parseInt(deckValues[6]);
        }

        if (isNaN(load)) {
          load = 0;
        }

        loadUpperdeck.push({
          name: deckValues[1],
          load: isNaN(load) ? 0 : load,
        });
        totalLoadUpperDeck += load;
      });
    }

    if (this.state.trim_sheet.IsCargoOnSeatStr == true) {
      var loadUpperdeckCabin = this.state.trim_sheet.CargoOnSeatStr.split("#");
      loadUpperdeckCabin.forEach((zone) => {
        var name = "";
        var load = 0;

        var zoneSplit = zone.split("*");
        zoneSplit.forEach((deck) => {
          var deckValues = deck.split("$");
          if (
            deckValues[0] == undefined ||
            String(deckValues[0]).trim().length == 0
          ) {
            return;
          }
          name = String(deckValues[0]).trim();
          var deckLoad = 0;
          if (!isNaN(deckValues[2])) {
            deckLoad = parseInt(deckValues[2]);
          }

          if (isNaN(deckLoad)) {
            deckLoad = 0;
          }
          load += deckLoad;
        });
        if (String(name).trim() == 0) {
          return;
        }
        loadUpperdeck.push({
          name: name,
          load: isNaN(load) ? 0 : load,
        });
        totalLoadUpperDeck += load;
      });
    }

    var loadUpperdeckRows = [];
    var upperDectRowItemCount = 4;
    var tempArrayForUpperDeck = [];
    for (var i = 0; i < loadUpperdeck.length; i++) {
      tempArrayForUpperDeck.push(loadUpperdeck[i]);
      if (i % upperDectRowItemCount == 3) {
        loadUpperdeckRows.push([...tempArrayForUpperDeck]);
        tempArrayForUpperDeck = [];
      }
    }
    if (tempArrayForUpperDeck.length > 0) {
      loadUpperdeckRows.push([...tempArrayForUpperDeck]);
    }
    console.log(loadUpperdeckRows, totalLoadUpperDeck, "Upper Deck");

    //Lower deck calculation for frieght aircraft
    var loadLowerdeck = [];
    var totalLoadLowerDeck = 0;
    if (
      this.state.trim_sheet.IsFreighter == 1 ||
      this.state.trim_sheet.IsCargoOnSeatStr == true
    ) {
      var loadUpperdeckCabin = this.state.trim_sheet.ActCompStr.split("$");
      loadUpperdeckCabin.forEach((deck, i) => {
        if (deck.length == 0) {
          return;
        }
        var deckValue = 0;
        if (!isNaN(deck)) {
          deckValue = parseInt(deck);
        }
        if (isNaN(deckValue)) {
          deckValue = 0;
        }
        loadLowerdeck.push({
          name: "C" + (i + 1),
          load: isNaN(deckValue) ? 0 : deckValue,
        });
        totalLoadLowerDeck += deckValue;
      });
    }

    var loadLowerdeckRows = [];
    var lowerDectRowItemCount = 5;
    var tempArrayForLowerDeck = [];
    for (var i = 0; i < loadLowerdeck.length; i++) {
      tempArrayForLowerDeck.push(loadLowerdeck[i]);
      if (i % lowerDectRowItemCount == 4) {
        loadLowerdeckRows.push([...tempArrayForLowerDeck]);
        tempArrayForLowerDeck = [];
      }
    }
    if (tempArrayForLowerDeck.length > 0) {
      loadLowerdeckRows.push([...tempArrayForLowerDeck]);
    }
    console.log(loadLowerdeckRows, totalLoadLowerDeck, "Lower Deck");

    console.log("count", count);
    var Maxcarg = this.state.trim_sheet.MaxCompartment;
    var Maxpax = this.state.trim_sheet.MaxCabin;
    var loadUpperdeckArr = [];
    var loadLowerdeckArr = [];
    var loadUpperdeckJson = {};
    var loadLowerdeckJson = {};
    if (
      this.state.trim_sheet.IsFreighter === 1 ||
      this.state.trim_sheet.IsCargoOnSeatStr === true
    ) {
      loadUpperdeckRows.forEach((row) => {
        row.forEach((item, i) => {
          loadUpperdeckJson[item.name] = item.load;
        });
      });
      loadUpperdeckArr.push(loadUpperdeckJson);
      JSONData["LOAD IN UPPER DECK"] = loadUpperdeckArr;
      loadLowerdeckRows.forEach((row) => {
        row.forEach((item, i) => {
          loadLowerdeckJson[item.name] = item.load;
        });
      });
      loadLowerdeckArr.push(loadLowerdeckJson);
      JSONData["LOAD IN LOWER DECK"] = loadLowerdeckArr;
      JSONData["TTLLOADUPPERDECK"] = this.state.totalLoadUpperDeck;
      JSONData["TTLLOADLOWERDECK"] = this.state.totalLoadLowerDeck;
      JSONData["TTLDEADLOADONFLT"] =
        this.state.totalLoadUpperDeck + this.state.totalLoadLowerDeck;
      JSONData["TTL_CREW"] = TTL_CREW;
      JSONData["TTL_SUB"] = TTL_SUB;
      JSONData["POB"] = POB;
    } else {
      var cmptData = [];
      if (Maxcarg >= 1) {
        cmptData.push({ 1: this.state.trim_sheet.cmpt1 });
      }
      if (Maxcarg >= 2) {
        cmptData.push({ 2: this.state.trim_sheet.cmpt2 });
      }
      if (Maxcarg >= 3) {
        cmptData.push({ 3: this.state.trim_sheet.cmpt3 });
      }
      if (Maxcarg >= 4) {
        cmptData.push({ 4: this.state.trim_sheet.cmpt4 });
      }
      JSONData["LOAD IN CPTS"] = cmptData;
      var zoneData = [];
      zoneData.push({
        ZONE1:
          this.state.trim_sheet.C1Adult +
          this.state.trim_sheet.C1Child +
          parseInt(this.state.trim_sheet.AdjustStrv2.split("$")[13]),
      });
      zoneData.push({
        ZONE2:
          this.state.trim_sheet.C2Adult +
          this.state.trim_sheet.C2Child +
          parseInt(this.state.trim_sheet.AdjustStrv2.split("$")[14]),
      });
      zoneData.push({
        ZONE3:
          this.state.trim_sheet.C3Adult +
          this.state.trim_sheet.C3Child +
          parseInt(this.state.trim_sheet.AdjustStrv2.split("$")[15]),
      });
      if (Maxpax >= 4) {
        zoneData.push({
          ZONE4: parseInt(
            this.state.trim_sheet.C4Adult + this.state.trim_sheet.C4Child
          ),
        });
        if (Maxpax >= 5) {
          zoneData.push({
            ZONE5: parseInt(
              this.state.trim_sheet.C5Adult + this.state.trim_sheet.C5Child
            ),
          });
        }
        if (Maxpax >= 6) {
          zoneData.push({
            ZONE6: parseInt(
              this.state.trim_sheet.C6Adult + this.state.trim_sheet.C6Child
            ),
          });
        }
        if (Maxpax >= 7) {
          zoneData.push({
            ZONE7: parseInt(
              this.state.trim_sheet.C7Adult + this.state.trim_sheet.C7Child
            ),
          });
        }
        if (Maxpax >= 8) {
          zoneData.push({
            ZONE8: parseInt(
              this.state.trim_sheet.C8Adult + this.state.trim_sheet.C8Child
            ),
          });
        }
      }
      JSONData["ZONE"] = zoneData;
      JSONData["PAX"] =
        this.state.totalAdult +
        "/" +
        this.state.totalChild +
        "/" +
        this.state.totalInfant;
      JSONData["TTL"] =
        this.state.totalAdult + this.state.totalChild + this.state.totalInfant;
      JSONData["POB"] =
        this.state.totalAdult +
        this.state.totalChild +
        this.state.totalInfant +
        this.state.crew;
    }
    console.log(
      "generatedJson Final Data to display in the web app ",
      JSONData
    );

    this.setState({
      qrcodeData: JSON.stringify(JSONData),
    });
    console.log("FINAL DATA NEEDED", this.state);
    // console.log("FINAL DATA NEEDED",this.state)
  }

  displayQrCodeFn = () => {
    this.setState({
      displayQrCode: true,
    });

    console.log("QRCode Data \n ", this.state.qrcodeData);
  };

  onAccept = () => {
    console.log("successfull");
    //this.generateJson();
    // this.props.history.push('/scanner')
    this.props.history.push({
      pathname: "http://localhost:3000/scanner",
      state: {
        // hist: this.props.history,
        onScan: async (data) => {
          const empId = data
            .split("Emp. Code")[1]
            .split("Location")[0]
            .replace(":", "")
            ?.trim();
          const name = data
            .split("Name")[1]
            .split("Designation")[0]
            .replace(":", "")
            ?.trim();
          localStorage.setItem("name", name);
          var CaptEmpId = "DEFAULT";
          if (empId && empId) {
            CaptEmpId = empId;
          }
          localStorage.setItem("CaptEmpId", CaptEmpId);
          console.log("CaptEmpId ", CaptEmpId);
          this.setState({ isScan: true });
          var postData = {
            Flight_Date: this.props.match.params.flight_date,
            Flight_no: this.props.match.params.flight_no,
            source: this.props.match.params.source,
            Destination: this.props.match.params.destination,
            CaptEmpId: CaptEmpId,
            CAPTAIN: name,
          };
          console.log("postData for updating CaptEmpId ", CaptEmpId);
          UpdateCaptEmpId(postData);
        },
      },
    });
  };

  onSuccess = (result) => {
    console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
    console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
  };

  onError = (msg) => {
    console.log("Sharing failed with message: " + msg);
    alert("Sharing failed with message:" + msg);
  };

  onShare = () => {
    const [fix, name] = get(this.state, "trim_sheet.Flight_no", "").split("SG");
    const dest = get(this.state, "trim_sheet.Destination", "");
    const source = get(this.state, "trim_sheet.Source", "");
    const date = new Date(get(this.state, "trim_sheet.Flight_Date", ""));
    const fileName = `${name}${source}${dest}${moment(date).format(
      "DDMMMYYYY"
    )}.pdf`;
    var folderpath = `${window.cordova.file.externalRootDirectory}SALTArchive/${fileName}`;
    const options = {
      message: "share this", // not supported on some apps (Facebook, Instagram)
      // subject: 'the subject', // fi. for email
      files: [folderpath], // an array of filenames either locally or remotely
      // url: 'https://www.website.com/foo/#bar?a=b',
      chooserTitle: "Pick an app", // Android only, you can override the default share sheet title
      // iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
    };
    window.plugins.socialsharing.shareWithOptions(
      options,
      this.onSuccess,
      this.onError
    );
  };
  close() {
    console.log("needed data1", this.state.Dialogopen);
    this.setState({
      Dialogopen: false,
    });
    console.log("needed data", this.state.Dialogopen);
  }
  open() {
    console.log("needed data1", this.state.Dialogopen);
    this.setState({
      Dialogopen: true,
    });
    console.log("needed data1", this.state.Dialogopen);
  }
  componentWillUnmount() {
    localStorage.removeItem("name");
  }

  render() {
    var classes = this.props;
    console.log(classes);
    var flightNo = this.props.match.params.flight_no;
    var flightDate = this.props.match.params.flight_date;
    var source = this.props.match.params.source;
    var destination = this.props.match.params.destination;
    var status = this.props.match.params.status;

    var theme = window.localStorage.getItem("app_theme");
    const disableAccept = window.location.href.includes("past");
    // console.log("appbar trimshett",document.getElementsByClassName("trimsheetContainer"))
    // console.log("appbar trimshett",document.getElementById("trimsheetDisplay"))
    // style={{zoom:this.state.zoom}}

    const printIcon = `${
      theme === "dark" ? classes.printIconDark : classes.printIconLight
    }`;
    const addText = `${theme === "dark" ? classes.addLight : classes.addLight}`;
    const plusIcon = `${
      theme === "dark" ? classes.plusIconDark : classes.plusIconLight
    }`;
    const minusIcon = `${
      theme === "dark" ? classes.minusIconDark : classes.minusIconLight
    }`;
    const lmcIcon = `${
      theme === "dark" ? classes.lmcIconDark : classes.lmcIconLight
    }`;
    const zoomTypo = `${
      theme === "dark" ? classes.zoomTypoDark : classes.zoomTypoLight
    }`;

    return (
      <div id="trimsheetDisplay" style={{ padding: "10px",}}>
        <React.Fragment>
          <div
            className={classes.trim_container}
            style={{ zoom: this.state.zoom + "%" }}
          >
            {this.state.trim_sheet !== null &&
              this.state.trim_sheet.Acft_Type !== "Q400" &&
              this.state.hideTrimsheet === false && (
                <div className={classes.formField}>
                  {((this.state.trim_sheet.Thrust1 !== undefined &&
                    this.state.trim_sheet.Thrust1 !== null &&
                    this.state.trim_sheet.Thrust1 !== 0) ||
                    (this.state.trim_sheet.Thrust2 !== undefined &&
                      this.state.trim_sheet.Thrust2 !== null &&
                      this.state.trim_sheet.Thrust2 !== 0) ||
                    (this.state.trim_sheet.Thrust3 !== undefined &&
                      this.state.trim_sheet.Thrust3 !== null &&
                      this.state.trim_sheet.Thrust3 !== 0) ||
                    (this.state.trim_sheet.Thrust4 !== undefined &&
                      this.state.trim_sheet.Thrust4 !== null &&
                      this.state.trim_sheet.Thrust4 !== 0)) && (
                    <Grid container style={{ paddingBottom: "15px" }}>
                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        className={classes.gridItem}
                      >
                        <Typography className={classes.label} variant={"body1"}>
                          Thrust1
                        </Typography>
                        <FormControl
                          className={classes.dropdown}
                          style={{ width: "100%", padding: "5px" }}
                        >
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
                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        className={classes.gridItem}
                      >
                        <Typography className={classes.label} variant={"body1"}>
                          Flap
                        </Typography>
                        <FormControl
                          className={classes.dropdown}
                          style={{ width: "100%", padding: "5px" }}
                        >
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
                            {this.state.trim_sheet.Thrust1 ===
                              this.state.thrust &&
                              this.state.trim_sheet.T1Flap1 !== undefined &&
                              this.state.trim_sheet.T1Flap1 !== null &&
                              this.state.trim_sheet.T1Flap1.length > 0 && (
                                <MenuItem value={this.state.trim_sheet.T1Flap1}>
                                  {this.state.trim_sheet.T1Flap1}
                                </MenuItem>
                              )}
                            {this.state.trim_sheet.Thrust1 ===
                              this.state.thrust &&
                              this.state.trim_sheet.T1Flap2 !== undefined &&
                              this.state.trim_sheet.T1Flap2 !== null &&
                              this.state.trim_sheet.T1Flap2.length > 0 && (
                                <MenuItem value={this.state.trim_sheet.T1Flap2}>
                                  {this.state.trim_sheet.T1Flap2}
                                </MenuItem>
                              )}
                            {this.state.trim_sheet.Thrust2 ===
                              this.state.thrust &&
                              this.state.trim_sheet.T2Flap1 !== undefined &&
                              this.state.trim_sheet.T2Flap1 !== null &&
                              this.state.trim_sheet.T2Flap1.length > 0 && (
                                <MenuItem value={this.state.trim_sheet.T2Flap1}>
                                  {this.state.trim_sheet.T2Flap1}
                                </MenuItem>
                              )}
                            {this.state.trim_sheet.Thrust2 ===
                              this.state.thrust &&
                              this.state.trim_sheet.T2Flap2 !== undefined &&
                              this.state.trim_sheet.T2Flap2 !== null &&
                              this.state.trim_sheet.T2Flap2.length > 0 && (
                                <MenuItem value={this.state.trim_sheet.T2Flap2}>
                                  {this.state.trim_sheet.T2Flap2}
                                </MenuItem>
                              )}
                            {this.state.trim_sheet.Thrust3 ===
                              this.state.thrust &&
                              this.state.trim_sheet.T3Flap1 !== undefined &&
                              this.state.trim_sheet.T3Flap1 !== null &&
                              this.state.trim_sheet.T3Flap1.length > 0 && (
                                <MenuItem value={this.state.trim_sheet.T3Flap1}>
                                  {this.state.trim_sheet.T3Flap1}
                                </MenuItem>
                              )}
                            {this.state.trim_sheet.Thrust3 ===
                              this.state.thrust &&
                              this.state.trim_sheet.T3Flap2 !== undefined &&
                              this.state.trim_sheet.T3Flap2 !== null &&
                              this.state.trim_sheet.T3Flap2.length > 0 && (
                                <MenuItem value={this.state.trim_sheet.T3Flap2}>
                                  {this.state.trim_sheet.T3Flap2}
                                </MenuItem>
                              )}
                            {this.state.trim_sheet.Thrust4 ===
                              this.state.thrust &&
                              this.state.trim_sheet.T4Flap1 !== undefined &&
                              this.state.trim_sheet.T4Flap1 !== null &&
                              this.state.trim_sheet.T4Flap1.length > 0 && (
                                <MenuItem value={this.state.trim_sheet.T4Flap1}>
                                  {this.state.trim_sheet.T4Flap1}
                                </MenuItem>
                              )}
                            {this.state.trim_sheet.Thrust4 ===
                              this.state.thrust &&
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
                  )}
                </div>
              )}
            {this.state.in_prog && this.props.sync.ramp_sync && (
              <div className={classes.progress}>
                <Typography variant={"h6"} className={classes.error}>
                  Loading ....{" "}
                </Typography>
              </div>
            )}
            {this.props.sync.ramp_sync && (
              <div className={classes.progress}>
                <Typography variant={"h6"} className={classes.error}>
                  Loading .....{" "}
                </Typography>
              </div>
            )}
            {this.state.in_prog === false &&
              this.props.sync.ramp_sync === false &&
              this.state.error === true && (
                <div className={classes.error}>
                  <Typography
                    variant={"h6"}
                    className={classes.error}
                    style={{ textAlign: "center" }}
                  >
                    Trim Sheet Cannot Be Drawn at This Moment
                  </Typography>
                  {/* <Button variant={"contained"} color={"primary"} fullWidth>Refresh</Button> */}
                </div>
              )}
            {this.state.hideTrimsheet === true &&
              this.state.error === false &&
              this.state.in_prog === false &&
              this.props.sync.ramp_sync === false && (
                <div className={classes.error} style={{ alignItems: "center" }}>
                  <Typography variant={"h6"} className={classes.error}>
                    Load & Trim Sheet being edited, Please wait or contact Load
                    Control
                  </Typography>
                </div>
              )}
            {
            this.state.in_prog === false &&
              this.props.sync.ramp_sync === false &&
              this.state.error === false &&
              this.state.hideTrimsheet === false && (
                <div className={"trimsheet"} id="trimsheet">
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
                  {this.state.trim_sheet !== null &&
                    this.state.hideTrimsheet === false && (
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
                              style={{
                                fontSize: "medium",
                                letterSpacing: "0.1em",
                              }}
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
                            {this.state.trim_sheet.AppType !== null && (
                              <td
                                colspan="1"
                                style={{ textAlign: "center" }}
                                width="25%"
                              >
                                <span
                                  id="MainContent_lblEdNo"
                                  style={{ fontWeight: "normal" }}
                                >
                                  ED-M0{this.state.trim_sheet.EDNO}
                                </span>
                              </td>
                            )}
                            {this.state.trim_sheet.AppType == null && (
                              <td
                                colspan="1"
                                style={{ textAlign: "center" }}
                                width="25%"
                              >
                                <span
                                  id="MainContent_lblEdNo"
                                  style={{ fontWeight: "normal" }}
                                >
                                  ED-0{this.state.trim_sheet.EDNO}
                                </span>
                              </td>
                            )}
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
                              {this.state.trim_sheet.IsFreighter == 0 &&
                                this.state.trim_sheet.IsCargoOnSeatStr == 0 && (
                                  <span
                                    id="MainContent_lblAcft_Tpe"
                                    style={{
                                      fontWeight: "normal",
                                      textAlign: "center",
                                    }}
                                  >
                                    {this.state.trim_sheet.Acft_Type +
                                      "/" +
                                      this.state.CONFIG}
                                  </span>
                                )}
                              {this.state.trim_sheet.IsFreighter == 0 &&
                                this.state.trim_sheet.IsCargoOnSeatStr == 1 && (
                                  <span
                                    id="MainContent_lblAcft_Tpe"
                                    style={{
                                      fontWeight: "normal",
                                      textAlign: "center",
                                    }}
                                  >
                                    {this.state.trim_sheet.Acft_Type +
                                      "/" +
                                      this.state.CONFIG}
                                  </span>
                                )}
                              {this.state.trim_sheet.IsFreighter == 1 && (
                                <span
                                  id="MainContent_lblAcft_Tpe"
                                  style={{
                                    fontWeight: "normal",
                                    textAlign: "center",
                                  }}
                                >
                                  {this.state.trim_sheet.Acft_Type +
                                    this.state.CONFIG}
                                </span>
                              )}
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
                              style={{ textAlign: "center" }}
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
                              {this.state.totalLoad} &nbsp; &nbsp;
                            </span>
                          </td>
                          {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
                          <td colspan="1" width="50%">
                            &nbsp;{" "}
                          </td>
                        </tr>
                        {this.state.trim_sheet.IsFreighter == 0 &&
                          this.state.trim_sheet.IsCargoOnSeatStr == false && (
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
                                  {this.state.COMPWT} &nbsp; &nbsp;
                                </span>
                              </td>
                              {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
                              <td colspan="1" width="50%">
                                &nbsp;{" "}
                              </td>
                            </tr>
                          )}
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
                              {this.state.CABBGWT} &nbsp; &nbsp;
                            </span>
                          </td>
                          {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
                          <td colspan="1" width="50%">
                            &nbsp;{" "}
                          </td>
                        </tr>

                        {this.state.trim_sheet.IsFreighter == 0 &&
                          this.state.trim_sheet.IsCargoOnSeatStr == false && (
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
                                  {this.state.PAXWT} &nbsp; &nbsp;
                                </span>
                              </td>
                              {/* <td colspan="2" style={{textAlign:"right"}}><span id="MainContent_totalLoad">{this.state.totalLoad}</span> </td> */}
                              <td colspan="1" width="50%">
                                &nbsp;{" "}
                              </td>
                            </tr>
                          )}

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
                                &nbsp;{this.state.trim_sheet.MZFW}&nbsp;&nbsp;
                              </span>
                            </td>
                          )}
                          {this.state.lim1 == true && (
                            <td
                              colspan="1"
                              width="50%"
                              style={{ generateJsotextAlign: "left" }}
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
                              {this.state.trim_sheet.FOB} &nbsp; &nbsp;
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
                                &nbsp; {this.state.trim_sheet.MTOW}&nbsp;&nbsp;
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
                              {this.state.trim_sheet.TRIP_FUEL} &nbsp; &nbsp;
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
                                &nbsp;{this.state.trim_sheet.MLW}&nbsp;&nbsp;
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
                                &nbsp;{this.state.trim_sheet.MLW + " L"}
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
                          <td
                            colspan="1"
                            width="25%"
                            style={{ textAlign: "left" }}
                          >
                            <b>DOI</b>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span id="MainContent_lblflightDOI">
                              {this.fixedNumber(
                                this.state.trim_sheet.OEW_Index
                              )}
                            </span>{" "}
                          </td>
                          <td
                            colspan="1"
                            width="25%"
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
                          <td
                            colspan="1"
                            width="25%"
                            style={{ textAlign: "left" }}
                          >
                            <b>LIZFW</b> &nbsp; &nbsp;&nbsp;
                            <span id="MainContent_lblflightLIZFWindex">
                              {this.fixedNumber(this.state.trim_sheet.ZFWindex)}
                            </span>{" "}
                          </td>
                          {/* {this.state.trim_sheet != null && this.state.trim_sheet.IsFreighter == 0 && <td colspan="1" width="25%" style={{ textAlign: "left" }}><b>ZFMAC</b> &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span  id="MainContent_lblflightZFMAC" >{this.fixedNumber(this.state.trim_sheet.ZFWMAC)}</span> </td>} */}
                        </tr>

                        <tr>
                          <td
                            colspan="1"
                            width="25%"
                            style={{ textAlign: "left" }}
                          >
                            <b>LITOW</b> &nbsp; &nbsp;
                            <span id="MainContent_lblflightTOWindex">
                              {this.fixedNumber(this.state.trim_sheet.TOWindex)}
                            </span>{" "}
                          </td>
                          {/* {this.state.trim_sheet != null && this.state.trim_sheet.IsFreighter == 0 && <td colspan="1" width="25%" style={{ textAlign: "left" }}><b>TOWMAC</b> &nbsp; &nbsp;
                    <span  id="MainContent_lblflightTOWMAC" >{this.fixedNumber(this.state.trim_sheet.TOWMAC)}</span> </td>} */}
                        </tr>

                        <tr>
                          <td
                            colspan="1"
                            width="25%"
                            style={{ textAlign: "left" }}
                          >
                            <b>LILW</b> &nbsp; &nbsp; &nbsp;&nbsp;
                            <span id="MainContent_lblflightLWindex">
                              {this.fixedNumber(this.state.trim_sheet.LWindex)}
                            </span>{" "}
                          </td>
                          {/* {this.state.trim_sheet != null && this.state.trim_sheet.IsFreighter == 0 && <td colspan="1" width="25%" style={{ textAlign: "left" }}><b>LWMAC</b> &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                    <span id="MainContent_lblflightLWMAC" >{this.fixedNumber(this.state.trim_sheet.LWMAC)}</span> </td>} */}
                        </tr>

                        {/* <tr>
                  <td colspan="1" width="30%" style={{ textAlign: "left" }}><b>LIZFW</b>
                    <span style={{ float: 'right' }} id="MainContent_lblflightLIZFWindex" >{this.fixedNumber(this.state.trim_sheet.ZFWindex)}</span> </td>
                  <td colspan="1" width="40%" style={{ textAlign: "left" }}><b>LITOW</b>
                    <span style={{ float: 'right' }} id="MainContent_lblflightTOWindex" >{this.fixedNumber(this.state.trim_sheet.TOWindex)}</span> </td>
                  <td colspan="1" width="30%" style={{ textAlign: "left" }}><b>LILW</b>
                    <span style={{ float: 'right' }} id="MainContent_lblflightLWindex" >{this.fixedNumber(this.state.trim_sheet.LWindex)}</span> </td>
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
                      </tbody>
                    </table>
                  )}
                  {/* {this.state.trim_sheet != null &&
            <table id="MainContent_Table3" className={classes.trimsheet_papper1} bgcolor="white" cellpadding="2" cellspacing="2" border="0" width="100%" style={{ color: "#000" }}>
              <tbody>
                <tr>
                  <td colspan="1" width="30%" style={{ textAlign: "left" }}><b>ZFMAC</b>
                    <span style={{ float: 'right' }} id="MainContent_lblflightZFMAC" >{this.fixedNumber(this.state.trim_sheet.ZFWMAC)}</span> </td>
                  <td colspan="1" width="40%" style={{ textAlign: "left" }}><b>TOWMAC</b>
                    <span style={{ float: 'right' }} id="MainContent_lblflightTOWMAC" >{this.fixedNumber(this.state.trim_sheet.TOWMAC)}</span> </td>
                  <td colspan="1" width="30%" style={{ textAlign: "left" }}><b>LWMAC</b>
                    <span style={{ float: 'right' }} id="MainContent_lblflightLWMAC" >{this.fixedNumber(this.state.trim_sheet.LWMAC)}</span> </td>
                </tr> */}
                  {/* <tr>
                      <td width="10px">&nbsp;</td>
                      <td colspan="1"><b>ZFMAC</b></td>
                      <td colspan="1"><span id="MainContent_lblflightZFMAC" style={{fontWeight: "normal"}}>{this.state.trim_sheet.ZFWMAC }</span></td>
                      <td colspan="1"><b>TOWMAC</b></td>
                      <td colspan="1"><span id="MainContent_lblflightTOWMAC" style={{fontWeight: "normal"}}>{this.state.trim_sheet.TOWMAC}</span></td>
                      <td colspan="1"><b>LWMAC</b></td>
                      <td colspan="1"><span id="MainContent_lblflightLWMAC" style={{fontWeight: "normal"}}>{this.state.trim_sheet.LWMAC}</span></td>
                    </tr> */}
                  {/* </tbody>
            </table>} */}
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
                              {this.fixedNumber(
                                this.state.trim_sheet.ZFWMACFWD
                              )}
                            </td>
                            <td
                              colspan="1"
                              width="33.33%"
                              style={{ textAlign: "center" }}
                            >
                              {this.fixedNumber(this.state.trim_sheet.ZFWMAC)}
                            </td>
                            <td
                              colspan="1"
                              width="33.33%"
                              style={{ textAlign: "center" }}
                            >
                              {this.fixedNumber(
                                this.state.trim_sheet.ZFWMACAFT
                              )}
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
                              {this.fixedNumber(
                                this.state.trim_sheet.TOWMACFWD
                              )}
                            </td>
                            <td
                              colspan="1"
                              width="33.33%"
                              style={{ textAlign: "center" }}
                            >
                              {this.fixedNumber(this.state.trim_sheet.TOWMAC)}
                            </td>
                            <td
                              colspan="1"
                              width="33.33%"
                              style={{ textAlign: "center" }}
                            >
                              {this.fixedNumber(
                                this.state.trim_sheet.TOWMACAFT
                              )}
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
                              {this.fixedNumber(this.state.trim_sheet.LWMAC)}
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
                        {this.state.trim_sheet.Acft_Type !== "Q400" &&
                          this.state.trust !== 0 &&
                          ((this.state.trim_sheet.Thrust1 !== undefined &&
                            this.state.trim_sheet.Thrust1 !== null &&
                            this.state.trim_sheet.Thrust1 !== 0) ||
                            (this.state.trim_sheet.Thrust2 !== undefined &&
                              this.state.trim_sheet.Thrust2 !== null &&
                              this.state.trim_sheet.Thrust2 !== 0) ||
                            (this.state.trim_sheet.Thrust3 !== undefined &&
                              this.state.trim_sheet.Thrust3 !== null &&
                              this.state.trim_sheet.Thrust3 !== 0) ||
                            (this.state.trim_sheet.Thrust4 !== undefined &&
                              this.state.trim_sheet.Thrust4 !== null &&
                              this.state.trim_sheet.Thrust4 !== 0)) && (
                            <tr>
                              <td colspan="1" width="30%">
                                <span
                                  id="MainContent_lblThrust1"
                                  style={{ fontWeight: "normal" }}
                                >
                                  <b>
                                    THRUST{" "}
                                    {this.formatThrust(this.state.thrust)}
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
                                  <b>STAB</b>{" "}
                                  {this.fixed1Number(this.state.stab)}
                                </span>
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  )}
                  {this.state.trim_sheet != null &&
                    this.state.trim_sheet.IsFreighter == 0 &&
                    this.state.trim_sheet.IsCargoOnSeatStr == false && (
                      <React.Fragment>
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
                                        parseInt(
                                          this.state.trim_sheet.AdjustStrv2.split(
                                            "$"
                                          )[13]
                                        )}
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
                                        parseInt(
                                          this.state.trim_sheet.AdjustStrv2.split(
                                            "$"
                                          )[14]
                                        )}
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
                                        parseInt(
                                          this.state.trim_sheet.AdjustStrv2.split(
                                            "$"
                                          )[15]
                                        )}
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
                              {this.state.Maxpax <= 8 &&
                                this.state.Maxpax >= 7 && (
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
                            </tbody>
                          </table>
                        )}
                      </React.Fragment>
                    )}
                  {this.state.trim_sheet != null &&
                    this.state.trim_sheet.IsFreighter == 1 && (
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
                                width="100%"
                                style={{ textAlign: "left" }}
                              >
                                <b>LOAD IN UPPER DECK &nbsp;</b>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
                            {this.state.loadUpperdeckRows.map((item, i) => {
                              return (
                                <tr>
                                  {item.map((p) => {
                                    return (
                                      <td
                                        colspan="1"
                                        width="25%"
                                        style={{ textAlign: "left" }}
                                      >
                                        <b>{p.name}/</b>
                                        {p.load}
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
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
                                width="100%"
                                style={{ textAlign: "left" }}
                              >
                                <b>LOAD IN LOWER DECK &nbsp;</b>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
                            {this.state.loadLowerdeckRows.map((item, i) => {
                              return (
                                <tr>
                                  {item.map((p) => {
                                    return (
                                      <td
                                        colspan="1"
                                        width="20%"
                                        style={{ textAlign: "left" }}
                                      >
                                        <b>{p.name}/</b>
                                        {p.load}
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
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
                                width="100%"
                                style={{ textAlign: "left" }}
                              >
                                <b>TTL LOAD UPPER DECK &nbsp;</b>
                                {this.state.totalLoadUpperDeck}
                              </td>
                            </tr>
                            <tr>
                              <td
                                colspan="1"
                                width="100%"
                                style={{ textAlign: "left" }}
                              >
                                <b>TTL LOAD LOWER DECK &nbsp;</b>
                                {this.state.totalLoadLowerDeck}
                              </td>
                            </tr>
                            <tr>
                              <td
                                colspan="1"
                                width="100%"
                                style={{ textAlign: "left" }}
                              >
                                <b>TTL DEADLOAD ON FLT &nbsp;</b>
                                {this.state.totalLoadUpperDeck +
                                  this.state.totalLoadLowerDeck}
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
                                style={{ textAlign: "left" }}
                              >
                                <b>TTL CREW &nbsp;</b>
                                <span id="MainContent_lblflightpax">
                                  {this.state.TTL_CREW}
                                </span>
                              </td>
                              <td
                                colspan="1"
                                width="33.33%"
                                style={{ textAlign: "left" }}
                              >
                                <b>TTL SUP &nbsp;</b>
                                <span id="MainContent_lblflightpax">
                                  {this.state.TTL_SUB}
                                </span>
                              </td>
                              <td
                                colspan="1"
                                width="33.33%"
                                style={{ textAlign: "left" }}
                              >
                                <b>POB &nbsp;</b>
                                <span id="MainContent_lblflightpax">
                                  {this.state.POB}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </React.Fragment>
                    )}
                  {this.state.trim_sheet != null &&
                    this.state.trim_sheet.IsCargoOnSeatStr == true && (
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
                                width="100%"
                                style={{ textAlign: "left" }}
                              >
                                <b>LOAD IN UPPER DECK &nbsp;</b>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
                            {this.state.loadUpperdeckRows.map((item, i) => {
                              return (
                                <tr>
                                  {item.map((p) => {
                                    return (
                                      <td
                                        colspan="1"
                                        width="25%"
                                        style={{ textAlign: "left" }}
                                      >
                                        <b>{p.name}/</b>
                                        {p.load}
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
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
                                width="100%"
                                style={{ textAlign: "left" }}
                              >
                                <b>LOAD IN LOWER DECK &nbsp;</b>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
                            {this.state.loadLowerdeckRows.map((item, i) => {
                              return (
                                <tr>
                                  {item.map((p) => {
                                    return (
                                      <td
                                        colspan="1"
                                        width="20%"
                                        style={{ textAlign: "left" }}
                                      >
                                        <b>{p.name}/</b>
                                        {p.load}
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
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
                                width="100%"
                                style={{ textAlign: "left" }}
                              >
                                <b>TTL LOAD UPPER DECK &nbsp;</b>
                                {this.state.totalLoadUpperDeck}
                              </td>
                            </tr>
                            <tr>
                              <td
                                colspan="1"
                                width="100%"
                                style={{ textAlign: "left" }}
                              >
                                <b>TTL LOAD LOWER DECK &nbsp;</b>
                                {this.state.totalLoadLowerDeck}
                              </td>
                            </tr>
                            <tr>
                              <td
                                colspan="1"
                                width="100%"
                                style={{ textAlign: "left" }}
                              >
                                <b>TTL DEADLOAD ON FLT &nbsp;</b>
                                {this.state.totalLoadUpperDeck +
                                  this.state.totalLoadLowerDeck}
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
                                style={{ textAlign: "left" }}
                              >
                                <b>TTL CREW &nbsp;</b>
                                <span id="MainContent_lblflightpax">
                                  {this.state.TTL_CREW}
                                </span>
                              </td>
                              <td
                                colspan="1"
                                width="33.33%"
                                style={{ textAlign: "left" }}
                              >
                                <b>TTL SUP &nbsp;</b>
                                <span id="MainContent_lblflightpax">
                                  {this.state.TTL_SUB}
                                </span>
                              </td>
                              <td
                                colspan="1"
                                width="33.33%"
                                style={{ textAlign: "left" }}
                              >
                                <b>POB &nbsp;</b>
                                <span id="MainContent_lblflightpax">
                                  {this.state.POB}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
                        {/* <tr> */}
                        {/* </tr>
                <tr> */}
                        <tr colspan="1" style={{ textAlign: "left" }}>
                          <span id="MainContent_lblflightLoadOfficier">
                            {" "}
                            {this.state.trim_sheet.Load_Officer}&nbsp;
                          </span>
                        </tr>
                        <tr colspan="1" style={{ textAlign: "left" }}>
                          <b>CAPTAIN / ATPL No.</b>
                        </tr>
                        <tr colspan="1" style={{ textAlign: "left" }}>
                          <span id="MainContent_lblflightCaptain">
                            {" "}
                            {localStorage.getItem("name") ||
                              this.state.trim_sheet.CAPTAIN}
                            &nbsp;
                          </span>
                        </tr>
                        {/* </tr> */}
                        <tr>
                          <td colspan="6" width="100%">
                            {" "}
                            APPROVED LMC LIMITS: {this.state.toleranceLimits}
                          </td>
                        </tr>
                        <tr>
                          <td colspan="6" width="100%">
                            {" "}
                            AUTOMATED LOAD & TRIM SHEET APPROVED BY DELHI DAW
                            VIDE LETTER NO. DEL-11011(13)/9/2019-DAW-NR/1348
                            DATED 30-12-2020
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                 
                </div>
              )}
          </div>
         
        </React.Fragment>
        <div
                    style={{  display: "flex",position:'fixed'
                    ,bottom:"0px",alignItems:"center",justifyContent:"space-around",width:'100%',padding:'10px'}}
                  >
                    {this.state.trim_sheet != null && (
                      <React.Fragment>
                        {!this.state.isDownloading && (
                          <Fab
                             id="printButton"
                            disabled={this.state.is_printing}
                            variant="extended"
                            style={{width:'100px',color:'black',fontSize:'16px',backgroundColor:"#e3dddd"}}
                            className={printIcon}
                            onClick={() => {
                              this.setState({ is_printing: true });
                              let ts = this.state.trim_sheet;
                              ts.CAPTAIN =
                                localStorage.getItem("name") ||
                                this.state.trim_sheet.CAPTAIN;
                              printtrimSheet(
                                ts,
                                this.state.thrust,
                                this.state.flap,
                                this.state.stab
                              ).then(() => {
                                console.log('printing success')
                                this.setState({ is_printing: false });
                              });
                            }}
                          >
                            <PrintIcon 
                            // style={{ marginRight: "10px" }} 
                            className={classes.extendedIcon}
                            />
                            {this.state.is_printing ? "Printing" : "Print"}
                          </Fab>
                        )}
                        {!this.state.isDownloading && (
                          <Fab
                          
                            variant="extended"
                            // className={
                            //   disableAccept ? classes.addDisbaled : addText
                            // }
                            style={{ backgroundColor:"#1f2e34" ,color:'white',width:'100px',fontSize:'16px'}}
                            onClick={() =>
                              this.state.sharebutton == true
                                ? this.open()
                                : // (

                                  // this.props.history.push({
                                  //   pathname: "/popup",
                                  //   state: {
                                  //     dataneeded: this.state.qrcodeData
                                  //   },

                                  // })
                                  // )
                                  this.props.history.push({
                                    pathname: "/scanner",
                                    state: {
                                      flightDate,
                                      flightNo,
                                      status,
                                      source,
                                      destination,
                                    },
                                  })
                            }
                            // disabled={
                            //   this.state.trim_sheet.IsFreighter === 1 ||
                            //   this.state.trim_sheet.IsCargoOnSeatStr === true ||
                            //   (this.state.trim_sheet.IsFreighter === 0 &&
                            //     this.state.trim_sheet.IsCargoOnSeatStr ===
                            //       false &&
                            //     !this.state.hideLmc &&
                            //     this.state.is_lmc)
                            //     ? false
                            //     : true
                            // }
                          >
                            {/* > */}
                            {this.state.sharebutton ? "Share" : "Accept"}
                          </Fab>
                        )}

                        {!this.state.trimAccepted && (
                          <Fab
                            variant="extended"
                            id="lmcButton"
                            style={{ backgroundColor:"#e3dddd",color:'black',width:'100px',fontSize:'16px',marginRight:'10px' }}
                            className={ 
                              this.state.trim_sheet.IsFreighter === 1 &&
                              this.state.trim_sheet.IsCargoOnSeatStr ===
                                false &&
                              !this.state.hideLmc &&
                              this.state.is_lmc
                                ? lmcIcon
                                : classes.lmcDisabled
                            }
                            // style={{ backgroundColor:'blue'}}
                            onClick={() => {
                              //  this.cordovaPdfDownload()
                              this.props.history.push(
                                "/app/lmc/" +
                                  this.props.match.params.flight_no +
                                  "/" +
                                  this.props.match.params.flight_date +
                                  "/" +
                                  this.state.trim_sheet.Acft_Regn +
                                  "/" +
                                  this.props.match.params.status +
                                  "/" +
                                  this.props.match.params.source +
                                  "/" +
                                  this.props.match.params.destination
                              );
                            }}
                            disabled={
                              this.state.trim_sheet.IsFreighter === 1 ||
                              this.state.trim_sheet.IsCargoOnSeatStr === true ||
                              (this.state.trim_sheet.IsFreighter === 0 &&
                                this.state.trim_sheet.IsCargoOnSeatStr ===
                                  false &&
                                !this.state.hideLmc &&
                                this.state.is_lmc)
                                ? false
                                : true
                            }
                          >
                            lmc
                          </Fab>
                        )}
                      </React.Fragment>
                    )}
                  </div>
        <Dialog
          open={this.state.Dialogopen}
          aria-labelledby="form-dialog-title"
          onClose={this.props.Dialogopen}
        >
          <DialogTitle style={{ color: "white" }}>
            Trimsheet QR Display
          </DialogTitle>
          <DialogContent>
            <Grid container className={classes.gridContainer}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <QRCode
                  value={this.state.qrcodeData}
                  renderAs="canvas"
                  size={200}
                  includeMargin={true}
                />
              </div>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => this.close()}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* }     */}
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
      marginTop: "10px",
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
    printIconDark: {
      position: "fixed",
      bottom: theme.spacing(4),
      left: "10px",
      // margin : "0 auto",
      width: "95px",
      [breakpoints.up("sm")]: {
        left: "23%",
        width: "95px",
      },
      [breakpoints.up("md")]: {
        width: "95px",
        left: "32%",
      },
    },
    printIconLight: {
      position: "fixed",
      bottom: theme.spacing(4),
      left: "10px",
      // margin : "0 auto",
      width: "95px",
      color: "#ffffff",
      backgroundColor: "#003042",
      [breakpoints.up("sm")]: {
        left: "23%",
        width: "95px",
      },
      [breakpoints.up("md")]: {
        width: "16%",
        left: "95px",
      },
    },
    lmcIconLight: {
      position: "fixed",
      bottom: theme.spacing(4),
      right: "10px",
      // margin : "0 auto",
      width: "70px",
      color: "#ffffff",
      backgroundColor: "#003042",
      [breakpoints.up("sm")]: {
        right: "23%",
        width: "70px",
      },
      [breakpoints.up("md")]: {
        width: "70px",
        right: "32%",
      },
    },
    lmcIconDark: {
      position: "fixed",
      bottom: theme.spacing(4),
      right: "10px",
      // margin : "0 auto",
      width: "70px",
      color:"black",
      backgroundColor:" blue",
      [breakpoints.up("sm")]: {
        right: "23%",
        width: "70px",
      },
      [breakpoints.up("md")]: {
        width: "70px",
        right: "32%",
      },
    },
    addLight: {
      position: "fixed",
      bottom: theme.spacing(4),
      left: "42%",
      // margin : "0 auto",
      width: "70px",
      color: "#ffffff",
      backgroundColor: "#003042",
      [breakpoints.up("sm")]: {
        left: "42%",
        width: "70px",
      },
      [breakpoints.up("md")]: {
        width: "70px",
        left: "42%",
      },
    },
    addDark: {
      position: "fixed",
      bottom: theme.spacing(4),
      left: "42%",
      // margin : "0 auto",
      width: "70px",
      [breakpoints.up("sm")]: {
        left: "42%",
        width: "70px",
      },
      [breakpoints.up("md")]: {
        width: "70px",
        left: "42%",
      },
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
    lmcDisabled: {
      position: "fixed",
      bottom: theme.spacing(4),
      right: "10px",
      // margin : "0 auto",
      width: "70px",
      [breakpoints.up("sm")]: {
        right: "23%",
        width: "70px",
      },
      [breakpoints.up("md")]: {
        width: "70px",
        right: "32%",
      },
      backgroundColor: "#e0e0e0 !important",
      color: "#0000007a !important",
    },
    addDisbaled: {
      position: "fixed",
      bottom: theme.spacing(4),
      left: "42%",
      margin : "0 auto",
      width: "70px",
      color: "#0000007a !important",
      backgroundColor: "#e0e0e0 !important",
      [breakpoints.up("sm")]: {
        // // left: "42%",
        // width: "70px",
      },
      [breakpoints.up("md")]: {
        width: "70px",
        left: "42%",
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
)(compose(withRouter, withStyles(styles))(Trimsheet));
