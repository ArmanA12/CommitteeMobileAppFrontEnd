// import React, { useState, useEffect } from 'react';
// import { StreamChat } from 'stream-chat';
// import { Chat, OverlayProvider, ChannelList, Channel, MessageInput, MessageList } from 'stream-chat-expo';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// const client = StreamChat.getInstance('sdkedyqbfrhz'); 

// export default function App() {
//   const [channel, setChannel] = useState(null);
//   const [user, setUser] = useState(null);


//   useEffect(() => {


//     const fetchUserData = async () => {
//         const storedUser = await AsyncStorage.getItem('user');
//         console.log(storedUser, "user stored data before parse")

//         if (storedUser) {
//           setUser(JSON.parse(storedUser));
//         }
//       };
//       fetchUserData();
//     return () => {
//       client.disconnectUser();
//     };
//   }, []);




// const connectUserAndQueryChannels = async () => {
//   try {
//     await client.connectUser(
//       {
//         id: user._id,
//         name: user.username,
//       },
//       client.devToken(user._id)
//     );

//     console.log("User connected successfully");

//     const channelID = "!members-6712K5mzHOm-9fpMq0kGI4NKULLt8SMilTSq3zcND_A"; 
//     const messagingChannel = client.channel('messaging', channelID, {
//       members: [user._id], 
//     });

//     await messagingChannel.create();
//     const filter = { type: 'messaging', members: { $in: [user._id] } };
//     const sort = [{ last_message_at: -1 }];
//     const channels = await client.queryChannels(filter, sort, {
//       watch: true,
//       state: true,
//     });
//     if (channels.length) {
//       setChannel(channels[0]); 
//     }
//   } catch (error) {
//     console.error("Error connecting user or querying channels:", error);
//   }
// };


// setTimeout(() => {
//     connectUserAndQueryChannels();
// }, 3000);



//   return (
//     <OverlayProvider>
//       <Chat client={client}>
//         {channel ? (
//           <Channel channel={channel} keyboardVerticalOffset={0}>
//             <MessageList />
//             <MessageInput />
//           </Channel>
//         ) : (
//           <ChannelList onSelect={setChannel} />
//         )}
//       </Chat>
//     </OverlayProvider>
//   );
// }














import React, { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, OverlayProvider, ChannelList, Channel, MessageInput, MessageList } from 'stream-chat-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const client = StreamChat.getInstance('sdkedyqbfrhz');

export default function App() {
  const [channel, setChannel] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from AsyncStorage
    const fetchUserData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchUserData();

    // Cleanup function to disconnect user when component unmounts
    return () => {
      client.disconnectUser();
    };
  }, []);

  useEffect(() => {
    // Connect the user and query channels only when `user` is defined
    if (user) {
      const connectUserAndQueryChannels = async () => {
        try {
          await client.connectUser(
            {
              id: user._id,
              name: user.username,
            },
            client.devToken(user._id)
          );

          console.log("User connected successfully");

          const channelID = "!members-6712K5mzHOm-9fpMq0kGI4NKULLt8SMilTSq3zcND_A";
          const messagingChannel = client.channel('messaging', channelID, {
            members: [user._id],
          });

          await messagingChannel.create();
          
          const filter = { type: 'messaging', members: { $in: [user._id] } };
          const sort = [{ last_message_at: -1 }];
          const channels = await client.queryChannels(filter, sort, {
            watch: true,
            state: true,
          });

          if (channels.length) {
            setChannel(channels[0]);
          }
        } catch (error) {
          console.error("Error connecting user or querying channels:", error);
        }
      };

      connectUserAndQueryChannels();
    }
  }, [user]);

  return (
    <OverlayProvider>
      <Chat client={client}>
        {channel ? (
          <Channel channel={channel} keyboardVerticalOffset={0}>
            <MessageList />
            <MessageInput />
          </Channel>
        ) : (
          <ChannelList onSelect={setChannel} />
        )}
      </Chat>
    </OverlayProvider>
  );
}
