import React from 'react';
import { NavLink } from 'react-router-dom';

function Nav() {
  return (
    <div className="h-50">
  <nav role="navigation">
    <ul className="nav">
      <li><NavLink to="/" end className={({ isActive })=> (isActive ? 'active-link' : '')} > HOME </NavLink></li>
      <li><NavLink to="/signed" className={({ isActive })=> (isActive ? 'active-link' : '')} > SIGNED </NavLink></li>
      <li><NavLink to="/request" className={({ isActive })=> (isActive ? 'active-link' : '')} > REQUEST </NavLink></li>
      <li><NavLink to="/cfc" className={({ isActive })=> (isActive ? 'active-link' : '')} > CFC </NavLink></li>
      <li><NavLink to="/certified" className={({ isActive })=> (isActive ? 'active-link' : '')} > CERTIFIED </NavLink></li>
      <li><NavLink to="/Search" className={({ isActive })=> (isActive ? 'active-link' : '')} > SEARCH </NavLink></li>
    </ul>
  </nav>
</div>
  );
}

export default Nav;
