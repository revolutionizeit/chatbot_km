const request = require('request');
const config = require('../config');

exports.getContent = (keyword, cb) => {
	let response="";
	request({
		uri: config.PROTOCOL + config.HOST + config.SEARCH_URI,
		qs: {
			start: 0,
			query: keyword
		},
		headers: {
			Authorization: config.AUTH_HEADER + config.AUTH_TOKEN
		}
	}, (error, response, body) => {
		
		//console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
		console.log('Status Code: '+response.statusCode + '.Message: '+response.statusMessage);
		if(!error && response.statusCode === 200){
			let content = JSON.parse(body);
			if(content){				
				let textStr = content.hasOwnProperty('hydra:totalItems') ? `Found ${content['hydra:totalItems']} articles.` :
																'No appropriate FAQ found'
				
				response.textOnly = textStr;
				response.text= {"text": [textStr]};
				let results = content['hydra:member'];
				
				if(results!== null && results !== '' && typeof results !== 'undefined'){
					let listSelectItems = [];
					let cardResp="";

					results.forEach(element => {
						let name = element['hydra:member'][0]['vkm:name'];
						let description = element['hydra:member'][0]['vkm:description'];
						cardResp= {
								"title": name,
								"subtitle": description,
								"imageUri": "http://blog.buildabazaar.com/wp-content/uploads/2018/06/FAQ.gif",
								"buttons": [{
									"text": "More Details",
									"postback": "https://www.hsbc.co.uk/ways-to-bank/online-banking/"
								}]							
						}				
						/*
						let item={
							"info": {
								"key": name,
								"synonyms": [
									keyword
								]
							},
							"title": name,
							"description": description							
						  };

						  if(item!==null && item !=='')
							  listSelectItems.push(item);
						*/	  
					});

					/*
					//list
					if(listSelectItems!==null && listSelectItems !=='' && listSelectItems.length>0){
						console.log("l:"+listSelectItems.length);
						let listSelect={
							"title": "ListSelectTitle",
							"items": listSelectItems
						};
						response.list = listSelect;
					}
					*/

					//card
					response.card=cardResp;
				}
			}
			
			cb(response)
		} else {
			console.error(response.error);
			cb('Something went wrong!');
		}
	})
}

exports.getTags = (tag, cb) => {
	let response="";
	let uriPath="";

	if(tag== null || tag == ''){
		uriPath = config.PROTOCOL + config.HOST + config.TAG_URI;
	}else if (tag=='Business Unit'|| tag=='business unit' ){
		uriPath = config.PROTOCOL + config.HOST + config.TAG_URI + config.TAG_KBASE_URI;
	}else if (tag=='Group'){
		uriPath = config.PROTOCOL + config.HOST + config.TAG_URI + config.TAG_PRODUCT_URI;
	}else if (tag=='Content Type'){
		uriPath = config.PROTOCOL + config.HOST + config.TAG_URI + config.TAG_REGION_URI;
	}else if (tag=='Browse Topic'){
		uriPath = config.PROTOCOL + config.HOST + config.TAG_URI + config.TAG_TOPIC_URI;
	}else{
		uriPath = config.PROTOCOL + config.HOST + config.TAG_URI;
	}
	//console.log("u:"+uriPath);

	request({
		uri: uriPath,
		qs: {
			start: 0,
			size: 100
		},
		headers: {
			Authorization: config.AUTH_HEADER + config.AUTH_TOKEN
		}
	}, (error, response, body) => {
		console.log('Status Code: '+response.statusCode + '.Message: '+response.statusMessage);
		if(!error && response.statusCode === 200){
			let content = JSON.parse(body);
			if(content){				
				let results = content['hydra:member'];
				
				if(results!== null && results !== '' && results.length>0){
					let quickReplies = [];
					results.forEach(element => {
						let name = element['vkm:name'];
						//console.log('Tag Name: '+name);			
						  quickReplies.push(name);							  
					});
					
					//quickReplies
					if(quickReplies!==null && quickReplies !=='' && quickReplies.length>0){
						console.log("l:"+quickReplies.length);
						let quickRepliesJson={
							"title": "List of available tags",
							"quickReplies": quickReplies
						};
						response.quickReplies = quickRepliesJson;
					}
				}
			}
			
			cb(response)
		} else {
			console.error(response.error);
			cb('Something went wrong!');
		}
	})
}

