import { makeStyles } from "@material-ui/core";
import { customScrollbar } from "../../../../styles/materialUi";

const useStyle = makeStyles({
  // Search bar
  search: {
    display: "flex",
    width: "100%",
    maxWidth: "100%",
    height: "56px",
    position: "relative",
    zIndex: 10,
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)",
    alignItems: "center",
    padding: "0",
    overflow: "hidden",
    margin: "0 auto",
  },
  itemFirst: {
    padding: "0 14px",
    flex: "28%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    "&:after": {
      content: "''",
      position: "absolute",
      right: "0",
      height: "50%",
      top: "50%",
      transform: "translateY(-50%)",
      borderRight: "1px solid #eee",
    },
    "& > div": {
      width: "100% !important",
      display: "flex",
      alignItems: "center",
    },
  },
  textField: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    "& .MuiInputBase-root": {
      display: "flex",
      alignItems: "center",
      width: "100%",
      marginTop: 0,
      padding: "0 !important",
      "& > input": {
        padding: "0 !important",
        paddingLeft: "4px !important",
        fontSize: 14,
        fontWeight: 500,
        color: "#444",
        height: "24px",
        lineHeight: "24px",
      },
      "&::placeholder": {
        color: "#888",
        opacity: 1,
      },
      "&:before": {
        borderBottom: "none !important",
      },
      "&:after": {
        borderBottom: "none !important",
      },
      "& > div:hover:not(.Mui-disabled):before": {
        borderBottom: "none !important",
      },
    },
  },
  popupIndicator: {
    "& > span": {
      marginTop: 0,
      "& > svg": {
        color: "rgba(0, 0, 0, 0.35)",
        fontSize: "18px !important",
      },
    },
  },
  listbox: {
    ...customScrollbar,
    "& .MuiAutocomplete-option[aria-selected=\"true\"]": {
      backgroundColor: "#e87722",
      color: "#fff",
    },
  },
  paper: {
    boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.15)",
    borderRadius: "6px",
  },
  noOptions: {
    color: "#666",
    fontSize: 14,
    padding: "10px 16px",
  },
  search__item: {
    color: "black",
    padding: "0 14px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    "& .MuiInput-root": {
      width: "100%",
      display: "flex",
      alignItems: "center",
      "&:before": {
        borderBottom: "none !important",
      },
      "&:hover:not(.Mui-disabled):before": {
        borderBottom: "none !important",
      },
      "&:after": {
        borderBottom: "none !important",
      },
    },
    "& .MuiSelect-select": {
      color: "#444",
      fontSize: 14,
      fontWeight: 500,
      padding: "0 !important",
      display: "flex",
      alignItems: "center",
      height: "24px",
      lineHeight: "24px",
      "&:focus": {
        backgroundColor: "transparent",
      },
    },
    "& .MuiSelect-icon": {
      fontSize: 18,
      color: "rgba(0, 0, 0, 0.35)",
      top: "calc(50% - 9px)",
      right: "0",
    },
    "&:after": {
      content: "''",
      position: "absolute",
      right: "0",
      height: "50%",
      top: "50%",
      transform: "translateY(-50%)",
      borderRight: "1px solid #eee",
    },
  },
  "search__item--first": {
    flex: "28%",
  },
  "search__item--next": {
    flex: "18%",
    height: "100%",
  },
  // Popup menu
  menu: { maxHeight: 300, ...customScrollbar, borderRadius: "6px" },
  menu__item: {
    width: "100%",
    minHeight: "auto",
    display: "block",
    padding: "8px 16px",
    fontSize: "14px",
    color: "#333",
    "&:focus": {
      backgroundColor: "transparent",
    },
    "& li ~ li": {
      fontSize: 12,
      color: "#888",
    },
    "&:hover": {
      backgroundColor: "#e87722",
      color: "#fff",
      "& li ~ li": {
        color: "#fff",
      },
    },
  },
  "menu__item--selected": {
    backgroundColor: "#e87722 !important",
    color: "#fff",
    "& li ~ li": {
      color: "#fff",
    },
  },
  // Button
  btn: {
    backgroundColor: "#f26b38 !important",
    color: "#fff !important",
    fontWeight: "700",
    fontSize: "14.5px",
    textTransform: "none",
    width: "100%",
    height: "100%",
    borderRadius: "0 6px 6px 0",
    padding: "0 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#d65a28 !important",
    },
    "&:focus": {
      outline: "none",
    },
  },
  btnDisabled: {
    backgroundColor: "#f9a466 !important",
    color: "#ffffff !important",
    border: "none",
    fontWeight: "700",
    fontSize: "14.5px",
    textTransform: "none",
    width: "100%",
    height: "100%",
    borderRadius: "0 6px 6px 0",
    padding: "0 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "not-allowed",
  },
});

export default useStyle;