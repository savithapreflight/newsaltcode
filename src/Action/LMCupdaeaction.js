import * as Enviornment from "./environment";
import * as SQL from "./SQL";
import moment from "moment";
import * as q from "q";
import axios from "axios";
import {
  syncFlightEditionNo,
syncNSLntDetail,
    syncSaltArchive,
  syncThrustArchive,
} from "./sync";
import { update as updateDBSaltArchive } from "./saltArchive";
import { update as updateDBNsLntDetail } from "./nslntdetail";
import { de } from "date-fns/locale";
function fixed1Number(number) {
  var value = Number(number);
  var res = String(number).split(".");
  if (res.length == 1 || res[1].length >= 1) {
    value = value.toFixed(1);
  }
  return value;
}
function ConvertAdjustStrV2ToAdjustStrV1(adjustStrV2) {
  var adjustStrV1 = "";
  var adjustStrV2Arry = String(adjustStrV2).split("$");
  if (adjustStrV2Arry.length <= 0) {
    console.log("lmc adjustStrV1 value", adjustStrV1);
    return adjustStrV1;
  }
  adjustStrV1 =
    (adjustStrV2Arry.length > 0 ? adjustStrV2Arry[0] : "") +
    "$" +
    (adjustStrV2Arry.length > 1 ? adjustStrV2Arry[1] : "") +
    "$" +
    (adjustStrV2Arry.length > 13 ? adjustStrV2Arry[13] : "") +
    "$" +
    (adjustStrV2Arry.length > 14 ? adjustStrV2Arry[14] : "") +
    "$" +
    "" +
    "$" +
    "" +
    "$" +
    (adjustStrV2Arry.length > 15 ? adjustStrV2Arry[15] : "") +
    "$" +
    (adjustStrV2Arry.length > 16 ? adjustStrV2Arry[16] : "") +
    "$" +
    "" +
    "$" +
    "" +
    "$" +
    (adjustStrV2Arry.length > 2 ? adjustStrV2Arry[2] : "") +
    "$" +
    (adjustStrV2Arry.length > 4 ? adjustStrV2Arry[4] : "") +
    "$" +
    (adjustStrV2Arry.length > 3 ? adjustStrV2Arry[3] : "") +
    "$" +
    (adjustStrV2Arry.length > 17 ? adjustStrV2Arry[17] : "") +
    "$" +
    (adjustStrV2Arry.length > 18 ? adjustStrV2Arry[18] : "") +
    "$" +
    (adjustStrV2Arry.length > 19 ? adjustStrV2Arry[19] : "") +
    "$" +
    (adjustStrV2Arry.length > 20 ? adjustStrV2Arry[20] : "");

  console.log("lmc adjustStrV1 value", adjustStrV1);
  return adjustStrV1;
}
export function UpdateLmc(data, allData) {
  console.log(data, allData);
  var defer = q.defer();

  console.log("lmc update action", data);

  var paxAcm1 =
    data.paxAcm1 === null || data.paxAcm1 === undefined
      ? 0
      : parseInt(data.paxAcm1);
  var paxAcm2 =
    data.paxAcm2 === null || data.paxAcm2 === undefined
      ? 0
      : parseInt(data.paxAcm2);
  var paxAcm3 =
    data.paxAcm3 === null || data.paxAcm3 === undefined
      ? 0
      : parseInt(data.paxAcm3);
  var paxAcm4 =
    data.paxAcm4 === null || data.paxAcm4 === undefined
      ? 0
      : parseInt(data.paxAcm4);
  var paxAcm5 =
    data.paxAcm5 === null || data.paxAcm5 === undefined
      ? 0
      : parseInt(data.paxAcm5);
  var paxAcm6 =
    data.paxAcm6 === null || data.paxAcm6 === undefined
      ? 0
      : parseInt(data.paxAcm6);
  var paxAcm7 =
    data.paxAcm7 === null || data.paxAcm7 === undefined
      ? 0
      : parseInt(data.paxAcm7);
  var paxAcm8 =
    data.paxAcm8 === null || data.paxAcm8 === undefined
      ? 0
      : parseInt(data.paxAcm8);

  var Thrust1 =
    data.Thrust1 === null || data.Thrust1 === undefined ? 0 : data.Thrust1;
  var T1Flap1 =
    data.T1Flap1 === null || data.T1Flap1 === undefined ? "" : data.T1Flap1;
  var T1Stab1 =
    data.T1Stab1 === null || data.T1Stab1 === undefined ? 0 : data.T1Stab1;
  var T1Flap2 =
    data.T1Flap2 === null || data.T1Flap2 === undefined ? "" : data.T1Flap2;
  var T1Stab2 =
    data.T1Stab2 === null || data.T1Stab2 === undefined ? 0 : data.T1Stab2;
  var Thrust2 =
    data.Thrust2 === null || data.Thrust2 === undefined ? 0 : data.Thrust2;
  var T2Flap1 =
    data.T2Flap1 === null || data.T2Flap1 === undefined ? "" : data.T2Flap1;
  var T2Stab1 =
    data.T2Stab1 === null || data.T2Stab1 === undefined ? 0 : data.T2Stab1;
  var T2Flap2 =
    data.T2Flap2 === null || data.T2Flap2 === undefined ? "" : data.T2Flap2;
  var T2Stab2 =
    data.T2Stab2 === null || data.T2Stab2 === undefined ? 0 : data.T2Stab2;
  var Thrust3 =
    data.Thrust3 === null || data.Thrust3 === undefined ? 0 : data.Thrust3;
  var T3Flap1 =
    data.T3Flap1 === null || data.T3Flap1 === undefined ? "" : data.T3Flap1;
  var T3Stab1 =
    data.T3Stab1 === null || data.T3Stab1 === undefined ? 0 : data.T3Stab1;
  var T3Flap2 =
    data.T3Flap2 === null || data.T3Flap2 === undefined ? "" : data.T3Flap2;
  var T3Stab2 =
    data.T3Stab2 === null || data.T3Stab2 === undefined ? 0 : data.T3Stab2;
  var Thrust4 =
    data.Thrust4 === null || data.Thrust4 === undefined ? 0 : data.Thrust4;
  var T4Flap1 =
    data.T4Flap1 === null || data.T4Flap1 === undefined ? "" : data.T4Flap1;
  var T4Stab1 =
    data.T4Stab1 === null || data.T4Stab1 === undefined ? 0 : data.T4Stab1;
  var T4Flap2 =
    data.T4Flap2 === null || data.T4Flap2 === undefined ? "" : data.T4Flap2;
  var T4Stab2 =
    data.T4Stab2 === null || data.T4Stab2 === undefined ? 0 : data.T4Stab2;
  // var cabArray  = [];
  // for(var i =0;i<data.MaxCabin;i++){
  //     cabArray.push(data["C"+(i+1)+"Adult"]+"/"+data["C"+(i+1)+"Child"]+"/"+data["C"+(i+1)+"Infant"])
  // }
  // var ActCabStr         =  cabArray.join("$")
  var ActCabStr = data.ActCabStr;
  console.log("ActCabStr", ActCabStr);

  // var ActCompStr  =  String(data.cmpt1+"$"+data.cmpt2+"$"+data.cmpt3+"$"+data.cmpt4);
  var ActCompStr = data.ActCompStr;
  console.log("ActCompStr", ActCompStr);

  var AdjustStr = String(
    data.cockpitOccupent +
      "$" +
      data.Fwdgalley +
      "$" +
      paxAcm1 +
      "$" +
      paxAcm2 +
      "$" +
      "" +
      "$" +
      "" +
      "$" +
      paxAcm3 +
      "$" +
      paxAcm4 +
      "$" +
      "" +
      "$" +
      "" +
      "$" +
      data.Aftrgalley +
      "$" +
      data.Aftrjump +
      "$" +
      data.cabinBagagge +
      "$" +
      paxAcm5 +
      "$" +
      paxAcm6 +
      "$" +
      paxAcm7 +
      "$" +
      paxAcm8
  );
  var AdjustStrv2 = String(
    data.cockpitOccupent +
      "$" +
      (allData.Fwdgalley_final - data.fleetinfo.StdFwdGalley) +
      // data.Fwdgalley +
      "$" +
      (allData.Aftrgalley_final - data.fleetinfo.StdAftGalley) +
      // data.Aftrgalley +
      "$" +
      data.cabinBagagge +
      "$" +
      (allData.Aftrjump_final - data.fleetinfo.StdAftJump) +
      // data.Aftrjump +
      "$" +
      (allData.Fwdjump_final - data.fleetinfo.StdFwdJump) +
      // data.Fwdjump +
      "$" +
      (allData.Midjump_final - data.fleetinfo.StdMidJump) +
      // data.Midjump +
      "$" +
      data.FirstObserver +
      "$" +
      data.SecondObserver +
      "$" +
      data.SuperNumeraries +
      "$" +
      (allData.PortableWater_final - data.fleetinfo.StdPortableWater) +
      // data.PortableWater +
      "$" +
      (allData.SpareWheels_final - data.fleetinfo.StdSpareWheels) +
      // data.SpareWheels +
      "$" +
      (allData.ETOPEquipments_final - data.fleetinfo.StdETOPEquipments) +
      // data.ETOPEquipments +
      "$"
  );
  // +paxAcm1+"$"+paxAcm2+"$"+paxAcm3+"$"+paxAcm4+"$"+paxAcm5+"$"+paxAcm6+"$"+paxAcm7+"$"+paxAcm8);

  var AdjustStrv2ArrayStr = "";
  if (data.MaxCabinValue == 0) {
    AdjustStrv2ArrayStr = "";
  } else if (data.MaxCabinValue == 1) {
    AdjustStrv2ArrayStr = paxAcm1;
  } else if (data.MaxCabinValue == 2) {
    AdjustStrv2ArrayStr = paxAcm1 + "$" + paxAcm2;
  } else if (data.MaxCabinValue == 3) {
    AdjustStrv2ArrayStr = paxAcm1 + "$" + paxAcm2 + "$" + paxAcm3;
  } else if (data.MaxCabinValue == 4) {
    AdjustStrv2ArrayStr =
      paxAcm1 + "$" + paxAcm2 + "$" + paxAcm3 + "$" + paxAcm4;
  } else if (data.MaxCabinValue == 5) {
    AdjustStrv2ArrayStr =
      paxAcm1 + "$" + paxAcm2 + "$" + paxAcm3 + "$" + paxAcm4 + "$" + paxAcm5;
  } else if (data.MaxCabinValue == 6) {
    AdjustStrv2ArrayStr =
      paxAcm1 +
      "$" +
      paxAcm2 +
      "$" +
      paxAcm3 +
      "$" +
      paxAcm4 +
      "$" +
      paxAcm5 +
      "$" +
      paxAcm6;
  } else if (data.MaxCabinValue == 7) {
    AdjustStrv2ArrayStr =
      paxAcm1 +
      "$" +
      paxAcm2 +
      "$" +
      paxAcm3 +
      "$" +
      paxAcm4 +
      "$" +
      paxAcm5 +
      "$" +
      paxAcm6 +
      "$" +
      paxAcm7;
  } else if (data.MaxCabinValue == 8) {
    AdjustStrv2ArrayStr =
      paxAcm1 +
      "$" +
      paxAcm2 +
      "$" +
      paxAcm3 +
      "$" +
      paxAcm4 +
      "$" +
      paxAcm5 +
      "$" +
      paxAcm6 +
      "$" +
      paxAcm7 +
      "$" +
      paxAcm8;
  }
  AdjustStrv2 = AdjustStrv2 + AdjustStrv2ArrayStr;
  AdjustStr = ConvertAdjustStrV2ToAdjustStrV1(AdjustStrv2);
  console.log("AdjustStr", AdjustStr);
  console.log("AdjustStrv2", AdjustStrv2);

  var thrustArray = [];
  var flapArray = [];
  var stabArray = [];
  var thrust = JSON.parse(data.thrust);
  console.log("thrust", thrust);

  for (var i = 0; i < thrust.length; i++) {
    thrustArray.push(parseInt(thrust[i].Thrust));
    flapArray.push(thrust[i].Flap);
    stabArray.push(fixed1Number(thrust[i].Stab));
  }
  var ThrustValues = thrustArray.join("$");
  var FlapValues = flapArray.join("$");
  var StabValues = stabArray.join("$");
  console.log("ThrustValues", ThrustValues);
  console.log("FlapValues", FlapValues);
  console.log("StabValues", StabValues);

  var ISTtime = moment().toISOString();
  console.log(ISTtime, "- now in IST");
  // var TargetTOWMAC = 0;
  // if (data.Acft_Type == "Q400") {
  //   TargetTOWMAC = 24;
  // } else {
  //   TargetTOWMAC = 27 - (70 - data.TOW / 100) * 0.1;
  // }
  // var DeviationTOWMAC = TargetTOWMAC - data.TOWMAC;
  // var AdultLDM = 0;
  // var InfantLDM = 0;
  // var TotalLDM = 0;

  var auth = JSON.parse(window.localStorage.getItem("auth_user"));
  var postData = {
    Flight_Date: data.Flight_Date,
    Flight_no: data.Flight_no,
    Source: data.Source,
    Destination: data.Destination,
    ActcrewStr: data.ActcrewStr,
    Acft_Regn: data.Acft_Regn,
    OLW: data.OLW,
    OTOW: data.OTOW,
    RTOW: data.RTOW,
    FOB: data.FOB,
    TRIP_FUEL: data.TRIP_FUEL,
    ActCabStr: ActCabStr,
    ActCompStr: ActCompStr,
    AdjustStrv2: AdjustStrv2,
    AdjustStr: AdjustStr,
    cmpt1: data.cmpt1,
    cmpt2: data.cmpt2,
    cmpt3: data.cmpt3,
    cmpt4: data.cmpt4,
    OEW: data.dow,
    OEW_Index: data.doi,
    ZFW: data.ZFW,
    ZFWindex: data.ZFWindex,
    ZFWMAC: data.ZFWMAC,
    TOW: data.TOW,
    TOWindex: data.TOWindex,
    TOWMAC: data.TOWMAC,
    LW: data.LAW,
    LWindex: data.LWindex,
    LWMAC: data.LWMAC,
    underLoadLMC: data.underLoadLMC,
    EDNO: data.EDNO,
    specialStr: data.specialStr,
    Load_Officer: data.Load_Officer,
    Trim_Officer: data.Trim_Officer,
    CAPTAIN: data.CAPTAIN,
    TrimGenTimeUTC: data.TrimGenTimeUTC,
    ThrustValues: ThrustValues,
    FlapValues: FlapValues,
    StabValues: StabValues,
    Thrust1: Thrust1,
    T1Flap1: T1Flap1,
    T1Stab1: T1Stab1,
    T1Flap2: T1Flap2,
    T1Stab2: T1Stab2,
    Thrust2: Thrust2,
    T2Flap1: T2Flap1,
    T2Stab1: T2Stab1,
    T2Flap2: T2Flap2,
    T2Stab2: T2Stab2,
    Thrust3: Thrust3,
    T3Flap1: T3Flap1,
    T3Stab1: T3Stab1,
    T3Flap2: T3Flap2,
    T3Stab2: T3Stab2,
    Thrust4: Thrust4,
    T4Flap1: T4Flap1,
    T4Stab1: T4Stab1,
    T4Flap2: T4Flap2,
    T4Stab2: T4Stab2,
    UTCtime: data.TrimGenTimeUTC,
    ISTtime: ISTtime,
    AppType: "M",
    isSync: data.isSync,
    STDCREW: data.STDCREW,
    CONFIG: data.CONFIG,
    ZFWMACFWD: data.ZFWMACFWD,
    ZFWMACAFT: data.ZFWMACAFT,
    TOWMACFWD: data.TOWMACFWD,
    TOWMACAFT: data.TOWMACAFT,
    LWMACFWD: data.LWMACFWD,
    LWMACAFT: data.LWMACAFT,
    LTLoginId: auth.user_name,
    CargoLDM: data.CargoLDM,
    BagLDM: data.BagLDM,
    ActLoadDistStrV2: data.ActLoadDistStrV2,
    ActLoadDistStr: data.ActLoadDistStr,
    TargetTOWMAC: data.TargetTOWMAC,
    DeviationTOWMAC: data.DeviationTOWMAC,
    AdultLDM: data.AdultLDM,
    InfantLDM: data.InfantLDM,
    TotalLDM: data.TotalLDM,
  };
  var crewArray = data.ActcrewStr.split("/");
  var CabinCrew = parseInt(crewArray[1]);
  var CockpitCrew = parseInt(crewArray[0]);
  var LIM1 = parseInt(data.MZFW + data.FOB);
  var LIM2 = parseInt(data.OTOW);
  var LIM3 = parseInt(data.OLW + data.TRIP_FUEL);
  var LimitFacZfw = "";
  var LimitFacTow = "";
  var LimitFacLw = "";
  if (LIM1 < LIM2 && LIM1 < LIM3) {
    LimitFacZfw = "L";
  }
  if (LIM2 < LIM1 && LIM2 < LIM3) {
    LimitFacTow = "L";
  }
  if (LIM3 < LIM1 && LIM3 < LIM2) {
    LimitFacLw = "L";
  }
  var saltArchivePostData = {
    FlightDate: data.Flight_Date,
    FlightNo: data.Flight_no,
    DepArpt: data.Source,
    ArrArpt: data.Destination,
    ActcrewStr: data.ActcrewStr,
    AcftRegn: data.Acft_Regn,
    MTow: data.MTOW,
    MZFW: data.MZFW,
    OLW: data.OLW,
    OTOW: data.OTOW,
    RTOW: data.RTOW,
    FOB: data.FOB,
    TripFuel: data.TRIP_FUEL,
    ActCabStr: ActCabStr,
    CmptWeights: ActCompStr,
    AdjustStrv2: AdjustStrv2,
    OEW: data.dow,
    OEW_Index: data.doi,
    ZFW: data.ZFW,
    ZFWindex: data.ZFWindex,
    ZFWCG: data.ZFWMAC,
    TOW: data.TOW,
    TOWindex: data.TOWindex,
    TOWCG: data.TOWMAC,
    LW: data.LAW,
    LWindex: data.LWindex,
    LWCG: data.LWMAC,
    underLoadLMC: data.underLoadLMC,
    EditionNum: data.EDNO,
    SpecialStr: data.specialStr,
    LoadOfficer: data.Load_Officer,
    TrimOfficer: data.Trim_Officer,
    GeneratedTimeUTC: data.TrimGenTimeUTC,
    CAPTAIN: data.CAPTAIN,
    ThrustValues: ThrustValues,
    FlapValues: FlapValues,
    StabValues: StabValues,
    STDCREW: data.STDCREW,
    ZFWCGFwdLimit: data.ZFWMACFWD,
    ZFWCGAftLimit: data.ZFWMACAFT,
    TOWCGFwdLimit: data.TOWMACFWD,
    TOWCGAftLimit: data.TOWMACAFT,
    LWCGFwdLimit: data.LWMACFWD,
    LWCGAftLimit: data.LWMACAFT,
    UserId: auth.user_name,
    CargoLDM: data.CargoLDM,
    BagLDM: data.BagLDM,
    CabinCrew: CabinCrew,
    LimitFacLw: LimitFacLw,
    LimitFacTow: LimitFacTow,
    LimitFacZfw: LimitFacZfw,
    TrafficTotalWeight: data.totalLoad,
    CabinAcm: AdjustStrv2ArrayStr,
    isSync: data.isSync,
    ActLoadDistStrV2: data.ActLoadDistStrV2,
    ActLoadDistStr: data.ActLoadDistStr,
    CockpitCrew: CockpitCrew,
    AftJumpSeat: data.Aftrjump,
    CockpitOccuPant: data.cockpitOccupent,
    TargetTOWMAC: data.TargetTOWMAC,
    DeviationTOWMAC: data.DeviationTOWMAC,
    AdultLDM: data.AdultLDM,
    InfantLDM: data.InfantLDM,
    TotalLDM: data.TotalLDM,
  };
  console.log("postdata", postData);
  console.log("saltArchivePostData ", saltArchivePostData);
  updateLnTDetail(postData)
    .then((res) => {
      console.log("dfbghjkl");
      return deleteFlightEditionNo();
    })
    .then(() => {
      console.log("xcvn");
      return insertFlightEditionNo(postData);
    })
    .then(() => {
      console.log("resdfgh12334567");
      return updateThrustArchive(postData);
    })
    .then(() => {
      console.log("resdfgh123");
      defer.resolve(postData);
    })
    .then(() => {
      console.log("resdfgh");
      return updateSaltArchive(saltArchivePostData);
    })
    .catch((er) => {
      console.log(er);
      defer.reject("Failed To Update The Table");
    });
  return defer.promise;
}

