import React, { useEffect, useRef, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from "@material-ui/core";
import { isEmpty, last, get } from "lodash";
import { DataGrid } from "@material-ui/data-grid";
import "./styles.scss";

const useStyles = makeStyles((theme) => ({
  cell: {
    border: "1px solid rgba(81, 81, 81, 1)",
    margin: "5px 5px 5px 0",
    lineHeight: "45px !important",
    minHeight: "45px !important",
    minWidth: "146px !important",
    maxWidth: "146px !important",
  },
  root: {
    "& .MuiDataGrid-cell--editing": {
      backgroundColor: "rgb(255,215,115, 0.19)",
      color: "#1a3e72",
    },
    textAlign: "left !important",
    "& .Mui-error": {
      border: `1px solid rgb(126,10,15)`,
      color: "#ff4343",
    },
  },
}));

const rowData = {
  id: 1,
  sector: "",
  actWt: "",
  estWt: "",
  nature: "",
  loc: "",
  finalDestination: "",
  loadType: "",
  remarks: "",
};

const splRegex = /^[\w\-\s]+$/;
const digit4Reg = /^\d{1,4}?$/;

const initailData = {
  rows: [rowData],
  error: {},
  disableAdd: false,
  disableSubmit: false,
  editRowsModal: {},
};

const getActWt = (params) => {
  return params.getValue(params.id, "actWt");
};

const CargoModal = ({
  onClose,
  onSubmit,
  open,
  currentCargo,
  limits,
  cargoData,
  cargo,
}) => {
  const { loadTypes, sectors } = cargo;
  const [{ rows, error, disableAdd, disableSubmit }, setState] =
    useState(initailData);
  const errRef = useRef({});
  const rowRef = useRef([]);
  const classes = useStyles();
  const [selectedRow, setselectedRow] = useState(null);

  const columns = [
    {
      field: "id",
      headerName: "#",
      width: 150,
      sortable: false,
    },
    {
      field: "sector",
      headerName: "SECTOR",
      editable: true,
      width: 150,
      sortable: false,
      type: "singleSelect",
      valueOptions: sectors.map((ele) => ele?.destination),
      renderCell: (params) => (
        <div style={{ width: "100%" }}>
          <span>{params.value}</span>
          <span style={{ float: "right" }}>&nbsp; &nbsp; &#9660;</span>
        </div>
      ),
    },
    {
      field: "actWt",
      headerName: "ACT WT",
      editable: true,
      width: 150,
      sortable: false,
      type: "number",
      cellClassName: (props) => {
        if (
          (!digit4Reg.test(props.value) ||
            parseInt(props.value, 10) > parseInt(limits, 10)) &&
          props.value
        ) {
          return "error-cell text-left";
        } else {
          return "text-left";
        }
      },
      valueFormatter: (props) => {
        const newErr = { ...errRef.current };
        // if(!digit4Reg.test(props.value) && props.value){
        //     newErr[`row-${props.id} ACT WT`] = 'only whole numbers less than 10000'
        // }else{
        //     delete newErr[`row-${props.id} ACT WT`]
        // }
        // if(parseInt(props.value, 10) > parseInt(limits,10)){
        //     newErr[`row-${props.id} ACT WT err`] = `In Compartment ${currentCargo+1}, total weight (${props.value})
        //     is exceeding than the max copartment weight (${limits}), so reduce the weight by ${props.value - limits}`
        // }else{
        //     delete newErr[`row-${props.id} ACT WT err`]
        // }
        // errRef.current = newErr;
        return props.value;
      },
    },
    {
      field: "estWt",
      headerName: "EST WT",
      editable: false,
      width: 150,
      sortable: false,
      type: "number",
      cellClassName: "text-left",
      valueGetter: getActWt,
    },
    {
      field: "nature",
      headerName: "NATURE",
      editable: true,
      width: 150,
      sortable: false,
      type: "singleSelect",
      valueOptions: ["B", "C"],
      renderCell: (params) => (
        <div style={{ width: "100%" }}>
          <span>{params.value}</span>
          <span style={{ float: "right" }}>&nbsp; &nbsp; &#9660;</span>
        </div>
      ),
    },
    {
      field: "loc",
      headerName: "LOC",
      editable: false,
      width: 150,
      sortable: false,
      valueFormatter: () => `${currentCargo + 1}`,
    },
    {
      field: "finalDestination",
      headerName: "Final Destination",
      editable: true,
      width: 150,
      sortable: false,
      cellClassName: (props) => {
        if (!splRegex.test(props.value) && props.value) {
          return "error-cell";
        } else {
          return null;
        }
      },
      valueFormatter: (props) => {
        // const newErr = {...errRef.current}
        // if(splRegex.test(props.value) && props.value){
        //     newErr[`row-${props.id} Final Destination`] = 'special chars not allowed'
        // }else{
        //     delete newErr[`row-${props.id} Final Destination`]
        // }
        // errRef.current = newErr;
        // if(get(props,'value', '').length < 4)
        return get(props, "value", "").toUpperCase();
        // else{
        //     return get(props, 'value', '').slice(0,3).toUpperCase()
        // }
      },
    },
    {
      field: "loadType",
      headerName: "Load Type",
      editable: true,
      width: 150,
      sortable: false,
      type: "singleSelect",
      valueOptions: [
        " ",
        ...loadTypes
          .filter((ele) => {
            const compLocs = get(ele, "CompLocs", "");
            if (
              compLocs === null ||
              compLocs.split(",").includes(currentCargo?.toString())
            ) {
              return true;
            }
          })
          .map((ele) => get(ele, "SpecialLoad", "")),
      ],
      renderCell: (params) => (
        <div style={{ width: "100%" }}>
          <span>{params.value}</span>
          <span style={{ float: "right" }}>&nbsp; &nbsp; &#9660;</span>
        </div>
      ),
    },
    {
      field: "remarks",
      headerName: "REMARKS",
      editable: true,
      width: 150,
      sortable: false,
      cellClassName: (props) => {
        if (!splRegex.test(props.value) && props.value) {
          return "error-cell";
        } else {
          return null;
        }
      },
      valueFormatter: (props) => {
        // const newErr = {...errRef.current}
        // if(splRegex.test(props.value) && props.value){
        //     newErr[`row-${props.id} Remarks`] = 'special chars not allowed'
        // }else{
        //     delete newErr[`row-${props.id} Remarks`]
        // }
        // errRef.current = newErr;
        return get(props, "value", "").toUpperCase();
      },
    },
  ];
  const addNewRow = () => {
    const id = rows.length + 1;
    const newRowData = { ...rowData, id };
    const newRow = [...rowRef.current];
    newRow.push(newRowData);
    setState((prev) => ({
      ...prev,
      rows: newRow,
      disableAdd: true,
    }));
  };
  const deleteRow = () => {
    const rowData = [...rowRef.current];
    const newRow = rowData.filter((row) => row.id !== selectedRow.id);
    console.log(newRow, "rowRef.current");
    setState((prev) => ({
      ...prev,
      rows: newRow,
      disableAdd: false,
    }));
  };

  console.log(rowRef.current, "rowRef.current");
  // const data = `BOM$401$401$B$2$OND$$#DEL$87$87$B$1$$$#BOM$300$300$B$1$$$#BOM$375$375$B$2$$$#BOM$300$300$C$2$$$#BOM$400$400$C$4$$$#BOM$141$141$C$3$$VAL$#BOM$327$327$C$3$$$`
  let tableData = cargoData.split("#");

  tableData = tableData.map((data) => data.split("$"));
  const rawData = tableData;
  tableData = tableData.filter((ele) => {
    return ele[4] === (currentCargo + 1).toString();
  });

  useEffect(() => {
    const newRows = tableData.map((data, index) => {
      return {
        id: index + 1,
        sector: data[0],
        actWt: data[1],
        estWt: data[2],
        nature: data[3],
        loc: data[4],
        finalDestination: data[5],
        loadType: data[6],
        remarks: data[7],
      };
    });
    setState((prev) => ({
      ...prev,
      rows: newRows,
    }));
  }, [JSON.stringify(cargoData), currentCargo]);

  const updateError = () => {
    setTimeout(() => {
      const err = { ...errRef.current };
      setState((prev) => ({
        ...prev,
        error: err,
      }));
    }, 500);
  };
  const onCancel = () => {
    setTimeout(() => {
      errRef.current = {};
      setState((prev) => ({
        ...prev,
        error: {},
      }));
    }, 1000);
    onClose();
  };

  const onSubmitClick = () => {
    setTimeout(() => {
      const err = {};
      let cargoWt = 0;
      let baggageWt = 0;
      let replaceIndex = 0;
      let replacedData = [...rawData];
      for (let i = 0; i < rowRef.current.length; i++) {
        const idObj = { ...rowRef.current[i], estWt: rowRef.current[i].actWt };
        if (idObj.nature === "B") {
          baggageWt += parseInt(idObj.actWt, 10);
        } else if (idObj.nature === "C") {
          cargoWt += parseInt(idObj.actWt, 10);
        }
        if (!idObj.sector) {
          err[`row-${idObj.id}-sector`] = "Mandatory field";
        }
        if (!idObj.actWt) {
          err[`row-${idObj.id}-actWt`] = "Mandatory field";
        }

        if (!idObj.nature) {
          err[`row-${idObj.id}-nature`] = "Mandatory field";
        }
        delete idObj.id;
        // const obj = Object.values(idObj).join('$')
        // compressedStr = compressedStr + obj + '#'
      }
      const newData = rowRef.current.map((ele) => {
        const idObj = { ...ele, estWt: ele.actWt, loc: `${currentCargo + 1}` };
        delete idObj.id;
        return Object.values(idObj);
      });
      replacedData = [
        ...replacedData.filter(
          (ele) => ele[4] !== (currentCargo + 1).toString()
        ),
        ...newData,
      ];
      var sortedArray = replacedData.sort((a, b) => {
        return a[4] - b[4];
      });
      // for(let i=0; i< replacedData.length; i++){
      //     if(replacedData[i][4] == (currentCargo+1).toString()){
      //         const idObj = {...rowRef.current[replaceIndex], estWt: rowRef.current[replaceIndex].actWt, loc: `${currentCargo+1}`}
      //         delete idObj.id
      //         const obj = Object.values(idObj)
      //         replacedData[i] = obj;
      //         replaceIndex+=1;
      //     }
      // }
      // replaceIndex = rowRef.current.length-tableData.length
      // for(let i=0; i< rowRef.current.length-tableData.length; i++){
      //     const idObj = {...rowRef.current[replaceIndex], estWt: rowRef.current[replaceIndex].actWt, loc: `${currentCargo+1}`}
      //     delete idObj.id
      //     const obj = Object.values(idObj)
      //     replacedData[replaceIndex] = obj;
      //     replaceIndex+=1;
      // }

      const compressedStr = sortedArray.map((ele) => ele.join("$")).join("#");

      setState((prev) => ({
        ...prev,
        // rows: rowRef.current,
        error: err,
      }));
      if (isEmpty(err)) {
        //  console.log("CMK ",loc);
        onSubmit(compressedStr, currentCargo + 1, baggageWt, cargoWt);
      }
    }, 1000);
  };

  const onStateChange = (e) => {
    const gridState = Object.values(get(e, "state.rows.idRowsLookup", {})).map(
      (ele) => ele
    );
    rowRef.current = gridState;
  };

  //    const checkIfRowsFilled=(rows)=>{
  //        const lastRow = last(rows)
  //        delete lastRow.id
  //        console.log(lastRow)
  //        const isAllBlank = Object.values(lastRow).every(ele=>{
  //            console.log(ele)
  //            return !ele
  //        })
  //        setState(prev=>({
  //            ...prev,
  //            disableAdd: !isAllBlank
  //        }))
  //    }

  const onEditCell = (e) => {
    setState((prev) => ({
      ...prev,
      disableAdd: false,
    }));
  };

  const handleEditRowsModelChange = React.useCallback(
    (newModel) => {
      const updatedModel = { ...newModel };
      const err = { ...errRef.current };
      let disSubmit = false;
      Object.keys(updatedModel).forEach((id) => {
        if (updatedModel[id].finalDestination) {
          const val = updatedModel[id].finalDestination.value;
          const isValid =
            get(updatedModel[id], "finalDestination.value.length", 0) === 3 &&
            /^[a-zA-Z]+$/.test(updatedModel[id].finalDestination.value);
          updatedModel[id].finalDestination = {
            ...updatedModel[id].finalDestination,
            error: !isValid,
          };
          if (!isValid && val) {
            err[`row-${id} Final destination`] =
              "only alphabets with length equal to 3";
            disSubmit = true;
          } else {
            delete err[`row-${id} Final destination`];
            disSubmit = false;
          }
          if (!splRegex.test(val) && val) {
            err[`row-${id} Final Destination`] = "special chars not allowed";
            updatedModel[id].finalDestination = {
              ...updatedModel[id].finalDestination,
              error: true,
            };
            disSubmit = true;
          } else {
            delete err[`row-${id} Final Destination`];
            disSubmit = false;
          }
        }
        if (updatedModel[id].loadType) {
          const isValid = true;
          updatedModel[id].loadType = {
            ...updatedModel[id].loadType,
            error: !isValid,
          };
        }

        if (updatedModel[id].actWt) {
          const val = updatedModel[id]?.actWt?.value;
          let isValid = false;
          if (
            !digit4Reg.test(val) ||
            val.toString().includes("-") ||
            val.toString().includes(".") ||
            val === 0
          ) {
            err[`row-${id} ACT WT`] = "only whole numbers less than 10000";
            disSubmit = true;
            isValid = false;
          } else {
            delete err[`row-${id} ACT WT`];
            disSubmit = false;
            isValid = true;
          }
          if (parseInt(val, 10) > parseInt(limits, 10)) {
            err[`row-${id} ACT WT err`] = `In Compartment ${
              currentCargo + 1
            }, total weight (${val})
            is exceeding than the max copartment weight (${limits}), so reduce the weight by ${
              val - limits
            }`;
            disSubmit = true;
            isValid = false;
          } else {
            delete err[`row-${id} ACT WT err`];
            disSubmit = false;
            isValid = true;
          }
          updatedModel[id].actWt = {
            ...updatedModel[id].actWt,
            error: !isValid,
          };
          // // errRef.current = newErr;
          // if(!digit4Reg.test(val) && (parseInt(val, 10) > parseInt(limits,10)) && val){
          //     disSubmit = true
          // }else{
          //     disSubmit = false
          // }
        }
        if (updatedModel[id].remarks) {
          const val = updatedModel[id]?.remarks?.value.toUpperCase();
          let isValid = false;
          if (!splRegex.test(val) && val) {
            err[`row-${id} Remarks`] = "special chars not allowed";
            disSubmit = true;
            isValid = false;
          } else {
            delete err[`row-${id} Remarks`];
            disSubmit = false;
            isValid = true;
          }
          if (val.length > 100 && val) {
            err[`row-${id} Remarks Length`] = "more than 100 chars not allowed";
            disSubmit = true;
            isValid = false;
          } else {
            delete err[`row-${id} Remarks Length`];
            disSubmit = false;
            isValid = true;
          }
          updatedModel[id].remarks = {
            ...updatedModel[id].remarks,
            error: !isValid,
          };
        }
      });
      errRef.current = err;
      setState((prev) => ({
        ...prev,
        editRowsModal: { ...updatedModel },
        error: err,
        disableSubmit: disSubmit,
      }));
    },
    [limits]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      classes={{
        paper: "paper-content",
      }}
      // scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">
        Cargo and baggage details
      </DialogTitle>
      <DialogContent
      //  dividers={scroll === 'paper'}
      >
        {/* <DialogContentText
            id="scroll-dialog-description"
            // ref={descriptionElementRef}
            tabIndex={-1}
          > */}
        <div
          style={{
            height: 200 + rows.length * 40,
            width: "100%",
            maxHeight: 400,
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            classes={{
              cell: classes.cell,
              root: "root-class",
            }}
            className={classes.root}
            onEditCellPropsChange={onEditCell}
            onEditRowsModelChange={handleEditRowsModelChange}
            onStateChange={onStateChange}
            hideFooter
            onColumnHeaderClick={() => null}
            sortingOrder="null"
            disableColumnMenu
            onCellLeave={updateError}
            onRowClick={(params, event, details) => setselectedRow(params.row)}
          />
        </div>
        <DialogContent>
          <div style={{ margin: "15px" }}>
            {Object.entries(error).map(([key, val]) => (
              <div>
                <span style={{ color: "red" }}>
                  {key}:&nbsp;{val}
                </span>
                <br />
              </div>
            ))}
          </div>
        </DialogContent>
        {/* </DialogContentText> */}
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={addNewRow} color="primary" disabled={disableAdd}>
          Add
        </Button>
        <Button onClick={deleteRow} color="primary" disabled={!selectedRow}>
          Delete
        </Button>
        <Button
          color="primary"
          onClick={onSubmitClick}
          disabled={!isEmpty(errRef.current) || disableSubmit}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CargoModal;
