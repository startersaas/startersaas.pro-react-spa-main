import React, { createContext, useState, useContext } from "react";

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const toggleWorkspace = () => {
    setWorkspaceOpen((prev) => !prev);
  };

  return (
    <WorkspaceContext.Provider value={{ workspaceOpen, setWorkspaceOpen, toggleWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);