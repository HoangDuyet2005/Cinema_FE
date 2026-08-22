import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  bookTicked: {
    display: "flex",
    gap: "24px",
    alignItems: "flex-start",
    width: "100%",
  },
  left: {
    flex: "1 1 0%",
    minWidth: 0, // Ngăn chặn flex child bị tràn đè cột phải
  },
  right: {
    flex: "0 0 340px",
    width: "340px",
    minWidth: "340px",
    position: "sticky",
    top: "20px",
  },
});

export default useStyles;