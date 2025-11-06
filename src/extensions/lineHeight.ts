import { Extension, getAttributes } from "@tiptap/react";
import"@tiptap/extension-text-style";

// Added types to call inside the toolbar 
declare module "@tiptap/core" {
  interface Commands<ReturnType> { 
    lineHeight: { 
        setLineHeight: (size: string) => ReturnType 
        unsetLineHeight: () => ReturnType
    }
  }
}