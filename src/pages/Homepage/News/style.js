import { makeStyles } from "@material-ui/core"

const useStyle = makeStyles(theme => ({
  root: {
    padding: "30px 0 10px 0",
    width: "100%",
  },

  newsCard: {
    display: "block",
    textDecoration: "none",
    color: "#333",
    "&:hover": {
      textDecoration: "none",
      "& $fullImg": {
        transform: "translateY(-4px) scale(1.02)",
      },
      "& $newsTitle": {
        color: "#034ea2",
      },
    },
  },

  imgWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  },

  fullImg: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    borderRadius: 8,
    transition: "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },

  newsTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#222",
    lineHeight: 1.4,
    margin: "8px 0 0 0",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    transition: "color 0.25s ease",
  },

  repons: {
    padding: "0 10px",
    flex: "0 0 50%",
    maxWidth: "50%",
    [theme.breakpoints.down(579)]: {
      flex: "0 0 100%",
      maxWidth: "100%",
      padding: 0,
    },
  },
}))
export default useStyle
