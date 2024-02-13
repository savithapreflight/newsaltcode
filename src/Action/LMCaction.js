import * as Enviornment from "./environment";

import moment from "moment";
import * as q from "q";
import {
  fetchFimsDataByFlightNoDate,
  fetchFleetinfoByRegnNo,
  fetchLTAdjustWeightByAcftType,
  addTrimSheetLMC,
  addTrimSheetLMCOffline,
  fetchLocalOfflineTrimSheets,
} from "./rampaction";
import axios from "axios";
import { fetchTrimSheetforFlight } from "./fimsTrimsheetaction";
import momentTz from "moment-timezone";
import { fetchCGRefTableByAcftType } from "./cgrefaction";
import { UpdateLmc } from "./LMCupdaeaction";
//Method to check device status
export function add(data) {
  var defer = q.defer();
  var host = Enviornment.host();
  var url = host + "/ramp/trimsheet/lmc/add";
  var DEBUG = Enviornment.debug();

  axios
    .post(url, { data: data })
    .then(function (response) {
      var response_data = response.data;
      console.log("LMCaction add data", response_data);
      if (response.data !== undefined) {
        defer.resolve(response_data);
      } else {
        DEBUG && console.log("Error", response);
        defer.reject({ error: "Something went wrong!" });
      }
    })
    .catch(function (error) {
      console.log(error);

      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        error.response.data.message !== undefined
      ) {
        DEBUG && console.log("Error", error.response.data);
        defer.reject({ error: error.response.data.message });
      } else {
        DEBUG && console.log("Error", error);
        defer.reject({ error: "Something went wrong!" });
      }
    });
  return defer.promise;
}
export function CalculateLMC(data, trimSheet) {
  var defer = q.defer();
  var fleet_info_for_aircraft = data.fleetinfo;
  var lnt = trimSheet;
  //lnt past trimsheet data, lmcLnt new changes trimsheet data

  var lmcLnt = {
    ac_type: data.ac_type,
    config: fleet_info_for_aircraft.CONFIG,
    crew: "",
    COMPWT: 0,
    CABBGWT: Number(data.cabin_baggage),
    cabin_baggage: Number(data.cabin_baggage),
    cabin_baggage_final: Number(data.cabin_baggage_final),
    PAXWT: 0,
    total_load: 0,
    dow: 0,
    zfw: 0,
    mzfw: fleet_info_for_aircraft.MZFW,
    take_of_fuel: Number(data.take_of_fuel_in),
    tow: 0,
    trip_fuel: Number(data.trip_fuel_in),
    law: 0,
    olw: Number(data.olw),
    otow: Number(data.otow),
    mlw: 0,
    underload: 0,
    doi: 0,
    lizfw: 0,
    litow: 0,
    lilw: 0,
    zfmac: 0,
    towmac: 0,
    lwmac: 0,
    pax: data.pax,
    cargo: data.cargo,
    adult: 0,
    child: 0,
    infant: 0,
    paxAcm: 0,
    ttl: 0,
    sob: 0,
    thrust: "",
    Midjump: parseInt(data.Midjump),
    trim_officer: data.trim_officer.replace(
      /[&\/\\#,+()$~%.'":*?<>{}@!^]/g,
      ""
    ),
    load_officer: data.load_officer.replace(
      /[&\/\\#,+()$~%.'":*?<>{}@!^]/g,
      ""
    ),
    si: data.si,
    captain: data.captain.replace(/[&\/\\#,+()$~%.'":*?<>{}@!^]/g, ""),
    isSync: false,
    isOfflineGenerated: true,
    created_at: new Date(),
    Aftrjump: Number(data.Aftrjump),
    Fwdjump: Number(data.Fwdjump),
    Aftrgalley: Number(data.Aftrgalley),
    Fwdgalley: Number(data.Fwdgalley),
    CockpitOccupantPerKG: Number(data.cockpitnew),
    FirstObserver: Number(data.FirstObserver),
    SecondObserver: Number(data.SecondObserver),
    PortableWater: Number(data.PortableWater),
    SuperNumeraries: Number(data.SuperNumeraries),
    SpareWheels: Number(data.SpareWheels),
    ETOPEquipments: Number(data.ETOPEquipments),
    passenger: 0,
  };
  var ltadjust = null;
  var cgrefTable = JSON.parse(window.localStorage.getItem("cgrefTable"));
  var fuelTable = JSON.parse(window.localStorage.getItem("fuelTable"));

  lnt["Load_Officer"] = lmcLnt["load_officer"];
  lnt["Trim_Officer"] = lmcLnt["trim_officer"];
  lnt["CAPTAIN"] = lmcLnt["captain"];
  lnt["specialStr"] = lmcLnt["si"]; //If there is change in cargo baggage window in field load type & remark so recomupute SI values
  lnt["FOB"] = parseInt(lmcLnt["take_of_fuel"]);
  lnt["TRIP_FUEL"] = parseInt(lmcLnt["trip_fuel"]);
  lnt["cabinBagagge"] = parseInt(lmcLnt["cabin_baggage_final"]);
  lnt["AdjustStr"] = data.AdjustStr;

  lnt["cockpitOccupent"] = data.cockpitOccupent_final;
  lnt["Aftrgalley"] = data.Aftrgalley;
  lnt["Fwdgalley"] = parseInt(data.Fwdgalley);
  lnt["Aftrjump"] = parseInt(data.Aftrjump);
  lnt["Fwdjump"] = parseInt(data.Fwdjump);
  lnt["Midjump"] = parseInt(data.Midjump);
  lnt["RTOW"] = data.rtow;
  lnt["OLW"] = Number(data.olw);
  lnt["OTOW"] = Number(data.otow);
  lnt["CargoLDM"] = data.CargoLDM;
  lnt["BagLDM"] = data.BagLDM;
  lnt["LWindex"] = data.trimSheet.LWindex;
  lnt["LWMAC"] = data.trimSheet.LWMAC;
  lnt["TOWindex"] = data.trimSheet.TOWindex;
  lnt["TOWMAC"] = data.trimSheet.TOWMAC;
  lnt["ZFWindex"] = data.trimSheet.ZFWindex;
  lnt["ZFWMAC"] = data.trimSheet.ZFWMAC;
  lnt["FirstObserver"] = data.FirstObserver_final;
  lnt["SecondObserver"] = data.SecondObserver_final;
  lnt["SuperNumeraries"] = data.SuperNumeraries_final;
  lnt["PortableWater"] = data.PortableWater;
  lnt["SpareWheels"] = data.SpareWheels;
  lnt["ETOPEquipments"] = data.ETOPEquipments;
  lnt["MaxCabinValue"] = data.fleetinfo.MaxCabin;
  lnt["ActLoadDistStr"] = data.ActLoadDistStr;
  lnt["ActLoadDistStrV2"] = data.ActLoadDistStrV2;
  lnt["fleetinfo"] = data.fleetinfo;
  var paxFinalCount = 0;
  Object.keys(data.pax).forEach((x) => {
    var paxIndexArray = data.pax[x].split("/");
    lmcLnt["adult"] = lmcLnt["adult"] + parseInt(paxIndexArray[0]);
    lmcLnt["child"] = lmcLnt["child"] + parseInt(paxIndexArray[1]);
    lmcLnt["infant"] = lmcLnt["infant"] + parseInt(paxIndexArray[2]);
    lmcLnt["paxAcm"] = lmcLnt["paxAcm"] + parseInt(paxIndexArray[3]);
    paxFinalCount =
      paxFinalCount + parseInt(data.paxAcm[x]) + parseInt(paxIndexArray[3]);
  });

  lnt["ActcrewStr"] =
    parseInt(trimSheet.STDCREW.replace("P", "").split("$")[0]) +
    data.cockpitOccupent_final +
    data.FirstObserver_final +
    data.SecondObserver_final +
    "/" +
    (data.ActcrewStrJump +
      data.SuperNumeraries_final +
      parseInt(paxFinalCount));

  var fuelTable = JSON.parse(window.localStorage.getItem("fuelV2Table"));
  var fuelV2RegNo = JSON.parse(window.localStorage.getItem("regNoFileName"));
  var fileName = fuelV2RegNo[data.regno];
  var fuelTableForActype = fuelTable[fileName];
  var fuelweights1 = Object.keys(fuelTableForActype);

  if (
    fuelTableForActype == null ||
    fuelTableForActype == undefined ||
    fuelweights1.length <= 0
  ) {
    defer.reject("Fuel weight not found");
    return defer.promise;
  }

  var fuelweights = fuelweights1.map(function (d) {
    return parseInt(d);
  });

  fuelweights = fuelweights.sort(function (a, b) {
    return a - b;
  });
  var take_of_fuel_index = null;
  var remaining_fuel_index = null;
  var remaing_fuel_in =
    parseFloat(lmcLnt["take_of_fuel"]) - parseFloat(lmcLnt["trip_fuel"]);

  getFuelIndex(
    parseFloat(lmcLnt["take_of_fuel"]),
    fuelweights,
    fuelTableForActype
  )
    .then((res) => {
      take_of_fuel_index = res;
      console.log(take_of_fuel_index, "...take_of_fuel_index..");
      return getFuelIndex(remaing_fuel_in, fuelweights, fuelTableForActype);
    })
    .then((res) => {
      remaining_fuel_index = res;
      console.log("remaining_fuel_index", remaining_fuel_index);
      return fetchLtAdjustByRegnNo(data.regno);
    })
    .then((result) => {
      if (result === null || result === undefined) {
        defer.reject("LTAdjust is not found");
      }
      console.log("LTAdjust", result);
      ltadjust = result;
      ltadjust.ETOPEquipmentsPerKG = ltadjust.ETOPEquipmentsPerKG
        ? ltadjust.ETOPEquipmentsPerKG
        : 0;
      ltadjust.FirstObserver = ltadjust.FirstObserver
        ? ltadjust.FirstObserver
        : 0;
      ltadjust.MidJumpPerKg = ltadjust.MidJumpPerKg ? ltadjust.MidJumpPerKg : 0;
      ltadjust.PortableWaterPerKG = ltadjust.PortableWaterPerKG
        ? ltadjust.PortableWaterPerKG
        : 0;
      ltadjust.SecondObserver = ltadjust.SecondObserver
        ? ltadjust.SecondObserver
        : 0;
      ltadjust.SpareWheelsPerKG = ltadjust.SpareWheelsPerKG
        ? ltadjust.SpareWheelsPerKG
        : 0;
      ltadjust.Supernumeraries = ltadjust.Supernumeraries
        ? ltadjust.Supernumeraries
        : 0;
      var cgrefTableForActype = cgrefTable[data.ac_type];
      var weights = Object.keys(cgrefTableForActype);
      if (
        cgrefTableForActype == null ||
        cgrefTableForActype == undefined ||
        weights.length <= 0
      ) {
        defer.reject("cgrefTable out of limit");
        return defer.promise;
      }
      console.log(cgrefTableForActype, "Cgref");

      Object.keys(data.pax).forEach((y) => {
        var paxIndexArray = data.pax[y].split("/");
        var x = parseInt(y);

        lnt["C" + parseInt(x + 1) + "Adult"] =
          parseInt(lnt["C" + (x + 1) + "Adult"]) + parseInt(paxIndexArray[0]);
        lnt["C" + (x + 1) + "Child"] =
          parseInt(lnt["C" + (x + 1) + "Child"]) + parseInt(paxIndexArray[1]);
        lnt["C" + (x + 1) + "Infant"] =
          parseInt(lnt["C" + (x + 1) + "Infant"]) + parseInt(paxIndexArray[2]);
        lnt["paxAcm" + (x + 1)] =
          parseInt(data.paxAcm[x]) + parseInt(paxIndexArray[3]);
      });

      Object.keys(data.cargo).forEach((y) => {
        // var cargoIndexArray =  data.cargo[y].split('/');
        var x = parseInt(y);
        console.log("cargoIndexArray", x);
        // lnt["cmpt"+parseInt(x+1)] = parseInt(lnt["cmpt"+(x+1)]) + parseInt(cargoIndexArray[0]);
      });
      var totalCmpWt = 0;
      Object.values(data.cargo).forEach((x) => {
        //      totalCmpWt   = totalCmpWt + parseInt(x);
      });

      totalCmpWt = parseFloat(data.presentCmptWt - data.prevCmptWt);

      var delta_weight = fixedNumber(
        (parseInt(lmcLnt["adult"]) +
          parseInt(lmcLnt["child"]) +
          parseInt(lmcLnt["paxAcm"])) *
          75 +
          totalCmpWt +
          +(parseInt(lmcLnt["Fwdgalley"]) + parseInt(lmcLnt["Aftrgalley"])) +
          lmcLnt["CockpitOccupantPerKG"] * 90 +
          lmcLnt["Aftrjump"] * 90 +
          lmcLnt["take_of_fuel"]
      );
      // console.log("delta_weight in lmc",delta_weight);
      // lnt.ZFW               =     fixedNumber((lnt.ZFW + delta_weight));
      // lnt.TOW               =     fixedNumber((lnt.TOW + delta_weight));
      // lnt.LAW               =     fixedNumber((lnt.TOW - parseInt(lmcLnt['trip_fuel'])));

      var cabinIndexArray = fleet_info_for_aircraft.CabinIndex.split("$");
      var count = 0;
      cabinIndexArray.forEach((x) => {
        count = count + parseFloat(x);
      });

      var cmpIndexArray = fleet_info_for_aircraft.CompIndex.split("$");

      var cmp_count = 0;
      cmpIndexArray.forEach((x) => {
        cmp_count = cmp_count + parseFloat(x);
      });

      var TotalCabinIndex = 0;
      var TotalCompIndex = 0;
      var TotalpaxAcmIndex = 0;
      for (var p = 0; p < fleet_info_for_aircraft.MaxCabin; p++) {
        var paxIArray = data.pax[p].split("/");
        var cabinIndexA =
          paxIArray[0] * 75 * cabinIndexArray[p] +
          paxIArray[1] * 35 * cabinIndexArray[p] +
          paxIArray[2] * 10 * cabinIndexArray[p];
        var paxAcmIndex = paxIArray[3] * 85 * cabinIndexArray[p];
        console.log("ppppppppppp", p);
        console.log("cabinIndexArray[p]", cabinIndexArray[p]);
        TotalCabinIndex = TotalCabinIndex + cabinIndexA;
        TotalpaxAcmIndex = TotalpaxAcmIndex + paxAcmIndex;
        console.log("TotalpaxAcmIndex", TotalpaxAcmIndex);
      }

      for (var q = 0; q < fleet_info_for_aircraft.MaxCompartment; q++) {
        if (!isNaN(data.presentCmptWtArray[q])) {
          var compIndexA =
            parseFloat(data.presentCmptWtArray[q] - data.prevCmptWtArray[q]) *
            cmpIndexArray[q];
          TotalCompIndex =
            TotalCompIndex + (Number.isNaN(compIndexA) ? 0 : compIndexA);
        }
      }
      // if(data.ac_type !== 'Q400'){
      var afterJumpIndex = parseFloat(ltadjust.AftJumpPerKG);
      var fwdJumpIndex = parseFloat(ltadjust.FwdJumpPerKg);
      var midJumpIndex = parseFloat(ltadjust.MidJumpPerKg);

      //}

      var CockpitOccupantPerKG = 0;
      // if(parseFloat(data.cockpitnew) > 0){
      CockpitOccupantPerKG = parseFloat(ltadjust.CockpitOccupantPerKG);
      // }

      var FwdGalleyPerKG = 0;
      // if(parseFloat(data.Fwdgalley) > 0){
      if (ltadjust.FwdGalleyPerKG != null)
        FwdGalleyPerKG = parseFloat(ltadjust.FwdGalleyPerKG); //(Number.isNaN(ltadjust.FwdGalleyPerKG) ? 0 : parseFloat(ltadjust.FwdGalleyPerKG));
      // }

      var AftGalleyPerKG = 0;
      // if(parseFloat(data.Aftrgalley) > 0){
      if (ltadjust.AftGalleyPerKG != null)
        AftGalleyPerKG = parseFloat(ltadjust.AftGalleyPerKG);
      // }
      var LmcPaxWeight = fixedNumber(
        parseInt(lmcLnt["adult"] * 75) +
          parseInt(lmcLnt["child"] * 35) +
          parseInt(lmcLnt["infant"] * 10)
      );

      // var LmcPaxWeight            =   fixedNumber(parseInt(lmcLnt['adult'] *75) +  parseInt(lmcLnt['child']*35))
      //Anil CockpitOccupantPerKG$ FwdGalleyPerKG$ AftGalleyPerKG$ CabinBaggagePerKG$ AftJumpPerKG$ FwdJumpPerKG$ MidJumpPerKG$ FirstObserver$ SecondObserver$ Supernumeraries $ PortableWater $ SpareWheels $ ETOPEquipments $ CABIN4-14......
      //Anil These weights are missing & need to be added Cabin Baggage,FwdJump, MidJump,FirstObserver,SecondObserver,Supernumeraries, PortableWater, SpareWheels,ETOPEquipments
      //For portabel water for volume and index new logic to be applied will be taken care in next version
      var NewLmcAcmWeight =
        fixedNumber(
          parseInt(lmcLnt["Fwdgalley"]) +
            parseInt(lmcLnt["Aftrgalley"]) +
            parseFloat(lmcLnt["CockpitOccupantPerKG"] * 85) +
            parseFloat(lmcLnt["Aftrjump"] * 85) +
            parseFloat(lmcLnt["Fwdjump"] * 85) +
            parseFloat(lmcLnt["Midjump"] * 85) +
            parseFloat(lmcLnt["paxAcm"]) * 85
        ) +
        parseInt(lmcLnt["cabin_baggage"]) +
        parseInt(lmcLnt["FirstObserver"] * 85) +
        parseInt(lmcLnt["SecondObserver"] * 85) +
        parseInt(lmcLnt["PortableWater"]) +
        parseInt(lmcLnt["SpareWheels"]) +
        parseInt(lmcLnt["ETOPEquipments"]) +
        parseInt(lmcLnt["SuperNumeraries"] * 85);

      //Anil These index are missing & need to be added Cabin Baggage,FwdJump, MidJump,FirstObserver,SecondObserver,Supernumeraries,
      //PortableWater, SpareWheels,ETOPEquipments
      var NewLMCACMIndex =
        parseFloat(data.Fwdgalley * FwdGalleyPerKG) +
        parseFloat(data.Aftrgalley * AftGalleyPerKG) +
        parseFloat(data.cockpitnew * CockpitOccupantPerKG * 85) +
        parseFloat(lmcLnt.Aftrjump * afterJumpIndex * 85) +
        parseFloat(lmcLnt.Fwdjump * fwdJumpIndex * 85) +
        parseFloat(lmcLnt.Midjump * midJumpIndex * 85) +
        parseFloat(lmcLnt.cabin_baggage) *
          parseFloat(ltadjust.CabinBaggagePerKg) +
        parseFloat(lmcLnt.FirstObserver * 85) *
          parseFloat(ltadjust.FirstObserver) +
        parseFloat(lmcLnt.SecondObserver * 85) *
          parseFloat(ltadjust.SecondObserver) +
        parseFloat(lmcLnt.PortableWater) *
          parseFloat(ltadjust.PortableWaterPerKG) +
        parseFloat(lmcLnt.SpareWheels) * parseFloat(ltadjust.SpareWheelsPerKG) +
        parseFloat(lmcLnt.ETOPEquipments) *
          parseFloat(ltadjust.ETOPEquipmentsPerKG) +
        parseFloat(lmcLnt.SuperNumeraries * 85) *
          parseFloat(ltadjust.Supernumeraries) +
        parseFloat(TotalpaxAcmIndex);

      // lnt['dow']   =  Math.round(parseFloat(fleet_info_for_aircraft.OEW) + (parseFloat(lmcLnt['CockpitOccupantPerKG']) *85) + (parseFloat(lmcLnt['paxAcm']) *85) + parseFloat(lmcLnt['Aftrgalley']) + parseFloat(lmcLnt['Fwdgalley']) + (parseFloat(lmcLnt['Aftrjump'])*85));
      // lnt['doi']   =  fixedNumber(parseFloat(fleet_info_for_aircraft.OEW_Index) + ((lmcLnt['CockpitOccupantPerKG']*85*CockpitOccupantPerKG )+ TotalpaxAcmIndex + (lmcLnt['Fwdgalley']*FwdGalleyPerKG) + (lmcLnt['Aftrgalley']*AftGalleyPerKG) + (lmcLnt['Aftrjump']*85*afterJumpIndex )));

      // var delta_index_wo_fuel =   fixedNumber((TotalCabinIndex +TotalpaxAcmIndex )*75+ (TotalCompIndex)+
      //                             (data.Fwdgalley*FwdGalleyPerKG + data.Aftrgalley*AftGalleyPerKG)
      //                             + (data.cockpitnew*CockpitOccupantPerKG)*90+ (afterJumpIndex)*90);
      // console.log("delta_index_wo_fuel",delta_index_wo_fuel)
      // console.log("lnt.LILAW ",lnt.LWindex)

      //calculation start
      // var NewDOW = parseFloat(lnt.OEW + NewLmcAcmWeight); // later check why adding adjust ACM values
      // var NewDOI = parseFloat(lnt.OEW_Index + NewLMCACMIndex);
      var NewDOW =
        parseFloat(lnt.OEW + NewLmcAcmWeight) - parseInt(lmcLnt.cabin_baggage); // later check why adding adjust ACM values
      var NewDOI = parseFloat(lnt.OEW_Index + NewLMCACMIndex);

      //Anil zfw = oew + cabinOutput.CabinTotalWeight + palletsOutput.PalletsTotalWeight + compOutput.CompTotalWeight + adjustOutput.AdjustTotalWeight;
      //Anil Remove data.cabin_baggage and add to adjust
      var NEWZFW = parseFloat(
        lnt.ZFW + LmcPaxWeight + totalCmpWt + NewLmcAcmWeight
      ); // + parseInt(data.cabin_baggage));
      console.log(NEWZFW, "NEWZFW-----------------------------");

      if (NEWZFW > lnt.MZFW) {
        defer.reject(
          "ZFW (" +
            NEWZFW +
            ") should be less than MZFW(" +
            parseFloat(lnt.MZFW) +
            ")"
        );
        return defer.promise;
      }
      TotalCompIndex = Number.isNaN(TotalCompIndex) ? 0 : TotalCompIndex;
      NewLMCACMIndex = Number.isNaN(NewLMCACMIndex) ? 0 : NewLMCACMIndex;
      //  zfwIndex = cabinOutput.CabinTotalIndex + palletsOutput.PalletsTotalIndex + compOutput.CompTotalIndex + oewIndex + adjustOutput.AdjustTotalIndex;
      var NewLIZFW = parseFloat(
        lnt.ZFWindex + TotalCabinIndex + TotalCompIndex + NewLMCACMIndex
      );

      var NewTOW = parseFloat(NEWZFW + lmcLnt["take_of_fuel"]);
      if (NewTOW > lnt.OTOW) {
        defer.reject(
          "TOW (" +
            NewTOW +
            ") should be less than OTOW(" +
            parseFloat(lnt.OTOW) +
            ")"
        );
        return defer.promise;
      }
      if (NewTOW > lnt.MTOW) {
        defer.reject(
          "TOW (" +
            NewTOW +
            ") should be less than MTOW(" +
            parseFloat(lnt.MTOW) +
            ")"
        );
        return defer.promise;
      }

      take_of_fuel_index =
        take_of_fuel_index === null || take_of_fuel_index === undefined
          ? 0
          : take_of_fuel_index;
      var NewLITOW = NewLIZFW + take_of_fuel_index;

      var NewLAW = parseFloat(NewTOW - lmcLnt["trip_fuel"]);
      if (NewLAW > lnt.OLW) {
        defer.reject(
          "LAW (" +
            NewLAW +
            ") should be less than OLW(" +
            parseFloat(lnt.OLW) +
            ")"
        );
        return defer.promise;
      }
      var NewLAW = parseFloat(NewTOW - lmcLnt["trip_fuel"]);
      if (NewLAW > lnt.MLW) {
        defer.reject(
          "LAW (" +
            NewLAW +
            ") should be less than MAXLAW(" +
            parseFloat(lnt.MLW) +
            ")"
        );
        return defer.promise;
      }
      remaining_fuel_index =
        remaining_fuel_index === null || remaining_fuel_index === undefined
          ? 0
          : remaining_fuel_index;
      var NewLILW = NewLIZFW + remaining_fuel_index;

      lnt.doi = NewDOI;
      lnt.dow = NewDOW;
      lnt.ZFW = NEWZFW;
      lnt.TOW = NewTOW;
      lnt.LAW = NewLAW;
      lnt.LWindex = NewLILW;
      lnt.ZFWindex = NewLIZFW;
      lnt.TOWindex = NewLITOW;
      lnt.underLoadLMC = Math.round(
        parseFloat(data.rtow) - parseFloat(lnt.TOW)
      );

      // lnt.LWindex               =   fixedNumber((lnt.LWindex   + delta_index_wo_fuel));
      // lnt.ZFWindex               =   fixedNumber((lnt.ZFWindex   + delta_index_wo_fuel));
      // lnt.TOWindex               =   fixedNumber((lnt.TOWindex   + delta_index_wo_fuel));
      // lnt.LWindex               = fixedNumber(parseFloat(lnt.LWindex) + remaining_fuel_index);

      lnt.LWMAC = fixedNumber(
        ((((lnt.LWindex - fleet_info_for_aircraft["K_Constant"]) *
          fleet_info_for_aircraft["C_Constant"]) /
          lnt.LAW +
          fleet_info_for_aircraft["CG_Ref"] -
          fleet_info_for_aircraft["LeMac"]) /
          fleet_info_for_aircraft["Mac"]) *
          100
      );
      lnt.ZFWMAC = fixedNumber(
        ((((lnt.ZFWindex - fleet_info_for_aircraft["K_Constant"]) *
          fleet_info_for_aircraft["C_Constant"]) /
          lnt.ZFW +
          fleet_info_for_aircraft["CG_Ref"] -
          fleet_info_for_aircraft["LeMac"]) /
          fleet_info_for_aircraft["Mac"]) *
          100
      );
      lnt.TOWMAC = fixedNumber(
        ((((lnt.TOWindex - fleet_info_for_aircraft["K_Constant"]) *
          fleet_info_for_aircraft["C_Constant"]) /
          lnt.TOW +
          fleet_info_for_aircraft["CG_Ref"] -
          fleet_info_for_aircraft["LeMac"]) /
          fleet_info_for_aircraft["Mac"]) *
          100
      );

      // lnt.LWMAC              =   fixedNumber(((((((lnt.LILAW-fleet_info_for_aircraft['K_Constant'])*fleet_info_for_aircraft['C_Constant'])/lnt.LAW)+fleet_info_for_aircraft['CG_Ref'])-fleet_info_for_aircraft['LeMac'])/fleet_info_for_aircraft['Mac'])*100);
      // lnt.ZFWMAC              =   fixedNumber(((((((lnt.LIZFW-fleet_info_for_aircraft['K_Constant'])*fleet_info_for_aircraft['C_Constant'])/lnt.ZFW)+fleet_info_for_aircraft['CG_Ref'])-fleet_info_for_aircraft['LeMac'])/fleet_info_for_aircraft['Mac'])*100);
      // lnt.TOWMAC              =   fixedNumber(((((((lnt.LITOW-fleet_info_for_aircraft['K_Constant'])*fleet_info_for_aircraft['C_Constant'])/lnt.TOW)+fleet_info_for_aircraft['CG_Ref'])-fleet_info_for_aircraft['LeMac'])/fleet_info_for_aircraft['Mac'])*100);

      lnt.LWindex = Number.isNaN(lnt.LWindex) ? 0 : lnt.LWindex;
      lnt.ZFWindex = Number.isNaN(lnt.ZFWindex) ? 0 : lnt.ZFWindex;
      lnt.TOWindex = Number.isNaN(lnt.TOWindex) ? 0 : lnt.TOWindex;
      lnt.LWMAC = Number.isNaN(lnt.LWMAC) ? 0 : lnt.LWMAC;
      lnt.ZFWMAC = Number.isNaN(lnt.ZFWMAC) ? 0 : lnt.ZFWMAC;
      lnt.TOWMAC = Number.isNaN(lnt.TOWMAC) ? 0 : lnt.TOWMAC;

      //                 lnt.created_at          =   moment().toDate();
      //                 lnt.isSync          =   false;
      //                 lnt.active          =   null;
      //                 lnt.isOfflineGenerated  =   false;
      //                 var auth            =   JSON.parse(window.localStorage.getItem("auth_user"))
      //                 lnt.PreparedBy      =   auth.user_name;

      weights.forEach(function (d) {
        d = parseInt(d);
      });

      weights = weights.sort();

      return checkZFWLimit(data.regno, lnt.ZFW, lnt.LAW);
    })
    .then((resul) => {
      var cg_limit_zfw = resul;
      console.log(cg_limit_zfw, "zfw limit");

      // var weight_zfw = getNearestWeight(weights,lnt.ZFW);
      // console.log(weight_zfw);
      // var cg_limit_zfw  = cgrefTableForActype[weight_zfw];

      if (
        lnt.ZFWMAC < cg_limit_zfw["Fwd_Zfw_Limit"] ||
        lnt.ZFWMAC > cg_limit_zfw["Aft_Zfw_Limit"]
      ) {
        defer.reject(
          "CG ZFW(" +
            lnt.ZFWMAC +
            ")  not in limit (" +
            fixedNumber(cg_limit_zfw["Fwd_Zfw_Limit"]) +
            "/" +
            fixedNumber(cg_limit_zfw["Aft_Zfw_Limit"]) +
            ")."
        );
        return defer.promise;
      }
      lnt["ZFWMACFWD"] = cg_limit_zfw["Fwd_Zfw_Limit"];
      lnt["ZFWMACAFT"] = cg_limit_zfw["Aft_Zfw_Limit"];

      // var weight_tow = getNearestWeight(weights,lnt.TOW);
      return checkTOWLimit(data.regno, lnt.TOW, lnt.LAW);
    })
    .then((resu) => {
      var cg_limit_tow = resu;
      console.log(cg_limit_tow, "cg_limit_tow limit");
      // var cg_limit_tow  = cgrefTableForActype[weight_tow];
      // console.log(weight_tow,'weight_tow');

      if (
        lnt.TOWMAC < cg_limit_tow["Fwd_Tow_Limit"] ||
        lnt.TOWMAC > cg_limit_tow["Aft_Tow_Limit"]
      ) {
        defer.reject(
          "CG TOW(" +
            lnt.TOWMAC +
            ")  not in limit (" +
            fixedNumber(cg_limit_tow["Fwd_Tow_Limit"]) +
            "/" +
            fixedNumber(cg_limit_tow["Aft_Tow_Limit"]) +
            ")."
        );
        return defer.promise;
      }
      lnt["TOWMACFWD"] = cg_limit_tow["Fwd_Tow_Limit"];
      lnt["TOWMACAFT"] = cg_limit_tow["Aft_Tow_Limit"];

      // var weight_law = getNearestWeight(weights,lnt.LAW);
      // console.log(weight_law);
      return checkLAWLimit(data.regno, lnt.LAW);
    })
    .then((res) => {
      var cg_limit_law = res;
      console.log(cg_limit_law, "cg_limit_law limit");
      // var cg_limit_law  = cgrefTableForActype[weight_law];

      if (
        lnt.LWMAC < cg_limit_law["Fwd_Law_Limit"] ||
        lnt.LWMAC > cg_limit_law["Aft_Law_Limit"]
      ) {
        defer.reject(
          "CG LAW(" +
            lnt.LWMAC +
            ")  not in limit (" +
            fixedNumber(cg_limit_law["Fwd_Law_Limit"]) +
            "/" +
            fixedNumber(cg_limit_law["Aft_Law_Limit"]) +
            ")."
        );
        return defer.promise;
      }
      lnt["LWMACFWD"] = cg_limit_law["Fwd_Law_Limit"];
      lnt["LWMACAFT"] = cg_limit_law["Aft_Law_Limit"];
      return fetchStabTrimThrustRegnNo(data.regno, data.ac_type);
    })
    .then((stabthrust) => {
      console.log("stabthrust", stabthrust);
      var _promise = [];
      var res = data.regno.substr(0, 5);
      console.log("split res 1", res);
      if (
        data.ac_type !== "Q400" &&
        res !== "VT-MX" &&
        stabthrust.TableName !== null
      ) {
        var tableArray = stabthrust.TableName.split(",");
        console.log("lnt['TOWMAC']", lnt["TOWMAC"]);
        tableArray.forEach((x) => {
          _promise.push(
            fetchStabTrimDataTableName(x, lnt["TOW"], lnt["TOWMAC"])
          );
        });
      }
      return Promise.all(_promise);
    })
    .then((stabdata) => {
      
      lnt["thrust"] = JSON.stringify(stabdata);
      var thrust = [];
      thrust = JSON.parse(lnt["thrust"]);
      console.log("thrust JSON.parse", thrust);
      var thrus = null;
      var t = 0;
      thrust.forEach((item, x) => {
        if (thrus === null) {
          console.log("thrust", lnt["Thrust" + (t + 1)], parseInt(item.Thrust));
          console.log("Flap1", lnt["T" + (t + 1) + "Flap1"], item.Flap);
          console.log(
            "Stab1",
            lnt["T" + (t + 1) + "Stab1"],
            fixed2Number(item.Stab)
          );
          lnt["Thrust" + (t + 1)] = parseInt(item.Thrust);
          lnt["T" + (t + 1) + "Flap1"] = item.Flap;
          lnt["T" + (t + 1) + "Stab1"] = Number(fixed2Number(item.Stab));
          thrus = parseInt(item.Thrust);
          t = t + 1;
        } else if (thrus === parseInt(item.Thrust)) {
          console.log("Flap2", lnt["T" + t + "Flap2"], item.Flap);
          console.log("Stab2", lnt["T" + t + "Stab2"], fixed2Number(item.Stab));
          lnt["T" + t + "Flap2"] = item.Flap;
          lnt["T" + t + "Stab2"] = Number(fixed2Number(item.Stab));
          thrus = null;
        }
        console.log("thrus", thrus, t);
      });
      // lnt['ActcrewStr']   = data.ActcrewStr;
      lnt["STDCREW"] = fleet_info_for_aircraft.STDCREW;
      var cabArray = [];
      var cmptArray = [];
      for (var i = 0; i < lnt.MaxCabin; i++) {
        cabArray.push(
          lnt["C" + (i + 1) + "Adult"] +
            "/" +
            lnt["C" + (i + 1) + "Child"] +
            "/" +
            lnt["C" + (i + 1) + "Infant"]
        );
      }
      var ActCabStr = cabArray.join("$");
      lnt["ActCabStr"] = ActCabStr;

      for (var i = 0; i < lnt.MaxCompartment; i++) {
        cmptArray.push(lnt["cmpt" + (i + 1)]);
      }
      var ActCompStr = cmptArray.join("$");

      // var ActCompStr  =  String(lnt.cmpt1+"$"+lnt.cmpt2+"$"+lnt.cmpt3+"$"+lnt.cmpt4);
      lnt["ActCompStr"] = ActCompStr;

      // var thrust      =   JSON.parse(data.thrust)
      // console.log("thrust",thrust)

      // var thrustArray   = [];
      // var flapArray     = [];
      // var stabArray     = [];

      // for(var i =0;i<thrust.length;i++){
      //     thrustArray.push(parseInt(thrust[i].Thrust))
      //     flapArray.push(thrust[i].Flap)
      //     stabArray.push(fixed1Number(thrust[i].Stab))
      // }
      // lnt['ThrustValues']    =  thrustArray.join("$");
      // lnt['FlapValues']      =  flapArray.join("$");
      // lnt['StabValues']      =  stabArray.join("$");
      // console.log("ThrustValues",lnt['ThrustValues']);
      // console.log("FlapValues",lnt['FlapValues']);
      // console.log("StabValues",lnt['StabValues']);

      console.log("lnt", lnt);

      return fetchTrimSheetforFlight(
        lnt["Flight_no"],
        lnt["Flight_Date"],
        lnt["Source"],
        lnt["Destination"]
      );
    })
    .then((ress) => {
      console.log(ress)
      if (
        ress.ActCabStr === lnt["ActCabStr"] &&
        ress.ActCompStr === lnt["ActCompStr"] &&
        ress.Acft_Regn === lnt["Acft_Regn"] &&
        ress.FOB === parseInt(lnt["FOB"]) &&
        ress.TRIP_FUEL === parseInt(lnt["TRIP_FUEL"]) &&
        ress.OLW === lnt["OLW"] &&
        ress.OTOW === lnt["OTOW"] &&
        ress.ActcrewStr === lnt["ActcrewStr"] &&
        ress.Trim_Officer === lnt["Trim_Officer"] &&
        ress.Load_Officer === lnt["Load_Officer"] &&
        ress.CAPTAIN === lnt["CAPTAIN"] &&
        ress.specialStr === lnt["specialStr"] &&
        ress.ZFW === lnt["ZFW"] &&
        ress.TOW === lnt["TOW"] &&
        ress.LAW === lnt["LAW"] &&
        ress.OEW === lnt["dow"] &&
        ress.OEW_Index === lnt["doi"]
      ) {
        lnt["EDNO"] = ress.EDNO;
        console.log('true sync')
        // lnt['isSync']  =  true;
      } else {
        lnt["EDNO"] = parseInt(ress.EDNO + 1);
        // lnt['isSync']  =  false;
      }
      console.log('sync') 
      lnt["isSync"] = false;
      lnt["totalLoad"] = data.totalLoad;
      lnt["TrimGenTimeUTC"] = moment().subtract("minutes", "330").toISOString();

      if (lnt.Acft_Type == "Q400") {
        lnt["TargetTOWMAC"] = 24;
      } else {
        lnt["TargetTOWMAC"] = 27 - (70 - lnt.TOW / 100) * 0.1;
      }
      lnt["DeviationTOWMAC"] = lnt.TargetTOWMAC - lnt.TOWMAC;
      lnt["AdultLDM"] = ress.AdultLDM;
      lnt["InfantLDM"] = ress.InfantLDM;
      lnt["TotalLDM"] = ress.TotalLDM;

      return UpdateLmc(lnt, data);
    })
    .then((res) => {
      console.log(res)
      console.log(lnt)
      defer.resolve(lnt);
    })
    .catch((er) => {
      defer.reject(er);
      console.log(er);
    });
  return defer.promise;
}

function fixedNumber(number) {
  return parseFloat(number.toFixed(2));
}
export function OfflineCalculateLMC(data) {
  var defer = q.defer();
  console.log("..Data...Coming...", data);

  var user = JSON.parse(window.localStorage.getItem("auth_user"));
  var fleetinfo = data.fleetinfo;
  var lnt = {
    id: Math.floor(Math.random() * 100000),
    flight_date: moment(moment(data.flight_date)).format("YYYY-MM-DD"),
    flight_no: data.flight_no.toUpperCase(),
    trim_gen_time: moment().toISOString(),
    edition_no: 1,
    source: data.source.toUpperCase(),
    destination: data.destination.toUpperCase(),
    std: moment(moment(data.stddate)).format(),
    sta: moment(moment(data.stadate)).format(),
    regno: data.regno,
    ac_type: data.ac_type,
    config: fleetinfo.CONFIG,
    crew: "",
    COMPWT: 0,
    CABBGWT: data.cabin_baggage_final,
    PAXWT: 0,
    total_load: 0,
    dow: 0,
    zfw: 0,
    mzfw: fleetinfo.MZFW,
    take_of_fuel: data.take_of_fuel_in,
    tow: 0,
    trip_fuel: data.trip_fuel_in,
    law: 0,
    olw: data.olw,
    otow: data.otow,
    mlw: 0,
    underload: 0,
    doi: 0,
    lizfw: 0,
    litow: 0,
    lilw: 0,
    zfmac: 0,
    towmac: 0,
    lwmac: 0,
    pax: data.pax,
    cargo: data.cargo,
    adult: 0,
    child: 0,
    infant: 0,
    paxAcm: 0,
    ttl: 0,
    sob: 0,
    thrust: "",
    loginId: user.user_name,
    trim_officer: data.trim_officer.replace(
      /[&\/\\#,+()$~%.'":*?<>{}@!^]/g,
      ""
    ),
    load_officer: data.load_officer.replace(
      /[&\/\\#,+()$~%.'":*?<>{}@!^]/g,
      ""
    ),
    si: data.si,
    captain: data.captain.replace(/[&\/\\#,+()$~%.'":*?<>{}@!^]/g, ""),
    isSync: false,
    isOfflineGenerated: true,
    created_at: momentTz.tz().format("YYYY-MM-DD"),
  };

  var ZFWLimit = null;
  var TOWLimit = null;
  var LAWLimit = null;

  // checkZFWLimit(lnt['regno'],lnt['zfw'],lnt['law']).then((resul)=>{
  //     ZFWLimit = resul
  //     console.log(ZFWLimit,"zfw limit")
  //     return checkTOWLimit(lnt['regno'],lnt['tow'],lnt['law'])
  // }).then((resu)=>{
  //     TOWLimit  = resu;
  //     console.log(TOWLimit,"TOWLimit limit")

  //     return checkLAWLimit(lnt['regno'],lnt['law'])
  // }).then((res)=>{
  //     LAWLimit  = res
  //     console.log(LAWLimit,"LAWLimit limit")

  // }).catch((er)=>{
  //     console.log(er)
  //     defer.reject(er)
  // })

  var fuelTable = JSON.parse(window.localStorage.getItem("fuelV2Table"));
  var fuelV2RegNo = JSON.parse(window.localStorage.getItem("regNoFileName"));
  var fileName = fuelV2RegNo[data.regno];
  var fuelTableForActype = fuelTable[fileName];
  var fuelweights1 = Object.keys(fuelTableForActype);

  if (
    fuelTableForActype == null ||
    fuelTableForActype == undefined ||
    fuelweights1.length <= 0
  ) {
    defer.reject("Fuel weight not found");
    return defer.promise;
  }

  var fuelweights = fuelweights1.map(function (d) {
    return parseInt(d);
  });

  fuelweights = fuelweights.sort(function (a, b) {
    return a - b;
  });

  Object.keys(data.pax).forEach((x) => {
    var paxIndexArray = data.pax[x].split("/");
    lnt["adult"] = lnt["adult"] + parseInt(paxIndexArray[0]);
    lnt["child"] = lnt["child"] + parseInt(paxIndexArray[1]);
    lnt["infant"] = lnt["infant"] + parseInt(paxIndexArray[2]);
    lnt["paxAcm"] = lnt["paxAcm"] + parseInt(paxIndexArray[3]);
    lnt["C" + (parseInt(x) + 1) + "Adult"] = parseInt(paxIndexArray[0]);
    lnt["C" + (parseInt(x) + 1) + "Child"] = parseInt(paxIndexArray[1]);
    lnt["C" + (parseInt(x) + 1) + "Infant"] = parseInt(paxIndexArray[2]);
    lnt["paxAcm" + (parseInt(x) + 1)] = parseInt(paxIndexArray[3]);
  });
  lnt["crew"] =
    data.cockpit +
    data.cockpitnew +
    "/" +
    (data.crew + lnt["paxAcm"] + data.Aftrjump);

  Object.keys(data.cargo).forEach((y) => {
    var cargoIndexArray = data.cargo[y].split("/");
    var x = parseInt(y);
    console.log("cargoIndexArray", cargoIndexArray);
    lnt["cmpt" + parseInt(x + 1)] = parseInt(cargoIndexArray[0]);
  });
  var totalCmpWt = 0;
  Object.values(data.cargo).forEach((x) => {
    totalCmpWt = totalCmpWt + parseInt(x);
  });

  lnt["COMPWT"] = totalCmpWt;
  var take_of_fuel_index = null;
  var remaining_fuel_index = null;
  var remaing_fuel_in =
    parseFloat(data.take_of_fuel_in) - parseFloat(data.trip_fuel_in);
  var afterJump = 0;
  if (data.ac_type !== "Q400") {
    afterJump = data.Aftrjump;
  }

  getFuelIndex(
    parseFloat(data.take_of_fuel_in),
    fuelweights,
    fuelTableForActype
  )
    .then((res) => {
      take_of_fuel_index = res;
      console.log(take_of_fuel_index, "...take_of_fuel_index..");
      return getFuelIndex(remaing_fuel_in, fuelweights, fuelTableForActype);
    })
    .then((res) => {
      remaining_fuel_index = res;

      lnt["PAXWT"] = Math.round(
        parseInt(lnt["adult"]) * 75 +
          parseInt(lnt["child"]) * 35 +
          parseInt(lnt["infant"]) * 10
      );

      lnt["total_load"] = Math.round(
        parseInt(lnt["adult"]) * 75 +
          parseInt(lnt["child"]) * 35 +
          parseInt(lnt["infant"]) * 10 +
          totalCmpWt +
          parseFloat(data.cabin_baggage)
      );

      lnt["dow"] = Math.round(
        parseFloat(fleetinfo.OEW) +
          parseFloat(data.cockpitnew) * 85 +
          parseFloat(lnt["paxAcm"]) * 85 +
          parseFloat(data.Aftrgalley) +
          parseFloat(data.Fwdgalley) +
          parseFloat(afterJump) * 85
      );

      lnt["zfw"] = Math.round(
        parseFloat(lnt["total_load"]) + parseFloat(lnt["dow"])
      );

      if (parseFloat(lnt["zfw"]) > parseFloat(fleetinfo.MZFW)) {
        defer.reject(
          "ZFW (" +
            parseFloat(lnt["zfw"]) +
            ") should be less than MZFW(" +
            parseFloat(fleetinfo.MZFW) +
            ")"
        );
        return defer.promise;
      }

      lnt["tow"] = Math.round(
        parseFloat(lnt["zfw"]) + parseFloat(data.take_of_fuel_in)
      );

      lnt["law"] = Math.round(
        parseFloat(lnt["tow"]) - parseFloat(data.trip_fuel_in)
      );

      if (parseFloat(data.olw) < parseFloat(lnt["law"])) {
        defer.reject(
          "Law (" +
            parseFloat(lnt["law"]) +
            ") should be less than OLW(" +
            parseFloat(data.olw) +
            ")"
        );
        return defer.promise;
      }

      if (parseFloat(data.rtow) < parseFloat(lnt["tow"])) {
        defer.reject(
          "TOW (" +
            parseFloat(lnt["tow"]) +
            ") should be less than RTOW(" +
            parseFloat(data.rtow) +
            ")"
        );
        return defer.promise;
      }

      lnt["underload"] = Math.round(
        parseFloat(data.rtow) - parseFloat(lnt["tow"])
      );

      return fetchLtAdjustByRegnNo(data.regno);
    })
    .then((res) => {
      var cabinIndexArray = fleetinfo.CabinIndex.split("$");
      var count = 0;
      cabinIndexArray.forEach((x) => {
        count = count + parseFloat(x);
      });

      var cmpIndexArray = fleetinfo.CompIndex.split("$");

      var cmp_count = 0;
      cmpIndexArray.forEach((x) => {
        cmp_count = cmp_count + parseFloat(x);
      });

      var TotalCabinIndex = 0;
      var TotalCompIndex = 0;
      var TotalpaxAcmIndex = 0;
      for (var p = 0; p < fleetinfo.MaxCabin; p++) {
        var paxIArray = data.pax[p].split("/");
        var cabinIndexA =
          paxIArray[0] * 75 * cabinIndexArray[p] +
          paxIArray[1] * 35 * cabinIndexArray[p];
        var paxAcmIndex = paxIArray[3] * 85 * cabinIndexArray[p];
        TotalCabinIndex = TotalCabinIndex + cabinIndexA;
        TotalpaxAcmIndex = TotalpaxAcmIndex + paxAcmIndex;
      }

      for (var q = 0; q < fleetinfo.MaxCompartment; q++) {
        var compIndexA = parseFloat(data.cargo[q]) * cmpIndexArray[q];
        TotalCompIndex = TotalCompIndex + compIndexA;
      }

      var afterJumpIndex = 0;
      if (data.ac_type !== "Q400" && parseFloat(data.Aftrjump) > 0) {
        afterJumpIndex = parseFloat(res.AftJumpPerKG);
      }

      // var acm_index   = 0
      // if(parseFloat(data.acm) > 0){
      //     acm_index = ( parseFloat(res.CockpitOccupantPerKG) + parseFloat(res.FwdGalleyPerKG) + parseFloat(res.AftGalleyPerKG) + parseFloat(afterJumpIndex));
      // }

      var CockpitOccupantPerKG = 0;
      if (parseFloat(data.cockpitnew) > 0) {
        CockpitOccupantPerKG = parseFloat(res.CockpitOccupantPerKG);
      }

      var FwdGalleyPerKG = 0;
      if (parseFloat(data.Fwdgalley) > 0) {
        FwdGalleyPerKG = parseFloat(res.FwdGalleyPerKG);
      }

      var AftGalleyPerKG = 0;
      if (parseFloat(data.Aftrgalley) > 0) {
        AftGalleyPerKG = parseFloat(res.AftGalleyPerKG);
      }
      console.log("CockpitOccupantPerKG", CockpitOccupantPerKG);
      console.log("FwdGalleyPerKG", FwdGalleyPerKG);
      console.log("AftGalleyPerKG", AftGalleyPerKG);
      console.log("afterJumpIndex", afterJumpIndex);
      console.log("fleetinfo.OEW_Index", fleetinfo.OEW_Index);
      lnt["doi"] = fixedNumber(
        parseFloat(fleetinfo.OEW_Index) +
          (data.cockpitnew * 85 * CockpitOccupantPerKG +
            TotalpaxAcmIndex +
            data.Fwdgalley * FwdGalleyPerKG +
            data.Aftrgalley * AftGalleyPerKG +
            data.Aftrjump * 85 * afterJumpIndex)
      );

      console.log("dddddoooooiii", lnt["doi"]);
      lnt["lizfw"] = fixedNumber(
        parseFloat(lnt["doi"]) +
          parseFloat(TotalCabinIndex) +
          parseFloat(TotalCompIndex)
      );

      lnt["litow"] = fixedNumber(parseFloat(lnt["lizfw"]) + take_of_fuel_index);

      lnt["lilw"] = fixedNumber(
        parseFloat(lnt["lizfw"]) + remaining_fuel_index
      );

      lnt["zfmac"] = fixedNumber(
        ((((parseFloat(lnt["lizfw"]) - parseFloat(fleetinfo.K_Constant)) *
          parseFloat(fleetinfo.C_Constant)) /
          parseFloat(lnt["zfw"]) +
          parseFloat(fleetinfo.CG_Ref) -
          parseFloat(fleetinfo.LeMac)) /
          parseFloat(fleetinfo.Mac)) *
          100
      );

      lnt["towmac"] = fixedNumber(
        ((((parseFloat(lnt["litow"]) - parseFloat(fleetinfo.K_Constant)) *
          parseFloat(fleetinfo.C_Constant)) /
          parseFloat(lnt["tow"]) +
          parseFloat(fleetinfo.CG_Ref) -
          parseFloat(fleetinfo.LeMac)) /
          parseFloat(fleetinfo.Mac)) *
          100
      );

      lnt["lwmac"] = fixedNumber(
        ((((parseFloat(lnt["lilw"]) - parseFloat(fleetinfo.K_Constant)) *
          parseFloat(fleetinfo.C_Constant)) /
          parseFloat(lnt["law"]) +
          parseFloat(fleetinfo.CG_Ref) -
          parseFloat(fleetinfo.LeMac)) /
          parseFloat(fleetinfo.Mac)) *
          100
      );

      lnt["ttl"] =
        parseFloat(lnt["adult"]) +
        parseFloat(lnt["child"]) +
        parseFloat(lnt["infant"]);

      lnt["sob"] =
        parseFloat(lnt["ttl"]) +
        parseFloat(data.crew) +
        parseFloat(data.cockpit);

      lnt["pax"] = JSON.stringify(data.pax);

      lnt["cargo"] = JSON.stringify(data.cargo);

      return checkZFWLimit(lnt["regno"], lnt["zfw"], lnt["law"]);
    })
    .then((resul) => {
      ZFWLimit = resul;
      console.log(ZFWLimit, "zfw limit");
      return checkTOWLimit(lnt["regno"], lnt["tow"], lnt["law"]);
    })
    .then((resu) => {
      TOWLimit = resu;
      console.log(TOWLimit, "TOWLimit limit");

      return checkLAWLimit(lnt["regno"], lnt["law"]);
    })
    .then((res) => {
      LAWLimit = res;
      console.log(LAWLimit, "LAWLimit limit");
      console.log(ZFWLimit["Fwd_Zfw_Limit"], " ZFWLimit['Fwd_Zfw_Limit']");
      console.log(lnt, "lnt");
      console.log(lnt["zfmac"], "lnt['zfmac']");
      console.log(
        parseFloat(lnt["zfmac"]) < parseFloat(ZFWLimit["Fwd_Zfw_Limit"])
      );

      if (
        lnt["zfmac"] < ZFWLimit["Fwd_Zfw_Limit"] ||
        lnt["zfmac"] > ZFWLimit["Aft_Zfw_Limit"]
      ) {
        defer.reject("CG ZFW not in limit");
        return defer.promise;
      }
      if (
        lnt["towmac"] < TOWLimit["Fwd_Tow_Limit"] ||
        lnt["towmac"] > TOWLimit["Aft_Tow_Limit"]
      ) {
        defer.reject("CG TOW not in limit");
        return defer.promise;
      }
      if (
        lnt["lwmac"] < LAWLimit["Fwd_Law_Limit"] ||
        lnt["lwmac"] > LAWLimit["Aft_Law_Limit"]
      ) {
        defer.reject("CG LAW not in limit");
        return defer.promise;
      }

      lnt["ZFWMACFWD"] = ZFWLimit["Fwd_Zfw_Limit"];
      lnt["ZFWMACAFT"] = ZFWLimit["Aft_Zfw_Limit"];
      lnt["TOWMACFWD"] = TOWLimit["Fwd_Tow_Limit"];
      lnt["TOWMACAFT"] = TOWLimit["Aft_Tow_Limit"];
      lnt["LWMACFWD"] = LAWLimit["Fwd_Law_Limit"];
      lnt["LWMACAFT"] = LAWLimit["Aft_Law_Limit"];
      return fetchStabTrimThrustRegnNo(data.regno, data.ac_type);
    })
    .then((stabthrust) => {
      var _promise = [];
      var res = data.regno.substr(0, 5);
      console.log("split res 1", res);
      if (data.ac_type !== "Q400" && res !== "VT-MX") {
        var tableArray = stabthrust.TableName.split(",");
        console.log("lnt['towmac']", lnt["towmac"]);
        tableArray.forEach((x) => {
          _promise.push(
            fetchStabTrimDataTableName(x, lnt["tow"], lnt["towmac"])
          );
        });
      }
      return Promise.all(_promise);
    })
    .then((stabdata) => {
      lnt["thrust"] = JSON.stringify(stabdata);

      var paxAcm1 =
        lnt["paxAcm1"] === null || lnt["paxAcm1"] === undefined
          ? 0
          : parseInt(lnt["paxAcm1"]);
      var paxAcm2 =
        lnt["paxAcm2"] === null || lnt["paxAcm2"] === undefined
          ? 0
          : parseInt(lnt["paxAcm2"]);
      var paxAcm3 =
        lnt["paxAcm3"] === null || lnt["paxAcm3"] === undefined
          ? 0
          : parseInt(lnt["paxAcm3"]);
      var paxAcm4 =
        lnt["paxAcm4"] === null || lnt["paxAcm4"] === undefined
          ? 0
          : parseInt(lnt["paxAcm4"]);
      var paxAcm5 =
        lnt["paxAcm5"] === null || lnt["paxAcm5"] === undefined
          ? 0
          : parseInt(lnt["paxAcm5"]);
      var paxAcm6 =
        lnt["paxAcm6"] === null || lnt["paxAcm6"] === undefined
          ? 0
          : parseInt(lnt["paxAcm6"]);
      var paxAcm7 =
        lnt["paxAcm7"] === null || lnt["paxAcm7"] === undefined
          ? 0
          : parseInt(lnt["paxAcm7"]);
      var paxAcm8 =
        lnt["paxAcm8"] === null || lnt["paxAcm8"] === undefined
          ? 0
          : parseInt(lnt["paxAcm8"]);

      var cabArray = [];
      var cmptArray = [];
      var AdjustStrv2Array = [];
      var AdjustStrv2 = String(
        data.cockpitOccupent +
          "$" +
          data.Fwdgalley +
          "$" +
          data.Aftrgalley +
          "$" +
          data.cabinBagagge +
          "$" +
          data.Aftrjump +
          "$" +
          data.Fwdjump +
          "$" +
          data.Midjump +
          "$" +
          data.FirstObserver +
          "$" +
          data.SecondObserver +
          "$" +
          data.SuperNumeraries +
          "$" +
          data.PortableWater +
          "$" +
          data.SpareWheels +
          "$" +
          data.ETOPEquipments +
          "$"
      );
      for (var i = 0; i < fleetinfo.MaxCabin; i++) {
        cabArray.push(
          lnt["C" + (i + 1) + "Adult"] +
            "/" +
            lnt["C" + (i + 1) + "Child"] +
            "/" +
            lnt["C" + (i + 1) + "Infant"]
        );
        AdjustStrv2Array.push(lnt["paxAcm" + (i + 1)]);
      }
      var AdjustStrv2ArrayStr = AdjustStrv2Array.join("$");
      AdjustStrv2 = AdjustStrv2 + AdjustStrv2ArrayStr;
      var AdjustStr = AdjustStrv2;
      lnt["AdjustStr"] = AdjustStr;
      var ActCabStr = cabArray.join("$");
      lnt["ActCabStr"] = ActCabStr;

      for (var i = 0; i < fleetinfo.MaxCompartment; i++) {
        cmptArray.push(lnt["cmpt" + (i + 1)]);
      }
      var ActCompStr = cmptArray.join("$");

      // var ActCompStr  =  String(lnt.cmpt1+"$"+lnt.cmpt2+"$"+lnt.cmpt3+"$"+lnt.cmpt4);
      lnt["ActCompStr"] = ActCompStr;

      return fetchLocalOfflineTrimSheets(
        lnt["flight_no"],
        lnt["flight_date"],
        lnt["source"],
        lnt["destination"]
      );
    })
    .then((ress) => {
      console.log("ress...fetchLocalOfflineTrimSheets.");
      console.log(ress);
      for (var o = 0; o < ress.length; o++) {
        var trimpax = JSON.stringify(ress[o].pax);
        var trimcargo = JSON.stringify(ress[o].cargo);
        console.log("result[0]", ress[o]);
        console.log("lntihidfidfdsfdsfidifdf     lnt", lnt);
        console.log("lntihidfidfdsfdsfidifdf     trimpax", trimpax);
        console.log(
          "lntihidfidfdsfdsfidifdf     JSON.stringify(lnt['pax'])",
          JSON.stringify(lnt["pax"])
        );
        console.log(
          "trimpax === JSON.stringify(lnt['pax'])",
          trimpax === JSON.stringify(lnt["pax"])
        );
        console.log(
          "trimcargo === JSON.stringify(lnt['cargo'])",
          trimcargo === JSON.stringify(lnt["cargo"])
        );
        console.log(
          "ress[o].regno === lnt['regno']",
          ress[o].regno === lnt["regno"]
        );
        console.log(
          "ress[o].take_of_fuel === parseInt(lnt['take_of_fuel'])",
          ress[o].take_of_fuel === parseInt(lnt["take_of_fuel"])
        );
        console.log("ress[o].doi === lnt['doi']", ress[o].doi === lnt["doi"]);
        console.log(
          "ress[o].olw === lnt['olw'] && ress[o].otow === lnt['otow']",
          ress[o].olw === lnt["olw"],
          ress[o].otow === lnt["otow"]
        );
        console.log(
          "ress[o].trip_fuel === parseInt(lnt['trip_fuel'])",
          ress[o].trip_fuel === parseInt(lnt["trip_fuel"])
        );
        console.log(
          "ress[o].tow === lnt['tow']  &&  ress[o].law === lnt['law']",
          ress[o].tow === lnt["tow"] && ress[o].law === lnt["law"]
        );
        console.log(
          "ress[o].total_load === lnt['total_load'] && ress[o].crew === lnt['crew'] ",
          ress[o].total_load === lnt["total_load"] &&
            ress[o].crew === lnt["crew"]
        );
        console.log(
          "ress[o].trim_officer === lnt['trim_officer'] && ress[o].load_officer === lnt['load_officer']",
          ress[o].trim_officer === lnt["trim_officer"] &&
            ress[o].load_officer === lnt["load_officer"]
        );
        console.log(
          "ress[o].captain === lnt['captain'] && ress[o].si === lnt['si']",
          ress[o].captain === lnt["captain"] && ress[o].si === lnt["si"]
        );
        console.log("ress[o].zfw === lnt['zfw'] ", ress[o].zfw === lnt["zfw"]);
        if (
          trimpax === JSON.stringify(lnt["pax"]) &&
          trimcargo === JSON.stringify(lnt["cargo"]) &&
          ress[o].regno === lnt["regno"] &&
          ress[o].take_of_fuel === parseInt(lnt["take_of_fuel"]) &&
          ress[o].trip_fuel === parseInt(lnt["trip_fuel"]) &&
          ress[o].olw === lnt["olw"] &&
          ress[o].otow === lnt["otow"] &&
          ress[o].total_load === lnt["total_load"] &&
          ress[o].crew === lnt["crew"] &&
          ress[o].trim_officer === lnt["trim_officer"] &&
          ress[o].load_officer === lnt["load_officer"] &&
          ress[o].captain === lnt["captain"] &&
          ress[o].si === lnt["si"] &&
          ress[o].zfw === lnt["zfw"] &&
          ress[o].tow === lnt["tow"] &&
          ress[o].law === lnt["law"] &&
          ress[o].doi === lnt["doi"]
        ) {
          lnt["edition_no"] = ress[o].edition_no;
          break;
        } else {
          lnt["edition_no"] = parseInt(ress[ress.length - 1].edition_no) + 1;
        }
      }
      console.log("offline lnt", lnt);
      return addTrimSheetLMCOffline(lnt);
    })
    .then((res) => {
      defer.resolve(res);
    })
    .catch((er) => {
      console.log("Error...Thurst");
      defer.reject(er);
    });

  return defer.promise;
}

function getNearestWeight(arr, weight) {
  var delta = 9999999999;
  var nearest_weight = arr[0];
  arr.forEach(function (w) {
    if (w > weight) {
      if (w - weight < delta) {
        delta = w - weight;
        nearest_weight = w;
      }
    } else {
      if (weight - w < delta) {
        delta = weight - w;
        nearest_weight = w;
      }
    }
  });
  return nearest_weight;
}

export function getFuelIndex(fuel, weight, fuelTableForActype) {
  var defer = q.defer();
   var index = 0;
  var index_found = false;
  for (var i = 0; i < weight.length; i++) {
    if (fuelTableForActype[weight[i]].FOB === fuel) {
      index = fuelTableForActype[weight[i]].FOB_Index;
      index_found = true;
      break;
    }
  }
  if (!index_found) {
    var fuel1 = 0;
    var fuel2 = 0;
    var fuelIndex1 = 0;
    var fuelIndex2 = 0;
    for (var j = 0; j < weight.length; j++) {
      if (fuelTableForActype[weight[j]].FOB > fuel) {
        if (j === 0) {
          fuel1 = fuelTableForActype[weight[j]].FOB;
          fuelIndex1 = fuelTableForActype[weight[j]].FOB_Index;
        } else {
          fuel1 = fuelTableForActype[weight[j - 1]].FOB;
          fuelIndex1 = fuelTableForActype[weight[j - 1]].FOB_Index;
        }
        fuel2 = fuelTableForActype[weight[j]].FOB;
        fuelIndex2 = fuelTableForActype[weight[j]].FOB_Index;
        index_found = true;
        break;
      }
    }
    index = parseFloat(
      ((fuel - fuel1) * (fuelIndex2 - fuelIndex1)) / (fuel2 - fuel1) +
        fuelIndex1
    );
    console.log("index", index);
  }
  defer.resolve(parseFloat(index));
  return defer.promise;
}

export function OfflineCalculateLMCOld(data) {
  var defer = q.defer();

  console.log("inside calculate lmc", data);
  var CockpitOccupantPerKG = parseInt(data.cockpit);
  var CrewPerKG = parseInt(data.crew);
  var FwdGalleyPerKG = parseInt(data.Fwdgalley);
  var PassengerInCabin1PerKG = parseInt(data.pax1);
  var PassengerInCabin2PerKG = parseInt(data.pax2);
  var FwdCargoCpt1PerKG = parseInt(data.cargo1);
  var FwdCargoCpt2PerKG = parseInt(data.cargo2);
  var PassengerInCabin3PerKG = parseInt(data.pax3);
  var AftCargoCpt3PerKG = parseInt(data.cargo3);
  var AftCargoCpt4PerKG = parseInt(data.cargo4);
  var AftGalleyPerKG = parseInt(data.Aftrgalley);
  var AftJumpPerKG = parseInt(data.Aftrjump);
  var FwdJumpPerKG = parseInt(data.Fwdjump);
  var MidJumpPerKG = parseInt(data.Midjump);
  var FuelInKG = parseInt(data.fuel_in);
  var TotalFuelInKG = parseInt(data.total_fuel_in);
  var fleet_info_for_aircraft = {};
  var regno = data.regno;
  var ltadjust = {};
  var aircraftype = null;
  var lnt = {
    ms_id: 0,
    FlightNo: "",
    Flight_Date: null,
    Acft_Type: "",
    STD: null,
    TrimSheetTime: null,
    Source: "",
    Destination: "",
    Regn_no: "",
    Crew: CrewPerKG + "/" + CockpitOccupantPerKG,
    ZFW: 0,
    MZFW: 0,
    TOF: 0,
    TOW: 0,
    MTOW: 0,
    TripFuel: 0,
    LAW: 0,
    MLAW: 0,
    underLoad: 0,
    LIZFW: 0,
    LITOW: 0,
    LILAW: 0,
    ZFWMAC: 0,
    MAC: 0,
    TOWMAC: 0,
    LAWMAC: 0,
    Thrust24K: "",
    Flap1: 0,
    Stab1: 0,
    Flap2: 0,
    Stab2: 0,
    Thrust26K: "",
    Flap3: 0,
    Stab3: 0,
    Flap4: 0,
    Stab4: 0,
    cmpt1: 0,
    cmpt2: 0,
    cmpt3: 0,
    cmpt4: 0,
    Adult: 0,
    Child: 0,
    Infant: 0,
    Tpax: 0,
    SOB: 0,
    TransitPax: 0,
    SI: "",
    LoadOfficer: "",
    Captain: "",
    PreparedBy: "",
    Z1a: 0,
    Z1c: 0,
    Z1i: 0,
    Z2a: 0,
    Z2c: 0,
    Z2i: 0,
    Z3a: 0,
    Z3c: 0,
    Z3i: 0,
    active: false,
    isSync: false,
    isOfflineGenerated: false,
    created_at: null,
  };

  var fuelTable = JSON.parse(window.localStorage.getItem("fuelTable"));
  var cgrefTable = JSON.parse(window.localStorage.getItem("cgrefTable"));

  fetchFleetinfoByRegnNo(regno)
    .then((resu) => {
      console.log("fleet info", resu);
      if (resu !== null) {
        fleet_info_for_aircraft = resu;
        aircraftype = resu.AC_TYPE;
      }
      fetchLTAdjustWeightByAcftType(aircraftype)
        .then((result) => {
          console.log("LTAdjust", result);
          if (result === null || result === undefined) {
            defer.reject();
          }
          ltadjust = result;
          var fuelTableForActype = fuelTable[aircraftype];
          var cgrefTableForActype = cgrefTable[aircraftype];
          var weights = Object.keys(cgrefTableForActype);
          var fuelweights = Object.keys(fuelTableForActype);
          if (
            cgrefTableForActype == null ||
            cgrefTableForActype == undefined ||
            weights.length <= 0
          ) {
            defer.reject("Cgref weight not found");
            return defer.promise;
          }

          if (
            fuelTableForActype == null ||
            fuelTableForActype == undefined ||
            fuelweights.length <= 0
          ) {
            defer.reject("Fuel weight not found");
            return defer.promise;
          }
          console.log(fuelTableForActype, "Fuel");
          console.log(cgrefTableForActype, "Cgref");

          weights.forEach(function (d) {
            d = parseInt(d);
          });

          fuelweights.forEach(function (d) {
            d = parseInt(d);
          });

          weights = weights.sort();
          fuelweights = fuelweights.sort();

          var cabin1 = parseInt(lnt.Z1a + lnt.Z1c + PassengerInCabin1PerKG);
          var cabin2 = parseInt(lnt.Z2a + lnt.Z2c + PassengerInCabin2PerKG);
          var cabin3 = parseInt(lnt.Z3a + lnt.Z3c + PassengerInCabin3PerKG);
          if (parseInt(fleet_info_for_aircraft.OALimit) < cabin1) {
            defer.reject("Cabin(Pax1) out of limit");
            return defer.promise;
          }
          if (parseInt(fleet_info_for_aircraft.OBLimit) < cabin2) {
            defer.reject("Cabin(Pax2) out of limit");
            return defer.promise;
          }
          if (parseInt(fleet_info_for_aircraft.OCLimit) < cabin3) {
            defer.reject("Cabin(Pax3) out of limit");
            return defer.promise;
          }
          console.log(cgrefTableForActype, "cgrefTableForActype");
          var delta_weight = fixedNumber(
            (PassengerInCabin1PerKG +
              PassengerInCabin2PerKG +
              PassengerInCabin3PerKG) *
              75 +
              (FwdCargoCpt1PerKG +
                FwdCargoCpt2PerKG +
                AftCargoCpt3PerKG +
                AftCargoCpt4PerKG) +
              +(FwdGalleyPerKG + AftGalleyPerKG) +
              (CockpitOccupantPerKG + CrewPerKG) * 90 +
              (FwdJumpPerKG + AftJumpPerKG + MidJumpPerKG) * 90 +
              TotalFuelInKG
          );
          console.log(delta_weight);
          lnt.cmpt1 = fixedNumber(lnt.cmpt1 + FwdCargoCpt1PerKG);
          console.log("lnt.LILAW ", lnt.cmpt1);
          lnt.cmpt2 = fixedNumber(lnt.cmpt2 + FwdCargoCpt2PerKG);
          lnt.cmpt3 = fixedNumber(lnt.cmpt3 + AftCargoCpt3PerKG);
          lnt.cmpt4 = fixedNumber(lnt.cmpt4 + AftCargoCpt4PerKG);
          lnt.TOF = fixedNumber(lnt.TOF + TotalFuelInKG);
          lnt.Adult = fixedNumber(
            lnt.Adult +
              PassengerInCabin1PerKG +
              PassengerInCabin2PerKG +
              PassengerInCabin3PerKG
          );
          lnt.Tpax = fixedNumber(
            lnt.Tpax +
              PassengerInCabin1PerKG +
              PassengerInCabin2PerKG +
              PassengerInCabin3PerKG
          );
          lnt.SOB = fixedNumber(
            lnt.SOB +
              PassengerInCabin1PerKG +
              PassengerInCabin2PerKG +
              PassengerInCabin3PerKG
          );
          // lnt.ZFW               =     fixedNumber((lnt.ZFW + delta_weight));
          lnt.ZFW = fixedNumber(
            parseInt(fleet_info_for_aircraft.OEW) + delta_weight
          );
          lnt.TOW = fixedNumber(lnt.ZFW + TotalFuelInKG);
          lnt.LAW = fixedNumber(lnt.ZFW + FuelInKG);
          var weight_zfw = getNearestWeight(weights, lnt.ZFW);
          var fuel_weight_law = getNearestWeight(fuelweights, lnt.LAW);
          var fuel_weight_tow = getNearestWeight(fuelweights, lnt.TOW);

          if (parseInt(fleet_info_for_aircraft.CMPT1) < lnt.cmpt1) {
            defer.reject("Cmpt1 out of limit");
            return defer.promise;
          }
          if (parseInt(fleet_info_for_aircraft.CMPT2) < lnt.cmpt2) {
            defer.reject("Cmpt2 out of limit");
            return defer.promise;
          }
          if (parseInt(fleet_info_for_aircraft.CMPT3) < lnt.cmpt3) {
            defer.reject("Cmpt3 out of limit");
            return defer.promise;
          }
          if (parseInt(fleet_info_for_aircraft.CMPT4) < lnt.cmpt4) {
            defer.reject("Cmpt4 out of limit");
            return defer.promise;
          }
          if (parseInt(fleet_info_for_aircraft.MAxFuel) < lnt.TOF) {
            defer.reject("Trip Fuel out of limit");
            return defer.promise;
          }
          var delta_index_wo_fuel = fixedNumber(
            (PassengerInCabin1PerKG * ltadjust["PassengerInCabin1PerKG"] +
              PassengerInCabin2PerKG * ltadjust["PassengerInCabin3PerKG"] +
              PassengerInCabin3PerKG * ltadjust["PassengerInCabin4PerKG"]) *
              75 +
              (FwdCargoCpt1PerKG * ltadjust["FwdCargoCpt1PerKG"] +
                FwdCargoCpt2PerKG * ltadjust["FwdCargoCpt2PerKG"] +
                AftCargoCpt3PerKG * ltadjust["AftCargoCpt3PerKG"] +
                AftCargoCpt4PerKG * ltadjust["AftCargoCpt4PerKG"]) +
              (FwdGalleyPerKG * ltadjust["FwdGalleyPerKG"] +
                AftGalleyPerKG * ltadjust["AftGalleyPerKG"]) +
              CockpitOccupantPerKG * ltadjust["CockpitOccupantPerKG"] * 90 +
              (FwdJumpPerKG * ltadjust["FwdJumpPerKG"] +
                AftJumpPerKG * ltadjust["AftJumpPerKG"] +
                MidJumpPerKG * ltadjust["MidJumpPerKG"]) *
                90
          );
          console.log("delta_index_wo_fuel", delta_index_wo_fuel);

          // lnt.LIZFW               =   fixedNumber((lnt.LIZFW   + delta_index_wo_fuel));
          lnt.LIZFW = fixedNumber(
            parseInt(fleet_info_for_aircraft.OEW_Index) + delta_index_wo_fuel
          );
          lnt.LILAW = fixedNumber(
            lnt.LIZFW +
              parseFloat(fuelTableForActype[fuel_weight_law]["FOB_Index"])
          );
          lnt.LITOW = fixedNumber(
            lnt.LIZFW +
              parseFloat(fuelTableForActype[fuel_weight_tow]["FOB_Index"])
          );

          lnt.LAWMAC = fixedNumber(
            ((((lnt.LILAW - fleet_info_for_aircraft["K_Constant"]) *
              fleet_info_for_aircraft["C_Constant"]) /
              lnt.LAW +
              fleet_info_for_aircraft["CG_Ref"] -
              fleet_info_for_aircraft["LeMac"]) /
              fleet_info_for_aircraft["Mac"]) *
              100
          );
          lnt.ZFWMAC = fixedNumber(
            ((((lnt.LIZFW - fleet_info_for_aircraft["K_Constant"]) *
              fleet_info_for_aircraft["C_Constant"]) /
              lnt.ZFW +
              fleet_info_for_aircraft["CG_Ref"] -
              fleet_info_for_aircraft["LeMac"]) /
              fleet_info_for_aircraft["Mac"]) *
              100
          );
          lnt.TOWMAC = fixedNumber(
            ((((lnt.LITOW - fleet_info_for_aircraft["K_Constant"]) *
              fleet_info_for_aircraft["C_Constant"]) /
              lnt.TOW +
              fleet_info_for_aircraft["CG_Ref"] -
              fleet_info_for_aircraft["LeMac"]) /
              fleet_info_for_aircraft["Mac"]) *
              100
          );
          console.log("lnt.LILAW ", lnt.LILAW);
          console.log("lnt.LIZFW", lnt.LIZFW);
          console.log("lnt.LITOW", lnt.LITOW);
          console.log(
            " lnt.LAWMAC",
            fixedNumber(
              ((((lnt.LILAW - fleet_info_for_aircraft["K_Constant"]) *
                fleet_info_for_aircraft["C_Constant"]) /
                lnt.LAW +
                fleet_info_for_aircraft["CG_Ref"] -
                fleet_info_for_aircraft["LeMac"]) /
                fleet_info_for_aircraft["Mac"]) *
                100
            )
          );
          console.log(" lnt.ZFWMAC", lnt.ZFWMAC);
          console.log("lnt.TOWMAC", lnt.TOWMAC);
          console.log("final1");
          lnt.created_at = moment().format("YYYY-MM-DD HH:mm:ss");
          lnt.TrimSheetTime = moment().format("YYYY-MM-DD HH:mm:ss");
          lnt.STD = moment(data.etddate).format("YYYY-MM-DD HH:mm:ss");
          lnt.Flight_Date = moment().format("YYYY-MM-DD");
          lnt.FlightNo = data.flightNo;
          lnt.isSync = false;
          lnt.ms_id = null;
          lnt.Source = data.source;
          lnt.Destination = data.destination;
          lnt.Regn_no = data.regno;
          lnt.Crew = lnt.Crew;
          lnt.MZFW = fleet_info_for_aircraft.MZFW;
          lnt.MTOW = fleet_info_for_aircraft.MTOW;
          lnt.MLAW = fleet_info_for_aircraft.MLW;
          lnt.TripFuel = FuelInKG;
          var auth = JSON.parse(window.localStorage.getItem("auth_user"));
          lnt.PreparedBy = auth.user_name;
          lnt.isOfflineGenerated = true;
          console.log(weight_zfw);
          var cg_limit_zfw = cgrefTableForActype[weight_zfw];
          console.log(cg_limit_zfw);
          console.log(lnt.ZFWMAC, "lnt.ZFWMAC");
          console.log(
            cg_limit_zfw["Fwd_Zfw_Limit"],
            "cg_limit_zfw['Fwd_Zfw_Limit']"
          );
          console.log(
            cg_limit_zfw["Aft_Zfw_Limit"],
            "cg_limit_zfw['Aft_Zfw_Limit']"
          );
          if (
            lnt.ZFWMAC < cg_limit_zfw["Fwd_Zfw_Limit"] ||
            lnt.ZFWMAC > cg_limit_zfw["Aft_Zfw_Limit"]
          ) {
            defer.reject("CG not in limit.");
            return defer.promise;
          }
          var weight_tow = getNearestWeight(weights, lnt.TOW);

          var cg_limit_tow = cgrefTableForActype[weight_tow];
          console.log(weight_tow, "weight_tow");
          console.log(cg_limit_tow, "cg_limit_tow");
          console.log(lnt.TOWMAC, "lnt.TOWMAC");
          console.log(
            cg_limit_tow["Fwd_Tow_Limit"],
            "cg_limit_tow['Fwd_Tow_Limit']"
          );
          console.log(
            cg_limit_tow["Fwd_Tow_Limit"],
            "cg_limit_tow['Fwd_Tow_Limit']"
          );
          console.log(
            cg_limit_tow["Aft_Tow_Limit"],
            "cg_limit_tow['Aft_Tow_Limit']"
          );
          if (
            lnt.TOWMAC < cg_limit_tow["Fwd_Tow_Limit"] ||
            lnt.TOWMAC > cg_limit_tow["Aft_Tow_Limit"]
          ) {
            defer.reject("CG not in limit.");
            return defer.promise;
          }
          addTrimSheetLMC(lnt).then((res) => {
            console.log(res);
            defer.resolve(res);
          });
        })
        .catch((er) => {
          defer.reject(er);
          console.log(er);
        });
    })
    .catch((er) => {
      defer.reject(er);
      console.log(er);
    });
  return defer.promise;
}

export function fetchLtAdjustByRegnNo(AC_REGN) {
  console.log('  AC_REGN',AC_REGN)
  var defer = q.defer();

  var request = indexedDB.open(Enviornment.get('DB_NAME'), 1);

  request.onsuccess = function (event) {
    var db = event.target.result;
console.log('db',db)
    
    var transaction = db.transaction('ltadjustweightv2','readonly');
    var objectStore = transaction.objectStore('ltadjustweightv2');
    var index = objectStore.index('Regn_no');

   
    var getRequest = index.get(AC_REGN)
    console.log(getRequest)
    getRequest.onsuccess = function (event) {
      var result = event.target.result;
      console.log(result)
      if (result) {
        console.log(result)
        defer.resolve(result);
      } else {
       
        defer.reject("Failed to find the LtAdjust.");
      }
    };

    getRequest.onerror = function (event) {
      console.log(event.target.error);
      defer.reject("Failed to find the LtAdjust.");
    };
  };

  request.onerror = function (event) {
    console.log(event.target.error);
    defer.reject("Failed to open the database.");
  };

  return defer.promise;
}



export function fetchStabTrimDataTableName(tablename, tow, towmac) {
  var defer = q.defer();
  tow = parseFloat(parseInt(tow) / 1000);
  towmac = towmac;

  const openDB = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  openDB.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("stabtrimdata", "readonly");
    const objectStore = transaction.objectStore("stabtrimdata");

    const index = objectStore.index("STABVARIANT");
    const range = IDBKeyRange.only(tablename);
    const getRequest = index.openCursor(range);

    getRequest.onsuccess = function () {
      const cursor = getRequest.result;
      if (cursor) {
        var stabObj = {};
        var stabdatas = [];
        var stabFound = false;

        do {
          stabdatas.push(cursor.value);
        } while (cursor.continue());

        stabObj["Thrust"] = stabdatas[0].THRUST;
        stabObj["Flap"] = stabdatas[0].FLAP;
        stabObj["Stab"] = 0;

        for (var g = 0; g < stabdatas.length; g++) {
          if (
            Number(stabdatas[g].TOW) === Number(tow) &&
            Number(stabdatas[g].TOWMAC) === Number(towmac)
          ) {
            stabObj["Stab"] = stabdatas[g].STAB;
            stabFound = true;
            break;
          }
        }

        var TowSortedArray = [...stabdatas];

            TowSortedArray.sort(function (a, b) {
              const bandA = a.TOW;
              const bandB = b.TOW;
              let comparison = 0;
              if (bandA > bandB) {
                comparison = 1;
              } else if (bandA < bandB) {
                comparison = -1;
              }
              return comparison;
            });

            var TowMacSortedArray = [...stabdatas];

            TowMacSortedArray.sort(function (a, b) {
              const bandA = a.TOWMAC;
              const bandB = b.TOWMAC;

              let comparison = 0;
              if (bandA > bandB) {
                comparison = 1;
              } else if (bandA < bandB) {
                comparison = -1;
              }
              return comparison;
            });
            if (!stabFound) {
              var towLow = 0;
              var towHigh = 0;
              var stab1 = 0;
              var stab2 = 0;
              var sorted_filtered_array = TowSortedArray.filter((item) => {
                if (Number(item.TOWMAC) === Number(towmac)) {
                  return true;
                }
                return false;
              });

              for (var j = 0; j < sorted_filtered_array.length; j++) {
                if (
                  Number(sorted_filtered_array[j].TOW) > Number(tow) &&
                  Number(sorted_filtered_array[j].TOWMAC) === Number(towmac)
                ) {
                  if (j === 0) {
                    towLow = sorted_filtered_array[j].TOW;
                    stab1 = sorted_filtered_array[j].STAB;
                  } else {
                    towLow = sorted_filtered_array[j - 1].TOW;
                    stab1 = sorted_filtered_array[j - 1].STAB;
                  }
                  towHigh = sorted_filtered_array[j].TOW;
                  stab2 = sorted_filtered_array[j].STAB;
                  break;
                }
              }

              if (towLow > 0 && towHigh > 0 && stab1 > 0 && stab2 > 0) {
                stabObj["Stab"] =
                  (tow - towLow) * ((stab2 - stab1) / (towHigh - towLow)) +
                  stab1;
                stabFound = true;
              }
            
            }
            if (!stabFound) {
              var towMacLow = 0;
              var towMacHigh = 0;
              var stab3 = 0;
              var stab4 = 0;

              var sorted_towmac_filtered_array = TowMacSortedArray.filter(
                (item) => {
                  if (Number(item.TOW) === Number(tow)) {
                    return true;
                  }
                  return false;
                }
              );

              for (var k = 0; k < sorted_towmac_filtered_array.length; k++) {
                if (
                  Number(sorted_towmac_filtered_array[k].TOW) === Number(tow) &&
                  Number(sorted_towmac_filtered_array[k].TOWMAC) >
                    Number(towmac)
                ) {
                  if (k === 0) {
                    towMacLow = sorted_towmac_filtered_array[k].TOWMAC;
                    stab3 = sorted_towmac_filtered_array[k].STAB;
                  } else {
                    towMacLow = sorted_towmac_filtered_array[k - 1].TOWMAC;
                    stab3 = sorted_towmac_filtered_array[k - 1].STAB;
                  }
                  towMacHigh = sorted_towmac_filtered_array[k].TOWMAC;
                  stab4 = sorted_towmac_filtered_array[k].STAB;
                  break;
                }
              }

              if (towMacLow > 0 && towMacHigh > 0 && stab3 > 0 && stab4 > 0) {
                stabObj["Stab"] =
                  (towmac - towMacLow) *
                    ((stab4 - stab3) / (towMacHigh - towMacLow)) +
                  stab3;
                stabFound = true;
              }
            }

            if (!stabFound) {
              var TOWlow = 0;
              var TOWMAClow_TOWlow = 0;
              var TOWMAChigh_TOWlow = 0;
              var TOWhigh = 0;
              var TOWMAClow_TOWhigh = 0;
              var TOWMAChigh_TOWhigh = 0;
              var stab5 = 0;
              var stab6 = 0;
              var stab7 = 0;
              var stab8 = 0;
              var stab9 = 0;
              var stab10 = 0;
              for (var m = 0; m < TowSortedArray.length; m++) {
                if (Number(TowSortedArray[m].TOW) > Number(tow)) {
                  if (m === 0) {
                    TOWlow = TowSortedArray[m].TOW;
                  } else {
                    TOWlow = TowSortedArray[m - 1].TOW;
                  }
                  TOWhigh = TowSortedArray[m].TOW;
                  break;
                }
              }

              var sorted_towmac_filtered_array_tow_low =
                TowMacSortedArray.filter((item) => {
                  if (Number(item.TOW) === Number(TOWlow)) {
                    return true;
                  }
                  return false;
                });

              for (
                var n = 0;
                n < sorted_towmac_filtered_array_tow_low.length;
                n++
              ) {
                if (
                  Number(sorted_towmac_filtered_array_tow_low[n].TOW) ===
                    Number(TOWlow) &&
                  Number(sorted_towmac_filtered_array_tow_low[n].TOWMAC) >
                    Number(towmac)
                ) {
                  if (n === 0) {
                    TOWMAClow_TOWlow =
                      sorted_towmac_filtered_array_tow_low[n].TOWMAC;
                  } else {
                    TOWMAClow_TOWlow =
                      sorted_towmac_filtered_array_tow_low[n - 1].TOWMAC;
                  }
                  TOWMAChigh_TOWlow =
                    sorted_towmac_filtered_array_tow_low[n].TOWMAC;
                  break;
                }
              }

              var sorted_towmac_filtered_array_tow_high =
                TowMacSortedArray.filter((item) => {
                  if (Number(item.TOW) === Number(TOWhigh)) {
                    return true;
                  }
                  return false;
                });

              for (
                var o = 0;
                o < sorted_towmac_filtered_array_tow_high.length;
                o++
              ) {
                if (
                  Number(sorted_towmac_filtered_array_tow_high[o].TOW) ===
                    Number(TOWhigh) &&
                  Number(sorted_towmac_filtered_array_tow_high[o].TOWMAC) >
                    Number(towmac)
                ) {
                  if (o === 0) {
                    TOWMAClow_TOWhigh =
                      sorted_towmac_filtered_array_tow_high[o].TOWMAC;
                  } else {
                    TOWMAClow_TOWhigh =
                      sorted_towmac_filtered_array_tow_high[o - 1].TOWMAC;
                  }
                  TOWMAChigh_TOWhigh =
                    sorted_towmac_filtered_array_tow_high[o].TOWMAC;
                  break;
                }
              }

              for (var p = 0; p < stabdatas.length; p++) {
                if (
                  Number(stabdatas[p].TOW) === Number(TOWlow) &&
                  Number(stabdatas[p].TOWMAC) === Number(TOWMAClow_TOWlow)
                ) {
                  stab5 = stabdatas[p].STAB;
                  break;
                }
              }

              for (var q = 0; q < stabdatas.length; q++) {
                if (
                  Number(stabdatas[q].TOW) === Number(TOWlow) &&
                  Number(stabdatas[q].TOWMAC) === Number(TOWMAChigh_TOWlow)
                ) {
                  stab6 = stabdatas[q].STAB;
                  break;
                }
              }

              stab7 =
                (fixedNumber(towmac) - TOWMAClow_TOWlow) *
                  ((stab6 - stab5) / (TOWMAChigh_TOWlow - TOWMAClow_TOWlow)) +
                stab5;

              for (var r = 0; r < stabdatas.length; r++) {
                if (
                  Number(stabdatas[r].TOW) === Number(TOWhigh) &&
                  Number(stabdatas[r].TOWMAC) === Number(TOWMAClow_TOWhigh)
                ) {
                  stab8 = stabdatas[r].STAB;
                  break;
                }
              }

              for (var s = 0; s < stabdatas.length; s++) {
                if (
                  Number(stabdatas[s].TOW) === Number(TOWhigh) &&
                  Number(stabdatas[s].TOWMAC) === Number(TOWMAChigh_TOWhigh)
                ) {
                  stab9 = stabdatas[s].STAB;
                  break;
                }
              }

              stab10 =
                (towmac - TOWMAClow_TOWhigh) *
                  ((stab9 - stab8) / (TOWMAChigh_TOWhigh - TOWMAClow_TOWhigh)) +
                stab8;

              if (
                stab5 >= 0 &&
                stab6 >= 0 &&
                stab7 >= 0 &&
                stab8 >= 0 &&
                stab9 >= 0 &&
                stab10 >= 0
              ) {
                stabObj["Stab"] =
                  (tow - TOWlow) * ((stab10 - stab7) / (TOWhigh - TOWlow)) +
                  stab7;
                stabFound = true;
                console.log("stabFound", stabFound);
              }
            }

        defer.resolve(stabObj);
      } else {
        defer.reject("Failed to find the StabTrimData.");
      }
    };

    getRequest.onerror = function (event) {
      console.error("Error fetching StabTrimData from IndexedDB:", event.target.error);
      defer.reject("Failed to find the StabTrimData.");
    };
  };

  openDB.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.error);
    defer.reject("Failed to find the StabTrimData.");
  };

  return defer.promise;
}


export function fetchStabTrimThrustRegnNo(AC_REGN, ac_type) {
  console.log(AC_REGN, ac_type)
  var defer = q.defer();
  var res = AC_REGN.substr(0, 5);
console.log(AC_REGN, ac_type)
  if (ac_type === "Q400" || res === "VT-MX") {
    defer.resolve();
    return defer.promise;
  }

  const openDB = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  openDB.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("stabtrimthrust", "readonly");
    const objectStore = transaction.objectStore("stabtrimthrust");
    
    var index = objectStore.index('Regn_no');

   
    var getRequest = index.get(AC_REGN)
console.log(getRequest)
    getRequest.onsuccess = function () {
      const result = getRequest.result;
      console.log('result result',result)
      if (result) {
        defer.resolve(result);
      } else {
        defer.reject("Failed to find the StabTrimThrust.");
      }
    };

    getRequest.onerror = function (event) {
      defer.reject("Failed to find the StabTrimThrust.");
    };
  };

  openDB.onerror = function (event) {
    defer.reject("Failed to find the StabTrimThrust.");
  };

  return defer.promise;
}

export function fixed2Number(number) {
  var value = Number(number);
  var res = String(number).split(".");
  if (res.length == 1 || res[1].length >= 1) {
    value = value.toFixed(2);
  }
  return value;
}

export function fetchCGRefTableZFWRegnNo(AC_REGN, law) {
  console.log(AC_REGN,law)
  var defer = q.defer();

  var request = indexedDB.open(Enviornment.get('DB_NAME'), 1);

  request.onsuccess = function (event) {
    var db = event.target.result;

    // Start a read-only transaction
    var transaction = db.transaction('cgreftablezfw', 'readonly');
    var objectStore = transaction.objectStore('cgreftablezfw');
    
    // Use the 'Regn_No' field as the key path for the index
    var index = objectStore.index('Regn_no');

    // Open a cursor on the index with the specified key range
    var cursorRequest = index.openCursor(IDBKeyRange.only(AC_REGN));

    cursorRequest.onsuccess = function (event) {
      var cursor = event.target.result;
      console.log(cursor)
      if (cursor) {
        // Check if other conditions match
        if (cursor.value.MinLW < law && cursor.value.MaxLW > law) {
          defer.resolve(cursor.value);
        } else {
          cursor.continue(); // Continue to the next match
        }
      } else {
        // No matching record found
        defer.reject("Failed to find the CGRefTableZFW123.");
      }
    };

    cursorRequest.onerror = function (event) {
      console.log(event.target.error);
      defer.reject("Failed to find the CGRefTableZFW.");
    };
  };

  request.onerror = function (event) {
    console.log(event.target.error);
    defer.reject("Failed to open the database.");
  };

  return defer.promise;
}



export function fetchCGRefTableTOWRegnNo(AC_REGN, law) {
  console.log(AC_REGN,law)
  console.log(Enviornment.get("DB_NAME"))
  var defer = q.defer();

  const openDB = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  openDB.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("cgreftabletow", "readonly");
    const objectStore = transaction.objectStore("cgreftabletow");
    var index = objectStore.index('Regn_no');
    var cursorRequest = index.openCursor(IDBKeyRange.only(AC_REGN));

    cursorRequest.onsuccess = function (event) {
      var cursor = event.target.result;
      console.log(cursor)
      if (cursor) {
        // Check if other conditions match
        if (cursor.value.MinLW < law && cursor.value.MaxLW > law) {
          defer.resolve(cursor.value);
        } else {
          cursor.continue(); // Continue to the next match
        }
      } else {
        // No matching record found
        defer.reject("Failed to find the CGRefTableZFW123.");
      }
    };

    cursorRequest.onerror = function (event) {
      console.log(event.target.error);
      defer.reject("Failed to find the CGRefTableZFW.");
    };

 
  };

  openDB.onerror = function (event) {
    defer.reject("Failed to find the cgreftabletow.");
  };

  return defer.promise;
}
export function fetchCGLIMITSZFWTableName(tablename) {
  var defer = q.defer();

  const openDB = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  openDB.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("cglimitszfw", "readonly");
    const objectStore = transaction.objectStore("cglimitszfw");

    const index = objectStore.index("CGVARIANT");
    const range = IDBKeyRange.only(tablename);
    const getRequest = index.openCursor(range);

    const data = [];

    getRequest.onsuccess = function () {
      const cursor = getRequest.result;

      if (cursor) {
        data.push(cursor.value);
        cursor.continue();
      } else {
        defer.resolve(data);
      }
    };

    getRequest.onerror = function (event) {
      console.error(
        "Error fetching cglimitszfw from IndexedDB:",
        event.target.error
      );
      defer.reject("Failed to find the cglimitszfw.");
    };
  };

  openDB.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.error);
    defer.reject("Failed to find the cglimitszfw.");
  };

  return defer.promise;
}


