import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
  text__first: props => ({
    color: props.color ? `${props.color}` : 'white',
    fontWeight: "700",
    color: "#f22222",
    fontSize: props.testSize ? props.testSize : 15,
    // backgroundColor:"black",
    borderRadius:"5px",
    marginBottom:"5px",
  }),
  text__second: {
    color: "#f22222",
    fontWeight: "700",
  },
});
export default useStyles