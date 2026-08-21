import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
  mobile: {
    color: "#e9e9e9",
    backgroundColor: "rgb(10, 32, 41)",
  },
  info: {
    width: "100%",
    height: "41vw",
    position: "relative",
  },

  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundImage: props => `url(${props.bannerImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: "linear-gradient(to top, rgb(10, 32, 41), transparent 100%)"
  },
  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: props => props.openVideo ? "block" : "none"
  },
    ratingTrigger: {
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    margin: "6px 0 10px 0",
    padding: "4px 8px",
    borderRadius: "6px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
  },
  starIcon: {
    color: "#f58020",
    fontSize: "18px",
    marginRight: "4px",
  },
  ratingScore: {
    color: "#f58020",
    fontSize: "15px",
    fontWeight: "700",
    marginRight: "6px",
  },
  ratingVotes: {
    color: "#cbd5e1",
    fontSize: "12.5px",
    fontWeight: "500",
  },
  shortInfo: {
    width: "59%",
    padding: "0px 15px"
  },
  movieName: {
    fontSize: 24,
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
    textAlign: "center",
    minWidth: "33px"
  },
  btnPlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: 80,
    height: 80,

  },

})
export default useStyles