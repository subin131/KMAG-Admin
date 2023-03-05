import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import Label from "../../components/Label";
import NormalDropdown from "../../components/Dropdown/NormalDropdown";
import { addNotification } from "../../api/userApi";
import toastMessage from "../../components/ToastMessage";
import { getContentById } from "../../api/contentApi";
import "./Notification.css";
import { TailSpinLoader, ThreeDotsLoader } from "../../components/Loader";
import SpinnerButton from "../../components/Button/SpinnerButton";
import { getQuestionsById } from "../../api/discussionApi";

function Notification() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [type, setType] = useState("");
  const [contentId, setContentId] = useState("");
  const [contentType, setContentType] = useState("");
  const [loadingContent, setLoadingContent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //errors
  const [titleError, setTitleError] = useState("");
  const [bodyError, setBodyError] = useState("");
  const [typeError, setTypeError] = useState("");
  const navigate = useNavigate();

  const { id, discussionId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    {
      !title && setTitleError("Title is required !");
    }
    {
      !body && setBodyError("Body is required !");
    }
    {
      !type && setTypeError("User Type is required !");
    }
    if (title && body && type) {
      setIsSubmitting(true);
      const formdata = new FormData();
      formdata.append("title", title);
      formdata.append("body", body);
      {imgUrl && formdata.append("imgUrl", imgUrl);}      
      if (discussionId) {
        formdata.append("type", "talk");
      } else {
        formdata.append("type", contentType);
      }
      if(contentId || discussionId){
        formdata.append("contentId", contentId || discussionId);
      }
      const data = {
        body: formdata,
        status: type,
      };

      try {
        const response = await addNotification(data);
        toastMessage({
          type: "success",
          message: "Notification sent successfully",
        });
        setTitle("");
        setBody("");
        setImgUrl("");
        setType("");
        setContentId("");
        setContentType("");
        setTitleError("");
        setBodyError("");
        setTypeError("");
        navigate(-1);
      } catch (error) {
        toastMessage({
          type: "error",
          message: "Failed to send notification ",
        });
        console.log("This is the error", error);
      }
      setIsSubmitting(false);
    }
  };

  const dropValue = [
    { name: "Select user type", option: "" },
    { name: "All", option: "all" },
    { name: "Active ", option: "active" },
  ];

  //get content id
  useEffect(async () => {
    if (id) {
      setLoadingContent(true);
      setContentId(id);
      try {
        const response = await getContentById(id);
        setTitle(response.data.data.title);
        setBody(response.data.data.excerpt);
        setImgUrl(response.data.data.bannerImg || response.data.data.photo);
        setContentType(response.data.data.type);
      } catch (error) {
        console.log("This is error", error);
      }
      setLoadingContent(false);
    }
    if (discussionId) {
      setLoadingContent(true);
      try {
        const response = await getQuestionsById(discussionId);
        setTitle(response.data.data.title);
        setBody(response.data.data.description);
      } catch (error) {
        console.log("This is error", error);
      }

      setLoadingContent(false);
    }
  }, []);

  return (
    <div className="title-notification">
      {!loadingContent ? (
        <>
          <div className="notification-class">
            <h4>Notification</h4>
            <Label title="Title" mandatory={"true"} id="label-notification" />

            <input
              className="form-control shadow-none"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError("");
              }}
            />
          </div>
          {titleError && (
            <div
              className="error text-danger"
              style={{ fontSize: "14px", marginLeft: "10px" }}
            >
              {titleError}
            </div>
          )}
          <div className="notification-class">
            <Label title="Body" mandatory={"true"} id="label-notification" />
            <textarea
              type="text"
              rows={4}
              className="form-control shadow-none"
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setBodyError("");
              }}
            />
          </div>
          {bodyError && (
            <div
              className="error text-danger"
              style={{ fontSize: "14px", marginLeft: "10px" }}
            >
              {bodyError}
            </div>
          )}
          <div className="notification-class">
            <Label title="Image Url" id="label-notification" />
            <input
              className="form-control shadow-none"
              type="text"
              placeholder="image url"
              value={imgUrl}
              onChange={(e) => {
                setImgUrl(e.target.value);
              }}
            />
          </div>
          <div className="notification-dropdown">
            <Label title="User Type" mandatory={"true"} />
            <NormalDropdown
              values={dropValue}
              width={250}
              className="mx-0"
              onChange={(option) => {
                setType(option);
                setTypeError("");
              }}
            />
          </div>
          {typeError && (
            <div
              className="error text-danger"
              style={{ fontSize: "14px", marginLeft: "10px" }}
            >
              {typeError}
            </div>
          )}
          <SpinnerButton
            isSubmitting={isSubmitting}
            className="notification-button"
            onClick={handleSubmit}
            title={"Submit"}
          />
        </>
      ) : (
        <TailSpinLoader />
      )}
    </div>
  );
}

export default Notification;
