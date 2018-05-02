import React, { Component } from 'react'
import axios from 'axios'
import Pagination from 'react-js-pagination'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import { getParameterByName } from '../libs/common'

export default class match extends Component {
  constructor(props) {
    super(props)
    this.state = {
      matches: [],
      regions: [],
      sports: [],
      paginator: null,
      limit: 10,
      temp: {},
      tempLogo1: null,
      tempLogo2: null,
      isEdit: false
    }
  }

  async componentDidMount() {
    this._reload()
    try {
      let promises = [axios.get('/api/regions?all=true'), axios.get('/api/sports?all=true')]
      let [regions, sports] = await Promise.all(promises)

      this.setState({
        regions: regions.data.data,
        sports: sports.data.data,
        temp: {}
      })
    } catch (err) {
      console.error(err)
    }
  }

  async _reload(page, limit) {
    if (!page) page = getParameterByName('page')
    if (!limit) limit = getParameterByName('limit')
    try {
      let matches = await axios.get(`/api/matches?page=${page}&limit=${limit}`)
      this.setState({
        matches: matches.data.data,
        paginator: matches.data.paginator,
        limit: matches.data.limit
      })
    } catch (err) {
      console.error(err)
    }
  }

  _handleChange(e, field) {
    if (field == 'startAt') {
      e = {
        target: {
          value: e
        }
      }
    }

    this.setState({
      temp: Object.assign(this.state.temp, {
        [field]: e.target.value
      })
    })
  }

