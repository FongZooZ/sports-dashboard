import React, { Component } from 'react'

class Pagination extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log(this.props)
    return (
      <div className="dataTables_paginate paging_simple_numbers">
        <ul className="pagination">
          <li className="paginate_button previous disabled">
            <a href="#" aria-controls={this.props.tableId} data-dt-idx="0" tabIndex="0">Previous</a>
          </li>
          <li className="paginate_button active">
            <a href="#" aria-controls={this.props.tableId} data-dt-idx="1" tabIndex="0">1</a>
          </li>
          <li className="paginate_button ">
            <a href="#" aria-controls={this.props.tableId} data-dt-idx="2" tabIndex="0">2</a>
          </li>
          <li className="paginate_button ">
            <a href="#" aria-controls={this.props.tableId} data-dt-idx="3" tabIndex="0">3</a>
          </li>
          <li className="paginate_button ">
            <a href="#" aria-controls={this.props.tableId} data-dt-idx="4" tabIndex="0">4</a>
          </li>
          <li className="paginate_button ">
            <a href="#" aria-controls={this.props.tableId} data-dt-idx="5" tabIndex="0">5</a>
          </li>
          <li className="paginate_button ">
            <a href="#" aria-controls={this.props.tableId} data-dt-idx="6" tabIndex="0">6</a>
          </li>
          <li className="paginate_button next">
            <a href="#" aria-controls={this.props.tableId} data-dt-idx="7" tabIndex="0">Next</a>
          </li>
        </ul>
      </div>
    )
  }
}

export default Pagination