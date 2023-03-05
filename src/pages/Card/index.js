//built-in
import React, { useEffect, useState } from "react";

//custom
import { getAllCards } from "../../api/cardApi";
import ContentTable from "../../components/Table";
import { cardColumns } from "../../constant/tableColumns";
import NormalDropdown from "../../components/Dropdown/NormalDropdown";
import { getAllPackages } from "../../api/subscripitonApi";
import GenerateCard from "../../components/GenerateCard";
import PaginationSection from "../../components/Pagination";

function Card() {
  const [loading, setLoading] = useState(false);
  const [cardsData, setCardsData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [packages, setPackages] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);
  const [createdTime,setCreatedTime] = useState('')

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = {
        status: selectedStatus,
        packageId: selectedPackage,
        page: page,
      };
      const response = await getAllCards(data);
      setCardsData(response?.data?.data);
    } catch (error) {
      console.log("error", error);
    }

    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [selectedPackage, selectedStatus, page]);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const data = { status: "active", page: 1, limit: "1000000" };
        const response = await getAllPackages(data);
        setPackages(response?.data?.data?.package);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchPackage();
  }, []);



  const tableData = cardsData?.card?.map((item, i) => ({
    ...item,
    index: ((page - 1) * 10) + i + 1,
    packageName: item?.package?.title,
  }));

  const tableColumn = cardColumns;

  const statusValues = [
    { name: "All", option: "" },
    { name: "Active", option: "active" },
    { name: "Expired", option: "expired" },
  ];

  const dropdownPackages = packages?.map((item) => ({
    name: `${item.title} (${item.currency})`,
    option: item.id,
  }));

  const packageValues = [{ name: "All", option: "" }, ...dropdownPackages];

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  return (
    <div>
      <h3>Card</h3>
      <div>
        <GenerateCard
          dropdownPackages={dropdownPackages}
          fetchCards={fetchData}
        />
      </div>

      <div className="d-flex flex-row p-1" style={{ border: "1px solid lightgrey" }}>
        <div className="d-flex flex-row align-items-center">
          Status:
          <NormalDropdown
            onChange={(option) => {
              setSelectedStatus(option);
            }}
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

      {/* table  */}
      {loading ? (
        <ContentTable
          columns={tableColumn}
          loading={true}
          scroll={{ y: 1200 }}
        />
      ) : (
        <ContentTable
          columns={tableColumn}
          data={tableData}
          scroll={{ y: 1200 }}
        />
      )}

      {/* pagination */}
      {cardsData?.pagination && (
        <PaginationSection
          currentPage={cardsData?.pagination?.currentPage}
          hasNext={cardsData?.pagination?.hasNext}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
        />
      )}

      {/* gererate card modal  */}
      {/* <AddCardModal
        show={showAddModal}
        handleClose={handleCloseModal}
        dropdownPackages={dropdownPackages}
        fetchCards = {fetchData}
      /> */}
    </div>
  );
}

export default Card;
