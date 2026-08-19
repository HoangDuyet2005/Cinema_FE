import { makeStyles } from "@material-ui/core"

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    backgroundColor: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  spaceBetween: {
    justifyContent: 'space-between',
    height: 100,
  },
  logo: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    color:"#034ea2", 
    fontWeight:"800",
    [theme.breakpoints.down(899)]: {
      fontSize:"11px",
      fontWeight:"600",
    },
  },
  linkTobody: {
    display: props => props.isDesktop ? "block" : "none",
    position: "absolute",
    // top: "50%",
    left: "50%",
transform: "translateX(-50%)",
    // transform: "translate(-50%, -50%)",
    [theme.breakpoints.down(1040)]: {
      left: "25%",
      fontSize:"13px",
    },
    [theme.breakpoints.down(899)]: {
      left: "25%",
      fontSize:"12px",
    },
    [theme.breakpoints.down(773)]: {
      left: "25%",
    },
  },
  link: {
    cursor: "pointer",
    textDecoration: "none",
    color: "#333",
    fontWeight: 600,
    fontSize: "15px",
    paddingLeft: 18,
    paddingRight: 18,
    width: "auto",
    "&:hover": {
      textDecoration: "none",
      backgroundColor: "transparent",
      color: "#e87722",
      transition: "all .2s",
    }
  },
  user: {
    display: props => props.isDesktop ? "block" : "none",
  },
  auth: {
    display: "flex",
    color: props => props.isDesktop ? "#9b9b9b" : "#000",
  },
  itemAuth: {
    paddingLeft: 18,
    paddingRight: 18,
    minWidth: "fit-content",
    "&:hover": {
      backgroundColor: "transparent",
      "& .MuiTypography-root": {
        color: "#e87722",
    },
      "& .MuiListItemIcon-root": {
        color: "#e87722",
    }
    },
    "& .MuiTypography-root": {
      transition: "all .2s",
    },
    "& .MuiListItemIcon-root": {
      transition: "all .2s",
    },
  },
  hover: {
    "&:hover": {
      color: "#e87722",
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
  divide: {
    fontWeight: 500,
    "&::after": {
      content: "''",
      position: "absolute",
      right: "0",
      height: "30px",
      top: "50%",
      transform: "translateY(-50%)",
      borderRight: props => props.isDesktop ? "1px solid #e9e9e9" : "none",
    }
  },
  icon: {
    minWidth: 41,
    color: "#e87722",
    },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  listItem: {
    "&:hover > a": {
      color: "#e87722",
    },
    "&:hover > div": {
      color: "#e87722",
    },
    "&:hover > span": {
      color: "#e87722",
    },
  },
  menuIcon: {
    display: props => (props.isDesktop || props.openDrawer) ? "none" : "block",
    color:'#034ea2',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
  },
  itemMenu: {
    display: "block",
    padding: 10,
    fontWeight: 300,
    width: "100%",
    cursor: "pointer",
    fontSize: 14,
    "&:hover": {
      color: "#fff",
      backgroundColor: "#e87722",
    },
  },
  username: {
    "& > span": {
      fontWeight: 500
    }
  }

}))
export default useStyles