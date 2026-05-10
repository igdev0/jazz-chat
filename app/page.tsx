"use client";
import {useAccount} from 'jazz-tools/react';
import {JazzAccount, JazzChat} from '@/app/schema';
import {ChangeEventHandler, SubmitEventHandler, useState} from 'react';
import Link from 'next/link';

export default function Home() {
  const me = useAccount(JazzAccount, {
    resolve: {
      profile: true,
      root: {
        chats: {
          $each: true
        }
      },
    },
  });
  const username = me.$isLoaded ? me.profile.username : "";
  const [value, setValue] = useState<string | null>(null);
  const onSubmit: SubmitEventHandler = (event) => {
    event.preventDefault();

    if (me.$isLoaded) {
      me.$jazz.set("profile", {username: value as string, name: me.profile.name});
    }
  };

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.currentTarget.value);
  };

  function createChat() {
    if (me.$isLoaded) {
      me.root.chats.$jazz.push(JazzChat.create({messages: []}));
    }
  }

  if (!me.$isLoaded) {
    return <div> Loading ...</div>;
  }
  return (
      <div className="p-2">
        <form className="flex flex-col gap-2 w-fit border items-end p-3 rounded-sm border-gray-300" onSubmit={onSubmit}>
          <label className="flex items-center gap-2" htmlFor="username">
            <span><strong>Update (username)</strong></span>
            <input className="border border-accent-300 rounded-md px-2 py-1" type="text" onChange={onInputChange}
                   value={!value ? username : value}
                   name="username"/>
          </label>
          <button className="cursor-pointer">Submit</button>
        </form>
        <span><strong>ID</strong>: {me.$jazz.id}</span><br/>
        <span><strong>Name</strong>: {me.profile.name}</span><br/>
        <span><strong>Username</strong>: {me.profile.username}</span><br/>
        <button className=" cursor-pointer bg-indigo-500 text-white rounded-sm p-2" onClick={createChat}>
          New chat
        </button>
        {
          me.root.chats.map((chat) => {
            return (
                <Link className="block border p-2 rounded-sm border-gray-200 mb-2" key={chat.$jazz.id} href={`chat/${chat.$jazz.id}`}>Open chat {chat.$jazz.id}</Link>
            );
          })
        }

      </div>
  );
}