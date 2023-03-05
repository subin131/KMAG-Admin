//in-built
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Space, Image } from "antd";

//custom
import {
  deleteCategory,
  getAllCategory,
  postCategory,
  editCategory,
} from "../../api/categoryApi";
import AddButton from "../../components/Button/AddButton";
import { CategoryModal } from "../../components/Modal/CategoryModal";
import ContentTable from "../../components/Table";
import toastMessage from "../../components/ToastMessage";
import { categoryColumns } from "../../constant/tableColumns";
import PaginationSection from "../../components/Pagination";
import { ConfirmationModal } from "../../components/Modal/ConfirmationModal";

function Category() {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [rank, setRank] = useState();
  const [errorName, setErrorName] = useState("");
  const [errorDescripiton, setErrorDescripiton] = useState("");
  const [errorRank, setErrorRank] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryStatus, setSelectedCategoryStatus] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});

  const handleShowAdd = () => {
    setShowAdd(true);
  };

  const handleCloseAdd = () => {
    setShowAdd(false);
    setErrorName("");
    setCategoryName("");
    setCategoryDescription("");
    setErrorDescripiton("");
    setErrorRank("");
    setRank("");
  };

  const handleShowEdit = (text) => {
    setShowEdit(true);
    setCategoryName(text.title);
    setCategoryDescription(text.description);
    setSelectedCategoryId(text.id);
    setSelectedCategoryStatus(text.status);
    setRank(text.rank);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setErrorName("");
    setCategoryName("");
    setCategoryDescription("");
    setErrorDescripiton("");
    setSelectedCategoryId("");
    setErrorRank("");
  };

  const handleName = (e) => {
    e.preventDefault();
    setCategoryName(e.target.value);
    setErrorName("");
  };

  const handleDescription = (e) => {
    e.preventDefault();
    setCategoryDescription(e.target.value);
    setErrorDescripiton("");
  };

  const handleRankChange = (e) => {
    e.preventDefault();
    setRank(e.target.value);
    setErrorRank("");
  };

  const handleAddRankChange = (e) => {
    e.preventDefault();
    setRank(e.target.value);
  };

  //data for table
  const data = categoryData?.category?.map((item, i) => ({
    key: item.id,
    index: i + 1,
    ...item,
  }));

  const fetchCategory = async () => {
    setLoading(true);
    const data = { page: page };
    const response = await getAllCategory(data); //api request
    setCategoryData(response.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategory();
  }, [page]);

  const handlePostCategory = async () => {
    if (!categoryName) {
      setErrorName("Category Name is required !");
    } else {
      setAdding(true);
      try {
        const data = {
          title: categoryName,
          description: categoryDescription,
          rank: rank,
        };
        const response = await postCategory(data); //api request
        toastMessage({
          type: "success",
          message: "Category created successfully",
        });
        fetchCategory();
      } catch (error) {
        toastMessage({
          type: "error",
          message: "Failed to create category ",
        });
      }
      setAdding(false);
      handleCloseAdd();
    }
  };

  const handleEditCategory = async () => {
    // validation
    if (!categoryName && !rank) {
      setErrorName("Category Name is required !");
      setErrorRank("Rank is required !");
    } else if (!categoryName) {
      setErrorName("Category Name is required !");
    } else if (!rank) {
      setErrorRank("Rank is required !");
    } else {
      setEditing(true);
      try {
        const data = {
          body: {
            status: selectedCategoryStatus,
            title: categoryName,
            description: categoryDescription,
          },
          userId: selectedCategoryId,
        };
        const response = await editCategory(data); //api request
        fetchCategory();
        toastMessage({
          type: "success",
          message: "Category edited successfully",
        });
      } catch (error) {
        toastMessage({
          type: "error",
          message: "Failed to edit category ",
        });
      }
      setEditing(false);
      setShowEdit(false);
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelectedCategory({});
  };

  const handleDeleteCategory = async () => {
    setDeleting(true);
    try {
      await deleteCategory(selectedCategory?.id);
      toastMessage({
        type: "success",
        message: "Category deleted successfully",
      });
      handleCloseConfirmationModal();
      // remove the selected item from frontend
      const updatedData = categoryData?.category?.filter(
        (obj) => obj.id !== selectedCategory?.id
      );
      setCategoryData({
        pagination: categoryData.pagination,
        category: updatedData,
      });
    } catch (error) {
      toastMessage({
        type: "error",
        message: "Failed to delete category",
      });
    }
    setDeleting(false);
  };

  const tableColumn = [
    ...categoryColumns,
    {
      title: "Action",
      key: "action",
      width: "25%",
      render: (text, record) => (
        <Space size="middle">
          <a
            className="btn-primary px-3 table-button"
            onClick={(e) => {
              e.preventDefault();
              handleShowEdit(text);
            }}
          >
            Edit
          </a>
          {deleting ? (
            <a className="btn-danger table-button">Delete</a>
          ) : (
            <a
              className="btn-danger table-button"
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory(text);
                setShowConfirmationModal(true);
              }}
            >
              Delete
            </a>
          )}
        </Space>
      ),
    },
  ];

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  return (
    <div>
      <h3>Category</h3>
      <AddButton title={"Add Category"} handleShow={handleShowAdd} />

      {/* table  */}
      {loading ? (
        <ContentTable
          columns={tableColumn}
          loading={true}
          scroll={{ y: 1200 }}
        />
      ) : (
        <ContentTable columns={tableColumn} data={data} scroll={{ y: 1200 }} />
      )}

      {/* pagination  */}
      {categoryData?.pagination && (
        <PaginationSection
          currentPage={categoryData?.pagination?.currentPage}
          hasNext={categoryData?.pagination?.hasNext}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
        />
      )}

      {/* Add category modal */}
      <CategoryModal
        show={showAdd}
        handleClose={handleCloseAdd}
        title={"Add Category"}
        value={categoryName}
        onChange={(e) => handleName(e)}
        errorName={errorName}
        descValue={categoryDescription}
        onDescChange={(e) => handleDescription(e)}
        errorDesc={errorDescripiton}
        handleSubmit={handlePostCategory}
        loading={adding}
        rank={rank}
        handleRankChange={handleAddRankChange}
      />

      {/* Edit category modal */}
      <CategoryModal
        show={showEdit}
        handleClose={handleCloseEdit}
        title={"Edit Category"}
        value={categoryName}
        onChange={(e) => handleName(e)}
        errorName={errorName}
        descValue={categoryDescription}
        onDescChange={(e) => handleDescription(e)}
        errorDesc={errorDescripiton}
        handleSubmit={handleEditCategory}
        loading={editing}
        rank={rank}
        handleRankChange={handleRankChange}
        errorRank={errorRank}
      />

      <ConfirmationModal
        show={showConfirmationModal}
        handleClose={handleCloseConfirmationModal}
        onConfirm={handleDeleteCategory}
        delete
        isSubmitting={deleting}
      />
    </div>
  );
}

export default Category;
