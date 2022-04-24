import React from 'react';
import api from './api.jsx';

/**
 * Display each individual message text
 * Handles text formatting
 * */
class MessageDisplay extends React.Component {
	formatDateString(val) {
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const dateObj = new Date(val);
		const month = months[dateObj.getMonth()];
		const date = ('0' + dateObj.getDate()).slice(-2);
		const hour = ('0' + dateObj.getHours()).slice(-2);
		const minutes = ('0' + dateObj.getMinutes()).slice(-2);

		const formattedDate = month + " " + date + ", " + hour + ":" + minutes;
		return formattedDate;
	}

	render() {
		const createdAt = this.formatDateString(this.props.data.createdAt);
		const text = this.props.data.text;

		return (
			<div className="message-container">
				{this.props.data.isDeleted ? (
					<div className="deleted-message"> Deleted message </div>
				) : (
					<div>
						<div className="message-timestamp">{createdAt}</div> {text}
					</div>
				)}
			</div>
		)
	}
}

/**
 * Shows the list of all sent messages
 * Handles the delete message functionality
 * */
class MessageBox extends React.Component {
	constructor(props) {
		super(props);
		this.messagesEnd = null;
		this.isDeleting = false;
	}

	componentDidMount() {
		this.scrollToBottom();
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}

	scrollToBottom() {
		if (!this.isDeleting) { this.messagesEnd.scrollIntoView(); }
		this.isDeleting = false;
	}

	deleteMessage(data) {
		this.isDeleting = true;
		data.isDeleted = true;
		api.messages.updateMessage(data)
			.then(res => {
				this.props.updateMessages();
			})
			.catch(err => {
				console.log(err);
			});
	}

	render() {
		return (
			<div className="message-box">
				<table>
					<tbody>
						{this.props.data.map(item => (
							<tr key={item.id}>
								<td>
									<MessageDisplay data={item} />
								</td>
								<td>
									<span className={`message-buttons ${item.isDeleted ? "deleted-message-button" : ""}`} onClick={event => this.deleteMessage(item)}>Delete</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<div ref={(el) => { this.messagesEnd = el; }}> </div>
			</div>
		);
	}
}

/**
 * Comment box at the bottom to accept user input
 * */
class CommentBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			input: ""
		};
	}

	handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			const data = {
				text: this.state.input
			}
			
			api.messages.createMessage(data)
				.then(res => {
					this.props.updateMessages();
					this.setState({
						input: ""
					});
				})
				.catch(err => {
					console.log(err);
				});
		}
	}

	updateInput(event) {
		const val = event.target.value;
		this.setState({
			input: val
		})
	}

	render() {
		return (
			<div className="comment-box">
				<textarea name="comment" placeholder="Press enter to send a message to yourself" value={this.state.input} onChange={event => this.updateInput(event)} onKeyDown={this.handleKeyDown} />
			</div>
		);
	}
}

/**
 * Display the heading title
 * */
class Heading extends React.Component {
	render() {
		return (
			<div className="heading">
				<h1>Talk to Yourself</h1>
			</div>
		);
    }
}

/**
 * Main chatroom container
 * */
class Chatroom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: []
		};
	}

	componentDidMount() {
		this.updateMessages();
	}

	updateMessages() {
		api.messages.getAllMessages()
			.then(res => {
				res.data.sort(function (a, b) {
					return new Date(a.createdAt) - new Date(b.createdAt);
				});
				this.setState({
					data: res.data
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	render() {
		return (
			<div className="chatroom">
				<Heading />
				<MessageBox data={this.state.data} updateMessages={this.updateMessages.bind(this)} />
				<CommentBox updateMessages={this.updateMessages.bind(this)} />
			</div>
		);
	}
}

export default function App() {
	return (<Chatroom />);
}