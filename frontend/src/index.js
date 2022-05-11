import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import Create from "./routes/Create";
import ThumbnailSection from "./routes/ThumbnailSection";
import Skeleton from './routes/Skeleton';
import Upload from './routes/Upload';
import Home from './routes/Home';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="home" element={<Home />} />
        <Route path="create" element={<Create />} />
        <Route path="library" element={<ThumbnailSection />} />
        <Route path="skeleton" element={<Skeleton />} />
        <Route path="upload" element={<Upload />} />
      </Route>
    </Routes>
  </BrowserRouter>
);