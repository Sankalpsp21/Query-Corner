"use client";

import PromptCard from "@/components/PromptCard";
import { api } from "@/convex/_generated/api";
import { useMutation, usePaginatedQuery , useQuery } from "convex/react"; //As opposed to useQuery which doesn't support pagination
import { Id } from "@/convex/_generated/dataModel";
import SkeletonGrid from "@/components/SkeletonGrid";
import { useToast } from "@/components/ui/use-toast";
import { SearchParams } from "@/app/dashboard/page"

export default function SearchResults(props: {
    searchParams: SearchParams
}) {

    //default posts for when not viewing search results
    const { results, status, loadMore } = usePaginatedQuery(
        api.posts.list,
        {},
        { initialNumItems: 20 },
    );

    const posts = useQuery(api.posts.fetchResults, props.searchParams)

    const { toast } = useToast()

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
  
    function copyText(promptText: string) {
      // Copy prompt text to clipboard
      navigator.clipboard.writeText(promptText);
  
      // Construct the URL with the prompt text as a query parameter
      const chatGPTUrl = `https://chat.openai.com/?prompt=${encodeURIComponent(promptText)}`;
  
      // Show toast notification
      toast({
        title: "Prompt copied to clipboard",
        description: (
          <a
            href={chatGPTUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-accent"
            >
            Click here to paste the prompt into ChatGPT.
          </a>
        )
      });
    }

  return (
    <>
        {/* Loading skeleton */}
        {props.searchParams.results.length === 0 && status === "LoadingFirstPage" && (
        <div className="h-full overflow-y-auto m-1 p-4 rounded-md ">
            <SkeletonGrid />
        </div>
        )}

        {/* If no search yet, show all posts */}
        {props.searchParams.results.length == 0 && (
            <div className="p-4 grid grid-cols-4 gap-4 overflow-y-auto">
                {results &&
                    results.map((p) => {
                    return (
                    <PromptCard
                        key={p._id}
                        prompt={{
                            ...p,
                            _authorId: p.authorId ?? null,
                            _score: null,
                            tags: p.tags ?? null,
                            platform: p.platform ?? null,
                          }}
                        likeCallback={clickedLike}
                        unlikeCallback={clickedUnlike}
                        saveCallback={clickedSave}
                        unsaveCallback={clickedUnsave}
                        copyCallback={copyText}
                    ></PromptCard>
                    );
                })}
            </div>
        )}

        {/* If search, show results */}
        {props.searchParams.results.length != 0 && (
            <div className="p-4 grid grid-cols-4 gap-4 overflow-y-auto">
                {posts &&
                    posts.map((p) => {
                    return (
                    <PromptCard
                        key={p._id}
                        prompt={p}
                        likeCallback={clickedLike}
                        unlikeCallback={clickedUnlike}
                        saveCallback={clickedSave}
                        unsaveCallback={clickedUnsave}
                        copyCallback={copyText}
                    ></PromptCard>
                    );
                })}
            </div>
        )}
    </>
  );
}