export function UpdateCaptEmpId(data) {
  var defer = q.defer();
  console.log("Update CaptEmpId data vale ", data);
  var auth = JSON.parse(window.localStorage.getItem("auth_user"));
  var saltArchivePostData = {
    FlightDate: data.Flight_Date,
    FlightNo: data.Flight_no,
    DepArpt: data.source,
    ArrArpt: data.Destination,
    CaptEmpId: data.CaptEmpId,
    CAPTAIN: data.CAPTAIN,
    UserId: auth.user_name,
  };
  updateDBLnTDetail(data)
    .then((res) => {
      return updateSaltArchiveForScan(saltArchivePostData);
    })
    .catch((er) => {
      console.log(er);
      defer.reject("Failed To Update The Table");
    });
  return defer.promise;
}

export function updateLnTDetail(data) {
  return new Promise((resolve, reject) => {
    console.log("data", data);

    var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onerror = function (event) {
      console.error("Database error: " + event.target.errorCode);
      reject("Failed to open the database");
    };

    request.onupgradeneeded = function (event) {
      var db = event.target.result;
    };

    request.onsuccess = function (event) {
      var db = event.target.result;

      var transaction = db.transaction(["nslntdetail"], "readwrite");
      var objectStore = transaction.objectStore("nslntdetail");
      var index = objectStore.index("Flight_no", "Flight_Date", "Destination");
      var request = index.get(
        data.Flight_no,
        data.Flight_Date,
        data.Destination
      );

      console.log(request);
      request.onsuccess = function (event) {
        var cursor = event.target.result;
        console.log(cursor);
        if (cursor) {
          console.log(data);
          cursor.ActcrewStr = data.ActcrewStr;
          cursor.Acft_Regn = data.Acft_Regn;
          cursor.OLW = data.OLW;
          cursor.OTOW = data.OTOW;

          cursor.RTOW = data.RTOW;
          cursor.FOB = data.FOB;
          cursor.TRIP_FUEL = data.TRIP_FUEL;
          cursor.ActCabStr = data.ActCabStr;
          cursor.ActCompStr = data.ActCompStr;
          cursor.AdjustStrv2 = data.AdjustStrv2;
          cursor.AdjustStr = data.AdjustStr;
          cursor.cmpt1 = data.cmpt1;
          cursor.cmpt2 = data.cmpt2;
          cursor.cmpt3 = data.cmpt3;
          cursor.cmpt4 = data.cmpt4;
          cursor.OEW = data.OEW;
          cursor.OEW_Index = data.OEW_Index;
          cursor.ZFW = data.ZFW;
          cursor.ZFWindex = data.ZFWindex;
          cursor.ZFWMAC = data.ZFWMAC;
          cursor.TOW = data.TOW;
          cursor.TOWindex = data.TOWindex;
          cursor.TOWMAC = data.TOWMAC;
          cursor.LW = data.LW;
          cursor.LWindex = data.LWindex;
          cursor.LWMAC = data.LWMAC;
          cursor.underLoadLMC = data.underLoadLMC;

          cursor.EDNO = data.EDNO;

          cursor.specialStr = data.specialStr;
          cursor.Load_Officer = data.Load_Officer;
          cursor.Trim_Officer = data.Trim_Officer;
          cursor.CAPTAIN = data.CAPTAIN;
          cursor.TrimGenTimeUTC = data.TrimGenTimeUTC;
          cursor.isSync = data.isSync;
          cursor.ZFWMACFWD = data.ZFWMACFWD;
          cursor.ZFWMACAFT = data.ZFWMACAFT;
          cursor.TOWMACFWD = data.TOWMACFWD;
          cursor.ActLoadDistStr = data.ActLoadDistStr;
          cursor.ActLoadDistStrV2 = data.ActLoadDistStrV2;
          cursor.TOWMACAFT = data.TOWMACAFT;
          cursor.LWMACFWD = data.LWMACFWD;
          cursor.LWMACAFT = data.LWMACAFT;
          cursor.CargoLDM = data.CargoLDM;
          cursor.BagLDM = data.BagLDM;
          cursor.TargetTOWMAC = data.TargetTOWMAC;
          cursor.DeviationTOWMAC = data.DeviationTOWMAC;
          cursor.AdultLDM = data.AdultLDM;
          cursor.InfantLDM = data.InfantLDM;
          cursor.TotalLDM = data.TotalLDM;

          var updateRequest = objectStore.put(cursor);

          updateRequest.onsuccess = function () {
            console.log('update done successfully')
            resolve();
          };

          updateRequest.onerror = function (event) {
            console.error("Error updating record: " + event.target.errorCode);
            reject("Failed to update the Ns_LnTDetail.");
          };
          resolve();
        } else {
          console.error("Record not found");
          reject("Failed to find the Ns_LnTDetail.");
        }
      };

      request.onerror = function (event) {
        console.error("Error updating record: " + event.target.errorCode);
        reject("Failed to update the Ns_LnTDetail.");
      };
    };
  });
}


