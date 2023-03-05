//built-in modules
import React, { useEffect, useState } from "react";
import { Space } from "antd";
import { useParams } from "react-router";
//custom
import AddButton from "../../components/Button/AddButton";
import ContentTable from "../../components/Table";
import {
  deleteContent,
  editContent,
  getAllContent,
  getContentById,
} from "../../api/contentApi";
import { getAllCategory } from "../../api/categoryApi";
import { contentColumns } from "../../constant/tableColumns";
import { Link, useLocation } from "react-router-dom";
import { addContentAdmin, addContentContributor } from "../../routes";
import toastMessage from "../../components/ToastMessage";
import { read, scroll, watch } from "../../components/ContentTypes";
import NormalDropdown from "../../components/Dropdown/NormalDropdown";
import PaginationSection from "../../components/Pagination";
import { InputDropdown } from "../../components/Dropdown/InputDropdown";
import { ConfirmationModal } from "../../components/Modal/ConfirmationModal";

function Content() {
  const [contentData, setContentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIncludedInBook, setSelectedIncludedInBook] = useState("");
  const [subscriberContent, setSubscriberContent] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [page, setPage] = useState(1);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState({});

  const location = useLocation();
  const getUser = JSON.parse(localStorage.getItem("user"));

  const fetchContent = async () => {
    setLoading(true);
    try {
      //getting category data
      const cData = { page: 1, limit: 100 };
      const catData = await getAllCategory(cData);
      setCategoryData(catData?.data.data.category);
      let data = {
        type: selectedType,
        group: "",
        page: page,
        status: selectedStatus,
        categoryId: selectedCategory,
        included_in_book: selectedIncludedInBook,
      };
      const response = await getAllContent(data);
      setContentData(response?.data?.data);
      //filter contributors content only
      const filterContent = response?.data?.data?.content?.filter(
        (obj) => obj?.user?.email === getUser.email
      );
      setSubscriberContent(filterContent);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, [
    selectedType,
    selectedStatus,
    selectedCategory,
    selectedIncludedInBook,
    page,
  ]);

  // table data for admin
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
    categoryName: item.category?.title,
  }));

  // table data for contributor
  const subscriberContentData = subscriberContent?.map((item, i) => ({
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
          message: "Failed to delete content !",
        });
      }
    }
    handleCloseConfirmationModal();
    setDeleting(false);
  };

  const handlePublish = async (text, updateStatus) => {
    try {
      const formData = new FormData();
      formData.append("title", text.title);
      formData.append("content", text.content);
      formData.append("type", text.type);
      {
        text.createdBy && formData.append("contributorId", text.createdBy);
      }
      {
        text?.excerpt && formData.append("excerpt", text?.excerpt);
      }
      formData.append("status", updateStatus);
      if (text.type === read.type) {
        formData.append("bannerImg", text.banner_img);
      }
      if (text.type === watch.type) {
        formData.append("extenalLink", text.externalLink);
        formData.append("bannerImg", text.banner_img);
      }
      if (text.type === scroll.type) {
        formData.append("photo", text.photo);
      }
      const data = { formData, id: text.id };
      const response = await editContent(data);
      toastMessage({
        type: "success",
        message: `Content status updated successfully`,
      });
      fetchContent();
    } catch (error) {
      console.log("error", error);
      toastMessage({
        type: "error",
        message: `Failed to update status !`,
      });
    }
  };

  const column = [
    ...contentColumns,
    {
      title: "Action",
      key: "action",
      width: "30%",
      render: (text, record) => (
        <Space size="middle">
          <div className="d-flex flex-column gap-2">
            {getUser.userType === "admin" && (
              <div className="d-flex gap-2">
                {
                  <a
                    className="btn-primary d-inline-flex table-button px-2 "
                    href={`/admin/dashboard/notification/${text.id}`}
                    style={{
                      textDecoration: "none",
                      color: "white",
                      width: "130px",
                    }}
                  >
                    Send Notification
                  </a>
                }
                {text.status === "unpublished" && (
                  <a
                    className="btn-success table-button px-3"
                    onClick={() => handlePublish(text, "published")}
                  >
                    Publish
                  </a>
                )}
                {text.status === "published" && (
                  <a
                    className="btn-secondary table-button"
                    onClick={() => handlePublish(text, "unpublished")}
                  >
                    Unpublish
                  </a>
                )}
                {text.status !== "pending" ? (
                  <>
                    <a
                      className="btn-warning table-button"
                      onClick={() => handlePublish(text, "pending")}
                    >
                      Pending
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      className="btn-success table-button px-3"
                      onClick={() => handlePublish(text, "published")}
                    >
                      Publish
                    </a>
                    <a
                      className="btn-secondary table-button"
                      onClick={() => handlePublish(text, "unpublished")}
                    >
                      Unpublish
                    </a>
                  </>
                )}
              </div>
            )}
            <div className="d-flex gap-2">
              <a
                className="btn-primary table-button px-3"
                href={`${location.pathname}/edit/${text.id}`}
                style={{ textDecoration: "none", color: "white" }}
              >
                Edit
              </a>
              {deleting ? (
                <a className="btn-danger table-button">Delete</a>
              ) : (
                <a
                  className="btn-danger table-button"
                  onClick={(e) => {
                    setShowConfirmationModal(true);
                    setSelectedContent(text);
                  }}
                >
                  Delete
                </a>
              )}
            </div>
          </div>
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

  const statusValues = [
    { name: "All", option: "" },
    { name: "Published", option: "published" },
    { name: "Unpublished", option: "unpublished" },
    { name: "Pending", option: "pending" },
  ];

  const includedInBookValues = [
    { name: "All", option: "" },
    { name: "Yes", option: "1" },
    { name: "No", option: "0" },
  ];

  const mappedCategory = categoryData?.map((item) => ({
    name: item?.title,
    option: item.id,
  }));

  const categoryValues = [{ name: "All", option: "" }, ...mappedCategory];

  return (
    <div>
      <h3> {getUser.userType !== "admin" && "My "}Contents</h3>
      <div>
        <Link
          to={
            getUser.userType === "admin"
              ? addContentAdmin
              : getUser.userType === "contributor"
              ? addContentContributor
              : "/"
          }
        >
          <AddButton title={"Add Content"} />
        </Link>
        <div
          className="d-flex flex-row p-1"
          style={{ border: "1px solid lightgrey" }}
        >
          <div className="d-flex flex-row align-items-center  mx-2">
            Type:
            <NormalDropdown
              onChange={(option) => {
                setSelectedType(option);
              }}
              values={typeValues}
              className="ml-1"
              width={150}
            />
          </div>

          {/* status filter-content */}
          <div className="d-flex flex-row align-items-center  mx-2">
            Status:
            <NormalDropdown
              onChange={(option) => {
                setSelectedStatus(option);
              }}
              values={statusValues}
              className="ml-1"
              width={200}
            />
          </div>
          {/* category filter-content */}
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

          <div className="d-flex flex-row align-items-center mx-2">
            Included in Book:
            <NormalDropdown
              onChange={(option) => {
                setSelectedIncludedInBook(option);
              }}
              values={includedInBookValues}
              className="ml-1"
              width={150}
            />
          </div>
        </div>
        {loading ? (
          <ContentTable
            columns={column}
            loading={true}
            scroll={{ x: 1200, y: 450 }}
          />
        ) : (
          <ContentTable
            columns={column}
            data={
              getUser?.userType === "admin"
                ? contentArray
                : subscriberContentData
            }
            scroll={{ x: 1200, y: 4000 }}
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

export default Content;
