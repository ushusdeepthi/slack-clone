const socket=io('http://localhost:3000/')
let form=document.getElementById('form');
let user_name=document.getElementById('name');
let message=document.getElementById('message');
let chat_messages= document.getElementById('chat_messages');
form.addEventListener('submit',(e)=>{
e.preventDefault()
if(user_name.value && message.value){
    console.log(user_name.value)
    console.log(message.value)
socket.emit('chat',{
    name:user_name.value,
    message:message.value
})
}
user_name.value='';
message.value='';
})
socket.on('chat',data=>{
let name_user=document.createElement('p');
let message_user=document.createElement('p');
name_user.innerHTML=data.name
message_user.innerHTML=data.message
chat_messages.appendChild(name_user);
chat_messages.appendChild(message_user);
})