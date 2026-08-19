import React, { useEffect, useState } from "react";
// import Link from "@material-ui/core/Link";
// import { makeStyles } from "@material-ui/core/styles";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import Title from "./Title";
import billsApi from "./../../../api/billsApi"

// import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

// Generate Order Data
// function createData(id, date, name, shipTo, paymentMethod, amount) {
//   return { id, date, name, shipTo, paymentMethod, amount };
// }

const columns = [
  { field: 'id', headerName: 'ID', width: 50, type: 'number' },
  { field: 'name', headerName: 'Tên', width: 150 },
  { field: 'username', headerName: 'Username', width: 150 },
  { field: 'email', headerName: 'Email', width: 200, align: "left"},
  { field: 'transactionCount', headerName: 'Số lượng giao dịch đã thanh toán', width: 230, type: 'number', align: 'center' },
  // {
  //   field: 'age',
  //   headerName: 'Age',
  //   type: 'number',
  //   width: 90,
  // },
  { field: 'ticketAmount', headerName: 'Số vé đã đặt', width: 130, type: 'number', align: 'center' },
  {
    // {`${data2?.totalInce.toLocaleString("vi-VI")} VND`}
    field: 'incomeAmount',
    headerName: 'Tiêu dùng(vnđ)',
    description: 'This column has a value getter and is not sortable.',
    width: 130,
    type: 'number',
    // valueGetter: (params) =>
    //   `${params.row.name || ''} ${params.row.incomeAmount || ''}`,
  },
];



// const rows = [
//   createData(
//     0,
//     "16 Mar, 2019",
//     "Elvis Presley",
//     "Tupelo, MS",
//     "VISA ⠀•••• 3719",
//     312.44
//   ),
//   createData(
//     1,
//     "16 Mar, 2019",
//     "Paul McCartney",
//     "London, UK",
//     "VISA ⠀•••• 2574",
//     866.99
//   ),
//   createData(
//     2,
//     "16 Mar, 2019",
//     "Tom Scholz",
//     "Boston, MA",
//     "MC ⠀•••• 1253",
//     100.81
//   ),
//   createData(
//     3,
//     "16 Mar, 2019",
//     "Michael Jackson",
//     "Gary, IN",
//     "AMEX ⠀•••• 2000",
//     654.39
//   ),
//   createData(
//     4,
//     "15 Mar, 2019",
//     "Bruce Springsteen",
//     "Long Branch, NJ",
//     "VISA ⠀•••• 5919",
//     212.79
//   )
// ];

// const useStyles = makeStyles(theme => ({
//   seeMore: {
//     marginTop: theme.spacing(3)
//   }
// }));

export default function Orders() {

  const [data3, setData3] = useState({
  })

  useEffect(() => {
    billsApi.getBillDashBoardSortAZ()
    .then((res) =>{
      console.log("Êhhehehe",res);
      setData3(
        res?.data
      )
    })
    .catch((err) =>{
      console.log(err);
    })
  },[])

  const rows = data3

  // const classes = useStyles();
  // return (
  //   <React.Fragment>
  //     <Title>Thống kê khách hàng thanh toán nhiều nhất hệ thống</Title>
  //     <Table size="small">
  //       <TableHead>
  //         <TableRow>
  //           <TableCell>Khách hàng</TableCell>
  //           <TableCell>Email</TableCell>
  //           <TableCell>Số lượng giao dịch hiện tại</TableCell>
  //           <TableCell>Tổng số tiền</TableCell>
  //           <TableCell>Tổng số vé</TableCell>
  //           <TableCell align="right">VISA</TableCell>
  //         </TableRow>
  //       </TableHead>
  //       <TableBody>
  //         {data3?.map(row => (
  //           <TableRow key={row?.id}>
  //             <TableCell>{row?.name}</TableCell>
  //             <TableCell>{row?.email}</TableCell>
  //             <TableCell>{row?.transactionCount}</TableCell>
  //             <TableCell>{row?.incomeAmount}</TableCell>
  //             <TableCell>{row?.ticketAmount}</TableCell>
  //             <TableCell align="right">"VISA ⠀•••• 1283"</TableCell>
  //           </TableRow>
  //         ))}
  //       </TableBody>
  //     </Table>
  //   </React.Fragment>
  // );
  return (
    <>
      <h5 style={{textAlign:"center", color: "blue", textTransform:"uppercase", fontWeight:"bold", marginTop:"1rem"}}>Khách hàng thân thiết</h5>
      <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
    </>

  );
}
