import React, { Component } from 'react'
import axios from 'axios'

export default class Region extends Component {
  constructor(props) {
    super(props)
    this.regions = []
  }

  async componentDidMount() {
    try {
      let regions = axios.get('/api/regions')
      this.setState({regions})
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    let items = []
    if (this.regions.length) {
      this.regions.forEach(region => {
        let keywords = ''
        region.keywords.forEach((keyword, index) => {
          keywords += keyword
          if (index != region.keywords.length - 1) keywords += ', '
        })
        items.push(
          <tr>
            <td></td>
            <td>{region.name}</td>
            <td>{region.logo}</td>
            <td>{keywords}</td>
            <td>{region.description}</td>
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}