export function fetchCGLIMITSTOWTableName(tablename) {
  var defer = q.defer();

  const openDB = indexedDB.open(Enviornment.get("DB_NAME"), 1);

  openDB.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("cglimitstow", "readonly");
    const objectStore = transaction.objectStore("cglimitstow");

    const index = objectStore.index("CGVARIANT");
    const range = IDBKeyRange.only(tablename);
    const getRequest = index.openCursor(range);

    const data = [];

    getRequest.onsuccess = function () {
      const cursor = getRequest.result;
      if (cursor) {
        data.push(cursor.value);
        cursor.continue(); // Move the cursor to the next record
      } else {
        defer.resolve(data);
      }
    };

    getRequest.onerror = function (event) {
      console.error("Error fetching cglimitstow from IndexedDB:", event.target.error);
      defer.reject("Failed to find the cglimitstow.");
    };
  };

  openDB.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.error);
    defer.reject("Failed to find the cglimitstow.");
  };

  return defer.promise;
}


export function checkZFWLimit(regno, zfw, law) {
  var defer = q.defer();

  fetchCGRefTableZFWRegnNo(regno, law)
    .then((res) => {
      console.log("CGREF", res);
      var tableName = res["TableName"];
      return fetchCGLIMITSZFWTableName(tableName);
    })
    .then((data) => {
      var result = {};
      console.log("sdds", data, law, zfw);

      for (var i = 0; i < data.length; i++) {
        if (data[i].Weight === zfw) {
          result["Fwd_Zfw_Limit"] = data[i].Fwd_Zfw_Limit;
          result["Aft_Zfw_Limit"] = data[i].Aft_Zfw_Limit;
          break;
        }
      }

      if (
        result === null ||
        result === undefined ||
        Object.keys(result).length === 0
      ) {
        var res1 = null;
        var res2 = null;
        var weight1 = 0;
        var weight2 = 0;
        for (var j = 0; j < data.length; j++) {
          if (data[j].Weight > zfw) {
            if (j == 0) {
              res1 = data[j];
              weight1 = data[j].Weight;
            } else {
              res1 = data[j - 1];
              weight1 = data[j - 1].Weight;
            }
            res2 = data[j];
            weight2 = data[j].Weight;
            break;
          }
        }
        console.log("res1", res1, "res2", res2);
        result["Fwd_Zfw_Limit"] = parseFloat(
          (zfw - weight1) *
            ((res2.Fwd_Zfw_Limit - res1.Fwd_Zfw_Limit) / (weight2 - weight1)) +
            res1.Fwd_Zfw_Limit
        );
        result["Aft_Zfw_Limit"] = parseFloat(
          (zfw - weight1) *
            ((res2.Aft_Zfw_Limit - res1.Aft_Zfw_Limit) / (weight2 - weight1)) +
            res1.Aft_Zfw_Limit
        );
      }
      console.log(result);
      defer.resolve(result);
    })
    .catch((er) => {
      console.log(er);
      defer.reject(er);
    });
  return defer.promise;
}

