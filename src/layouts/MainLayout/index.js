import React from "react";
import ScrollToTop from "react-scroll-up";
import { makeStyles } from "@material-ui/core";
import Header from "./Header";
import Footer from "./../../components/Footer/Footer";
import NavigationIcon from '@mui/icons-material/Navigation';

const useStyles = makeStyles((theme) => ({
  root: { display: "flex", flexDirection: "column", minHeight: "100vh" }, main: { flex: 1 }, top: { marginTop: 100, [theme.breakpoints.down("xs")]: { marginTop: 80 } },
  styleScrollToTop: {
    position: "absolute",
    bottom: 30,
    right: 10,
    transitionTimingFunction: "linear",
    width: 50,
    transform: "rotate(180deg)",
    zIndex: 5000,
  },
}));
export default function MainLayout(props) {
  const classes = useStyles();

  return ( <div className={classes.root}> <Header /> <div className={classes.top}></div> <main className={classes.main}> {props.children} </main> <Footer />
      <ScrollToTop showUnder={160}>
        <NavigationIcon 
        style={{color:"rgb(250, 82, 56)", width:"40px", height:"40px", 
         borderRadius:"50%", backgroundColor:"white",
         position: "fixed",
         bottom: "30px",
         left: "30px", // Thay đổi giá trị right thành left
        }}
         />
      </ScrollToTop>
    </div>
  );
}