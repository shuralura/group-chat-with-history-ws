# group-chat-with-history-ws

![image](https://github.com/shuralura/group-chat-with-history-ws/assets/34544441/51cae444-b9da-4624-8885-e1af3cfdbff6)

THE CLIENT

A simple single page website to allow end-user interactions
split view - lower, small pane, is the entry line (where people can enter text) and upper, bigger pane, is the collaboration view (where people can see all messages by all participants)
Only after the text that was entered in the entry line has been submitted and sent successfully to the server, it should appear in the upper view pane of it's author


THE SERVER

Back-end service to relay messages between participants
The server has a representation of each participant
The server maintain an open channel with each participant thru websocket interface
A newly added participant (at a later time) would receive all messages from the beginning of time
No need for any authentication


SCALE

DB long storage should be implemented
DB for client storage and keep alive messages should be added to maintain a clean client log
Messages Q should be implemented to reduce risk of DDOS


API

Message to server is in utf8 format via websocket. Open web socket to <serverIP>:8000

Text message from client to server
JSON.stringify({
        type: 'message',
        msg: value,
        user: userName,
        userID
      })
      
History request from client to server

JSON.stringify({
                type: 'history',
                user: userName,
                userID
              }

              
Server response on connection with the UUID
JSON.stringify({type:'auth-ack', userID: userID})
