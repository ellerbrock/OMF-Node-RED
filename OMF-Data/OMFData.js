/*
Copyright 2017 Derek Endres - OSIsoft, LLC
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
<http://www.apache.org/licenses/LICENSE-2.0>
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
module.exports = function(RED) {
    "use strict";
	
    var mustache = require("mustache");
	
	 function NodeContext(msg, nodeContext, parent, escapeStrings) {
        this.msgContext = new mustache.Context(msg,parent);
        this.nodeContext = nodeContext;
        this.escapeStrings = escapeStrings;
    }
	

    NodeContext.prototype = new mustache.Context();

    NodeContext.prototype.lookup = function (name) {
        // try message first:
        try {
            var value = this.msgContext.lookup(name);
            if (value !== undefined) {
                if (this.escapeStrings && typeof value === "string") {
                    value = value.replace(/\\/g, "\\\\");
                    value = value.replace(/\n/g, "\\n");
                    value = value.replace(/\t/g, "\\t");
                    value = value.replace(/\r/g, "\\r");
                    value = value.replace(/\f/g, "\\f");
                    value = value.replace(/[\b]/g, "\\b");
                }
                return value;
            }

            // try node context:
            var dot = name.indexOf(".");
            if (dot > 0) {
                var contextName = name.substr(0, dot);
                var variableName = name.substr(dot + 1);

                if (contextName === "flow" && this.nodeContext.flow) {
                    return this.nodeContext.flow.get(variableName);
                }
                else if (contextName === "global" && this.nodeContext.global) {
                    return this.nodeContext.global.get(variableName);
                }
            }
        }catch(err) {
            throw err;
        }
    }

    NodeContext.prototype.push = function push (view) {
        return new NodeContext(view, this.nodeContext,this.msgContext);
    };
	
	
    function LowerCaseNode(config) {
        RED.nodes.createNode(this,config);
				
		this.urlbridge = RED.nodes.getNode(config.urlconfig);
		this.containerconfig = RED.nodes.getNode(config.containerconfig);
		this.typeconfig = RED.nodes.getNode(config.typeconfig);
		this.headersconfig = RED.nodes.getNode(config.headersconfig);
		
        var node = this;
		
		
        node.on('input', function(msg) {			
			var msg1 = msg;	
			
			if(this.urlbridge)	 
				 msg1.url = mustache.render(this.urlbridge.url, new NodeContext(msg, node.context(), null, true));
			 
			if(this.headersconfig) {
				msg1.headers = {};
				var props = [ "producertoken", "messagetype", "messageformat", "omfversion","action","compression"];
				for(var i = 0; i < props.length; i++){
					var prop = props[i];
					var val = this.headersconfig[prop];
					if(val)
						msg1.headers[prop] = mustache.render(val, new NodeContext(msg, node.context(), null, true));
				}
				msg1.headers.messagetype = "data";
			}
			var typeid = "";
			var containerid = "";
			var version = "";
			var values = "";
			
			if(config.valuearray){
		//		node.warn(config.valuearray);
				values = mustache.render(config.valuearray, new NodeContext(msg, node.context(), null, true));		
	//			node.warn(values);		
				
				if(typeof values === 'string' || values instanceof String){
					values = JSON.parse(values);
				}				
		//		node.warn(values);		
			}
			else{
				
				values = [];
				var timesToloop=0;
				
		//		node.warn("zeeb");
				for(var prop in config.properties){
					var t = config.properties[prop].value;
					//node.warn(t);
					
						var i1 = t.indexOf('{~');
						var subs =""
						if(i1 >0){
							var i2= t.indexOf('~}');
							var subs=t.substring(i1+2,i2);
							t = t.replace('{~' + subs +'~}',"");
						}
					//node.warn(t);
					
					if(typeof t === 'string' || t instanceof String){
						t = mustache.render(t, new NodeContext(msg, node.context(), null, true));	
					}					
					//node.warn(t);
					if(typeof t === 'string' || t instanceof String){
		//				node.warn(t);		
						try{
							t = JSON.parse(t);
						}
						catch (ex){
							timesToloop = 1;
							break;
						}
					}
					
					if(subs){
					}
				//	node.warn(t);
					timesToloop = t.length;
				//	node.warn(timesToloop);
					break;
				}	
				
				if(timesToloop == undefined)
					timesToloop = 1;
				
				
		//		node.warn("zeeb2");
			//	node.warn(timesToloop);
				for(var i = 0; i < timesToloop; i++){
					var value = {};
					for(var prop in config.properties){
		//				node.warn("hi");
						
						var t = config.properties[prop].value;
		//				node.warn(t);
						
						var i1 = t.indexOf('{~');
						var subs =""
						if(i1 >0){
							var i2= t.indexOf('~}');
							var subs=t.substring(i1+2,i2);
							t = t.replace('{~' + subs +'~}',"");
						}
		//				node.warn(t);
						
						var temp2 = mustache.render(t, new NodeContext(msg, node.context(), null, true));
						
		//				node.warn(temp2);
						
						
						if(typeof temp2 === 'string' || temp2 instanceof String){
							temp2 = mustache.render(temp2, new NodeContext(msg, node.context(), null, true));	
						}					
		//				node.warn(temp2);
						try{
							if(typeof temp2 === 'string' || temp2 instanceof String){
			//					node.warn(temp2);
								var temp3  = JSON.parse(temp2);
				//				node.warn(temp2);
				//				node.warn(typeof temp2);
				//				node.warn(temp2 instanceof Date);
								var temp2  = temp3;
								
							}
						}
						catch(e){
		//				node.warn("caught");
						}
		//				node.warn(temp2);
						
						if(subs)
							value[prop] = (temp2[i])[subs];
						else if (typeof temp2 === 'string' || temp2 instanceof String)
							value[prop] = temp2;
						else if (typeof temp2 === 'number' || temp2 instanceof Number)
							value[prop] = temp2;						
						else
							value[prop] = temp2[i];
					}		
					values.push(value);
				}			
				
			}
				
				
			
			if(this.containerconfig){
				containerid = mustache.render(this.containerconfig.containerid ,new NodeContext(msg, node.context(), null, true));
			}
			else if(this.typeconfig){
				version = mustache.render(this.typeconfig.version ,new NodeContext(msg, node.context(), null, true));
				typeid = mustache.render(this.typeconfig.typeid ,new NodeContext(msg, node.context(), null, true));
			}		
			else {
				containerid = mustache.render(config.containerid ,new NodeContext(msg, node.context(), null, true));
				version = mustache.render(config.typeversion ,new NodeContext(msg, node.context(), null, true));
				typeid = mustache.render(config.typeid ,new NodeContext(msg, node.context(), null, true));
				
			}
			
			var body = {"values": values};
			if(containerid){
				body.containerid =containerid;
			}
			else{
				body.typeid =typeid;
				body.typeversion =version;			
			}
				
			
			//msg1.payload = [];
			if(msg.payload[0] == undefined){
					msg1.payload= [];
			}
			else{
				if(msg.payload[0].values != undefined)
					msg1.payload= msg.payload;
				else
					msg1.payload= [];
			}
			
			
			msg1.payload.push(body);
			
            node.send(msg1);
			
		});
		
		
    }
    RED.nodes.registerType("osisoft-omf-data",LowerCaseNode);
}