export function selectSQLLiteLnTDetail(data) {
  return new Promise((resolve, reject) => {
    console.log("data", data);

    var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onerror = function (event) {
      console.error("Database error: " + event.target.errorCode);
      reject("Failed to open the database");
    };

    request.onsuccess = function (event) {
      var db = event.target.result;

      var transaction = db.transaction(["nslntdetail"], "readonly");
      var objectStore = transaction.objectStore("nslntdetail");
      var index = objectStore.index(
        "Flight_Date",
        "Flight_no",
        "source",
        "Destination"
      );
      var singleKeyRange = IDBKeyRange.bound(
        [data.Flight_Date, data.Flight_no, data.source, data.Destination],
        [data.Flight_Date, data.Flight_no, data.source, data.Destination]
      );

      var request = index.openCursor(singleKeyRange);

      request.onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
          console.log(cursor.value.CAPTAIN);

          resolve(cursor.value.CAPTAIN);
        } else {
          console.error("Record not found");
          reject("Failed to find the Ns_LnTDetail.");
        }
      };

      request.onerror = function (event) {
        console.error("Error reading data from IndexedDB", event.target.error);
        reject("Failed to find the Ns_LnTDetail.");
      };
    };
  });
}

export function updateDBLnTDetail(data) {
  var defer = q.defer();
  console.log("data", data);
  var promise = [];
  promise.push(updateSQLLiteLnTDetail(data));
  Promise.all(promise).then((res) => {
    defer.resolve(res);
  });
  return defer.promise;
}
export function updateSQLLiteLnTDetail(data) {
  var defer = q.defer();

  // Open the existing IndexedDB database
  var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  request.onsuccess = function (event) {
    var db = event.target.result;

    // Start a transaction
    var transaction = db.transaction(["nslntdetail"], "readwrite");
    var objectStore = transaction.objectStore("nslntdetail");

    // Assuming you have a compound index named 'FlightIndex' for your object store
    var index = objectStore.index(
      "Flight_Date",
      "Flight_no",
      "source",
      "Destination"
    );
    var getRequest = index.get(
      data.Flight_Date,
      data.Flight_no,
      data.source,
      data.Destination
    );

    getRequest.onsuccess = function (event) {
      var cursor = event.target.result;

      if (cursor) {
        cursor.isSync = "false";
        cursor.CaptEmpId = data.CaptEmpId;
        cursor.CAPTAIN = data.CAPTAIN;

        var updateRequest = objectStore.update(cursor);

        updateRequest.onsuccess = function (event) {
          console.log("Data updated successfully in IndexedDB");
          defer.resolve();
        };

        updateRequest.onerror = function (event) {
          console.error("Error updating data in IndexedDB", event.target.error);
          defer.reject("Failed to update data in IndexedDB.");
        };
      } else {
        // No matching record found
        defer.reject("Failed to find the Ns_LnTDetail.");
      }
    };

    getRequest.onerror = function (event) {
      console.error("Error reading data from IndexedDB", event.target.error);
      defer.reject("Failed to find the Ns_LnTDetail.");
    };
  };

  request.onerror = function (event) {
    console.error("Error opening IndexedDB", event.target.error);
    defer.reject("Failed to open IndexedDB.");
  };

  return defer.promise;
}

