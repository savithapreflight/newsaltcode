import * as Enviornment from "./environment";
import momentTZ from "moment-timezone";
import * as q from "q";
import moment from "moment";

function fixed2Number(number) {
  var value = Number(number);
  var res = String(number).split(".");
  if (res.length === 1 || res[1].length >= 1) {
    value = value.toFixed(2);
  }
  return value;
}
function fixed1Number(number) {
  var value = Number(number);
  var res = String(number).split(".");
  if (res.length == 1 || res[1].length >= 1) {
    value = value.toFixed(1);
  }
  return value;
}
function formatThrust(number) {
  if (number == null) {
    return "-";
  }
  var a = "K";
  var new_number = parseInt(number) / 1000 + a;

  return new_number;
}

function formatDate(str) {
  if (str == null) {
    return "-";
  }
  return moment(str).format("DDMMMYY").toUpperCase();
}
function formatDateGetDay(str) {
  if (str == null) {
    return "-";
  }
  return moment(str).format("DD");
}

export function printtrimSheet(trim_sheet, thrust, flap, stab) {
  console.log(trim_sheet)
  var defer = q.defer();
  var printer_name = window.localStorage.getItem("printer_name");
//getting printer name
  if (printer_name === null || printer_name === undefined) {
    printer_name = "BTSPP";
  }

  var count = 0;
  var crewArray = trim_sheet.ActcrewStr.split("/");
  var crew = crewArray.map((x) => {
    var c = parseInt(x);
    count = count + c;
    return count;
  });
console.log(count)
  var cabinArray = [];
  var cabinBagagge = 0;

  var TTL_CREW = 0;
  var TTL_SUB = 0;
  var POB = 0;

  if (
    trim_sheet["IsCargoOnSeatStr"] == true ||
    trim_sheet["IsFreighter"] == 1
  ) {
    console.log(trim_sheet.AdjustStrv2)
    cabinArray = trim_sheet.AdjustStrv2.split("$");
    cabinBagagge = parseInt(cabinArray[3]);
    if (isNaN(cabinBagagge)) {
      cabinBagagge = 0;
    }

    var crewSplit = trim_sheet.ActcrewStr.split("/");

    POB = parseInt(crewSplit[0]) + parseInt(crewSplit[1]);
    TTL_CREW = parseInt(crewSplit[0]);
    TTL_SUB = parseInt(crewSplit[1]);
  } else {
    console.log(trim_sheet.AdjustStrv2)
    cabinArray = trim_sheet.AdjustStrv2.split("$");
    cabinBagagge = parseInt(cabinArray[3]);
    if (isNaN(cabinBagagge)) {
      cabinBagagge = 0;
    }
  }

  // if(trim_sheet['IsFreighter'] == 0){
  //     cabinArray = trim_sheet.AdjustStr.split("$");
  //     cabinBagagge = parseInt(cabinArray[12]);
  //     if (isNaN(cabinBagagge)) {
  //         cabinBagagge = 0;
  //     }
  // } else {
  //     cabinArray = trim_sheet.AdjustStrv2.split("$");
  //     cabinBagagge = parseInt(cabinArray[3]);
  //     if (isNaN(cabinBagagge)) {
  //         cabinBagagge = 0;
  //     }
  //     var crewSplit   =   trim_sheet.ActcrewStr.split("/");
  //     // TTL_CREW = parseInt(crewSplit[0]) + parseInt(crewSplit[1]) + parseInt(cabinArray[0]) +  parseInt(cabinArray[4])  +  parseInt(cabinArray[5]) +  parseInt(cabinArray[5]);
  //     TTL_SUB = parseInt(cabinArray[9])
  //     // POB = TTL_CREW +  TTL_SUB;

  //     POB = parseInt(crewSplit[0]) + parseInt(crewSplit[1]);
  //     TTL_CREW = POB - parseInt(cabinArray[9]);
  // }

  // var cabinArray      = trim_sheet.AdjustStr.split("$");
  // var cabinBagagge  = parseInt(cabinArray[12]);
  // if(isNaN(cabinBagagge)){
  //   cabinBagagge = 0;
  // }

  //Uper deck calculation for frieght aircraft
  var loadUpperdeck = [];
  var totalLoadUpperDeck = 0;
  if (trim_sheet.IsFreighter == 1) {
    var loadUpperdeckCabin = trim_sheet.PalletsStr.split("#");
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

  if (trim_sheet.IsCargoOnSeatStr == true) {
    var loadUpperdeckCabin = trim_sheet.CargoOnSeatStr.split("#");
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
  if (trim_sheet.IsFreighter == 1 || trim_sheet.IsCargoOnSeatStr == true) {
    var loadUpperdeckCabin = trim_sheet.ActCompStr.split("$");
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
  var lim1 = false;
  var lim2 = false;
  var lim3 = false;

  var LIM1 = parseInt(trim_sheet.MZFW + trim_sheet.FOB);
  var LIM2 = parseInt(trim_sheet.OTOW);
  var LIM3 = parseInt(trim_sheet.OLW + trim_sheet.TRIP_FUEL);

  console.log("LIM1", LIM1);
  console.log("LIM2", LIM2);
  console.log("LIM3", LIM3);
  if (LIM1 < LIM2 && LIM1 < LIM3) {
    lim1 = true;
  }
  if (LIM2 < LIM1 && LIM2 < LIM3) {
    lim2 = true;
  }
  if (LIM3 < LIM1 && LIM3 < LIM2) {
    lim3 = true;
  }
  console.log("lim1", lim1);
  console.log("lim2", lim2);
  console.log("lim3", lim3);
  var CONFIG = "";
  if (trim_sheet["IsFreighter"] == 1) {
    CONFIG = trim_sheet.CONFIG;
  } else if (trim_sheet["IsCargoOnSeatStr"] == 1) {
    CONFIG = trim_sheet.CONFIG.replace("Y", "CIC");
  } else {
    var alpha = trim_sheet.CONFIG.match(/[a-zA-Z]/g).join("");
    var digit = trim_sheet.CONFIG.match(/\d/g).join("");
    CONFIG = digit + alpha;
  }

  var TrimGenTimeUTCTime = moment(trim_sheet.TrimGenTimeUTC).format("HH:mm");

  var totalAdult =
    trim_sheet.C1Adult +
    trim_sheet.C2Adult +
    trim_sheet.C3Adult +
    trim_sheet.C4Adult +
    trim_sheet.C5Adult +
    trim_sheet.C6Adult +
    trim_sheet.C7Adult +
    trim_sheet.C8Adult;
  var totalChild =
    trim_sheet.C1Child +
    trim_sheet.C2Child +
    trim_sheet.C3Child +
    trim_sheet.C4Child +
    trim_sheet.C5Child +
    trim_sheet.C6Child +
    trim_sheet.C7Child +
    trim_sheet.C8Child;
  var totalInfant =
    trim_sheet.C1Infant +
    trim_sheet.C2Infant +
    trim_sheet.C3Infant +
    trim_sheet.C4Infant +
    trim_sheet.C5Infant +
    trim_sheet.C6Infant +
    trim_sheet.C7Infant +
    trim_sheet.C8Infant;
  var COMPWT =
    trim_sheet.cmpt1 + trim_sheet.cmpt2 + trim_sheet.cmpt3 + trim_sheet.cmpt4;
  var CABBGWT = cabinBagagge;
  console.log("totalAdult", totalAdult);
  console.log("totalChild", totalChild);
  console.log("totalInfant", totalInfant);
  var PAXWT = totalAdult * 75 + totalChild * 35 + totalInfant * 10;
  var TTLLOAD = 0;

  if (
    trim_sheet["IsCargoOnSeatStr"] == true ||
    trim_sheet["IsFreighter"] == 1
  ) {
    TTLLOAD = cabinBagagge + totalLoadLowerDeck + totalLoadUpperDeck;
  } else {
    TTLLOAD =
      trim_sheet.cmpt1 +
      trim_sheet.cmpt2 +
      trim_sheet.cmpt3 +
      trim_sheet.cmpt4 +
      (trim_sheet.C1Adult +
        trim_sheet.C2Adult +
        trim_sheet.C3Adult +
        trim_sheet.C4Adult +
        trim_sheet.C5Adult +
        trim_sheet.C6Adult +
        trim_sheet.C7Adult +
        trim_sheet.C8Adult) *
        75 +
      (trim_sheet.C1Child +
        trim_sheet.C2Child +
        trim_sheet.C3Child +
        trim_sheet.C4Child +
        trim_sheet.C5Child +
        trim_sheet.C6Child +
        trim_sheet.C7Child +
        trim_sheet.C8Child) *
        35 +
      (trim_sheet.C1Infant +
        trim_sheet.C2Infant +
        trim_sheet.C3Infant +
        trim_sheet.C4Infant +
        trim_sheet.C5Infant +
        trim_sheet.C6Infant +
        trim_sheet.C7Infant +
        trim_sheet.C8Infant) *
        10 +
      cabinBagagge;
  }

  // +(count * 85)
  console.log("TTLLOAD", TTLLOAD);

  var toleranceLimits = "NO LMC LIMITS APPROVED FOR FREIGHTER AIRCRAFT";
  if (trim_sheet["IsCargoOnSeatStr"] == true) {
    if (trim_sheet["Acft_Type"] == "Q400") {
      toleranceLimits =
        "+ / - 200 KG OF ACM / SNY / CARGO IN COMPARTMENT AND + / - 500 KG FUEL.";
    } else {
      toleranceLimits =
        "+ / - 400 KG OF ACM / SNY / CARGO IN LOWER DECK AND + / - 1000 KG FUEL.";
    }
  } else if (trim_sheet["IsFreighter"] == 1) {
    if (trim_sheet["Acft_Type"] == "Q400") {
      toleranceLimits =
        "+ / - 200 KG OF ACM / SNY / CARGO IN COMPARTMENT AND + / - 500 KG FUEL.";
    } else {
      toleranceLimits =
        "+ / - 400 KG OF ACM / SNY / CARGO IN LOWER DECK AND + / - 1000 KG FUEL.";
    }
  } else {
    if (trim_sheet["Acft_Type"] == "Q400") {
      toleranceLimits =
        "+ / - 200 KG OF PERSON ON BOARD / BAGGAGE / CARGO AND + / - 500 KG. FUEL.";
    } else {
      toleranceLimits =
        "+ / - 400 KG OF PERSON ON BOARD / BAGGAGE / CARGO AND + / - 1000 KG FUEL.";
    }
  }

  var Maxcarg = trim_sheet.MaxCompartment;
  var Maxpax = trim_sheet.MaxCabin;

  var print_length = 13.5;
  if (trim_sheet.Thrust1 !== null && trim_sheet.Thrust1 !== undefined) {
    print_length += 0.5;
  }

  if (trim_sheet.Thrust2 !== null && trim_sheet.Thrust2 !== undefined) {
    print_length += 0.5;
  }

  if (trim_sheet.Thrust3 !== null && trim_sheet.Thrust3 !== undefined) {
    print_length += 0.5;
  }
  if (trim_sheet.Thrust4 !== null && trim_sheet.Thrust4 !== undefined) {
    print_length += 0.5;
  }

  var printer_cmd = [
    "SIZE 2.84," + print_length.toFixed(2),
    "GAP 0,0",
    "DIRECTION 0",
    "CLS",
  ];

  //Load Sheet name
  console.log(trim_sheet);
  var vendor_name = Enviornment.get("VENDOR") + " LOADSHEET";
  printer_cmd.push('TEXT 275,50,"0",0,11,11,2,"' + vendor_name + '"');
console.log(printer_cmd)
  var line = 2;
  //LIne 1
  printer_cmd.push(
    "TEXT 10," +
      line * 50 +
      ',"0",0,10,10,"' +
      trim_sheet.Flight_no +
      "/" +
      formatDateGetDay(trim_sheet.Flight_Date) +
      '"'
  );
  printer_cmd.push(
    "TEXT 186," +
      line * 50 +
      ',"0",0,10,10,"' +
      formatDate(trim_sheet.TrimGenTimeUTC) +
      '"'
  );

  // var time    =   momentTZ.tz(trim_sheet.STD,"UTC").format("HH:mm")
  printer_cmd.push(
    "TEXT 372," + line * 50 + ',"0",0,10,10,"' + TrimGenTimeUTCTime + '"'
  );
  if (trim_sheet.AppType === null) {
    printer_cmd.push(
      "TEXT 560," + line * 50 + ',"0",0,10,10,3,"ED-0' + trim_sheet.EDNO + '"'
    );
  } else {
    printer_cmd.push(
      "TEXT 560," + line * 50 + ',"0",0,10,10,3,"ED-M0' + trim_sheet.EDNO + '"'
    );
  }

  //Line 2
  line++;
  printer_cmd.push(
    "TEXT 10," +
      line * 50 +
      ',"0",0,10,10,"' +
      trim_sheet.Source +
      "-" +
      trim_sheet.Destination +
      '"'
  );
  if (trim_sheet.IsFreighter == 0) {
    printer_cmd.push(
      "TEXT 186," +
        line * 50 +
        ',"0",0,10,10,"' +
        trim_sheet.Acft_Type +
        "/" +
        CONFIG +
        '"'
    );
  } else {
    printer_cmd.push(
      "TEXT 186," +
        line * 50 +
        ',"0",0,10,10,"' +
        trim_sheet.Acft_Type +
        "" +
        CONFIG +
        '"'
    );
  }

  printer_cmd.push(
    "TEXT 372," + line * 50 + ',"0",0,10,10,"' + trim_sheet.Acft_Regn + '"'
  );
  printer_cmd.push(
    "TEXT 560," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.ActcrewStr + '"'
  );

  //Line 3
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"TTL LOAD "');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + TTLLOAD + '"'
  );

  if (trim_sheet.IsFreighter == 0 && trim_sheet.IsCargoOnSeatStr == false) {
    //Line 3
    line++;
    printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"COMP WT "');
    printer_cmd.push(
      "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + COMPWT + '"'
    );
  }
  //Line 3
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"CAB BG WT "');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + CABBGWT + '"'
  );

  if (trim_sheet.IsFreighter == 0 && trim_sheet.IsCargoOnSeatStr == false) {
    //Line 3
    line++;
    printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"PAX WT "');
    printer_cmd.push(
      "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + PAXWT + '"'
    );
  }

  //Line 4
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"DOW "');
  printer_cmd.push(
    "TEXT 280," +
      line * 50 +
      ',"0",0,10,10,3,"' +
      Math.round(trim_sheet.OEW) +
      '"'
  );

  //Line 5
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"ZFW "');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.ZFW + '"'
  );
  printer_cmd.push("TEXT 372," + line * 50 + ',"0",0,10,10,"MAX "');

  if (lim1 === true) {
    printer_cmd.push(
      "TEXT 560," +
        line * 50 +
        ',"0",0,10,10,3,"' +
        trim_sheet.MZFW +
        " L" +
        '"'
    );
  } else {
    printer_cmd.push(
      "TEXT 560," +
        line * 50 +
        ',"0",0,10,10,3,"' +
        trim_sheet.MZFW +
        "  " +
        '"'
    );
  }

  //Line 6
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"TOF "');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.FOB + '"'
  );

  //Line 7
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"TOW "');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.TOW + '"'
  );
  printer_cmd.push("TEXT 372," + line * 50 + ',"0",0,10,10,"MAX "');

  if (lim2 === true) {
    printer_cmd.push(
      "TEXT 560," +
        line * 50 +
        ',"0",0,10,10,3,"' +
        trim_sheet.OTOW +
        " L" +
        '"'
    );
  } else {
    printer_cmd.push(
      "TEXT 560," +
        line * 50 +
        ',"0",0,10,10,3,"' +
        trim_sheet.OTOW +
        "  " +
        '"'
    );
  }

  //Line 8
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"TRIP "');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.TRIP_FUEL + '"'
  );

  //Line 9
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"LAW "');
  printer_cmd.push(
    "TEXT 280," +
      line * 50 +
      ',"0",0,10,10,3,"' +
      parseInt(trim_sheet.TOW - trim_sheet.TRIP_FUEL) +
      '"'
  );
  printer_cmd.push("TEXT 372," + line * 50 + ',"0",0,10,10,"MAX "');

  if (lim3 === true) {
    printer_cmd.push(
      "TEXT 560," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.OLW + " L" + '"'
    );
  } else {
    printer_cmd.push(
      "TEXT 560," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.OLW + "  " + '"'
    );
  }

  //Line 10
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"UNDERLOAD "');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.underLoadLMC + '"'
  );

  //Line 11
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"DOI"');
  printer_cmd.push(
    "TEXT 280," +
      line * 50 +
      ',"0",0,10,10,3,"' +
      fixed2Number(trim_sheet.OEW_Index) +
      '"'
  );

  //Line 12
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"LIZFW "');
  printer_cmd.push(
    "TEXT 280," +
      line * 50 +
      ',"0",0,10,10,3,"' +
      fixed2Number(trim_sheet.ZFWindex) +
      '"'
  );
  // printer_cmd.push("TEXT 372,"+line*50+",\"0\",0,10,10,\"ZFMAC \"")
  // printer_cmd.push("TEXT 560,"+line*50+",\"0\",0,10,10,3,\""+trim_sheet.ZFWMAC+"\"")

  //Line 13
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"LITOW "');
  printer_cmd.push(
    "TEXT 280," +
      line * 50 +
      ',"0",0,10,10,3,"' +
      fixed2Number(trim_sheet.TOWindex) +
      '"'
  );
  // printer_cmd.push("TEXT 372,"+line*50+",\"0\",0,10,10,\"TOWMAC \"")
  // printer_cmd.push("TEXT 560,"+line*50+",\"0\",0,10,10,3,\""+trim_sheet.TOWMAC+"\"")

  //Line 14
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"LILW "');
  printer_cmd.push(
    "TEXT 280," +
      line * 50 +
      ',"0",0,10,10,3,"' +
      fixed2Number(trim_sheet.LWindex) +
      '"'
  );
  // printer_cmd.push("TEXT 372,"+line*50+",\"0\",0,10,10,\"LWMAC \"")
  // printer_cmd.push("TEXT 560,"+line*50+",\"0\",0,10,10,3,\""+trim_sheet.LWMAC+"\"")

  line++;
  line++;
  printer_cmd.push("TEXT 100," + line * 50 + ',"0",0,10,10,2,"FWD LMT"');
  printer_cmd.push("TEXT 270," + line * 50 + ',"0",0,10,10,2,"ZFMAC"');
  printer_cmd.push("TEXT 450," + line * 50 + ',"0",0,10,10,2,"AFT LMT"');
  line++;
  printer_cmd.push(
    "TEXT 100," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.ZFWMACFWD) +
      '"'
  );
  printer_cmd.push(
    "TEXT 270," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.ZFWMAC) +
      '"'
  );
  printer_cmd.push(
    "TEXT 450," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.ZFWMACAFT) +
      '"'
  );

  line++;
  printer_cmd.push("TEXT 100," + line * 50 + ',"0",0,10,10,2,"FWD LMT"');
  printer_cmd.push("TEXT 270," + line * 50 + ',"0",0,10,10,2,"TOWMAC"');
  printer_cmd.push("TEXT 450," + line * 50 + ',"0",0,10,10,2,"AFT LMT"');
  line++;
  printer_cmd.push(
    "TEXT 100," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.TOWMACFWD) +
      '"'
  );
  printer_cmd.push(
    "TEXT 270," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.TOWMAC) +
      '"'
  );
  printer_cmd.push(
    "TEXT 450," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.TOWMACAFT) +
      '"'
  );

  line++;
  printer_cmd.push("TEXT 100," + line * 50 + ',"0",0,10,10,2,"FWD LMT"');
  printer_cmd.push("TEXT 270," + line * 50 + ',"0",0,10,10,2,"LWTMAC"');
  printer_cmd.push("TEXT 450," + line * 50 + ',"0",0,10,10,2,"AFT LMT"');
  line++;
  printer_cmd.push(
    "TEXT 100," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.LWMACFWD) +
      '"'
  );
  printer_cmd.push(
    "TEXT 270," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.LWMAC) +
      '"'
  );
  printer_cmd.push(
    "TEXT 450," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.LWMACAFT) +
      '"'
  );

  line++;

  // //Line 12
  // line++;
  // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"LIZFW\"")
  // printer_cmd.push("TEXT 180,"+((line*50)+3)+",\"2\",0,1,1,3,\""+trim_sheet.ZFWindex+"\"")
  // printer_cmd.push("TEXT 200,"+line*50+",\"0\",0,10,10,\"LITOW\"")
  // printer_cmd.push("TEXT 380,"+((line*50)+3)+",\"2\",0,1,1,3,\""+trim_sheet.TOWindex+"\"")
  // printer_cmd.push("TEXT 400,"+line*50+",\"0\",0,10,10,\"LILW\"")
  // printer_cmd.push("TEXT 560,"+((line*50)+3)+",\"2\",0,1,1,3,\""+trim_sheet.LWindex+"\"")

  // //Line 13
  // line++;
  // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"ZFMAC\"")
  // printer_cmd.push("TEXT 180,"+((line*50)+3)+",\"2\",0,1,1,3,\""+trim_sheet.ZFWMAC+"\"")
  // printer_cmd.push("TEXT 200,"+line*50+",\"0\",0,10,10,\"TOWMAC\"")
  // printer_cmd.push("TEXT 380,"+((line*50)+3)+",\"2\",0,1,1,3,\""+trim_sheet.TOWMAC+"\"")
  // printer_cmd.push("TEXT 400,"+line*50+",\"0\",0,10,10,\"LWMAC\"")
  // printer_cmd.push("TEXT 560,"+((line*50)+3)+",\"2\",0,1,1,3,\""+trim_sheet.LWMAC+"\"")

  // //Thrust
  // line++;
  // printer_cmd.push("TEXT 10,"+line*50+",\"2\",0,1,1,\"THRUST\"")
  // printer_cmd.push("TEXT 275,"+line*50+",\"2\",0,1,1,\"FLAP\"")
  // printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB\"")

  //thrust 1
  if (thrust !== null && thrust !== 0 && thrust !== undefined) {
    line++;
    printer_cmd.push(
      "TEXT 10," +
        line * 50 +
        ',"0",0,10,10,"THRUST ' +
        formatThrust(thrust) +
        '"'
    );
    printer_cmd.push(
      "TEXT 200," + line * 50 + ',"0",0,10,10,"FLAP ' + flap.trim() + '"'
    );
    printer_cmd.push(
      "TEXT 560," +
        line * 50 +
        ',"0",0,10,10,3,"STAB ' +
        fixed1Number(stab) +
        '"'
    );
  }

  // if(trim_sheet.Thrust1 !== null && trim_sheet.Thrust1 !== 0 && trim_sheet.Thrust1 !== undefined ){
  //     line++;
  //     // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"THRUST "+formatThrust(trim_sheet.Thrust1)+"\"")
  //     printer_cmd.push("TEXT 200,"+line*50+",\"2\",0,1,1,\"FLAP "+trim_sheet.T1Flap2.trim()+"\"")
  //     printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB "+trim_sheet.T1Stab2+"\"")
  // }

  // //thrust 2
  // if(trim_sheet.Thrust2 !== null && trim_sheet.Thrust2 !== 0 && trim_sheet.Thrust2 !== undefined ){
  //     line++;
  //     printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"THRUST "+formatThrust(trim_sheet.Thrust2)+"\"")
  //     printer_cmd.push("TEXT 200,"+line*50+",\"2\",0,1,1,\"FLAP "+trim_sheet.T2Flap1.trim()+"\"")
  //     printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB "+trim_sheet.T2Stab1+"\"")
  // }

  // if(trim_sheet.Thrust2 !== null && trim_sheet.Thrust2 !== 0 && trim_sheet.Thrust2 !== undefined ){
  //     line++;
  //     // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"THRUST "+formatThrust(trim_sheet.Thrust2)+"\"")
  //     printer_cmd.push("TEXT 200,"+line*50+",\"2\",0,1,1,\"FLAP "+trim_sheet.T2Flap2.trim()+"\"")
  //     printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB "+trim_sheet.T2Stab2+"\"")
  // }

  // //thrust 3
  // if(trim_sheet.Thrust3 !== null && trim_sheet.Thrust3 !== 0 && trim_sheet.Thrust3 !== undefined ){
  //     line++;
  //     printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"THRUST "+formatThrust(trim_sheet.Thrust3)+"\"")
  //     printer_cmd.push("TEXT 200,"+line*50+",\"2\",0,1,1,\"FLAP "+trim_sheet.T3Flap1.trim()+"\"")
  //     printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB "+trim_sheet.T3Stab1+"\"")
  // }

  // if(trim_sheet.Thrust3 !== null && trim_sheet.Thrust3 !== 0 && trim_sheet.Thrust3 !== undefined ){
  //     line++;
  //     // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"THRUST "+formatThrust(trim_sheet.Thrust3)+"\"")
  //     printer_cmd.push("TEXT 200,"+line*50+",\"2\",0,1,1,\"FLAP "+trim_sheet.T3Flap2.trim()+"\"")
  //     printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB "+trim_sheet.T3Stab2+"\"")
  // }

  // //thrust 4
  // if(trim_sheet.Thrust4 !== null && trim_sheet.Thrust4 !== 0 && trim_sheet.Thrust4 !== undefined ){
  //     line++;
  //     printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"THRUST "+formatThrust(trim_sheet.Thrust4)+"\"")
  //     printer_cmd.push("TEXT 200,"+line*50+",\"2\",0,1,1,\"FLAP "+trim_sheet.T4Flap1.trim()+"\"")
  //     printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB "+trim_sheet.T4Stab1+"\"")
  // }

  // if(trim_sheet.Thrust4 !== null && trim_sheet.Thrust4 !== 0 && trim_sheet.Thrust4 !== undefined ){
  //     line++;
  //     // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"THRUST "+formatThrust(trim_sheet.Thrust4)+"\"")
  //     printer_cmd.push("TEXT 200,"+line*50+",\"2\",0,1,1,\"FLAP "+trim_sheet.T4Flap2.trim()+"\"")
  //     printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB "+trim_sheet.T4Stab2+"\"")
  // }
  if (trim_sheet.IsFreighter == 1 || trim_sheet.IsCargoOnSeatStr == true) {
    //TODO
    //FRIGHTER DECT CODE
    line++;
    printer_cmd.push(
      "TEXT 10," + line * 50 + ',"0",0,10,10,"LOAD IN UPPER DECK"'
    );
    const PAPER_WIDTH = 540;
    const DIGIT_SIZE = 15;
    const PAGE_GAP = 10;
    const upperDeckCol = 4;
    loadUpperdeckRows.forEach((row) => {
      line++;
      row.forEach((item, i) => {
        printer_cmd.push(
          "TEXT " +
            (PAGE_GAP + i * Math.floor(PAPER_WIDTH / upperDeckCol)) +
            "," +
            line * 50 +
            ',"0",0,10,10,"' +
            item.name +
            '/"'
        );
        printer_cmd.push(
          "TEXT " +
            (PAGE_GAP +
              i * Math.floor(PAPER_WIDTH / upperDeckCol) +
              item.name.length * DIGIT_SIZE +
              10) +
            "," +
            (line * 50 + 3) +
            ',"0",0,10,10,1,"' +
            item.load +
            '"'
        );
      });
    });
    line++;
    line++;
    printer_cmd.push(
      "TEXT 10," + line * 50 + ',"0",0,10,10,"LOAD IN LOWER DECK"'
    );
    const lowerDeckCol = 5;
    loadLowerdeckRows.forEach((row) => {
      line++;
      row.forEach((item, i) => {
        printer_cmd.push(
          "TEXT " +
            (PAGE_GAP + i * Math.floor(PAPER_WIDTH / lowerDeckCol)) +
            "," +
            line * 50 +
            ',"0",0,10,10,"' +
            item.name +
            '/"'
        );
        printer_cmd.push(
          "TEXT " +
            (PAGE_GAP +
              i * Math.floor(PAPER_WIDTH / lowerDeckCol) +
              item.name.length * DIGIT_SIZE +
              10) +
            "," +
            (line * 50 + 3) +
            ',"0",0,10,10,1,"' +
            item.load +
            '"'
        );
      });
    });

    line++;
    line++;
    printer_cmd.push(
      "TEXT 10," + line * 50 + ',"0",0,10,10,"TTL LOAD UPPER DECK"'
    );
    printer_cmd.push(
      "TEXT 350," + line * 50 + ',"0",0,10,10,"' + totalLoadUpperDeck + '"'
    );

    line++;
    printer_cmd.push(
      "TEXT 10," + line * 50 + ',"0",0,10,10,"TTL LOAD LOWER DECK"'
    );
    printer_cmd.push(
      "TEXT 350," + line * 50 + ',"0",0,10,10,"' + totalLoadLowerDeck + '"'
    );

    line++;
    printer_cmd.push(
      "TEXT 10," + line * 50 + ',"0",0,10,10,"TTL DEADLOAD ON FLT"'
    );
    printer_cmd.push(
      "TEXT 350," +
        line * 50 +
        ',"0",0,10,10,"' +
        (totalLoadUpperDeck + totalLoadLowerDeck) +
        '"'
    );

    line++;
    line++;
    printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,1,"TTL CREW"');
    printer_cmd.push(
      "TEXT 130," + line * 50 + ',"0",0,10,10,"' + TTL_CREW + '"'
    );

    printer_cmd.push("TEXT 190," + line * 50 + ',"0",0,10,10,1,"TTL SUP"');
    printer_cmd.push(
      "TEXT 300," + line * 50 + ',"0",0,10,10,"' + TTL_SUB + '"'
    );

    printer_cmd.push("TEXT 370," + line * 50 + ',"0",0,10,10,1,"POB"');
    printer_cmd.push("TEXT 450," + line * 50 + ',"0",0,10,10,"' + POB + '"');
  } else {
    //load in compartment
    line++;
    printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"LOAD IN CPTS"');
    if (Maxcarg >= 1) {
      printer_cmd.push(
        "TEXT 200," +
          (line * 50 + 3) +
          ',"0",0,10,10,"1/' +
          trim_sheet.cmpt1 +
          '"'
      );
    }
    if (Maxcarg >= 2) {
      printer_cmd.push(
        "TEXT 300," +
          (line * 50 + 3) +
          ',"0",0,10,10,"2/' +
          trim_sheet.cmpt2 +
          '"'
      );
    }
    if (Maxcarg >= 3) {
      printer_cmd.push(
        "TEXT 400," +
          (line * 50 + 3) +
          ',"2",0,10,10,"3/' +
          trim_sheet.cmpt3 +
          '"'
      );
    }
    if (Maxcarg >= 4) {
      printer_cmd.push(
        "TEXT 560," +
          (line * 50 + 3) +
          ',"0",0,10,10,3,"4/' +
          trim_sheet.cmpt4 +
          '"'
      );
    }

    //Zone
    line++;
    printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"ZONE1"');
    printer_cmd.push(
      "TEXT 180," +
        line * 50 +
        ',"0",0,10,10,3,"' +
        parseInt(
          trim_sheet.C1Adult +
            trim_sheet.C1Child +
            parseInt(trim_sheet.AdjustStrv2.split("$")[13])
        ) +
        '"'
    );
    printer_cmd.push("TEXT 210," + line * 50 + ',"0",0,10,10,"ZONE2"');
    printer_cmd.push(
      "TEXT 400," +
        line * 50 +
        ',"0",0,10,10,3,"' +
        parseInt(
          trim_sheet.C2Adult +
            trim_sheet.C2Child +
            parseInt(trim_sheet.AdjustStrv2.split("$")[14])
        ) +
        '"'
    );
    printer_cmd.push("TEXT 425," + line * 50 + ',"0",0,10,10,"ZONE3"');
    printer_cmd.push(
      "TEXT 560," +
        line * 50 +
        ',"0",0,10,10,3,"' +
        parseInt(
          trim_sheet.C3Adult +
            trim_sheet.C3Child +
            parseInt(trim_sheet.AdjustStrv2.split("$")[15])
        ) +
        '"'
    );

    if (Maxpax >= 4) {
      line++;
      printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"ZONE4"');
      printer_cmd.push(
        "TEXT 180," +
          line * 50 +
          ',"0",0,10,10,3,"' +
          parseInt(trim_sheet.C4Adult + trim_sheet.C4Child) +
          '"'
      );
      if (Maxpax >= 5) {
        printer_cmd.push("TEXT 210," + line * 50 + ',"0",0,10,10,"ZONE5"');
        printer_cmd.push(
          "TEXT 400," +
            line * 50 +
            ',"0",0,10,10,3,"' +
            parseInt(trim_sheet.C5Adult + trim_sheet.C5Child) +
            '"'
        );
      }
      if (Maxpax >= 6) {
        printer_cmd.push("TEXT 425," + line * 50 + ',"0",0,10,10,"ZONE6"');
        printer_cmd.push(
          "TEXT 560," +
            line * 50 +
            ',"0",0,10,10,3,"' +
            parseInt(trim_sheet.C6Adult + trim_sheet.C6Child) +
            '"'
        );
      }
    }
    if (Maxpax >= 7 && Maxpax <= 8) {
      line++;
      printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"ZONE7"');
      printer_cmd.push(
        "TEXT 180," +
          line * 50 +
          ',"0",0,10,10,3,"' +
          parseInt(trim_sheet.C7Adult + trim_sheet.C7Child) +
          '"'
      );
      if (Maxpax >= 8) {
        printer_cmd.push("TEXT 210," + line * 50 + ',"0",0,10,10,"ZONE8"');
        printer_cmd.push(
          "TEXT 400," +
            line * 50 +
            ',"0",0,10,10,3,"' +
            parseInt(trim_sheet.C8Adult + trim_sheet.C8Child) +
            '"'
        );
      }
    }

    line++;
    printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"PAX"');
    printer_cmd.push(
      "TEXT 180," +
        (line * 50 + 3) +
        ',"0",0,10,10,3,"' +
        totalAdult +
        "/" +
        totalChild +
        "/" +
        totalInfant +
        '"'
    );
    printer_cmd.push("TEXT 210," + line * 50 + ',"0",0,10,10,"TTL"');
    printer_cmd.push(
      "TEXT 400," +
        (line * 50 + 3) +
        ',"0",0,10,10,3,"' +
        parseInt(totalAdult + totalChild + totalInfant) +
        '"'
    );
    printer_cmd.push("TEXT 425," + line * 50 + ',"0",0,10,10,"POB"');
    printer_cmd.push(
      "TEXT 560," +
        (line * 50 + 3) +
        ',"0",0,10,10,3,"' +
        parseInt(totalAdult + totalChild + totalInfant + count) +
        '"'
    );
  }

  line++;
  //printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"SI :\"");
  const LINE_LENGHT = 40;
  var trimMessage = "SI :     " + trim_sheet.specialStr;
  var trimArr = wordWrapToPrint(trimMessage, 40);
  for (var i = 0; i < trimArr.length; i++) {
    line++;
    printer_cmd.push(
      "TEXT 10," + line * 50 + ',"0",0,10,10,"' + trimArr[i] + '"'
    );
  }
  // for(var i=0;i<Math.ceil(trimMessage.length/LINE_LENGHT);i++){
  //     var start = i*LINE_LENGHT;
  //     var end   = (i+1)*LINE_LENGHT //-1
  //     if(end > trimMessage.length-1){
  //         end = trimMessage.length; //-1;
  //     }
  //     if(i>0){
  //       line++;
  //     }
  //     printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\""+trimMessage.substring(start,end)+"\"");
  // }
  // printer_cmd.push("TEXT 100,"+line*50+",\"0\",0,10,10,\""+trim_sheet.specialStr+"\"");

  // lastminute change
  line++;
  printer_cmd.push(
    "TEXT 275," + line * 50 + ',"0",0,10,10,2,"LAST MINUTE CHANGE"'
  );

  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"DEST"');
  printer_cmd.push("TEXT 160," + line * 50 + ',"0",0,10,10,"SPEC"');
  printer_cmd.push("TEXT 300," + line * 50 + ',"0",0,10,10,"CL/CPT"');
  printer_cmd.push("TEXT 560," + line * 50 + ',"0",0,10,10,3,"+/- WEIGHT"');

  line++;
  line++;

  line++;
  printer_cmd.push(
    "TEXT 10," + line * 50 + ',"0",0,10,10,"ALL WEIGHTS IN KILOGRAM"'
  );

  //prepared by
  //line++;
  // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"PREPARED BY\"")
  // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"PREPARED BY "+trim_sheet.Trim_Officer+"\"")
  var preByTrimArr = wordWrapToPrint(
    "PREPARED BY " + trim_sheet.Trim_Officer,
    40
  );
  for (var i = 0; i < preByTrimArr.length; i++) {
    line++;
    printer_cmd.push(
      "TEXT 10," + line * 50 + ',"0",0,10,10,"' + preByTrimArr[i] + '"'
    );
  }

  line++;
  printer_cmd.push(
    "TEXT 10," + line * 50 + ',"0",0,10,10,"' + trim_sheet.LTLoginId + '"'
  );
  printer_cmd.push(
    "TEXT 275," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      formatDate(trim_sheet.TrimGenTimeUTC) +
      '"'
  );
  printer_cmd.push(
    "TEXT 560," +
      line * 50 +
      ',"0",0,10,10,3,"' +
      TrimGenTimeUTCTime +
      " UTC" +
      '"'
  );

  line++;
  printer_cmd.push(
    "TEXT 10," +
      line * 50 +
      ',"0",0,10,10,"I CERTIFY THAT THIS AIRCRAFT HAS BEEN"'
  );

  line++;
  printer_cmd.push(
    "TEXT 10," + line * 50 + ',"0",0,10,10,"LOADED IN ACCORDANCE WITH THE AFM"'
  );

  line++;

  //load officier and captain
  line++;
  // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,2,\"LOAD OFFICER\"");
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"LOAD OFFICER"');

  var messageArrLO = wordWrapToPrint(trim_sheet.Load_Officer, 40);
  for (var i = 0; i < messageArrLO.length; i++) {
    line++;
    printer_cmd.push(
      "TEXT 10," + line * 50 + ',"0",0,10,10,"' + messageArrLO[i] + '"'
    );
  }

  line++;
  // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,2,\"CAPTAIN / ATPL NO.\"");
  printer_cmd.push(
    "TEXT 10," + line * 50 + ',"0",0,10,10,"CAPTAIN / ATPL NO."'
  );

  var messageArrCP = wordWrapToPrint(trim_sheet.CAPTAIN, 40);
  for (var i = 0; i < messageArrCP.length; i++) {
    line++;
    printer_cmd.push(
      "TEXT 10," + line * 50 + ',"0",0,10,10,"' + messageArrCP[i] + '"'
    );
  }

  // line++;
  // printer_cmd.push("TEXT 100,"+line*50+",\"0\",0,10,10,2,\""+trim_sheet.Load_Officer+"\"")
  // printer_cmd.push("TEXT 400,"+line*50+",\"0\",0,10,10,2,\""+trim_sheet.CAPTAIN+"\"")

  var message = "APPROVED LMC LIMITS: " + toleranceLimits;

  var messageArr = wordWrapToPrint(message, 40);
  // console.log('messageArr', messageArr);
  for (var i = 0; i < messageArr.length; i++) {
    line++;
    printer_cmd.push(
      "TEXT 10," + line * 50 + ',"0",0,10,10,"' + messageArr[i] + '"'
    );
  }

  // for(var i=0;i<Math.ceil(message.length/LINE_LENGHT);i++){
  //     // var start = i*LINE_LENGHT -i;
  //     var start = i*LINE_LENGHT -1;
  //     if(start<0){
  //         start =0 ;
  //     }
  //     var end   = (i+1)*LINE_LENGHT -1;
  //     if(end > message.length){
  //         end = message.length;
  //     }
  //     line++;
  //     printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\""+message.substring(start,end)+"\"");
  // }

  line++;

  var autoMessage =
    "AUTOMATED LOAD & TRIM SHEET APPROVED BY DELHI DAW VIDE LETTER NO. DEL-11011(13)/9/2019-DAW-NR/1348 DATED 30-12-2020";
  var autoMessageArr = wordWrapToPrint(autoMessage, 40);
  for (var i = 0; i < autoMessageArr.length; i++) {
    line++;
    printer_cmd.push(
      "TEXT 10," + line * 50 + ',"0",0,10,10,"' + autoMessageArr[i] + '"'
    );
  }
  // for(var i=0;i<Math.ceil(autoMessage.length/LINE_LENGHT);i++){
  //     var start = i*LINE_LENGHT;
  //     var end   = (i+1)*LINE_LENGHT -1
  //     if(end > autoMessage.length-1){
  //         end = autoMessage.length-1;
  //     }
  //     line++;
  //     printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\""+autoMessage.substring(start,end)+"\"");
  // }

  line++;
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"END"');

  printer_cmd.push("PRINT 1");
  printer_cmd[0] = "SIZE 2.84," + (line * 0.25).toFixed(2);
  console.log(printer_cmd);
