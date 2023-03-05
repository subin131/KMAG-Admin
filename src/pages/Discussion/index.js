//built-in
import React, { useEffect, useState } from "react";
import { Space } from "antd";

//custom
import AddButton from "../../components/Button/AddButton";
import ContentTable from "../../components/Table";
import { discussionColumns } from "../../constant/tableColumns";
import {
  deleteQuestion,
  editQuestion,
  getAllQuestions,
} from "../../api/discussionApi";
import { getAllCategory } from "../../api/categoryApi";
import toastMessage from "../../components/ToastMessage";
import NormalDropdown from "../../components/Dropdown/NormalDropdown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PaginationSection from "../../components/Pagination";
import { InputDropdown } from "../../components/Dropdown/InputDropdown";
import { ConfirmationModal } from "../../components/Modal/ConfirmationModal";

function Discussion() {
  const [questions, setQuestions] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [activating, setActivating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [showConfirmationModal , setShowConfirmationModal] = useState(false);
  const navigate = useNavigate();
  const [selectedDiscussion , setSelectedDiscussion] = useState({});

  const location = useLocation();

  const column = [
    ...discussionColumns,
    {
      title: "Action",
      key: "action",
      width: "30%",
      render: (text, record) => (
        <Space size="middle">
            <a className="btn-primary d-inline-flex table-button px-2 ">
            <Link
              to={`/admin/dashboard/notification/discussion/${text.id}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              Send Notification
            </Link>
          </a>
          <a
            className="btn-primary px-3 table-button"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/admin/dashboard/discussion/edit/${text.id}`);
            }}
          >
            Edit
          </a>
          {text.status === "active" ? (
            <>
              {deleting ? (
                <a className="btn-danger table-button px-2">Delete</a>
              ) : (
                <a
                  className="btn-danger table-button px-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedDiscussion(text);
                    setShowConfirmationModal(true);
                  }}
                >
                  Delete
                </a>
              )}
            </>
          ) : (
            <>
              {activating ? (
                <a className="btn-success table-button">Activate</a>
              ) : (
                <a
                  className="btn-success table-button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleActivateQuestion(text);
                  }}
                >
                  Activate
                </a>
              )}
            </>
          )}
        </Space>
      ),
    },
  ];

  const data = questions?.items?.map((item, i) => ({
    index: (page - 1) * 10 + i + 1,
    ...item,
  }));

  const fetchQuestions = async () => {
    setLoading(true);
    //getting category data
    const cData = { page: 1, limit: 300 };
    const catData = await getAllCategory(cData);
    setCategoryData(catData?.data.data.category);

    const data = {
      status: selectedStatus,
      page: page,
      categoryId: selectedCategory,
    };
    const response = await getAllQuestions(data);
    setQuestions(response?.data?.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedStatus, page, selectedCategory]);

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
     setSelectedDiscussion({});
 }
  const handleDeleteQuestion = async () => {
    setDeleting(true);
    try {
      await deleteQuestion(selectedDiscussion?.id);
      toastMessage({
        type: "success",
        message: "Question deleted successfully",
      });
      const updatedData = questions?.items?.filter((obj) => obj.id !== selectedDiscussion?.id);
      setQuestions({ items: updatedData, pagination: questions.pagination });
      handleCloseConfirmationModal();
    } catch (error) {
      toastMessage({
        type: "error",
        message: "Failed to delete question",
      });
    }
    setDeleting(false);
  };

  const handleActivateQuestion = async (item) => {
    setActivating(true);
    const data = {
      body: {
        status: "active",
        title: item.title,
        description: item.description || "",
        categoryId: item.categoryId,
      },
      userId: item.id,
    };
    try {
      const response = await editQuestion(data);
      toastMessage({
        type: "success",
        message: "Question activated successfully",
      });
      fetchQuestions();
    } catch (error) {
      toastMessage({
        type: "error",
        message: "Failed to activate question",
      });
    }
    setActivating(false);
  };

  const statusValues = [
    { name: "All", option: "" },
    { name: "Active", option: "active" },
    { name: "Inactive", option: "inactive" },
  ];

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };
  const mappedCategory = categoryData?.map((item) => ({
    name: item?.title,
    option: item.id,
  }));

  const categoryValues = [{ name: "All", option: "" }, ...mappedCategory];

  return (
    <div>
      <h3>Discussion</h3>
      <div>
        <Link to={`${location.pathname}/add`}>
          <AddButton title={"Add Question"} />
        </Link>

        <div
          className="d-flex flex-row p-1"
          style={{ border: "1px solid lightgrey" }}
        >
          <div className="d-flex flex-row align-items-center">
            Status:
            <NormalDropdown
              onChange={(option) => {
                setSelectedStatus(option);
              }}
              values={statusValues}
              className="ml-1"
              defaultValue="active"
            />
          </div>
          <div className="d-flex flex-row align-items-center mx-2">
            Category:
            <InputDropdown
              onChange={(option) => {
                setSelectedCategory(option);
              }}
              values={categoryValues}
              className="ml-1"
              width={200}
              style={{ marginLeft: "10px" }}
            />
          </div>
        </div>
        {loading ? (
          <ContentTable columns={column} loading={true} scroll={{ y: 1200 }} />
        ) : (
          <ContentTable columns={column} data={data} scroll={{ y: 1200 }} />
        )}
        {questions?.pagination && (
          <PaginationSection
            currentPage={questions?.pagination?.currentPage}
            hasNext={questions?.pagination?.hasNext}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
          />
        )}

        {/* modal  */}
        <ConfirmationModal
          show={showConfirmationModal}
          handleClose={handleCloseConfirmationModal}
          onConfirm={handleDeleteQuestion}
          delete
          isSubmitting={deleting}
        />
      </div>
    </div>
  );
}

export default Discussion;
