import * as q from "q";
import * as Enviornment from "./environment";

function _openDatabase() {
  if (window.sqlitePlugin !== undefined) {
    return indexedDB.open(
      Enviornment.get("DB_NAME"),
      1
  );
  } else {
    return indexedDB.open(
      Enviornment.get("DB_NAME"),
      1
  )
    
  }
}

export function c_openDatabase() {
  return _openDatabase();
}

export function c_transaction(db) {
  var defer = q.defer();

  db.transaction(
    (tx) => {
      defer.resolve(tx);
    },
    function (err) {
      defer.reject(err);
    }
  );
  return defer.promise;
}

export function c_exeuteSQL(sql, param) {
  var defer = q.defer();

  var db = _openDatabase();

  db.transaction(
    (tx) => {
      tx.executeSql(
        sql,
        param,
        (tx, result) => {
          defer.resolve(result);
        },
        function (err) {
          console.log(err);
          console.log("sql" + sql);
          defer.reject(err);
        }
      );
    },
    function (err) {
      defer.reject(err);
    }
  );
  return defer.promise;
}
const DB_NAME = Enviornment.get("DB_NAME");
const DB_VERSION = 1;

// initializeDatabaseStructure()
//   .then((db) => {
//     console.log("Database initialized successfully");
//     // Perform further operations with the database if needed
//   })
//   .catch((error) => {
//     console.error(error);
//   });

