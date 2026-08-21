import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 10px",
  },
  Arrow: {
    position: "absolute",
    top: "48%",
    transform: "translateY(-50%)",
    [theme.breakpoints.down(960)]: {
      display: "none",
    },
    zIndex: 2,
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    color: "#475569 !important",
    cursor: "pointer",
    padding: "10px",
    transition: "all .2s ease",
    '&:hover': {
      backgroundColor: "#ffffff",
      color: "#f58020 !important",
      transform: "translateY(-50%) scale(1.08)",
    }
  },
}))

export default useStyles