import React from "react";
import { connect } from "react-redux";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Cached as RefereshAllIcon,
  HomeOutlined,
} from "@material-ui/icons";
import { syncThread } from "../../Action/sync";
import { syncNewThread } from "../../Action/syncNew";
import { syncFlight } from "../../Action/syncFlight";
import * as Enviornment from "../../Action/environment";

class Appbar extends React.Component {
  componentWillMount() {
    console.log("Pagee: ", this.props.history);
  }
  render() {
    const { classes } = this.props;

    var is_back = false;
    var is_refresh = false;
    var is_syncFlight = false;
    var is_homeIcon = false;

    if (
      this.props.page.page_info == "FIMS" ||
      this.props.page.page_info == "FimsTrimsheet" ||
      this.props.page.page_info == "TrimsheetLMC"
    ) {
      is_back = true;
    }
    if (
      this.props.page.page_info == "upcoming" ||
      this.props.page.page_info == "past"
    ) {
      is_refresh = true;
    }
    if (this.props.page.page_info == "FIMS") {
      is_syncFlight = true;
    }

    if (
      this.props.page.page_info == "FimsTrimsheet" ||
      this.props.page.page_info == "TrimsheetLMC"
    ) {
      is_homeIcon = true;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            {is_back && (
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                onClick={() => {
                  this.props.history.goBack();
                }}
              >
                <ArrowBackIcon color={"inherit"} />
              </IconButton>
            )}
            <div className={classes.appBarHeader}>
              <Typography className={classes.appBarHeaderText} color="primary">
                RAMPCONTROL<span className={classes.span}>DEVICE </span>
                <span className={classes.version}>
                  v{Enviornment.version()}
                </span>
              </Typography>
            </div>
            {is_refresh && !this.props.sync.ramp_sync && (
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                onClick={() => {
                  // this.props.history.goBack();
                  this.props.syncNewThread();
                }}
              >
                <RefreshIcon color={"inherit"} />
              </IconButton>
            )}
            {is_refresh && !this.props.sync.ramp_sync && (
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                onClick={() => {
                  // this.props.history.goBack();
                  this.props.syncThread();
                }}
              >
                <RefereshAllIcon color={"inherit"} />
              </IconButton>
            )}
            {is_syncFlight && !this.props.sync.ramp_sync && (
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                onClick={() => {
                  this.props.syncFlight();
                }}
              >
                <RefreshIcon color={"inherit"} />
              </IconButton>
            )}
            {is_homeIcon && (
              <IconButton
                edge="start"
                className={classes.homeButton}
                color="inherit"
                onClick={() => {
                  // this.props.history.goBack();
                  this.props.history.push("/app/upcoming");
                }}
              >
                <HomeOutlined color={"inherit"} />
              </IconButton>
            )}
            {is_refresh && this.props.sync.ramp_sync && <CircularProgress />}
            {is_syncFlight && this.props.sync.ramp_sync && <CircularProgress />}
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}

const styles = (theme) => {
  return createStyles({
    "@global": {
      "html,body,#root": {
        margin: 0,
        height: "100%",
        background: theme.palette.background.default,
      },
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      background: theme.palette.background.default,
      display: "flex",
      height: theme.spacing(12),
    },
    appBarHeader: {
      textAlign: "center",
      margin: "0 auto",
    },
    appBarHeaderText: {
      fontSize: theme.spacing(4.25),
    },
    span: {
      fontSize: theme.spacing(4.25),
      marginLeft: theme.spacing(2),
      color: theme.palette.common,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      color: theme.palette.common,
    },
    homeButton: {
      //marginLeft: 8,
      color: theme.palette.common,
      "& svg": {
        fontSize: 30,
      },
    },
    version: {
      color: "#4cc1ec",
      fontSize: "15px",
    },
  });
};

export default connect(
  (state) => {
    return {
      page: state.page,
      sync: state.sync,
    };
  },
  {
    syncThread: syncThread,
    syncNewThread: syncNewThread,
    syncFlight: syncFlight,
  }
)(compose(withRouter, withStyles(styles))(Appbar));
