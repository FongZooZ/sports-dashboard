import React from 'react'
import { HashRouter, Route, Link } from 'react-router-dom'

import Region from './region'
import Sport from './sport'
import Match from './match'

const Dashboard = () => (
  <HashRouter>
    <div>
      <aside className="main-sidebar">
        <section className="sidebar">
          <ul className="sidebar-menu" data-widget="tree">
            <li className="header">Admin</li>
            <li className="active">
              <Link to="/regions">
                <i className="fa fa-link"></i>
                <span>Regions</span>
              </Link>
            </li>
            <li>
              <Link to="/sports">
                <i className="fa fa-link"></i>
                <span>Sports</span>
              </Link>
            </li>
            <li>
              <Link to="/matches">
                <i className="fa fa-link"></i>
                <span>Matches</span>
              </Link>
            </li>
          </ul>
        </section>
      </aside>

      <div className="content-wrapper" style={{minHeight: 955}}>
        <section className="content-header">
          <h1>
            Dashboard
            <small>...</small>
          </h1>
        </section>

        <div className="content">
          <Route exact path="/" component={Region} />
          <Route path="/regions" component={Region} />
          <Route path="/sports" component={Sport} />
          <Route path="/matches" component={Match} />
        </div>
      </div>
    </div>
  </HashRouter>
)

export default Dashboard