import React, { Component } from 'react'
import axios from 'axios'
import filter from 'lodash/filter'

export default class Sport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sports: [],
      temp: {}
    }
  }

  async componentDidMount() {
    try {
      let sports = await axios.get('/api/sports')
      this.setState({sports: sports.data})
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

  _handleCheckboxChange(e) {
    this.setState({
      temp: Object.assign(this.state.temp, {
        isIndividual: e.target.checked
      })
    })
  }

  async _handleUpdate(e, sport) {
  }

  async _handleSave(e) {
    let newSport
    try {
      newSport = await axios.post('/api/sports', this.state.temp)
      await this.setState({
        sports: [...this.state.sports, newSport.data],
        temp: {}
      })
      $('#create-sport-modal').modal('toggle')
      $('#sport-form')[0].reset()
    } catch (err) {
      console.error(err)
    }
  }

  async _handleDelete(e, sportId) {
    try {
      await axios.delete(`/api/sports/${sportId}`)
      await this.setState({
        sports: filter(this.state.sports, o => {
          return o._id != sportId
        })
      })
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
            <td>{sport.logo}</td>
            <td>{sport.description}</td>
            <td>{sport.isIndividual ? 'Yes' : 'No'}</td>
            <td>
              <button type="button" className="btn btn-sm btn-primary" onClick={(e) => this._handleUpdate(e, sport)}><i className="fa fa-edit"></i> Edit</button>
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
              <table className="table table-hover">
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
              <button type="button" className="btn btn-default" data-toggle="modal" data-target="#create-sport-modal">
                Create new sport
              </button>

              <div className="modal fade" id="create-sport-modal" style={{display: 'none'}}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Create new sport</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span></button>
                    </div>
                    <div className="modal-body">
                      <form id="sport-form" className="form-horizontal">
                        <div className="box-body">
                          <div className="form-group">
                            <label htmlFor="input-sport-name" className="col-sm-2 control-label">Name</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-sport-name" placeholder="Name" onBlur={(e) => this._handleBlur(e, 'name')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-sport-logo" className="col-sm-2 control-label">Logo</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-sport-logo" placeholder="Logo" onBlur={(e) => this._handleBlur(e, 'logo')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-sport-description" className="col-sm-2 control-label">Description</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-sport-description" placeholder="Description" onBlur={(e) => this._handleBlur(e, 'description')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                              <div className="checkbox">
                                <label>
                                  <input type="checkbox" onChange={(e) => this._handleCheckboxChange(e)} /> Is Individual
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-default pull-left" data-dismiss="modal">Close</button>
                      <button type="button" className="btn btn-primary" onClick={(e) => this._handleSave(e)}>Save sport</button>
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