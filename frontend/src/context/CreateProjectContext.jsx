import { createContext, useState } from 'react';

const CreateProjectContext = createContext();

export const CreateProjectContextProvider = ({ children }) => {
    const [openCreateProjectModal, setOpenCreateProject] = useState(false);
    const [isClicked, setIsClicked] = useState(false);


    return (
        <CreateProjectContext.Provider value={{ openCreateProjectModal, setOpenCreateProject, isClicked, setIsClicked }}>
            {children}
        </CreateProjectContext.Provider>
    )
}

export default CreateProjectContext;