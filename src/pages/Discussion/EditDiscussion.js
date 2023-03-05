import { Button, Modal } from "react-bootstrap";

import React, { useEffect, useState } from "react";
import {
  addQuestion,
  editQuestion,
  getQuestionsById,
} from "../../api/discussionApi";
import toastMessage from "../../components/ToastMessage";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { InputDropdown } from "../../components/Dropdown/InputDropdown";
import { getAllCategory } from "../../api/categoryApi";
import { TailSpinLoader } from "../../components/Loader";

export function EditDiscussion() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [errorQuestionTitle, setErrorQuestionTitle] = useState("");
  const [errorDescripiton, setErrorDescripiton] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [errorCategory, setErrorCategory] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getQuestionsById(id);
      setSelectedQuestion(response?.data?.data);
      setQuestionTitle(response?.data?.data?.title);
      setQuestionDescription(response?.data?.data?.description);
      setSelectedCategoryId(response?.data?.data?.categoryId);
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  const fetchCategory = async () => {
    const data = { page: 1, limit: 50 };
    const response = await getAllCategory(data);
    setCategoryData(response.data.data.category);
  };

  useEffect(() => {
    fetchCategory();
    fetchData();
  }, []);

  const mappedCategories = categoryData?.map((item) => ({
    name: item?.title,
    option: item?.id,
  }));

  const categoryValues = [
    { name: "Select Category", option: "" },
     ...mappedCategories,
  ];

  const handleName = (e) => {
    e.preventDefault();
    setQuestionTitle(e.target.value);
    setErrorQuestionTitle("");
  };

  const handleDescription = (e) => {
    e.preventDefault();
    setQuestionDescription(e.target.value);
  };

  const handleEditQuestion = async () => {
    setEditing(true);
    try {
      if (!questionTitle && !selectedCategoryId) {
        setErrorCategory("Category is required !");
        setErrorQuestionTitle("Title is required !");
      } else if (!questionTitle) {
        setErrorQuestionTitle("Title is required !");
      } else if (!selectedCategoryId) {
        setErrorCategory("Category is required !");
      } else {
        const data = {
          body: {
            // status: selectedQuestionStatus,
            title: questionTitle,
            description: questionDescription,
            categoryId: selectedCategoryId,
          },
          userId: id,
        };
        const response = await editQuestion(data);
        toastMessage({
          type: "success",
          message: "Question edited successfully",
        });
        navigate("/admin/dashboard/discussion");
      }
    } catch (error) {
      toastMessage({
        type: "error",
        message: "Failed to edit question ",
      });
    }
    setEditing(false);
  };

  return (
    <div className="col-6">
      <Link
        to={"/admin/dashboard/discussion"}
        className="text-decoration-underline mb-2"
      >
        {" "}
        Back to view discussions
      </Link>
      <h4>Edit Discussion</h4>
      {!loading ? (
        <>
          <label className="mb-2">Question Title</label>
          <input
            type="text"
            className="form-control shadow-none"
            value={questionTitle}
            onChange={handleName}
          />
          {errorQuestionTitle && (
            <p className="error text-danger">{errorQuestionTitle}</p>
          )}

          <label className="mt-2">Select Category</label>
          <InputDropdown
            onChange={(option) => {
              setSelectedCategoryId(option);
              setErrorCategory("");
            }}
            values={categoryValues}
            className="mx-0"
            defaultValue={selectedQuestion.category || ""}
          />
          {errorCategory && (
            <p className="error text-danger">{errorCategory}</p>
          )}

          <label className="mb-2 mt-3">Question Description</label>
          <textarea
            type="text"
            rows={4}
            className="form-control shadow-none"
            value={questionDescription}
            onChange={handleDescription}
          />
          {errorDescripiton && (
            <p className="error text-danger">{errorDescripiton}</p>
          )}
          <div className="mt-3">
            {editing ? (
              <Button variant="success" disabled>
                Save Changes
              </Button>
            ) : (
              <Button variant="success" onClick={handleEditQuestion}>
                Save Changes
              </Button>
            )}
          </div>
        </>
      ) : (
        <TailSpinLoader />
      )}
    </div>
  );
}
