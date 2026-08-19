import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  theater: {
    display: (props) => (props.isMobileTheater ? "block" : "flex"),
    // maxWidth: 1024,
    // maxHeight: 800,
    height:"100%",
    borderTop: "1rem solid rgb(250, 82, 56)",
    borderRadius: 0,
    backgroundColor:"white",
  },
  taps: {
    // dường line phần chia khi horizontal
    borderBottom: "none",
    minWidth: 200,
  },
  cumRap: {
    minWidth: "calc(100% - 92px)",
  },
  tabs__indicator: {
    backgroundColor: "white",
  },
  tap: (props) => ({
    padding: 10,
    minWidth: 150,
    margin: "auto",
    ...props.underLine,
  }),
  textColorInherit: {
    opacity: 0.5,
    "&:hover": {
      transition: "all .2s",
      opacity: 1,
    },
  },
});
export default useStyles;
