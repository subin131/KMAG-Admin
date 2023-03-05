import React, { useState, useEffect } from "react";
import { TailSpinLoader } from "../../components/Loader";
import toastMessage from "../../components/ToastMessage";
import { getChapterById, updateChapterById } from "../../api/readApi";
import TextFieldBook from "../../components/Form/TextFieldBook";
import { Link, useNavigate, useParams } from "react-router-dom";
import SpinnerButton from "../../components/Button/SpinnerButton";

function EditChapter() {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [errorDescription, setErrorDescription] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorChapterNum, setErrorChapterNum] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [chapter, setChapter] = useState({});
  const { bookId, chapterId } = useParams();

  const fetchContent = async () => {
    setLoading(true);
    try {
      const data = { chapterId: chapterId };
      const response = await getChapterById(data);
      setChapter(response.data.data);
      let chapter = response.data.data;
      setTitle(chapter.title);
      setDescription(chapter.description);
      setChapterNumber(chapter.chapterNumber);
    } catch (error) {
      toastMessage("error", error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchContent();
  }, []);

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
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("chapterNumber", chapterNumber);

      try {
        const data = { formData, bookId: bookId, chapterId: chapterId };
        const reponse = await updateChapterById(data);
        toastMessage({
          type: "success",
          message: "Chapter updated Successfully",
        });
        if (reponse.status === 200) {
          navigate(
            `/admin/dashboard/book/chapter/${bookId}?status=${
              chapter?.status == "inactive" ? "inactive" : "active"
            }`
          );
        }
      } catch (error) {
        console.log(error);
        toastMessage({
          type: "error",
          message: "Failed to update chapter!!",
        });
      }
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!loading ? (
        <div className="row mt-0">
          <Link
            to={`/admin/dashboard/book/chapter/${bookId}`}
            className="go-back"
          >
            Back to Chapters
          </Link>
          <h4>Chapter Edit</h4>
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
                isSubmitting={isSubmitting}
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

export default EditChapter;
