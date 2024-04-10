import React from 'react'
import {createRoot} from 'react-dom/client'
import RemoteSelect from './RemoteSelect.jsx'
import './main.css'

document.querySelectorAll('.remoteSelect').forEach(function (app) {
    const root = createRoot(app);
    root.render(<RemoteSelect
        url={app.dataset.url}
        currentValue={app.dataset.currentValue}
    />);
})

