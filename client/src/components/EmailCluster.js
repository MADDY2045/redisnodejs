import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
class EmailCluster extends Component {
    constructor(props){
        super(props);
        this.state={
            email:'',
            subject:'',
            message:''
        }
    }

    handleChange=(e)=>{
        e.preventDefault();
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleSubmit=()=>{
        let { email,subject,message } = this.state;
        console.clear();
        console.log(this.state);
        axios.post(`http://localhost:6070/${email}/${subject}/${message}`).then(response=>{
            console.log(response.data);
        })
        .catch(err=>console.log(`error in axios post of email`))
    }
    render() {
        return (
            <div className="container card" id="cluster-email">
                <div className="row">
                    <form className="form-group">
                    <div className="input-group" id="email-select-div">
                    <div className="input-group-prepend">
                        <label className="input-group-text">Email</label>
                    </div>
                    <select
                    onChange={this.handleChange}
                    name="email" className="custom-select" id="email-select">
                        <option defaultValue>Choose...</option>
                        <option value="madhavan@growsmartsmb.com">Madhavan Gmail</option>
                        <option value="madhavaneee@yahoo.co.in">Madhavan Yahoo</option>
                        <option value="dummy@dummy">Other</option>
                    </select>
                    </div>
                    <div className="input-group" id="subject-select-div">
                    <div className="input-group-prepend">
                        <label className="input-group-text">Subject</label>
                    </div>
                    <select
                     onChange={this.handleChange}
                    name="subject" className="custom-select" id="subject-select">
                        <option defaultValue>Choose...</option>
                        <option value="Cloud Telephony">Cloud Telephony</option>
                        <option value="Whatsapp Api">Whatsapp Api</option>
                        <option value="Twilio integration">Twilio integration</option>
                    </select>
                    </div>
                    <div className="input-group" id="message-select-div">
                    <div className="input-group-prepend">
                        <label className="input-group-text">Message</label>
                    </div>
                    <select
                     onChange={this.handleChange}
                    name="message" className="custom-select" id="message-select">
                        <option defaultValue>Choose...</option>
                        <option value="Hello, We would like to know the pricing for cloud Telephony">cloud Telephony</option>
                        <option value="Hello, We would like to know the pricing for whatsapp api">Whatsapp Api</option>
                        <option value="Hello, We would like to know the pricing for Twilio Integration">Twilio integration</option>
                    </select>
                    </div>
                    </form>
                    <button
                    id="btn-email"
                    onClick={this.handleSubmit}
                    className="btn btn-outline-dark">Send Email</button>
                </div>
            </div>
        );
    }
}

export default EmailCluster;