export  function openDatabase() {
  console.log('fjnc')
  // var dbDeleteRequest = indexedDB.deleteDatabase(Enviornment.get("DB_NAME"),1);

  return new Promise(function (resolve, reject) {
    console.log(Enviornment.get("DB_NAME"))
  
  
  var openRequest = indexedDB.open(Enviornment.get('DB_NAME'),1);
  console.log('dsjfjd', openRequest);
    

   
    openRequest.onupgradeneeded = function (event) {
      var db = event.target.result;

      // Define the object store schema with five indexes

      var objectStore1 = db.createObjectStore("ramp_transactions", {
        keyPath: "id",
      });
       var indexes = [
        "fims_id",
        "transaction_type",
        "user_id",
        "time",
        "isSync",
        "message",
      ];
      indexes.forEach(function (indexName) {
        objectStore1.createIndex(indexName, indexName, { unique: false });
      });

      var objectStore2 = db.createObjectStore("fims_schedule",
      {
        keyPath: "id",
      });
      var indexes = [
        "id",
        "Regn_no",
        "Acft_Type",
        "Flight_no",
        "Source",
        "Destination",
        "Flight_Date",
        "STD",
        "STA",
        "ETA",
        "BAYNO",
      ];
      indexes.forEach(function (indexName) {
        objectStore2.createIndex(indexName, indexName, { unique: false });
      });

      var objectStore3 = db.createObjectStore("trimsheetlmc", {
        keyPath: "id",
      });

      // Create five indexes
      var indexes = ["ms_id","FlightNo","Flight_Date",
      "Acft_Type",
              "STD",
              "TrimSheetTime",
              "Source",
              "Destination",
              "Regn_no",
          "Crew",
          "ZFW",
          "MZFW",
          "TOF",
          "TOW",
          "MTOW",
          "TripFuel",
          "LAW",
                  "MLAW",
                  "underLoad",
                  "LIZFW",
                  "LITOW",
                  "LILAW",
                  "ZFWMAC",
                  "MAC",
                  "TOWMAC",
                  "LAWMAC",
                  "Thrust24K",
                  "Flap1",
                          "Stab1",
                          "Flap2",
                          "Stab2",
                          "Thrust26K",
                          "Flap3",
                          "Stab3",
                          "Flap4",
                          "Stab4",
                          "cmpt1",
                          "cmpt2",
                          "cmpt3",
                          "cmpt4",
                          "Adult",
                          "Child",
                          "Infant",
                          "Tpax",
                          "SOB",
                          "TransitPax",
                                  "SI",
                                  "LoadOfficer",
                                  "Captain",
                                  "PreparedBy",
                                  "Z1a",
                                  "Z1c",
                                  "Z1i",
                                  "Z2a",
                                  "Z2c",
                                  "Z2i",
                                  "Z3a",
                                  "Z3c",
                                  "Z3i",
                                  "active",
                                  "isSync",
                                  "isOfflineGenerated",
                                  "created_at",
            ];
      indexes.forEach(function (indexName) {
        objectStore3.createIndex(indexName, indexName, { unique: false });
      });

      var objectStore4 = db.createObjectStore("rampdata", { keyPath: "id" });

      // Create five indexes
      var indexes = ["fims_id", "in_time",
              "door_open",
              "cargo_open",
              "crew",
              "fuel_start",
              "fuel_end",
              "tech_clear",
              "cargo_close",
              "lnt",
              "door_close",
              "catering_start",
              "catering_end",
              "security_start",
              "security_end",
              "service_start",
              "service_end",
              "out",
              "in_time_update",
              "door_open_update",
              "cargo_open_update",
              "crew_update",
              "fuel_start_update",
              "fuel_end_update",
              "tech_clear_update",
              "cargo_close_update",
              "lnt_update",
              "door_close_update",
              "catering_start_update",
              "catering_end_update",
              "security_start_update",
              "security_end_update",
              "service_start_update",
              "service_end_update",
              "out_update",
    ];
      indexes.forEach(function (indexName) {
        objectStore4.createIndex(indexName, indexName, { unique: false });
      });

      var objectStore5 = db.createObjectStore("fleetinfo", { keyPath: "Id" });

      // Create five indexes
      var indexes = ["Id",
        "AC_REGN",
        "AC_TYPE",
        "CONFIG",
        "OEW",
        "OEW_INDEX",
        "STDCREW",
        "Pantry",
        "MTOW",
        "MLW",
          "MZFW",
          "MAxFuel",
          "EMRG_EXIT",
          "THRUST",
          "CMPT1",
          "CMPT2",
          "CMPT3",
          "CMPT4",
          "LastRow",
          "OALimit",
          "OBLimit",
          "OCLimit",
          "ODLimit",
          "OELimit",
          "C_Constant",
          "K_Constant",
          "CG_Ref",
          "LeMac",
          "Mac",
          "OFLimit",
          "MaxCabin",
          "MaxCompartment",
          "CabinLimits",
          "CompLimits",
          "CabinIndex",
          "CompIndex",
          "IsFreighter",
          "MinFOB",
          "MinLW",
          "MinTOW",
          "MinTripFuel",
          "MaxCockpitOccupant",
          "MaxFwdGalley",
          "MaxAftGalley",
          "MaxCabinBaggage",
          "MaxAftJump",
          "MaxFwdJump",
          "MaxMidJump",
          "MaxFirstObserver",
          "MaxSecondObserver",
          "MaxSupernumerary",
          "MaxPortableWater",
          "MaxSpareWheels",
          "MaxETOPEquipments",
          "StdFwdJump",
          "StdMidJump",
          "StdAftJump",
          "StdCabinBaggage",
          "StdAftGalley",
          "StdFwdGalley",
          "StdPortableWater",
          "StdSpareWheels",
          "StdETOPEquipments"
      ];
      indexes.forEach(function (indexName) {
        objectStore5.createIndex(indexName, indexName, { unique: false });
      });

      var objectStore6 = db.createObjectStore("cgreftable", { keyPath: 'Weight', });

      // Create five indexes
      var indexes = [
       
        "AcftType",
        "Weight",
        "Aft_Tow_Limit",
        "Aft_Zfw_Limit",
        "Fwd_Tow_Limit",
        "Fwd_Zfw_Limit",
        "Fwd_Zfw_Limit_Gt65317",
      ];
      indexes.forEach(function (indexName) {
        objectStore6.createIndex(indexName, indexName, { unique: false });
      });
      var objectStore7 = db.createObjectStore("cglimitszfw", { keyPath: "Id" });

      // Create five indexes
      var indexes = [
        "Id",
        "CGVARIANT",
        "Weight",
        "Fwd_Zfw_Limit",
        "Aft_Zfw_Limit",
      ];
      indexes.forEach(function (indexName) {
        objectStore7.createIndex(indexName, indexName, { unique: false });
      });
      var objectStore8 = db.createObjectStore("cgreftabletow", {
        keyPath: "Id",
      });

      // Create five indexes
      var indexes = ["Id", "Regn_no", "TableName", "MinLW", "MaxLW"];
      indexes.forEach(function (indexName) {
        objectStore8.createIndex(indexName, indexName, { unique: false });
      });

      var objectStore10 = db.createObjectStore("flighteditionno", {
        keyPath: "Id",
      });

      // Create five indexes
      var indexes = [
        "Id",
              "Flight_Date",
              "Flight_no",
              "Destination",
              "source",
              "EdNo",
              "Regn_no",
              "ActcrewStr",
              "cmpt1",
              "cmpt2",
              "cmpt3",
              "cmpt4",
              "ZFW",
              "FOB",
              "TOW",
              "TripFuel",
              "underLoadLMC",
              "ZFWindex",
              "TOWindex",
              "LWindex",
              "ZFWMAC",
              "TOWMAC",
              "LWMAC",
              "LoadOfficer",
              "SI",
              "Captain",
              "OEW",
              "OEW_Index",
              "AdjustStr",
              "ActCabStr",
              "ActCompStr",
              "OLW",
              "OTOW",
              "RTOW",
              "AdjustStrv2",
              "LW",
              "TrimOfficer",
              "UTCtime",
              "ISTtime",
              "FlapValues",
              "ThrustValues",
              "StabValues",
              "AppType",
              "ZFWMACFWD",
              "ZFWMACAFT",
              "TOWMACFWD",
              "TOWMACAFT",
              "LWMACFWD",
              "LWMACAFT",
              "Userid",
              "isSync"
      ];
      indexes.forEach(function (indexName) {
        objectStore10.createIndex(indexName, indexName, { unique: false });
      });

      var objectStore9 = db.createObjectStore("ltadjustweightv2", {
        keyPath: "Id",
      });

      // Create five indexes
      var indexes = [
        "Id",
        "Regn_no",
        "AcftType",
        "CockpitOccupantPerKG",
        "FwdGalleyPerKG",
        "AftGalleyPerKG",
        "AftJumpPerKG",
        "FwdJumpPerKg",
        "MidJumpPerKg",
        "CabinBaggagePerKg",
        "FirstObserver",
        "SecondObserver",
        "Supernumeraries",
        "PortableWaterPerKG",
        "SpareWheelsPerKG",
        "ETOPEquipmentsPerKG",
        "LastCreatedTime",
        "LastUpdatedTime",
      ];
      indexes.forEach(function (indexName) {
        objectStore9.createIndex(indexName, indexName, { unique: false });
      });
      var objectStore10 = db.createObjectStore("cgreftablezfw", {
        keyPath: "Id",
      });

      // Create five indexes
      var indexes = [
      "Id",
      "Regn_no",
      "TableName",
       "MinLW",
       "MaxLW"
      ];
      
      indexes.forEach(function (indexName) {
        objectStore10.createIndex(indexName, indexName, { unique: false });
      });
      var objectStore11 = db.createObjectStore("stabtrimdata", {
        keyPath: "Id",
      });

      // Create five indexes
      var indexes = [
        "Id",
        "STABVARIANT",
        "THRUST",
        "FLAP",
        "TOW",
        "TOWMAC",
        "STAB",
      ];
      indexes.forEach(function (indexName) {
        objectStore11.createIndex(indexName, indexName, { unique: false });
      });

      var objectStore12 = db.createObjectStore("cglimitstow", {
        keyPath: "Id",
      });

      // Create five indexes
      var indexes = [
        "Id",
        "CGVARIANT",
        "Weight",
        "Fwd_Tow_limit",
        "Aft_Tow_Limit",
      ];
      indexes.forEach(function (indexName) {
        objectStore12.createIndex(indexName, indexName, { unique: false });
      });
      var objectStore13 = db.createObjectStore("stabtrimthrust", {
        keyPath: "Id",
      });

      var indexes = [
        "Id",
        "Regn_no",
        "AcftType",
        "TableName",
        "LOPA",
        "Thrust",
        "Flap",
      ];
      indexes.forEach(function (indexName) {
        objectStore13.createIndex(indexName, indexName, { unique: false });
      });
      var objectStore14 = db.createObjectStore("ltadjustweight", {
        keyPath: "Id",
      });

      var indexes = [
        "Id",
        "AcftType",
        "CabinBaggagePerKg",
        "CockpitOccupantPerKG",
        "FwdGalleyPerKG",
        "AftGalleyPerKG",
        "AftJumpPerKG",
        "FwdJumpPerKG",
        "MidJumpPerKG",
        "Regn_no",
      ];
      indexes.forEach(function (indexName) {
        objectStore14.createIndex(indexName, indexName, { unique: false });
      });

      var objectStore15 = db.createObjectStore("trimsheetlmcoffline", {
        keyPath: "id",
      });

      // Create five indexes
      var indexes = ["id","flight_no","flight_date","trim_gen_time","edition_no",
    "source",
    "destination",
          "std",
          "sta",
          "regno",
          "ac_type",
          "config",
          "crew",
          "COMPWT",
          "CABBGWT",
          "PAXWT",
          "total_load",
          "dow",
          "zfw",
          "mzfw","take_of_fuel",
          "tow",
          "trip_fuel",
          "law",
          "olw",
          "otow",
          "mlw",
          "underload",
          "doi",
          "lizfw",
          "litow",
          "lilw",
          "zfmac",
          "towmac",
          "lwmac",
          "pax",
          "cargo",
          "adult",
          "child",
          "infant",
          "ttl",
          "sob",
          "si",
          "loginId",
          "trim_officer",
          "load_officer",
          "captain",
          "thrust",
          "isSync",
          "isOfflineGenerated",
          "created_at",
          "paxAcm",
          "AdjustStr",
          "ActCabStr",
          "ActCompStr",
          "ZFWMACFWD",
          "ZFWMACAFT",
          "TOWMACFWD",
          "TOWMACAFT",
          "LWMACFWD",
          "LWMACAFT"
  ];
      indexes.forEach(function (indexName) {
        objectStore15.createIndex(indexName, indexName, {unique:false });
      });
      var objectStore16 = db.createObjectStore("thrustarchive", {
        keyPath: "Id",
      });

      // Create five indexes
      var indexes = [
        'Id','Flight_Date','Flight_no','Destination','source','Thrust1','T1Flap1','T1Stab1','T1Flap2','T1Stab2','Thrust2','T2Flap1','T2Stab1','T2Flap2','T2Stab2','Thrust3','T3Flap1','T3Stab1','T3Flap2','T3Stab2','Thrust4','T4Flap1','T4Stab1','T4Flap2','T4Stab2','FlapValues','ThrustValues','StabValues','isSync'
      ];
      indexes.forEach(function (indexName) {
        objectStore16.createIndex(indexName, indexName, { unique: false });
      });
      var objectStore17 = db.createObjectStore("nscheckindetail", { keyPath: "Id" });

      // Create five indexes
      var indexes = [
        "Id",
      "Flight_Date",
              "Flight_no",
              "Destination",
              "source",
              "C1Adult",
              "C2Adult",
              "C3Adult",
              "C4Adult",
              "C5Adult",
              "C6Adult",
              "C7Adult",
              "C8Adult",
              "C1Child",
              "C2Child",
              "C3Child",
              "C4Child",
              "C5Child",
              "C6Child",
              "C7Child",
              "C8Child",
              "C1Infant",
              "C2Infant",
              "C3Infant",
              "C4Infant",
              "C5Infant",
              "C6Infant",
              "C7Infant",
              "C8Infant",
              "OutofGate",
      ];
      indexes.forEach(function (indexName) {
        objectStore17.createIndex(indexName, indexName, { unique: false });
      });

      var objectStore18 = db.createObjectStore("nslntdetail", {
        keyPath: "Id",
      });

      
      var indexes = [
        "Id",
              "Flight_Date",
              "Flight_no",
              "Destination",
              "source",
              "Acft_Regn",
              "EDNO",
              "ActcrewStr",
              "cmpt1",
              "cmpt2",
              "cmpt3",
              "cmpt4",
              "TrimGenTimeUTC",
              "ZFW",
              "FOB",
              "TOW",
              "TRIP_FUEL",
              "underLoadLMC",
              "ZFWindex",
              "TOWindex",
              "LWindex",
              "ZFWMAC",
              "TOWMAC",
              "LWMAC",
              "specialStr",
              "LTLoginId",
              "Load_Officer",
              "CAPTAIN",
              "OEW",
              "OEW_Index",
              "AdjustStr",
              "ActCabStr",
              "ActCompStr",
              "OLW",
              "OTOW",
              "RTOW",
              "AdjustStrv2",
              "LW",
              "Trim_Officer",
              "PalletsStr",
              "ZFWMACFWD",
              "ZFWMACAFT",
              "TOWMACFWD",
              "TOWMACAFT",
              "LWMACFWD",
              "LWMACAFT",
              "isSync",
              "CargoOnSeatStr",
              "BagLDM",
              "CargoLDM",
              "ActLoadDistStr",
              "ActLoadDistStrV2",
              "CaptEmpId",
              "TargetTOWMAC",
              "DeviationTOWMAC",
              "AdultLDM",
              "InfantLDM",
              "TotalLDM",
      ];
      indexes.forEach(function (indexName) {
        objectStore18.createIndex(indexName, indexName, { unique: false });
      });

      var objectStore16 = db.createObjectStore("nsflightschedule", {
        keyPath: "Id",
      });

      // Create five indexes
      var indexes = [
        "Id",
        "Flight_Date",
        "Flight_no",
        "Source",
        "Destination",
              "Acft_Regn",
              "Acft_Type",
              "STD",
              "STA",
              "ETD",
              "IsSchedule",
      ];
      indexes.forEach(function (indexName) {
        objectStore16.createIndex(indexName, indexName, { unique: false });
      });
    
      var objectStore19 = db.createObjectStore("saltarchive", {
        keyPath: "Id",
      });

      // Create five indexes
      var indexes = [
        "Id",
        "FlightDate",
        "FlightNo",
        "DepArpt",
        "ArrArpt",
        "AcftRegn",
        "MTow",
        "MZFW",
        "OEW",
        "OEW_Index",
        "AcftPurpose",
        "STDCREW",
        "AdultCntBooked",
        "ChildCntBooked",
        "InfantCntBooked",
        "AdultCabListCheckedIn",
        "ChildCabListCheckedIn",
        "InfantCabListCheckedIn",
        "PaxseatStrCheckedIn",
        "TransitStrCheckedIn",
        "ThruChecked",
        "TotCheckedInPax",
        "OnwardAdultCheckedIn",
        "OnwardChildCheckedIn",
        "BagDetailsCheckedIn",
        "FOB",
        "TripFuel",
        "OLW",
        "OTOW",
        "RTOW",
        "AdjustStrv2",
        "LoadDistStrV2",
        "ActLoadDistStrV2",
        "SpecialStr",
        "PalletsStr",
        "PalletsStrAuto",
        "CargoOnSeatAuto",
        "CargoOnSeatStr",
        "EditionNum",
        "CrewStr",
        "CockpitCrew",
        "CabinCrew",
        "ZFW",
        "TOW",
        "LW",
        "LWCG",
        "LWCGFwdLimit",
        "TOWCG",
        "TOWCGFwdLimit",
        "TOWCGAftLimit",
        "ZFWCG",
        "ZFWCGFwdLimit",
        "ZFWCGAftLimit",
        "TargetTOWCG",
        "ZFWindex",
        "TOWindex",
        "LWindex",
        "LimitFacLw",
        "LimitFacTow",
        "LimitFacZfw",
        "ActCabStr",
        "SectorLDM",
        "AdultLDM",
        "InfantLDM",
        "TotalLDM",
        "BagLDM",
        "CargoLDM",
        "TrafficTotalWeight",
        "FlapValues",
        "ThrustValues",
        "StabValues",
        "UnderLoadLMC",
        "GeneratedTimeUTC",
        "CAPTAIN",
        "LoadOfficer",
        "TrimOfficer",
        "UserId",
        "ErrorMessage",
        "SuggestionMessage",
        "TrimRecallNo",
        "LIRRecallNo",
        "IPAddress",
        "CmptWeights",
        "CabinPax",
        "CockpitOccuPant",
        "CabinAcm",
        "AftJumpSeat",
        "OZFW",
        "isSync",
        "CaptEmpId",
        "LWCGAftLimit",
      ];
      indexes.forEach(function (indexName) {
        objectStore19.createIndex(indexName, indexName, { unique: false });
      });
    
    
    };
   

    openRequest.onsuccess = function (event) {
      console.log('opened sucessfully')
      var db = event.target.result;
      resolve(db);
    };

    openRequest.onerror = function (event) {
      console.log('o sucessfully')
      reject("Error opening database");
    };
  });

  // Usage: Open the database and create the object store with indexes
  openDatabase()
    .then(function (db) {
      db.close(); // Close the database after creating the object store and indexes
      console.log("Object store created with indexes successfully");
    })
    .catch(function (error) {
      console.error("Error opening database:", error);
    });

  //   console.log(DB_NAME, DB_VERSION);
  //   const request = indexedDB.open(DB_NAME, DB_VERSION);
  //   console.log("fdjkdjgk", request);

  //   request.onerror = function (event) {
  //     console.error("Error opening database:", event.target.error);
  //   };

  //   request.onsuccess = function (event) {
  //     const db = event.target.result;
  //     console.log("Database opened successfully:", db);
  //   };

  // let createObjectStore = (db, storeName, options,indexes) => {
  //     // var options = { keyPath: "id", autoIncrement: true };
  //     console.log('12345678',db, storeName, options, indexes)
  //     if (!db.objectStoreNames.contains(storeName)) {
  //       const objectStore = db.createObjectStore(storeName, options);
  //   console.log('db',objectStore)
  //       indexes.forEach((indexName) => {
  //         objectStore.createIndex(indexName, indexName, { unique: false });
  //       });
  //     }
  //   };
  // request.onupgradeneeded = function(event){

  //     console.log('sdgh',event)
  //     try {
  //       const db = event.target.result;
  //       console.log('Database upgrade needed:', db);
  //       createObjectStore(db,"ramp_transations", { keyPath: "id" }, [

  //         "fims_id",
  //         "transaction_type",
  //         "user_id",
  //         "time",
  //         "isSync",
  //         "message",
  //       ]);

  //      createObjectStore(db,"fims_schedule", { keyPath: "id" }, [
  //         "Regn_no",
  //         "Flight_no",
  //         "Source",
  //         "Destination",
  //         "Flight_Date",
  //         "STD",
  //         "STA",
  //         "ETA",
  //         "BAYNO",
  //       ]);
  //       createObjectStore(db,"TrimSheetLMC", { keyPath: "id" }, [
  //         "FlightNo",
  //         "Flight_Date",
  //         "Acft_Type",
  //         "STD",
  //         "TrimSheetTime",
  //         "Source",
  //         "Destination",
  //         "Regn_no",
  //         "Crew",
  //         "ZFW",
  //         "MZFW",
  //         "TOF",
  //         "TOW",
  //         "MTOW",
  //         "TripFuel",
  //         ";AW",
  //         "MLAW",
  //         "underLoad",
  //         "LIZFW",
  //         "LITOW",
  //         "LILAW",
  //         "ZFWMAC",
  //         "MAC",
  //         "TOWMAC",
  //         "LAWMAC",
  //         "Thrust24K",
  //         "Flap1",
  //         "Stab1",
  //         "Flap2",
  //         "Stab2",
  //         "Thrust26K",
  //         "Flap3",
  //         "Stab3",
  //         "Flap4",
  //         "Stab4",
  //         "cmpt1",
  //         "cmpt2",
  //         "cmpt3",
  //         "cmpt4",
  //         "Adult",
  //         "Child",
  //         "Infant",
  //         "Tpax",
  //         "SOB",
  //         "TransitPax",
  //         "SI",
  //         "LoadOfficer",
  //         "Captain",
  //         "PreparedBy",
  //         "Z1a",
  //         "Z1c",
  //         "Z1i",
  //         "Z2a",
  //         "Z2c",
  //         "Z2i",
  //         "Z3a",
  //         "Z3c",
  //         "Z3i",
  //         "active",
  //         "isSync",
  //         "isOfflineGenerated",
  //         "created_at",
  //       ]);
  //       createObjectStore(db,"ramp_data",{ keyPath: "fims_id" }, [
  //         "fims_id",
  //         "in_time",
  //         "door_open",
  //         "cargo_open",
  //         "crew",
  //         "fuel_start",
  //         "fuel_end",
  //         "tech_clear",
  //         "cargo_close",
  //         "lnt",
  //         "door_close",
  //         "catering_start",
  //         "catering_end",
  //         "security_start",
  //         "security_end",
  //         "service_start",
  //         "service_end",
  //         "out",
  //         "in_time_up ",
  //         "door_open_up",
  //         "cargo_open_up",
  //         "crew_up",
  //         "fuel_start_up",
  //         "fuel_end_up",
  //         "tech_clear_up",
  //         "cargo_close_up",
  //         "lnt_up",
  //         "door_close_up",
  //         "catering_start_up",
  //         "catering_end_up",
  //         "security_start_up",
  //         "security_end_up",
  //         "service_start_up",
  //         "service_end_up",
  //         "out_up",
  //       ]);

  //       createObjectStore(db, "FleetInfo", { keyPath: "id" ,autoIncrement: true}, [
  //         "Id",
  //         "A1_REGN",
  //         "AC_TYPE",
  //         "CONFIG",
  //         "OEW",
  //         "OEW_INDEX",
  //         "STDCREW",
  //         "Pantry",
  //         "MTOW",
  //         "MLW",
  //         "MZFW",
  //         "MAxFuel",
  //         "EMRG_EXIT",
  //         "THRUST",
  //         "CMPT1",
  //         "CMPT2",
  //         "CMPT3",
  //         "CMPT4",
  //         "LastRow",
  //         "OALimit",
  //         "OBLimit",
  //         "OCLimit",
  //         "ODLimit",
  //         "OELimit",
  //         "C_Constant",
  //         "K_Constant",
  //         "CG_Ref",
  //         "LeMac",
  //         "Mac ",
  //         "OFLimit",
  //         "MaxCabin",
  //         "MaxCompartment",
  //         "CabinLimits",
  //         "CompLimits",
  //         "CabinIndex",
  //         "CompIndex",
  //         "IsFreighter",
  //         "MinFOB",
  //         "MinLW",
  //         "MinTOW",
  //         "MinTripFuel",
  //         "MaxCockpitOccupant",
  //         " MaxFwdGalley",
  //         "MaxAftGalley",
  //         " MaxCabinBaggage",
  //         "MaxAftJump ",
  //         "MaxFwdJump",
  //         "MaxMidJump",
  //         "MaxFirstObserver",
  //         "MaxSecondObserver",
  //         "MaxSupernumerary",
  //         "MaxPortableWater ",
  //         "MaxSpareWheels",
  //         "MaxETOPEquipments ",
  //         "StdFwdJump",
  //         "StdMidJump",
  //         "StdAftJump ",
  //         "StdCabinBaggage",
  //         "StdAftGalley",
  //         "StdFwdGalley",
  //         "StdPortableWater",
  //         "StdSpareWheels",
  //         "StdETOPEquipments",
  //       ]);

  //     createObjectStore(db, "LTAdjustWeight", { keyPath: "Id" }, [
  //       "Id",
  //       "AcftType",
  //       "CabinBaggagePerKg",
  //       "CockpitOccupantPerKG",
  //       "FwdGalleyPerKG ",
  //       "AftGalleyPerKG ",
  //       "AftJumpPerKG ",
  //       "FwdJumpPerKG",
  //       "MidJumpPerKG",
  //       "Regn_no ",
  //     ]);
  //     createObjectStore(db, "CGRefTable", { keyPath: "id" }, [
  //       "AcftType ",
  //       "Weight ",
  //       "Aft_Tow_Limit",
  //       "Aft_Zfw_Limit",
  //       "Fwd_Tow_Limit",
  //       "Fwd_Zfw_Limit ",
  //       "Fwd_Zfw_Limit_Gt65317 ",
  //     ]);

  //     createObjectStore(db, "Ns_CheckInDetail", { keyPath: "id" }, [
  //       "Id",
  //       "Flight_Date",
  //       "Flight_no",
  //       "Destination",
  //       "source",
  //       "C1Adult",
  //       "C2Adult",
  //       "C3Adult",
  //       "C4Adult ",
  //       "C5Adult",
  //       "C6Adult",
  //       "C7Adult",
  //       "C8Adult",
  //       "C1Child",
  //       "C2Child",

  //       "C3Child",
  //       "C4Child",
  //       "C5Child",
  //       "C6Child",
  //       "C7Child",
  //       "C8Child",
  //       "C1Infant",
  //       "C2Infant",
  //       "C3Infant",
  //       "C4Infant",
  //       "C5Infant",
  //       "C6Infant",
  //       "C7Infant",
  //       "C8Infant",
  //       "OutofGate",
  //     ]).createIndex("idx_flighted_id", "Id", { unique: true });
  //     createObjectStore(db, "Ns_LnTDetail", { keyPath: "id" }, [
  //       "Id",
  //       "Flight_Date",
  //       "Flight_no",
  //       "Destination",
  //       "source",
  //       "Acft_Regn",
  //       "EDNO",
  //       "ActcrewStr",
  //       "cmpt1",
  //       "cmpt2",
  //       "cmpt3",
  //       "cmpt4",
  //       "TrimGenTimeUTC",
  //       "ZFW",
  //       "FOB",
  //       " TOW",
  //       "TRIP_FUEL",
  //       "underLoadLMC",
  //       "ZFWindex",
  //       "TOWindex",
  //       "LWindex",
  //       "ZFWMAC",
  //       "TOWMAC",
  //       "LWMAC",
  //       "specialStr",
  //       "LTLoginId",
  //       "Load_Officer",
  //       "CAPTAIN",
  //       "OEW ",
  //       "OEW_Index",
  //       "AdjustStr",
  //       "ActCabStr",
  //       "ActCompStr",
  //       "OLW",
  //       "OTOW",
  //       "RTOW",
  //       "AdjustStrv2",
  //       "LW",
  //       "Trim_Officer",
  //       "PalletsStr",
  //       "ZFWMACFWD",
  //       "ZFWMACAFT",
  //       "TOWMACFWD",
  //       "TOWMACAFT",
  //       "LWMACFWD",
  //       "LWMACAFT",
  //       "isSync",
  //       "CargoOnSeatStr",
  //       "BagLDM",
  //       "CargoLDM",
  //       "ActLoadDistStr",
  //       "ActLoadDistStrV2",
  //       "CaptEmpId",
  //       "TargetTOWMAC",
  //       "DeviationTOWMAC",
  //       "AdultLDM",
  //       "InfantLDM",
  //       "TotalLDM",
  //     ]).createIndex("idx_lntdet_id", "Id", { unique: true });

  //     createObjectStore(db, "FlightEditionNo", { keyPath: "id" }, [
  //       "Id",
  //       "Flight_Date",
  //       "Flight_no",
  //       "Destination",
  //       "source",
  //       "EdNo",
  //       "Regn_no",
  //       "ActcrewStr",
  //       "cmpt1 ",
  //       "cmpt2",
  //       "cmpt3",
  //       "cmpt4",
  //       "ZFW",
  //       "FOB",
  //       "TOW",
  //       "TripFuel",
  //       "underLoadLMC",
  //       "ZFWindex",
  //       "TOWindex",
  //       "LWindex",
  //       "ZFWMAC",
  //       "TOWMAC",
  //       "LWMAC",
  //       "LoadOfficer",
  //       "SI",
  //       "Captain",
  //       "OEW",
  //       "OEW_Index",
  //       "AdjustStr",
  //       "ActCabStr",
  //       "ActCompStr ",
  //       "OLW",
  //       "OTOW",
  //       "RTOW",
  //       "AdjustStrv2",
  //       "LW",
  //       "TrimOfficer",
  //       "UTCtime",
  //       "ISTtime",
  //       "FlapValues",
  //       "ThrustValues",
  //       "StabValues",
  //       "AppType",
  //       "ZFWMACFWD",
  //       "ZFWMACAFT ",
  //       "TOWMACFWD",
  //       "TOWMACAFT",
  //       "LWMACFWD",
  //       "LWMACAFT",
  //       "Userid",
  //       "isSync",
  //     ]).createIndex("idx_flighted_id", "Id", { unique: true });
  //     createObjectStore(db, "TrimSheetLMCOffline", { keyPath: "id" }, [
  //       "id",
  //       "flight_no",
  //       "flight_date",
  //       "trim_gen_time",
  //       "edition_no",
  //       "source",
  //       "destination",
  //       "std",
  //       "sta",
  //       "regno",
  //       "ac_type",
  //       "config",
  //       "crew",
  //       "COMPWT",
  //       "CABBGWT",
  //       "PAXWT",
  //       "total_load",
  //       "dow ",
  //       "zfw",
  //       "mzfw,take_of_fuel",
  //       "tow,trip_fuel",
  //       "law",
  //       "olw",
  //       "otow",
  //       "mlw",
  //       "underload",
  //       "doi",
  //       "lizfw",
  //       "litow",
  //       "lilw",
  //       "zfmac",
  //       "towmac",
  //       "lwmac",
  //       "pax",
  //       "cargo",
  //       "adult",
  //       "child",
  //       "infant",
  //       "ttl ",
  //       "sob",
  //       " si",
  //       " loginId",
  //       "trim_officer",
  //       " load_officer",
  //       "captain",
  //       "thrust",
  //       "isSync",
  //       "isOfflineGenerated",
  //       "created_at",
  //       "paxAcm",
  //       "AdjustStr",
  //       "ActCabStr",
  //       "ActCompStr",
  //       "ZFWMACFWD",
  //       "ZFWMACAFT",
  //       "TOWMACFWD",
  //       "TOWMACAFT",
  //       "LWMACFWD",
  //       "LWMACAFT",
  //     ]);
  //     createObjectStore(db, "StabTrimThrust", { keyPath: "id" }, [
  //       "Id",
  //       "Regn_no",
  //       "AcftType",
  //       "TableName",
  //       "LOPA",
  //       "Thrust",
  //       "Flap",
  //     ]);

  //     createObjectStore(db, "StabTrimData", { keyPath: "id" }, [
  //       "Id",
  //       "STABVARIANT",
  //       "THRUST",
  //       "FLAP",
  //       "TOW",
  //       "TOWMAC",
  //       "STAB",
  //     ]);
  //     createObjectStore(db, "CGRefTableZFW", { keyPath: "id" }, [
  //       "Id",
  //       "CGVARIANT ",
  //       "Weight",
  //       "Fwd_Zfw_Limit",
  //       "Aft_Zfw_Limit",
  //     ]);

  //     createObjectStore(db, "CGLIMITSZFW", { keyPath: "id" }, [
  //       "Id",
  //       "CGVARIANT",
  //       "Weight",
  //       "Fwd_Zfw_Limit",
  //       "Aft_Zfw_Limit",
  //     ]);

  //     createObjectStore(db, "CGRefTableTOW", { keyPath: "id" }, [
  //       "Id",
  //       "Regn_no ",
  //       "TableName",
  //       "MinLW",
  //       "MaxLW",
  //     ]);
  //     createObjectStore(db, "NS_FlightSchedule", { keyPath: "id" }, [
  //       "Id",
  //       "Flight_Date",
  //       "Flight_no",
  //       "Source",
  //       "Destination",
  //       "Acft_Regn",
  //       "Acft_Type",
  //       "STD",
  //       "STA",
  //       "ETD",
  //       "IsSchedule",
  //     ]);
  //     createObjectStore(db, "LTAdjustWeightV2", { keyPath: "id" }, [
  //       "Id ",
  //       "Reg_no",
  //       "AcftType",
  //       "CockpitOccupantPerKG",
  //       "FwdGalleyPerKG ",
  //       "AftGalleyPerKG",
  //       "AftJumpPerKG",
  //       "FwdJumpPerKg ",
  //       "MidJumpPerKg",
  //       "CabinBaggagePerKg",
  //       "FirstObserver",
  //       "SecondObserver",
  //       "Supernumeraries ",
  //       "PortableWaterPerKG",
  //       "SpareWheelsPerKG ",
  //       "ETOPEquipmentsPerKG ",
  //       "LastCreatedTime",
  //       "LastUpdTime",
  //     ]);

  //     createObjectStore(db, "LTAdjustWeight", { keyPath: "id" }, [
  //       "Id",
  //       "AcftType ",
  //       "CabinBaggagePerKg",
  //       "CockpitOccupantPerKG",
  //       "FwdGalleyPerKG",
  //       "AftGalleyPerKG",
  //       "AftJumpPerKG",
  //       "FwdJumpPerKG ",
  //       "MidJumpPerKG",
  //       "Regn_no",
  //     ]);
  //     createObjectStore(db, "CGRefTableTOW", { keyPath: "id" }, [
  //       "Id",
  //       "Regn_no ",
  //       "TableName",
  //       "MinLW",
  //       "MaxLW",
  //     ]);
  //     createObjectStore(db, "ThrustArchive", { keyPath: "id" }, [
  //        ' Id','Flight_Date','Flight_no', 'Destination','source','Thrust1','T1Flap1','T1Stab1','T1Flap2','T1Stab2','Thrust2', 'T2Flap1' , 'T2Stab1' , 'T2Flap2' , 'T2Stab2 ','Thrust3','T3Flap1',' T3Stab1' , 'T3Flap2' ,'T3Stab2' ,'Thrust4','T4Flap1','T4Stab1','T4Flap2','T4Stab2','FlapValues','ThrustValues','StabValues','isSync'
  //       ]).createIndex("idx_thrust_id", "Id", { unique: true });
  //     createObjectStore(db, "CGLIMITSTOW", { keyPath: "id" }, [
  //       "Id",
  //       "CGVARIANT",
  //       "Weight",
  //       "Fwd_Tow_limit",
  //       "Aft_Tow_Limit",
  //     ]);

  //     createObjectStore(db,"SALTArchive", { keyPath: "id" }, [
  //       "Id",
  //       "FlightDate",
  //       "FlightNo",
  //       "DepArpt",
  //       "ArrArpt",
  //       "AcftRegn",
  //       "MTow",
  //       "MZFW",
  //       "OEW",
  //       " OEW_Index ",
  //       " AcftPurpose",
  //       " STDCREW",
  //       "AdultCntBooked",
  //       "ChildCntBooked",
  //       "InfantCntBooked",
  //       "AdultCabListCheckedIn",
  //       "ChildCabListCheckedIn",
  //       "InfantCabListCheckedIn",
  //       "PaxseatStrCheckedIn",
  //       "TransitStrCheckedIn",
  //       "ThruChecked",
  //       "TotCheckedInPax",
  //       "OnwardAdultCheckedIn",
  //       "OnwardChildCheckedIn",
  //       "BagDetailsCheckedIn",
  //       "FOB",
  //       "TripFuel",
  //       "OLW",
  //       "OTOW",
  //       "RTOW ",
  //       "AdjustStrv2",
  //       "LoadDistStrV2",
  //       "ActLoadDistStrV2",
  //       "SpecialStr ",
  //       "PalletsStr",
  //       "PalletsStrAuto ",
  //       "CargoOnSeatAuto",
  //       "CargoOnSeatStr",
  //       "EditionNum",
  //       "CrewStr",
  //       "CockpitCrew",
  //       "CabinCrew",
  //       "ZFW ",
  //       "TOW",
  //       "LW",
  //       "LWCG",
  //       "LWCGFwdLimit",
  //       "TOWCG ",
  //       "TOWCGFwdLimit",
  //       "TOWCGAftLimit",
  //       " ZFWCG",
  //       " ZFWCGFwdLimit ",
  //       "ZFWCGAftLimit",
  //       "TargetTOWCG",
  //       "ZFWindex",
  //       "TOWindex",
  //       " LWindex",
  //       "LimitFacLw ",
  //       " LimitFacTow",
  //       "LimitFacZfw",
  //       " ActCabStr",
  //       " SectorLDM ",
  //       " AdultLDM ",
  //       "InfantLDM",
  //       "TotalLDM",
  //       "BagLDM",
  //       " CargoLDM ",
  //       "TrafficTotalWeight",
  //       "FlapValues",
  //       "ThrustValues",
  //       " StabValues",
  //       "UnderLoadLMC",
  //       "GeneratedTimeUTC ",
  //       "CAPTAIN ",
  //       "LoadOfficer",
  //       "TrimOfficer",
  //       "UserId",
  //       "ErrorMessage",
  //       "SuggestionMessage",
  //       "TrimRecallNo",
  //       "LIRRecallNo ",
  //       "IPAddress",
  //       "CmptWeights",
  //       "CabinPax",
  //       "CockpitOccuPant",
  //       "CabinAcm",
  //       "AftJumpSeat",
  //       "OZFW",
  //       "isSync",
  //       "CaptEmpId",
  //       "LWCGAftLimit",
  //     ]).createIndex("idx_saltarchive_id", "Id", { unique: true });

  //     createObjectStore(db, "NS_FlightSchedule", { keyPath: "id" }, [
  //       "Id",
  //       "Flight_Date",
  //       "Flight_no",
  //       "Source",
  //       "Destination",
  //       "Acft_Regn",
  //       "Acft_Type",
  //       "STD",
  //       "STA",
  //       "ETD",
  //       "IsSchedule",
  //     ]).createIndex("idx_nsflightschedule_id", "Id", { unique: true });
  // } catch (error) {
  //     console.error('Error during upgrade:', error);
  //   }
  // };
  //   function createObjectStore(db, storeName, options, indexes) {
  //     console.log("createobjectstore", db, storeName, options, indexes);
  //     return new Promise(function (resolve, reject) {
  //       try {
  //         if (!db.objectStoreNames.contains(storeName)) {
  //           var objectStore = db.createObjectStore(storeName, options);

  //           console.log("Example object:", objectStore.get(1));
  //           indexes.forEach(function (indexName) {
  //             objectStore.createIndex(indexName,indexName,{ unique: false });
  //           });

  //           console.log("resolve 123");
  //           resolve('created successfully');
  //         } else {
  //           console.log("resolve 123");
  //           resolve('created successfully 123');
  //         }
  //       } catch (error) {
  //         console.log("error", error);
  //         reject(error);
  //       }
  //     });
  //   }
  //   request.onupgradeneeded = function (event) {
  //     var db = event.target.result;
  //     function createObjectStore(db, storeName, options, indexes) {
  //         return new Promise(function(resolve, reject) {
  //           try {
  //             if (!db.objectStoreNames.contains(storeName)) {
  //               var objectStore = db.createObjectStore(storeName, options);

  //               // Create indexes
  //               indexes.forEach(function(indexName) {
  //                 objectStore.createIndex(indexName, indexName, { unique: false });
  //               });

  //               resolve();
  //             } else {
  //               resolve(); // Store already exists, resolve immediately
  //             }
  //           } catch (error) {
  //             reject(error);
  //           }
  //         });
  //       }
  //     // var upgradePromise = new Promise(function(resolve, reject) {
  //     //     try {
  //     //       // List of store configurations
  //     //       var storeConfigurations = [
  //     //         { name: "ramp_transations", keyPath: "id", indexes: ["fims_id", "transaction_type", "user_id", "time", "isSync", "message"] },
  //     //         { name: "TrimSheetLMC", keyPath: "id", indexes: [
  //     //             "FlightNo",
  //     //             "Flight_Date",
  //     //             "Acft_Type",
  //     //             "STD",
  //     //             "TrimSheetTime",
  //     //             "Source",
  //     //             "Destination",
  //     //             "Regn_no",
  //     //             "Crew",
  //     //             "ZFW",
  //     //             "MZFW",
  //     //             "TOF",
  //     //             "TOW",
  //     //             "MTOW",
  //     //             "TripFuel",
  //     //             ";AW",
  //     //             "MLAW",
  //     //             "underLoad",
  //     //             "LIZFW",
  //     //             "LITOW",
  //     //             "LILAW",
  //     //             "ZFWMAC",
  //     //             "MAC",
  //     //             "TOWMAC",
  //     //             "LAWMAC",
  //     //             "Thrust24K",
  //     //             "Flap1",
  //     //             "Stab1",
  //     //             "Flap2",
  //     //             "Stab2",
  //     //             "Thrust26K",
  //     //             "Flap3",
  //     //             "Stab3",
  //     //             "Flap4",
  //     //             "Stab4",
  //     //             "cmpt1",
  //     //             "cmpt2",
  //     //             "cmpt3",
  //     //             "cmpt4",
  //     //             "Adult",
  //     //             "Child",
  //     //             "Infant",
  //     //             "Tpax",
  //     //             "SOB",
  //     //             "TransitPax",
  //     //             "SI",
  //     //             "LoadOfficer",
  //     //             "Captain",
  //     //             "PreparedBy",
  //     //             "Z1a",
  //     //             "Z1c",
  //     //             "Z1i",
  //     //             "Z2a",
  //     //             "Z2c",
  //     //             "Z2i",
  //     //             "Z3a",
  //     //             "Z3c",
  //     //             "Z3i",
  //     //             "active",
  //     //             "isSync",
  //     //             "isOfflineGenerated",
  //     //             "created_at",
  //     //           ] },
  //     //           { name: "CGRefTableZFW", keyPath: "id", indexes: ["Id",
  //     //           "CGVARIANT",
  //     //           "Weight",
  //     //           "Fwd_Zfw_Limit",
  //     //           "Aft_Zfw_Limit",] },
  //     //         //   createObjectStore(db, "CGRefTableZFW", { keyPath: "id" }, [
  //     //                 //   "Id",
  //     //                 //   "CGVARIANT ",
  //     //                 //   "Weight",
  //     //                 //   "Fwd_Zfw_Limit",
  //     //                 //   "Aft_Zfw_Limit",
  //     //             //     ]);
  //     //       ];

  //     // //       // Recursive function to create stores one by one

  //     //       function createNextStore(index) {
  //     //         if (index < storeConfigurations.length) {
  //     //           var storeConfig = storeConfigurations[index];
  //     //           createObjectStore(db, storeConfig.name, { keyPath: storeConfig.keyPath }, storeConfig.indexes)
  //     //             .then(function() {
  //     //               // Move on to the next store
  //     //               createNextStore(index + 1);
  //     //             })
  //     //             .catch(reject);
  //     //         } else {
  //     //           // All stores created successfully
  //     //           resolve();
  //     //         }
  //     //       }

  //     //       // Start creating stores
  //     //       createNextStore(0);
  //     //     } catch (error) {
  //     //       reject(error);
  //     //     }
  //     //   });
  //     // Wrap the entire upgrade process in a promise
  //     // var upgradePromise = new Promise(function (resolve, reject) {
  //     //   try {
  //     //     // List of store configurations
  //     //     var storeConfigurations = [
  //     //       {
  //     //         name: "fims_schedule",
  //     //         keyPath: "id",
  //     //         indexes: [
  //     //           "Regn_no",
  //     //           "Flight_no",
  //     //           "Source",
  //     //           "Destination",
  //     //           "Flight_Date",
  //     //           "STD",
  //     //           "STA",
  //     //           "ETA",
  //     //           "BAYNO",
  //     //         ],
  //     //       },

  //     //     ];

  //     //     // Recursive function to create stores one by one
  //     //     function createNextStore(index) {
  //     //       if (index < storeConfigurations.length) {
  //     //         console.log("length", storeConfigurations.length);
  //     //         var storeConfig = storeConfigurations[index];
  //     //         console.log('storeconfiog',storeConfig)
  //     //         createObjectStore(
  //     //           db,
  //     //           storeConfig.name,
  //     //           { keyPath: storeConfig.keyPath },
  //     //           storeConfig.indexes
  //     //         )
  //     //           .then(function () {
  //     //             // Move on to the next store
  //     //             console.log('moving to next store')
  //     //             createNextStore(index + 1);
  //     //           })
  //     //           .catch(function (error) {
  //     //             console.error("Error during upgrade:123", error);
  //     //           });
  //     //       } else {

  //     //         resolve();
  //     //       }
  //     //     }

  //     //     // Start creating stores
  //     //     createNextStore(0);
  //     //   } catch (error) {
  //     //     reject(error);
  //     //   }
  //     // });

  //     // upgradePromise
  //     //   .then(function () {
  //     //     console.log("Database upgrade completed");
  //     //   })
  //     //   .catch(function (error) {
  //     //     console.error("Error during upgrade:", error);
  //     //   });
  //   };
}

