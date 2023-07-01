import { render } from 'react-dom'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";

const rootElement = document.getElementById('root');
render(<BrowserRouter>
    <App />
</BrowserRouter>, rootElement);
