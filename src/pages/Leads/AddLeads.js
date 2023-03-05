import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { countryValues } from "../../api/countryApi";
import {
  addLeads,
  createMultipleLeads,
  editLeadById,
  getLeadById,
} from "../../api/leadsApi";
import SpinnerButton from "../../components/Button/SpinnerButton";
import { InputDropdown } from "../../components/Dropdown/InputDropdown";
import NormalDropdown from "../../components/Dropdown/NormalDropdown";
import { CrossIcon } from "../../components/Icons";
import Label from "../../components/Label";
import { TailSpinLoader } from "../../components/Loader";
import toastMessage from "../../components/ToastMessage";

export default function AddLeads() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [firstName, setFirstName] = useState("");
  const [errorFirstName, setErrorFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [errorMiddleName, setErrorMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [country, setCountry] = useState("");
  const [errorCountry, setErrorCountry] = useState("");
  const [gender, setGender] = useState("");
  const [errorGender, setErrorGender] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMultipleSubmitting, setIsMultipleSubmitting] = useState(false);
  const [pageLoad, setPageLoad] = useState(false);
  const [singleChecked, setSingleChecked] = useState(true);
  const [multipleChecked, setMultipleChecked] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [errorMultipleEmail, setErrorMultipleEmail] = useState("");

  const genderValues = [
    { name: "Select a gender", option: "" },
    { name: "Male", option: "male" },
    { name: "Female", option: "female" },
  ];

  const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validEmail = false;
    let validEmailFormat = false;
    let validPhoneFormat = false;
    {
      !email.match(emailRegex)
        ? setErrorEmail("Invalid Email")
        : (validEmailFormat = true);
    }
    {
      !email ? setErrorEmail("This field is required") : (validEmail = true);
    }

    {
      phone &&
      !phone.match(
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
      )
        ? setErrorPhone("Invalid Phone Number")
        : (validPhoneFormat = true);
    }

    if (validEmail && validEmailFormat && validPhoneFormat) {
      setIsSubmitting(true);
      try {
        let data = {
          firstName: firstName,
          middleName: middleName,
          lastName: lastName,
          email: email,
          phone: phone,
          country: country,
          gender: gender,
        };
        let response;
        {
          id
            ? (response = await editLeadById({ leadId: id, body: data }))
            : (response = await addLeads(data));
        }
        if (response.status == 200 || 201) {
          toastMessage({
            type: "success",
            message: `Lead ${id ? "edited" : "created"} successfully`,
          });
          navigate(-1);
        }
      } catch (error) {
        console.log(error);
        toastMessage({
          type: "error",
          message: error?.response?.data?.data
            ? error?.response?.data?.data
            : `Failed to ${id ? "edit" : "create"} lead`,
        });
      }
      setIsSubmitting(false);
    }
  };

  const setInitialValues = (value) => {
    setFirstName(value.firstName || "");
    setMiddleName(value.middleName || "");
    setLastName(value.lastName || "");
    setEmail(value.email || "");
    setPhone(value.phone || "");
    setCountry(
      value.country?.charAt(0).toUpperCase() + value.country?.slice(1) || ""
    );
    setGender(value.gender || "");
  };

  const fetchData = async () => {
    setPageLoad(true);
    try {
      const response = await getLeadById({ leadId: id });
      setInitialValues(response.data.data);
    } catch (error) {
      console.log(error);
    }
    setPageLoad(false);
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleAddEmail = (value) => {
    let keyArray = value.split(",");
    if (keyArray?.length == 0) {
      setErrorMultipleEmail("Add atleast 1 email");
    }
    let selectedKeyCopy = emailList;
    keyArray.map((keys) => {
      let key = keys.trim();
      if (key && !selectedKeyCopy.includes(key) && key.match(emailRegex)) {
        selectedKeyCopy.push(key.trim());
      }
    });
    let keywordSet = [...new Set(selectedKeyCopy)];
    setEmailList(keywordSet);
  };

  const handleRemoveEmail = (email) => {
    if (emailList.includes(email)) {
      let selectedKeyCopy = [];
      emailList.map((item) => {
        if (item != email) {
          selectedKeyCopy.push(item);
        }
      });
      setEmailList(selectedKeyCopy);
    }
  };

  const handleMultipleSubmit = async (e) => {
    e.preventDefault();
    let emailField = document.getElementById("email").value;
    {
      emailList?.length == 0 && setErrorMultipleEmail("Add atleast 1 email");
    }
    {
      emailField !== "" && setErrorMultipleEmail("Press Enter to add emails");
    }
    if (emailList?.length !== 0 && emailField == "") {
      setIsMultipleSubmitting(true);
      try {
        let data = {
          emails: emailList,
        };
        const response = await createMultipleLeads(data);
        if (response.status == 200 || 201) {
          setEmailList([]);
          toastMessage({
            type: "success",
            message: `Leads created successfully`,
          });
          navigate(-1);
        }
      } catch (error) {
        console.log(error);
        toastMessage({
          type: "error",
          message: error?.response?.data?.data
            ? error?.response?.data?.data
            : `Failed to create leads`,
        });
      }
      setIsMultipleSubmitting(false);
    }
  };

  return (
    <div className="row mt-0">
      {!pageLoad ? (
        <>
          <Link
            to="/admin/dashboard/leads"
            className="text-decoration-underline mb-2 top-link"
          >
            Back to view leads
          </Link>
          <h4>{id ? "Edit " : "Create "} Leads</h4>
          {!id && (
            <div className="leads-option-section">
              <div
                onClick={() => {
                  if (!singleChecked) {
                    setSingleChecked(!singleChecked);
                    setMultipleChecked(!multipleChecked);
                  }
                }}
                className="leads-option"
              >
                <input type="radio" checked={singleChecked} />
                <label>Single Leads</label>
              </div>
              <div
                onClick={() => {
                  if (!multipleChecked) {
                    setSingleChecked(!singleChecked);
                    setMultipleChecked(!multipleChecked);
                  }
                }}
                className="leads-option"
              >
                <input type="radio" checked={multipleChecked} />
                <label>Multiple Leads</label>
              </div>
            </div>
          )}

          {singleChecked ? (
            <form>
              <div className="form-container">
                <div className="form-element">
                  <Label title={"First Name"} />
                  <input
                    type="text"
                    className="form-control form-field"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setErrorFirstName("");
                    }}
                  />
                  <span className="error">{errorFirstName}</span>
                </div>
                <div className="form-element">
                  <Label title={"Middle Name"} />
                  <input
                    type="text"
                    className="form-control form-field"
                    value={middleName}
                    onChange={(e) => {
                      setMiddleName(e.target.value);
                      setErrorMiddleName("");
                    }}
                  />
                  <span className="error">{errorMiddleName}</span>
                </div>
                <div className="form-element">
                  <Label title={"Last Name"} />
                  <input
                    type="text"
                    className="form-control form-field"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setErrorLastName("");
                    }}
                  />
                  <span className="error">{errorLastName}</span>
                </div>
              </div>

              <div className="form-container">
                <div className="form-element">
                  <Label title={"Email"} mandatory={true} />
                  <input
                    type="text"
                    className="form-control form-field"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorEmail("");
                    }}
                  />
                  <span className="error">{errorEmail}</span>
                </div>

                <div className="form-element">
                  <Label title={"Phone Number"} />
                  <input
                    type="text"
                    className="form-control form-field"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrorPhone("");
                    }}
                  />
                  <span className="error">{errorPhone}</span>
                </div>

                <div className="form-element">
                  <Label title={"Gender"} />
                  <NormalDropdown
                    values={genderValues}
                    onChange={(e) => {
                      setGender(e);
                      setErrorGender("");
                    }}
                    defaultValue={gender || ""}
                    width={"300px"}
                  />
                  <span className="error">{errorGender}</span>
                </div>
              </div>

              <div className="form-container">
                <div className="form-element">
                  <Label title={"Country"} />
                  <InputDropdown
                    values={countryValues}
                    onChange={(e) => {
                      setCountry(e);
                      setErrorCountry("");
                    }}
                    defaultValue={country || ""}
                    width={"300px"}
                  />

                  <span className="error">{errorCountry}</span>
                </div>
              </div>
              <SpinnerButton
                title={"Submit"}
                isSubmitting={isSubmitting}
                onClick={handleSubmit}
                className="btn btn-primary px-4 mt-2"
              />
            </form>
          ) : (
            //for multiple email
            <form>
              <div className="form-container">
                <div className="form-element">
                  <Label title={"Emails"} mandatory={true} />
                  {emailList?.length > 0 && (
                    <div className="email-display">
                      {emailList?.map((item, i) => (
                        <div
                          className="email-tab"
                          key={i}
                          onClick={() => handleRemoveEmail(item)}
                        >
                          <span>{item}</span>
                          <span>
                            <CrossIcon />
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    id="email"
                    className="form-control form-field multiple-email-field"
                    type="text"
                    placeholder="example1@kmagz.com, example2@kmagz.com"
                    onChange={(e) => {
                      setErrorMultipleEmail("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        e.preventDefault();
                        handleAddEmail(e.target.value.trim());
                        document.getElementById("email").value = "";
                        setErrorMultipleEmail("");
                      }
                    }}
                  />
                  <span className="caption">Press enter to add emails</span>
                  <span className="error">{errorMultipleEmail}</span>
                </div>
              </div>
              <SpinnerButton
                title={"Submit"}
                isSubmitting={isMultipleSubmitting}
                onClick={handleMultipleSubmit}
                className="btn btn-primary px-4 mt-3"
              />
            </form>
          )}
        </>
      ) : (
        <TailSpinLoader />
      )}
    </div>
  );
}
