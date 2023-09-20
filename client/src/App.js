import React, {useState, useEffect, useRef} from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { Card, Avatar, Input, Typography } from 'antd';
import 'antd/dist/reset.css';
import './index.css';

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

const App = () => {
  const [userName, setUserName] = useState('');
  const [userID, setUserID] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [messages, setMessages] = useState([]);
  const client = useRef(new W3CWebSocket('ws://127.0.0.1:8000'));

  const onButtonClicked = (value) => {
    client.current.send(
      JSON.stringify({
        type: 'message',
        msg: value,
        user: userName,
        userID
      })
    );
    setSearchVal('');
  };

  useEffect(() => {
    client.current.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    client.current.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply! ', dataFromServer);

      if (dataFromServer.type === 'message') {
        console.log('shalom')
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            msg: dataFromServer.msg,
            user: dataFromServer.user,
          },
        ]);
      }
      else if (dataFromServer.type === 'auth-ack') {
        setUserID(dataFromServer.userID);
      }
      else if (dataFromServer.type === 'history') {
        console.log('bey')
        console.log(dataFromServer.data)
      }
    };
  }, []);

  return (
    <div className="main" id="wrapper">
      {isLoggedIn ? (
        <div>
          <div className="title">
            <Text id="main-heading" type="secondary" style={{ fontSize: '36px' }}>
              Group Chat: {userName}
            </Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50 }} id="messages">
            {messages.map((message) => (
              <Card
                key={message.msg}
                style={{
                  width: 300,
                  margin: '16px 4px 0 4px',
                  alignSelf: userName === message.user ? 'flex-end' : 'flex-start',
                }}
                loading={false}
              >
                <Meta
                  avatar={
                    <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                      {message.user[0].toUpperCase()}
                    </Avatar>
                  }
                  title={message.user + ':'}
                  description={message.msg}
                />
              </Card>
            ))}
          </div>
          <div className="bottom">
            <Search
              placeholder="input message and send"
              enterButton="Send"
              value={searchVal}
              size="large"
              onChange={(e) => setSearchVal(e.target.value)}
              onSearch={(value) => onButtonClicked(value)}
            />
          </div>
        </div>
      ) : (
        <div style={{ padding: '200px 40px' }}>
          <Search
            placeholder="Enter Username"
            enterButton="Login"
            size="large"
            onSearch={(value) => {
              setIsLoggedIn(true);
              setUserName(value);
              client.current.send( JSON.stringify({
                type: 'history',
                user: userName,
                userID
              }))
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;