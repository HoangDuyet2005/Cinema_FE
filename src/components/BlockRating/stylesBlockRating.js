import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  film__point: {
    fontFamily: '"SF Medium"',
    backgroundColor: "rgba(38, 20, 84, 1)",
    border: "1px solid #1f2e46",
    borderRadius: "4px",
    padding: "2px",
    position: "absolute",
    top: "12px",
    right: "12px",
    color: "#ff4500",
    width: "54px",
    textAlign: "center",
    lineHeight: 1.1
  },
  point: {
    margin: "0 !important",
    fontWeight: 600,
    fontSize: "20px"
  },
  star: {
    margin: "0 !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  rootStar: {
    fontSize: "10px !important",
  },
  iconFilled: {
    color: "rgb(255, 255, 0)",
  },
  iconEmpty: {
    color: "rgba(251, 66, 38, 0.3)",
  },


}))

export default useStyles
