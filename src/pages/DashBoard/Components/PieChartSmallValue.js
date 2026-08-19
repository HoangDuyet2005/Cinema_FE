import React, { useEffect, useState } from "react";

import PieChart, {
  Series,
  Label,
  Connector,
  SmallValuesGrouping,
  Legend,
  Export,
} from 'devextreme-react/pie-chart';
import billsApi from "../../../api/billsApi"


export default function PieChartSmallValue() {

  const [data, setData] = useState({
    tiLe:null,
  })

  const [count, setCount] = useState({
    soLuongVe:"",
    soLuongVeBanRa:"",
    ngayBan:"",
  })
  
  useEffect(() => {
    billsApi.getBillPieChart()
    .then((res) =>{
      setData(
        res?.data?.dayTransactionReports
      )
    console.log("Pheheheie:",data);

    })
    .catch((err) =>{
      console.log(err);
    })
  },[])
  console.log(data);

  // const seriesValue = data.map(item => item.transactionCount / item.ticketAmount);
  // console.log(seriesValue);

  return (
    <React.Fragment>
        <PieChart
        id="pie"
        dataSource={data}
        palette="Bright"
        title="Tỉ lệ giao dịch"
      >
        <Series
          argumentField="dateTran"
          valueField={data => data.transactionCount/data.ticketAmount}
        >
          <Label visible={true} customizeText={formatLabel} format="fixedPoint">
            <Connector visible={true} width={1} />
          </Label>
          <SmallValuesGrouping threshold={4.5} mode="smallValueThreshold" />
        </Series>
        <Legend horizontalAlignment="center" verticalAlignment="bottom" />
        <Export enabled={true} />
      </PieChart>
    </React.Fragment>
  );
}

function formatLabel(arg) {
  return `${arg.argumentText}: ${arg.valueText}%`;
}