export function checkTOWLimit(regno, tow, law) {
  var defer = q.defer();
  fetchCGRefTableTOWRegnNo(regno, law)
    .then((res) => {
      console.log("CGREF", res);
      var tableName = res["TableName"];
      return fetchCGLIMITSTOWTableName(tableName);
    })
    .then((data) => {
      var result = {};
      console.log("sdds", data, law, tow);
      for (var i = 0; i < data.length; i++) {
        if (data[i].Weight === tow) {
          result["Fwd_Tow_Limit"] = data[i].Fwd_Tow_limit;
          result["Aft_Tow_Limit"] = data[i].Aft_Tow_Limit;
          break;
        }
      }
      if (
        result === null ||
        result === undefined ||
        Object.keys(result).length === 0
      ) {
        var res1 = null;
        var res2 = null;
        var weight1 = 0;
        var weight2 = 0;
        for (var j = 0; j < data.length; j++) {
          if (data[j].Weight > tow) {
            if (j == 0) {
              res1 = data[j];
              weight1 = data[j].Weight;
            } else {
              res1 = data[j - 1];
              weight1 = data[j - 1].Weight;
            }
            res2 = data[j];
            weight2 = data[j].Weight;
            break;
          }
        }
        result["Fwd_Tow_Limit"] = parseFloat(
          (tow - weight1) *
            ((res2.Fwd_Tow_limit - res1.Fwd_Tow_limit) / (weight2 - weight1)) +
            res1.Fwd_Tow_limit
        );
        result["Aft_Tow_Limit"] = parseFloat(
          (tow - weight1) *
            ((res2.Aft_Tow_Limit - res1.Aft_Tow_Limit) / (weight2 - weight1)) +
            res1.Aft_Tow_Limit
        );
      }
      defer.resolve(result);
    })
    .catch((er) => {
      defer.reject(er);
    });
  return defer.promise;
}

