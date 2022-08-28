import {useEffect, useState} from 'react'
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window, LoadingIndicator, ChannelList } from 'stream-chat-react';
import axios from 'axios'
import './chatroom.css'
import 'stream-chat-react/dist/css/index.css'
// import { useChatContext } from "stream-chat-react"
// had to change this file: node_modules/stream-chat-react/dist/components/MessageInput/hooks/useEmojiIndex.js

function Chatroom ({user, token, stream, createGroupInformation, joinGroupInformation, whoAmI, createEventInformation, joinEventInformation, client, setClient}) {
    
    // const [client, setClient] = useState(null)
    // const [userId, setUserId] = useState(null)
    // filters only the channels that the user is a member of
    const user_id = user.id.toString()
    const filters = {type: 'messaging', members: {$in: [user_id]}}
    // puts the channel with the lattest message at the top
    const sort = {last_message_at: -1}

    useEffect(() => {
		whoAmI()
	}, []);

    const createGroupChannel = async () => {
        if (client && createGroupInformation) {
            let channelId = "GroupChatroom"
            let channelName= createGroupInformation[0]
            channelName += ' Chatroom'
            channelId+=createGroupInformation[1].toString()
            let user_id = user.id.toString()
            console.log('user_id', user_id, 'type', typeof(user_id), 'channelID is', channelId, 'channel name is', channelName)
            const new_channel = client.channel('messaging', channelId, {
                // want to change this up so I get a diff photo each time https://picsum.photos/id/237/200
                // image: "https://picsum.photos/200",
                name: channelName,
                members: [user_id]
            })
            console.log('new channel', new_channel)
    
            await new_channel.watch()
        }
        else {
            setTimeout(createGroupChannel, 3000)
        }
    }

    const createEventChannel = async () => {
        if (client && createEventInformation) {
            let channelId = "EventChatroom"
            let channelName= createEventInformation[0]
            channelName += ' Chatroom'
            channelId+=createEventInformation[1].toString()
            let user_id = user.id.toString()
            console.log('create event channel user_id', user_id, 'type', typeof(user_id), 'channelID is', channelId, 'channel name is', channelName)
            const new_event_channel = client.channel('messaging', channelId, {
                // want to change this up so I get a diff photo each time https://picsum.photos/id/237/200
                // image: "https://picsum.photos/200",
                name: channelName,
                members: [user_id]
            })
            console.log('newly created event channel', new_event_channel)
    
            await new_event_channel.watch()
        }
        else {
            setTimeout(createEventChannel, 3000)
        }
    }

    useEffect(()=> {
        createGroupChannel()
    },[createGroupInformation])

    useEffect(()=> {
        createEventChannel()
    },[createEventInformation])

    useEffect(()=> {
        joinGroupChannel()
    },[joinGroupInformation])

    useEffect(()=> {
        joinEventChannel()
    },[joinEventInformation])

    const joinGroupChannel = async () => {
        if (client && joinGroupInformation) {
            let channelId = "GroupChatroom"
            let channelName= joinGroupInformation[0]
            channelName += ' Chatroom'
            channelId+=joinGroupInformation[1].toString()
            console.log('join group channel user_id', user_id, 'type', typeof(user_id), 'channelID is', channelId, 'channel name is', channelName)
            // const response = await client.queryChannels();
            // const filteredChannel = response.filter((c)=> c.name === channelName);
            // filteredChannel.addMembers([user_id])
            // await new_channel.watch()
            const join_channel = client.channel('messaging', channelId, {
                // want to change this up so I get a diff photo each time https://picsum.photos/id/237/200
                // image: 'https://picsum.photos/200',
                name: channelName,
                members: [user_id]
            })
            await join_channel.addMembers([user_id])
            await join_channel.watch()
            console.log('joinchannel', join_channel)
        }
        else {
            setTimeout(joinGroupChannel, 3000)
        }
    }

    const joinEventChannel = async () => {
        if (client && joinEventInformation) {
            let channelId = "EventChatroom"
            let channelName= joinEventInformation[0]
            channelName += ' Chatroom'
            channelId+=joinEventInformation[1].toString()
            let user_id = user.id.toString()
            console.log('join event channel user_id', user_id, 'type', typeof(user_id), 'channelID is', channelId, 'channel name is', channelName)
            const join_event_channel = client.channel('messaging', channelId, {
                name: channelName,
                members: [user_id]
            })
            await join_event_channel.addMembers([user_id])
            await join_event_channel.watch()
            console.log('joineventchannel', join_event_channel)
        }
        else {
            setTimeout(joinEventChannel, 3000)
        }
    }


    useEffect(()=> {
        //this connects the client to the chat
        if (token && user) {
            // setUserId((user.username).toString())
            console.log('token here', token, 'type', typeof(token))
            if (!client) {
                async function init() {
                    const user_id= (user.id).toString()
                    const channelName = 'This is your personal Notes/Reminders/Chat Space'
                    let channelId = user_id
                    channelId += "PersonalChat"
                    console.log('USER ID HERE LINE 95', user_id, 'type here', typeof(user_id), 'channelName', channelName, 'channelID', channelId)
                    const chatClient = StreamChat.getInstance(stream)
                    // https://getstream.io/chat/docs/react/tokens_and_authentication/?language=javascript
                    await chatClient.connectUser(user, token)
                    // const site_channel = chatClient.channel('messaging', 'TotalSiteChat', {
                    //     image: 'https://picsum.photos/id/381/200',
                    //     name: 'GameNight All-Members-Chatroom',
                    //     members: [user_id]
                    // })

                    // await site_channel.watch()
                    setClient(chatClient)
                    // shouldn't need all this channel specific stuff since have channel list
                    // 1 is for kyndall, 2 for alisha
                    const first_channel = chatClient.channel('messaging', channelId, {
                        // add as many custom fields as you'd like
                        // image: 'https://picsum.photos/200',
                        // instead of name 
                        name: channelName,
                        // members: [user.id]
                        members: [user_id]
                    })
                    // await channel.create()
                    // setChannel(channel)
                    // channel.addMembers(user_id)
                    await first_channel.watch()
                    // setClient(chatClient)
        
                }
                init()
            }
            // return () => { if (client) client.disconnectUser()}
        }
    }, [])

    // if the channel or client hasn't been updated yet show a loading image
    // if (!channel || !client) return <LoadingIndicator />
    if (!client) return <LoadingIndicator />

    return (
        <Chat client = {client} theme = "messaging dark">
        <ChannelList 
        filters ={filters}
        sort = {sort}/>    
        {/* ChannelList will get all the channels so don't need next line */}
            <Channel>
                <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput />
                </Window>
                <Thread />
            </Channel>
        </Chat>
    )
}

export default Chatroom



// How to send a message:
// const message = await channel.sendMessage({
//     text: "Did you already see the trailer? https://www.youtube.com/watch?v=wA38GCX4Tb0",
//   });
  
//   return message;


// 17:00: https://www.youtube.com/watch?v=WjvZL0bnbIE&list=PLQ8qxSPP3G8D-qYKE0TnyyPlZ69HGebmM&index=26&t=8s
// https://dashboard.getstream.io/app/1205628/chat/rolespermissions/roles
// 'name': Channel Member permissions
// 'resources': ['UpdateChannelMembers]-> allows channel members to add members to a channel
// 'name: 'Users can create channels'
// resources: ['UpdateChannelMembers] -> allows users to add themselves and other users to a channel
// resources: ['ReadChannel']-> allows users to read public channels