// lấy danh sách vé và đặt vé
// import ticketApi from '../../api/ticketApi';
import usersApi from '../../api/usersApi';
import { GET_ALLTICKET_FAIL, GET_ALLTICKET_REQUEST, GET_ALLTICKET_SUCCESS, GET_TICKET_FAIL, GET_TICKET_REQUEST, GET_TICKET_SUCCESS, GET_TICKETUSER_FAIL, GET_TICKETUSER_REQUEST, GET_TICKETUSER_SUCCESS } from "../constants/Ticket";

export const getAllTicket = (userId) => {
  return (dispatch) => {
    console.log(userId);
    dispatch({
      type: GET_TICKET_REQUEST
    })
    usersApi.getTicket(userId)
      .then(result => {
       console.log("data ticket: ", result?.data?.data);
        dispatch({
          type: GET_TICKET_SUCCESS,
          payload: { data: result?.data }
        })
      })
      .catch(
        error => {
          dispatch({
            type: GET_TICKET_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message, }
          })
        }
      )
  }
}

export const getAllTicketByUserId = (userId) => {
  return (dispatch) => {
    console.log(userId);
    dispatch({
      type: GET_TICKETUSER_REQUEST
    })
    usersApi.getTicketUser(userId)
      .then(result => {
       console.log("User ticket: ", result?.data?.data);
        dispatch({
          type: GET_TICKETUSER_SUCCESS,
          payload: { data: result?.data?.data }
        })
      })
      .catch(
        error => {
          dispatch({
            type: GET_TICKETUSER_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message, }
          })
        }
      )
  }
}

export const getAllTicketByAdminStaff = () => {
  return (dispatch) => {
    dispatch({
      type: GET_ALLTICKET_REQUEST
    })
    usersApi.getTicketByAdminStaff()
      .then(result => {
      //  console.log("all ticket API: ", result);
        dispatch({
          type: GET_ALLTICKET_SUCCESS,
          payload: { data: result?.data?.data?.content}
        })
      })
      .catch(
        error => {
          dispatch({
            type: GET_ALLTICKET_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message, }
          })
        }
      )
  }
}