import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  rootShowtime: {
    padding: "30px 0 10px 0",
    width: "100%",
  },

  headerContainer: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 20px",
    boxSizing: "border-box",
  },

  listMovie: {
    opacity: props => props.fade ? 1 : 0,
    transition: "opacity .1s linear",
  },
}))

export default useStyles