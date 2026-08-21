import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
  addbg: {
    backgroundImage: props => `url(${props.bg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    paddingTop: "148%",
    borderRadius: 8,
  },
})

export default useStyles