export function checkLAWLimit(regno, law) {
  var defer = q.defer();
  fetchCGRefTableTOWRegnNo(regno, law)
    .then((res) => {
      console.log("CGREF", res);
      var tableName = res["TableName"];
      return fetchCGLIMITSTOWTableName(tableName);
    })
    .then((data) => {
      var result = {};
      console.log("sdds", data, law);
      for (var i = 0; i < data.length; i++) {
        if (data[i].Weight === law) {
          result["Fwd_Law_Limit"] = data[i].Fwd_Tow_limit;
          result["Aft_Law_Limit"] = data[i].Aft_Tow_Limit;
          break;
        }
      }
      if (
        result === null ||
        result === undefined ||
        Object.keys(result).length === 0
      ) {
        var res1 = null;
        var res2 = null;
        var weight1 = 0;
        var weight2 = 0;
        for (var j = 0; j < data.length; j++) {
          if (data[j].Weight > law) {
            if (j == 0) {
              res1 = data[j];
              weight1 = data[j].Weight;
            } else {
              res1 = data[j - 1];
              weight1 = data[j - 1].Weight;
            }
            res2 = data[j];
            weight2 = data[j].Weight;
            break;
          }
        }
        console.log("res1", res1, "res2", res2);
        result["Fwd_Law_Limit"] = parseFloat(
          (law - weight1) *
            ((res2.Fwd_Tow_limit - res1.Fwd_Tow_limit) / (weight2 - weight1)) +
            res1.Fwd_Tow_limit
        );
        result["Aft_Law_Limit"] = parseFloat(
          (law - weight1) *
            ((res2.Aft_Tow_Limit - res1.Aft_Tow_Limit) / (weight2 - weight1)) +
            res1.Aft_Tow_Limit
        );
      }
      defer.resolve(result);
    })
    .catch((er) => {
      defer.reject(er);
    });
  return defer.promise;
}
