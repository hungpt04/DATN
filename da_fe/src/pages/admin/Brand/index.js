import React, { useEffect, useState } from "react";
import './Brand.css';


function Brand() {
  return (
    <div class="page-brand">
      <h4 class="title-brand">Danh sách thương hiệu</h4>
      <div class="container-brand">
        <div class="button-group-brand">
          <a class="button-brand add-button-brand" href="/shop/sanpham/add">
            Add
          </a>
        </div>
        <table class="table-brand">
          <thead>
            <tr>
              <th>STT</th>
              <th>ID</th>
              <th>Mã</th>
              <th>Tên</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody id="productTableBody">
          <tr >
                <td>01</td>
                <td>1</td>
                <td>TH001</td>
                <td>Yonex</td>
                <td>Active</td>
                <td>
                  <div className="button-group-brand">
                    <a className="button-brand update-button-brand" >Update</a>
                    <a className="button-brand delete-button-brand" >Delete</a>
                  </div>
                </td>
              </tr>
          </tbody>
        </table>
        {/* Phân trang */}
        <div className="pagination">
          <button className="page-button">&lt;</button> {/* Nút Back */}
          <button className="page-button active">1</button>
          <button className="page-button">2</button>
          <button className="page-button">3</button>
          <button className="page-button">&gt;</button> {/* Nút Next */}
        </div>
      </div>
    </div>
  );
}

export default Brand;