// export function updateSaltArchive(data) {
//   console.log(data)
//   var defer = q.defer();
//   return new Promise((resolve, reject) => {
//     var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
//     var Id = Math.floor(Math.random() * 100);

//     request.onerror = function (event) {
//       console.error("Database error: " + event.target.errorCode);
//       reject("Failed to open the database");
//     };

//     request.onupgradeneeded = function (event) {
//       var db = event.target.result;
//       if (!db.objectStoreNames.contains("saltarchive")) {
//         db.createObjectStore("saltarchive", { keyPath: "Id" });
//       }
//     };

//     request.onsuccess = function (event) {
//       var db = event.target.result;

//       var transaction = db.transaction(["saltarchive"], "readwrite");
//       var objectStore = transaction.objectStore("saltarchive");

//       var addRequest = objectStore.add({
//         Id: Id,
//         FlightDate: data.FlightDate,
//         FlightNo: data.FlightNo,
//         DepArpt: data.DepArpt,
//         ArrArpt: data.ArrArpt,
//         AcftRegn: data.AcftRegn,
//         MTow: data.MTow,
//         MZFW: data.MZFW,
//         OEW: data.OEW,
//         OEW_Index: data.OEW_Index,
//         STDCREW: data.STDCREW,
//         FOB: data.FOB,
//         TripFuel: data.TripFuel,
//         OLW: data.OLW,
//         OTOW: data.OTOW,
//         RTOW: data.RTOW,
//         AdjustStrv2: data.AdjustStrv2,
//         LoadDistStrV2: data.LoadDistStrV2,
//         ActLoadDistStrV2: data.ActLoadDistStrV2,
//         SpecialStr: data.SpecialStr,
//         PalletsStr: data.PalletsStr,
//         EditionNum: data.EditionNum,
//         CockpitCrew: data.CockpitCrew,
//         CabinCrew: data.CabinCrew,
//         ZFW: data.ZFW,
//         TOW: data.TOW,
//         LW: data.LW,
//         LWCG: data.LWCG,
//         LWCGFwdLimit: data.LWCGFwdLimit,
//         TOWCG: data.TOWCG,
//         TOWCGFwdLimit: data.TOWCGFwdLimit,
//         TOWCGAftLimit: data.TOWCGAftLimit,
//         ZFWCG: data.ZFWCG,
//         ZFWCGFwdLimit: data.ZFWCGFwdLimit,
//         ZFWCGAftLimit: data.ZFWCGAftLimit,
//         ZFWindex: data.ZFWindex,
//         TOWindex: data.TOWindex,
//         LWindex: data.LWindex,
//         LimitFacLw: data.LimitFacLw,
//         LimitFacTow: data.LimitFacTow,
//         LimitFacZfw: data.LimitFacZfw,
//         ActCabStr: data.ActCabStr,
//         BagLDM: data.BagLDM,
//         CargoLDM: data.CargoLDM,
//         TrafficTotalWeight: data.TrafficTotalWeight,
//         FlapValues: data.FlapValues,
//         ThrustValues: data.ThrustValues,
//         StabValues: data.StabValues,
//         UnderLoadLMC: data.UnderLoadLMC,
//         GeneratedTimeUTC: data.GeneratedTimeUTC,
//         CAPTAIN: data.CAPTAIN,
//         LoadOfficer: data.LoadOfficer,
//         TrimOfficer: data.TrimOfficer,
//         UserId: data.UserId,
//         CmptWeights: data.CmptWeights,
//         CockpitOccuPant: data.CockpitOccuPant,
//         CabinAcm: data.CabinAcm,
//         AftJumpSeat: data.AftJumpSeat,

