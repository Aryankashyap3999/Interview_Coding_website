import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { currentframeworks } from "@/utils/frameworkSupported";
import { useState } from "react";
import { useCreateProject } from "@/hooks/apis/mutation/useCreateProject"; 
import { useNavigate } from "react-router-dom";

export const CreateProjectModal = ({ openCreateProjectModal, setOpenCreateProject }) => {

    const [isClicked, setIsClicked] = useState(false);
    const [selectedFramework, setSelectedFramework] = useState('');
    const [projectName, setProjectName] = useState('');
    const { createProjectMutation } = useCreateProject();
    const navigate = useNavigate();

    function handleProjectCreation (ele) {
        console.log(ele);
        setIsClicked(true);
        setSelectedFramework(ele);
        
    }

    async function handleFormSubmit (e) {
        e.preventDefault();
        console.log(selectedFramework, projectName);
        setOpenCreateProject(false)
        setIsClicked(false);
        const response = await  createProjectMutation({ 
                name: projectName.trim(), 
                type: selectedFramework 
        });
        console.log("Created project:", { name: projectName, type: selectedFramework }, response);
        const projectId = response?.data?._id || response?.data?.id || response?.data;
        navigate(`/project/${projectId}`);



    }

  return (
    <Dialog open={openCreateProjectModal} onOpenChange={() => {
        setOpenCreateProject(false)
        setIsClicked(false);
    }}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white border border-slate-700 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Choose Your Project
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            There are projects you can choose
          </DialogDescription>
        </DialogHeader>

        <div className="fleprojectNamex flex-col items-center justify-center py-8 gap-y-4">
            {isClicked ? 
                <div
                    className="w-64 flex items-center p-1 bg-blue border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer "
                >
                    <form className='space-y-4 m-4' onSubmit={handleFormSubmit}> 
                        <div className="flex-1 px-2">
                            <input
                                type="text"
                                placeholder="Enter project name"
                                className="w-full text-sm text-yellow placeholder-gray-400 bg-transparent outline-none"
                                minLength={3}
                                maxLength={15}
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                            />
                        </div>
                        <div>
                            <button 
                                className="flex items-center justify-center px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150"
                                type="submit"
                            >
                            Create
                            </button>
                        </div>
                    </form>
                </div>
                :
                <>
                    {currentframeworks.map((ele) => (
                        <Button
                            key={ele} 
                            className="w-48"
                            onClick={() => handleProjectCreation(ele)}
                        >
                            <p>{ele}</p>
                        </Button>
                        ))}
                </>

            }
        </div>
      </DialogContent>
    </Dialog>
  );
};
