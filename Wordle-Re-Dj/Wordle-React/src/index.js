import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.Fragment>
        {/*<div className="navbar bg-neutral text-neutral-content">*/}
        {/*    <a className="btn btn-ghost normal-case text-xl">GamPly</a>*/}
        {/*</div>*/}
        <div className="navbar bg-neutral text-neutral-content">
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl">GamPly</a>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li tabIndex={0}>
                        <a>
                            WORDLE
                            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </a>
                        <ul className="p-2 bg-primary" style={{zIndex: 7}}>
                            <li><a>Submenu 1</a></li>
                            <li><a>Submenu 2</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <App />
    </React.Fragment>
);
