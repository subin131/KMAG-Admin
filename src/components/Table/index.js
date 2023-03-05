import React from "react";
import { Table } from "antd";
import "./Table.css";

export default function ContentTable({ columns, data , ...props}) {
  return (
    <div>
      <Table columns={columns} dataSource={data} {...props} className='time-table-row-select' pagination={false}/>
  </div>
  );
}
