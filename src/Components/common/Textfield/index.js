import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';



export default withStyles((theme) => {

    const {palette, spacing}     =   theme;
    var appTheme     = window.localStorage.getItem("app_theme");
    if(appTheme === "dark"){
      return {
        root: {
          '& label': {
            color: "#fff",
          },
          '& label.Mui-focused': {
            color: theme.palette.primary.main,
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: theme.palette.primary.main,
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main
            },
          },
        },
      }
    }else{
      return {
        root: {
          '& label': {
            color: "#000",
          },
          '& label.Mui-focused': {
            color: theme.palette.primary.main,
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: theme.palette.primary.main,
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'black',
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main
            },
          },
        },
      }
    }
})(TextField);