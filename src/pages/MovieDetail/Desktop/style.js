import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  desktop: {
    backgroundColor: "rgb(10, 32, 41)",
  },
  top: {
    width: "100%",
    height: "41vw",
    position: "relative",
  },

  bannerBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundImage: props => `url(${props.bannerImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(15px)",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: "linear-gradient(to top, rgb(10, 32, 41), transparent 100%)"
  },
  topInfo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "100%",
    height: 320,
    maxWidth: 870,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#e9e9e9",
  },
  imgTrailer: {
    width: "25%",
    height: "100%",
    position: "relative",
    backgroundImage: props => `url(${props.bannerImg})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    '&:hover > div ': { opacity: 1 },
  },
  img: {
    width: "100%",
    borderRadius: 4,
  },
  shortInfo: {
    width: "59%",
    padding: "0px 15px"
  },
  movieName: {
    fontSize: 24,
    fontWeight: "bold",
    margin: "6px 0",
  },
  c18: {
    marginRight: "6px",
    verticalAlign: "13%",
    backgroundColor: "#fb4226",
    color: "#fff",
    fontSize: "16px",
    borderRadius: "4px",
    padding: "0 5px",
    display: "inline-block",
    minWidth: "33px"
  },
  ratingTrigger: {
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    margin: "4px 0 8px 0",
    padding: "2px 0",
    background: "none",
    border: "none",
    transition: "transform 0.15s ease",
    "&:hover": {
      transform: "scale(1.03)",
    },
  },
  starIcon: {
    color: "#f58020",
    fontSize: "22px",
    marginRight: "4px",
  },
  ratingScore: {
    color: "#f58020",
    fontSize: "18px",
    fontWeight: "700",
    marginRight: "5px",
  },
  ratingVotes: {
    color: "#718096",
    fontSize: "14px",
    fontWeight: "400",
  },
  btnMuaVe: {
    fontSize: "16px",
    borderRadius: "4px",
    background: "0 0",
    padding: "11px 25px",
    transition: "all .2s",
    marginTop: "12px",
    marginBottom: "10px",
    backgroundColor: "#fb4226",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#b42a14",
    }
  },
  withOutImage: {
    borderRadius: 4,
    width: "100%", height: "100%",
    animationName: `$myEffect`,
    animationDuration: "3s",
    animationTimingFunction: `${theme.transitions.easing.easeInOut}`,
    animationIterationCount: "infinite",
    background: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
    backgroundSize: "400% 400%",
  },
  "@keyframes myEffect": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
}))
export default useStyles