console.log(window)
 
  alert(window.TscBluetoothPrinter)
if (window.TscBluetoothPrinter === undefined) {
    defer.resolve({});
    return defer.promise;
  }

  window.TscBluetoothPrinter.print(printer_name, printer_cmd, function () {
    console.log(11111);
    defer.resolve({});
  });
  console.log(defer.promise)
  return defer.promise;

}

export function printtrimSheetOffline(
  trim_sheet,
  fleetinfo,
  thrust,
  flap,
  stab
) {
  var defer = q.defer();
  var printer_name = window.localStorage.getItem("printer_name");
  if (printer_name === null || printer_name === undefined) {
    printer_name = "BTSPP";
  }

  var lim1 = false;
  var lim2 = false;
  var lim3 = false;

  var LIM1 = parseInt(trim_sheet.mzfw + parseInt(trim_sheet.take_of_fuel));
  var LIM2 = parseInt(trim_sheet.otow);
  var LIM3 = parseInt(trim_sheet.olw + parseInt(trim_sheet.trip_fuel));

  console.log("LIM1", LIM1);
  console.log("LIM2", LIM2);
  console.log("LIM3", LIM3);

  if (LIM1 < LIM2 && LIM1 < LIM3) {
    lim1 = true;
  }
  if (LIM2 < LIM1 && LIM2 < LIM3) {
    lim2 = true;
  }
  if (LIM3 < LIM1 && LIM3 < LIM2) {
    lim3 = true;
  }
  console.log("lim1", lim1);
  console.log("lim2", lim2);
  console.log("lim3", lim3);
  var newPax = JSON.parse(trim_sheet.pax);
  console.log(newPax);
  var pax = {};
  for (var i = 0; i < fleetinfo.MaxCabin; i++) {
    var newPaxarray = newPax[i].split("/");
    pax[i] = parseInt(newPaxarray[0]) + parseInt(newPaxarray[1]);
  }

  var cargo = JSON.parse(trim_sheet.cargo);

  var alpha = trim_sheet.config.match(/[a-zA-Z]/g).join("");
  var digit = trim_sheet.config.match(/\d/g).join("");
  var CONFIG = digit + alpha;

  var TrimGenTimeUTCTime = momentTZ
    .tz(trim_sheet.trim_gen_time, "UTC")
    .format("HH:mm");

  var Maxcarg = fleetinfo.MaxCompartment;
  var Maxpax = fleetinfo.MaxCabin;

  var print_length = 13.5;
  if (trim_sheet.Thrust1 !== null && trim_sheet.Thrust1 !== undefined) {
    print_length += 0.5;
  }

  if (trim_sheet.Thrust2 !== null && trim_sheet.Thrust2 !== undefined) {
    print_length += 0.5;
  }

  if (trim_sheet.Thrust3 !== null && trim_sheet.Thrust3 !== undefined) {
    print_length += 0.5;
  }
  if (trim_sheet.Thrust4 !== null && trim_sheet.Thrust4 !== undefined) {
    print_length += 0.5;
  }

  var printer_cmd = [
    "SIZE 2.84," + print_length.toFixed(2),
    "GAP 0,0",
    "DIRECTION 0",
    "CLS",
  ];

  //Load Sheet name
  console.log(trim_sheet);
  var vendor_name = Enviornment.get("VENDOR") + " LOADSHEET";
  printer_cmd.push('TEXT 275,50,"0",0,11,11,2,"' + vendor_name + '"');

  var line = 2;
  //LIne 1
  printer_cmd.push(
    "TEXT 10," +
      line * 50 +
      ',"0",0,10,10,"' +
      trim_sheet.flight_no +
      "/" +
      formatDateGetDay(trim_sheet.flight_date) +
      '"'
  );
  printer_cmd.push(
    "TEXT 186," +
      line * 50 +
      ',"0",0,10,10,"' +
      formatDate(trim_sheet.trim_gen_time) +
      '"'
  );

  // var time    =   momentTZ.tz(trim_sheet.STD,"UTC").format("HH:mm")
  printer_cmd.push(
    "TEXT 372," + line * 50 + ',"0",0,10,10,"' + TrimGenTimeUTCTime + '"'
  );
  printer_cmd.push(
    "TEXT 560," +
      line * 50 +
      ',"0",0,10,10,3,"ED-M0' +
      trim_sheet.edition_no +
      '"'
  );

  //Line 2
  line++;
  printer_cmd.push(
    "TEXT 10," +
      line * 50 +
      ',"0",0,10,10,"' +
      trim_sheet.source +
      "-" +
      trim_sheet.destination +
      '"'
  );
  printer_cmd.push(
    "TEXT 186," +
      line * 50 +
      ',"0",0,10,10,"' +
      trim_sheet.ac_type +
      "/" +
      CONFIG +
      '"'
  );
  printer_cmd.push(
    "TEXT 372," + line * 50 + ',"0",0,10,10,"' + trim_sheet.regno + '"'
  );
  printer_cmd.push(
    "TEXT 560," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.crew + '"'
  );

  //Line 3
  if (trim_sheet.IsFreighter == 0 && trim_sheet.IsCargoOnSeatStr == false) {
    line++;
    printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"COMP WT "');
    printer_cmd.push(
      "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.COMPWT + '"'
    );
  }

  //Line 3
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"CAB BG WT "');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.CABBGWT + '"'
  );

  //Line 3
  if (trim_sheet.IsFreighter == 0 && trim_sheet.IsCargoOnSeatStr == false) {
    line++;
    printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"PAX WT "');
    printer_cmd.push(
      "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.PAXWT + '"'
    );
  }
  //Line 3
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"TTL LOAD "');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.total_load + '"'
  );

  //Line 4
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"DOW "');
  printer_cmd.push(
    "TEXT 280," +
      line * 50 +
      ',"0",0,10,10,3,"' +
      Math.round(trim_sheet.dow) +
      '"'
  );

  //Line 5
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"ZFW "');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.zfw + '"'
  );
  printer_cmd.push("TEXT 372," + line * 50 + ',"0",0,10,10,"MAX "');

  if (lim1 === true) {
    printer_cmd.push(
      "TEXT 560," +
        line * 50 +
        ',"0",0,10,10,3,"' +
        trim_sheet.mzfw +
        " L" +
        '"'
    );
  } else {
    printer_cmd.push(
      "TEXT 560," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.mzfw + '"'
    );
  }

  //Line 6
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"TOF "');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.take_of_fuel + '"'
  );

  //Line 7
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"TOW "');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.tow + '"'
  );
  printer_cmd.push("TEXT 372," + line * 50 + ',"0",0,10,10,"MAX "');

  if (lim2 === true) {
    printer_cmd.push(
      "TEXT 560," +
        line * 50 +
        ',"0",0,10,10,3,"' +
        trim_sheet.otow +
        " L" +
        '"'
    );
  } else {
    printer_cmd.push(
      "TEXT 560," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.otow + '"'
    );
  }

  //Line 8
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"TRIP "');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.trip_fuel + '"'
  );

  //Line 9
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"LAW "');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.law + '"'
  );
  printer_cmd.push("TEXT 372," + line * 50 + ',"0",0,10,10,"MAX "');

  if (lim3 === true) {
    printer_cmd.push(
      "TEXT 560," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.olw + " L" + '"'
    );
  } else {
    printer_cmd.push(
      "TEXT 560," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.olw + '"'
    );
  }

  //Line 10
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"UNDERLOAD "');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.underload + '"'
  );

  //Line 11
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"DOI"');
  printer_cmd.push(
    "TEXT 280," + line * 50 + ',"0",0,10,10,3,"' + trim_sheet.doi + '"'
  );

  //Line 12
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"LIZFW "');
  printer_cmd.push(
    "TEXT 280," +
      line * 50 +
      ',"0",0,10,10,3,"' +
      fixed2Number(trim_sheet.lizfw) +
      '"'
  );
  //  printer_cmd.push("TEXT 372,"+line*50+",\"0\",0,10,10,\"ZFMAC \"")
  //  printer_cmd.push("TEXT 560,"+line*50+",\"0\",0,10,10,3,\""+fixed2Number(trim_sheet.zfmac)+"\"")

  //Line 13
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"LITOW "');
  printer_cmd.push(
    "TEXT 280," +
      line * 50 +
      ',"0",0,10,10,3,"' +
      fixed2Number(trim_sheet.litow) +
      '"'
  );
  //  printer_cmd.push("TEXT 372,"+line*50+",\"0\",0,10,10,\"TOWMAC \"")
  //  printer_cmd.push("TEXT 560,"+line*50+",\"0\",0,10,10,3,\""+fixed2Number(trim_sheet.towmac)+"\"")

  //Line 14
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"LILW "');
  printer_cmd.push(
    "TEXT 280," +
      line * 50 +
      ',"0",0,10,10,3,"' +
      fixed2Number(trim_sheet.lilw) +
      '"'
  );
  //  printer_cmd.push("TEXT 372,"+line*50+",\"0\",0,10,10,\"LWMAC \"")
  //  printer_cmd.push("TEXT 560,"+line*50+",\"0\",0,10,10,3,\""+fixed2Number(trim_sheet.lwmac)+"\"")

  line++;
  line++;
  printer_cmd.push("TEXT 100," + line * 50 + ',"0",0,10,10,2,"FWD LMT"');
  printer_cmd.push("TEXT 270," + line * 50 + ',"0",0,10,10,2,"ZFMAC"');
  printer_cmd.push("TEXT 450," + line * 50 + ',"0",0,10,10,2,"AFT LMT"');
  line++;
  printer_cmd.push(
    "TEXT 100," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.ZFWMACFWD) +
      '"'
  );
  printer_cmd.push(
    "TEXT 270," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.zfmac) +
      '"'
  );
  printer_cmd.push(
    "TEXT 450," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.ZFWMACAFT) +
      '"'
  );

  line++;
  printer_cmd.push("TEXT 100," + line * 50 + ',"0",0,10,10,2,"FWD LMT"');
  printer_cmd.push("TEXT 270," + line * 50 + ',"0",0,10,10,2,"TOWMAC"');
  printer_cmd.push("TEXT 450," + line * 50 + ',"0",0,10,10,2,"AFT LMT"');
  line++;
  printer_cmd.push(
    "TEXT 100," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.TOWMACFWD) +
      '"'
  );
  printer_cmd.push(
    "TEXT 270," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.towmac) +
      '"'
  );
  printer_cmd.push(
    "TEXT 450," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.TOWMACAFT) +
      '"'
  );

  line++;
  printer_cmd.push("TEXT 100," + line * 50 + ',"0",0,10,10,2,"FWD LMT"');
  printer_cmd.push("TEXT 270," + line * 50 + ',"0",0,10,10,2,"LWTMAC"');
  printer_cmd.push("TEXT 450," + line * 50 + ',"0",0,10,10,2,"AFT LMT"');
  line++;
  printer_cmd.push(
    "TEXT 100," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.LWMACFWD) +
      '"'
  );
  printer_cmd.push(
    "TEXT 270," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.lwmac) +
      '"'
  );
  printer_cmd.push(
    "TEXT 450," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      fixed2Number(trim_sheet.LWMACAFT) +
      '"'
  );

  line++;

  // //Line 12
  // line++;
  // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"LIZFW\"")
  // printer_cmd.push("TEXT 180,"+((line*50)+3)+",\"2\",0,1,1,3,\""+fixed2Number(trim_sheet.lizfw)+"\"")
  // printer_cmd.push("TEXT 200,"+line*50+",\"0\",0,10,10,\"LITOW\"")
  // printer_cmd.push("TEXT 380,"+((line*50)+3)+",\"2\",0,1,1,3,\""+fixed2Number(trim_sheet.litow)+"\"")
  // printer_cmd.push("TEXT 400,"+line*50+",\"0\",0,10,10,\"LILW\"")
  // printer_cmd.push("TEXT 560,"+((line*50)+3)+",\"2\",0,1,1,3,\""+fixed2Number(trim_sheet.lilw)+"\"")

  // //Line 13
  // line++;
  // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"ZFMAC\"")
  // printer_cmd.push("TEXT 180,"+((line*50)+3)+",\"2\",0,1,1,3,\""+fixed2Number(trim_sheet.zfmac)+"\"")
  // printer_cmd.push("TEXT 200,"+line*50+",\"0\",0,10,10,\"TOWMAC\"")
  // printer_cmd.push("TEXT 380,"+((line*50)+3)+",\"2\",0,1,1,3,\""+fixed2Number(trim_sheet.towmac)+"\"")
  // printer_cmd.push("TEXT 400,"+line*50+",\"0\",0,10,10,\"LWMAC\"")
  // printer_cmd.push("TEXT 560,"+((line*50)+3)+",\"2\",0,1,1,3,\""+fixed2Number(trim_sheet.lwmac)+"\"")

  // //Thrust
  // line++;
  // printer_cmd.push("TEXT 10,"+line*50+",\"2\",0,1,1,\"THRUST\"")
  // printer_cmd.push("TEXT 275,"+line*50+",\"2\",0,1,1,\"FLAP\"")
  // printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB\"")

  //thrust 1
  if (thrust !== null && thrust !== 0 && thrust !== undefined) {
    line++;
    printer_cmd.push(
      "TEXT 10," +
        line * 50 +
        ',"0",0,10,10,"THRUST ' +
        formatThrust(thrust) +
        '"'
    );
    printer_cmd.push(
      "TEXT 200," + line * 50 + ',"0",0,10,10,"FLAP ' + flap.trim() + '"'
    );
    printer_cmd.push(
      "TEXT 560," +
        line * 50 +
        ',"0",0,10,10,3,"STAB ' +
        fixed1Number(stab) +
        '"'
    );
  }

  // if(trim_sheet.Thrust1 !== null && trim_sheet.Thrust1 !== 0 && trim_sheet.Thrust1 !== undefined ){
  //     line++;
  //     // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"THRUST "+formatThrust(trim_sheet.Thrust1)+"\"")
  //     printer_cmd.push("TEXT 200,"+line*50+",\"2\",0,1,1,\"FLAP "+trim_sheet.T1Flap2.trim()+"\"")
  //     printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB "+trim_sheet.T1Stab2+"\"")
  // }

  // //thrust 2
  // if(trim_sheet.Thrust2 !== null && trim_sheet.Thrust2 !== 0 && trim_sheet.Thrust2 !== undefined ){
  //     line++;
  //     printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"THRUST "+formatThrust(trim_sheet.Thrust2)+"\"")
  //     printer_cmd.push("TEXT 200,"+line*50+",\"2\",0,1,1,\"FLAP "+trim_sheet.T2Flap1.trim()+"\"")
  //     printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB "+trim_sheet.T2Stab1+"\"")
  // }

  // if(trim_sheet.Thrust2 !== null && trim_sheet.Thrust2 !== 0 && trim_sheet.Thrust2 !== undefined ){
  //     line++;
  //     // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"THRUST "+formatThrust(trim_sheet.Thrust2)+"\"")
  //     printer_cmd.push("TEXT 200,"+line*50+",\"2\",0,1,1,\"FLAP "+trim_sheet.T2Flap2.trim()+"\"")
  //     printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB "+trim_sheet.T2Stab2+"\"")
  // }

  // //thrust 3
  // if(trim_sheet.Thrust3 !== null && trim_sheet.Thrust3 !== 0 && trim_sheet.Thrust3 !== undefined ){
  //     line++;
  //     printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"THRUST "+formatThrust(trim_sheet.Thrust3)+"\"")
  //     printer_cmd.push("TEXT 200,"+line*50+",\"2\",0,1,1,\"FLAP "+trim_sheet.T3Flap1.trim()+"\"")
  //     printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB "+trim_sheet.T3Stab1+"\"")
  // }

  // if(trim_sheet.Thrust3 !== null && trim_sheet.Thrust3 !== 0 && trim_sheet.Thrust3 !== undefined ){
  //     line++;
  //     // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"THRUST "+formatThrust(trim_sheet.Thrust3)+"\"")
  //     printer_cmd.push("TEXT 200,"+line*50+",\"2\",0,1,1,\"FLAP "+trim_sheet.T3Flap2.trim()+"\"")
  //     printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB "+trim_sheet.T3Stab2+"\"")
  // }

  // //thrust 4
  // if(trim_sheet.Thrust4 !== null && trim_sheet.Thrust4 !== 0 && trim_sheet.Thrust4 !== undefined ){
  //     line++;
  //     printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"THRUST "+formatThrust(trim_sheet.Thrust4)+"\"")
  //     printer_cmd.push("TEXT 200,"+line*50+",\"2\",0,1,1,\"FLAP "+trim_sheet.T4Flap1.trim()+"\"")
  //     printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB "+trim_sheet.T4Stab1+"\"")
  // }

  // if(trim_sheet.Thrust4 !== null && trim_sheet.Thrust4 !== 0 && trim_sheet.Thrust4 !== undefined ){
  //     line++;
  //     // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"THRUST "+formatThrust(trim_sheet.Thrust4)+"\"")
  //     printer_cmd.push("TEXT 200,"+line*50+",\"2\",0,1,1,\"FLAP "+trim_sheet.T4Flap2.trim()+"\"")
  //     printer_cmd.push("TEXT 560,"+line*50+",\"2\",0,1,1,3,\"STAB "+trim_sheet.T4Stab2+"\"")
  // }

  //load in compartment
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"LOAD IN CPTS"');
  if (Maxcarg >= 1) {
    printer_cmd.push(
      "TEXT 200," + (line * 50 + 3) + ',"0",0,10,10,"1/' + cargo[0] + '"'
    );
  }
  if (Maxcarg >= 2) {
    printer_cmd.push(
      "TEXT 300," + (line * 50 + 3) + ',"0",0,10,10,"2/' + cargo[1] + '"'
    );
  }
  if (Maxcarg >= 3) {
    printer_cmd.push(
      "TEXT 400," + (line * 50 + 3) + ',"0",0,10,10,"3/' + cargo[2] + '"'
    );
  }
  if (Maxcarg >= 4) {
    printer_cmd.push(
      "TEXT 560," + (line * 50 + 3) + ',"0",0,10,10,3,"4/' + cargo[3] + '"'
    );
  }

  //Zone
  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"ZONE1"');
  printer_cmd.push("TEXT 180," + line * 50 + ',"0",0,10,10,3,"' + pax[0] + '"');
  printer_cmd.push("TEXT 210," + line * 50 + ',"0",0,10,10,"ZONE2"');
  printer_cmd.push("TEXT 400," + line * 50 + ',"0",0,10,10,3,"' + pax[1] + '"');
  printer_cmd.push("TEXT 425," + line * 50 + ',"0",0,10,10,"ZONE3"');
  printer_cmd.push("TEXT 560," + line * 50 + ',"0",0,10,10,3,"' + pax[2] + '"');

  if (Maxpax >= 4) {
    line++;
    printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"ZONE4"');
    printer_cmd.push(
      "TEXT 180," + line * 50 + ',"0",0,10,10,3,"' + pax[3] + '"'
    );
    if (Maxpax >= 5) {
      printer_cmd.push("TEXT 210," + line * 50 + ',"0",0,10,10,"ZONE5"');
      printer_cmd.push(
        "TEXT 400," + line * 50 + ',"0",0,10,10,3,"' + pax[4] + '"'
      );
    }
    if (Maxpax >= 6) {
      printer_cmd.push("TEXT 425," + line * 50 + ',"0",0,10,10,"ZONE6"');
      printer_cmd.push(
        "TEXT 560," + line * 50 + ',"0",0,10,10,3,"' + pax[5] + '"'
      );
    }
  }
  if (Maxpax >= 7 && Maxpax <= 8) {
    line++;
    printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"ZONE7"');
    printer_cmd.push(
      "TEXT 180," + line * 50 + ',"0",0,10,10,3,"' + pax[6] + '"'
    );
    if (Maxpax >= 8) {
      printer_cmd.push("TEXT 210," + line * 50 + ',"0",0,10,10,"ZONE8"');
      printer_cmd.push(
        "TEXT 400," + line * 50 + ',"0",0,10,10,3,"' + pax[7] + '"'
      );
    }
  }

  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"PAX"');
  printer_cmd.push(
    "TEXT 180," +
      (line * 50 + 3) +
      ',"0",0,10,10,3,"' +
      trim_sheet.adult +
      "/" +
      trim_sheet.child +
      "/" +
      trim_sheet.infant +
      '"'
  );
  printer_cmd.push("TEXT 210," + line * 50 + ',"0",0,10,10,"TTL"');
  printer_cmd.push(
    "TEXT 400," + (line * 50 + 3) + ',"0",0,10,10,3,"' + trim_sheet.ttl + '"'
  );
  printer_cmd.push("TEXT 425," + line * 50 + ',"0",0,10,10,"POB"');
  printer_cmd.push(
    "TEXT 560," + (line * 50 + 3) + ',"0",0,10,10,3,"' + trim_sheet.sob + '"'
  );

  line++;
  //printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"SI :\"");
  const LINE_LENGHT = 40;
  var trimMessage = "SI :     " + trim_sheet.si;
  var trimArr = wordWrapToPrint(trimMessage, 40);
  for (var i = 0; i < trimArr.length; i++) {
    line++;
    printer_cmd.push(
      "TEXT 10," + line * 50 + ',"0",0,10,10,"' + trimArr[i] + '"'
    );
  }
  // for(var i=0;i<Math.ceil(trimMessage.length/LINE_LENGHT);i++){
  //     var start = i*LINE_LENGHT;
  //     var end   = (i+1)*LINE_LENGHT // -1
  //     if(end > trimMessage.length-1){
  //         end = trimMessage.length; //-1;
  //     }
  //     if(i>0){
  //       line++;
  //     }
  //     printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\""+trimMessage.substring(start,end)+"\"");
  // }
  // printer_cmd.push("TEXT 100,"+line*50+",\"0\",0,10,10,\""+trim_sheet.si+"\"");

  // lastminute change
  line++;
  printer_cmd.push(
    "TEXT 275," + line * 50 + ',"0",0,10,10,2,"LAST MINUTE CHANGE"'
  );

  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"DEST"');
  printer_cmd.push("TEXT 160," + line * 50 + ',"0",0,10,10,"SPEC"');
  printer_cmd.push("TEXT 300," + line * 50 + ',"0",0,10,10,"CL/CPT"');
  printer_cmd.push("TEXT 560," + line * 50 + ',"0",0,10,10,3,"+/- WEIGHT"');

  line++;
  line++;

  line++;
  printer_cmd.push(
    "TEXT 10," + line * 50 + ',"0",0,10,10,"ALL WEIGHTS IN KILOGRAM"'
  );

  //prepared by
  // line++;
  // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"PREPARED BY\"")
  // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,\"PREPARED BY "+trim_sheet.Trim_Officer+"\"")
  var preByTrimArr2 = wordWrapToPrint(
    "PREPARED BY " + trim_sheet.Trim_Officer,
    40
  );
  for (var i = 0; i < preByTrimArr2.length; i++) {
    line++;
    printer_cmd.push(
      "TEXT 10," + line * 50 + ',"0",0,10,10,"' + preByTrimArr2[i] + '"'
    );
  }

  line++;
  printer_cmd.push(
    "TEXT 10," + line * 50 + ',"0",0,10,10,"' + trim_sheet.loginId + '"'
  );
  printer_cmd.push(
    "TEXT 275," +
      line * 50 +
      ',"0",0,10,10,2,"' +
      formatDate(trim_sheet.trim_gen_time) +
      '"'
  );
  printer_cmd.push(
    "TEXT 560," +
      line * 50 +
      ',"0",0,10,10,3,"' +
      TrimGenTimeUTCTime +
      " UTC" +
      '"'
  );

  line++;
  printer_cmd.push(
    "TEXT 10," +
      line * 50 +
      ',"0",0,10,10,"I CERTIFY THAT THIS AIRCRAFT HAS BEEN"'
  );

  line++;
  printer_cmd.push(
    "TEXT 10," + line * 50 + ',"0",0,10,10,"LOADED IN ACCORDANCE WITH THE AFM"'
  );

  line++;

  //load officier and captain
  line++;
  // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,2,\"LOAD OFFICER\"");
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"LOAD OFFICER"');

  var messageArrLO2 = wordWrapToPrint(trim_sheet.load_officer, 40);
  for (var i = 0; i < messageArrLO2.length; i++) {
    line++;
    printer_cmd.push(
      "TEXT 10," + line * 50 + ',"0",0,10,10,"' + messageArrLO2[i] + '"'
    );
  }

  line++;
  // printer_cmd.push("TEXT 10,"+line*50+",\"0\",0,10,10,2,\"CAPTAIN / ATPL NO.\"");
  printer_cmd.push(
    "TEXT 10," + line * 50 + ',"0",0,10,10,"CAPTAIN / ATPL NO."'
  );

  var messageArrCP2 = wordWrapToPrint(trim_sheet.captain, 40);
  for (var i = 0; i < messageArrCP2.length; i++) {
    line++;
    printer_cmd.push(
      "TEXT 10," + line * 50 + ',"0",0,10,10,"' + messageArrCP2[i] + '"'
    );
  }

  // line++;
  // printer_cmd.push("TEXT 100,"+line*50+",\"0\",0,10,10,2,\""+trim_sheet.load_officer+"\"")
  // printer_cmd.push("TEXT 400,"+line*50+",\"0\",0,10,10,2,\""+trim_sheet.captain+"\"")

  line++;
  printer_cmd.push(
    "TEXT 10," +
      line * 50 +
      ',"0",0,10,10,"AUTOMATED LOAD & TRIM SHEET APPROVED BY"'
  );

  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"DELHI"');

  line++;
  printer_cmd.push(
    "TEXT 10," + line * 50 + ',"0",0,10,10,"DAW VIDE LETTER NO: SJ/L&T/1167"'
  );

  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"Dated 06/01/2020"');

  line++;
  printer_cmd.push("TEXT 10," + line * 50 + ',"0",0,10,10,"END"');

  printer_cmd[0] = "SIZE 2.84," + (line * 0.25).toFixed(2);
  printer_cmd.push("PRINT 1");

  console.log(printer_cmd);

  if (window.TscBluetoothPrinter === undefined) {
    defer.resolve({});
    return defer.promise;
  }

  window.TscBluetoothPrinter.print(printer_name, printer_cmd, function () {
    console.log(11111);
    defer.resolve({});
  });
  return defer.promise;
}

function wordWrapToPrint(str, char_length) {
  // console.log('input', str );
  // var char_length = 40;
  let sArray = str.split(" ");
  let printArray = [],
    charCount = 0,
    line = 0,
    sValue = "";
  sArray.forEach((str, i) => {
    // console.log(str+" - "+i+" - "+(sArray.length-1));
    charCount = charCount + str.length;
    if (charCount > char_length) {
      printArray[line++] = sValue.trim();
      charCount = str.length;
      sValue = "";
    }

    sValue += str + " ";
    charCount++;

    if (sArray.length - 1 == i) {
      printArray[line++] = sValue.trim();
    }
  });
  // console.log(printArray);
  return printArray;
}
