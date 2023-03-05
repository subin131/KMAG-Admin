// user table columns
import { Space, Image } from "antd";
import { NotVerified, Paid, UnPaid, Verified } from "../components/Icons";

const regex = /(<([^>]+)>)/gi;

//table data

export const categoryColumns = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    width: "8%",
  },
  {
    title: "Name",
    dataIndex: "title",
    key: "title",
    width: "20%",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "8%",
    render: (text) => <a className="capitalize">{text}</a>,
  },
];

export const userColumns = [
  {
    title: "S/N",
    dataIndex: "index",
    key: "index",
    width: "5%",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (text, record) => (
      <div className="d-flex flex-direction-row flex-wrap align-items-center">
        {record.email}
        {record.email !== "Not Avaliable" && (
          <>{record.emailVerified == 1 ? <Verified tip={"Verified"}/> : <NotVerified tip={"Not Verified"}/>}</>
        )}
      </div>
    ),
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    render: (text, record) => (
      <div className="d-flex flex-direction-row flex-wrap align-items-center">
        {record.phoneNumber}
        {record.phoneNumber !== "Not Avaliable" && (
          <>{record.phoneVerified == 1 ? <Verified tip={"Verified"}/> : <NotVerified tip={"Not Verified"}/>}</>
        )}
      </div>
    ),
  },
  {
    title: "User Type",
    dataIndex: "userType",
    key: "userType",
    width: "10%",
    render: (text, record) => (
      <>
        <div className="d-flex flex-direction-row flex-wrap align-items-center">
          <a>{text?.charAt(0).toUpperCase() + text?.slice(1)}</a>

          {record.hasSubscription == 1 ? <Verified tip={"Paid"}/> : <NotVerified tip={"Unpaid"}/>}
        </div>
      </>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "10%",
    render: (text) => <a className="capitalize">{text}</a>,
  },
];

// Subscription table

export const subscriptionColumns = [
  {
    title: "S/N",
    dataIndex: "index",
    key: "index",
    width: "5%",
  },
  {
    title: "User",
    dataIndex: "userName",
    key: "userName",
  },
  {
    title: "Package",
    dataIndex: "packageName",
    key: "packageName",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    width: "10%",
    render: (record, text) => (
      <a>
        {text.currency === "NPR"
          ? "Nrs."
          : text.currency === "USD"
          ? "$"
          : text.currency}
        {" " + text.amount}
      </a>
    ),
  },
  {
    title: "Payment Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "10%",
    render: (text) => <a className="capitalize">{text}</a>,
  },
  {
    title: "Activated Date",
    dataIndex: "startDate",
    key: "startDate",
    render: (text) => <a>{text.split("T")[0]}</a>,
  },
  {
    title: "Expiry Date",
    dataIndex: "endDate",
    key: "endDate",
    render: (text) => <a>{text.split("T")[0]}</a>,
  },
];

export const packageColumns = [
  {
    title: "S/N",
    dataIndex: "index",
    key: "index",
    width: "5%",
  },
  {
    title: "Name",
    dataIndex: "title",
    key: "title",
    width: "20%",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    width: "10%",
    render: (record, text) => (
      <a>
        {text.currency === "USD" ? "$ " : "Nrs. "}
        {text.amount}
      </a>
    ),
  },
  {
    title: "Duration",
    dataIndex: "duration",
    key: "duration",
    width: "10%",
    render: (text) => <a>{text} days</a>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "10%",
    render: (text) => <a className="capitalize">{text}</a>,
  },
];

export const contentColumns = [
  {
    title: "S/N",
    dataIndex: "key",
    key: "key",
    width: "8%",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: "40%",
  },

  {
    title: "Posted By",
    dataIndex: "postedBy",
    key: "postedBy",
    width: "20%",
  },
  {
    title: "Category",
    dataIndex: "categoryName",
    key: "categoryName",
    width: "20%",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: "15%",
    render: (text) => <a className="capitalize">{text}</a>,
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "15%",
    render: (text) => <a className="capitalize">{text}</a>,
  },
  {
    title: "Views",
    dataIndex: "readCount",
    key: "readCount",
    width: "10%",
    render: (text) => <a>{text ? text : 0}</a>,
  },

  {
    title: "Banner Image",
    dataIndex: "bannerImg",
    key: "bannerImg",
    width: "16%",
    render: (text, record) => (
      <Space size="middle">
        <Image width={90} src={record.bannerImg} />
      </Space>
    ),
  },
  {
    title: "Photo",
    dataIndex: "photo",
    key: "photo",
    width: "16%",
    render: (text, record) => (
      <Space size="middle">
        <Image width={80} src={record.photo} />
      </Space>
    ),
  },
];

export const discussionColumns = [
  {
    title: "S/N",
    dataIndex: "index",
    key: "index",
    width: "5%",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: "30%",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: "30%",
    ellipsis: true,
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    width: "15%",
    ellipsis: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "10%",
    render: (text) => <a className="capitalize">{text}</a>,
  },
];

export const cardColumns = [
  {
    title: "S/N",
    dataIndex: "index",
    key: "index",
    width: "5%",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: "20%",
  },
  {
    title: "Package",
    dataIndex: "packageName",
    key: "packageName",
    width: "20%",
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
    width: "15%",
  },
  {
    title: "Expiry Date",
    dataIndex: "expiryDate",
    key: "expiryDate",
    width: "15%",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "15%",
    render: (text) => <a className="capitalize">{text}</a>,
  },
];
export const columnOfferAndAnnouncement = [
  {
    title: "S/N",
    dataIndex: "key",
    key: "key",
    width: "8%",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: "40%",
  },
  {
    title: "Posted By",
    dataIndex: "postedBy",
    key: "postedBy",
    width: "30%",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: "15%",
    render: (text) => <a className="capitalize">{text}</a>,
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "15%",
    render: (text) => <a className="capitalize">{text}</a>,
  },
  {
    title: "Views",
    dataIndex: "readCount",
    key: "readCount",
    width: "15%",
    render: (text) => <a>{text ? text : 0}</a>,
  },

  {
    title: "Banner Image",
    dataIndex: "bannerImg",
    key: "bannerImg",
    width: "16%",
    render: (text, record) => (
      <Space size="middle">
        <Image width={90} src={record.bannerImg} />
      </Space>
    ),
  },
];

export const leadsColumns = [
  {
    title: "S/N",
    dataIndex: "index",
    key: "index",
    width: "5%",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: "25%",
    render: (text, record) => (
      <div className="d-flex flex-direction-row flex-wrap align-items-center">
        {record.email}
        {record.email !== "Not Avaliable" && (
          <>{record.promotionalEmail == 1 ? <Verified tip={"Email Sent"}/> : <NotVerified tip={"Email Not Sent"}/>}</>
        )}
      </div>
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "10%",
    render: (text) => <a className={`capitalize ${text == "inactive" ? "text-danger" : "text-success"}`}>{text}</a>,
  },
];

export const columnBookList = [
  {
    title: "S/N",
    dataIndex: "key",
    key: "key",
    width: "8%",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: "50%",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "10%",
    render: (text) => <a>{text?.charAt(0).toUpperCase() + text?.slice(1)}</a>,
  },
];