//         LWCGAftLimit: data.LWCGAftLimit,
//       });

//       addRequest.onsuccess = function (event) {
//         var promises = [];
//     promises.push(promiseData(data));
//         defer.resolve();
//       };

//       addRequest.onerror = function (event) {
//         console.error("Error adding record: " + event.target.errorCode);
//         defer.reject("Failed to add to SALTArchive.");
//       };

//       transaction.oncomplete = function () {
//         db.close();
//       };
//     };
//   });
// }

export async function updateSaltArchive(dataArray) {
  console.log(dataArray)
  try {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        db.createObjectStore("saltarchive", { keyPath: "Id" });
      };

      request.onsuccess = function (event) {
        resolve(event.target.result);
      };

      request.onerror = function (event) {
        reject(event.target.error);
      };
    });

    const transaction = db.transaction(["saltarchive"], "readwrite");
    const objectStore = transaction.objectStore("saltarchive");

    for (let i=0;i < dataArray.length;i++) {
     
      // const Id = Math.floor(Math.random() * 100);
      var Id = new Date().getTime();
     console.log(dataArray[i].Flight_no)
      const insertData = {
        Id: Id ,
        // FlightDate: dataArray[i].Flight_Date?dataArray[i].Flight_Date:'',
            FlightNo: dataArray[i].Flight_no,
            DepArpt: dataArray[i].Destination,
            ArrArpt: dataArray[i].source,
            AcftRegn: dataArray[i].Regn_no,
            MTow: dataArray[i].MTow,
            MZFW: dataArray[i].MZFW,
            OEW: dataArray[i].OEW,
            OEW_Index: dataArray[i].OEW_Index,
            STDCREW: dataArray[i].STDCREW,
            FOB: dataArray[i].FOB,
            TripFuel: dataArray[i].TripFuel,
            OLW: dataArray[i].OLW,
            OTOW: dataArray[i].OTOW,
            RTOW: dataArray[i].RTOW,
            AdjustStrv2: dataArray[i].AdjustStrv2,
            LoadDistStrV2: dataArray[i].LoadDistStrV2,
            ActLoadDistStrV2: dataArray[i].ActLoadDistStrV2,
            SpecialStr: dataArray[i].SpecialStr,
            PalletsStr: dataArray[i].PalletsStr,
            EditionNum: dataArray[i].EdNo,
            CockpitCrew: dataArray[i].CockpitCrew,
            CabinCrew: dataArray[i].CabinCrew,
            ZFW: dataArray[i].ZFW,
            TOW: dataArray[i].TOW,
            LW: dataArray[i].LW,
            LWCG: dataArray[i].LWCG,
            LWCGFwdLimit: dataArray[i].LWCGFwdLimit,
            TOWCG: dataArray[i].TOWCG,
            TOWCGFwdLimit: dataArray[i].TOWCGFwdLimit,
            TOWCGAftLimit: dataArray[i].TOWCGAftLimit,
            ZFWCG: dataArray[i].ZFWCG,
            ZFWCGFwdLimit: dataArray[i].ZFWCGFwdLimit,
            ZFWCGAftLimit: dataArray[i].ZFWCGAftLimit,
            ZFWindex: dataArray[i].ZFWindex,
            TOWindex: dataArray[i].TOWindex,
            LWindex: dataArray[i].LWindex,
            LimitFacLw: dataArray[i].LimitFacLw,
            LimitFacTow: dataArray[i].LimitFacTow,
            LimitFacZfw: dataArray[i].LimitFacZfw,
            ActCabStr: dataArray[i].ActCabStr,
            BagLDM: dataArray[i].BagLDM,
            CargoLDM: dataArray[i].CargoLDM,
            TrafficTotalWeight: dataArray[i].TrafficTotalWeight,
            FlapValues: dataArray[i].FlapValues,
            ThrustValues: dataArray[i].ThrustValues,
            StabValues: dataArray[i].StabValues,
            UnderLoadLMC: dataArray[i].UnderLoadLMC,
            GeneratedTimeUTC: dataArray[i].GeneratedTimeUTC,
            CAPTAIN: dataArray[i].CAPTAIN,
            LoadOfficer: dataArray[i].LoadOfficer,
            TrimOfficer: dataArray[i].TrimOfficer,
            UserId: dataArray[i].UserId,
            CmptWeights: dataArray[i].CmptWeights,
            CockpitOccuPant: dataArray[i].CockpitOccuPant,
            CabinAcm: dataArray[i].CabinAcm,
            AftJumpSeat: dataArray[i].AftJumpSeat,
            LWCGAftLimit: dataArray[i].LWCGAftLimit,
        
      };


      await new Promise((resolveData, rejectData) => {
        const addRequest = objectStore.add(insertData);

        addRequest.onsuccess = function () {
          console.log("Data added successfully");
          resolveData();
        };

        addRequest.onerror = function (error) {
          console.error("Error adding data", error);
          rejectData(error);
        };
      });
    }

    transaction.oncomplete = function () {
      db.close();
    };
  } catch (error) {
    console.error("Error updating salt archive", error);
    throw error;
  }
}


