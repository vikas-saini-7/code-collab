import socket from "@/utils/socket";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

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
    name: "program",
    extension: "java",
    type: "spreadsheet",
    size: 2048,
    value: `psvm()`,
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
    // change code
    changeCode: (state, action) => {
      console.log("Running", action.payload);
      state.activeFile.value = action.payload;
    },

    changeCodeInFile: (state, action) => {
      // console.log(action.payload);
      const { fileId, code } = action.payload;
      console.log("From file reducer: ", fileId, code);
      state.filesList = state.filesList.map((item) => {
        if (item.id == fileId) {
          return { ...item, value: code };
        }
        return item;
      });

      if (state.activeFile.id === fileId) {
        state.activeFile.value = code;
      }

      console.log(state.filesList);
    },

    // changeActiveFile
    changeActiveFile: (state, action) => {
      let file = action.payload;
      state.activeFile = file;
    },

    // createFile
    createFile: (state, action) => {
      let [name, extension] = action.payload.split(".");
      let newFile: IFile = {
        id: state.filesList.length + 1,
        icon: "📄",
        name: name,
        extension: extension,
        size: 1024,
        type: "document",
        value: "",
      };
      state.filesList.push(newFile);
      state.activeFile = newFile;
      toast.success("file created");
    },

    // saveFile
    saveFile: (state, action) => {
      let fileType = "text/plain;charset=utf-8";
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
        default:
          fileType = "application/octet-stream";
      }

      console.log("saving file");
      const blob = new Blob([state.activeFile.value || ""], {
        type: fileType,
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = state.activeFile.name + "." + state.activeFile.extension;
      link.click();
    },

    fileDelete: (state, action) => {
      let consent = confirm("Are you sure You want to delete this file");
      if (consent) {
        state.filesList = state.filesList.filter(
          (item) => item.id !== action.payload.id
        );
      }
    },
  },
});

export const {
  changeCode,
  changeCodeInFile,
  changeActiveFile,
  createFile,
  saveFile,
  fileDelete,
} = filesSlice.actions;
export default filesSlice.reducer;
