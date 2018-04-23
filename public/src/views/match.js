import React, { Component } from 'react'
import axios from 'axios'
import filter from 'lodash/filter'

export default class match extends Component {
  constructor(props) {
    super(props)
    this.state = {
      matches: [],
      regions: [],
      sports: [],
      temp: {}
    }
  }

  async componentDidMount() {
    try {
      let promises = [axios.get('/api/matches'), axios.get('/api/regions'), axios.get('/api/sports')]
      let [matches, regions, sports] = await Promise.all(promises)

      this.setState({
        matches: matches.data,
        regions: regions.data,
        sports: sports.data,
        temp: {}
      })
    } catch (err) {
      console.error(err)
    }
  }

  _handleBlur(e, field) {
    this.setState({
      temp: Object.assign(this.state.temp, {
        [field]: e.target.value
      })
    })
  }

  async _handleUpdate(e, match) {
    e.prevenDefault()
  }

  async _handleSave(e) {
    let keywords = []
    if (this.state.temp.keywords) keywords = this.state.temp.keywords.split(',')
    keywords = keywords.map(keyword => keyword.trim())
    let newMatch = {
      ...this.state.temp,
      keywords
    }

    try {
      newMatch = await axios.post('/api/matches', newMatch)
      await this.setState({
        matches: [...this.state.matches, newMatch.data],
        temp: {}
      })
      $('#create-match-modal').modal('toggle')
      $('#match-form')[0].reset()
    } catch (err) {
      console.error(err)
    }
  }

  async _handleDelete(e, matchId) {
    try {
      await axios.delete(`/api/matches/${matchId}`)
      await this.setState({
        matches: filter(this.state.matches, o => {
          return o._id != matchId
        })
      })
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
              <button type="button" className="btn btn-block btn-primary" onClick={(e) => this._handleUpdate(e, match)}><i className="fa fa-save"></i> Save</button>
              <button type="button" className="btn btn-block btn-danger" onClick={(e) => this._handleDelete(e, match._id)}><i className="fa fa-save"></i> Delete</button>
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
        <div className="col-xs-12">
          <div className="box">
            <div className="box-header">
              <h3 className="box-title">Matches List</h3>
            </div>

            <div className="box-body table-responsive no-padding">
              <table className="table table-hover no-margin">
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
              <button type="button" className="btn btn-default" data-toggle="modal" data-target="#create-match-modal">
                Create new match
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
                              <input type="text" className="form-control" id="input-match-name" placeholder="Name" onBlur={(e) => this._handleBlur(e, 'name')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-keywords" className="col-sm-2 control-label">Keywords</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-match-keywords" placeholder="Keywords" onBlur={(e) => this._handleBlur(e, 'keywords')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-description" className="col-sm-2 control-label">Description</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-match-description" placeholder="Description" onBlur={(e) => this._handleBlur(e, 'description')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-stream-url" className="col-sm-2 control-label">Stream URL</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-match-stream-url" placeholder="Stream URL" onBlur={(e) => this._handleBlur(e, 'streamUrl')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-region">Region Name</label>
                            <select id="input-match-region" className="form-control" onBlur={(e) => this._handleBlur(e, 'region')}>
                              <option>-- Select Region --</option>
                              {regionItems}
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-sport">Sport Name</label>
                            <select id="input-match-sport" className="form-control" onBlur={(e) => this._handleBlur(e, 'sport')}>
                              <option>-- Select Sport --</option>
                              {sportItems}
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-match-start-at">Date:</label>
                            <div id="input-match-start-at" className="input-group date">
                              <div className="input-group-addon">
                                <i className="fa fa-calendar"></i>
                              </div>
                              <input type="text" className="form-control pull-right" onBlur={(e) => this._handleBlur(e, 'startAt')} />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-default pull-left" data-dismiss="modal">Close</button>
                      <button type="button" className="btn btn-primary" onClick={(e) => this._handleSave(e)}>Save match</button>
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