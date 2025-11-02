"use client"

import { cn } from "@/lib/utils";
import { BoldIcon, ChevronDownIcon, ItalicIcon, ListTodoIcon, LucideIcon, MessageSquarePlusIcon, PrinterIcon, Redo2Icon, RemoveFormattingIcon, SpellCheckIcon, UnderlineIcon, Undo2Icon } from "lucide-react";
import { useEditorStore } from '@/store/useEditorStore'; 
import { Separator } from "@radix-ui/react-separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import FontFamily from "@tiptap/extension-font-family";
import { Value } from "@radix-ui/react-select";
import TextStyle from "@tiptap/extension-text-style";
import { type Level} from "@tiptap/extension-heading"

// Dropdown menu to change heading size
const HeadingLevelButton = () => { 
  const { editor } = useEditorStore();

  const headings = [
    { label: "Normal text", value: 0, fontSize: "16px"},
    { label: "Heading 1", value: 1, fontSize: "24px"},
    { label: "Heading 2", value: 2, fontSize: "20px"},
    { label: "Heading 3", value: 3, fontSize: "18px"},
    { label: "Heading 4", value: 4, fontSize: "16px"},
  ];

  const getCurrentHeading = () => { 
    for(let level = 1; level <= 5; level++) { 
      if(editor?.isActive("heading", { level })) { 
        return 'Heading ${level}';
      }
    }
    return "Normal text"
  }
  return ( 
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
         <button
            className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200 px-1.5 overflow-hidden text-sm"
          >
            <span className="truncate">
              {getCurrentHeading()}
            </span>
            <ChevronDownIcon className="ml-2 size-4 shrink-0" />
          </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {headings.map(({ label, value, fontSize}) => ( 
          <button
            key={value}
            style={{fontSize }}
            onClick={() => { 
              if (value === 0) { 
                editor?.chain().focus().setParagraph().run();
              } else{
                editor?.chain().focus().toggleHeading({ level: value as Level}).run();
              }
            }}
            className={cn(
              //Check if value is 0 and the editor is not active on a heading or is active and matches current level then render the selected value
                "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                (value === 0 && !editor?.isActive("heading")) || editor?.isActive("heading", { level: value}) && "bg-neutral-200/80"
              )}
            >
              {label}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Drop down menu to change fonts
const FontFamilyButton = () => { 
    const { editor } = useEditorStore();
    
    const fonts = [ 
      { label: "Arial", value: "Arial" },
      { label: "Times New Roman", value: "Times new Roman" },
      { label: "Courier New", value: "Courier New" },
      { label: "Georgia", value: "Georgia" },
    ];
    return ( 
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200 px-1.5 overflow-hidden text-sm"
          >
            <span className="truncate">
              {editor?.getAttributes("textStyle").fontFamily || "Arial"}
            </span>
            <ChevronDownIcon className="ml-2 size-4 shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-1 flex flex-col gap-y-1"> 
          {fonts.map(({ label, value}) => (    
           <button
            onClick={() => editor?.chain().focus().setFontFamily(value).run()}
              key={value}
              className={cn(
                "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                editor?.getAttributes("textStyle").fontFamily === value && "bg-neutral-200/80"
              )}
              style={{ fontFamily: value}}
            >
              <span className="text-sm">{label}</span>
            </button>
         ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
}; 

interface ToolbarButtonProps { 
    onClick?: () => void;
    isActive?: boolean;
    icon: LucideIcon;
};

// Toolbar behaviour and styling
const ToolbarButton = ({ 
    onClick,
    isActive,
    icon: Icon,
}: ToolbarButtonProps) => { 
   return ( 
    <button
      onClick={onClick}
      className={cn(
        "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
        isActive && "bg-neutral-200/80"
    )}
    >
      <Icon className="size-4" />
    </button>
   )
}

// Stores features of the toolbar
export const Toolbar = () => { 
  const { editor } = useEditorStore();
  console.log("Toolbar editor: ",{ editor })
    
  const sections: {
        label: string;
        icon: LucideIcon;
        onClick: () => void;
        isActive?: boolean;
    }[][] = [
      // First array holds Undo,Redo,Print,Spell Check
      [ 
        { 
          label: "Undo",
          icon: Undo2Icon,
          onClick: () => editor?.chain().focus().undo().run(),
        },
        { 
          label:"Redo",
          icon: Redo2Icon,
          onClick: () => editor?.chain().focus().redo().run(),
        },
        { 
          label: "Print",
          icon: PrinterIcon,
          onClick: () => window.print(),
        },
        { 
          label: "Spell Check",
          icon: SpellCheckIcon,
          onClick: () => { 
            const current = editor?.view.dom.getAttribute("spellcheck");
            editor?.view.dom.setAttribute("spellcheck", current === "false" ? "true" : "false");
          }
        },
      ],
      // Second array holds Bold,Italic,Underline
      [
        {
          label: "Bold",
          icon: BoldIcon,
          isActive: editor?.isActive("bold"),
          onClick: () => editor?.chain().focus().toggleBold().run(),
        },
        {
          label: "Italic",
          icon: ItalicIcon,
          isActive: editor?.isActive("italic"),
          onClick: () => editor?.chain().focus().toggleItalic().run(),
        },
        {
          label: "Underline",
          icon: UnderlineIcon,
          isActive: editor?.isActive("underline"),
          onClick: () => editor?.chain().focus().toggleUnderline().run(),
        },
      ],
      // Third array holds Comment,List Todo,Remove Formatting
      [
        {
        label: "Comment",
          icon: MessageSquarePlusIcon,
          onClick: () => console.log("Comment"),
          isActive: false,
        },
        {
        label: "List Todo",
          icon: ListTodoIcon,
          onClick: () => editor?.chain().focus().toggleTaskList().run(),
          isActive: editor?.isActive("taskList"),
        },
        {
        label: "Remove Formatting",
          icon: RemoveFormattingIcon,
          onClick: () => editor?.chain().focus().unsetAllMarks().run(),
          
        },
      ],
    ];
    
    //Iterates through toolbar features and returns the toolbar methods
    return ( 
      <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
        {sections[0].map((item) => ( 
            <ToolbarButton key={item.label} {...item} />
        ))}
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
        <FontFamilyButton />
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
        <HeadingLevelButton />
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
        {sections[1].map((item) => (
        <ToolbarButton key={item.label} {...item} /> 
        ))} 
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />






        {sections[2].map((item) => (
        <ToolbarButton key={item.label} {...item} /> 
        ))} 
      </div>
    );
};