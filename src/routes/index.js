import { UserOutlined, SoundOutlined } from "@ant-design/icons";
import { BiBookContent, BiCategoryAlt } from "react-icons/bi";
import { MdAddTask , MdOutlineLocalOffer } from "react-icons/md";
import { BsCardText } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import { AiFillNotification , AiFillHome , AiOutlineShop } from 'react-icons/ai';
import {IoIosBook} from 'react-icons/io';

const dashboard = "/admin/dashboard";
export const contentAdmin = `${dashboard}/content`
const contributorDashboard = "/contributor/dashboard";
export const contentContributor = `${contributorDashboard}/content`;

export const routes = [
  { path: `${dashboard}`, name: "Home", icon: <AiFillHome /> },
  { path: `${dashboard}/category`, name: "Category", icon: <BiCategoryAlt /> },
  { path: `${dashboard}/content`, name: "Content", icon: <BiBookContent /> },
  { path: `${dashboard}/discussion`, name: "Discussion", icon: <SoundOutlined /> },
  { path: `${dashboard}/subscription`, name: "Subscription", icon: <MdAddTask /> },
  { path: `${dashboard}/user`, name: "User", icon: <UserOutlined /> },
  { path: `${dashboard}/card`, name: "Card", icon: <BsCardText /> },
  { path: `${dashboard}/offer-and-announcement`, name: "Offer and Announcement", icon: <MdOutlineLocalOffer /> },
  { path: `${dashboard}/notification`, name: "Notification", icon: <AiFillNotification /> },
  { path: `${dashboard}/leads`, name: "Leads", icon: <AiOutlineShop /> },
  {path:`${dashboard}/book`, name: "Books", icon: <IoIosBook />},
  { path: `${dashboard}/settings`, name: "Settings", icon: <FiSettings /> }
];

export const addContentAdmin = `${dashboard}/content/add`;
export const addContentContributor = `${contributorDashboard}/content/add`;

export const contributorRoutes = [
  { path: `${contributorDashboard}/content`, name: "Content", icon: <BiBookContent /> },
];