// export async function initializeDatabaseStructure() {
//   console.log("qwertyio");
//   const db = openDatabase();
//   console.log("db......", db);

// //var dbDeleteRequest = indexedDB.deleteDatabase('SPICEJET');

//   // dbDeleteRequest.onerror = function(event) {
//   //     console.error("Error deleting database:", event.target.error);
//   // };

//   // dbDeleteRequest.onsuccess = function(event) {
//   //     console.log("Database deleted successfully");
//   // };
// }
//  export function initializeDatabaseStructure() {
//     return new Promise((resolve, reject) => {
//       const request =window.indexedDB.open(DB_NAME, DB_VERSION);
//       console.log('sadfgh',request)
//       request.onupgradeneeded = function (event) {
//         const db = event.target.result;
//   console.log('sadfgh....',db)

//         request.onsuccess = function () {
//             console.log('opened successfully')
//           resolve(db);
//         };

//         request.onerror = function
//         (event) {
//             console.log(event)

//           reject("Error opening database");
//         };
//       };
//     });
//   }

// function createObjectStore(db, storeName, options, indexes) {
//     return new Promise(function(resolve, reject) {
//       try {
//         if (!db.objectStoreNames.contains(storeName)) {
//           var objectStore = db.createObjectStore(storeName, options);

//           // Create indexes
//           indexes.forEach(function(indexName) {
//             objectStore.createIndex(indexName, indexName, { unique: false });
//           });

