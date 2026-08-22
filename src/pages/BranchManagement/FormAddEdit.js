import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import branchApi from "../../api/branchApi";

export default function FormAddEdit({ selectedBranch, onUpdate, onAdd }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedBranch?.id) {
      form.setFieldsValue({
        name: selectedBranch.name,
        city: selectedBranch.city,
        address: selectedBranch.address,
        phoneNo: selectedBranch.phoneNo,
        imgURL: selectedBranch.imgURL,
      });
    } else {
      form.resetFields();
    }
  }, [selectedBranch, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (selectedBranch?.id) {
        // Cập nhật
        const response = await branchApi.updateBranch(selectedBranch.id, values);
        if (response.status === 200) {
          message.success("Cập nhật chi nhánh thành công!");
          onUpdate(response.data.data);
        }
      } else {
        // Thêm mới
        const response = await branchApi.addBranch(values);
        if (response.status === 201) {
          message.success("Thêm chi nhánh mới thành công!");
          onAdd(response.data.data);
        }
      }
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="Tên chi nhánh"
        rules={[{ required: true, message: "Vui lòng nhập tên chi nhánh!" }]}
      >
        <Input placeholder="VD: CGV Vincom..." />
      </Form.Item>
      
      <Form.Item
        name="city"
        label="Tỉnh/Thành phố"
        rules={[{ required: true, message: "Vui lòng nhập Tỉnh/Thành phố!" }]}
      >
        <Input placeholder="VD: Hồ Chí Minh" />
      </Form.Item>

      <Form.Item
        name="address"
        label="Địa chỉ"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
      >
        <Input placeholder="Nhập địa chỉ cụ thể" />
      </Form.Item>

      <Form.Item
        name="phoneNo"
        label="Số điện thoại"
        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
      >
        <Input placeholder="Nhập số điện thoại liên hệ" />
      </Form.Item>

      <Form.Item
        name="imgURL"
        label="URL Hình ảnh"
        rules={[{ required: true, message: "Vui lòng nhập URL hình ảnh!" }]}
      >
        <Input placeholder="Nhập đường dẫn hình ảnh (http...)" />
      </Form.Item>

      <Form.Item style={{ textAlign: "right" }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          {selectedBranch?.id ? "Cập nhật" : "Thêm mới"}
        </Button>
      </Form.Item>
    </Form>
  );
}
