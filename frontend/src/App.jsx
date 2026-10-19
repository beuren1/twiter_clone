import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import ChangePassword from "./pages/ChangePassword";
import Connections from "./pages/Connections";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import EditProfile from "./pages/EditProfile";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Users from "./pages/Users";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/cadastro"
            element={<Register />}
          />

          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />

          <Route
            path="/novo-post"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editar-perfil"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/alterar-senha"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editar-post/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/conexoes"
            element={
              <ProtectedRoute>
                <Connections />
              </ProtectedRoute>
            }
          />
        </Routes>

        <footer className="footer">
          © 2026 Josué Beuren • Desenvolvido durante o curso da EBAC
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;