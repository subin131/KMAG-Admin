import React, { useState, useEffect, useRef, useContext, useMemo } from 'react'
import Select from "react-select"
import { Formik, Form } from "formik";
import { TextField } from "../../components/Form/TextField";
import { getUserDetail, setupUserProfile } from "../../api/userApi";
import { TailSpinLoader } from '../../components/Loader';
import { Card, Button, Container, Row, Col } from 'react-bootstrap'
import toastMessage from "../../components/ToastMessage";
import "./profile.css"
import countryList from 'react-select-country-list';

function Profile() {
  const profileFlag = true;
  const [userDetail, setUserDetail] = useState({});
  const [bio, setBio] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [postal, setPostal] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');
  const [image, setImage] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [userType, setUserType] = useState("");
  const [code, setCode] = useState("");


  const options = useMemo(() => countryList().getData(), [])

  const changeHandler = value => {
    setCountry(value.label)
  }


  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await getUserDetail();
      setUserDetail(response.data.data.user);
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchData();
  }, [])



  useEffect(() => {
    setImgURL(userDetail?.profilePicture || null);
    setFirstName(userDetail.firstName);
    setLastName(userDetail.lastName);
    setMiddleName(userDetail.middleName);
    setCountry(userDetail.country);
    setEmail(userDetail.email);
    setPhone(userDetail.phone);
    setCode(userDetail.phoneCountryCode)
    setState(userDetail.state);
    setPostal(userDetail.postal);
    setAddress1(userDetail.addressOne);
    setAddress2(userDetail.addressTwo);
    setGender(userDetail.gender);
    setStatus(userDetail.status);
    setBio(userDetail.bio);
    setUserType(userDetail.userType)
  }, [userDetail]);




  const handleFileInput = useRef(null);

  const handleClick = event => {
    handleFileInput.current.click();

  };

  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    setImage(fileUploaded);
  };

  useEffect(() => {
    if (image && image !== userDetail?.profilePicture) {
      const imageUrl = URL.createObjectURL(image);
      setImgURL(imageUrl);

    }
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", image);
    formData.append("bio", bio ?? "");
    formData.append("firstName", firstName ?? "");
    formData.append("lastName", lastName ?? "");
    formData.append("middleName", middleName ?? "");
    formData.append("phone", phone ?? "");
    formData.append("countryCode", code ?? "");
    formData.append("country", country ?? "");
    formData.append("state", state ?? "");
    formData.append("zipcode", postal ?? "");
    formData.append("addressOne", address1 ?? "");
    formData.append("addressTwo", address2 ?? "");
    formData.append("gender", gender);
    formData.append("userType", userType);

    try {
      const response = await setupUserProfile(formData);
      const data = response?.data?.data;
      const newData = { ...data, "email": email }
      localStorage.setItem("user", (JSON.stringify(newData)));

      toastMessage({
        type: "success",
        message: "Data updated successfully!"
      })
    }
    catch (error) {
      toastMessage({
        type: "error",
        message: "Error in updating data!"
      }
      )


    }
  }
  const customStyles = {
  control: (styles) => ({
    backgroundColor: "#272F3D",
    width: "100%",
    height: "100%",
    color: "white",
    display: "flex",
    cursor: "text",
    marginLeft:"-1px",
    border:"0.5px solid #7C8492"

  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      backgroundColor: "#272F3D",
      color: "#FFF",
      cursor: "pointer",
      height: "35px",
      padding: "0",
      paddingTop:"5px",
      paddingLeft:"5px",
      "&:hover": {
        backgroundColor: "#a1a3a7"
      }
    };
  },
  input:(styles) => ({
    color:'white',
 
  }),
  placeholder:(styles) => ({
    padding:"10px",
    color:"#7C8492",
    position:"absolute",
  }),
  menu:(provided ) => ({
    ...provided ,
    marginLeft:"-10px",
    zIndex: 9999,
    backgroundColor: "#272F3D",
    marginTop:"0px",
  }),
  singleValue:(styles) => ({
    padding:"10px",
    color:"white",
    position:"absolute",
  }),
  menuPortal: base => ({ ...base, zIndex: 9999 }),
};
  

  return (
    <div className="profile-card " style={{ backgroundColor: "#202939", width: "100%", height: "100%" }}>

      {!loading ? (

        <Container style={{ display: "flex", }}>

          <Row>
            <Col >

              <Col >
                <h3 style={{ marginLeft: "50px", color: "white" }}>Personal Details</h3>
                <img style={{ width: "20rem", height: "20rem", maxWidth: "20rem", maxHeight: "20rem", display: "flex", alignItems: "center !important", paddingTop: "20px", marginLeft: "30px" }} variant="top" src={imgURL} />
              </Col>
              <Col style={{ marginTop: "10px", marginLeft: "30px" }} >
                <div className="upload-btn-wrapper">
                  <input
                    className="form-control shadow-none mt-1 "
                    type="file"
                    name="myfile"
                    style={{ display: "none" }}
                    onChange={handleChange}
                    ref={handleFileInput}
                  />
                  <Button variant="danger" onClick={handleClick} style={{ width: "100%" }}>Upload New Photo</Button>
                </div>
              </Col>
            </Col>
            <Col>
              <Col style={{ display: "flex", alignItems: "center", marginTop: "70px", marginLeft: "0px" }}>

              </Col>

            </Col>
          </Row>

          <Card.Body style={{ alignItems: "center" }}>
            <Formik >
              <Form>
                <Container >
                  <Row>
                    <Col>

                      <Col className='form-group'>
                        <div className="col-8">
                          <TextField
                            profile={profileFlag}
                            label={"First Name"}
                            name={"firstName"}
                            type={"text"}
                            value={firstName}
                            onChange={(e) =>
                              setFirstName(e.target.value)

                            }

                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="col-8">
                          <TextField
                            profile={profileFlag}
                            label={"Middle Name"}
                            name={"middleName"}
                            type={"text"}
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}

                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="col-8">
                          <TextField
                            profile={profileFlag}
                            label={"Last Name"}
                            name={"lastName"}
                            type={"text"}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}

                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="col-8">
                          <TextField
                            profile={profileFlag}
                            label={"Email"}
                            name={"email"}
                            type={"text"}
                            value={email}
                            disabled


                          />
                        </div>
                      </Col>

                      <Col>
                        <div className="col-8">
                          <TextField
                            profile={profileFlag}
                            label={"Phone"}
                            name={"phone"}
                            type={"text"}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}

                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="col-8">
                          <label style={{ color: "#7C8492", marginBottom: "3px" }}>Country</label>
                          <Select styles={customStyles} options={options} defaultValue={{ label: country, value: country}}  onChange={changeHandler} />
                        </div>
                      </Col>
                      <Col>
                        <div className="col-8">
                          <TextField
                            label={"State"}
                            name={"state"}
                            type={"text"}
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            profile={profileFlag}
                          />
                        </div>
                      </Col>



                    </Col>
                    {/* //second row */}
                    <Col>
                      <Col>
                        <div className="col-8">
                          <TextField
                            label={"Address 1"}
                            name={"address1"}
                            type={"text"}
                            value={address1}
                            onChange={(e) => setAddress1(e.target.value)}
                            profile={profileFlag}
                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="col-8">
                          <TextField
                            label={"Address 2"}
                            name={"address2"}
                            type={"text"}
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            profile={profileFlag}
                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="col-8">
                          <TextField
                            label={"Zip Code"}
                            name={"postal"}
                            type={"text"}
                            value={postal}
                            onChange={(e) => setPostal(e.target.value)}
                            profile={profileFlag}
                          />
                        </div>
                      </Col>

                      <Col>
                        <div className="col-8">
                          <TextField
                            label={"User Type"}
                            name={"usertype"}
                            type={"text"}
                            value={userType}
                            disabled
                            profile={profileFlag}

                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="col-8">
                          <TextField
                            label={"Gender"}
                            name={"gender"}
                            type={"text"}
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            profile={profileFlag}
                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="col-8">
                          <TextField
                            label={"Country Code"}
                            name={"code"}
                            type={"text"}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            profile={profileFlag}
                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="col-8">
                          <TextField
                            label={"Status"}
                            name={"status"}
                            type={"text"}
                            value={status}
                            disabled
                            profile={profileFlag}
                          />
                        </div>
                      </Col>
                    </Col>

                  </Row>
                  <Row>
                    <Col>
                      <div className="d-flex flex-column my-2">
                        <label style={{ color: "#7C8492" }}>Bio </label>
                        <textarea
                          type="text"
                          rows={5}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="excerpt-area mt-1"
                          style={{ background: "transparent", color: "white", border: "0.5px solid #7C8492" }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row >
                    <Col>
                      <button
                        type="submit"
                        className="btn btn-danger mt-3"
                        onClick={handleSubmit}
                      >
                        Update
                      </button>
                    </Col>
                  </Row>
                </Container>
              </Form>
            </Formik>
          </Card.Body>

        </Container>
      ) : (
        <TailSpinLoader />
      )

      }

    </div>
  )
}

export default Profile