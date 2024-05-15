import Conv from '../models/conversation.model.js' ;
import Msg from '../models/message.model.js' ;

export const sendMessage = async (req,res) => {
    // console.log("message sent",req.params.theUserId);
    
    try {
        const {message} = req.body ;
        const {idinlink:receiverId} = req.params;// from the link
        const senderId = req.user._id ;

        let conversation = await Conv.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) { // First conversation between them.
			conversation = await Conv.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Msg({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		//SOCKET IO FUNCTIONALITY WILL BE ADDED HERE
		
		//await conversation.save() ;
		//await newMessage.save() ;
		
		//this will run in parallel
		await Promise.all([conversation.save(),newMessage.save()]) ;
		
		//res.status(201).json({message: "Message sent successfully"}) ;
		res.status(201).json(newMessage) ;

    } catch (error) {
        console.log("Error in sendMessage controller:",error.message)
        res.status(500).json({error:"Interval server error"}) ;
        
    }
};

export const getMessage = async (req,res) => {
	try {
		const {id:usertochat} = req.params ;
		const senderID = req.user._id ; // 

		const conversation = await Conv.findOne({
			participants: {$all : [senderID,usertochat]},
		}).populate('messages') ;//NOT REFERENCE BUT ACTUAL MESSAGES

		//In the conversation model, 'messages' array contains all the IDs of the message between the sender and receiver . But to get all the message contain in the 'messages' array we use mongoose method called      " populate " . It will return array of objects and put each message in these objects .

		if(!conversation) return res.status(200).json([]) ;//return empty array if there is no conversation.

		const Messages = conversation.messages ;

		res.status(200).json(Messages) ;

	} catch (error) {
		console.log("Error in getMessage controller:",error.message)
        res.status(500).json({error:"Interval server error"}) ;
	}
}