// export function updateSaltArchive(dataArray) {
//   console.log(dataArray.length)
//   return new Promise((resolve, reject) => {
//     var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

//     request.onupgradeneeded = function (event) {
//       var db = event.target.result;
//       var objectStore = db.createObjectStore("saltarchive", { keyPath: "Id" });
//     };

//     request.onsuccess = function (event) {
//       var db = event.target.result;
//       var transaction = db.transaction(["saltarchive"], "readwrite");
//       var objectStore = transaction.objectStore("saltarchive");

//       var promises = dataArray.map((data) => {
//         return new Promise((resolveData, rejectData) => {
//           var Id = Math.floor(Math.random() * 100);

//           var insertData = {
//               Id: Id,
//             FlightDate: data.FlightDate,
//             FlightNo: data.FlightNo,
//             DepArpt: data.DepArpt,
//             ArrArpt: data.ArrArpt,
//             AcftRegn: data.AcftRegn,
//             MTow: data.MTow,
//             MZFW: data.MZFW,
//             OEW: data.OEW,
//             OEW_Index: data.OEW_Index,
//             STDCREW: data.STDCREW,
//             FOB: data.FOB,
//             TripFuel: data.TripFuel,
//             OLW: data.OLW,
//             OTOW: data.OTOW,
//             RTOW: data.RTOW,
//             AdjustStrv2: data.AdjustStrv2,
//             LoadDistStrV2: data.LoadDistStrV2,
//             ActLoadDistStrV2: data.ActLoadDistStrV2,
//             SpecialStr: data.SpecialStr,
//             PalletsStr: data.PalletsStr,
//             EditionNum: data.EditionNum,
//             CockpitCrew: data.CockpitCrew,
//             CabinCrew: data.CabinCrew,
//             ZFW: data.ZFW,
//             TOW: data.TOW,
//             LW: data.LW,
//             LWCG: data.LWCG,
//             LWCGFwdLimit: data.LWCGFwdLimit,
//             TOWCG: data.TOWCG,
//             TOWCGFwdLimit: data.TOWCGFwdLimit,
//             TOWCGAftLimit: data.TOWCGAftLimit,
//             ZFWCG: data.ZFWCG,
//             ZFWCGFwdLimit: data.ZFWCGFwdLimit,
//             ZFWCGAftLimit: data.ZFWCGAftLimit,
//             ZFWindex: data.ZFWindex,
//             TOWindex: data.TOWindex,
//             LWindex: data.LWindex,
//             LimitFacLw: data.LimitFacLw,
//             LimitFacTow: data.LimitFacTow,
//             LimitFacZfw: data.LimitFacZfw,
//             ActCabStr: data.ActCabStr,
//             BagLDM: data.BagLDM,
//             CargoLDM: data.CargoLDM,
//             TrafficTotalWeight: data.TrafficTotalWeight,
//             FlapValues: data.FlapValues,
//             ThrustValues: data.ThrustValues,
//             StabValues: data.StabValues,
//             UnderLoadLMC: data.UnderLoadLMC,
//             GeneratedTimeUTC: data.GeneratedTimeUTC,
//             CAPTAIN: data.CAPTAIN,
//             LoadOfficer: data.LoadOfficer,
//             TrimOfficer: data.TrimOfficer,
//             UserId: data.UserId,
//             CmptWeights: data.CmptWeights,
//             CockpitOccuPant: data.CockpitOccuPant,
//             CabinAcm: data.CabinAcm,
//             AftJumpSeat: data.AftJumpSeat,
//             LWCGAftLimit: data.LWCGAftLimit,
//           };

