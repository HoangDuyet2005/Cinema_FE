import React, { useEffect, useState } from "react";
import Chart, {
  CommonSeriesSettings,
  Series,
  Pane,
  ValueAxis,
  Export,
  Legend,
  Label,
  Title,
  Grid,
} from 'devextreme-react/chart';
import billsApi from "../../../api/billsApi"
import { Paper } from "@mui/material";


export default function ChartSideBySide() {
  const [data, setData] = useState({
  })
  
  useEffect(() => {
    billsApi.getBillSideBySide()
    .then((res) =>{
      setData(
        res?.data
      )
      console.log("Side:",data);
    })
    .catch((err) =>{
      console.log(err);
    })
  },[])

  return (
    <>
        <h5 style={{textAlign:"center", color: "blue", textTransform:"uppercase", fontWeight:"bold", marginTop:"1rem"}}>giao dịch hằng ngày</h5>
        <React.Fragment>
      <Paper>
      <Chart
        id="chart"
        dataSource={data?.dayTransactionReports}
        defaultPane="bottomPane"
      >
        <CommonSeriesSettings argumentField="dateTran" />
        {/* <Series
          pane="topPane"
          color="#b0daff"
          type="rangeArea"
          rangeValue1Field="transactionCount"
          rangeValue2Field="ticketAmount"
          name="Monthly Temperature Ranges, °C"
        /> */}
        <Series
          pane="topPane"
          valueField="ticketAmount"
          name="Số vé bán ra/Ngày"
        >
          <Label
            visible={true}
            customizeText={temperatureCustomizeText}
          />
        </Series>
        <Series
          type="bar"
          valueField="incomeAmount"
          name="VND/Ngày"
        >
          <Label
            visible={true}
            customizeText={precipitationCustomizeText}
          />
        </Series>

        <Pane name="topPane" />
        <Pane name="bottomPane" />

        <ValueAxis pane="bottomPane">
          <Grid visible={true} />
          <Title text="Doanh thu" />
        </ValueAxis>
        <ValueAxis pane="topPane">
          <Grid visible={true} />
          <Title text="Số vé bán ra" />
        </ValueAxis>

        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
        />
        <Export enabled={true} />
      </Chart>
      </Paper>
    </React.Fragment>
    </>
    
  );
}
function temperatureCustomizeText({ valueText }) {
  return `${valueText} Vé`;
}

function precipitationCustomizeText({ valueText }) {
  const formattedValue = Number(valueText).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return `${formattedValue}`;
}