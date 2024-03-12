"use client";

import { StickySidebar } from "@/components/layout/sticky-sidebar";
import PromptCard from "@/components/PromptCard";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery, useMutation } from "convex/react"; //As opposed to useQuery which doesn't support pagination
import { Id } from "@/convex/_generated/dataModel";

export default function Dashboard() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.posts.list,
    {},
    { initialNumItems: 5 },
  );

  const likePost = useMutation(api.userLikes.like);
  const unlikePost = useMutation(api.userLikes.unlike); 
  const savePost = useMutation(api.userSaves.save);
  const unsavePost = useMutation(api.userSaves.unsave);

function clickedLike(postId: Id<"posts">) {
    likePost({ postId: postId });
}

function clickedUnlike(postId: Id<"posts">) {
    unlikePost({ postId: postId });
}

function clickedSave(postId: Id<"posts">) {
    savePost({ postId: postId });
}

function clickedUnsave(postId: Id<"posts">) {
    unsavePost({ postId: postId });
}

  return (
    <main>
      {/* For Footer to appear at the bottom, and the page
        to not have unnecessary scrollbar, the subtrahend
        inside calc() must be the same height as the header + footer */}
      <div className="grid grid-cols-[240px_minmax(0,1fr)]">

        <StickySidebar className="top-[calc(2.5rem+1px)] h-[calc(100vh-(5rem+2px))] m-1 p-3 rounded-md bg-primary-foreground border flex flex-col items-start">
          <div>Sticky sidebar</div>
          <div>Example link</div>
          <div>Example link</div>
          <div>Example link</div>
          <div>Example link</div>
        </StickySidebar>

        <div className="h-full overflow-y-auto m-1 p-4 rounded-md ">
          <div className="p-4 grid grid-cols-4 gap-4">
            {results &&
              results.map((p) => {
                return (
                  <PromptCard
                    prompt={{
                      ...p,
                      authorId: p.authorId ? String(p.authorId) : null,
                      tags: p.tags ? p.tags : null,
                      platform: p.platform ? p.platform : null,
                    }}
                    likeCallback={clickedLike}
                    unlikeCallback={clickedUnlike}
                    saveCallback={clickedSave}
                    unsaveCallback={clickedUnsave}
                    key={p._id}
                  ></PromptCard>
                );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}