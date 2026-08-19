import React from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtnGroup,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "reactstrap";
import billsApi from './../../api/billsApi'
import Swal from "sweetalert2";

export default function PaymentUser() {
  const history = useHistory();

    const params = useParams()
    const handlerThanhToan =() =>{
        console.log(params.maBill);
        handlerComfirm()
    }

    const handlerComfirm = () =>{
        Swal.fire({
            title: 'Bạn có chắc muốn thanh toán?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            customClass: {
              actions: 'my-actions',
              cancelButton: 'order-1 right-gap',
              confirmButton: 'order-2',
              denyButton: 'order-3',
            }
          }).then((result) => {
            if (result.isConfirmed) {
                billsApi.postThanhToan(params.maBill)
                .then((res)=>{
                    console.log(res);
                    Swal.fire('Đã thanh toán!', '', 'success')
                    history.push("/");
                })
                .catch((err) =>{
                    console.log(err);
                    Swal.fire('Đã quá hạn thanh toán!', '', 'info')
                    history.push("/")

                })
            } else if (result.isDenied) {
              Swal.fire('Thanh toán sau!', '', 'info')
                history.push("/");
            }
          })
    }
  return (
    <MDBContainer className="py-5" style={{backgroundColor:"white"}}>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div className="d-flex flex-row align-items-center">
          <h4 className="text-uppercase mt-1">WORLD CINEMA</h4>
          <span className="ms-2 me-3">Pay</span>
        </div>
      </div>
      <MDBRow>
        <MDBCol md="7" lg="7" xl="6" className="mb-4 mb-md-0">
          <h5 className="mb-0 text-success">{`${params.total.toLocaleString("vi-VI")} đ`}</h5>
          <h5 className="mb-3">Vui lòng điền thông tin thanh toán</h5>
          <div>
            <p>
              Insurance claim and all neccessary dependencies will be submitted
              to your insurer for the covered portion of this order.
            </p>
            <div class="d-flex flex-column mb-3">
              <MDBBtnGroup vertical aria-label="Vertical button group">
                <label className="btn btn-outline-primary btn-lg" for="option1">
                  <div className="d-flex justify-content-between">
                    <span>VISA </span>
                    <span>****************** 5436</span>
                  </div>
                </label>
              </MDBBtnGroup>
            </div>
            <Button color="success" size="lg" block onClick={handlerThanhToan}>
              Thanh toán
            </Button>
          </div>
        </MDBCol>
        <MDBCol md="5" lg="4" xl="4" offsetLg="1" offsetXl="2">
          <div className="p-3" style={{ backgroundColor: "#eee" }}>
            {/* <span className="fw-bold">Order Recap</span>
            <div className="d-flex justify-content-between mt-2">
              <span>contracted Price</span> <span>$186.86</span>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <span>Amount Deductible</span> <span>$0.0</span>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <span>Coinsurance(0%)</span> <span>+ $0.0</span>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <span>Copayment </span> <span>+ 40.00</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mt-2">
              <span className="lh-sm">
                Total Deductible,
                <br />
                Coinsurance and copay
              </span>
              <span>$40.00</span>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <span className="lh-sm">
                Maximum out-of-pocket <br />
                on insurance policy
              </span>
              <span>$40.00</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mt-2">
              <span>Insurance Responsibility </span> <span>$71.76</span>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <span>Patient Balance </span> <span>$13.24</span>
            </div>
            <hr /> */}
            <div className="d-flex justify-content-between mt-2">
              <span>Tổng cộng </span> <span class="text-success">{`${params.total.toLocaleString("vi-VI")} đ`}</span>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

