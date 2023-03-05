import { Button, Modal } from "react-bootstrap";

import React, { useEffect, useState } from "react";
import { addQuestion } from "../../api/discussionApi";
import toastMessage from "../../components/ToastMessage";
import { InputDropdown } from "../../components/Dropdown/InputDropdown";
import { getAllCategory } from "../../api/categoryApi";
import {Link, useNavigate } from "react-router-dom";

export function AddDiscussion(props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [errorQuestionTitle, setErrorQuestionTitle] = useState("");
  const [errorDescripiton, setErrorDescripiton] = useState("");
  const [errorCategory, setErrorCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchCategory = async () => {
    setLoading(true);
    const data = { page: 1 , limit:50};
    const response = await getAllCategory(data);
    setCategoryData(response.data.data.category);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategory();
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

  const handlePostQuestion = async () => {
    setLoading(true);
    try {
      if (!questionTitle && !selectedCategoryId) {
          setErrorCategory("Category is required !");
          setErrorQuestionTitle("Title is required !");
      }
      else if (!questionTitle){
        setErrorQuestionTitle("Title is required !");
      }
      else if (!selectedCategoryId){
        setErrorCategory("Category is required !");
      }
      else{
        const data = {
          title: questionTitle,
          description: questionDescription,
          categoryId: selectedCategoryId,
        };
        const response = await addQuestion(data);
        toastMessage({
          type: "success",
          message: "Question created successfully",
        });
        navigate("/admin/dashboard/discussion")
      }
    } catch (error) {
      toastMessage({
        type: "error",
        message: "Failed to create question ",
      });
    }
    setLoading(false);
  };

  return (
    <div className="col-6">
        <Link
        to={"/admin/dashboard/discussion" }
        className="text-decoration-underline mb-2"
      >
        {" "}
        Back to view discussions
      </Link>
      <h4>Add Discussion</h4>
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
      />
      {errorCategory && <p className="error text-danger">{errorCategory}</p>}

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
        {loading ? (
          <Button variant="success" disabled>
            Save Changes
          </Button>
        ) : (
          <Button variant="success" onClick={handlePostQuestion}>
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
}