//           var addRequest = objectStore.add(insertData);

//           addRequest.onsuccess = function (event) {
//             console.log("Data added successfully");
//             resolveData();
//           };

//           addRequest.onerror = function (error) {
//             console.error("Error adding data", error);
//             rejectData(error);
//           };
//         });
//       });

//       Promise.all(promises)
//         .then(() => {
//           transaction.oncomplete = function () {
//             db.close();
//             resolve();
//           };
//         })
//         .catch((error) => {
//           console.error("Error adding data", error);
//           reject(error);
//         });
//     };

//     request.onerror = function (event) {
//       console.error("Error opening database", event.target.error);
//       reject(event.target.error);
//     };
//   });
// }

export function updateSaltArchiveForScan(data) {
  var defer = q.defer();
  var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);
  var Id = Math.floor(Math.random() * 100);
  console.log(Id, "Id updateSaltArchive data", data);

  request.onsuccess = function (event) {
    var db = event.target.result;

    db
      .transaction(["saltarchive"], "readwrite")
      .objectStore("saltarchive")
      .add({
        Id: Id,
        FlightDate: data.FlightDate,
        FlightNo: data.FlightNo,
        DepArpt: data.DepArpt,
        ArrArpt: data.ArrArpt,
        CaptEmpId: data.CaptEmpId,
        CAPTAIN: data.CAPTAIN,
        UserId: data.UserId,
      }).onsuccess = function (event) {
      console.log("updateSaltArchive result data", data);
      defer.resolve(event.target.result);
    };

    db.onerror = function (event) {
      console.log(event.target.error);
      defer.reject(event.target.error);
    };
  };

  request.onerror = function (event) {
    console.log(event.target.error);
    defer.reject(event.target.error);
  };

  return defer.promise;
}

export function deleteFlightEditionNo() {
  return new Promise((resolve, reject) => {
    var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onerror = function (event) {
      console.error("Database error: " + event.target.errorCode);
      reject("Failed to open the database");
    };

    request.onupgradeneeded = function (event) {
      var db = event.target.result;
      // Handle database upgrade if needed
    };

    request.onsuccess = function (event) {
      var db = event.target.result;

      var transaction = db.transaction(["flighteditionno"], "readwrite");
      var objectStore = transaction.objectStore("flighteditionno");

      var deleteRequest = objectStore.delete(123456);

      deleteRequest.onsuccess = function () {
        resolve();
      };

      deleteRequest.onerror = function (event) {
        console.error("Error deleting record: " + event.target.errorCode);
        reject("Failed to delete from FlightEditionNo.");
      };

      transaction.oncomplete = function () {
        db.close();
      };
    };
  });
}

export function insertFlightEditionNo(data) {
  return new Promise((resolve, reject) => {
    var request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onerror = function (event) {
      console.error("Database error: " + event.target.errorCode);
      reject("Failed to open the database");
    };

    request.onupgradeneeded = function (event) {
      var db = event.target.result;
      if (!db.objectStoreNames.contains("flighteditionno")) {
        db.createObjectStore("flighteditionno", { keyPath: "Id" });
      }
    };

    request.onsuccess = function (event) {
      var db = event.target.result;

      var transaction = db.transaction(["flighteditionno"], "readwrite");
      var objectStore = transaction.objectStore("flighteditionno");

      var addRequest = objectStore.add({
        Id: 123456,
        Flight_Date: data.Flight_Date,
        Flight_no: data.Flight_no,
        Destination: data.Destination,
        Source: data.Source,
        EDNO: data.EDNO,
        Acft_Regn: data.Acft_Regn,
        ActcrewStr: data.ActcrewStr,
        cmpt1: data.cmpt1,
        cmpt2: data.cmpt2,
        cmpt3: data.cmpt3,
        cmpt4: data.cmpt4,
        ZFW: data.ZFW,
        FOB: data.FOB,
        TOW: data.TOW,
        TRIP_FUEL: data.TRIP_FUEL,
        underLoadLMC: data.underLoadLMC,
        ZFWindex: data.ZFWindex,
        TOWindex: data.TOWindex,
        LWindex: data.LWindex,
        ZFWMAC: data.ZFWMAC,
        TOWMAC: data.TOWMAC,
        LWMAC: data.LWMAC,
        Load_Officer: data.Load_Officer,
        specialStr: data.specialStr,
        CAPTAIN: data.CAPTAIN,
        OEW: data.OEW,
        OEW_Index: data.OEW_Index,
        AdjustStr: data.AdjustStr,
        ActCabStr: data.ActCabStr,
        ActCompStr: data.ActCompStr,
        OLW: data.OLW,
        OTOW: data.OTOW,
        RTOW: data.RTOW,
        AdjustStrv2: data.AdjustStrv2,
        LW: data.LW,
        Trim_Officer: data.Trim_Officer,
        UTCtime: data.UTCtime,
        ISTtime: data.ISTtime,
        FlapValues: data.FlapValues,
        ThrustValues: data.ThrustValues,
        StabValues: data.StabValues,
        AppType: data.AppType,
        ZFWMACFWD: data.ZFWMACFWD,
        ZFWMACAFT: data.ZFWMACAFT,
        TOWMACFWD: data.TOWMACFWD,
        TOWMACAFT: data.TOWMACAFT,
        LWMACFWD: data.LWMACFWD,
        LWMACAFT: data.LWMACAFT,
        LTLoginId: data.LTLoginId,
        isSync: data.isSync,
      });

      addRequest.onsuccess = function () {
        console.log('inserted succesfully')
        resolve();
      };

      addRequest.onerror = function (event) {
        console.error("Error adding record: " + event.target.errorCode);
        reject("Failed to add to FlightEditionNo.");
      };

      transaction.oncomplete = function () {
        db.close();
      };
    };
  });
}

