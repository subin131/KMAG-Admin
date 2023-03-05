// built-in modules
import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import { Input } from "antd";
import { Space } from "antd";

// custom modules
import debounce from "lodash/debounce";
import ContentTable from "../../components/Table";
import { userColumns } from "../../constant/tableColumns";
import { editUser, getAllUser } from "../../api/userApi";
import { DetailView } from "../../components/DetailView";
import { NotVerified, Verified } from "../../components/Icons";
import "./user.css";
import toastMessage from "../../components/ToastMessage";
import AddUserModal from "../../components/Modal/AddUserModal";
import AddButton from "../../components/Button/AddButton";
import NormalDropdown from "../../components/Dropdown/NormalDropdown";
import { ConfirmationModal } from "../../components/Modal/ConfirmationModal";
import PaginationSection from "../../components/Pagination";
import { countryList } from "../../api/countryApi";
import { InputDropdown } from "../../components/Dropdown/InputDropdown";

function User() {
  const [userData, setUserData] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState();
  const [selectedEmail, setSelectedEmail] = useState("");
  const [isConverting , setIsConverting] = useState(false);

  const users = userData.users?.map((item, i) => ({
    index: (page - 1) * 10 + i + 1,
    name:
      item.firstName && item.middleName && item.lastName
        ? item.firstName + " " + item.middleName + " " + item.lastName
        : item.firstName && item.lastName
        ? item.firstName + " " + item.lastName
        : item.firstName
        ? item.firstName
        : "Not Avaliable",
    phoneNumber:
      item.phone && item.phoneCountryCode
        ? item.phoneCountryCode + item.phone
        : item.phone
        ? item.phone
        : "Not Avaliable",
    ...item,
  }));

  const handleShowAddUser = () => {
    setShowAddUser(true);
  };

  const handleCloseAddUser = () => {
    setShowAddUser(false);
  };

  const handleShowConfirmation = (text) => {
    setSelectedUser(text);
    setShowConfirmation(true);
  };

  const handleShow = (text) => {
    setShow(true);
    setSelectedUser(text);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedUser([]);
  };

  const handleSelectedEmail = (e) => {
    setSelectedEmail(e?.target?.value);
  };

  const debounceFilter = debounce(handleSelectedEmail, 1500);

  const fetchData = async () => {
    setLoading(true);
    const data = {
      userType: selectedUserType,
      status: selectedStatus,
      page: page,
      country: selectedCountry,
      hasSubscription: selectedSubscription,
      email: selectedEmail,
    };
    try {
      const response = await getAllUser(data);
      setUserData(response.data.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [
    selectedStatus,
    selectedUserType,
    page,
    selectedCountry,
    selectedSubscription,
    selectedEmail,
  ]);

  const handleCloseConfirmation = () => {
    setSelectedUser([]);
    setShowConfirmation(false);
  };

  const handleContributor = async () => {
    setIsConverting(true);
    try {
      const data = {
        body: { userType: "contributor" },
        userId: selectedUser.id,
      };
      await editUser(data);
      fetchData();
      toastMessage({
        type: "success",
        message: "User made as contributor successfully",
      });
    } catch (error) {
      console.log(error);
      toastMessage({
        type: "error",
        message: "Failed to make User as contributor !",
      });
    }
    setIsConverting(false);
    handleCloseConfirmation();
  };
  const columns = [
    ...userColumns,
    {
      title: "Action",
      key: "action",
      width: "20%",
      render: (text, record) => (
        <Space size="middle">
          <button
            className="btn-primary table-button"
            onClick={() => handleShow(text)}
          >
            View
          </button>
          {text.userType !== "admin" && text.userType !== "contributor" && (
            <button
              className="btn-secondary table-button"
              onClick={() => handleShowConfirmation(text)}
            >
              Make Contributor
            </button>
          )}
        </Space>
      ),
    },
  ];

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

  const userTypeValues = [
    { name: "All", option: "" },
    { name: "Admin", option: "admin" },
    { name: "Contributor", option: "contributor" },
    { name: "Subscriber", option: "subscriber" },
    { name: "Business", option: "business" },
  ];

  const filterSubscription = [
    { name: "All ", option: "" },
    { name: "Subscribed ", option: 1 },
    { name: "Not Subscribed ", option: 0 },
  ];
  const mappedCountries = countryList?.map((item) => ({
    name: item?.name,
    option: item.name?.toLowerCase(),
  }));

  const countriesValues = [{ name: "All", option: "" }, ...mappedCountries];

  return (
    <div>
      <h3>Users</h3>
      <AddButton title={"Add User"} handleShow={handleShowAddUser} />
      <div
        className="d-flex flex-row p-1 gap-2"
        style={{ border: "1px solid lightgrey" }}
      >
        <div className="d-flex flex-row align-items-center ">
          Status:
          <NormalDropdown
            onChange={(option) => {
              setSelectedStatus(option);
            }}
            values={statusValues}
          />
        </div>
        <div className="d-flex flex-row align-items-center">
          User Type:
          <NormalDropdown
            onChange={(option) => {
              setSelectedUserType(option);
            }}
            values={userTypeValues}
          />
        </div>
        <div className="d-flex flex-row align-items-center">
          Country:
          <InputDropdown
            onChange={(option) => {
              setSelectedCountry(option);
            }}
            values={countriesValues}
          />
        </div>
        <div className="d-flex flex-row align-items-center">
          Subscription:
          <NormalDropdown
            onChange={(option) => {
              setSelectedSubscription(option);
            }}
            values={filterSubscription}
          />
        </div>
        <div className="d-flex flex-row align-items-center">
          Email:
          <Input onChange={debounceFilter} values={selectedEmail} />
        </div>
      </div>
      {loading ? (
        <ContentTable
          columns={columns}
          loading={true}
          scroll={{ x: 1000, y: 1200 }}
        />
      ) : (
        <ContentTable
          columns={columns}
          data={users}
          scroll={{ x: 1000, y: 1200 }}
        />
      )}
      {/* pagination  */}
      {userData?.pagination && (
        <PaginationSection
          currentPage={userData?.pagination?.currentPage}
          hasNext={userData?.pagination?.hasNext}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
        />
      )}
      {/* add user modal */}
      <AddUserModal
        show={showAddUser}
        handleClose={handleCloseAddUser}
        fetchUser={fetchData}
      />
      {/* confirmation modal */}
      <ConfirmationModal
        show={showConfirmation}
        handleClose={handleCloseConfirmation}
        message={`Are you sure to make ${
          selectedUser.name !== "Not Avaliable"
            ? selectedUser.name
            : "this user"
        } a contributor ?`}
        isSubmitting={isConverting}
        onConfirm={handleContributor}
      />
      {/* view user details modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title
            className="row d-flex align-items-center"
            style={{ width: "100%" }}
          >
            <img
              src={
                selectedUser.profilePicture ||
                "/img/kmag.png"
              }
              alt="user"
              className="user-image col-4"
            />
            <span className="col-8">{selectedUser.name}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DetailView
            title={"Name"}
            value={selectedUser.name || "Not Avaliable"}
          />
          <DetailView
            title={"Email"}
            value={
              <div>
                {selectedUser.email}
                {selectedUser.email !== "Not Avaliable" && (
                  <>
                    {selectedUser.emailVerified === 1 ? (
                      <Verified tip={"Verified"} />
                    ) : (
                      <NotVerified tip={"Not Verified"} />
                    )}
                  </>
                )}
              </div>
            }
          />
          <DetailView
            title={"Status"}
            value={
              selectedUser?.status?.charAt(0).toUpperCase() +
                selectedUser?.status?.slice(1) || "Not Avaliable"
            }
          />
          <DetailView
            title={"Gender"}
            value={selectedUser.gender || "Not Avaliable"}
          />
          <DetailView
            title={"Date of Birth"}
            value={selectedUser.dateOfBirth || "Not Avaliable"}
          />
          <DetailView
            title={"Country"}
            value={selectedUser.country || "Not Avaliable"}
          />
          <DetailView
            title={"Phone Number"}
            value={
              (
                <>
                  {" "}
                  {selectedUser.phoneNumber}{" "}
                  {selectedUser.phoneNumber !== "Not Avaliable" && (
                    <>
                      {selectedUser.phoneNumber === 1 ? (
                        <Verified tip={"Verified"} />
                      ) : (
                        <NotVerified tip={"Not Verified"} />
                      )}{" "}
                    </>
                  )}{" "}
                </>
              ) || "Not Avaliable"
            }
          />
          <DetailView
            title={"Address One"}
            value={selectedUser.addressOne || "Not Avaliable"}
          />
          <DetailView
            title={"Address Two"}
            value={selectedUser.addressTwo || "Not Avaliable"}
          />
          <DetailView
            title={"State"}
            value={selectedUser.state || "Not Avaliable"}
          />
          <DetailView
            title={"Postal or Zip Code"}
            value={selectedUser.zipcode || "Not Avaliable"}
          />
          <DetailView
            title={"User Type"}
            value={
              selectedUser?.userType?.charAt(0).toUpperCase() +
                selectedUser?.userType?.slice(1) || "Not Avaliable"
            }
          />
          <DetailView
            title={"User Type"}
            value={
              selectedSubscription?.hasSubscription?.charAt(0).toUpperCase() +
                selectedSubscription?.hasSubscription?.slice(1) ||
              "Not Avaliable"
            }
          />
          {selectedUser.referedBy && (
            <DetailView title={"Refered By"} value={selectedUser.referedBy} />
          )}
          {selectedUser.referalCode && (
            <DetailView
              title={"Referal Code"}
              value={selectedUser.referalCode}
            />
          )}
          {/* {selectedUser.createdAt && <DetailView title={"Created At"} value={date(selectedUser.createdAt) || "Not Avaliable" } /> }
              {selectedUser.updatedAt && <DetailView title={"Created At"} value={date(selectedUser.updatedAt) || "Not Avaliable" } /> } */}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default User;
