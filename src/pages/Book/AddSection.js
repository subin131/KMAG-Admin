import React, { useState, useEffect } from "react";
import { TailSpinLoader } from "../../components/Loader";
import Label from "../../components/Label";
import toastMessage from "../../components/ToastMessage";
import { addSection } from "../../api/readApi";
import TextFieldBook from "../../components/Form/TextFieldBook";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getContentForSection } from "../../api/contentApi";
import { InputDropdown } from "../../components/Dropdown/InputDropdown";
import SpinnerButton from "../../components/Button/SpinnerButton";

function AddSection() {
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const navigate = useNavigate();
  const [errorDescription, setErrorDescription] = useState("");
  const [description, setDescription] = useState("");
  const [title, settitle] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorType, setErrorType] = useState("");
  const [errorSectionNum, setErrorSectionNum] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sectionNumber, setSectionNumber] = useState("");
  const [contentArray, setContentArray] = useState([]);
  const { bookId, chapterId } = useParams();
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState(false);

  const fetchData = async () => {
    setContentLoading(true);
    try {
      const data = {
        limit: 50,
        search: searchText,
      };
      const response = await getContentForSection(data);
      setContentArray(response?.data?.data?.content);
    } catch (error) {
      console.log("error", error);
    }
    setContentLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (search) {
      const delayDebounceFn = setTimeout(() => {
        fetchData();
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
      setErrorType("Content is required");
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
        const reponse = await addSection(formData, chapterId);
        toastMessage({
          type: "success",
          message: "Section Added Successfully",
        });
        if (reponse.status === 200) {
          navigate(
            `/admin/dashboard/book/chapter/section/${bookId}/${chapterId}?status=inactive`
          );
        }
      } catch (error) {
        console.log(error);
        toastMessage({
          type: "error",
          message: "Failed to add section",
        });
      }
      setLoading(false);
    }
  };

  const typeValues = contentArray?.map((item) => ({
    name: item?.title,
    option: item?.id,
  }));

  const values = [{ name: "Select a content", option: "" }, ...typeValues];

  return (
    <div className="row mt-0">
      <Link
        to={`/admin/dashboard/book/chapter/section/${bookId}/${chapterId}`}
        className="go-back"
      >
        Back to Sections
      </Link>
      <h4>Section Add</h4>
      <div className="col-8">
        <TextFieldBook
          label={"Title"}
          name={"title"}
          type={"text"}
          value={title}
          onChange={(e) => {
            settitle(e.target.value);
            setErrorTitle("");
          }}
          mandatory
        />
        {errorTitle ? <span className="text-danger">{errorTitle}</span> : ""}
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
            values={values}
            filterOption={false}
            loading={contentLoading}
            width={600}
            className="mx-0"
          />
          {errorType && <div className="text-danger">{errorType}</div>}
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
        {errorSectionNum && (
          <span className="text-danger">{errorSectionNum}</span>
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
            className="btn btn-primary mt-3"
            isSubmitting={loading}
            onClick={() => {
              handleSubmit();
            }}
            title={"Save"}
          />
        </div>
      </div>
    </div>
  );
}

export default AddSection;
