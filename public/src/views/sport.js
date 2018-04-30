import React, { Component } from 'react'
import axios from 'axios'
import Pagination from 'react-js-pagination'

import { getParameterByName } from '../libs/common'

export default class Sport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sports: [],
      paginator: null,
      limit: 10,
      temp: {},
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
      let sports = await axios.get(`/api/sports?page=${page}&limit=${limit}`)
      this.setState({
        sports: sports.data.data,
        paginator: sports.data.paginator,
        limit: sports.data.limit
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

  _handleCheckboxChange(e) {
    this.setState({
      temp: Object.assign(this.state.temp, {
        isIndividual: e.target.checked
      })
    })
  }

  async _handleOpenEditModal(e, sport) {
    await this.setState({ isEdit: true, temp: {...sport}, tempLogo: null })
    $('#create-sport-modal').modal('toggle')
    $('#sport-form')[0].reset()
  }

  async _handleOpenCreateModal(e) {
    await this.setState({ isEdit: false, temp: {}, tempLogo: null })
    $('#create-sport-modal').modal('toggle')
    $('#sport-form')[0].reset()
  }

  async _handleUpdate(e) {
    try {
      await axios.put(`/api/sports/${this.state.temp._id}`, this.state.temp)
      await this.setState({
        temp: {},
        tempLogo: null
      })
      this._reload()
      $('#create-sport-modal').modal('toggle')
      $('#sport-form')[0].reset()
    } catch (err) {
      console.error(err)
    }
  }

  async _handleSave(e) {
    try {
      await axios.post('/api/sports', this.state.temp)
      await this.setState({
        temp: {},
        tempLogo: null
      })
      this._reload()
      $('#create-sport-modal').modal('toggle')
      $('#sport-form')[0].reset()
    } catch (err) {
      console.error(err)
    }
  }

  async _handleDelete(e, sportId) {
    try {
      await axios.delete(`/api/sports/${sportId}`)
      this._reload()
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    let items = []
    if (this.state.sports.length) {
      this.state.sports.forEach(sport => {
        items.push(
          <tr key={sport._id}>
            <td></td>
            <td>{sport.name}</td>
            <td>{sport.logo ? <img src={`public/${sport.logo}`} height="40" /> : null}</td>
            <td>{sport.description}</td>
            <td>{sport.isIndividual ? 'Yes' : 'No'}</td>
            <td>
              <button type="button" className="btn btn-sm btn-primary" onClick={(e) => this._handleOpenEditModal(e, sport)}><i className="fa fa-edit"></i> Edit</button>
              <button type="button" className="btn btn-sm btn-danger" onClick={(e) => this._handleDelete(e, sport._id)}><i className="fa fa-trash"></i> Delete</button>
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
              <h3 className="box-title">Sports List</h3>
            </div>

            <div className="box-body table-responsive">
              <div className="dataTables_wrapper form-inline dt-bootstrap">
                <div className="col-md-12">
                  <table className="table table-hover" id="sports-list">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Logo</th>
                        <th>Description</th>
                        <th>Is Individual</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items}
                    </tbody>
                  </table>
                  <div className="col-md-5">
                    <button type="button" className="btn btn-default" data-toggle="modal" onClick={(e) => this._handleOpenCreateModal(e)}>
                      Create new Sport
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
              </div>

              <div className="modal fade" id="create-sport-modal" style={{display: 'none'}}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">{this.state.isEdit ? 'Edit Sport' : 'Create new Sport'}</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span></button>
                    </div>
                    <div className="modal-body">
                      <form id="sport-form" className="form-horizontal">
                        <div className="box-body">
                          <div className="form-group">
                            <label htmlFor="input-sport-name" className="col-sm-2 control-label">Name</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-sport-name" placeholder="Name" value={this.state.temp.name || ''} onChange={(e) => this._handleChange(e, 'name')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-sport-logo" className="col-sm-2 control-label">Logo</label>
                            <div className="col-sm-10">
                              <input type="file" className="form-control" id="input-sport-logo" onChange={(e) => this._handleFileChange(e)} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-sport-description" className="col-sm-2 control-label">Description</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-sport-description" placeholder="Description" value={this.state.temp.description || ''} onChange={(e) => this._handleChange(e, 'description')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                              <div className="checkbox">
                                <label>
                                  <input type="checkbox" value={this.state.temp.isIndividual || ''} onChange={(e) => this._handleCheckboxChange(e)} /> Is Individual
                                </label>
                              </div>
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