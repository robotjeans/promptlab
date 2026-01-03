import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { routes } from "./routes";

const router = createBrowserRouter(routes);

function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </HelmetProvider>
  );
}

export default App;
