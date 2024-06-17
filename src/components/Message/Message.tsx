import React from 'react';
import {FaUserCircle} from 'react-icons/fa';

interface Props {
  message: string;
  author: string;
  datetime: string;
}

const Message: React.FC<Props> = ({message, author, datetime}) => {
  return (
    <div className={'w-3/4'}>
      <div className={'flex items-center gap-2 ml-auto'}><FaUserCircle size={20}/>{author}</div>
      <div className={'flex flex-col'}>
        <span className={'font-light text-white bg-blue-900 px-6 py-3 rounded-3xl rounded-tr'}>{message}</span>
        <span className={'ml-auto'}>{datetime}</span>
      </div>
    </div>
  );
};

export default Message;