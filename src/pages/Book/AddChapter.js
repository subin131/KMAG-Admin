import React, { useState, useEffect } from "react";
import { TailSpinLoader, ThreeDotsLoader } from "../../components/Loader";
import NormalDropdown from "../../components/Dropdown/NormalDropdown";
import Label from "../../components/Label";
import toastMessage from "../../components/ToastMessage";
import { getAllCategory } from "../../api/categoryApi";
import { addChapter } from "../../api/readApi";
import { addbook } from "../../api/readApi";
import TextFieldBook from "../../components/Form/TextFieldBook";
import { Link, useNavigate, useParams } from "react-router-dom";
import SpinnerButton from "../../components/Button/SpinnerButton";

function AddChapter() {
  const [loading, setLoading] = useState(false);
  const [pageLoad, setPageLoad] = useState(false);
  const navigate = useNavigate();
  const [errorDescription, setErrorDescription] = useState("");
  const [description, setDescription] = useState("");
  const [title, settitle] = useState("");
  const [author, setAuthor] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorChapterNum, setErrorChapterNum] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const { bookId } = useParams();

  const handleSubmit = async () => {
    let isValid = true;
    if (!title) {
      setErrorTitle("Title is required");
      isValid = false;
    }
    if (!chapterNumber) {
      setErrorChapterNum("Chapter Number is required");
      isValid = false;
    }

    if (isValid) {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("chapterNumber", chapterNumber);
      try {
        const reponse = await addChapter(formData, bookId);
        toastMessage({
          type: "success",
          message: "Chapter Added Successfully",
        });
        if (reponse.status === 200) {
          navigate(`/admin/dashboard/book/chapter/${bookId}?status=inactive`);
        }
      } catch (error) {
        console.log(error);
        toastMessage({
          type: "error",
          message: "Failed to add chapter",
        });
      }
      setLoading(false);
    }
  };

  return (
    <>
      {!pageLoad ? (
        <div className="row mt-0">
          <Link
            to={`/admin/dashboard/book/chapter/${bookId}`}
            className="go-back"
          >
            Back to Chapters
          </Link>
          <h4>Chapter Add</h4>
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
            {errorTitle ? (
              <span className="text-danger">{errorTitle}</span>
            ) : (
              ""
            )}
            <TextFieldBook
              label={"Chapter Number"}
              name={"chapterNumber"}
              type={"number"}
              value={chapterNumber}
              onChange={(e) => {
                setChapterNumber(e.target.value);
                setErrorChapterNum("");
              }}
              mandatory
            />
            {errorChapterNum ? (
              <span className="text-danger">{errorChapterNum}</span>
            ) : (
              ""
            )}

            <div className="d-flex flex-column my-2">
              <label>Description </label>

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

export default AddChapter;
