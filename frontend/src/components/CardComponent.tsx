import { IconArrowWaveRightUp } from "@tabler/icons-react";
import { ArrowUpRight, Forward, Trash2, Youtube } from "lucide-react";
import React from "react";
import { Separator } from "./ui/separator";
import { TwitterEmbed } from "./TweetComp";
import { Link } from "react-router";

interface CardProp {
  type: string;
  link: string;
  title?: string;
}

function CardComponent({ type, link, title }: CardProp) {
  return (
    <div className="border border-white max-w-[25rem] rounded-md p-4 my-2  border-black/[0.2] bg-gradient-to-tr from-[#15142e] to-[#030817] dark:border-white/[0.2]  shadow-sm">
      <div className="flex justify-between pb-3 ">
        <div className="flex gap-3 items-center">
          <Youtube size={22} /> This will be the heading
        </div>
        <div className="flex items-center gap-3">
          <Link to={link}>
            <button>
              <ArrowUpRight size={16} />
            </button>
          </Link>{" "}
          <button>
            <Trash2 size={16} color="red" />
          </button>
        </div>
      </div>
      <Separator className="mb-3" />
      <div>
        {type === "tweet" && null}
        {type === "youtube" && (
          <p>
            This will be the heading to the card Lorem ipsum dolor, sit amet
            consectetur adipisicing elit. Illo, vitae.
          </p>
        )}

        <div className="w-full">
          {type === "youtube" && (
            <iframe
              className="w-full"
              width="500"
              height="200"
              src="https://www.youtube.com/embed/fNKiw4Og1TY?si=9QPDFHvKBd_A6jSf&amp;controls=0"
              title="YouTube video player"
            ></iframe>
          )}
          {type === "tweet" && (
            <TwitterEmbed
              tweetUrl={
                "https://twitter.com/nitesh_singh5/status/1878329354528108566"
              }
            />
          )}
        </div>
        <div className="mt-5 flex flex-col gap-4">
          <button className="w-fit px-4 bg-slate-800 text-purple-700 rounded-md">
            #tag
          </button>
          <p className="text-gray-400 text-sm">Added on 12/25/200</p>
        </div>
      </div>
    </div>
  );
}

export default CardComponent;
