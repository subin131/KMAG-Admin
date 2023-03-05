// built-in modules
import React, { useEffect, useState } from "react";

// custom modules
import { getAllSubscripitons } from "../../api/subscripitonApi";
import NormalDropdown from "../../components/Dropdown/NormalDropdown";
import ContentTable from "../../components/Table";
import { subscriptionColumns } from "../../constant/tableColumns";
import PaginationSection from "../../components/Pagination";
import { getAllPackages } from "../../api/subscripitonApi";

export default function Subscriptions() {
  const [loading, setLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [page, setPage] = useState(1);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("");

  const statusValues = [
    { name: "All", option: "" },
    { name: "Active", option: "active" },
    { name: "Inactive", option: "inactive" },
    { name: "Expired", option: "expired" },
  ];

  const subscriptionTableData = subscriptionData?.subscription?.map(
    (item, i) => ({
      index: (page - 1) * 10 + i + 1,
      ...item,
      packageName: item?.package?.title,
      userName:
        item?.user?.firstName && item?.user?.middleName && item?.user?.lastName
          ? item?.user?.firstName + " " + item?.user?.middleName + " " + item?.user?.lastName
          : item?.user?.firstName && item?.user?.lastName
            ? item?.user?.firstName + " " + item?.user?.lastName
            : item?.user?.firstName
              ? item?.user?.firstName
              : "Not Avaliable",
      paymentMethod: item?.paymentMethod?.name,
      currency: item?.paymentMethod?.currency,
    })
  );

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const data = { status: selectedStatus, package: selectedPackage, page: page, };
      const response = await getAllSubscripitons(data);
      setSubscriptionData(response.data.data);
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscription();
  }, [selectedStatus, page, selectedPackage]);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  //getting all packages
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const data = { status: "active", page: 1, limit: "100" };
        const response = await getAllPackages(data);
        setPackages(response?.data?.data?.package);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchPackage();
  }, []);

  const dropdownPackages = packages?.map((item) => ({
    name: `${item.title} (${item.currency})`,
    option: item.id,
  }
  ));
  const packageValues = [{ name: "All", option: "" }, ...dropdownPackages];


  return (
    <>
      <div
        className="d-flex flex-row p-1"
        style={{ border: "1px solid lightgrey" }}
      >
        <div className="d-flex flex-row align-items-center">
          Status:
          <NormalDropdown
            onChange={(option) => setSelectedStatus(option)}
            values={statusValues}
          />
        </div>
        <div className="d-flex flex-row align-items-center mx-1">
          Package:
          <NormalDropdown
            onChange={(option) => {
              setSelectedPackage(option);
            }}
            values={packageValues}
            width={200}
          />
        </div>
      </div>
      {loading ? (
        <ContentTable
          columns={subscriptionColumns}
          loading
          scroll={{ x: 1500, y: 450 }}
        />
      ) : (
        <ContentTable
          columns={subscriptionColumns}
          data={subscriptionTableData}
          scroll={{ x: 1500, y: 1000 }}
        />
      )}

      {/* pagination  */}
      {subscriptionData?.pagination && (
        <PaginationSection
          currentPage={subscriptionData?.pagination?.currentPage}
          hasNext={subscriptionData?.pagination?.hasNext}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
        />
      )}
    </>
  );
}
