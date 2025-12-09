"use client";

import {AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog"
import { Id } from "../../convex/_generated/dataModel";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api"
import { useState } from "react";
import { toast } from "sonner";

interface RemoveDialogProps { 
    documentId: Id<"documents">;
    children: React.ReactNode 
};

export const RemoveDialog = ({ documentId, children}: RemoveDialogProps) => { 
    const remove = useMutation(api.documents.removeById);
    const [isRemoving, setIsRemoving] = useState(false);

    return ( 
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will delete your document forever.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                disabled={isRemoving}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsRemoving(true);
                    remove({ id: documentId})
                    .catch(() => toast.error("You do not have permission to remove this document."))
                    .then(() => toast.success("Document removed"))
                    .finally(() => setIsRemoving(false));
                }}
                >
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}