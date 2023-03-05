import React, { useEffect, useState } from "react";
import { getMaintainence, putMaintainence } from "../../api/contentApi";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

export function Settings() {
  const [maintenance, setMaintenance] = useState();

  const fetchData = async () => {
    const response = await getMaintainence();
    setMaintenance(response.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onChange = async(checked) => {
    const data = {
      status: checked
  }
  setMaintenance(checked);
  const response = await putMaintainence(data);
  };

  return (
    <div>
      <h3 className="mt-0">Settings</h3>
      <div className="d-flex flex-row align-items-center">
        <h5 style={{ marginRight: "20px" }}>Maintenance:</h5>
        <BootstrapSwitchButton checked={maintenance} size="sm" width={60} onChange={onChange} onstyle="danger"  offstyle="dark"/>
      </div>
    </div>
  );
}
