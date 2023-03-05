import { Space } from "antd";
import React, { useEffect, useState } from "react";
import {
  deleteLeadById,
  getAllLeads,
  sendPromotionalEmails,
} from "../../api/leadsApi";
import AddButton from "../../components/Button/AddButton";
import NormalDropdown from "../../components/Dropdown/NormalDropdown";
import ContentTable from "../../components/Table";
import { leadsColumns } from "../../constant/tableColumns";
import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "../../components/Modal/ConfirmationModal";
import toastMessage from "../../components/ToastMessage";
import "./leads.css";
import { getAllPackages } from "../../api/subscripitonApi";
import SpinnerButton from "../../components/Button/SpinnerButton";
import PaginationSection from "../../components/Pagination";

export default function Leads() {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [leadsData, setLeadsData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [selectedEmailedValue, setSelectedEmailedValue] = useState("");
  const [selectedLead, setSelectedLead] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPromotionalIds, setSelectedPromotionalIds] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [packageValues, setPackageValues] = useState([
    { name: "Select a package", option: "" },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [errorPackage, setErrorPackage] = useState("");
  const [errorUser, setErrorUser] = useState("");

  const statusValues = [
    { name: "All", option: "" },
    { name: "Active", option: "active" },
    { name: "Inactive", option: "inactive" },
  ];

  const emailedValues = [
    { name: "All", option: "" },
    { name: "Sent", option: "1" },
    { name: "Not sent", option: "0" },
  ];

  const tableData = leadsData.users?.map((item, i) => ({
    ...item,
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
    key: item.id,
  }));

  const tableColumn = [
    ...leadsColumns,
    {
      title: "Action",
      key: "action",
      width: "25%",
      render: (text, record) => (
        <Space size="middle">
          <a
            className="btn-primary px-3 table-button"
            onClick={(e) => {
              navigate(`/admin/dashboard/leads/edit/${text.id}`);
            }}
          >
            Edit
          </a>
          {text.status == "active" && (
            <a
              className="btn-danger table-button"
              onClick={(e) => {
                setSelectedLead(text);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      let data = {
        status: selectedStatus,
        emailed: selectedEmailedValue,
        page: page,
        limit: 10
      };
      const response = await getAllLeads(data);
      setLeadsData(response.data.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedStatus, selectedEmailedValue, page]);

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelectedLead({});
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      let data = { leadId: selectedLead?.id };
      const response = await deleteLeadById(data);
      if (response.status == 200 || 201) {
        toastMessage({
          type: "success",
          message: "Lead deleted successfully",
        });
        fetchData();
        handleCloseConfirmationModal();
      }
    } catch (error) {
      console.log(error);
      toastMessage({
        type: "error",
        message: "Failed to delete lead",
      });
    }
    setIsDeleting(false);
  };

  const rowSelection = {
    selectedRowKeys: selectedPromotionalIds,
    onChange: (selectedRowKeys) => {
      setSelectedPromotionalIds(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.status === "inactive",
    }),
  };

  //get all packages
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const data = { status: "active", page: 1, limit: "100" };
        const response = await getAllPackages(data);
        const packages = await response?.data?.data?.package;
        const dropdownPackages = packages?.map((item) => ({
          name: `${item.title} (${item.currency})`,
          option: item.id,
        }));
        setPackageValues([
          { name: "Select a package", option: "" },
          ...dropdownPackages,
        ]);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchPackage();
  }, []);

  const handleSendEmail = async () => {
    {
      !selectedPackage && setErrorPackage("Select a package");
    }
    {
      !selectedPromotionalIds &&
        selectedPromotionalIds.langth == 0 &&
        setErrorUser("Select users");
    }

    if (selectedPackage && selectedPromotionalIds.length > 0) {
      setIsSending(true);
      try {
        let data = {
          leadIds: selectedPromotionalIds,
          packageId: selectedPackage,
        };
        const response = await sendPromotionalEmails(data);
        if (response.status == 200 || 201) {
          setSelectedPromotionalIds([]);
          setSelectedPackage("");
          fetchData();
          toastMessage({
            type: "success",
            message: "Promotional emails sent successfully",
          });
        }
      } catch (error) {
        console.log(error);
        toastMessage({
          type: "error",
          message: "Failed to send promotional emails",
        });
      }
      setIsSending(false);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  return (
    <div>
      <div className="d-flex flex-row justify-content-between">
        <div>
          <h3>Leads</h3>
          <AddButton
            title={"Add Leads"}
            handleShow={() => navigate("/admin/dashboard/leads/add")}
          />
        </div>
        <div className="send-email-block">
          <span>Send Promotional Email</span>
          <div className="d-flex flex-row align-items-center">
            <NormalDropdown
              onChange={(option) => {
                setSelectedPackage(option);
                setErrorPackage("");
              }}
              values={packageValues}
              width={250}
              value={selectedPackage}
            />
            {selectedPackage && selectedPromotionalIds?.length > 0 ? 
            <SpinnerButton
              title={"Send"}
              className="btn btn-primary send-btn"
              isSubmitting={isSending}
              onClick={handleSendEmail}
            /> : 
            <button className="btn btn-primary send-btn disabled" style={{width: "100px"}}>Send</button>
          }
            
          </div>
          <div className="error">{errorPackage || errorUser}</div>
        </div>
      </div>
      <div className="filter">
        <div className="filter-item">
          Status:
          <NormalDropdown
            onChange={(option) => {
              setSelectedStatus(option);
              setPage(1);
            }}
            values={statusValues}
            defaultValue={"active"}
          />
        </div>
        <div className="filter-item">
          Promotional Email:
          <NormalDropdown
            onChange={(option) => {
              setSelectedEmailedValue(option);
              setPage(1);
            }}
            values={emailedValues}
          />
        </div>
      </div>

      {/* table  */}
      {loading ? (
        <ContentTable
          columns={tableColumn}
          loading={true}
          scroll={{ y: 1200 }}
        />
      ) : (
        <>
        <ContentTable
          columns={tableColumn}
          data={tableData}
          scroll={{ y: 1200 }}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
        />
                {leadsData?.pagination && (
          <PaginationSection
            currentPage={leadsData?.pagination?.currentPage}
            hasNext={leadsData?.pagination?.hasNext}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
          />
        )}
        </>
        
      )}

      {/* modal  */}
      <ConfirmationModal
        show={showConfirmationModal}
        handleClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmDelete}
        delete
        isSubmitting={isDeleting}
      />
    </div>
  );
}
