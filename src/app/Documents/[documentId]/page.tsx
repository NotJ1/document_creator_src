import { Editor } from "./editor";

interface DocumentIdPageProps { 
    params: Promise<{ documentId: string }>;
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => { 
    const awaitedParams = await params;
    const documentId = awaitedParams.documentId;
    return ( 
        <div className="min-h-screen bg-[#FAFBFD]">
          Document ID: {documentId}  
          <Editor />
        </div>
    );
}

export default DocumentIdPage