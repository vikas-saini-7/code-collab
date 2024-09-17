import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IFile {
  id: number;
  icon: string;
  name: string;
  extension: string;
  type: string;
  size: number;
  value?: string;
}

const FILES: IFile[] = [
  {
    id: 1,
    icon: "📄",
    name: "script",
    extension: "js",
    type: "document",
    size: 1024,
    value: `console.log("Hello World from store")`,
  },
  {
    id: 2,
    icon: "📄",
    name: "spreadsheet",
    extension: "xlsx",
    type: "spreadsheet",
    size: 2048,
    value: `sheet value`,
  },
];

interface filesState {
  filesList: IFile[];
  activeFile: IFile;
}

const initialState: filesState = {
  filesList: FILES,
  activeFile: FILES[0],
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    changeCode: (state, action) => {
      console.log("Running", action.payload);
      state.activeFile.value = action.payload;
    },
    changeActiveFile: (state, action) => {
      let file = action.payload;
      state.activeFile = file;
    },
    saveFile: (state, action) => {
      // Determine the MIME type based on the file extension
      let fileType = "text/plain;charset=utf-8"; // Default MIME type
      switch (state.activeFile.extension) {
        case "txt":
          fileType = "text/plain;charset=utf-8";
          break;
        case "json":
          fileType = "application/json";
          break;
        case "html":
          fileType = "text/html;charset=utf-8";
          break;
        case "cpp":
          fileType = "text/x-c++src";
          break;
        case "java":
          fileType = "text/x-java-source";
          break;
        case "js":
          fileType = "application/javascript";
          break;
        // Add more cases as needed for other file types
        default:
          fileType = "application/octet-stream"; // Fallback MIME type
      }

      console.log("saving file");
      const blob = new Blob([state.activeFile.value], {
        type: fileType,
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = state.activeFile.name;
      link.click();
    },
  },
});

export const { changeCode, changeActiveFile, saveFile } = filesSlice.actions;
export default filesSlice.reducer;
