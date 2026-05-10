"use client";
import {useParams} from 'next/navigation';
import {useCoState} from 'jazz-tools/react-core';
import {JazzChat} from '@/app/schema';
import Chat from '@/app/components/chat';

export default function ChatPage() {
  const {id} = useParams<{ id: string }>();
  const state = useCoState(JazzChat, id, {resolve: {messages: {$each: true}}});
  if(!state.$isLoaded) {
    return <div>Loading...</div>;
  }

  return (
      <div>
        <Chat id={id} chat={state}/>
      </div>
  );
}