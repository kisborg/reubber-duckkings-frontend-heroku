import React, 
{ 
  useState, 
  useEffect 
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessage } from '../../redux/message/message.action'
import moment from 'moment';
import socketIOClient from 'socket.io-client';
import MessageBox from '../MessageBox/MessageBox';
import './MessageBoard.css';

function MessageBoard() {
  const user = useSelector(state => state.user.username);
  const messages = useSelector(state => state.messages.messages);
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const socket = socketIOClient(process.env.REACT_APP_SOCKET);

  useEffect(() => {
    socket.on('message', message => {
      dispatch(setMessage(message));
    });

    let messageContainer = document.getElementById("box");
    messageContainer.scrollTop = messageContainer.scrollHeight;

    return () => socket.disconnect();
  }, [socket, dispatch]);


  const handleSendMessage = (event, message) => {
    event.preventDefault();
    
    if (message === '') {
      return;
    }
    socket.emit('send-message', { 
      message, 
      senderName: user, 
      id: Date.now() 
    });

    // setText(''); -> TODO debugolni
  }

  return (
    <div className="message-board">
      <div className="message-container" id="box">
        <div className="messages">
          {messages.map((message)=> (
            <MessageBox key={message.id} message={message.message} sender={message.senderName} time={moment(message.id).format('LT')}/>
          ))}
        </div>
      </div>
      <form className="message-form" onSubmit={(event) => handleSendMessage(event, text)}>
        <textarea 
        type='text'
        className='message-area'
        placeholder='...'
        value={text}
        onChange={(event) => setText(event.target.value)}/>
        <input type="submit" class="btn send-btn" value="SEND" />
      </form>
    </div>
  );
};

export default MessageBoard;