import * as SQL from "./SQL";
import * as Enviornment from "./environment";

export function initializeDatabaseStructure() {
  var db = SQL.c_openDatabase(Enviornment.get("DB_NAME"));
  db.transaction(
    function (tx) {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS fims_schedule (id integer, Regn_no text,Acft_Type text,Flight_no text ,Source text ,Destination text ,Flight_Date date ,STD date,STA date,ETD date,ETA date,BAYNO integer)"
      );
      console.log(11111);
      tx.executeSql(`CREATE TABLE IF NOT EXISTS TrimSheetLMC (ms_id  integer , FlightNo   text , Flight_Date date , Acft_Type  text , STD date , TrimSheetTime date , Source  text , Destination  text , Regn_no  text , Crew  text , ZFW  integer , MZFW  integer , TOF  integer , TOW  integer , MTOW  integer , TripFuel  integer , LAW  integer , MLAW  integer , underLoad  integer ,
             LIZFW  float , LITOW  float , LILAW  float , ZFWMAC  float , MAC  float , TOWMAC  float , LAWMAC  float , Thrust24K  integer , Flap1  integer , Stab1  integer , Flap2  integer , Stab2  integer , Thrust26K  integer , Flap3  integer , Stab3  integer , Flap4  integer , Stab4  integer , cmpt1  integer , cmpt2  integer , cmpt3  integer , cmpt4  integer , Adult  integer , Child  integer , Infant  integer , Tpax  integer , SOB  integer , TransitPax  integer , SI  text , LoadOfficer  text , Captain  text , PreparedBy  text , Z1a  integer , Z1c  integer , Z1i  integer , Z2a  integer , Z2c  integer , Z2i  integer , Z3a  integer , Z3c  integer , Z3i  integer,active boolean ,isSync boolean ,isOfflineGenerated boolean,created_at date)`);
      console.log(2222);
      tx.executeSql(`CREATE TABLE IF NOT EXISTS ramp_data(fims_id integer,in_time  date, door_open  date,cargo_open  date,crew  date,fuel_start  date,fuel_end  date,tech_clear  date,cargo_close  date,lnt  date,door_close  date,catering_start  date,catering_end  date,security_start  date,security_end  date,service_start  date,service_end  date,out  date ,
            in_time_update date,door_open_update date,cargo_open_update date,crew_update date,fuel_start_update date,fuel_end_update date,tech_clear_update date,cargo_close_update date,lnt_update date,door_close_update date,catering_start_update date,catering_end_update date,security_start_update date,security_end_update date,service_start_update date,service_end_update date,out_update date)`);
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ramp_transactions(id INTEGER PRIMARY KEY AUTOINCREMENT,fims_id integer,transaction_type text,user_id integer,time date,isSync boolean ,message string)`
      );
      console.log(3333);
      tx.executeSql(`CREATE TABLE IF NOT EXISTS FleetInfo(Id  integer,AC_REGN text,AC_TYPE text,CONFIG text,OEW integer,OEW_Index integer,STDCREW text,Pantry integer,MTOW integer,MLW integer,MZFW integer,MAxFuel integer,EMRG_EXIT text,THRUST integer,CMPT1 text
            ,CMPT2 text,CMPT3 text,CMPT4 text,LastRow integer,OALimit integer,OBLimit integer,OCLimit integer,ODLimit integer,OELimit integer,C_Constant integer,K_Constant integer,CG_Ref integer,LeMac integer,Mac integer,OFLimit integer, MaxCabin integer,MaxCompartment interger
            ,CabinLimits text ,CompLimits text,CabinIndex text ,CompIndex text,IsFreighter integer, MinFOB integer, MinLW integer, MinTOW integer, MinTripFuel integer, MaxCockpitOccupant integer, MaxFwdGalley integer, MaxAftGalley integer, MaxCabinBaggage integer, MaxAftJump integer
            , MaxFwdJump integer, MaxMidJump integer, MaxFirstObserver integer, MaxSecondObserver integer, MaxSupernumerary integer, MaxPortableWater integer, MaxSpareWheels integer, MaxETOPEquipments integer, StdFwdJump integer, StdMidJump integer, StdAftJump integer
            , StdCabinBaggage integer, StdAftGalley integer, StdFwdGalley integer, StdPortableWater integer, StdSpareWheels integer, StdETOPEquipments integer )`);
      console.log(44444);
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS LTAdjustWeight(Id integer,AcftType text,CabinBaggagePerKg integer,CockpitOccupantPerKG integer,FwdGalleyPerKG integer,AftGalleyPerKG integer,AftJumpPerKG integer,FwdJumpPerKG integer,MidJumpPerKG integer, Regn_no text)`
      );
      console.log(55555);
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS CGRefTable (AcftType text,Weight float,Aft_Tow_Limit float,Aft_Zfw_Limit float,Fwd_Tow_Limit float,Fwd_Zfw_Limit float,Fwd_Zfw_Limit_Gt65317 float)"
      );
      console.log(66666);
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Ns_CheckInDetail ( Id integer, Flight_Date date, Flight_no text, Destination text, source text, C1Adult integer, C2Adult integer, C3Adult integer, C4Adult integer, C5Adult integer, C6Adult integer, C7Adult integer, C8Adult integer, C1Child integer, C2Child integer, C3Child integer, C4Child integer, C5Child integer, C6Child integer, C7Child integer, C8Child integer, C1Infant integer, C2Infant integer, C3Infant integer, C4Infant integer, C5Infant integer, C6Infant integer, C7Infant integer, C8Infant integer , OutofGate date)"
      );
      tx.executeSql("CREATE UNIQUE INDEX idx_id ON Ns_CheckInDetail(Id)");
      console.log(77777);
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Ns_LnTDetail (  Id integer, Flight_Date date, Flight_no text, Destination text, source text, Acft_Regn text,EDNO integer, ActcrewStr text, cmpt1 integer, cmpt2 integer, cmpt3 integer, cmpt4 integer, TrimGenTimeUTC date, ZFW integer, FOB integer, TOW integer, TRIP_FUEL integer, underLoadLMC integer, ZFWindex float, TOWindex float, LWindex float, ZFWMAC float, TOWMAC float, LWMAC float,  specialStr text, LTLoginId text, Load_Officer text, CAPTAIN text,OEW integer, OEW_Index float,AdjustStr text,ActCabStr text, ActCompStr text,OLW float,OTOW float,RTOW float,AdjustStrv2 text,LW float,Trim_Officer text,PalletsStr text,ZFWMACFWD float,ZFWMACAFT float,TOWMACFWD float,TOWMACAFT float,LWMACFWD float,LWMACAFT float,isSync boolean,CargoOnSeatStr text,BagLDM text,CargoLDM text, ActLoadDistStr text, ActLoadDistStrV2 text, CaptEmpId text, TargetTOWMAC text, DeviationTOWMAC text, AdultLDM text, InfantLDM text, TotalLDM text )"
      );
      tx.executeSql("CREATE UNIQUE INDEX idx_lntdet_id ON Ns_LnTDetail(Id)");
      console.log(88888);
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS ThrustArchive ( Id integer, Flight_Date date, Flight_no text, Destination text, source text, Thrust1 integer, T1Flap1 text, T1Stab1 float, T1Flap2 text, T1Stab2 float, Thrust2 integer, T2Flap1 text, T2Stab1 float, T2Flap2 text, T2Stab2 float, Thrust3 interger, T3Flap1 text, T3Stab1 float, T3Flap2 text, T3Stab2 float, Thrust4 integer, T4Flap1 text, T4Stab1 float, T4Flap2 text, T4Stab2 float,FlapValues text,ThrustValues text,StabValues text,isSync boolean)"
      );
      tx.executeSql("CREATE UNIQUE INDEX idx_thrust_id ON ThrustArchive(Id)");
      console.log(99999);
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS FlightEditionNo ( Id integer, Flight_Date date, Flight_no text, Destination text, source text,  EdNo integer,Regn_no text,ActcrewStr text,cmpt1 integer,cmpt2 integer,cmpt3 integer,cmpt4 integer,ZFW integer ,FOB integer,TOW integer,TripFuel integer,underLoadLMC integer,ZFWindex float,TOWindex float,LWindex float,ZFWMAC float,TOWMAC float,LWMAC float,LoadOfficer text,SI text,Captain text,OEW integer,OEW_Index integer,AdjustStr text,ActCabStr text,ActCompStr text,OLW float,OTOW float,RTOW float,AdjustStrv2 text,LW float,TrimOfficer text,UTCtime date,ISTtime date,FlapValues text,ThrustValues text,StabValues text , AppType text,ZFWMACFWD float,ZFWMACAFT float,TOWMACFWD float,TOWMACAFT float,LWMACFWD float,LWMACAFT float,Userid text,isSync boolean )"
      );
      tx.executeSql(
        "CREATE UNIQUE INDEX idx_flighted_id ON FlightEditionNo(Id)"
      );
      console.log(101010);
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS LTAdjustWeightV2(Id  integer,Reg_no text,AcftType text, CockpitOccupantPerKG integer, FwdGalleyPerKG integer, AftGalleyPerKG integer, AftJumpPerKG integer,FwdJumpPerKg integer,MidJumpPerKg integer,CabinBaggagePerKg integer,FirstObserver integer,SecondObserver integer,Supernumeraries integer,PortableWaterPerKG integer,SpareWheelsPerKG integer,ETOPEquipmentsPerKG integer,LastCreatedTime date,LastUpdatedTime date)`
      );
      console.log(111111111);
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS TrimSheetLMCOffline (id  integer,flight_no text , flight_date date , trim_gen_time date ,edition_no integer,source  text , destination  text , std date , sta date ,regno  text , ac_type  text , config text , crew text , COMPWT float , CABBGWT float , PAXWT float ,total_load float , dow float , zfw float , mzfw float , take_of_fuel float , tow float , trip_fuel float , law float , olw float , otow float , mlw float , underload float , doi float , lizfw float , litow float , lilw float , zfmac float , towmac float , lwmac float , pax text ,  cargo text , adult integer , child integer , infant integer , ttl integer , sob integer , si text , loginId text , trim_officer  text , load_officer text , captain text , thrust text, isSync boolean , isOfflineGenerated boolean, created_at date,paxAcm integer, AdjustStr text ,ActCabStr text,ActCompStr text,ZFWMACFWD float,ZFWMACAFT float,TOWMACFWD float,TOWMACAFT float,LWMACFWD float,LWMACAFT float)`
      );
      console.log(22222222222);
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS StabTrimThrust (Id integer,Regn_no text,AcftType text,TableName text,LOPA text,Thrust text,Flap text)`
      );
      console.log(33333333333);
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS StabTrimData (Id integer ,STABVARIANT text,THRUST text,FLAP text,TOW float,TOWMAC float,STAB float)`
      );
      console.log(4444444444);
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS CGRefTableZFW (Id integer,Regn_no text,TableName text,MinLW float,MaxLW float)`
      );
      console.log(5555555555);
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS CGLIMITSZFW (Id integer ,CGVARIANT text,Weight float,Fwd_Zfw_Limit float,Aft_Zfw_Limit float)`
      );
      console.log(6666666666);
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS CGRefTableTOW (Id integer,Regn_no text,TableName text,MinLW float,MaxLW float)`
      );
      console.log(777777777777);
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS CGLIMITSTOW (Id integer ,CGVARIANT text,Weight float,Fwd_Tow_limit float,Aft_Tow_Limit float)`
      );
      console.log(88888888888);
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS SALTArchive (  Id integer, FlightDate date, FlightNo text, DepArpt text, ArrArpt text, AcftRegn text,MTow float, MZFW float, OEW float, OEW_Index float, AcftPurpose text, STDCREW text, AdultCntBooked integer, ChildCntBooked integer, InfantCntBooked integer, AdultCabListCheckedIn text, ChildCabListCheckedIn text, InfantCabListCheckedIn text, PaxseatStrCheckedIn text, TransitStrCheckedIn text, ThruChecked integer, TotCheckedInPax integer, OnwardAdultCheckedIn integer, OnwardChildCheckedIn integer,  BagDetailsCheckedIn text, FOB float, TripFuel float, OLW float,OTOW float, RTOW float,AdjustStrv2 text,LoadDistStrV2 text, ActLoadDistStrV2 text,SpecialStr text,PalletsStr text,PalletsStrAuto text,CargoOnSeatAuto text,CargoOnSeatStr text,EditionNum integer,CrewStr text,CockpitCrew integer,CabinCrew integer,ZFW float,TOW float,LW float,LWCG float,LWCGFwdLimit float,TOWCG float,TOWCGFwdLimit float,TOWCGAftLimit float, ZFWCG float, ZFWCGFwdLimit float, ZFWCGAftLimit float, TargetTOWCG float, ZFWindex float,TOWindex float, LWindex float, LimitFacLw text, LimitFacTow text, LimitFacZfw text, ActCabStr text, SectorLDM text, AdultLDM text, InfantLDM text, TotalLDM text, BagLDM text, CargoLDM text, TrafficTotalWeight float,FlapValues text,ThrustValues text, StabValues text,UnderLoadLMC float,GeneratedTimeUTC date,CAPTAIN text,LoadOfficer text,TrimOfficer text,UserId text,ErrorMessage text,SuggestionMessage text,TrimRecallNo text,LIRRecallNo text,IPAddress text,CmptWeights text,CabinPax text,CockpitOccuPant integer,CabinAcm text,AftJumpSeat integer,OZFW float, isSync boolean , CaptEmpId text , LWCGAftLimit text)`
      );
      tx.executeSql(
        `CREATE UNIQUE INDEX idx_saltarchive_id ON SALTArchive(Id)`
      );
      //console.log(9999999)
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS NS_FlightSchedule (  Id integer, Flight_Date date, Flight_no text, Source text, Destination text, Acft_Regn text,Acft_Type text, STD date, STA date, ETD date, IsSchedule boolean )`
      );
      tx.executeSql(
        `CREATE UNIQUE INDEX idx_nsflightschedule_id ON NS_FlightSchedule(Id)`
      );
      console.log(999999);
    },
    function (err) {
      console.log(err);
    }
  );
}
