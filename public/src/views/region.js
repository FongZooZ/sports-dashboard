import React, { Component } from 'react'
import axios from 'axios'

export default class Region extends Component {
  constructor(props) {
    super(props)
    this.state = {
      regions: [],
      temp: {}
    }
  }

  async componentDidMount() {
    try {
      let regions = await axios.get('/api/regions')
      this.setState({regions: regions.data})
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

  async _handleUpdate(e, region) {
    e.prevenDefault()
  }

  async _handleSave(e) {
    let keywords = []
    if (this.state.temp.keywords) keywords = this.state.temp.keywords.split(',')
    keywords = keywords.map(keyword => keyword.trim())
    let newRegion = {
      ...this.state.temp,
      keywords
    }

    try {
      newRegion = await axios.post('/api/regions', newRegion)
      await this.setState({
        regions: [...this.state.regions, newRegion.data],
        temp: {}
      })
      $('#create-region-modal').modal('toggle')
      $('#region-form')[0].reset()
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
            <td>{region.logo}</td>
            <td>{keywords}</td>
            <td>{region.description}</td>
            <td><button type="button" className="btn btn-block btn-primary" onClick={(e) => this._handleUpdate(e, region)}><i className="fa fa-save"></i> Save</button></td>
          </tr>
        )
      })
    }

    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="box">
            <div className="box-header">
              <h3 className="box-title">Responsive Hover Table</h3>
            </div>

            <div className="box-body table-responsive no-padding">
              <table className="table table-hover no-margin">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Logo</th>
                    <th>Keywords</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {items}
                </tbody>
              </table>
              <button type="button" className="btn btn-default" data-toggle="modal" data-target="#create-region-modal">
                Create new Region
              </button>

              <div className="modal fade" id="create-region-modal" style={{display: 'none'}}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Create new Region</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span></button>
                    </div>
                    <div className="modal-body">
                      <form id="region-form" className="form-horizontal">
                        <div className="box-body">
                          <div className="form-group">
                            <label htmlFor="input-region-name" className="col-sm-2 control-label">Name</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-region-name" placeholder="Name" onBlur={(e) => this._handleBlur(e, 'name')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-region-logo" className="col-sm-2 control-label">Logo</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-region-logo" placeholder="Logo" onBlur={(e) => this._handleBlur(e, 'logo')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-region-keywords" className="col-sm-2 control-label">Keywords</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-region-keywords" placeholder="Keywords" onBlur={(e) => this._handleBlur(e, 'keywords')} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="input-region-description" className="col-sm-2 control-label">Description</label>
                            <div className="col-sm-10">
                              <input type="text" className="form-control" id="input-region-description" placeholder="Description" onBlur={(e) => this._handleBlur(e, 'description')} />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-default pull-left" data-dismiss="modal">Close</button>
                      <button type="button" className="btn btn-primary" onClick={(e) => this._handleSave(e)}>Save Region</button>
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