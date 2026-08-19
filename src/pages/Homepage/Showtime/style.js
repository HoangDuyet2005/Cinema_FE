import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  rootShowtime: {
    padding: "30px 0 10px 0",
    width: "100%",
  },

  Arrow: {
    position: "absolute",
    top: "48%",
    transform: "translateY(-50%)",
    zIndex: 2,
    width: "50px",
    height: "100px",
    color: "#d8d8d8 !important",
    cursor: "pointer",
    transition: "all .2s",
    "&:hover": { color: "#e87722 !important" },
  },

  listMovie: {
    opacity: props => props.fade ? 1 : 0,
    transition: "opacity .1s linear",
  },
}))

export default useStyles
