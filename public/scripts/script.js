const socket=io('http://localhost:3000/')
// console.log(socket)
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
let user_list=document.getElementsByClassName("user_list");
     for(let i=0;i<user_list.length;i++){
            user_list[i].addEventListener("click",(e)=>{
                e.preventDefault();
                receiver_name=e.target.innerHTML.trim()
                console.log(receiver_name)
                console.log(user_name.value)

    socket.emit('private_chat',{
      receiver: receiver_name,
    sender:user_name.value,
    
    })

    })
}

form.addEventListener('submit',(e)=>{
e.preventDefault()
    if( message.value){
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
    let div=document.createElement('div')
    let name_user=document.createElement('p');
    name_user.classList.add('user')
    let message_user=document.createElement('p');
    message_user.classList.add('message')
    name_user.innerHTML=data.name
    name_user.innerHTML+=`<span>${new Date().toLocaleTimeString()}</span>`
    message_user.innerHTML=data.message
    div.appendChild(name_user);
    div.appendChild(message_user);
    chat_messages.appendChild(div);
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
    online_users.querySelectorAll('*').forEach(n => n.remove());
    for(user of users){

        let userOnline=document.createElement('p')
        userOnline.innerHTML=user.name
        online_users.appendChild(userOnline)
    }
})

