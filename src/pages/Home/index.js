import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BarChartComp, LineChartComp } from "../../components/Chart";
import {
  getUserGraph,
  getContentGraph,
  getSubscriptionGraph,
  getAppDetails,
} from "../../api/userApi";
import "./Home.css";
import { TailSpinLoader } from "../../components/Loader";
import Card from "../Card";
import CardLayout from "../../components/Card";
import { FiUsers } from "react-icons/fi";
import { BiBookContent } from "react-icons/bi";
import { BiCategoryAlt } from "react-icons/bi";
import { IoIosBook } from "react-icons/io";

function Home() {
  const [userGraph, setUserGraph] = useState([]);
  const [subscriptionGraph, setSubscriptionGraph] = useState([]);
  const [contentGraph, setContentGraph] = useState([]);
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [userData, setuserData] = useState({});
  const [contentData, setContentData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [bookData, setBookData] = useState({});

  //object of user

  const fetchUserGraph = async () => {
    setLoadingGraph(true);
    try {
      const response = await getUserGraph();
      setUserGraph(response?.data?.data);
    } catch (error) {
      console.log("error", error);
    }
    setLoadingGraph(false);
  };

  const fetchContentGraph = async () => {
    setLoadingContent(true);
    try {
      const response = await getContentGraph();
      setContentGraph(response?.data?.data);
    } catch (error) {
      console.log("error", error);
    }
    setLoadingContent(false);
  };

  const fetchSubscriptionGraph = async () => {
    setLoadingSubscription(true);
    try {
      const response = await getSubscriptionGraph();
      setSubscriptionGraph(response?.data?.data);
    } catch (error) {
      console.log("error", error);
    }
    setLoadingSubscription(false);
  };

  const fetchAppDetails = async () => {
    setLoadingData(true);
    try {
      const response = await getAppDetails();
      setuserData(response.data.data.user);
      setContentData(response.data.data.content);
      setCategoryData(response.data.data.category);
      setBookData(response.data.data.book);
    } catch (error) {
      console.log("error", error);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    fetchUserGraph();
    fetchContentGraph();
    fetchSubscriptionGraph();
    fetchAppDetails();
  }, []);

  const usersData = userGraph.map((item) => ({
    month: item.month,
    user: item.count,
  }));

  const subscriptionsData = subscriptionGraph.map((item) => ({
    month: item.month,
    rupees: item.type?.NPR?.amount,
    dollar: item.type?.USD?.amount,
  }));

  const contentsData = contentGraph.map((item) => ({
    month: item.month,
    read: item.type?.read,
    scroll: item.type?.scroll,
    watch: item.type?.watch,
  }));

  const usersLine = [{ lineFor: "user", color: "#8884d8" }];
  const subscriptionsLine = [
    { lineFor: "rupees", color: "#581845" },
    { lineFor: "dollar", color: "#335DFF" },
  ];

  const contentsLine = [
    { lineFor: "read", color: "#FF1010 " },
    { lineFor: "scroll", color: "#AFC3DF" },
    { lineFor: "watch", color: "#030C62" },
  ];

  return (
    <>
      {!loadingGraph &&
      !loadingContent &&
      !loadingSubscription &&
      !loadingData ? (
        <div>
          <Container
            style={{
              width: "100%",
              height: "15rem",
              display: "flex",
              alignItems: "center",
              marginBottom: "150px",
              padding: "10px",
            }}
          >
            <Row style={{ width: "100%", height: "7rem" }}>
              <Col>
                <CardLayout
                  flag="true"
                  icon={<FiUsers />}
                  title=" Total User"
                  value={userData.totalUsers}
                  subTitle1="Active "
                  subValue1={userData.totalActiveUser}
                  subTitle2="Inactive"
                  subValue2={userData.totalInactiveUser}
                  subTitle3="Subscribed"
                  subValue3={userData.totalSubscribedUsers}
                  color=" #202939"
                />
              </Col>
              <Col>
                <CardLayout
                  flag="true"
                  icon={<BiBookContent />}
                  title="Total Content"
                  value={contentData.totalContent}
                  subTitle1="Published "
                  subValue1={contentData.totalPublishedContent}
                  subTitle2="Unpublished "
                  subValue2={contentData.totalUnpublishedContent}
                  subTitle3="Pending"
                  subValue3={contentData.totalPendingContent}
                  color="#D8232F"
                />
              </Col>
              <Col>
                <CardLayout
                  flag="true"
                  icon={<BiCategoryAlt />}
                  title="Total Category"
                  value={categoryData.totalCategory}
                  subTitle1="Active "
                  subValue1={categoryData.totalActiveCategory}
                  subTitle3="Deleted "
                  subValue3={categoryData.totalDeletedCategory}
                  color=" #202939"
                />
              </Col>
            </Row>
          </Container>
          {/* //book data */}
          <Container
            style={{
              width: "100%",
              height: "15rem",
              display: "flex",
              justifyContent: "center",
              marginBottom: "100px",
              padding: "10px",
            }}
          >
            <Row>
              <Col>
                <CardLayout
                  icon={<IoIosBook />}
                  title=" Total Book"
                  value={bookData?.totalBook}
                  subTitle1="Active "
                  subValue1={bookData?.totalActiveBook}
                  subTitle3="Inactive "
                  subValue3={bookData?.totalInactiveBook}
                  color=" grey"
                />
              </Col>
            </Row>
          </Container>

          <div className="homepage">
            <div>
              <LineChartComp
                title={"Users"}
                data={usersData}
                xAxis={"month"}
                lines={usersLine}
              />
            </div>
            <div>
              <LineChartComp
                title={"Subscription"}
                data={subscriptionsData}
                xAxis={"month"}
                lines={subscriptionsLine}
              />
            </div>
            <div className="mt-4">
              <BarChartComp
                title={"Content"}
                data={contentsData}
                lines={contentsLine}
                xAxis={"month"}
              />
            </div>
          </div>
        </div>
      ) : (
        <TailSpinLoader />
      )}
    </>
  );
}

export default Home;
