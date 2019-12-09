import React, { Component } from 'react';
import ChatMsg from './msg'
import './chat.css'
import userStore from '../../redux/userStore'
import io from 'socket.io-client';


const socket = io('http://localhost:3002')


class ChatBox extends Component {
    
    constructor(props){
        let messages = [];
        super(props);
        this.state = {
            chatMsgs: messages,
            userMessage: '',
            income: 0
        }
       this.chat = 'none';
    }

    //SW - this is where the new message component get created, you will be able to update the username and msg property 
    //to alter the chatMsg component
    handleSubmit = (event) => {
        event.preventDefault();
        socket.emit('income-msg',{msg: this.state.userMessage, user: userStore.getState().username})
    }
    
    //SW - this function updated the userMessage when the form get updated 
    handleInputChange = (event) => {
        event.preventDefault();
        this.setState({
            userMessage: event.target.value
        });
        //console.log(this.state.userMessage)
    }

    componentDidMount() {
        this.chat = document.getElementById('chat');
        socket.emit('join','lobby')
    }

    componentDidUpdate() {
        if(this.chat.scrollHeight !== null)
        {
            this.chat.scrollTop = this.chat.scrollHeight;
        }
        
        
    }
    componentWillMount(){
        socket.on('chat',({incomeMsg, user})=>{

            this.state.chatMsgs.push(<ChatMsg username={user.charAt(0).toUpperCase() + user.slice(1)} msg={incomeMsg}></ChatMsg>)
            
            this.setState({
                userMessage: ''
            });
            
            
        })
    }
    

    render() { 
       
        
        

        return (
        <div className='wrapper'>
            <div className='content'>
                <div id='chat-container'>
                    <div id='chat'>
                        
                        {this.state.chatMsgs}
                    </div>
                    <form id='chatForm' onSubmit={this.handleSubmit} autoComplete='off'>
                        <input type='text' className='chat-input'placeholder='message' message='userMessage' value={this.state.userMessage} onChange={this.handleInputChange}></input>
                    </form>
                    {this.state.chatMsgs}
                </div>
                
            </div>  
        </div>
        
        );
    }
}
 
export default ChatBox;