import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar"; // Adjust the path as necessary
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom"; // React Router for navigation
import { motion } from "framer-motion";
import {
  FileImage,
  FileText,
  Link2,
  LogOut,
  Plus,
  Share,
  Share2,
  Twitter,
  User,
  X,
  Youtube,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThoughtCardType } from "./type/Types";
import { Button } from "./ui/button";
import axios from "axios";
import { ApiRoutes } from "@/utils/routeApi";
import CardComponent from "./CardComponent";
import { Separator } from "./ui/separator";
import { useDispatch } from "react-redux";
import { clearAuth } from "@/store/slice/userSlice";
import { useSelector } from "react-redux";
import store, { RootState } from "@/store/store";

export function DashboardSide() {
  const dispatch = useDispatch();
  const links = [
    {
      label: "Video",

      icon: (
        <Youtube className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Tweet",

      icon: (
        <Twitter className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Link",

      icon: (
        <Link2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Image",

      icon: (
        <FileImage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Article",

      icon: (
        <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user);
  const userData = JSON.parse(localStorage.getItem("user") || '{}');

  const [selectedType, setSelectedType] = useState<ThoughtCardType>(null);

  const [signOut, setSignout] = useState(false);

  const signout = () => {
    setSignout(true);
  };

  const signOutHandler = () => {
    dispatch(clearAuth());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className={` rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-transparent w-[100vw] flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-[100vh]`}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  selectedType={selectedType}
                  onSelectType={setSelectedType}
                />
              ))}
            </div>
          </div>

          <div className="   flex justify-between items-center">
            <div className="flex gap-2 justify-center items-center cursor-pointer">
              <span className=" p-1 rounded-full">
                <User className=" rounded-full" />
              </span>
              {open && <p>{userData.username}</p>}
            </div>
            {open && (
              <a onClick={signOutHandler}>
                <LogOut className="hover:text-gray-100 text-gray-500 cursor-pointer" />
              </a>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

const Dashboard = () => {
  const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const openCreate = async () => {
    setIsCreateNewOpen(true);
  };
  const closeCreate = async () => {
    setIsCreateNewOpen(false);
  };

  const openShare = () => setIsShareOpen(true);

  const [importLink , setImportLink]= useState("")
  const [title ,setTitle]= useState("")
  const [description , setDescription] = useState("")
  const [type , setType] = useState("")
  const [link , setLink] = useState("")
  const [date] = useState(new Date().toISOString().slice(0, 10))
  const [inputValue , setInputValue]= useState("")
  const [alltags, setAllTags] = useState<{ _id: string; title: string }[]>([])
  const [filteredTags, setFilteredtags] = useState<{ _id: string; title: string }[]>([])
  const [alltagsId, setAlltagsId] = useState<string[]>([])
  const [formError, setFormError] = useState<{
    [key: string]: string
  }>({})
 
  function getVideoId(youtubeUrl: string): string | null {
    const regex =  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    const match = youtubeUrl.match(regex);

    return match ? match[1] : null;
}
function getTweetId(tweetUrl: string): string | null {
  const regex = /(?:https?:\/\/)?(?:www\.)?twitter\.com\/(?:[^/]+)\/status\/(\d+)/;
  const match = tweetUrl.match(regex);
  return match ? match[1] : null;
}
const isValidURL = (url: string) => {
  const urlRegex = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i
  return urlRegex.test(url)
}

const getVidInfo= async(vidId: string):Promise<{ title: string; description: string }> =>{
try {
  const res = await fetch(
    `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${vidId}`
  )
  const data = await res.json()
  const title= data.title || `Youtube Video ${vidId}`
  const fullDescription =
        data.author_name + "'s youtube video on - " + title || ''
      const description = fullDescription.split('\n').slice(0, 5).join('\n')
      return { title, description }
} catch (error) {
  return{
    title: `This Video (${vidId})`,
        description: ''
  }
}
}

const addingFixedTags = (fixtag: string) => {
  const existingTag = alltags.find(
    tag => tag.title === fixtag.trim().toLowerCase()
  )
  if (existingTag) {
    return existingTag._id
  }
}

// Example usage
const url = "https://twitter.com/elonmusk/status/1617688615324805120";
const tweetId = getTweetId(url);
console.log(tweetId); // Output: 1617688615324805120


  const ImportLinkSubmit = async (e: React.FormEvent)=>{
    e.preventDefault()
    const youtubeVidId= getVideoId(importLink)
    const tweetId= getTweetId(importLink)
    // @ts-ignore
    let importErrors: { [key: string]: string } = {}

    if(youtubeVidId){
      if(!importLink.trim()|| isValidURL(importLink)){
        importErrors.importLink = "Please enter a Youtube URL"
      }
      if(importLink.trim() === ""){
        importErrors.importLink="Please enter a Valid Url"
      }
      const youtubeRegex= /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
      if(!youtubeRegex.test(importLink)){
        importErrors.importLink = "Please enter a valid Youtube URL"
      }
      const vidId= getVideoId(importLink)
      if(!vidId){
        importErrors.importLink= "Invalid Youtube Url"
      }
      if(Object.keys(importErrors).length>0){
        setFormError(importErrors)
        setTimeout(()=>{
          setFormError({})
        },3000)
      }

      const vidInfo = vidId ? await getVidInfo(vidId) : { title : "" , description : ""}
      const {title , description } = vidInfo

      const userData = JSON.parse(localStorage.getItem("user")|| "{}")
      const userId = userData? userData.id : null
      const tagId= addingFixedTags("youtube")
      const alltagId :string[]=[]
      if(tagId){
        alltagsId[0]= tagId
      }
      
    }
  }
  const onClose = ()=>{
    setIsCreateNewOpen(false)
  }

  const handleSubmit= ()=>{

  }
  const handleInputChange = ()=>{

  }
  const addTag= ()=>{

  }
  return (
    <div className="flex flex-1 h-full">
      <div className="border border-neutral-700 p-10 md:p-10 rounded-tl-2xl bg-transparent flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex flex-col gap-2 h-full">
          {/* Header Section */}
          <div className="h-20 w-full rounded-lg flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-3xl">My Brain</h1>
            </div>
            <div className="flex gap-5">
              <Button
                onClick={openCreate}
                variant={"ghost"}
                className="flex justify-center items-center gap-1 text-center rounded-md bg-transparent no-underline cursor-pointer shadow-2xl leading-6 text-white border-[1px] border-slate-500 px-4 py-2 font-mono font-medium transition-colors hover:text-indigo-300"
              >
                <Plus /> <span className="sm:inline hidden">Create New</span>
              </Button>
              <Button>
                <Share2 /> <span className="sm:inline hidden">Share</span>
              </Button>
            </div>
          </div>
          {isCreateNewOpen && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
              <div className="border border-black/[0.2] dark:border-white/[0.2]   bg-slate-950 p-6 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-300 scale-100">
              <Tabs defaultValue='automatic' className='w-full '>
                    <TabsList className=' w-full'>
                      <TabsTrigger value='automatic' className='w-full'>
                        Automatic
                      </TabsTrigger>
                      <TabsTrigger value='manual' className='w-full'>
                        Manual
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value='automatic'>
                      <div>
                        <h2 className='text-white text-xl text-center'>
                          Just Paste It
                        </h2>
                        <p className='text-center text-gray-200 mb-4'>
                          Paste link before you find interesting
                        </p>
                        <p className='text-gray-400 text-sm text-center'>
                          *NOTE: This only support{' '}
                          <a href='https://x.com' target='_blank'>
                            {' '}
                            <span className='text-purple-200 italic'>
                              tweet
                            </span>
                          </a>{' '}
                          and{' '}
                          <a href='https://youtube.com' target='_blank'>
                            <span className='text-purple-200 italic'>
                              youtube
                            </span>
                          </a>{' '}
                          link for now{' '}
                        </p>
                        <button
                          className='absolute -top-4 -right-6  rounded-full text-xs'
                          onClick={onClose}
                        >
                          <X className='h-5 w-5' />
                        </button>

                        <form
                          onSubmit={ImportLinkSubmit}
                          className='text-white px-4 sm:px-6 md:px-8 lg:px-10 py-4'
                        >
                          {/* Import Link */}
                          <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-50 mb-1'>
                              Import from Link:
                            </label>
                            <input
                              type='text'
                              placeholder='paste your yt/tweet link here'
                              className='w-full px-3 py-2 border border-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40 bg-transparent'
                              value={importLink}
                              onChange={e => setImportLink(e.target.value)}
                              required
                            />
                            {formError.importLink && (
                              <p className='text-sm text-red-500'>
                                {formError.importLink}
                              </p>
                            )}
                            <Button
                              className='mt-3 w-full '
                              disabled={importLink ? false : true}
                              type='submit'
                            >
                              Import
                            </Button>
                          </div>
                        </form>
                      </div>
                    </TabsContent>
                    <TabsContent value='manual'>
                      <div>
                        <h2 className='text-white text-xl mb-4 text-center'>
                          New Thought
                        </h2>
                        <p className='text-center text-gray-400'>
                          Save your new thought before you forget it
                        </p>
                        <button
                          className='absolute -top-4 -right-6  rounded-full text-xs'
                          onClick={onClose}
                        >
                          <X className='h-5 w-5' />
                        </button>

                        <form
                          onSubmit={handleSubmit}
                          className='text-white px-4 sm:px-6 md:px-8 lg:px-10 py-4'
                        >
                          {/* Title */}
                          <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-500 mb-1'>
                              Title:
                            </label>
                            <input
                              type='text'
                              className='w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40 bg-transparent'
                              value={title}
                              onChange={e => setTitle(e.target.value)}
                              required
                            />
                            {/* {validateFormErr.title && (
                              <p className='text-sm text-red-500'>
                                {validateFormErr.title}
                              </p>
                            )} */}
                          </div>

                          {/* Description */}
                          <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-500 mb-1'>
                              Description:
                            </label>
                            <textarea
                              className='w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40 bg-transparent'
                              rows={3}
                              value={description}
                              onChange={e => setDescription(e.target.value)}
                              required
                            ></textarea>
                            {/* {validateFormErr.description && (
                              <p className='text-sm text-red-500'>
                                {validateFormErr.description}
                              </p>
                            )} */}
                          </div>

                          {/* Type Selection */}
                          <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-500 mb-1'>
                              Type:
                            </label>
                            <select
                              className='w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40 bg-transparent'
                              value={type}
                              onChange={e => {
                                // console.log('select called')
                                setType(e.target.value.toLowerCase())
                                // console.log('type:', type.toLowerCase())
                              }}
                            >
                              <option value='tweet' className='bg-slate-950'>
                                Tweet
                              </option>
                              <option value='video' className='bg-slate-950'>
                                Video
                              </option>
                              <option value='link' className='bg-slate-950'>
                                Link
                              </option>
                              <option value='image' className='bg-slate-950'>
                                Image
                              </option>
                              <option value='article' className='bg-slate-950'>
                                Article
                              </option>
                            </select>
                          </div>

                          {/* Link */}
                          <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-500 mb-1'>
                              Ref Link:
                            </label>
                            <input
                              type='text'
                              className='w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40 bg-transparent'
                              value={link}
                              onChange={e => setLink(e.target.value)}
                              required
                            />
                            {/* {validateFormErr.link && (
                              <p className='text-sm text-red-500'>
                                {validateFormErr.link}
                              </p>
                            )} */}
                          </div>

                          {/* Date */}
                          <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-500 mb-1'>
                              Date:
                            </label>
                            <div className='mt-1 w-full px-3 py-2 border rounded-lg shadow-sm bg-transparent dark:text-white'>
                              {date}
                            </div>
                          </div>

                          {/* Tags input */}
                          <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-500 mb-1'>
                              Tags:
                            </label>
                            <div className='relative flex flex-col'>
                              <input
                                type='text'
                                className='w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40 bg-transparent'
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={addTag}
                                // onKeyDown={(e) => e.key === 'Enter' && addTag(e)}
                                placeholder='Add tags and press Enter'
                              />
                              {/* {validateFormErr.tag && alltagsId.length <= 0 && (
                                <p className='text-sm text-red-500 text-left'>
                                  {validateFormErr.tag}
                                </p>
                              )} */}

                              {/* Dropdown for filtered tags */}
                              {inputValue && (
                                <ul className='bg-slate-950 absolute top-10 border w-full rounded-b-lg max-h-40 overflow-auto'>
                                  {filteredTags.map(tag => (
                                    <li
                                      key={tag._id}
                                      onClick={() => {
                                        setSelectedTags([
                                          ...selectedTags,
                                          tag.title
                                        ])
                                        setAlltagsId([...alltagsId, tag._id])
                                        setInputValue('')
                                      }}
                                      className='px-3 py-2 text-white hover:bg-purple-600 cursor-pointer'
                                    >
                                      {tag.title}
                                    </li>
                                  ))}
                                  {filteredTags.length === 0 && (
                                    <li className='text-gray-400 px-3 py-2'>
                                      No matching tags
                                    </li>
                                  )}
                                </ul>
                              )}
                            </div>
                            {/* Display selected tags */}
                            <div className='flex flex-wrap mt-4 gap-2 '>
                              {selectedTags.map((tag, index) => (
                                <div
                                  key={index}
                                  className='flex items-center bg-purple-400/20 px-2 py-1 rounded-lg text-sm'
                                >
                                  {tag}
                                  <button
                                    type='button'
                                    onClick={() => {
                                      setSelectedTags(
                                        selectedTags.filter(
                                          (_, i) => i !== index
                                        )
                                      )
                                      setAlltagsId(
                                        alltagsId.filter((_, i) => i !== index)
                                      )
                                    }}
                                    className='ml-2 text-red-600 hover:text-red-800'
                                  >
                                    &times;
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Submit Button */}
                          <div className='flex flex-col sm:flex-row justify-end gap-2'>
                            <Button
                              onClick={closeCreate}
                              variant={'ghost'}
                              className='flex justify-center items-center gap-1 text-center rounded-md bg-transparent no-underline cursor-pointer shadow-2xl leading-6  text-white  border-[1px] border-slate-500 px-4 py-2 font-mono font-medium transition-colors hover:text-indigo-300'
                            >
                              Cancel
                            </Button>

                            <Button type='submit'>Create</Button>
                          </div>
                        </form>
                      </div>
                    </TabsContent>
                  </Tabs>
              </div>
            </div>
          )}
          <Separator />
          {/* Scrollable Div */}
          <div className=" scroll flex-1 overflow-y-auto border border-neutral-700 rounded-lg p-8 max-h-full grid grid-cols-3 gap-6 bg-gray-300 bg-opacity-5 "></div>
        </div>
      </div>
    </div>
  );
};
