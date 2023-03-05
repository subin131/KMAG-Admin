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
  getAllSectionsByChapterId,
  updateSectionById,
  deleteSectionById,
} from "../../api/readApi";
import PaginationSection from "../../components/Pagination";
import toastMessage from "../../components/ToastMessage";
import DefaultDropdown from "../../components/Dropdown/DefaultDropdown";
import { ConfirmationModal } from "../../components/Modal/ConfirmationModal";
import SpinnerButton from "../../components/Button/SpinnerButton";

function Chapter() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { bookId, chapterId, sectionId } = useParams();
  const [section, setSection] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [deleting, setDeleting] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedSection, setSelectedSection] = useState({});

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusQuery = searchParams.get("status");
  const sectionData = section?.sections;

  const fetchContent = async () => {
    setLoading(true);
    try {
      const data = { page: page, limit: 10, status: selectedStatus };
      const response = await getAllSectionsByChapterId(data, chapterId);
      setSection(response.data.data);
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
  }, [selectedStatus, chapterId, page]);

  const sectionArray = sectionData?.map((section, index) => ({
    ...section,
    key: index + 1,
    list: section.title,
    status: section.status,
  }));
  //editing the book
  const handleStatusChange = async (text, updateStatus) => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("title", text.title);
      formData.append("description", text.description);
      formData.append("status", updateStatus);
      formData.append("contentId", text.contentId);
      const sectionId = text.id;
      const data = { formData, chapterId, sectionId };
      await updateSectionById(data);
      toastMessage({
        type: "success",
        message: "Chapter Status Updated Successfully",
      });
      fetchContent();
    } catch (error) {
      console.log("error", error);
      toastMessage({
        type: "error",
        message: `Failed to update status !`,
      });
    }
    setUpdating(false);
  };
  //handle delete
  const handleDeleteContent = async (text) => {
    setDeleting(true);
    try {
      const sectionId = text.id;
      await deleteSectionById(chapterId, sectionId);
      const updatedList = section?.sections?.filter(
        (obj) => obj.id !== text.id
      );
      setSection({ ...section, sections: updatedList });
      toastMessage({
        type: "success",
        message: "Section deleted successfully",
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
          message: `Failed to delete section !`,
        });
      }
    }
    handleCloseConfirmationModal();
    setDeleting(false);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelectedSection({});
  };

  const column = [
    ...columnBookList,
    {
      title: "Action",
      key: "action",
      width: "40%",
      render: (text, record) => (
        <Space size="middle">
          {/* //active and inactive button */}
          <>
            <a
              className="btn-secondary table-button px-3"
              href={`/admin/dashboard/book/chapter/section/edit/${bookId}/${chapterId}/${text.id}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              Edit
            </a>

            {/* //delete button */}
            {/* {deleting ? (
              <a className="btn-danger table-button">Delete</a>
            ) : (
              <a
                className="btn-danger table-button"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteContent(text);
                }}
              >
                Delete
              </a>
            )} */}

            {updating && selectedSection?.id == text.id ? (
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
                      setSelectedSection(text);
                    }}
                  >
                    Activate
                  </a>
                ) : (
                  <a
                    className="btn-danger table-button"
                    onClick={() => {
                      handleStatusChange(text, "inactive");
                      setSelectedSection(text);
                    }}
                  >
                    Deactivate
                  </a>
                )}
              </>
            )}
          </>
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
      <Link to={`/admin/dashboard/book/chapter/${bookId}`} className="go-back">Back to Chapters</Link>
      <h3>Sections</h3>
      <Link
        to={`/admin/dashboard/book/chapter/section/add/${bookId}/${chapterId}`}
      >
        <AddButton title={"Add Section"} />
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
              navigate(
                `/admin/dashboard/book/chapter/section/${bookId}/${chapterId}`
              );
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
        <ContentTable columns={column} data={sectionArray} />
      )}

      {/* pagination  */}
      {section?.pagination && (
        <PaginationSection
          currentPage={section?.pagination?.currentPage}
          hasNext={section?.pagination?.hasNext}
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
