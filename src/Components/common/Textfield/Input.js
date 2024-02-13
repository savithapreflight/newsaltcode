import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';



export default withStyles((theme) => {

    const {palette, spacing}     =   theme;
    var appTheme     = window.localStorage.getItem("app_theme");
    if(appTheme === "dark"){
      return {
        root: {
          'label + &': {
            marginTop: theme.spacing(3),
          },
        },
        input: {
          borderRadius: 4,
          position: 'relative',
          backgroundColor: "transparent",
          border: '1px solid #fff',
          fontSize: 16,
          width: 'auto',
          padding: '10px 12px',
        },
      }
    }else{
      return {
        root: {
          'label + &': {
            marginTop: theme.spacing(3),
          },
        },
        input: {
          borderRadius: 4,
          position: 'relative',
          backgroundColor: "transparent",
          border: '1px solid #000',
          fontSize: 16,
          width: 'auto',
          padding: '10px 12px',
        },
      }
    }
})(InputBase);