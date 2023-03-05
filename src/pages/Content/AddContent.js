//built-in modules
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";

//custom
import { TextField } from "../../components/Form/TextField";
import { Editor } from "../../components/Form/Editor";
import {
  createReadValidation,
  createWatchValidation,
  createScrollValidation,
} from "../../validation/createContentValidation";
import { createContent } from "../../api/contentApi";
import toastMessage from "../../components/ToastMessage";
import "./content.css";
import Label from "../../components/Label";
import { read, scroll, watch} from "../../components/ContentTypes";
import { Link, useNavigate } from "react-router-dom";
import { TailSpinLoader, ThreeDotsLoader } from "../../components/Loader";
import NormalDropdown from "../../components/Dropdown/NormalDropdown";
import { getAllCategory } from "../../api/categoryApi";
import { contentAdmin, contentContributor } from "../../routes";
import { getAllUser } from "../../api/userApi";
import SpinnerButton from "../../components/Button/SpinnerButton";

function AddContent() {
  const [loading, setLoading] = useState(false);
  const [pageLoad, setPageLoad] = useState(false);
  const [editorData, setEditorData] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [errorImage, setErrorImage] = useState("");
  const [errorPhoto, setErrorPhoto] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [errorCategory, setErrorCategory] = useState("");
  const [errorType, setErrorType] = useState("");
  const [image, setImage] = useState();
  const [photo, setPhoto] = useState();
  const [imageURL, setImageURL] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const getUser = JSON.parse(localStorage.getItem("user"));
  const [featured, setFeatured] = useState(0);
  const [yesChecked, setYesChecked] = useState(false);
  const [noChecked, setNoChecked] = useState(true);
  const [selectedSubmit, setSelectedSubmit] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [selectedContributorId, setSelectedContributorId] = useState("");
  const [userData, setUserData] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [fileUploading, setFileUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const categoryList = categories.map((item) => ({
    name: item.title,
    option: item.id,
  }));

  const contributorList = userData.map((item) => ({
    name:
      item.firstName && item.middleName && item.lastName
        ? item.firstName + " " + item.middleName + " " + item.lastName
        : item.firstName && item.lastName
          ? item.firstName + " " + item.lastName
          : item.firstName
            ? item.firstName
            : "",
    option: item.id,
  }));

  const categoryValues = [
    { name: "Select a category", option: "" },
    ...categoryList,
  ];

  const contributorValues = [
    { name: "Select a contributor", option: "" },
    ...contributorList,
  ];
 
  useEffect(async () => {
    setPageLoad(true);
    try {
      const data = { page: 1, limit: 50 };
      const response = await getAllCategory(data);
      setCategories(response?.data?.data?.category);

      const userData = {
        userType: "contributor",
        status: "active",
        page: 1,
        limit: 50,
        // country:"",
        // hasSubscription: "",
        // email:""
      };
      const userResponse = await getAllUser(userData);
      setUserData(userResponse.data.data.users);
    } catch (error) {
      console.log("error", error);
    }
    setPageLoad(false);
  }, []);

  useEffect(() => {
    if (image) {
      const imageUrl = URL.createObjectURL(image);
      setImageURL(imageUrl);
      setImageLoading(false);
    }
    if (photo) {
      const imageUrl = URL.createObjectURL(photo);
      setPhotoURL(imageUrl);
      setPhotoLoading(false);
    }
  }, [image, photo]);

  useEffect(() => {
    if (editorData) {
      setErrorDescription("");
    }
  }, [editorData]);

  const handleSubmit = async (values, { resetForm }) => {
    if (!errorType && wordCount < 100) {
      let isValid = false;
      if (
        selectedType === scroll.type &&
        !errorPhoto &&
        !errorDescription &&
        !errorCategory
      ) {
        isValid = true;
      }
      if (
        selectedType !== scroll.type &&
        !errorImage &&
        !errorDescription &&
        !errorCategory
      ) {
        isValid = true;
      }
      if (isValid) {
        selectedSubmit === "savePublish"
        ? setIsPublishing(true)
        : setIsSaving(true);
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("content", editorData);
        formData.append("type", selectedType);
        formData.append("group","default")
        formData.append(
          "status",
          selectedSubmit === "savePublish" ? "published" : "pending"
        );
        {
          selectedContributorId &&
            formData.append("contributorId", selectedContributorId);
        }
        {
          excerpt && formData.append("excerpt", excerpt);
        }

        formData.append("categoryId", selectedCategory);
        if (selectedType === read.type) {
          formData.append("bannerImg", image);
          formData.append("featured", featured);
        }
        if (selectedType === watch.type) {
          formData.append("externalLink", values.link);
          formData.append("bannerImg", image);
          formData.append("featured", featured);
        }
        if (selectedType === scroll.type) {
          formData.append("photo", photo);
        }

        try {
          await createContent(formData);
          toastMessage({
            type: "success",
            message: "Successfully created content",
          });

          resetForm();
          setSelectedType("");
          setEditorData("");
          setErrorImage("");
          setErrorPhoto("");
          setImageURL("");
          setErrorDescription("");
          setErrorCategory("");
          setImage();
          if (getUser?.userType === "admin") {
            navigate(contentAdmin);
          }
          if (getUser?.userType === "contributor") {
            navigate(contentContributor);
          }
        } catch (error) {
          console.log(error);
          toastMessage({
            type: "error",
            message: "Failed to create content",
          });
        }
        setSelectedSubmit("");
        selectedSubmit === "savePublish"
        ? setIsPublishing(false)
        : setIsSaving(false);
      }
    }
  };

  const changeFeaturedCheck = (e) => {
    if (e.target.value === "yes") {
      setFeatured(1);
      setNoChecked(false);
      setYesChecked(true);
    } else {
      setFeatured(0);
      setYesChecked(false);
      setNoChecked(true);
    }
  };

  const handleOtherValidation = () => {
    if (selectedType === scroll.type) {
      if (!photo && !editorData && !selectedCategory && !selectedType) {
        setErrorDescription("Description is required !");
        setErrorPhoto("Photo is required !");
        setErrorCategory("Category is required !");
        setErrorType("Content Type is required !");
      } else if (!photo) {
        setErrorPhoto("Photo is required !");
      } else if (!editorData) {
        setErrorDescription("Description is required !");
      } else if (!selectedCategory) {
        setErrorCategory("Category is required !");
      } else if (!selectedType) {
        setErrorType("Content Type is required !");
      }
    } else {
      if (!image && !editorData && !selectedCategory && !selectedType) {
        setErrorDescription("Description is required !");
        setErrorImage("Banner Image is required !");
        setErrorCategory("Category is required !");
        setErrorType("Content Type is required !");
      } else if (!image) {
        setErrorImage("Banner Image is required !");
      } else if (!editorData) {
        setErrorDescription("Description is required !");
      } else if (!selectedCategory) {
        setErrorCategory("Category is required !");
      } else if (!selectedType) {
        setErrorType("Content Type is required !");
      }
    }
  };

  useEffect(() => {
    const words = excerpt?.split(/\s+/);
    setWordCount(words?.length - 1);
  }, [excerpt]);

  const typeValues = [
    { name: "Select Content Type", option: "" },
    { name: read.name, option: read.type },
    { name: watch.name, option: watch.type },
    { name: scroll.name, option: scroll.type }
  ];

  return (
    <>
      {!pageLoad ? (
        <div className="row mt-0">
          <Link
            to={
              getUser.userType === "admin"
                ? contentAdmin
                : getUser.userType === "contributor"
                  ? contentContributor
                  : ""
            }
            className="text-decoration-underline mb-2 top-link"
          >
            {" "}
            Back to view contents
          </Link>
          <h4>Content Add</h4>
          <div className="d-flex flex-row gap-5 align-items-center">
            <div>
              <Label
                html="contentType"
                title="Select content type"
                mandatory={"true"}
              />
              <NormalDropdown
                onChange={(option) => {
                  setSelectedType(option);
                  setErrorType("");
                }}
                values={typeValues}
                width={200}
                className="mx-0"
              />
              {errorType && (
                <div className="error text-danger" style={{ fontSize: "14px" }}>
                  {errorType}
                </div>
              )}
            </div>
            {getUser.userType === "admin" && (
              <div>
                <Label html={"contributor"} title={"Select a contributor"} />
                <NormalDropdown
                  onChange={(option) => {
                    setSelectedContributorId(option);
                  }}
                  values={contributorValues}
                  width={250}
                  className="mx-0"
                />
              </div>
            )}
          </div>

          <Formik
            initialValues={{
              title: "",
              link: "",
            }}
            validationSchema={
              selectedType === read.type
                ? createReadValidation
                : selectedType === watch.type
                  ? createWatchValidation
                  : createScrollValidation
            }
            onSubmit={(values, { resetForm }) =>
              handleSubmit(values, { resetForm })
            }
          >
            {(field) => (
              <Form>
                <div className="col-8">
                  <TextField
                    label={"Title"}
                    name={"title"}
                    type={"text"}
                    mandatory
                  />
                  {selectedType === watch.type && (
                    <TextField
                      label={"External Link"}
                      name={"link"}
                      type={"text"}
                      mandatory
                    />
                  )}

                  {selectedType === scroll.type ? (
                    // photo section--for scroll type

                    <div className="mt-2 d-flex flex-column">
                      <Label html={"photo"} title={"Photo"} mandatory />
                      {photoLoading ? (
                        <ThreeDotsLoader />
                      ) : (
                        <>
                          {photoURL && (
                            <img
                              className="img-thumbnail image-view"
                              src={photoURL}
                              alt="#"
                            />
                          )}
                        </>
                      )}
                      <input
                        className={`form-control shadow-none mt-1 ${errorPhoto && "is-invalid"
                          }`}
                        id="banner"
                        type="file"
                        name="photo"
                        autoComplete="off"
                        onChange={(e) => {
                          setPhoto(e.target.files[0]);
                          setErrorPhoto("");
                          setPhotoLoading(true);
                        }}
                      />
                      {errorPhoto && (
                        <div
                          className="error"
                          style={{ fontSize: "12px", color: "red" }}
                        >
                          {errorPhoto}
                        </div>
                      )}
                    </div>
                  ) : (
                    // banner image section

                    <div className="mt-2 d-flex flex-column">
                      <Label html={"banner"} title={"Banner Image"} mandatory />
                      {imageLoading ? (
                        <ThreeDotsLoader />
                      ) : (
                        <>
                          {imageURL && (
                            <img
                              className="img-thumbnail image-view"
                              src={imageURL}
                              alt="#"
                            />
                          )}
                        </>
                      )}
                      <input
                        className={`form-control shadow-none mt-1 ${errorImage && "is-invalid"
                          }`}
                        id="banner"
                        type="file"
                        name="banner"
                        autoComplete="off"
                        onChange={(e) => {
                          setImage(e.target.files[0]);
                          setErrorImage("");
                          setImageLoading(true);
                        }}
                      />
                      {errorImage && (
                        <div
                          className="error"
                          style={{ fontSize: "12px", color: "red" }}
                        >
                          {errorImage}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-2">
                    <Label
                      html={"category"}
                      title={"Select a category"}
                      mandatory
                    />
                    <NormalDropdown
                      onChange={(option) => {
                        setSelectedCategory(option);
                        setErrorCategory("");
                      }}
                      values={categoryValues}
                      width={250}
                      className="mx-0"
                    />
                    {errorCategory && (
                      <div
                        className="error"
                        style={{ fontSize: "12px", color: "red" }}
                      >
                        {errorCategory}
                      </div>
                    )}
                  </div>
                  {selectedType !== scroll.type && (
                    <div className="mt-2 mb-1">
                      <span>Featured</span>
                      <div
                        className="select-type"
                        style={{ cursor: "pointer" }}
                      >
                        <div style={{ cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            id={"yes"}
                            name={"yes"}
                            checked={yesChecked}
                            value={"yes"}
                            onChange={changeFeaturedCheck}
                            style={{ cursor: "pointer" }}
                          />
                          <label for={"yes"} style={{ cursor: "pointer" }}>
                            Yes
                          </label>
                        </div>

                        <div style={{ cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            id={"no"}
                            name={"no"}
                            checked={noChecked}
                            value={"no"}
                            onChange={changeFeaturedCheck}
                            style={{ cursor: "pointer" }}
                          />
                          <label for={"no"} style={{ cursor: "pointer" }}>
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  <Editor
                    label="Description"
                    name={"description"}
                    editorData={editorData}
                    setEditorData={setEditorData}
                    setErrorDescription
                    fileUploading={fileUploading}
                    setFileUploading={setFileUploading}
                    mandatory
                  />
                  {errorDescription && (
                    <div
                      className="error"
                      style={{ fontSize: "12px", color: "red" }}
                    >
                      {errorDescription}
                    </div>
                  )}

                  <div className="d-flex flex-column my-2">
                    <label>Excerpt :</label>
                    <textarea
                      type="text"
                      rows={5}
                      value={excerpt}
                      onChange={(e) => {
                        setExcerpt(e.target.value);
                      }}
                      className="excerpt-area mt-1"
                    />
                    <div className="d-flex justify-content-between">
                      <p className={wordCount > 99 ? "text-danger" : ""}>
                        Should be less than 100 characters.
                      </p>
                      <div>
                        <span className={wordCount > 99 ? "text-danger" : ""}>
                          {wordCount}{" "}
                        </span>
                        /100
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-row gap-2">
                    {isPublishing || fileUploading ? (
                      <button
                        type="submit"
                        className="btn btn-primary mt-3"
                        disabled
                      >
                        {" "}
                        Save
                      </button>
                    ) : (
                      <SpinnerButton
                        className="btn btn-primary mt-3"
                        title="Save"
                        isSubmitting={isSaving}
                        onClick={() => {
                          setSelectedSubmit("save");
                          handleOtherValidation();
                        }}
                      />
                    )}

                    {getUser.userType === "admin" && (
                      <>
                        {isSaving || fileUploading ? (
                          <button
                            type="submit"
                            className="btn btn-success mt-3"
                            disabled
                          >
                            Save and Publish
                          </button>
                        ) : (
                          <SpinnerButton
                            className="btn btn-success mt-3"
                            title="Save and Publish"
                            isSubmitting={isPublishing}
                            onClick={() => {
                              setSelectedSubmit("savePublish");
                              handleOtherValidation();
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <TailSpinLoader />
      )}
    </>
  );
}

export default AddContent;
