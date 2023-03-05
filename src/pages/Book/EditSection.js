import React, { useState, useEffect } from "react";
import { TailSpinLoader } from "../../components/Loader";
import Label from "../../components/Label";
import toastMessage from "../../components/ToastMessage";
import { getSectionById, updateSectionById } from "../../api/readApi";
import TextFieldBook from "../../components/Form/TextFieldBook";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getContentForSection } from "../../api/contentApi";
import { InputDropdown } from "../../components/Dropdown/InputDropdown";
import SpinnerButton from "../../components/Button/SpinnerButton";

function AddSection() {
  const [loading, setLoading] = useState(false);
  const [pageLoad1, setPageLoad1] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const navigate = useNavigate();
  const [errorDescription, setErrorDescription] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorType, setErrorType] = useState("");
  const [errorSectionNum, setErrorSectionNum] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sectionNumber, setSectionNumber] = useState("");
  const [section, setSection] = useState({});
  const { bookId, chapterId, sectionId } = useParams();
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState(false);
  const [contentValues, setContentValues] = useState([
    { name: "Select a content", option: "" },
  ]);
  const [contentArray, setContentArray] = useState([]);
  const [contentTitle, setContentTitle] = useState("");
  const [contentId, setContentId] = useState("");

  const fetchSectionData = async () => {
    setPageLoad1(true);
    try {
      const data = { sectionId: sectionId };
      const response = await getSectionById(data);
      setSection(response.data.data);
      let section = response.data.data;
      setTitle(section.title);
      setDescription(section.description);
      setSectionNumber(section.sectionNumber);
      setSelectedType(section.contentId);
      setContentTitle(section.contentTitle);
      setContentId(section.contentId);
    } catch (error) {
      console.log("error", error);
    }
    setPageLoad1(false);
  };

  useEffect(() => {
    fetchSectionData();
  }, []);

  useEffect(() => {
    fetchContent();
  }, [contentTitle, contentId]);

  const fetchContent = async () => {
    setContentLoading(true);
    try {
      const data = {
        limit: 50,
        search: searchText,
      };
      const response = await getContentForSection(data);
      setContentArray(response?.data?.data?.content);
      let contentArray = response?.data?.data?.content;
      const typeValues = contentArray?.map((item) => ({
        name: item?.title,
        option: item?.id,
      }));
      if (contentTitle && contentId) {
        setContentValues([
          { name: "Select a content", option: "" },
          { name: `${contentTitle}`, option: `${contentId}` },
          ...typeValues,
        ]);
      } else {
        setContentValues([
          { name: "Select a content", option: "" },
          ...typeValues,
        ]);
      }
    } catch (error) {
      console.log("error", error);
    }
    setContentLoading(false);
  };

  useEffect(() => {
    if (search) {
      const delayDebounceFn = setTimeout(() => {
        fetchContent();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchText]);

  const handleSubmit = async () => {
    let isValid = true;
    if (!title) {
      setErrorTitle("Title is required");
      isValid = false;
    }
    if (!sectionNumber) {
      setErrorSectionNum("Section Number is required");
      isValid = false;
    }
    if (!selectedType) {
      setErrorType("Type is required");
      isValid = false;
    }

    if (isValid) {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("sectionNumber", sectionNumber);
      formData.append("contentId", selectedType);

      try {
        const data = { formData, chapterId: chapterId, sectionId: sectionId };
        const reponse = await updateSectionById(data);
        if (reponse.status === 200) {
          toastMessage({
            type: "success",
            message: "Section updated Successfully",
          });
          navigate(
            `/admin/dashboard/book/chapter/section/${bookId}/${chapterId}?status=${
              section?.status == "inactive" ? "inactive" : "active"
            }`
          );
        }
      } catch (error) {
        console.log(error);
        toastMessage({
          type: "error",
          message: "Failed to update section",
        });
      }
      setLoading(false);
    }
  };

  return (
    <>
      {!pageLoad1 ? (
        <div className="row mt-0">
          <Link
            to={`/admin/dashboard/book/chapter/section/${bookId}/${chapterId}`}
            className="go-back"
          >
            Back to Sections
          </Link>
          <h4>Section Edit</h4>
          <div className="col-8">
            <TextFieldBook
              label={"Title"}
              name={"title"}
              type={"text"}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrorTitle("");
              }}
              mandatory
            />
            {errorTitle ? (
              <span className="text-danger">{errorTitle}</span>
            ) : (
              ""
            )}
            {/* //dropdown */}
            <div className="mt-2">
              <Label html={"content"} title={"Select a Content"} mandatory />
              <InputDropdown
                onChange={(option) => {
                  setSelectedType(option);
                  setErrorType("");
                }}
                onSearch={(value) => {
                  setSearch(true);
                  setSearchText(value);
                }}
                searchValue={searchText}
                values={contentValues}
                filterOption={false}
                loading={contentLoading}
                width={600}
                defaultValue={section?.contentId || ""}
                className="mx-0"
              />
              {errorType && (
                <div
                  className="error"
                  style={{ fontSize: "12px", color: "red" }}
                >
                  {errorType}
                </div>
              )}
            </div>
            <TextFieldBook
              label={"Section Number"}
              name={"chapterNumber"}
              type={"number"}
              value={sectionNumber}
              onChange={(e) => {
                setSectionNumber(e.target.value);
                setErrorSectionNum("");
              }}
              mandatory
            />
            {errorSectionNum ? (
              <span className="text-danger">{errorSectionNum}</span>
            ) : (
              ""
            )}

            <div className="d-flex flex-column my-2">
              <label>Description</label>

              <textarea
                type="text"
                rows={5}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrorDescription("");
                }}
                className="excerpt-area mt-1"
              />
              {errorDescription && (
                <span className="text-danger">{errorDescription}</span>
              )}
            </div>

            {/* //button */}

            <div className="d-flex flex-row gap-2">
              <SpinnerButton
                title={"Save"}
                className="btn btn-primary mt-3"
                isSubmitting={loading}
                onClick={() => {
                  handleSubmit();
                }}
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

export default AddSection;
