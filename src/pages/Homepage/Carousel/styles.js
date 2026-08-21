import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  carousel: {
    position: "relative",
    zIndex: 3,
    paddingTop: 0,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  slideWrapper: {
    padding: "0 10px",
    boxSizing: "border-box",
    outline: "none",
  },
  itemSlider: {
    position: "relative",
    height: 380,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 14px rgba(0, 0, 0, 0.08)",
    cursor: "pointer",
    [theme.breakpoints.down("md")]: {
      height: 290,
    },
    [theme.breakpoints.down("xs")]: {
      height: 190,
    },
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 8,
    display: "block",
  },
  backgroundLinear: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 8,
    background: "linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 35%)",
    top: 0,
    left: 0,
    cursor: "pointer",
  },
  arrowContainer: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    width: 42,
    height: 42,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    borderRadius: "50%",
    display: "flex !important",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.25s ease",
    "&:hover": {
      backgroundColor: "#f26b38",
      transform: "translateY(-50%) scale(1.1)",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none !important",
    },
  },
  arrowPrev: {
    left: 20,
  },
  arrowNext: {
    right: 20,
  },
  arrowIcon: {
    color: "#ffffff",
    fontSize: 20,
  },
  bookingWrapper: {
    position: "relative",
    zIndex: 10,
    maxWidth: 1160,
    width: "92%",
    margin: "-48px auto 30px auto",
  },
  tabsHeader: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    marginBottom: 0,
  },
  tabBtn: {
    padding: "8px 26px",
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "rgba(240, 242, 245, 0.95)",
    color: "#4b5563",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
    "&:hover": {
      backgroundColor: "#ffffff",
      color: "#f26b38",
    },
    "&:focus": {
      outline: "none",
    },
  },
  tabBtnActive: {
    backgroundColor: "#ffffff !important",
    color: "#f26b38 !important",
    fontWeight: "700",
    boxShadow: "0 -4px 12px rgba(0,0,0,0.06)",
  },
  tabContent: {
    width: "100%",
  },
}));

export default useStyles;