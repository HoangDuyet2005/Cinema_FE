import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ProTable } from "@ant-design/pro-components";
import { Button, Modal, Popconfirm, message, Tag, Tooltip, Image } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, ReloadOutlined } from "@ant-design/icons";

import {
  getMovieListManagement,
  deleteMovie,
  updateMovieUpload,
  resetMoviesManagement,
  updateMovie,
  addMovieUpload,
} from "../../reducers/actions/Movie";

import ThumbnailYoutube from "./ThumbnailYoutube";
import FormAdd from "./FormAdd";
import formatDate from "../../utilities/formatDate";
import slugify from "slugify";

export default function MoviesManagement() {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const selectedPhim = useRef(null);
  const actionRef = useRef();
  
  const {
    movieList2,
    loadingMovieList2,
    loadingDeleteMovie,
    successDeleteMovie,
    successUpdateMovie,
    successUpdateNoneImageMovie,
    successAddUploadMovie,
  } = useSelector((state) => state.movieReducer);

  useEffect(() => {
    if (
      !movieList2 ||
      successUpdateMovie ||
      successUpdateNoneImageMovie ||
      successDeleteMovie ||
      successAddUploadMovie
    ) {
      dispatch(getMovieListManagement());
    }
  }, [
    successUpdateMovie,
    successUpdateNoneImageMovie,
    successDeleteMovie,
    successAddUploadMovie,
    dispatch,
    movieList2
  ]);

  useEffect(() => {
    if (successDeleteMovie) message.success("Xóa phim thành công!");
    if (successUpdateMovie || successUpdateNoneImageMovie) message.success("Cập nhật phim thành công!");
    if (successAddUploadMovie) message.success("Thêm phim thành công!");
  }, [successDeleteMovie, successUpdateMovie, successUpdateNoneImageMovie, successAddUploadMovie]);

  useEffect(() => {
    return () => {
      dispatch(resetMoviesManagement());
    };
  }, [dispatch]);

  const handleDeleteOne = (maPhim) => {
    if (!loadingDeleteMovie) {
      dispatch(deleteMovie(maPhim));
    }
  };

  const handleEdit = (phimItem) => {
    selectedPhim.current = phimItem;
    setOpenModal(true);
  };

  const handleAddMovie = () => {
    selectedPhim.current = {
      id: "",
      name: "",
      smallImageURl: "",
      longDescription: "",
      shortDescription: "",
      largeImageURL: "",
      director: "",
      actors: "",
      categories: "",
      releaseDate: "",
      duration: "",
      trailerURL: "",
      language: "",
      rated: "",
      isShowing: null,
    };
    setOpenModal(true);
  };

  const handleReload = () => {
    dispatch(getMovieListManagement());
    setSearchParams({});
  };

  const onUpdate = (movieObj, hinhAnh, fakeImage) => {
    setOpenModal(false);
    if (typeof hinhAnh === "string") {
      const movieUpdate = movieList2?.data?.find((movie) => movie.id === fakeImage.id);
      movieObj.smallImageURl = movieUpdate?.smallImageURl;
      dispatch(updateMovie(movieObj));
      return undefined;
    }
    dispatch(updateMovieUpload(movieObj));
  };

  const onAddMovie = (movieObj) => {
    dispatch(addMovieUpload(movieObj));
    setOpenModal(false);
  };

  // Lọc dữ liệu theo thanh tìm kiếm
  const modifySlugify = { lower: true, locale: "vi" };
  const getFilteredData = () => {
    if (!movieList2?.data) return [];
    return movieList2.data.filter((movie) => {
      if (!searchParams.name) return true;
      const matchTenPhim = slugify(movie.name ?? "", modifySlugify)?.indexOf(slugify(searchParams.name, modifySlugify)) !== -1;
      return matchTenPhim;
    });
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "smallImageURl",
      search: false,
      render: (text) => (
        <Image
          width={60}
          height={80}
          src={text}
          fallback="https://via.placeholder.com/60x80?text=No+Image"
          style={{ objectFit: "cover", borderRadius: "4px" }}
        />
      ),
    },
    {
      title: "Tên phim",
      dataIndex: "name",
      copyable: true,
      ellipsis: true,
    },
    {
      title: "Ngày khởi chiếu",
      dataIndex: "releaseDate",
      search: false,
      render: (text) => (text ? formatDate(text.slice(0, 10)).dateFull : ""),
    },
    {
      title: "Mô tả",
      dataIndex: "longDescription",
      search: false,
      ellipsis: true,
    },
    {
      title: "Trailer",
      dataIndex: "trailerURL",
      search: false,
      render: (text) => (
        <div style={{ width: 100 }}>
          <ThumbnailYoutube urlYoutube={text} />
        </div>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rated",
      search: false,
      render: (text) => <Tag color="blue">{text || 0}</Tag>,
    },
    {
      title: "Hành động",
      valueType: "option",
      render: (text, record) => [
        <Button
          key="edit"
          type="primary"
          icon={<EditOutlined />}
          size="small"
          onClick={() => handleEdit(record)}
        >
          Sửa
        </Button>,
        <Popconfirm
          key="delete"
          title="Bạn có chắc chắn muốn xóa phim này?"
          onConfirm={() => handleDeleteOne(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button type="primary" danger icon={<DeleteOutlined />} size="small">
            Xóa
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        dataSource={getFilteredData()}
        rowKey="id"
        loading={loadingMovieList2}
        onSubmit={(params) => setSearchParams(params)}
        onReset={() => setSearchParams({})}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: "auto",
        }}
        dateFormatter="string"
        headerTitle="Danh sách Phim"
        toolBarRender={() => [
          <Button key="reload" type="default" icon={<ReloadOutlined />} onClick={handleReload}>
            Làm mới
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddMovie}
          >
            Thêm phim mới
          </Button>,
        ]}
      />

      <Modal
        title={selectedPhim?.current?.name ? `Sửa phim: ${selectedPhim?.current?.name}` : "Thêm phim mới"}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        {openModal && (
          <FormAdd
            key={selectedPhim.current?.id || "add"}
            selectedPhim={selectedPhim.current}
            onUpdate={onUpdate}
            onAddMovie={onAddMovie}
          />
        )}
      </Modal>
    </div>
  );
}
