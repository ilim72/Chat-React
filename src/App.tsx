import React, {useEffect, useState} from 'react';
import {IoSend} from 'react-icons/io5';
import Message from './components/Message/Message';
import Attractor from '../public/attractor-logo.png';


interface MessageData {
  _id: string;
  message: string;
  author: string;
  datetime: string;
}

interface Message {
  author: string,
  description: string
}

const App = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [lastMessageDateTime, setLastMessageDateTime] = useState<string | null>(null);
  const [message, setMessage] = useState<Message>({
    author: '',
    description: '',
  });


  const request = async (url: string, method = 'GET') => {
    const response = await fetch(url, {method});

    if (response.ok) {
      return response.json();
    }

    throw new Error('Network Error: ' + response.status);
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        let url = 'http://146.185.154.90:8000/messages';

        if (lastMessageDateTime !== null) {
          url += `?datetime=${lastMessageDateTime}`;
        }

        const messagesRequest = await request(url);

        if (messagesRequest.length > 0) {
          setLastMessageDateTime(messagesRequest[messagesRequest.length - 1].datetime);
          setMessages(prevMessages => [...prevMessages, ...messagesRequest]);
        }
      } catch (error) {
        console.error('Error get request', error);
      }
    };

    const interval = setInterval(getMessages, 3000);
    void getMessages();

    return () => clearInterval(interval);
  }, [lastMessageDateTime]);

  useEffect(() => {
    const messagesBlock = document.getElementById('messagesBlock');
    if (messagesBlock) {
      messagesBlock.scrollTop = messagesBlock.scrollHeight;
    }
  }, [messages]);

  const changeMessage = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMessage(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = new URLSearchParams();

    body.append('author', message.author);
    body.append('message', message.description);

    if (message.author.trim() !== '' && message.author.trim() !== '') {
      try {
        await fetch('http://146.185.154.90:8000/messages', {method: 'POST', body});
        setMessage(prevState => ({
          ...prevState, description: ''}));
      } catch (error) {
        console.error('Error post request', error);
      }
    }
  };

  return (
    <div className="w-1/2 mx-auto mt-1 ">
      <div className={'p-4 flex rounded-3xl rounded-br-none rounded-bl-none '}
           style={{backgroundColor: 'rgb(4, 1, 43)'}}>
        <img width={130} src={Attractor} alt="Attractor logo" className={'animate-spin-slow'}/>
        <h1 className={'font-inter text-white text-5xl mt-5 ms-5 block font-light'}>ATTRACTOR <br/> Chat</h1>
      </div>
      <div id="messagesBlock" className="overflow-scroll p-4"
           style={{border: '3px solid rgb(4, 1, 43)', height: '500px'}}>
        {messages.map(message => (
          <Message
            key={message._id}
            message={message.message}
            author={message.author}
            datetime={message.datetime}
          />
        ))}
      </div>
      <form onSubmit={onFormSubmit}>
        <div className="flex flex-col gap-y-4 p-5 rounded-3xl rounded-tr-none rounded-tl-none"
             style={{backgroundColor: 'rgb(4, 1, 43)'}}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name={'author'}
              id={'author'}
              value={message.author}
              className="rounded-3xl rounded-tl-none rounded-bl-none p-2 w-3/4
              focus:outline-none focus:shadow-lg focus:shadow-blue-700 "
              placeholder="Введите ваше имя!"
              onChange={changeMessage}
              required
            />
            <button type={'submit'} className="bg-blue-800 rounded-full px-16 py-3 active:scale-90">
              <IoSend size={20} color="white"/>
            </button>
          </div>

          <textarea
            className="rounded-3xl rounded-tl-none rounded-bl-none
            p-2 focus:outline-none focus:shadow-lg focus:shadow-blue-700"
            name="description"
            id="description"
            value={message.description}
            cols={10}
            rows={2}
            style={{resize: 'none'}}
            placeholder="Введите ваш текст..."
            onChange={changeMessage}
            required
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default App;
