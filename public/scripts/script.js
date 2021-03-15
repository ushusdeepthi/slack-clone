const socket=io('http://localhost:3000/')
console.log(socket)
let form=document.getElementById('form');
let slack_chat=document.getElementById('slack-chat')
let container=document.getElementById('container')
let user_name=document.getElementById('name');
let channel=document.getElementById('channel')
let message=document.getElementById('message');
let chat_messages= document.getElementById('chat_messages');
let url_array=document.location.href.split('/')
let online_users=document.getElementById("online_users")
// console.log(document.location.href)
let id=url_array[url_array.length-1];
// console.log(id)

//------------------------------------old trial-----------------------------

socket.emit('join',{
    name: user_name.value,
    id:id,
    room:channel.value

})
// socket.on('join',data=>{
//     let side_bar=document.getElementById('side_bar')
//     let online_user=document.createElement('p')
//     online_user.innerHTML=data.name
//     side_bar.appendChild(online_user)
// })
// ----------ehen user_list in channel ejs was an id-----
// user_list.addEventListener('click',(e)=>{
//     e.preventDefault();
//     console.log('hello')
//     reciever_name=e.target.innerHTML
//     console.log(target.innerHTML)
//     console.log(user_name.value)--------------------------
// ----------when i changed it to a class----------
let user_list=document.getElementsByClassName("user_list");
     for(let i=0;i<user_list.length;i++){
            user_list[i].addEventListener("click",(e)=>{
                e.preventDefault();
                receiver_name=e.target.innerHTML.trim()
                console.log(receiver_name)
                console.log(user_name.value)

//     slack_chat.remove();
//     // let private_chat_form=document.createElement('form')
//     let input=document.createElement('input')
//     input.type="text"
//     let button=document.createElement('button')
//     container.appendChild(input)
//     container.appendChild(button)
//     button.addEventListener('click',e=>{
//         e.preventDefault()
    socket.emit('private_chat',{
      receiver: receiver_name,
    sender:user_name.value,
    
    // msg:input.value
    
    })
// })
    })
}
// socket.on('private_chat',data=>{
//     let msg=document.createElement('p')
//     msg.innerHTML=data.msg
//     container.appendChild(msg)
    
// }
// )

form.addEventListener('submit',(e)=>{
e.preventDefault()
    if(/*user_name.value &&*/ message.value){
        // console.log(user_name.value)
        console.log(message.value)
        socket.emit('chat',{
        name:user_name.value,
        message:message.value,
        id:id,
        room:channel.value
        })
    }
// user_name.value='';
message.value='';
})
socket.on('chat',data=>{
let name_user=document.createElement('p');
let message_user=document.createElement('p');
name_user.innerHTML=data.name
message_user.innerHTML=data.message
chat_messages.appendChild(name_user);
chat_messages.appendChild(message_user);
chat_messages.scrollTop=chat_messages.scrollHeight

})
socket.on('message',(message)=>{
    console.log(message)
})
socket.on('new_private_channel',url=>{
    // console.log(new_private_channel)
    window.location.href=`/channels/${url}`
})
socket.on('onlineusers',users=>{
    console.log(users)
    // let onlineusers=Object.entries(users)
    for(user of users){

        let userOnline=document.createElement('p')
        userOnline.innerHTML=user.name
        online_users.appendChild(userOnline)
    }
})

