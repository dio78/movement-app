import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import Expenses from "./routes/expenses";
import ThumbnailSection from "./routes/ThumbnailSection";
import Skeleton from './routes/Skeleton';
import Upload from './routes/Upload';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="expenses" element={<Expenses />} />
        <Route path="library" element={<ThumbnailSection />} />
        <Route path="skeleton" element={<Skeleton />} />
        <Route path="upload" element={<Upload />} />
      </Route>
    </Routes>
  </BrowserRouter>
);