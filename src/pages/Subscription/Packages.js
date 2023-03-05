// built-in modules
import React, { useEffect, useState } from "react";
import { Space } from "antd";

// custom modules
import { getAllPackages } from "../../api/subscripitonApi";
import ContentTable from "../../components/Table";
import { packageColumns } from "../../constant/tableColumns";
import NormalDropdown from "../../components/Dropdown/NormalDropdown";
import PaginationSection from "../../components/Pagination";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [packageArray , setPackageArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [page, setPage] = useState(1);
  
  const packageColumn = [
    ...packageColumns,
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (text, record) => (
    //     <Space size="middle">
    //       <a className="btn-primary table-button">View</a>
    //     </Space>
    //   ),
    // },
  ];

  const packageData = packageArray?.map((item, i) => ({
    index: (page - 1) * 10 + i + 1,
    ...item,
  }));

  const fetchPackage = async () => {
    setLoading(true);
    try {
      const data = { status: selectedStatus, page: page };
      const response = await getAllPackages(data);
      setPackages(response.data.data);
      const sortPackage = response.data.data?.package?.sort((a,b)=>a.duration - b.duration);
      setPackageArray(sortPackage)
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPackage();
  }, [selectedStatus, page]);

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

  return (
    <>
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
          />
        </div>
      </div>

      {loading ? (
        <ContentTable columns={packageColumn} loading scroll={{ y: 450 }} />
      ) : (
        <ContentTable
          columns={packageColumn}
          data={packageData}
          scroll={{ y: 450 }}
        />
      )}

      {/* pagination  */}
      {packages?.pagination && (
        <PaginationSection
          currentPage={packages?.pagination?.currentPage}
          hasNext={packages?.pagination?.hasNext}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
        />
      )}
    </>
  );
}
