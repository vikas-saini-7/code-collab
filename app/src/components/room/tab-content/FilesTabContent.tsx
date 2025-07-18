import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { FileComponent } from "../files/FileComponent";
import CreateNewFile from "../files/CreateNewFile";
import { IFile } from "@/types/types";
import { fetchFiles } from "@/services/file-services";
import { Skeleton } from "@/components/ui/skeleton";

interface FilesTabContentProps {
  activeFile: IFile | null;
  onChangeActiveFile: (fileId: IFile) => void;
}

const FilesTabContent: React.FC<FilesTabContentProps> = ({
  activeFile,
  onChangeActiveFile,
}) => {
  const { roomId } = useParams();
  const [files, setFiles] = useState<IFile[]>([]);
  const [createFileVisible, setCreateFileVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const toggleCreateFileVisibility = () => {
    setCreateFileVisible(!createFileVisible);
  };

  const handleFileCreate = (newFile: any) => {
    setFiles((prevFiles) => [...prevFiles, newFile]);
    setCreateFileVisible(false);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
  };

  const handleFetchFiles = async () => {
    setLoading(true);
    const res = await fetchFiles(roomId as string);
    if (res) {
      setFiles(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Fetch files from the server or database when the component mounts
    handleFetchFiles();
  }, [roomId]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3>Files</h3>
        <Button variant="ghost" size="sm" onClick={toggleCreateFileVisibility}>
          <IconPlus />
        </Button>
      </div>

      <div>
        {/* loading state  */}
        {loading && (
          <div className="space-y-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-2 p-2">
                <Skeleton className="h-4 w-4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* list mapping  */}
        {files.map((file, idx) => (
          <div
            onClick={() => onChangeActiveFile(file)}
            key={idx}
            className={`flex items-center justify-between border border-transparent hover:border-gray-500/10 hover:border-dashed cursor-pointer rounded-lg ${
              activeFile?._id === file._id ? "bg-gray-500/10" : ""
            }`}
          >
            <FileComponent
              fileName={file.name}
              fileId={file._id}
              onFileDelete={handleDeleteFile}
            />
          </div>
        ))}

        {/* loading state  */}
        {files.length === 0 && !loading && !createFileVisible && (
          <div>No files. Presss + icon to create one</div>
        )}

        {/* create new file  */}
        {createFileVisible && (
          <CreateNewFile
            onClose={toggleCreateFileVisibility}
            onFileCreate={handleFileCreate}
          />
        )}
      </div>
    </div>
  );
};

export default FilesTabContent;
