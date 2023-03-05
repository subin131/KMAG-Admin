import React, { useState, useEffect } from "react";
import { Space } from "antd";
import AddButton from "../../components/Button/AddButton";
import ContentTable from "../../components/Table";
import { deleteContent, getAllContent } from "../../api/contentApi";
import { getAllCategory } from "../../api/categoryApi";
import { columnOfferAndAnnouncement } from "../../constant/tableColumns";
import { Link } from "react-router-dom";
import toastMessage from "../../components/ToastMessage";
import PaginationSection from "../../components/Pagination";
import { InputDropdown } from "../../components/Dropdown/InputDropdown";
import { ConfirmationModal } from "../../components/Modal/ConfirmationModal";

function OfferAndAnnouncement() {
  const [selectedType, setSelectedType] = useState("");
  const [contentData, setContentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState({});
  const [page, setPage] = useState(1);

  const fetchContent = async () => {
    setLoading(true);
    try {
      //getting category data
      const cData = { page: 1, limit: 300 };
      const catData = await getAllCategory(cData);
      setCategoryData(catData?.data.data.category);
      const data = {
        type: selectedType,
        group: "offer-and-announcement",
        page: page,
        status: "",
        categoryId: selectedCategory,
      };
      const response = await getAllContent(data);
      setContentData(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, [page, selectedCategory]);

  const contentArray = contentData?.content?.map((item, i) => ({
    ...item,
    key: (page - 1) * 10 + i + 1,
    postedBy: item.user?.firstName ? (
      <>
        {item.user?.lastName
          ? item.user?.firstName + " " + item.user?.lastName
          : item.user?.firstName}
      </>
    ) : item.user?.email ? (
      item.user?.email
    ) : (
      "Not Avaliable"
    ),
  }));

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelectedContent({});
  };

  // handle delete
  const handleDeleteContent = async () => {
    setDeleting(true);
    try {
      await deleteContent(selectedContent?.id);
      const updatedList = contentData?.content?.filter(
        (obj) => obj.id !== selectedContent?.id
      );
      setContentData({ ...contentData, content: updatedList });
      toastMessage({
        type: "success",
        message: "Content deleted successfully",
      });
      handleCloseConfirmationModal();
    } catch (error) {
      console.log(error);
      toastMessage({
        type: "error",
        message: "Failed to delete content !",
      });
    }
    setDeleting(false);
  };

  const column = [
    ...columnOfferAndAnnouncement,
    {
      title: "Action",
      key: "action",
      width: "40%",
      render: (text, record) => (
        <Space size="middle">
          <a className="btn-primary d-inline-flex table-button px-2 ">
            <Link
              to={`/admin/dashboard/notification/${text.id}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              Send Notification
            </Link>
          </a>
          <a className="btn-secondary table-button px-3">
            <Link
              to={`/admin/dashboard/offer-and-announcement/edit/${text.id}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              Edit
            </Link>
          </a>
          {deleting ? (
            <a className="btn-danger table-button">Delete</a>
          ) : (
            <a
              className="btn-danger table-button"
              onClick={(e) => {
                e.preventDefault();
                setSelectedContent(text);
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
  const typeValues = [
    { name: "All", option: "" },
    { name: "Read", option: "read" },
    { name: "Watch", option: "watch" },
    { name: "Scroll", option: "scroll" },
  ];
  const mappedCategory = categoryData?.map((item) => ({
    name: item?.title,
    option: item.id,
  }));

  const categoryValues = [{ name: "All", option: "" }, ...mappedCategory];

  return (
    <div>
      <h3> Offer And Announcement</h3>
      <div>
        <Link to={"/admin/dashboard/offer-and-announcement/add"}>
          <AddButton title={"Add Offer and Announcement"} />
        </Link>
        <div
          className="d-flex flex-row p-1"
          style={{ border: "1px solid lightgrey" }}
        >
          <div className="d-flex flex-row align-items-center mx-2">
            Category:
            <InputDropdown
              onChange={(option) => {
                setSelectedCategory(option);
              }}
              values={categoryValues}
              className="ml-1"
              width={200}
            />
          </div>
        </div>
        {loading ? (
          <ContentTable
            columns={column}
            loading={true}
            scroll={{ x: 1300, y: 450 }}
          />
        ) : (
          <ContentTable
            columns={column}
            data={contentArray}
            scroll={{ x: 1300, y: 4000 }}
          />
        )}

        {/* pagination */}
        {contentData?.pagination && (
          <PaginationSection
            currentPage={contentData?.pagination?.currentPage}
            hasNext={contentData?.pagination?.hasNext}
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
    </div>
  );
}

export default OfferAndAnnouncement;
