import React from 'react';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Typography, IconButton, Popover } from "@material-ui/core";
import { setPage, setAction } from "../../../Action/pageaction";
import { fetchLocalUpcoming } from "../../../Action/rampaction";
import * as Enviorment from "./../../../Action/environment";
import TableTop from "../../common/Tabletop/index";
import momentTZ from "moment-timezone"
import InfoIcon from '@material-ui/icons/Info';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class Past extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      'fims_schedule': [],
      'isLoading': true,
      'anchorEl': null,
      'currentDate':'',
      'tabValue': 1,
      'todayData': [],
      'previousData':[],
      'currentTab':'',
      'prevTab': ''
    }

    this.fetchFims = this.fetchFims.bind(this);
    this.navigateToFIMS = this.navigateToFIMS.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount() {
    this.props.setPage("Past", "past");
    this.props.setPageAction(null);
  }

  componentWillMount() {
    this.fetchFims();
  }


  componentWillReceiveProps(newProps) {
    if (this.props.sync.ramp_sync === false && newProps.sync.ramp_sync) {
      this.fetchFims();
    }
  }
  handleClick(event) {
    var set = this.state.anchorEl ? null : event.currentTarget
    this.setState({ anchorEl: set })
  }
  handleClose(){
    this.setState({ anchorEl: null })
  }

  trimRegNo(str) {
    if (str !== null && str !== undefined) {
      var reg_pref = Enviorment.get("REG_PREF");
      return str.replace(new RegExp(reg_pref, 'g'), "");
    }
    return "-"
  }

  formatTime(str) {
    console.log(str)
    if (str == null) {
      return "-"
    }
    console.log(moment(str).format("HH:mm"))
    return moment(str).format("HH:mm")


  }
  formatDate(str) {
    if (str == null) {
      return "-"
    }
    return moment(str).format("DD-MMM-YYYY")
  }

  navigateToFIMS(item) {

    var fims1 = item.id;
    var fims2 = "NULL";
    if (item.reverse !== undefined) {
      fims2 = item.reverse;
    }

    this.props.history.push(`/app/fims/${fims1}/${fims2}/past`)
  }

  fetchFims() {
    var user = window.localStorage.getItem('auth_user');
    if (user === null || user === undefined) {
      return;
    }

    user = JSON.parse(user);
    let todayTab, prevTab= '';

    var me = this;
    me.setState({
      isLoading: true
    })

//     fetchLocalUpcoming().then((result) => {
//       console.log("past load ", result)

//       var array = result.map((item) => {
//         if (item.Source === user.airport_code) {
//           item['IO'] = "O";
//         } else {
//           item['IO'] = "I";
//         }
//         if (item.ETD == null) {
//           item.ETD = item.STD;
//         }

//         if (item.ETA == null) {
//           item.ETA = item.STA;
//         }

//         // item.ETA  = momentTZ.tz(item.ETA,"UTC").format("HH:mm");
//         // item.ETD  = momentTZ.tz(item.ETD,"UTC").format("HH:mm");
//         return item;
//       });
//       var onlyOutGoing = []
//       array.forEach((i) => {
//         if (i['IO'] === "O") {
        
//           return onlyOutGoing.push(i)
//         }
//       })
//       var records = onlyOutGoing.sort(function (a, b) { return a - b });
    
//       var _result = [];


//       if (records.length > 0) {
        
//          this.setState({ todayData : [], previousData:[]});

//         for (var i = 0; i < records.length; i++) {
        
//           var dateDiff = moment().toDate().getTime(); 
//           var flightDate = new Date(moment(records[i].Flight_Date).format("YYYY-MM-DD"));
          
//           let month = [];

//           month[0] = "JAN";
//           month[1] = "FEB";
//           month[2] = "MAR";
//           month[3] = "APR";
//           month[4] = "MAY";
//           month[5] = "JUNE";
//           month[6] = "JULY";
//           month[7] = "AUG";
//           month[8] = "SEPT";
//           month[9] = "OCT";
//           month[10] = "NOV";
//           month[11] = "DEC";

//           var currentDate = new Date();
//           let monthName = month[currentDate.getMonth()];
//           todayTab = currentDate.getDate()+ " " + monthName;
//           console.log(currentDate.getDate() )
//           var prevDate = new Date(currentDate);
//           prevDate.setDate(prevDate.getDate() - 1);
//           let prevMonthName = month[prevDate.getMonth()];
//           prevTab = prevDate.getDate()+ " " + prevMonthName;

//           if (records[i].OutofGate == null) {
//            console.log('bhfdjfgfhgb')
//            console.log(records.length)
//            continue;
//           }
//           else if((moment(records[i].OutofGate).add(60,"minute").toDate().getTime() - dateDiff) > 0)
//           {
              
              
//               continue;
            
//           }



// // if (records[i]['mapped'] === true) {
// //   console.log(records.length)
// //   continue;
// // }

//           if(currentDate.getDate() === flightDate.getDate()) {


           
//            this.setState({ todayData:[...this.state.todayData,this.fetchPastFlights(records, i)[0]]});
        
//       } 
//       else if(currentDate.getDate() > flightDate.getDate()) {
       
      
//         this.setState({ previousData : [...this.state.previousData,this.fetchPastFlights(records, i)[0]]});
//           }
//           else{
           
//           }
//         }
// }
      

//       me.setState({
//         // fims_schedule: _result,
//         // isLoading: false

//         fims_schedule: this.state.tabValue == 0 ? [...this.state.previousData] : [...this.state.todayData],
//         isLoading: false,
//         currentTab: todayTab,
//         prevTab
//       })

//     })
    fetchLocalUpcoming().then((result) => {
      console.log("past load ", result)
      var array = result.map((item) => {
        if (item.Source === user.airport_code) {
          item['IO'] = "O";
        } else {
          item['IO'] = "I";
        }
        if (item.ETD == null) {
          item.ETD = item.STD;
        }

        if (item.ETA == null) {
          item.ETA = item.STA;
        }

        // item.ETA  = momentTZ.tz(item.ETA,"UTC").format("HH:mm");
        // item.ETD  = momentTZ.tz(item.ETD,"UTC").format("HH:mm");
        return item;
      });
      var onlyOutGoing = []
      array.forEach((i) => {
        if (i['IO'] === "O") {
          console.log("iiiiiiiiiiiii")
          return onlyOutGoing.push(i)
        }
      })
      var records = onlyOutGoing.sort(function (a, b) { return a - b });
      console.log("datataaaaaa", records)
      var _result = [];


      if (records.length > 0) {
        this.setState({ todayData : [], previousData:[]});

        for (var i = 0; i < records.length; i++) {
          var dateDiff = moment().toDate().getTime(); 

         

          var flightDate = new Date(moment(records[i].Flight_Date).format("YYYY-MM-DD"));
          let month = [];
          month[0] = "JAN";
          month[1] = "FEB";
          month[2] = "MAR";
          month[3] = "APR";
          month[4] = "MAY";
          month[5] = "JUNE";
          month[6] = "JULY";
          month[7] = "AUG";
          month[8] = "SEPT";
          month[9] = "OCT";
          month[10] = "NOV";
          month[11] = "DEC";

          var currentDate = new Date();
          let monthName = month[currentDate.getMonth()];
          todayTab = currentDate.getDate()+ " " + monthName;

          var prevDate = new Date(currentDate);
          prevDate.setDate(prevDate.getDate() - 1);
          let prevMonthName = month[prevDate.getMonth()];
          prevTab = prevDate.getDate()+ " " + prevMonthName;

          if (records[i].OutofGate == null) {
            console.log("dateDiff2",)
            continue;
          } else {
            console.log("(dateDiff - moment(records[i].OutofGate)", records[i].OutofGate, moment(records[i].OutofGate).add(60, "minute").toDate().getTime(), dateDiff, (dateDiff - moment(records[i].OutofGate).add(60, "minute").toDate().getTime()));
            if ((moment(records[i].OutofGate).add(60, "minute").toDate().getTime() - dateDiff) > 0) {
              continue;
            }
          }
          // if(new Date(records[i]['ETA']).getTime() < new Date().getTime()){
          //   continue;
          // }

          if (records[i]['mapped'] === true) {
            continue;
          }

          if(currentDate.getDate() == flightDate.getDate()) {
            
            this.setState({ todayData : [...this.state.todayData, this.fetchPastFlights(records, i)[0]]});
          } else if(currentDate.getDate() > flightDate.getDate()) {
            this.setState({ previousData : [...this.state.previousData, this.fetchPastFlights(records, i)[0]]});
          }
          console.log(this.state.todayData,this.state.previousData)
        }

      }
      console.log("final result", _result)

      me.setState({
        // fims_schedule: _result,
        // isLoading: false

        fims_schedule: this.state.tabValue == 0 ? [...this.state.previousData] : [...this.state.todayData],
        isLoading: false,
        currentTab: todayTab,
        prevTab
      })

    })
  }

  fetchPastFlights =(records, i) => {
    console.log(i)
    var _result = [];

    for (var j = 0; j < records.length; j++) {
      console.log(records[i]['Regn_no'] === records[j]['Regn_no'] && records[i]['IO'] !== records[j]['IO'] &&
      (records[i]['Source'] === records[j]['Destination'] || records[j]['Source'] === records[i]['Destination']))
      
      
      
      if (records[i]['Regn_no'] === records[j]['Regn_no'] && records[i]['IO'] !== records[j]['IO'] &&
        (records[i]['Source'] === records[j]['Destination'] || records[j]['Source'] === records[i]['Destination'])
      ) {
        records[i]['mapped'] = true;
        records[j]['mapped'] = true;
        records[i]['reverse'] = records[j]['id'];
        records[j]['reverse'] = records[i]['id'];

        if (i > j) {
          _result.push(records[j]);
          _result.push(records[i]);
        } else {
          _result.push(records[i]);
          _result.push(records[j]);
        }
        break;
      }
    }
    if (records[i]['mapped'] === undefined || records[i]['mapped'] === false) {
      _result.push(records[i]);
    }
console.log(_result)
    return _result;
  }

  addToArray = ( array, newElement) => {
    array.push(newElement);
    return array;
  }

  handleChange = (event, newValue) => {

    this.setState({
      tabValue: newValue,
      fims_schedule: newValue == 0 ? [...this.state.previousData] : (newValue == 1 ? [...this.state.todayData] : [...this.state.nextData]),
    });
  };

  render() {
    var last_sync = window.localStorage.getItem("last_sync")
    last_sync = moment(last_sync).format("DD-MM-YYYY HH.mm.ss")
    console.log(this.props.sync.ramp_sync, '...Ramp Past Sync')
    console.log(this.state.isLoading, '..isLoading Past..')
    console.log(this.props.network.status, '..Network Status Past..')

    var classes = this.props.classes;
    const open = Boolean(this.state.anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
      <div>
        <TableTop className={classes.topBar}></TableTop>
        <div className={classes.tableContainer}>
          <Typography className={classes.cellH} colSpan={8}>Last Sync :{last_sync}</Typography>
          <AppBar position="static" color="default" >
            <Tabs
              value={this.state.tabValue}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
              className={classes.tabSize}
            >
              <Tab label={this.state.prevTab} className={this.state.previousData.length > 0 ? classes.prevTab : classes.tabSize}/>
              <Tab label={this.state.currentTab} className={classes.tabSize} />
            </Tabs>
          </AppBar>
          <table className={classes.table}>
            <thead className={this.props.page.theme === "light" ? classes.headLight : classes.headDark}>
              <tr>
                <th className={classes.cellH}>Reg.</th>
                <th className={classes.cellH}>Flt.</th>
                <th className={classes.cellH}>Bay</th>
                <th className={classes.cellH}>Frm</th>
                <th className={classes.cellH}>To</th>
                <th className={classes.cellH}>STD</th>
                <th className={classes.cellH}>STA</th>
                {/* <th className={classes.cellH}>Info</th> */}
                {/* <th className={classes.cellH}>OutofGate</th> */}

              </tr>
            </thead>
            <tbody>

              {
                (this.props.sync.ramp_sync === true || this.state.isLoading) && <tr>
                  <th className={classes.cellH} colSpan={8}>Syncing...</th>
                </tr>
              }
              {
                this.props.sync.ramp_sync === false && !this.state.isLoading && this.state.fims_schedule.length === 0 && <tr>
                  <th className={classes.cellH} colSpan={8}>No Data</th>
                </tr>
              }
              {
                this.props.sync.ramp_sync === false && this.state.fims_schedule.sort((a, b) => new Date(a.STD) - new Date(b.STD)).map((item, k) => {
                  return <tr onClick={() => {
                    this.navigateToFIMS(item);
                  }} className={this.props.page.theme === "light" ?
                    (k % 2 ? classes.cellLightI : classes.cellLightO) : (k % 2 ? classes.cellDarkI : classes.cellDarkO)}>
                    <td className={classes.cell}>{this.trimRegNo(item.Regn_no)}</td>
                    <td className={classes.cell}>{item.Flight_no}</td>
                    <td className={classes.cell}>{item.BayNo}</td>
                    <td className={classes.cell}>{item.Source}</td>
                    <td className={classes.cell}>{item.Destination}</td>
                    <td className={classes.cell}>{this.formatTime(item.STD)}</td>
                    {/* <td >{ item.ETD}</td> */}
                    <td className={classes.cell}>{this.formatTime(item.STA)}</td>
                    {/* <td className={classes.cell}>{this.formatTime(item.OutofGate)}</td> */}

                    {/* <td className={classes.cell}>{
                      <IconButton aria-label="delete" style={{padding:"0px",color:"#2b3144"}}onClick={(event) => {
                        event.stopPropagation(); 
                        this.handleClick(event);
                        this.setState({"currentDate":this.formatDate(item.Flight_Date)})
                      }}>
                        <InfoIcon />
                      </IconButton>
                    }</td> */}

                  </tr>
                })

              }
            </tbody>
          </table>
          <Popover id={id} open={open} anchorEl={this.state.anchorEl} onClose={()=>{this.handleClose()}}
          onClick={()=>{
            this.handleClose()
          }}>
          <div style={{padding:"10px"}}>
                <Typography className={classes.cellH}>Flight Date</Typography>
                <Typography className={classes.cellH}>{this.state.currentDate}</Typography>
              </div>
          </Popover>
        </div>
      </div>
    );
  }

}
const styles = (theme) => {
  return createStyles({
    tableContainer: {
      padding: theme.spacing(2),
      paddingBottom: theme.spacing(20)
    },
    table: {
      borderCollapse: "collapse",
      width: "100%"
    },
    headDark: {
      'borderTop': "solid 1px #fff",
      'borderBottom': "solid 1px #fff",
    },
    headLight: {
      color: "#000",
      'borderTop': "solid 1px #000",
      'borderBottom': "solid 1px #000",
    },
    cellLightI: {
      'borderTop': "solid 1px #000",
      'borderBottom': "solid 1px #000",
      background: "#b57e7e"
    },
    cellLightO: {
      'borderTop': "solid 1px #000",
      'borderBottom': "solid 1px #000",
      background: "#abe5ab"
    },
    cellDarkI: {
      'borderTop': "solid 1px #fff",
      'borderBottom': "solid 1px #fff",
      background: "#b57e7e"
    },
    cellDarkO: {
      'borderTop': "solid 1px #fff",
      'borderBottom': "solid 1px #fff",
      background: "#abe5ab"
    },
    cell: {
      textAlign: "center",
      padding: theme.spacing(2, 0),
      color: "#000"
    },
    cellH: {
      fontWeight: "bold",
      textAlign: "center",
      padding: theme.spacing(2, 0),
      color: theme.palette.common,
    },
    topBar: {
      borderCollapse: "collapse",
      width: "100%"
    },
    prevTab : {
      backgroundColor: "#d29527d4",
      minHeight: "0px !important",
    },
    tabSize: {
      minHeight: "0px !important",
    }
  });
};
export default connect((store) => {
  return {
    page: store.page,
    sync: store.sync,
    network: store.network,
  }
}, {
  setPage: setPage,
  setPageAction: setAction,
})(compose(withRouter, withStyles(styles))(Past));
