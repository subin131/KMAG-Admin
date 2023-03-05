import React from "react";
import { Pagination } from "react-bootstrap";
import "./Pagination.css";

function PaginationSection(props) {
  return (
    <div className="pagination">
      <Pagination>

        {/* previious button */}
        {props.currentPage > 1 ? (
          <Pagination.Prev onClick={props.handlePrevPage}/>
        ) : (
          <Pagination.Prev disabled />
        )}

        {/* page number */}
        <Pagination.Item>{props.currentPage}</Pagination.Item>

        {/* next button */}
        {props.hasNext ? 
        <Pagination.Next onClick={props.handleNextPage}/> 
        : 
        <Pagination.Next disabled />}
        
      </Pagination>
    </div>
  );
}

export default PaginationSection;
