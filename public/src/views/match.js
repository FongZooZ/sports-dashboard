import React, { Component } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'

export default class match extends Component {
  constructor(props) {
    super(props)
    this.state = {
      matches: [],
      regions: [],
      sports: [],
      temp: {},
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

  async _reload() {
    try {
      let matches = await axios.get('/api/matches')
      this.setState({matches: matches.data.data})
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

  async _handleOpenEditModal(e, match) {
    let temp = {...match}
    temp.region = temp.region._id
    temp.sport = temp.sport._id
    await this.setState({ isEdit: true, temp })
    $('#create-match-modal').modal('toggle')
  }

  async _handleOpenCreateModal(e) {
    await this.setState({ isEdit: false, temp: {} })
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
        temp: {}
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
            <td>{match.streamUrl}</td>
            <td>{match.region.name}</td>
            <td>{match.sport.name}</td>
            <td>{match.startAt}</td>
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
                    <th>Start At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {matches}
                </tbody>
              </table>
              <button type="button" className="btn btn-default" data-toggle="modal" onClick={(e) => this._handleOpenCreateModal(e)}>
                Create new Match
              </button>

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
                            <label htmlFor="input-match-name" className="col-sm-2 control-label">Name</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-match-name" placeholder="Name" value={this.state.temp.name || ''} onChange={(e) => this._handleChange(e, 'name')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-keywords" className="col-sm-2 control-label">Keywords</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-match-keywords" placeholder="Keywords" value={this.state.temp.keywords || ''} onChange={(e) => this._handleChange(e, 'keywords')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-description" className="col-sm-2 control-label">Description</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-match-description" placeholder="Description" value={this.state.temp.description || ''} onChange={(e) => this._handleChange(e, 'description')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-stream-url" className="col-sm-2 control-label">Stream URL</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-match-stream-url" placeholder="Stream URL" value={this.state.temp.streamUrl || ''} onChange={(e) => this._handleChange(e, 'streamUrl')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-region">Region Name</label>
                            <select id="input-match-region" className="form-control" value={this.state.temp.region || ''} onChange={(e) => this._handleChange(e, 'region')}>
                              <option>-- Select Region --</option>
                              {regionItems}
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-sport">Sport Name</label>
                            <select id="input-match-sport" className="form-control" value={this.state.temp.sport || ''} onChange={(e) => this._handleChange(e, 'sport')}>
                              <option>-- Select Sport --</option>
                              {sportItems}
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-start-at">Date:</label>
                            <div className="input-group date">
                              <div className="input-group-addon">
                                <i className="fa fa-calendar"></i>
                              </div>
                              <DatePicker selected={this.state.temp.startAt} onChange={(date) => this._handleChange(date, 'startAt')} />
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