//           resolve();
//         } else {
//           resolve(); // Store already exists, resolve immediately
//         }
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
// var upgradePromise = new Promise(function(resolve, reject) {
//     try {
//       // List of store configurations
//       var storeConfigurations = [
//         { name: "ramp_transations", keyPath: "id", indexes: ["fims_id", "transaction_type", "user_id", "time", "isSync", "message"] },
//         { name: "TrimSheetLMC", keyPath: "id", indexes: [
//             "FlightNo",
//             "Flight_Date",
//             "Acft_Type",
//             "STD",
//             "TrimSheetTime",
//             "Source",
//             "Destination",
//             "Regn_no",
//             "Crew",
//             "ZFW",
//             "MZFW",
//             "TOF",
//             "TOW",
//             "MTOW",
//             "TripFuel",
//             ";AW",
//             "MLAW",
//             "underLoad",
//             "LIZFW",
//             "LITOW",
//             "LILAW",
//             "ZFWMAC",
//             "MAC",
//             "TOWMAC",
//             "LAWMAC",
//             "Thrust24K",
//             "Flap1",
//             "Stab1",
//             "Flap2",
//             "Stab2",
//             "Thrust26K",
//             "Flap3",
//             "Stab3",
//             "Flap4",
//             "Stab4",
//             "cmpt1",
//             "cmpt2",
//             "cmpt3",
//             "cmpt4",
//             "Adult",
//             "Child",
//             "Infant",
//             "Tpax",
//             "SOB",
//             "TransitPax",
//             "SI",
//             "LoadOfficer",
//             "Captain",
//             "PreparedBy",
//             "Z1a",
//             "Z1c",
//             "Z1i",
//             "Z2a",
//             "Z2c",
//             "Z2i",
//             "Z3a",
//             "Z3c",
//             "Z3i",
//             "active",
//             "isSync",
//             "isOfflineGenerated",
//             "created_at",
//           ] },
//       ];

// //       // Recursive function to create stores one by one

//       function createNextStore(index) {
//         if (index < storeConfigurations.length) {
//           var storeConfig = storeConfigurations[index];
//           createObjectStore(db, storeConfig.name, { keyPath: storeConfig.keyPath }, storeConfig.indexes)
//             .then(function() {
//               // Move on to the next store
//               createNextStore(index + 1);
//             })
//             .catch(reject);
//         } else {
//           // All stores created successfully
//           resolve();
//         }
//       }

//       // Start creating stores
//       createNextStore(0);
//     } catch (error) {
//       reject(error);
//     }
//   });
