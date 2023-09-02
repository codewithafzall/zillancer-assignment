import React from 'react';
import { Pagination as ReactBootstrapPagination } from 'react-bootstrap';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <ReactBootstrapPagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => onPageChange(i)}
      >
        {i}
      </ReactBootstrapPagination.Item>
    );
  }

  return (
    <ReactBootstrapPagination>
      <ReactBootstrapPagination.Prev
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      {pages}
      <ReactBootstrapPagination.Next
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </ReactBootstrapPagination>
  );
};

export default Pagination;
