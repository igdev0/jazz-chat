"use client";
import {ChangeEvent, SubmitEventHandler, useState} from 'react';
import {Button} from '@base-ui/react';
import {Send} from 'lucide-react';
import {JazzChat, JazzMessage, JazzReactions} from '@/app/schema';
import {useCoState} from 'jazz-tools/react-core';

interface ChatProps {
  id: string;
  chat: JazzChat;
}

export default function Chat(props: ChatProps) {
  const chat = useCoState(JazzChat, props.id, {
    resolve: {
      messages: {$each: {text: true}}
    }
  });

  const [message, setMessage] = useState<string>('');


  const handleSubmit: SubmitEventHandler = (event) => {
    event.preventDefault();
    if (!chat.$isLoaded) {
      return;
    }

    chat.messages.$jazz.push(JazzMessage.create({
      text: message,
      reactions: JazzReactions.create([]),
    }))
    setMessage('');
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  if (!chat.$isLoaded) {
    return null;
  }

  return (
      <div className="chat">
        <h1>Chat:</h1>
        <div className="chat-box">
          {
            chat.messages.map((item) => (
                <div key={item.$jazz.id} className="chat-message">
                  {item.text}
                </div>
            ))
          }
        </div>
        <form onSubmit={handleSubmit} className="flex items-center">
          <input placeholder="Type .." type="text" value={message} onChange={handleInputChange}/>
          <Button className="flex gap-2 bg-indigo-500 text-white p-2 rounded-r-md" type="submit"><Send/></Button>
        </form>
      </div>
  );
}