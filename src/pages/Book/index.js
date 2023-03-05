import React, { useState, useEffect } from "react";
import ContentTable from "../../components/Table";
import { columnBookList } from "../../constant/tableColumns";
import { Space } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AddButton from "../../components/Button/AddButton";
import { deleteBookById, getAllBooks, updateBookById } from "../../api/readApi";
import PaginationSection from "../../components/Pagination";
import toastMessage from "../../components/ToastMessage";
import DefaultDropdown from "../../components/Dropdown/DefaultDropdown";
import { ConfirmationModal } from "../../components/Modal/ConfirmationModal";
import SpinnerButton from "../../components/Button/SpinnerButton";

function Book() {
  const [book, setBook] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedBook, setSelectedBook] = useState({});
  const bookData = book?.books;
  const [searchParams] = useSearchParams();
  const statusQuery = searchParams.get("status");
  let navigate = useNavigate();

  const fetchContent = async () => {
    setLoading(true);
    try {
      const data = { page: page, limit: 10, status: selectedStatus };
      const response = await getAllBooks(data);
      setBook(response.data.data);
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
  }, [selectedStatus, page]);

  const bookArray = bookData?.map((book, index) => ({
    ...book,
    key: (page - 1) * 10 + index + 1,
  }));

  //editing the book
  const handleStatusChange = async (text, updateStatus) => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("title", text.title);
      formData.append("description", text.description);
      formData.append("status", updateStatus);
      formData.append("id", text.id);
      formData.append("author", text.author);
      formData.append("frontPageUrl", text.front_page_url);
      formData.append("backPageUrl", text.back_page_url);
      const bookId = text.id;
      const data = { formData, bookId };
      await updateBookById(data);
      toastMessage({
        type: "success",
        message: "Book Status Updated Successfully",
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
  const handleDeleteContent = async (text) => {
    setDeleting(true);
    try {
      await deleteBookById(selectedBook?.id);
      const updatedList = book?.books?.filter(
        (obj) => obj.id !== selectedBook.id
      );
      setBook({ ...book, books: updatedList });
      toastMessage({
        type: "success",
        message: "Book deleted successfully",
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
          message: `Failed to delete book !`,
        });
      }
    }
    handleCloseConfirmationModal();
    setDeleting(false);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelectedBook({});
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
            className="btn-primary table-button px-2"
            href={`/admin/dashboard/book/chapter/${text.id}`}
            style={{ textDecoration: "none", color: "white" }}
          >
            Chapters
          </a>
          {/* //delete button */}
          {/* <a
            className="btn-danger table-button"
            onClick={(e) => {
              setSelectedBook(text);
              setShowConfirmationModal(true);
            }}
          >
            Delete
          </a> */}
          <a
            className="btn-secondary table-button px-3"
            href={`/admin/dashboard/book/edit/${text.id}`}
            style={{ textDecoration: "none", color: "white" }}
          >
            Edit
          </a>

          {updating && selectedBook?.id == text.id ? (
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
                    setSelectedBook(text);
                  }}
                >
                  Activate
                </a>
              ) : (
                <a
                  className="btn-danger table-button"
                  onClick={() => {
                    handleStatusChange(text, "inactive");
                    setSelectedBook(text);
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
      <h3>Books</h3>
      <Link to={"/admin/dashboard/book/add"}>
        <AddButton title={"Add Book"} />
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
              navigate("/admin/dashboard/book");
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
        <ContentTable columns={column} data={bookArray} scroll={{ y: 600 }} />
      )}

      {/* pagination  */}
      {book?.pagination && (
        <PaginationSection
          currentPage={book?.pagination?.currentPage}
          hasNext={book?.pagination?.hasNext}
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

export default Book;
