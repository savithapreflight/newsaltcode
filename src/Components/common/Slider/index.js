import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

export default withStyles((theme) => {

    return {
        root: {
            color: theme.palette.primary.main,
            height: 2,
            padding: '15px 0',
            width: "100%"
          },
          thumb: {
            height: 22,
            width: 22,
            backgroundColor: '#fff',
            boxShadow: iOSBoxShadow,
            marginTop: -10,
            marginLeft: -10,
            '&:focus,&:hover,&$active': {
              boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
              // Reset on touch devices, it doesn't add specificity
              '@media (hover: none)': {
                boxShadow: iOSBoxShadow,
              },
            },
          },
          active: {},
          valueLabel: {
            left: 'calc(-50% + 11px)',
            top: -22,
            '& *': {
              background: 'transparent',
              color: '#000',
            },
          },
          track: {
            height: 2,
          },
          rail: {
            height: 2,
            opacity: 0.5,
            backgroundColor: '#bfbfbf',
          },
          mark: {
            backgroundColor: '#bfbfbf',
            height: 8,
            width: 1,
            marginTop: -3,
          },
          markActive: {
            opacity: 1,
            backgroundColor: 'currentColor',
          },
    }
        
})(Slider);