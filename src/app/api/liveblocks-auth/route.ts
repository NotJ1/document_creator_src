import {Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
})

export async function POST(req: Request ) { 
   const {sessionClaims} = await auth();
   console.log("Next.js Session Claims:", sessionClaims);
   if(!sessionClaims) { 
    return new Response("Unauthorised", { status: 401 });
   }

   
   const user = await currentUser();
   
   if(!user){
    return new Response("Unauthorised", { status: 401 });
   }
   
   const { room } = await req.json();
   const document = await convex.query(api.documents.getById, { id: room})
   
   if(!document) { 
    return new Response("Unauthorised", { status: 401 });
   }
   
  
  
const isOwner = document.ownerId === user.id;

const isOrganisationMember = !!(document.organisationId && document.organisationId === sessionClaims.organisation_Id);
console.log("--- LIVEBLOCKS AUTH DEBUG ---");
    console.log("Room ID:", room);
    console.log("User ID (Clerk):", user.id);
    console.log("Doc Owner ID:", document.ownerId);
    console.log("Is Owner?", isOwner);
    console.log("Doc Org ID:", document.organisationId);
    console.log("User Active Org ID (Token):", (sessionClaims as any).organisation_Id);
    console.log("Is Org Member?", isOrganisationMember);
    console.log("-----------------------------"); 
if(!isOwner && !isOrganisationMember) { 
    return new Response("Unauthorised", { status: 401 });
}

const session = liveblocks.prepareSession(user.id,{
    userInfo: {
        name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
        avatar: user.imageUrl,
    }
})
session.allow(room, session.FULL_ACCESS);
const { body, status } = await session.authorize();

return new Response(body, { status })

}
    