export function updateThrustArchive(data) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(Enviornment.get("DB_NAME"), 1);

    request.onerror = (event) => {
      console.error("Database error:", event.target.error);
      reject(new Error("Failed to open the database."));
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction("thrustarchive", "readwrite");
      const store = transaction.objectStore("thrustarchive");
      const index = store.index(
        "Flight_Date",
        "Flight_no",
        "source",
        "Destination"
      );

      const getRequest = index.get(
        data.Flight_Date,
        data.Flight_no,
        data.Source,
        data.Destination
      );

      getRequest.onsuccess = () => {
        const existingData = getRequest.result;

        if (existingData) {
          Object.assign(existingData, {
            Thrust1: data.Thrust1,
            T1Flap1: data.T1Flap1,
            T1Stab1: data.T1Stab1,
            T1Flap2: data.T1Flap2,
            T1Stab2: data.T1Stab2,
            Thrust2: data.Thrust2,
            T2Flap1: data.T2Flap1,
            T2Stab1: data.T2Stab1,
            T2Flap2: data.T2Flap2,
            T2Stab2: data.T2Stab2,
            Thrust3: data.Thrust3,
            T3Flap1: data.T3Flap1,
            T3Stab1: data.T3Stab1,
            T3Flap2: data.T3Flap2,
            T3Stab2: data.T3Stab2,
            Thrust4: data.Thrust4,
            T4Flap1: data.T4Flap1,
            T4Stab1: data.T4Stab1,
            T4Flap2: data.T4Flap2,
            T4Stab2: data.T4Stab2,
            FlapValues: data.FlapValues,
            ThrustValues: data.ThrustValues,
            StabValues: data.StabValues,
            isSync: data.isSync,
          });

          // Put the updated data back into the store.
          const putRequest = store.put(existingData);

          putRequest.onsuccess = () => {
            resolve();
          };

          putRequest.onerror = (event) => {
            console.error("Put error:", event.target.error);
            reject(new Error("Failed to update ThrustArchive."));
          };
        } else {
          reject(new Error("Record not found."));
        }
      };

      getRequest.onerror = (event) => {
        console.error("Get error:", event.target.error);
        reject(new Error("Failed to get ThrustArchive."));
      };
    };
  });
}

export function updateFlightEditionNo(data) {
  var defer = q.defer();

  var db = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  db.onerror = function (event) {
    console.log("Database error: " + event.target.errorCode);
    defer.reject("Failed to open the database.");
  };

  db.onsuccess = function (event) {
    var database = event.target.result;

    var transaction = database.transaction(["flighteditionno"], "readwrite");
    var objectStore = transaction.objectStore("flighteditionno");

    // Fetch all records from the object store
    var getAllRequest = objectStore.getAll();

    getAllRequest.onsuccess = function () {
      var allData = getAllRequest.result;
      var updatedRecords = [];

      // Filter the data based on your condition
      var filteredData = allData.filter((item) => {
        return (
          item.Flight_Date === data.Flight_Date &&
          item.Flight_no === data.Flight_no &&
          item.source === data.Source &&
          item.Destination === data.Destination
        );
      });

      if (filteredData.length > 0) {
        // Update each filtered record
        filteredData.forEach((record) => {
         
          record.isSync = data.isSync;
          var updateRequest = objectStore.put(record);

          updateRequest.onsuccess = function (event) {
            updatedRecords.push(record);
            console.log("Record updated:", record);
            // defer.resolve(event.target.result);
          };

          updateRequest.onerror = function (error) {
            console.log("Error updating record: " + error);
            defer.reject("Failed to update the record.");
          };
        });

        transaction.oncomplete = function () {
          defer.resolve(updatedRecords);
        };
      } else {
        console.log("No records found for the given condition.");
        defer.reject("No records found for the given condition.");
      }
    };

    getAllRequest.onerror = function (error) {
      console.log("Error fetching records: " + error);
      defer.reject("Failed to fetch records.");
    };
  };

  return defer.promise;
}

export function LMCArchive() {
  var defer = q.defer();
  syncNSLntDetail()
    .then((results) => {
      console.log("res", results);
      // console.log("data",res[0].data)
      var sync_data = [];
      if (results !== undefined) {
        for (var i = 0; i < results.length; i++) {
          sync_data.push(results[i]);
        }
        var promise = [];
        sync_data.forEach(async (i) => {
          console.log(i)
          var data = i.data;
          data["isSync"] = true;
          promise.push(updateLnTDetail(data));
        });
        return Promise.all(promise);
      }
    })
    .then(() => {
      console.log("22222222222222222");
      return syncThrustArchive();
    })
    .then((results1) => {
      console.log("results1", results1);
      var sync_data = [];
      if (results1 !== undefined) {
        for (var i = 0; i < results1.length; i++) {
          sync_data.push(results1[i]);
        }
        var promise = [];
        sync_data.forEach(async (i) => {
          var data = i.data;
          data["isSync"] = true;
          data["Source"] = data.source;
          promise.push(updateThrustArchive(data));
        });
        return Promise.all(promise);
      }
    })
    .then(() => {
      return syncFlightEditionNo();
    })
    .then((results2) => {
      console.log("results2", results2);
      var sync_data = [];
      if (results2 !== undefined) {
        for (var i = 0; i < results2.length; i++) {
          console.log(results2.length);
          sync_data.push(results2[i]);
        }
        var promise = [];
        sync_data.forEach(async (i) => {
          var data = i.data.data;
          data["isSync"] = true;
          console.log(data);
          promise.push(updateFlightEditionNo(data));
        });
        return Promise.all(promise);
      }
    })
    .then((res) => {
      console.log(res);
      return res;
    })
    //   .then((res)=>{
    //     defer.resolve(res);

    // })
    .then((results3) => {
      console.log("results3", results3);
      var sync_data = [];
      if (results3 !== undefined) {
        for (var i = 0; i < results3.length; i++) {
          sync_data.push(results3[i]);
        }
        var promise = [];
        console.log(sync_data.length);
        sync_data.forEach( (i) => {
                 promise.push(updateSaltArchive(i));
        });
      console.log(Promise.all(promise))
      defer.resolve(Promise.all(promise))
        return Promise.all(promise);
      
      }
    })
    .catch((er) => {
      console.log(er);
      defer.reject(er);
    });
  return defer.promise;
}