exports.searchByTopic = (topic, cb) => {
	let response="";
	let topicId="";
	let imageUri="";
	let postbackUri="";

	if (topic=='Internet Banking'){
		topicId = "topic_internet";
		imageUri= "https://finance.advids.co/wp-content/uploads//2017/09/digibank.gif";
		postbackUri = "https://www.hsbc.co.uk/ways-to-bank/online-banking/";
	}else if (topic=='Mobile Banking'){
		topicId = "topic_mobile";
		imageUri= "https://media.giphy.com/media/e5K46uPhHTSDu/giphy.gif";
		postbackUri = "https://www.hsbc.co.uk/ways-to-bank/mobile/";
	}else if (topic=='Deposit Accounts'){
		topicId = "topic_deposit";
		imageUri= "http://gifimage.net/wp-content/uploads/2018/05/save-animated-gif-6.gif";
		postbackUri = "https://www.hsbc.co.uk/current-accounts/";
	}else if (topic=='Debit Cards'){
		topicId = "topic_debit";
		imageUri= "http://www.dpmitsolutions.com/img/card.gif";
		postbackUri = "https://www.hsbc.co.uk/help/card-support/";
	}else if (topic=='Credit Cards'){
		topicId = "topic_credit";
		imageUri= "https://cdn.dribbble.com/users/43762/screenshots/1398115/ccu-superbowl---charge.gif";
		postbackUri = "https://www.hsbc.co.uk/credit-cards/";
	}else if (topic=='Select Credit'){
		topicId = "topic_select";
		imageUri= "hhttps://media.giphy.com/media/mOa5DYpmj4MvK/giphy.gif";
		postbackUri = "https://www.us.hsbc.com/select-credit/";
	}else if (topic=='Loans'){
		topicId = "topic_loans";
		imageUri= "https://www.thestatebank.com/wp-content/uploads/2016/03/SBALoans.gif";
		postbackUri = "https://www.hsbc.co.uk/1/2/tools-and-guides/loans/things-to-check-before-you-apply-for-a-loan";
	}else if (topic=='Express Delivery'){
		topicId = "topic_delivery";
		imageUri="https://cdn.dribbble.com/users/31826/screenshots/2506901/moto.gif";
		postbackUri = "https://www.hsbc.co.uk/1/2/tools-and-guides/loans/things-to-check-before-you-apply-for-a-loan";
	}
	/*else{
		topicId = "topic_credit";
		imageUri= "https://www.thestatebank.com/wp-content/uploads/2016/03/SBALoans.gif";
		postbackUri = "https://www.hsbc.co.uk/ways-to-bank/online-banking/";
	}*/
	console.log("t:"+topicId);

	request({
		uri: config.PROTOCOL + config.HOST + config.SEARCH_URI,
		qs: {
			tag: topicId
		},
		headers: {
			Authorization: config.AUTH_HEADER + config.AUTH_TOKEN
		}
	}, (error, response, body) => {
		console.log('Status Code: '+response.statusCode + '.Message: '+response.statusMessage);
		if(!error && response.statusCode === 200){
			let content = JSON.parse(body);
			if(content){				
				let textStr = content.hasOwnProperty('hydra:totalItems') ? `Found ${content['hydra:totalItems']} articles.` :
																'No appropriate FAQ found'
				
				response.textOnly = textStr;
				response.text= {"text": [textStr]};
				console.log('TotalItems:'+textStr);
				let results = content['hydra:member'];
				console.log('results: %j',results);
				
				if(results!== null && results !== '' && typeof results !== 'undefined'){
					let cardResp="";

					results.forEach(element => {
						let name = element['hydra:member'][0]['vkm:name'];
						let description = element['hydra:member'][0]['vkm:description'];

						cardResp= {
								"title": name,
								"subtitle": description,
								"imageUri": imageUri,
								"buttons": [{
									"text": "More Details",
									"postback": postbackUri
								}]							
						}					  
					});

					//card
					response.card=cardResp;
				}
			}
			
			cb(response)
		} else {
			console.error(response.error);
			cb('Something went wrong!');
		}
	})
}
