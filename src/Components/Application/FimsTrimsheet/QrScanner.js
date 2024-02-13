import React from "react";
import { QrReader } from "react-qr-reader";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { UpdateCaptEmpId } from "../../../Action/LMCupdaeaction";
class QRScanner extends React.Component {
  constructor(props) {
    super(props);
  }
  handleScan = (data) => {
    console.log("props", data);
    const dataNeeded = this.props.location.state;
    if (data !== null) {
      const dataneded = { data };

      const dataObject = dataneded.data.split("\n").reduce((acc, line) => {
        const [key, value] = line.split(":").map((item) => item.trim());
        return { ...acc, [key]: value };
      }, {});

      const empId = dataneded.data
        .split("Emp. Code")[1]
        .split("Location")[0]
        .replace(":", "")

        ?.trim();
      console.log("name123", empId);
      const name = dataneded.data
        .split("Name")[1]
        .split("Designation")[0]
        .replace(":", "")
        ?.trim();
      console.log("name", name);
      var CaptEmpId = "DEFAULT";
      if (empId && empId) {
        CaptEmpId = empId;
      }
      localStorage.setItem("CaptEmpId", CaptEmpId);
      console.log("CaptEmpId ", CaptEmpId);

      var postData = {
        Flight_Date: dataNeeded.flightDate,
        Flight_no: dataNeeded.flightNo,
        source: dataNeeded.source,
        Destination: dataNeeded.destination,
        CaptEmpId: CaptEmpId,
        CAPTAIN: name,
      };
      console.log("postData for updating CaptEmpId ", postData);
      UpdateCaptEmpId(postData);
      this.props.history.push({
        pathname: `/app/fims_trim/${dataNeeded.flightNo}/${dataNeeded.flightDate}/${dataNeeded.source}/${dataNeeded.destination}/upcoming`,
        state: {
          sharebutton: true,
        },
      });
      // this.props.history.push(
      //   `/app/fims_trim/${dataNeeded.flightNo}/${dataNeeded.flightDate}/${dataNeeded.source}/${dataNeeded.destination}/upcoming`,
      //   { sharebutton: true }
      // );
    }
  };
  handleError = (err) => {
    alert(err)
    console.log("errrrrrrrr", err);
    this.props.history.goBack();
  };
  componentDidMount() {
    const platform = window.cordova?.platformId; // Use the Cordova platformId instead of device.platform
    console.log(platform);
    console.log(window.cordova);
    if (platform === "android" || platform === "iOS") {
      var permission = cordova.plugins.permissions.CAMERA; // Replace with the permission you need

      cordova.plugins.permissions.checkPermission(
        permission,
        function (status) {
          if (status.hasPermission) {
            // Permission is already granted
            console.log("Permission already granted");
            // Perform actions that require this permission
          } else {
            // Request the permission
            cordova.plugins.permissions.requestPermission(
              permission,
              function (status) {
                if (status.hasPermission) {
                  // Permission granted
                  console.log("Permission granted");
                  // Perform actions that require this permission
                } else {
                  // Permission denied
                  console.log("Permission denied");
                  // Handle the denial of permission (e.g., show a message to the user)
                }
              },
              function () {
                // Error occurred while requesting the permission
                console.log("Error requesting permission");
              }
            );
          }
        },
        function () {
          // Error occurred while checking the permission
          console.log("Error checking permission");
        }
      );
    }
  }

  render() {
    return (
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            console.log(result?.text);
            this.handleScan(result?.text);
          }

          if (!!error) {
            console.log(error);
          }
        }}
        delay={300}
        style={{ width: "100%" }}
        showViewFinder={true}
        // constraints={{ facingMode: { exact: "environment" } }}
      />
    );
  }
}
export default connect((state) => {
  return {
    page: state.page,
    sync: state.sync,
  };
})(compose(withRouter)(QRScanner));
