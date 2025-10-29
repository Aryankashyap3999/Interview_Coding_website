import CreateProjectContext from "@/context/CreateProjectContext";
import { useContext } from "react"

export const useCreateProjectModal = () => {
    return useContext(CreateProjectContext);
}