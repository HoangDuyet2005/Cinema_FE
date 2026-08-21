import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  root: {
    padding: "35px 0 25px 0",
    width: "100%",
  },

  sliderWrapper: {
    position: "relative",
    width: "100%",

    "& .slick-list": {
      margin: "0 -10px",
    },

    "& .slick-slide > div": {
      padding: "0 10px",
    },
  },

  slideItem: {
    outline: "none",
  },

  newsCard: {
    display: "block",
    textDecoration: "none",
    color: "#333",
    outline: "none",
    transition: "transform 0.25s ease",

    "&:hover": {
      textDecoration: "none",
      "& $fullImg": {
        transform: "scale(1.04)",
      },
      "& $newsTitle": {
        color: "#034ea2",
      },
    },
  },

  imgWrapper: {
    width: "100%",
    aspectRatio: "16 / 10",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
    backgroundColor: "#f1f5f9",
  },

  fullImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 8,
    transition: "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },

  newsTitle: {
    fontSize: 14.5,
    fontWeight: 700,
    color: "#1e293b",
    lineHeight: 1.45,
    margin: "12px 0 0 0",
    textAlign: "center",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    height: 42,
    transition: "color 0.2s ease",
  },
}));

export default useStyle;