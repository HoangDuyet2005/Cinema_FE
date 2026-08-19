import React, { useEffect, useState } from "react";

import Chart, {
    Series,
    Annotation,
    Legend,
    CommonAnnotationSettings,
  } from 'devextreme-react/chart';
  
  import AnnotationTemplate from './AnnotationTemplate.js';

    import billsApi from "./../../../api/billsApi"


export default function Ranking() {

  const [data4, setData4] = useState([])

  useEffect(() => {
    billsApi.getBillDashBoardSortAZ()
    .then((res) =>{
    //   console.log("Ranking",res);
      setData4(
        res?.data
      )
    })
    .catch((err) =>{
      console.log(err);
    })
  },[])

//   console.log(data4);
  return (
    <>
      <h5 style={{textAlign:"center", color: "blue", textTransform:"uppercase", fontWeight:"bold", marginTop:"1rem"}}>Top 5 người dùng chi tiêu nhiều nhất</h5>
      <Chart
        id="chart"
        dataSource={data4.slice(0,5)}
        palette={['#051685']}
        // title="Top 5 khách hàng chi tiêu nhiều nhất"
      >
        <Series
          type="bar"
          argumentField="name"
          valueField="incomeAmount"
          name="Income Amount"
        >
        </Series>
        <CommonAnnotationSettings
          type="custom"
          series="Income Amount"
          render={AnnotationTemplate}
          allowDragging={true}
        >
        </CommonAnnotationSettings>
        {data4?.slice(0,5)?.map((data) => (
          <Annotation
            argument={data?.name}
            key={data?.id}
            data={data}
          >
          </Annotation>
        ))}
        <Legend visible={false}></Legend>
      </Chart>
    </>

  );
}
