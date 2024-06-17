import { useEffect, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import Message from './components/Message/Message';

interface MessageData {
  _id: string;
  message: string;
  author: string;
  datetime: string;
}

const App = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [lastMessageDateTime, setLastMessageDateTime] = useState<string | null>(null);

  const request = async (url: string, method = 'GET') => {
    const response = await fetch(url, { method });

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



  return (
    <div className="w-1/2 mx-auto mt-20 border-2 border-black p-4">
      <div id="messagesBlock" className="h-96 border-2 border-black overflow-auto mb-7">
        {messages.map(message => (
          <Message
            key={message._id}
            message={message.message}
            author={message.author}
            datetime={message.datetime}
          />
        ))}
      </div>
      <form>
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              name={'author'}
              id={'author'}
              className="border-2 border-blue-500 p-2 w-3/4"
              placeholder="Введите ваше имя!"
              required
            />
            <button className="bg-blue-900 rounded-full px-3 py-3">
              <IoSend size={20} color="white" />
            </button>
          </div>

          <textarea
            className="border-2 border-blue-500 p-2"
            name="description"
            id="description"
            cols={10}
            rows={2}
            style={{ resize: 'none' }}
            placeholder="Введите ваш текст..."
            required
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default App;
