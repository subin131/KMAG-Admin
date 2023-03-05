import React, { useState, useEffect } from "react";
import { TailSpinLoader, ThreeDotsLoader } from "../../components/Loader";
import NormalDropdown from "../../components/Dropdown/NormalDropdown";
import Label from "../../components/Label";
import toastMessage from "../../components/ToastMessage";
import { getAllCategory } from "../../api/categoryApi";
import { addbook } from "../../api/readApi";
import TextFieldBook from "../../components/Form/TextFieldBook";
import { Link, useNavigate } from "react-router-dom";
import SpinnerButton from "../../components/Button/SpinnerButton";

function AddBook() {
  const [loading, setLoading] = useState(false);
  const [pageLoad, setPageLoad] = useState(false);
  const [errorImage1, setErrorImage1] = useState("");
  const navigate = useNavigate();
  const [errorImage2, setErrorImage2] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [errorCategory, setErrorCategory] = useState("");
  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();
  const [imageURL1, setImageURL1] = useState("");
  const [imageURL2, setImageURL2] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [title, settitle] = useState("");
  const [author, setAuthor] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorAuthor, setErrorAuthor] = useState("");

  useEffect(async () => {
    setPageLoad(true);
    try {
      const data = { page: 1, limit: 50 };
      const response = await getAllCategory(data);
      setCategories(response?.data?.data?.category);
    } catch (error) {
      console.log("error", error);
    }
    setPageLoad(false);
  }, []);
  //image upload
  useEffect(() => {
    setImageLoading(true);
    if (image1) {
      const imageUrl1 = URL.createObjectURL(image1);
      setImageURL1(imageUrl1);
      setImageLoading(false);
    }
    if (image2) {
      const imageUrl2 = URL.createObjectURL(image2);
      setImageURL2(imageUrl2);
      setImageLoading(false);
    }
  }, [image1, image2]);

  //submit function
  const handleSubmit = async () => {
    let isValid = true;
    if (!title) {
      setErrorTitle("Title is required");
      isValid = false;
    }
    if (!author) {
      setErrorAuthor("Author is required");
      isValid = false;
    }
    if (!selectedCategory) {
      setErrorCategory("Category is required");
      isValid = false;
    }
    if (!image1) {
      setErrorImage1("Image is required");
      isValid = false;
    }
    if (!image2) {
      setErrorImage2("Image is required");
      isValid = false;
    }

    if (isValid) {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("author", author);
      formData.append("categoryId", selectedCategory);
      formData.append("frontPage", image1);
      formData.append("backPage", image2);

      try {
        const reponse = await addbook(formData);
        toastMessage({
          type: "success",
          message: "Book Added Successfully",
        });
        if (reponse.status === 200) {
          navigate("/admin/dashboard/book?status=inactive");
        }
      } catch (error) {
        console.log(error);
        toastMessage({
          type: "error",
          message: "Failed to add book",
        });
      }
      setLoading(false);
    }
  };

  //list of category
  const categoryList = categories.map((item) => ({
    name: item.title,
    option: item.id,
  }));

  const categoryValues = [
    { name: "Select a category", option: "" },
    ...categoryList,
  ];

  return (
    <>
      {!pageLoad ? (
        <div className="row mt-0">
          <Link to={"/admin/dashboard/book"} className="go-back">
            Back to Books
          </Link>
          <h4>Book Add</h4>
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

            {/* //Author */}
            <TextFieldBook
              label={"Author"}
              name={"author"}
              type={"text"}
              onChange={(e) => {
                setAuthor(e.target.value);
                setErrorAuthor("");
              }}
              mandatory
            />

            {errorAuthor && <span className="text-danger">{errorAuthor}</span>}

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

            {/* //dropdown */}
            <div className="mt-2">
              <Label html={"category"} title={"Select a category"} mandatory />
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
            {/* front page  images */}
            <div className="mt-2 d-flex flex-column">
              <Label html={"banner"} title={"Front Page Image"} mandatory />

              <>
                {imageURL1 && (
                  <img
                    className="img-thumbnail image-view"
                    src={imageURL1}
                    alt="#"
                  />
                )}
              </>

              <input
                className={`form-control shadow-none mt-1 ${
                  errorImage1 && "is-invalid"
                }`}
                id="banner"
                type="file"
                name="banner"
                autoComplete="off"
                onChange={(e) => {
                  setImage1(e.target.files[0]);
                  setErrorImage1("");
                  setImageLoading(true);
                }}
              />
              {errorImage1 && (
                <div
                  className="error"
                  style={{ fontSize: "12px", color: "red" }}
                >
                  {errorImage1}
                </div>
              )}
            </div>
            {/* back page  images */}
            <div className="mt-2 d-flex flex-column">
              <Label html={"banner"} title={"Back Page Image"} mandatory />

              <>
                {imageURL2 && (
                  <img
                    className="img-thumbnail image-view"
                    src={imageURL2}
                    alt="#"
                  />
                )}
              </>

              <input
                className={`form-control shadow-none mt-1 ${
                  errorImage2 && "is-invalid"
                }`}
                id="banner"
                type="file"
                name="banner"
                autoComplete="off"
                onChange={(e) => {
                  setImage2(e.target.files[0]);
                  setErrorImage2("");
                  setImageLoading(true);
                }}
              />
              {errorImage2 && (
                <div
                  className="error"
                  style={{ fontSize: "12px", color: "red" }}
                >
                  {errorImage2}
                </div>
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

export default AddBook;
