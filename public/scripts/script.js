const socket=io('http://localhost:3000/')
console.log(socket)
let form=document.getElementById('form');
let user_name=document.getElementById('name');
let message=document.getElementById('message');
let chat_messages= document.getElementById('chat_messages');
let url_array=document.location.href.split('/')
// console.log(document.location.href)
let id=url_array[url_array.length-1];
console.log(id)
form.addEventListener('submit',(e)=>{
e.preventDefault()
if(user_name.value && message.value){
    console.log(user_name.value)
    console.log(message.value)
socket.emit('chat',{
    name:user_name.value,
    message:message.value,
    id:id
    
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
chat_messages.scrollTop=chat_messages.scrollHeight

})
socket.on('message',(message)=>{
    console.log(message)
})
