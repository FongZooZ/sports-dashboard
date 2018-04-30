import React from 'react'
import { HashRouter, Route, Link } from 'react-router-dom'

import Region from './region'
import Sport from './sport'
import Match from './match'

const Dashboard = () => (
  <HashRouter>
    <div>
      <header className="main-header">
        <nav className="navbar navbar-static-top">
          <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </a>

          <div className="navbar-custom-menu">
            <ul className="nav navbar-nav">
              <li>
                <a href="/api/users/logout">Log Out <i className="fa fa-sign-out"></i></a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <aside className="main-sidebar">
        <section className="sidebar">
          <ul className="sidebar-menu" data-widget="tree">
            <li className="header">Admin</li>
            <li>
              <Link to="/regions">
                <i className="fa fa-globe"></i>
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