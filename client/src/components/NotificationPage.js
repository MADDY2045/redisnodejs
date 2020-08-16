import React, { Component } from 'react'
import axios from 'axios';

let condArray=[]
class NotificationPage extends Component {

    constructor(props){
        super(props);
        this.state={
            name:'',
            description:'',
            activebox:false,
            flowtype:'',
            channel:[],
            category:[],
            recipients:[],
            notificationtitle:'',
            templatebody:[],
            conditionkey:"",
            conditionvalue:"",
            condiditonjadearray:[]
        }
    }

    handleChange=(e)=>{
        e.preventDefault();
        this.setState({
            [e.target.name]:e.target.value
        })

    }
    handleMasterSubmit=()=>{
        console.clear();
        console.log('clicked',this.state);
        axios.post("http://localhost:6070/createevent",{data:this.state}).then(response=>{
            console.log(response.data);
        }).catch(err=>console.log(`error in axios mastersubmit ${err}`))
    }

    handleChannelChange=(evt)=>{
        evt.preventDefault();
        // const values = Array.from(evt.target.selectedOptions, option => option.value);
        const values = [...evt.target.selectedOptions].map(opt => opt.value)
        this.setState({
            channel:values
        })
    }

    handleCategoryChange=(evt)=>{
        evt.preventDefault();
        // const values = Array.from(evt.target.selectedOptions, option => option.value);
        const values = [...evt.target.selectedOptions].map(opt => opt.value)
        this.setState({
            category:values
        })
    }
    handleRecipients=(e)=>{
        e.preventDefault();
        this.setState({
            recipients:e.target.value.split(',')
        })
    }

    handleNotificationTemplate=(e)=>{
        e.preventDefault();
        this.setState({
            templatebody:e.target.value.split('\n')
        })
    }

    handleCondition=()=>{
        const { conditionkey,conditionvalue } = this.state;
        let tempObj={};
        if(conditionkey !=='' && conditionvalue !== ''){
            tempObj[conditionkey]=conditionvalue
            condArray.push(tempObj);
        }
        this.setState({
            condiditonjadearray:condArray
        })

    }

    handleConditionClear=()=>{
        condArray=[]
        this.setState({
            condiditonjadearray:[]
        })
    }
    render() {
        return (
            <div className="main-container card">
                <div className="row">
                    <div id="name-description">
                    <h6>NAME AND DESCRIPTION</h6>
                        <form className="form-inline" id="name-description-form">
                            <input onChange={this.handleChange} type="text" name="name" className="form-control" id="name" placeholder="Name"/>
                            <input onChange={this.handleChange} type="text" name="description" className="form-control" id="description" placeholder="Description"/>
                            <label className="switch">
                            <input onChange={()=>this.setState({ activebox:!this.state.activebox})} type="checkbox" name="activebox"/>
                            <span className="slider round"></span>
                            </label>
                        </form>
                    </div>
                    <div id="notification-details">
                    <h6>NOTIFICATION DETAILS</h6>
                    <form className="form-inline" id="name-description-form">
                            <input
                            onChange={this.handleChange}
                            type="text" name="resource" className="form-control" id="resource" placeholder="Resource"/>
                            <input
                            onChange={this.handleChange}
                            type="text" name="action" className="form-control" id="action" placeholder="Action"/>
                            <div className="input-group" id="recipient-type">
                            <div className="input-group-prepend">
                                <label className="input-group-text">Recipients Type</label>
                            </div>
                            <select onChange={this.handleChange} name="flowtype" className="custom-select" >
                                <option defaultValue>Choose Flowtype</option>
                                <option value="internal">Internal</option>
                                <option value="external">External</option>
                            </select>
                            </div>
                            <div className="channel form-group">
                            <select
                            onChange={this.handleChannelChange}
                            className="form-control"
                            name="channel" id="channel" multiple="multiple">
                                <option defaultValue>Choose Channel</option>
                                <option value="whatsapp">Whatsapp</option>
                                <option value="sms">SMS</option>
                                <option value="email">Email</option>
                                <option value="push">Push</option>
                                <option value="desktop">Desktop</option>
                            </select>
                            </div>
                            <div className="category form-group">
                            <select
                            onChange={this.handleCategoryChange}
                            className="form-control" name="category" id="category" multiple="multiple">
                                <option defaultValue>Choose Category</option>
                                <option value="approval">Approval</option>
                                <option value="info">Info</option>
                                <option value="mention">Mention</option>
                            </select>
                            </div>
                    </form>
                    </div>
                    <div id="recipients-content">
                       <h6>Recipients and Content</h6>
                       <div className="form-group form-inline">
                        <label id="recipients-label">Recipients</label>
                        <textarea
                        onChange={this.handleRecipients}
                        className="form-control" name="recipients" rows="2" id="recipients"></textarea>
                       </div>
                       <div className="notification-title form-inline">
                       <label id="notification-title-label">Notification Title</label>
                       <input
                       onChange={this.handleChange}
                       className="form-control" type="text" name="notificationtitle" id="notification-title-input"/>
                       </div>
                       <div className="form-group form-inline" id="notification-body-div">
                        <label id="notification-body-label">Template body</label>
                        <textarea
                        onChange={this.handleNotificationTemplate}
                        className="form-control" rows="4" name="notificationbody" id="notification-body"></textarea>
                       </div>
                       <button className="btn btn-outline-primary" id="previewbtn">Preview And Test</button>
                    </div>
                    <div id="conditions-delivery">
                        <h6>Conditions For Delivery</h6>
                        <div className="form-group form-inline" id="condition-div">
                            <input
                            onChange={this.handleChange}
                            type="text" name="conditionkey" id="condition-key" placeholder="Condition"/>
                            <input
                            onChange={this.handleChange}
                            type="text" name="conditionvalue" id="condition-value" placeholder="Value"/>
                            <button
                            onClick={this.handleCondition}
                            className="btn btn-outline-success" id="conditionbtn">ADD</button>|
                            <button
                            onClick={this.handleConditionClear}
                            className="btn btn-outline-danger" id="conditionbtn">Clear</button>
                            </div>
                            <div id="list-condition-div">
                            {this.state.condiditonjadearray.length > 0 ?
                                <div className="list-condition">
                                    <ul>
                                        {this.state.condiditonjadearray.map((item,index)=>{
                                            return <li key={index}>{`${Object.keys(item)}<-->${Object.values(item)}`}</li>
                                        })}
                                    </ul>
                                </div>
                                :null}
                            </div>

                    </div>
                    <div id="footer">
                        <button className="btn btn-primary">Close</button>
                        <button onClick={this.handleMasterSubmit} className="btn btn-success">Save</button>
                        <button className="btn btn-outline-info">View Notifications</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default NotificationPage;