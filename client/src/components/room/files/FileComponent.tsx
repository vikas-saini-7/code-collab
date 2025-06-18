import React from "react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { getFileIcon } from "@/lib/getFileIcon";
import { deleteFile } from "@/services/file-services";

interface FileComponentProps {
  fileName: string;
  fileId: string;
  onFileDelete: (fileId: string) => void;
}

export const FileComponent: React.FC<FileComponentProps> = ({
  fileName,
  fileId,
  onFileDelete,
}) => {
  const handleFileDelete = async () => {
    // Logic to delete the file
    const res = await deleteFile(fileId);
    if (res.status === 200) {
      console.log("File deleted successfully");
      onFileDelete(fileId);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex items-center gap-2 w-full p-2">
        <div>{getFileIcon(fileName)}</div>
        <div>{fileName}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem inset>
          Save
          <ContextMenuShortcut></ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem inset variant="destructive" onClick={handleFileDelete}>
          Delete
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">
            <ContextMenuItem>Save Page...</ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        {/* <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          Show Bookmarks
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value="pedro">
          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuRadioItem value="pedro">
            Pedro Duarte
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup> */}
      </ContextMenuContent>
    </ContextMenu>
  );
};
