import React, { useState, useEffect } from "react";
import ContentTable from "../../components/Table";
import { columnBookList } from "../../constant/tableColumns";
import { Space } from "antd";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import AddButton from "../../components/Button/AddButton";
import {
  getAllChaptersByBookId,
  updateChapterById,
  deleteChapterById,
} from "../../api/readApi";
import PaginationSection from "../../components/Pagination";
import NormalDropdown from "../../components/Dropdown/NormalDropdown";
import toastMessage from "../../components/ToastMessage";
import DefaultDropdown from "../../components/Dropdown/DefaultDropdown";
import { ConfirmationModal } from "../../components/Modal/ConfirmationModal";
import SpinnerButton from "../../components/Button/SpinnerButton";

function Chapter() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { bookId, chapterId } = useParams();
  const [chapter, setChapter] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState({});
  const chapterData = chapter?.chapters;
  const [searchParams] = useSearchParams();
  const statusQuery = searchParams.get("status");
  let navigate = useNavigate();

  const fetchContent = async () => {
    setLoading(true);
    try {
      const data = {
        page: page,
        limit: 10,
        status: selectedStatus,
        bookId: bookId,
      };
      const response = await getAllChaptersByBookId(data);
      setChapter(response.data.data);
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchContent();
    if (statusQuery) {
      setSelectedStatus(statusQuery);
    }
  }, [selectedStatus, bookId, page]);

  const chapterArray = chapterData?.map((chapter, index) => ({
    ...chapter,
    key: index + 1,
    list: chapter.title,
    status: chapter.status,
  }));

  //editing the book
  const handleStatusChange = async (text, updateStatus) => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("title", text.title);
      formData.append("description", text.description);
      formData.append("status", updateStatus);
      const chapterId = text.id;
      const data = { formData, bookId, chapterId };
      await updateChapterById(data);
      toastMessage({
        type: "success",
        message: "Chapter Status Updated Successfully",
      });
      fetchContent();
    } catch (error) {
      if (error.response?.data?.data) {
        toastMessage({
          type: "error",
          message: error.response?.data?.data,
        });
      } else {
        toastMessage({
          type: "error",
          message: `Failed to update status !`,
        });
      }
    }
    setUpdating(false);
  };
  //handle delete
  const handleDeleteContent = async () => {
    setDeleting(true);
    try {
      const chapterId = selectedChapter?.id;
      await deleteChapterById(bookId, chapterId);
      const updatedList = chapter?.chapters?.filter(
        (obj) => obj.id !== selectedChapter?.id
      );
      setChapter({ ...chapter, chapters: updatedList });
      toastMessage({
        type: "success",
        message: "Chapter deleted successfully",
      });
    } catch (error) {
      if (error.response?.data?.data) {
        toastMessage({
          type: "error",
          message: error.response?.data?.data,
        });
      } else {
        console.log(error);
        toastMessage({
          type: "error",
          message: `Failed to delete chapter !`,
        });
      }
    }
    setDeleting(false);
    handleCloseConfirmationModal();
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelectedChapter({});
  };

  const column = [
    ...columnBookList,
    {
      title: "Action",
      key: "action",
      width: "40%",
      render: (text, record) => (
        <Space size="middle">
          <a
            className="btn-primary table-button px-3"
            href={`/admin/dashboard/book/chapter/section/${bookId}/${text.id}`}
            style={{ textDecoration: "none", color: "white" }}
          >
            Sections
          </a>
          {/* //delete button */}
          {/* {deleting ? (
            <a className="btn-danger table-button">Delete</a>
          ) : (
            <a
              className="btn-danger table-button"
              onClick={(e) => {
                setSelectedChapter(text);
                setShowConfirmationModal(true);
              }}
            >
              Delete
            </a>
          )} */}

          <a
            className="btn-secondary table-button px-3"
            href={`/admin/dashboard/book/chapter/edit/${bookId}/${text.id}`}
            style={{ textDecoration: "none", color: "white" }}
          >
            Edit
          </a>

          {/* //active and inactive button */}
          {updating && selectedChapter?.id == text.id ? (
            <SpinnerButton
              isSubmitting={true}
              title={"Updating"}
              className={"btn-secondary"}
              height={"35px"}
            />
          ) : (
            <>
              {text.status === "inactive" ? (
                <a
                  className="btn-success table-button px-3"
                  onClick={() => {
                    handleStatusChange(text, "active");
                    setSelectedChapter(text);
                  }}
                >
                  Activate
                </a>
              ) : (
                <a
                  className="btn-danger table-button"
                  onClick={() => {
                    handleStatusChange(text, "inactive");
                    setSelectedChapter(text);
                  }}
                >
                  Deactivate
                </a>
              )}
            </>
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

  const statusValues = [
    { name: "Active", option: "active" },
    { name: "Inactive", option: "inactive" },
  ];
  return (
    <div>
      <Link to={"/admin/dashboard/book"} className="go-back">
        Back to Books
      </Link>
      <h3>Chapters</h3>
      <Link to={`/admin/dashboard/book/chapter/add/${bookId}`}>
        <AddButton title={"Add Chapter"} />
      </Link>
      {/* status filter-content */}
      <div
        className="d-flex flex-row p-1"
        style={{ border: "1px solid lightgrey" }}
      >
        <div className="d-flex flex-row align-items-center  mx-2 p-2">
          Status:
          <DefaultDropdown
            onChange={(option) => {
              setSelectedStatus(option);
              navigate(`/admin/dashboard/book/chapter/${bookId}`);
            }}
            values={statusValues}
            defaultValue={selectedStatus}
            className="ml-1"
            width={150}
          />
        </div>
      </div>
      {/* //table */}
      {loading ? (
        <ContentTable columns={column} loading={true} />
      ) : (
        <ContentTable columns={column} data={chapterArray} />
      )}
      {/* pagination  */}
      {chapter?.pagination && (
        <PaginationSection
          currentPage={chapter?.pagination?.currentPage}
          hasNext={chapter?.pagination?.hasNext}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
        />
      )}

      {/* modal  */}
      <ConfirmationModal
        show={showConfirmationModal}
        handleClose={handleCloseConfirmationModal}
        onConfirm={handleDeleteContent}
        delete
        isSubmitting={deleting}
      />
    </div>
  );
}

export default Chapter;
