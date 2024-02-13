import React, { useState } from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { BottomNavigationAction, BottomNavigation } from "@material-ui/core";
import { connect } from "react-redux";

class BottomNav extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      is_lmc: false,
    };
  }

  componentWillMount() {
    var user = JSON.parse(window.localStorage.getItem("auth_user"));
    this.setState({"is_lmc":user.is_lmc});
  }

  render() {
    var { classes } = this.props;

    if (
      this.props.page.page_info == "FIMS" ||
      this.props.page.page_info == "FimsTrimsheet" ||
      this.props.page.page_info == "TrimsheetLMC"
    ) {
      return null;
    }
    return (
      <BottomNavigation
        value={this.props.page.page_info}
        className={classes.bottomNav}
        showLabels
      >
        <BottomNavigationAction
          className={classes.navAction}
          label="Upcoming"
          onClick={() => {
            this.props.history.push("/app/upcoming");
          }}
          value={"upcoming"}
          icon={<i className="fas fa-home" style={{ fontSize: "24px" }}></i>}
        />
        <BottomNavigationAction
          className={classes.navAction}
          label="Past"
          onClick={() => {
            this.props.history.push("/app/past");
          }}
          icon={
            <i className="fas fa-chart-area" style={{ fontSize: "24px" }}></i>
          }
          value={"past"}
        />
        <BottomNavigationAction
          className={
            this.state.is_lmc ? classes.navAction : classes.navDisabled
          }
          label="Offline Trimsheet"
          onClick={() => {
            this.props.history.push("/app/trimsheet");
          }}
          icon={
            <i className="fas fa-handshake" style={{ fontSize: "24px" }}></i>
          }
          value={"OfflineTrimsheet"}
          // disabled={!this.state.is_lmc}
        />
        <BottomNavigationAction
          className={classes.navAction}
          label="Profile"
          onClick={() => {
            this.props.history.push("/app/profile");
          }}
          icon={
            <i className="fas fa-user-circle" style={{ fontSize: "24px" }}></i>
          }
          value={"profile"}
        />
      </BottomNavigation>
    );
  }
}

const styles = (theme) => {
  return createStyles({
    bottomNav: {
      height: theme.spacing(14.5),
      position: "fixed",
      background: theme.palette.background.default,
      left: 0,
      right: 0,
      bottom: 0,
      boxShadow:
        "4px -1px 0px 2px  rgba(0,0,0,0.2), 5px 0px 0px 4px rgba(0,0,0,0.14), 10px 0px 0px 1px  rgba(0,0,0,0.12)",
    },
    navAction: {
      color: theme.palette.bottomNav,
    },
    navDisabled: {
      color: theme.palette.disabled,
    },
  });
};

export default connect((store) => {
  return {
    page: store.page,
  };
}, {})(compose(withRouter, withStyles(styles))(BottomNav));
