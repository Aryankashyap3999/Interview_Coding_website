import { Route, Routes } from "react-router-dom";
import { CreateProject } from "./pages/CreateProject";
import ProjectPlayGround from "./pages/ProjectPlayGround";
import { Notfound } from "./pages/Notfound/Notfound";
import { SigninContainer } from "./components/organisms/Auth/SigninContainer";
import { Auth } from "./pages/Auth/Auth";
import { SignupContainer } from "./components/organisms/Auth/SignupContainer";
import Home from "./pages/Home/Home";
import Room from "./pages/Room/Room";

export default function Router () {
    return (
        <Routes>
            <Route path="/" element={<CreateProject />} />
            <Route path="/home" element={<Home/>} />
            <Route path="room/:id" element={<Auth><Room /></Auth>}/>
            <Route path='/project/:projectId' element={<ProjectPlayGround />} />
            <Route path="/auth/signin" element={<Auth><SigninContainer /></Auth>} />
            <Route path="/auth/signup" element={<Auth><SignupContainer /></Auth>} />
            <Route path="/*" element={<Notfound />} />
        </Routes>
    )
}