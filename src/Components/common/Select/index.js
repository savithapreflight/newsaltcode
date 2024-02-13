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
        color: theme.palette.common,
        borderRadius: 4,
        position: 'relative',
        border: '1px solid '+theme.palette.common,
        fontSize: 14,
        padding: '10px 26px 10px 12px',
        '&:focus': {
          borderRadius: 4,
          borderColor: theme.palette.common,
        },
      },
}
})(InputBase);
