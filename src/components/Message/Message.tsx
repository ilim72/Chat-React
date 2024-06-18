import React from 'react';
import {FaUserCircle} from 'react-icons/fa';

interface Props {
  message: string;
  author: string;
  datetime: string;
}

const Message: React.FC<Props> = ({message, author, datetime}) => {
  return (
    <div className={'w-4/5 '}>
      <div className={'flex items-center gap-2 '}><FaUserCircle size={20}/><b>{author}</b></div>
      <div className={'flex flex-col ml-3'}>
        <span className={'font-light text-white bg-blue-900 px-6 py-3 rounded-3xl rounded-tl-none '}>{message}</span>
        <span className={'ml-auto text-sm mr-3'}>{datetime}</span>
      </div>
    </div>
  );
};

export default Message;