import React, { Component } from 'react'
import axios from 'axios'
import Pagination from 'react-js-pagination'

import { getParameterByName } from '../libs/common'

export default class Region extends Component {
  constructor(props) {
    super(props)
    this.state = {
      regions: [],
      paginator: null,
      limit: 10,
      temp: {},
      tempLogo: null,
      isEdit: false
    }
  }

  componentDidMount() {
    this._reload()
  }

  async _reload(page, limit) {
    if (!page) page = getParameterByName('page')
    if (!limit) limit = getParameterByName('limit')
    try {
      let regions = await axios.get(`/api/regions?page=${page}&limit=${limit}`)
      this.setState({
        regions: regions.data.data,
        paginator: regions.data.paginator,
        limit: regions.data.limit
      })
    } catch (err) {
      console.error(err)
    }
  }

  _handleChange(e, field) {
    this.setState({
      temp: Object.assign(this.state.temp, {
        [field]: e.target.value
      })
    })
  }

  async _handleFileChange(e) {
    const files = e.target.files
    if (!files.length) return
    const logo = files[0]
    let data = new FormData()
    data.append('file', logo, logo.fileName)

    try {
      const response = await axios.post('/api/image/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const logo = response.data
      await this.setState({
        temp: Object.assign(this.state.temp, {
          logo: logo.url
        })
      })
    } catch (err) {
      console.error(err)
    }
  }

  async _handleOpenEditModal(e, region) {
    await this.setState({ isEdit: true, temp: {...region} })
    $('#create-region-modal').modal('toggle')
  }

  async _handleOpenCreateModal(e) {
    await this.setState({ isEdit: false, temp: {} })
    $('#create-region-modal').modal('toggle')
  }

  async _handleUpdate(e) {
    let keywords = []
    if (typeof(this.state.temp.keywords) == 'string') {
      keywords = this.state.temp.keywords.split(',')
      keywords = keywords.map(keyword => keyword.trim())
    } else {
      keywords = this.state.temp.keywords
    }

    let region = {
      ...this.state.temp,
      keywords
    }

    try {
      await axios.put(`/api/regions/${this.state.temp._id}`, region)
      await this.setState({
        temp: {}
      })
      this._reload()
      $('#create-region-modal').modal('toggle')
    } catch (err) {
      console.error(err)
    }
  }

  async _handleSave(e) {
    let keywords = []
    if (typeof(this.state.temp.keywords) == 'string') {
      keywords = this.state.temp.keywords.split(',')
      keywords = keywords.map(keyword => keyword.trim())
    } else {
      keywords = this.state.temp.keywords
    }

    let newRegion = {
      ...this.state.temp,
      keywords
    }

    try {
      await axios.post('/api/regions', newRegion)
      await this.setState({
        temp: {}
      })
      this._reload()
      $('#create-region-modal').modal('toggle')
    } catch (err) {
      console.error(err)
    }
  }

  async _handleDelete(e, regionId) {
    try {
      await axios.delete(`/api/regions/${regionId}`)
      this._reload()
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    let items = []
    if (this.state.regions.length) {
      this.state.regions.forEach(region => {
        let keywords = ''
        region.keywords.forEach((keyword, index) => {
          keywords += keyword
          if (index != region.keywords.length - 1) keywords += ', '
        })
        items.push(
          <tr key={region._id}>
            <td></td>
            <td>{region.name}</td>
            <img src={region.logo} />
            <td>{keywords}</td>
            <td>{region.description}</td>
            <td>
              <button type="button" className="btn btn-sm btn-primary" onClick={(e) => this._handleOpenEditModal(e, region)}><i className="fa fa-edit"></i> Edit</button>
              <button type="button" className="btn btn-sm btn-danger" onClick={(e) => this._handleDelete(e, region._id)}><i className="fa fa-trash"></i> Delete</button>
            </td>
          </tr>
        )
      })
    }

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="box">
            <div className="box-header">
              <h3 className="box-title">Regions List</h3>
            </div>

            <div className="box-body table-responsive">
              <div className="dataTables_wrapper form-inline dt-bootstrap">
                <div className="col-md-12">
                  <table className="table table-hover" id="regions-list">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Logo</th>
                        <th>Keywords</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items}
                    </tbody>
                  </table>
                </div>
                <div className="col-md-5">
                  <button type="button" className="btn btn-default" data-toggle="modal" onClick={(e) => this._handleOpenCreateModal(e)}>
                    Create new Region
                  </button>
                </div>
                <div className="col-md-7">
                  <div className="dataTables_paginate paging_simple_numbers pull-right">
                    <Pagination
                      itemClass="paginate_button"
                      activePage={this.state.paginator ? this.state.paginator.current : 1}
                      itemsCountPerPage={this.state.limit || 10}
                      totalItemsCount={this.state.paginator ? this.state.paginator.totalResult : 0}
                      pageRangeDisplayed={5}
                      onChange={page => this._reload(page)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal fade" id="create-region-modal" style={{display: 'none'}}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">{this.state.isEdit ? 'Edit Region' : 'Create new Region'}</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span></button>
                    </div>
                    <div className="modal-body">
                      <form id="region-form" className="form-horizontal">
                        <div className="box-body">
                          <div className="form-group">
                            <label htmlFor="input-region-name" className="col-sm-2 control-label">Name</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-region-name" placeholder="Name" value={this.state.temp.name || ''} onChange={(e) => this._handleChange(e, 'name')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-region-logo">Upload logo image</label>
                            <input type="file" id="input-region-logo" onChange={(e) => this._handleFileChange(e)} />
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-region-keywords" className="col-sm-2 control-label">Keywords</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-region-keywords" placeholder="Keywords" value={this.state.temp.keywords || ''} onChange={(e) => this._handleChange(e, 'keywords')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-region-description" className="col-sm-2 control-label">Description</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-region-description" placeholder="Description" value={this.state.temp.description || ''} onChange={(e) => this._handleChange(e, 'description')} />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-default pull-left" data-dismiss="modal">Close</button>
                      {
                        this.state.isEdit ?
                          <button type="button" className="btn btn-primary" onClick={(e) => this._handleUpdate(e)}>Update</button> :
                          <button type="button" className="btn btn-primary" onClick={(e) => this._handleSave(e)}>Save</button>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}