import React from 'react';
import ReactPaginate from 'react-paginate';
import "./pagination.css"

// Example items, to simulate fetching from another resources.

    export default function PaginatedItems({ itemsPerPage , total , setPage}) {

    const pageCount = Math.ceil( total / itemsPerPage)

    return (
        <>
        <div style={{marginLeft: "100px"}}>
            <ReactPaginate
                breakLabel="..."
                nextLabel="التالي >"
                onPageChange={(e) => setPage(e.selected + 1)}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< السابق"
                renderOnZeroPageCount={null}
                containerClassName="pagination" // إضافة كلاس للتنسيق إذا لزم الأمر
                pageClassName="pagination-li"
                pageLinkClassName='pagination-tag-anchor text-white'
                activeLinkClassName="text-white bg-primary"
            />
        </div>
        </>
    );
}