  async _handleFileChange(e, field) {
    const files = e.target.files
    if (!files.length) return
    const logo = files[0]
    let data = new FormData()
    data.append('file', logo, logo.fileName)

    try {
      const response = await axios.post('/api/image/upload?path=match', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const logo = response.data
      await this.setState({
        temp: Object.assign(this.state.temp, {
          [field]: logo.url
        })
      })
    } catch (err) {
      console.error(err)
    }
  }

  async _handleOpenEditModal(e, match) {
    let temp = {...match}
    temp.region = temp.region._id
    temp.sport = temp.sport._id
    temp.startAt = moment(temp.startAt)
    await this.setState({ isEdit: true, temp, tempLogo1: null, tempLogo2: null })
    $('#create-match-modal').modal('toggle')
  }

  async _handleOpenCreateModal(e) {
    await this.setState({ isEdit: false, temp: {}, tempLogo1: null, tempLogo2: null })
    $('#create-match-modal').modal('toggle')
  }

  async _handleUpdate(e) {
    let keywords = []
    if (typeof(this.state.temp.keywords) == 'string') {
      keywords = this.state.temp.keywords.split(',')
      keywords = keywords.map(keyword => keyword.trim())
    } else {
      keywords = this.state.temp.keywords
    }

    let match = {
      ...this.state.temp,
      keywords
    }

    try {
      await axios.put(`/api/matches/${this.state.temp._id}`, match)
      await this.setState({
        temp: {},
        tempLogo1: null,
        tempLogo2: null
      })
      this._reload()
      $('#create-match-modal').modal('toggle')
    } catch (err) {
      console.error(err)
    }
  }

  async _handleSave(e) {
    let keywords = []
    if (this.state.temp.keywords) {
      keywords = this.state.temp.keywords.split(',')
      keywords = keywords.map(keyword => keyword.trim())
    } else {
      keywords = this.state.temp.keywords
    }

    let newMatch = {
      ...this.state.temp,
      keywords
    }

    try {
      await axios.post('/api/matches', newMatch)
      await this.setState({
        temp: {}
      })
      this._reload()
      $('#create-match-modal').modal('toggle')
    } catch (err) {
      console.error(err)
    }
  }

  async _handleDelete(e, matchId) {
    try {
      await axios.delete(`/api/matches/${matchId}`)
      this._reload()
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    let matches = []
    if (this.state.matches.length) {
      this.state.matches.forEach(match => {
        let keywords = ''
        match.keywords.forEach((keyword, index) => {
          keywords += keyword
          if (index != match.keywords.length - 1) keywords += ', '
        })
        matches.push(
          <tr key={match._id}>
            <td></td>
            <td>{match.name}</td>
            <td>{keywords}</td>
            <td>{match.description}</td>
            <td><a href={match.streamUrl} target="blank">[Link]</a></td>
            <td>{match.region.name}</td>
            <td>{match.sport.name}</td>
            <td>{match.logo1 ? <img src={`public/${match.logo1}`} height="40" /> : null}</td>
            <td>{match.logo2 ? <img src={`public/${match.logo2}`} height="40" /> : null}</td>
            <td>{moment(match.startAt).format('hh:mm, DD/MM')}</td>
            <td>
              <button type="button" className="btn btn-sm btn-primary" onClick={(e) => this._handleOpenEditModal(e, match)}><i className="fa fa-edit"></i> Edit</button>
              <button type="button" className="btn btn-sm btn-danger" onClick={(e) => this._handleDelete(e, match._id)}><i className="fa fa-trash"></i> Delete</button>
            </td>
          </tr>
        )
      })
    }

    let regionItems = []
    if (this.state.regions.length) {
      this.state.regions.forEach(region => {
        regionItems.push(
          <option key={`region-${region._id}`} value={region._id}>{region.name}</option>
        )
      })
    }

    let sportItems = []
    if (this.state.sports.length) {

      this.state.sports.forEach(sport => {
        sportItems.push(
          <option key={`sport-${sport._id}`} value={sport._id}>{sport.name}</option>
        )
      })
    }

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="box">
            <div className="box-header">
              <h3 className="box-title">Matches List</h3>
            </div>

            <div className="box-body table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Keywords</th>
                    <th>Description</th>
                    <th>Stream URL</th>
                    <th>Region</th>
                    <th>Sport</th>
                    <th>Logo 1</th>
                    <th>Logo 2</th>
                    <th>Start At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {matches}
                </tbody>
              </table>
              <div className="col-md-5">
                <button type="button" className="btn btn-default" data-toggle="modal" onClick={(e) => this._handleOpenCreateModal(e)}>
                  Create new Match
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

              <div className="modal fade" id="create-match-modal" style={{display: 'none'}}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Create new match</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span></button>
                    </div>
                    <div className="modal-body">
                      <form id="match-form" className="form-horizontal">
                        <div className="box-body">
                          <div className="form-group">
                            <label htmlFor="input-match-name" className="col-sm-3 control-label">Name</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" id="input-match-name" placeholder="Name" value={this.state.temp.name || ''} onChange={(e) => this._handleChange(e, 'name')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-keywords" className="col-sm-3 control-label">Keywords</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" id="input-match-keywords" placeholder="Keywords" value={this.state.temp.keywords || ''} onChange={(e) => this._handleChange(e, 'keywords')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-description" className="col-sm-3 control-label">Description</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" id="input-match-description" placeholder="Description" value={this.state.temp.description || ''} onChange={(e) => this._handleChange(e, 'description')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-stream-url" className="col-sm-3 control-label">Stream URL</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" id="input-match-stream-url" placeholder="Stream URL" value={this.state.temp.streamUrl || ''} onChange={(e) => this._handleChange(e, 'streamUrl')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-region" className="col-sm-3 control-label">Region Name</label>
                            <div className="col-sm-9">
                              <select id="input-match-region" className="form-control" value={this.state.temp.region || ''} onChange={(e) => this._handleChange(e, 'region')}>
                                <option>-- Select Region --</option>
                                {regionItems}
                              </select>
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-sport" className="col-sm-3 control-label">Sport Name</label>
                            <div className="col-sm-9">
                              <select id="input-match-sport" className="form-control" value={this.state.temp.sport || ''} onChange={(e) => this._handleChange(e, 'sport')}>
                                <option>-- Select Sport --</option>
                                {sportItems}
                              </select>
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-logo1" className="col-sm-3 control-label">Logo 1</label>
                            <div className="col-sm-9">
                              <input type="file" className="form-control" id="input-match-logo1" onChange={(e) => this._handleFileChange(e, 'logo1')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-logo2" className="col-sm-3 control-label">Logo 2</label>
                            <div className="col-sm-9">
                              <input type="file" className="form-control" id="input-match-logo2" onChange={(e) => this._handleFileChange(e, 'logo2')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-start-at" className="col-sm-3 control-label">Date</label>
                            <div className="col-sm-9">
                              <div className="input-group col-sm-12">
                                <DatePicker selected={this.state.temp.startAt} showTimeSelect onChange={(date) => this._handleChange(date, 'startAt')} />
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