import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
  lstPhim: props => ({
    flex: "0 0 60%",
    height: "705px",
    overflowY: 'auto',
    borderLeft: "1px solid #ebebec",
    ...props.customScrollbar
  }),
  phim: props => ({
    paddingBottom: "17px",
    paddingTop: "20px",
    paddingRight: "15px",
    paddingLeft: "20px",
    ...props.underLine
  }),
  phim__info: {
    display: 'flex',
  },
  phim__img: {
    width: 60,
    height: 60,
    objectFit: "cover",
  },
  phim__text: {
    paddingLeft: "15px", paddingTop: "6px",
    width: "calc(100% - 50px)",
  },
  phim__text_name: {
    fontWeight: 700,
    color:"#800000",
    textTransform: "capitalize",
  },

});
export default useStyles