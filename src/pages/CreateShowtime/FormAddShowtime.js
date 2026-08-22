import React, { useEffect, useState } from "react";
import { Form, Select, DatePicker, Button, InputNumber, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { createShowtime, resetCreateShowtime } from "../../reducers/actions/BookTicket";
import theatersApi from "../../api/theatersApi";

export default function FormAddShowtime({ onCancel, onRefresh }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  
  const { movieList2 } = useSelector((state) => state.movieReducer);
  const { loadingCreateShowtime, successCreateShowtime, errorCreateShowtime } = useSelector((state) => state.bookTicketReducer);

  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    if (successCreateShowtime) {
      message.success("Tạo lịch chiếu thành công!");
      dispatch(resetCreateShowtime());
      form.resetFields();
      if (onRefresh) onRefresh();
      if (onCancel) onCancel();
    }
    if (errorCreateShowtime) {
      message.error(typeof errorCreateShowtime === 'string' ? errorCreateShowtime : "Tạo lịch chiếu thất bại!");
      dispatch(resetCreateShowtime());
    }
  }, [successCreateShowtime, errorCreateShowtime, dispatch, form, onCancel, onRefresh]);

  const handleMovieChange = (movieId) => {
    form.setFieldsValue({ branchId: undefined, roomId: undefined });
    setLoadingBranches(true);
    setRooms([]);
    theatersApi.getThongTinHeThongRap(movieId)
      .then((result) => {
        const branchData = result?.data?.data?.content || result?.data?.data || result?.data || [];
        setBranches(Array.isArray(branchData) ? branchData : []);
      })
      .catch((error) => {
        console.error("Error fetching branches:", error);
        message.error("Lỗi khi tải danh sách rạp!");
      })
      .finally(() => {
        setLoadingBranches(false);
      });
  };

  const handleBranchChange = (branchId) => {
    form.setFieldsValue({ roomId: undefined });
    setLoadingRooms(true);
    theatersApi.getRoomsByBranch(branchId)
      .then((result) => {
        const roomData = result?.data?.data || result?.data || [];
        setRooms(Array.isArray(roomData) ? roomData : []);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
        message.error("Lỗi khi tải danh sách phòng!");
      })
      .finally(() => {
        setLoadingRooms(false);
      });
  };

  const onFinish = (values) => {
    const showtimeObj = values.showtime.toDate();
    const startDate = `${showtimeObj.getFullYear()}-${(showtimeObj.getMonth() + 1).toString().padStart(2, '0')}-${showtimeObj.getDate().toString().padStart(2, '0')}`;
    const startTime = `${showtimeObj.getHours().toString().padStart(2, '0')}:${showtimeObj.getMinutes().toString().padStart(2, '0')}`;

    const payload = {
      movieId: values.movieId,
      branchId: values.branchId,
      price: values.price,
      roomId: values.roomId,
      startDate: startDate,
      startTime: startTime,
    };

    dispatch(createShowtime(payload));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        price: 70000
      }}
    >
      <Form.Item
        name="movieId"
        label="Phim"
        rules={[{ required: true, message: "Vui lòng chọn phim!" }]}
      >
        <Select
          showSearch
          placeholder="Chọn phim"
          optionFilterProp="children"
          onChange={handleMovieChange}
          filterOption={(input, option) =>
            (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
          }
        >
          {movieList2?.data?.map((phim) => (
            <Select.Option key={phim.id} value={phim.id}>
              {phim.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="branchId"
        label="Chi nhánh Rạp"
        rules={[{ required: true, message: "Vui lòng chọn chi nhánh rạp!" }]}
      >
        <Select
          showSearch
          placeholder={loadingBranches ? "Đang tải rạp..." : "Chọn chi nhánh rạp"}
          loading={loadingBranches}
          optionFilterProp="children"
          onChange={handleBranchChange}
        >
          {branches.map((branch) => (
            <Select.Option key={branch.id} value={branch.id}>
              {branch.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <div style={{ display: 'flex', gap: '16px' }}>
        <Form.Item
          name="showtime"
          label="Ngày & Giờ chiếu"
          rules={[{ required: true, message: "Vui lòng chọn thời gian chiếu!" }]}
          style={{ flex: 1 }}
        >
          <DatePicker 
            showTime 
            format="DD/MM/YYYY HH:mm" 
            placeholder="Chọn ngày và giờ"
            style={{ width: '100%' }} 
          />
        </Form.Item>

        <Form.Item
          name="roomId"
          label="Phòng chiếu"
          rules={[{ required: true, message: "Vui lòng chọn phòng!" }]}
          style={{ flex: 1 }}
        >
          <Select 
            placeholder={loadingRooms ? "Đang tải phòng..." : "Chọn phòng"}
            loading={loadingRooms}
          >
            {rooms.map((room) => (
              <Select.Option key={room.id} value={room.id}>
                {room.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá vé (VNĐ)"
          rules={[{ required: true, message: "Vui lòng nhập giá vé!" }]}
          style={{ flex: 1 }}
        >
          <InputNumber 
            style={{ width: '100%' }} 
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            min={0} 
            step={5000}
          />
        </Form.Item>
      </div>

      <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Hủy
        </Button>
        <Button type="primary" htmlType="submit" loading={loadingCreateShowtime}>
          Thêm lịch chiếu
        </Button>
      </Form.Item>
    </Form>
  );
}
