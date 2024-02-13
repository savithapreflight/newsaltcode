import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';

export default withStyles((theme) => {
const {palette, typography}     =   theme;
return {
    root: {
        'label + &': {
          marginTop: theme.spacing(3),
        },
      },
      input: {
        color: "#2c305f",
        borderRadius: 4,
        position: 'relative',
        border: '1px solid '+"#2c305f",
        fontSize: 13,
        height: "10px",
        padding: '3px 0px 10px 5px',
        '&:focus': {
          borderRadius: 4,
          borderColor: "#2c305f",
        },
      },
}
})(InputBase);
